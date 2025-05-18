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
import type { Tag } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { uploadImage } from '@/lib/api/file-storage';
import { createRecipe } from '@/lib/api/recipe';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { CreateRecipeSchema } from '@/schemas';

type CreateRecipeFormData = z.infer<typeof CreateRecipeSchema>;

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Le titre de la recette doit contenir au moins 2 caractères.',
    }),
    picture: z.instanceof(File).optional(),
    ingredients: z.string().min(1, {
        message: 'Ajoutez des ingrédients',
    }),
    steps: z
        .array(
            z.object({
                title: z.string().min(2, {
                    message:
                        "Le titre de l'étape doit contenir au moins 2 caractères.",
                }),
                instructions: z
                    .array(
                        z.string().min(5, {
                            message:
                                'Une instruction doit contenir au moins 5 caractères.',
                        })
                    )
                    .min(1, {
                        message: 'Ajoutez au moins une instruction.',
                    }),
            })
        )
        .min(1, {
            message: 'Ajoutez au moins une étape.',
        }),
    difficulty: z.coerce.number().min(1).max(3),
    prepTime: z.coerce.number().min(1, {
        message: "Le temps de préparation doit être d'au moins 1 minute.",
    }),
    cookTime: z.coerce.number().min(0, {
        message: 'Le temps de cuisson doit être de 0 ou plus minutes.',
    }),
    servings: z.coerce.number().min(1, {
        message: 'La recette doit servir au moins 1 personne.',
    }),
    tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type CreateRecipeFormProps = {
    tags: Tag[];
};

export function CreateRecipeForm({ tags }: CreateRecipeFormProps) {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const router = useRouter();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            picture: undefined,
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

    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                form.setValue('picture', file);
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

    const handleSubmit = async (values: FormValues) => {
        let uploadedImagePath: string = '';

        values.tags = selectedTags;

        try {
            if (values.picture) {
                const uploadFileResponse = await uploadImage([values.picture]);
                uploadedImagePath = uploadFileResponse.path;
            }

            const recipe: CreateRecipeFormData = {
                title: values.title,
                picture: uploadedImagePath,
                ingredients: values.ingredients.split('\n'),
                steps: values.steps,
                tags: selectedTags,
                prepTime: values.prepTime,
                cookTime: values.cookTime,
                servings: values.servings,
                difficulty: values.difficulty,
            };

            await createRecipe(recipe);
        } catch (err) {
            console.log(err);
            toast.error(
                'Une erreur est survenue lors de la création de la recette'
            );
        } finally {
            toast.success('Recette créée avec succès');
            router.push('/');
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8"
            >
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Left column - Image (1/3 width) */}
                            <div className="md:w-1/3 flex justify-center items-center">
                                <FormField
                                    control={form.control}
                                    name="picture"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
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
                                                            alt="Aperçu de la recette"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full flex-col items-center justify-center">
                                                            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                                                            <p className="text-sm text-muted-foreground">
                                                                Télécharger une
                                                                image
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
                                            <FormLabel>
                                                Titre de la recette
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Délicieux gâteau au chocolat"
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
                                                    Temps de préparation (min)
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
                                                    Temps de cuisson (min)
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
                                                <FormLabel>Portions</FormLabel>
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
                                                    Difficulté
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="space-y-4">
                                                        <Slider
                                                            min={1}
                                                            max={3}
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
                                                            <span>Facile</span>
                                                            <span>Moyen</span>
                                                            <span>
                                                                Difficile
                                                            </span>
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
                                    {tags.map((tag) => (
                                        <Badge
                                            key={tag.id}
                                            variant={tag.name as any}
                                            onClick={() => toggleTag(tag.id)}
                                            className={cn(
                                                selectedTags.includes(tag.id)
                                                    ? ''
                                                    : 'grayscale',
                                                'cursor-pointer'
                                            )}
                                        >
                                            {tag.name}
                                        </Badge>
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
                                            <FormLabel>Ingrédients</FormLabel>
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
                                                                Infos sur le
                                                                format des
                                                                ingrédients
                                                            </span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            Saisissez chaque
                                                            ingrédient sur une
                                                            nouvelle ligne
                                                        </p>
                                                        <p>
                                                            Format: "2 tasses de
                                                            farine" ou "1 c. à
                                                            soupe d'huile
                                                            d'olive"
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Ajoutez un ingrédient par ligne"
                                                className="min-h-32 font-mono text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Listez tous les ingrédients avec
                                            leurs quantités et mesures.
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
                                    Étapes de la recette
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addStep}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Ajouter une étape
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
                                                            Supprimer l'étape
                                                        </span>
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="mb-4 flex items-center gap-2">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                    {stepIndex + 1}
                                                </div>
                                                <h3 className="text-sm font-medium">
                                                    Étape {stepIndex + 1}
                                                </h3>
                                            </div>

                                            <div className="grid gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`steps.${stepIndex}.title`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Titre de l'étape
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Préparer la pâte"
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
                                                            Ajouter une
                                                            instruction
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
                                                                                            placeholder="Mélangez la farine, le sucre et la levure chimique dans un grand bol..."
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
                                                                                Supprimer
                                                                                l'instruction
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
                    <Button type="submit">Créer la recette</Button>
                </div>
            </form>
        </Form>
    );
}
