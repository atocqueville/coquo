import { PrismaClient } from '../../prisma/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

// Re-export types for client components (browser-safe)
export type * from '../../prisma/generated/prisma/browser';

const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL ?? '',
});

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
