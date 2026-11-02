#!/bin/sh
set -eu

if [ -n "${DATABASE_URL:-}" ]; then
  prisma() {
    node /opt/prisma/node_modules/prisma/build/index.js "$@" --schema=/app/prisma/schema.prisma
  }

  if ! log=$(prisma migrate deploy 2>&1); then
    printf '%s\n' "$log" >&2
    # The first deploy can record init as failed when the database user cannot
    # create the public schema. Postgres rolls the SQL back, so retrying is safe.
    if printf '%s\n' "$log" | grep -q "P3009" && printf '%s\n' "$log" | grep -q "20261102120000_init"; then
      prisma migrate resolve --rolled-back 20261102120000_init
      prisma migrate deploy
    else
      exit 1
    fi
  else
    printf '%s\n' "$log"
  fi
fi

HOSTNAME=0.0.0.0 exec node server.js
