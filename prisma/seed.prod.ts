import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Check if tags already exist
    const existingTags = await prisma.tag.findMany();

    if (existingTags.length === 0) {
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
                { name: 'breakfast' },
                { name: 'lunch' },
                { name: 'dinner' },
                { name: 'snack' },
                { name: 'spicy' },
            ],
        });
        console.log('Seeded tags.');
    } else {
        console.log('Tags already seeded.');
    }

    // You can repeat the same pattern for other models
}

main()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
