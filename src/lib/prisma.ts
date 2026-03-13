import { PrismaClient } from '../../prisma/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PRISMA_DATABASE_URL } from '../../prisma/prisma.constants';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? PRISMA_DATABASE_URL,
});
export const prisma =
    globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
export type { Prisma, Tag, User, Recipe } from '../../prisma/generated/prisma/client';
