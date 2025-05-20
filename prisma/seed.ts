import { PrismaClient, type Prisma, type Tag } from '@prisma/client';
import { aubergineRotie, potimarron } from './mocks/recipes';
const prisma = new PrismaClient();

/**
 * Returns a random number of tags (between min and max inclusive)
 */
function getRandomTags(tagsList: Tag[], min = 1, max = 3) {
    // Create a copy of the tags array to avoid modifying the original
    const tagIds = [...tagsList.map((tag) => tag.id)];
    // Shuffle the tags array
    for (let i = tagIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tagIds[i], tagIds[j]] = [tagIds[j], tagIds[i]];
    }
    // Get a random number between min and max
    const numTags = Math.floor(Math.random() * (max - min + 1)) + min;
    // Return the first numTags elements
    return tagIds.slice(0, numTags).map((tagId) => ({ id: tagId }));
}

function getRandomRecipes(
    recipeTemplates: Omit<Prisma.RecipeCreateInput, 'author'>[],
    minCount: number,
    maxCount: number,
    tags: Tag[]
) {
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
    const tags = await prisma.tag.findMany();

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
                create: getRandomRecipes(
                    [aubergineRotie, potimarron],
                    2,
                    5,
                    tags
                ),
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
                create: getRandomRecipes(
                    [aubergineRotie, potimarron],
                    3,
                    8,
                    tags
                ),
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
