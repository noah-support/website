import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function databaseUrl() {
  return process.env.DATABASE_URL?.trim() || "";
}

export function getPrisma() {
  if (!databaseUrl()) return null;
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}
