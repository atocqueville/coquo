import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Type definitions for the old recipe structure
interface OldRecipeStep {
    stepName?: string;
    instructions?: string;
    ingredients?: string;
    image?: string;
}

interface OldRecipeDuration {
    preparation?: string;
    cuisson?: string;
}

interface OldRecipe {
    id?: string;
    name?: string;
    author?: string;
    people?: number | string;
    categories?: string[];
    duration?: OldRecipeDuration;
    steps?: OldRecipeStep[];
}

interface OldRecipesData {
    recipes: OldRecipe[];
}

// Mapping from old categories to new tag names
const categoryToTagMapping: Record<string, string> = {
    dessert: 'tag_dessert',
    dish: 'tag_lunch', // You might want to adjust this mapping
    appetizer: 'tag_lunch',
    other: 'tag_lunch',
};

// Parse duration strings to extract minutes
function parseDuration(durationStr: string): number {
    if (!durationStr) return 0;

    // Handle various formats like "30 mn", "1h", "2h30", "30 minutes", etc.
    const hourMatch = durationStr.match(/(\d+)h/);
    const minuteMatch = durationStr.match(/(\d+)\s*(?:mn|min|minutes?)/);

    let totalMinutes = 0;

    if (hourMatch) {
        totalMinutes += parseInt(hourMatch[1]) * 60;
    }

    if (minuteMatch) {
        totalMinutes += parseInt(minuteMatch[1]);
    }

    return totalMinutes || 0;
}

// Parse people count (handle cases like "6", "-6", "5-6", etc.)
function parsePeopleCount(people: number | string): number {
    if (typeof people === 'number') {
        return Math.abs(people); // Handle negative numbers
    }

    if (typeof people === 'string') {
        // Handle ranges like "5-6" - take the first number
        const match = people.match(/(\d+)/);
        return match ? parseInt(match[1]) : 4; // default to 4
    }

    return 4; // default
}

// Estimate difficulty based on preparation time and number of steps
function estimateDifficulty(prepTime: number, stepCount: number): number {
    if (prepTime <= 15 && stepCount <= 2) return 1; // Easy
    if (prepTime <= 45 && stepCount <= 4) return 2; // Medium
    if (prepTime <= 90 && stepCount <= 6) return 3; // Hard
    return 4; // Very Hard
}

// Parse ingredients from all steps and convert \n to semicolon-separated items
function parseIngredients(steps: OldRecipeStep[]): string {
    const allIngredients: string[] = [];

    steps?.forEach((step: OldRecipeStep) => {
        if (step.ingredients) {
            // Split by \n and filter out empty lines
            const stepIngredients = step.ingredients
                .split('\n')
                .map((ingredient) => ingredient.trim())
                .filter((ingredient) => ingredient.length > 0);

            allIngredients.push(...stepIngredients);
        }
    });

    // Join all ingredients with semicolons
    return allIngredients.join(';');
}

// Parse instructions and convert \n to semicolon-separated items
function parseInstructions(instructions: string): string {
    if (!instructions) return '';

    // Split by \n and filter out empty lines
    const instructionItems = instructions
        .split('\n')
        .map((instruction) => instruction.trim())
        .filter((instruction) => instruction.length > 0);

    // Join with semicolons
    return instructionItems.join(';');
}

async function main() {
    try {
        // Read the recipes JSON file
        const recipesPath = path.join(
            process.cwd(),
            'prisma/mocks/recipes-light.json'
        );

        if (!fs.existsSync(recipesPath)) {
            console.error(
                'recipes.json file not found in the current directory'
            );
            console.log(
                'Please make sure the recipes.json file is in the root of your project'
            );
            return;
        }

        const recipesData: OldRecipesData = JSON.parse(
            fs.readFileSync(recipesPath, 'utf-8')
        );
        const recipes = recipesData.recipes;

        console.log(`Found ${recipes.length} recipes to migrate`);

        let successCount = 0;
        let errorCount = 0;

        for (const [index, oldRecipe] of recipes.entries()) {
            try {
                console.log(
                    `Processing recipe ${index + 1}/${recipes.length}: ${oldRecipe.name}`
                );

                // Get or create user
                const userId = 'cmb3umm3g0000yvaxf2wrcgzc';

                // Parse times
                const prepTime = parseDuration(
                    oldRecipe.duration?.preparation || ''
                );
                const cookTime = parseDuration(
                    oldRecipe.duration?.cuisson || ''
                );

                // Parse servings
                const servings = parsePeopleCount(oldRecipe.people || 4);

                // Estimate difficulty
                const difficulty = estimateDifficulty(
                    prepTime,
                    oldRecipe.steps?.length || 1
                );

                // Combine all ingredients from all steps with proper parsing
                const allIngredients = parseIngredients(oldRecipe.steps || []);

                // Create the recipe
                const newRecipe = await prisma.recipe.create({
                    data: {
                        title: oldRecipe.name || 'Untitled Recipe',
                        ingredients: allIngredients,
                        difficulty: difficulty,
                        prepTime: prepTime,
                        cookTime: cookTime,
                        servings: servings,
                        userId: userId,
                        steps: {
                            create:
                                oldRecipe.steps?.map(
                                    (
                                        step: OldRecipeStep,
                                        stepIndex: number
                                    ) => ({
                                        title:
                                            step.stepName ||
                                            `Step ${stepIndex + 1}`,
                                        instructions: parseInstructions(
                                            step.instructions || ''
                                        ),
                                    })
                                ) || [],
                        },
                        tags: {
                            connect:
                                oldRecipe.categories
                                    ?.map((category: string) => {
                                        const tagId =
                                            categoryToTagMapping[category];
                                        return tagId ? { id: tagId } : null;
                                    })
                                    .filter(
                                        (tag): tag is { id: string } =>
                                            tag !== null
                                    ) || [],
                        },
                    },
                });

                console.log(
                    `✅ Successfully created recipe: ${newRecipe.title} (ID: ${newRecipe.id})`
                );
                successCount++;
            } catch (error) {
                console.error(
                    `❌ Error processing recipe "${oldRecipe.name}":`,
                    error
                );
                errorCount++;

                // Continue with next recipe instead of stopping
                continue;
            }
        }

        console.log('\n=== Migration Summary ===');
        console.log(`✅ Successfully migrated: ${successCount} recipes`);
        console.log(`❌ Failed to migrate: ${errorCount} recipes`);
        console.log(`📊 Total processed: ${successCount + errorCount} recipes`);
    } catch (error) {
        console.error('Fatal error during migration:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
