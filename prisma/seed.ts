import { PrismaClient, type Prisma, type Tag } from '@prisma/client';
import { aubergineRotie, potimarron } from './mocks/recipes';
import { randomUUID } from 'crypto';

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

    const adminEmail = 'admin@coquo.io';
    const adminPassword =
        '43a996f1a728e49e81d4aced41729916:831ba8ee7c36031c0d9edcbd1d63596decb984c9f947b50e2419ace0e20a7db9d5c1d6ae2addde1d4066b67ff0a2027b062ee5263b95f1f73ce25b5ae05f9461';

    // Create or update admin user
    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            role: 'admin',
            email: adminEmail,
            emailVerified: true,
            approved: true,
            name: 'Admin',
            recipes: {
                create: getRandomRecipes(
                    [aubergineRotie, potimarron],
                    10,
                    15,
                    tags
                ),
            },
            starredRecipes: {
                connect: [{ id: 1 }, { id: 2 }],
            },
        },
    });

    // Create credential account for Better-Auth (if not exists)
    const existingAccount = await prisma.account.findFirst({
        where: {
            userId: adminUser.id,
            providerId: 'credential',
        },
    });

    if (!existingAccount) {
        await prisma.account.create({
            data: {
                id: randomUUID(),
                accountId: adminEmail,
                providerId: 'credential',
                userId: adminUser.id,
                password: adminPassword,
            },
        });
        console.log(`Created credential account for ${adminEmail}`);
    }
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
