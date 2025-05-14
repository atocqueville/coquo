const { PrismaClient } = require('@prisma/client');
const { tags } = require('./mocks/tags.js');
const { aubergineRotie, potimarron } = require('./mocks/recipes.js');
const prisma = new PrismaClient();

/**
 * Returns a random number of tags (between min and max inclusive)
 */
function getRandomTags(tagsList, min = 1, max = 3) {
    // Create a copy of the tags array to avoid modifying the original
    const tagsCopy = [...tagsList];
    // Shuffle the tags array
    for (let i = tagsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tagsCopy[i], tagsCopy[j]] = [tagsCopy[j], tagsCopy[i]];
    }
    // Get a random number between min and max
    const numTags = Math.floor(Math.random() * (max - min + 1)) + min;
    // Return the first numTags elements
    return tagsCopy.slice(0, numTags).map((tag) => ({ name: tag }));
}

function getRandomRecipes(recipeTemplates, minCount, maxCount) {
    const count =
        Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    const recipes = [];

    for (let i = 0; i < count; i++) {
        const template =
            recipeTemplates[Math.floor(Math.random() * recipeTemplates.length)];
        recipes.push({
            ...template,
            tags: { connect: getRandomTags(tags) },
        });
    }

    return recipes;
}

async function main() {
    await prisma.tag.createMany({
        data: tags.map((tag) => ({ name: tag })),
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
                create: getRandomRecipes([aubergineRotie, potimarron], 2, 5),
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
                create: getRandomRecipes([aubergineRotie, potimarron], 3, 8),
            },
            starredRecipes: {
                connect: [{ id: 1 }, { id: 2 }],
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
