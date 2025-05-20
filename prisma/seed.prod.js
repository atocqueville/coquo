const { PrismaClient } = require('@prisma/client');
const { tags } = require('./mocks/tags.js');

const prisma = new PrismaClient();

async function main() {
    // Check if tags already exist
    const existingTags = await prisma.tag.findMany();

    if (existingTags.length === 0) {
        await prisma.tag.createMany({
            data: tags.map((tag) => ({
                name: tag.name,
                color: tag.color,
                type: 'system',
            })),
        });
        console.log('[PRISMA] Seeded tags.');
    } else {
        console.log('[PRISMA] Tags already seeded.');
    }
}

main()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
