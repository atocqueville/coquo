import { PrismaClient } from '@prisma/client';
import { aubergineRotie, potimarron } from './mocks/recipes';

const prisma = new PrismaClient();

async function main() {
    const alice = await prisma.user.upsert({
        where: { email: 'alice@prisma.io' },
        update: {},
        create: {
            email: 'alice@prisma.io',
            password:
                '$2a$10$JXMsrCj7l89oxq7xeWEHv.9Q0dy2NBrav9WyvccKdL.bYV6a6pFbm',
            name: 'Alice',
            recipes: {
                create: [
                    aubergineRotie,
                    potimarron,
                    aubergineRotie,
                    potimarron,
                ],
            },
        },
    });
    const alex = await prisma.user.upsert({
        where: { email: 'alex@prisma.io' },
        update: {},
        create: {
            email: 'alex@prisma.io',
            name: 'Alex',
            password:
                '$2a$06$PIMy52YusNVHXV.2UJfjquWu.LhgEWobLhxv5xn3JhS48oWz9fYSS',
            recipes: {
                create: [
                    aubergineRotie,
                    potimarron,
                    potimarron,
                    potimarron,
                    aubergineRotie,
                    potimarron,
                    potimarron,
                    potimarron,
                ],
            },
        },
    });
    console.log({ alice, alex });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
