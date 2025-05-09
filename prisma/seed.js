const { PrismaClient } = require('@prisma/client');
const { aubergineRotie, potimarron } = require('./mocks/recipes.js');

const prisma = new PrismaClient();

async function main() {
    await prisma.tag.createMany({
        data: [
            { name: 'vegetarian' },
            { name: 'vegan' },
            { name: 'meat' },
            { name: 'fish' },
            { name: 'gluten-free' },
            { name: 'dairy-free' },
            { name: 'quick' },
            { name: 'summer' },
            { name: 'winter' },
            { name: 'autumn' },
            { name: 'spring' },
            { name: 'dessert' },
            { name: 'lunch' },
            { name: 'dinner' },
            { name: 'spicy' },
        ],
    });

    await prisma.user.upsert({
        where: { email: 'alice@prisma.io' },
        update: {},
        create: {
            role: 'USER',
            email: 'alice@prisma.io',
            password:
                '$2a$06$PIMy52YusNVHXV.2UJfjquWu.LhgEWobLhxv5xn3JhS48oWz9fYSS',
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

    await prisma.user.upsert({
        where: { email: 'alex@prisma.io' },
        update: {},
        create: {
            role: 'ADMIN',
            email: 'alex@prisma.io',
            emailVerified: new Date(),
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
            starredRecipes: {
                connect: [
                    {
                        id: 1,
                    },
                    {
                        id: 4,
                    },
                    {
                        id: 5,
                    },
                ],
            },
        },
    });
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
