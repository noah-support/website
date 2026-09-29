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
#   SENDGRID_API_KEY
#   CONTACT_TO_EMAIL
#   RECAPTCHA_SECRET_KEY
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

RUN npm run build

FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ARG WORDPRESS_URL
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    WORDPRESS_URL=$WORDPRESS_URL

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000

# Force the bind address. Container platforms set HOSTNAME to the pod name,
# and the Next.js standalone server would otherwise listen only on that name.
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 exec node server.js"]
