import { defineConfig } from 'prisma/config';

// Load dotenv only in development (not available in production Docker image)
try {
    const { config } = await import('dotenv');
    config({ path: '.env.local' });
    config({ path: '.env' });
} catch {
    // dotenv not available, use process.env directly (production)
}

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
        seed: 'tsx prisma/seed.ts',
    },
    datasource: {
        url: process.env.DATABASE_URL,
    },
});
