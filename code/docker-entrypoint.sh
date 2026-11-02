#!/bin/sh
set -eu

if [ -n "${DATABASE_URL:-}" ]; then
  node /opt/prisma/node_modules/prisma/build/index.js migrate deploy --schema=/app/prisma/schema.prisma
fi

HOSTNAME=0.0.0.0 exec node server.js
