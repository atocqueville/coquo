'use client';

import type React from 'react';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock, Flame, Info, Plus, Trash2, Upload, Users } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Recipe title must be at least 2 characters.',
    }),
    picture: z.string().optional(),
    ingredients: z.string().min(10, {
        message: 'Please add some ingredients (at least 10 characters).',
    }),
    steps: z
        .array(
            z.object({
                title: z.string().min(2, {
                    message: 'Step title must be at least 2 characters.',
                }),
                instructions: z
                    .array(
                        z.string().min(10, {
                            message:
                                'Instruction must be at least 10 characters.',
                        })
                    )
                    .min(1, {
                        message: 'Please add at least one instruction.',
                    }),
            })
        )
        .min(1, {
            message: 'Please add at least one step.',
        }),
    difficulty: z.coerce.number().min(1).max(5),
    prepTime: z.coerce.number().min(1, {
        message: 'Prep time must be at least 1 minute.',
    }),
    cookTime: z.coerce.number().min(0, {
        message: 'Cook time must be 0 or more minutes.',
    }),
    servings: z.coerce.number().min(1, {
        message: 'Recipe must serve at least 1 person.',
    }),
    tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateRecipeForm() {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Define available tags
    const availableTags = [
        'Breakfast',
        'Lunch',
        'Dinner',
        'Dessert',
        'Vegetarian',
        'Vegan',
        'Gluten-Free',
        'Dairy-Free',
        'Low-Carb',
        'Quick',
        'Easy',
        'Gourmet',
    ];

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            picture: '',
            ingredients: '',
            steps: [{ title: '', instructions: [''] }],
            difficulty: 1,
            prepTime: 15,
            cookTime: 30,
            servings: 4,
            tags: [],
        },
    });

    // Field array for steps
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'steps',
    });

    function onSubmit(values: FormValues) {
        // Include selected tags in the form values
        values.tags = selectedTags;
        console.log(values);
        // Here you would typically send the data to your API
        alert('Recipe submitted successfully!');
    }

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                form.setValue('picture', result);
            };
            reader.readAsDataURL(file);
        }
    }

    function toggleTag(tag: string) {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    }

    // Function to safely add a new step
    const addStep = () => {
        append({ title: '', instructions: [''] });
    };

    // Function to add an instruction to a specific step
    const addInstruction = (stepIndex: number) => {
        const currentInstructions = form.getValues(
            `steps.${stepIndex}.instructions`
        );
        form.setValue(`steps.${stepIndex}.instructions`, [
            ...currentInstructions,
            '',
        ]);
    };

    // Function to remove an instruction from a specific step
    const removeInstruction = (stepIndex: number, instructionIndex: number) => {
        const currentInstructions = form.getValues(
            `steps.${stepIndex}.instructions`
        );
        form.setValue(
            `steps.${stepIndex}.instructions`,
            currentInstructions.filter((_, i) => i !== instructionIndex)
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Left column - Image (1/3 width) */}
                            <div className="md:w-1/3">
                                <FormField
                                    control={form.control}
                                    name="picture"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Recipe Image</FormLabel>
                                            <FormControl>
                                                <div
                                                    className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-md border border-dashed border-input bg-muted/50 hover:bg-muted/80"
                                                    onClick={() =>
                                                        document
                                                            .getElementById(
                                                                'picture-upload'
                                                            )
                                                            ?.click()
                                                    }
                                                >
                                                    {imagePreview ? (
                                                        <img
                                                            src={
                                                                imagePreview ||
                                                                '/placeholder.svg'
                                                            }
                                                            alt="Recipe preview"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full flex-col items-center justify-center">
                                                            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                                                            <p className="text-sm text-muted-foreground">
                                                                Click to upload
                                                                an image
                                                            </p>
                                                        </div>
                                                    )}
                                                    <input
                                                        id="picture-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={
                                                            handleImageUpload
                                                        }
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Right column - Recipe details (2/3 width) */}
                            <div className="md:w-2/3 space-y-4">
                                {/* Title - Full width */}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Recipe Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Delicious Chocolate Cake"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Prep Time and Cook Time - Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="prepTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Prep Time (min)
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center">
                                                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="cookTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Cook Time (min)
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center">
                                                        <Flame className="mr-2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Servings and Difficulty - Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="servings"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Servings</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center">
                                                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="difficulty"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Difficulty
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="space-y-4">
                                                        <Slider
                                                            min={1}
                                                            max={5}
                                                            step={1}
                                                            defaultValue={[
                                                                field.value,
                                                            ]}
                                                            onValueChange={(
                                                                value
                                                            ) =>
                                                                field.onChange(
                                                                    value[0]
                                                                )
                                                            }
                                                            className="py-4"
                                                        />
                                                        <div className="flex justify-between text-xs text-muted-foreground">
                                                            <span>Easy</span>
                                                            <span>Medium</span>
                                                            <span>Hard</span>
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tags
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {availableTags.map((tag) => (
                                        <Button
                                            key={tag}
                                            type="button"
                                            variant={
                                                selectedTags.includes(tag)
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            onClick={() => toggleTag(tag)}
                                            className="rounded-full"
                                        >
                                            {tag}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <FormField
                                control={form.control}
                                name="ingredients"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Ingredients</FormLabel>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            type="button"
                                                        >
                                                            <Info className="h-4 w-4" />
                                                            <span className="sr-only">
                                                                Ingredients
                                                                format info
                                                            </span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Enter each
                                                            ingredient on a new
                                                            line
                                                        </p>
                                                        <p>
                                                            Format: "2 cups
                                                            flour" or "1 tbsp
                                                            olive oil"
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <FormControl>
                                            <Textarea
                                                placeholder="2 cups all-purpose flour
1/2 cup unsalted butter, softened
1 cup granulated sugar
2 large eggs
1 tsp vanilla extract"
                                                className="min-h-32 font-mono text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            List all ingredients with quantities
                                            and measurements.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Recipe Steps
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addStep}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Step
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {fields.map((stepField, stepIndex) => {
                                    // Get the current instructions for this step
                                    const instructions = form.watch(
                                        `steps.${stepIndex}.instructions`
                                    ) || [''];

                                    return (
                                        <div
                                            key={stepField.id}
                                            className="relative rounded-md border p-4"
                                        >
                                            <div className="absolute right-2 top-2 flex gap-2">
                                                {fields.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            remove(stepIndex)
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Remove step
                                                        </span>
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="mb-4 flex items-center gap-2">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                    {stepIndex + 1}
                                                </div>
                                                <h3 className="text-sm font-medium">
                                                    Step {stepIndex + 1}
                                                </h3>
                                            </div>

                                            <div className="grid gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`steps.${stepIndex}.title`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Step Title
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Prepare the batter"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm font-medium">
                                                            Instructions
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                addInstruction(
                                                                    stepIndex
                                                                )
                                                            }
                                                        >
                                                            <Plus className="mr-2 h-3 w-3" />
                                                            Add Instruction
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {instructions.map(
                                                            (
                                                                _,
                                                                instructionIndex
                                                            ) => (
                                                                <div
                                                                    key={`${stepIndex}-${instructionIndex}`}
                                                                    className="flex items-start gap-2"
                                                                >
                                                                    <FormField
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name={`steps.${stepIndex}.instructions.${instructionIndex}`}
                                                                        render={({
                                                                            field,
                                                                        }) => (
                                                                            <FormItem className="flex-1">
                                                                                <FormControl>
                                                                                    <div className="flex items-start gap-2">
                                                                                        <div className="mt-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
                                                                                            {instructionIndex +
                                                                                                1}
                                                                                        </div>
                                                                                        <Textarea
                                                                                            placeholder="Mix the flour, sugar, and baking powder in a large bowl..."
                                                                                            className="min-h-20"
                                                                                            {...field}
                                                                                        />
                                                                                    </div>
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                    {instructions.length >
                                                                        1 && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="mt-2"
                                                                            onClick={() =>
                                                                                removeInstruction(
                                                                                    stepIndex,
                                                                                    instructionIndex
                                                                                )
                                                                            }
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                            <span className="sr-only">
                                                                                Remove
                                                                                instruction
                                                                            </span>
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline">
                        Save as Draft
                    </Button>
                    <Button type="submit">Create Recipe</Button>
                </div>
            </form>
        </Form>
    );
}
