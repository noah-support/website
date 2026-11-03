# syntax=docker/dockerfile:1
#
# Production image for the Noah site. Build context is the repository root.
# The server listens on port 3000.
#
# Pass these as build arguments (they are inlined into the Next.js build):
#   NEXT_PUBLIC_SITE_URL
#   NEXT_PUBLIC_RECAPTCHA_SITE_KEY
#   WORDPRESS_URL
#
# Inject these at runtime only. Do not pass them as build arguments:
#   RESEND_API_KEY
#   CONTACT_TO_EMAIL
#   RECAPTCHA_SECRET_KEY
#   N8N_FORM_WEBHOOK_URL (required unless DISABLE_CAPTURES=true)
#   DISABLE_CAPTURES (optional, default false; true skips the n8n lead capture and reCAPTCHA)
#   DATABASE_URL (Postgres; migrations run on start when this is set)
#   S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET
#   ADMIN_PASSWORD, ADMIN_SESSION_SECRET
#   AI_API_KEY (optional OpenRouter key; defaults to Claude Sonnet 5.5)
#   AI_BASE_URL (optional), AI_MODEL (optional)
# WORDPRESS_URL is also read at runtime for blog and job pages.

ARG NODE_VERSION=24-bookworm-slim

FROM node:${NODE_VERSION} AS deps
WORKDIR /app

COPY code/package.json code/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

FROM node:${NODE_VERSION} AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY code/ ./

ARG NEXT_PUBLIC_SITE_URL=https://www.noah.support
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG WORDPRESS_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY \
    WORDPRESS_URL=$WORDPRESS_URL \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# prisma generate reads DATABASE_URL from the schema. It does not connect.
RUN DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build" npx prisma generate
RUN npm run build

FROM node:${NODE_VERSION} AS migrator
WORKDIR /opt/prisma
RUN npm init -y >/dev/null \
    && npm install prisma@6.19.3 --no-audit --no-fund

FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ARG WORDPRESS_URL
# jemalloc: sharp (Next image optimization) fragments glibc malloc, so resident
# memory only grows. sharp recommends jemalloc on glibc Linux.
# max-old-space-size: V8 collects garbage before growing the heap toward the container limit.
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    WORDPRESS_URL=$WORDPRESS_URL \
    NODE_OPTIONS=--max-old-space-size=384

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=node:node /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=migrator --chown=node:node /opt/prisma /opt/prisma
COPY --chown=node:node code/docker-entrypoint.sh /entrypoint.sh
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl libjemalloc2 \
    && ln -s "$(find /usr/lib -name libjemalloc.so.2 | head -n 1)" /usr/lib/libjemalloc.so.2 \
    && rm -rf /var/lib/apt/lists/* \
    && chmod 755 /entrypoint.sh

# Set after the install so apt does not try to preload a library that is not there yet.
ENV LD_PRELOAD=/usr/lib/libjemalloc.so.2

USER node
EXPOSE 3000

# Force the bind address. Container platforms set HOSTNAME to the pod name,
# and the Next.js standalone server would otherwise listen only on that name.
# Migrations run only when DATABASE_URL is present.
ENTRYPOINT ["/entrypoint.sh"]
