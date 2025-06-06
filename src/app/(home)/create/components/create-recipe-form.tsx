'use client';

import type React from 'react';
import Image from 'next/image';

import { useState, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Clock,
    Flame,
    Info,
    Plus,
    Trash2,
    Upload,
    Users,
    Loader2,
} from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useTranslations } from 'next-intl';

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

import { uploadImages } from '@/lib/api/file-storage';
import { createRecipe, updateRecipe } from '@/lib/api/recipe';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { CreateRecipeSchema } from '@/schemas';
import { createDifficultyLabels } from '@/utils/difficulty';

type CreateRecipeFormData = z.infer<typeof CreateRecipeSchema>;

// Custom type for handling File in both client and server environments
const FileSchema = z
    .any()
    .refine(
        (file) =>
            file === undefined ||
            file === null ||
            (typeof File !== 'undefined' && file instanceof File),
        {
            message: 'Must be a File or undefined',
        }
    );

// Function to create schema with localized messages
const createFormSchema = (t: (key: string) => string) =>
    z.object({
        title: z.string().min(2, {
            message: t('validation.titleMin'),
        }),
        pictures: z.array(FileSchema).optional(),
        ingredients: z.string().min(1, {
            message: t('validation.ingredientsRequired'),
        }),
        steps: z
            .array(
                z.object({
                    title: z.string().min(2, {
                        message: t('validation.stepTitleMin'),
                    }),
                    instructions: z
                        .array(
                            z.string().min(5, {
                                message: t('validation.instructionMin'),
                            })
                        )
                        .min(1, {
                            message: t('validation.instructionRequired'),
                        }),
                })
            )
            .min(1, {
                message: t('validation.stepsRequired'),
            }),
        difficulty: z.coerce.number().min(1).max(3),
        prepTime: z.coerce.number().min(1, {
            message: t('validation.prepTimeMin'),
        }),
        cookTime: z.coerce.number().min(0, {
            message: t('validation.cookTimeMin'),
        }),
        servings: z.coerce.number().min(1, {
            message: t('validation.servingsMin'),
        }),
        tags: z.array(z.string()).optional(),
    });

type CreateRecipeFormProps = {
    tags: Tag[];
    initialData?: {
        title: string;
        images?: string[];
        ingredients: string;
        steps: {
            title: string;
            instructions: string[];
        }[];
        difficulty: number;
        prepTime: number;
        cookTime: number;
        servings: number;
        tags: string[];
    };
    recipeId?: number;
};

export function CreateRecipeForm({
    tags,
    initialData,
    recipeId,
}: CreateRecipeFormProps) {
    const t = useTranslations('CreateRecipePage');
    const difficultyT = useTranslations('common.Difficulty');
    const difficultyLabels = createDifficultyLabels(difficultyT);

    // Create schema with localized validation messages
    const formSchema = useMemo(() => createFormSchema(t), [t]);
    type FormValues = z.infer<typeof formSchema>;

    // Format image URL to use the image proxy for existing images
    const formatImageUrl = (imagePath: string | undefined) => {
        if (!imagePath) return null;

        // For existing images stored on the server, use the image proxy
        if (!imagePath.startsWith('data:')) {
            return `/api/image-proxy?imageId=${imagePath}`;
        }

        // For data URLs (new uploads from FileReader), return as is
        return imagePath;
    };

    const initialImageUrls =
        initialData?.images
            ?.map(formatImageUrl)
            .filter((url): url is string => url !== null) || [];

    const [selectedTags, setSelectedTags] = useState<string[]>(
        initialData?.tags || []
    );
    const [imagePreviews, setImagePreviews] =
        useState<string[]>(initialImageUrls);
    const [isExistingImages, setIsExistingImages] = useState<boolean[]>(
        initialImageUrls.map(() => true)
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                  title: initialData.title,
                  pictures: undefined,
                  ingredients: initialData.ingredients,
                  steps: initialData.steps,
                  difficulty: initialData.difficulty,
                  prepTime: initialData.prepTime,
                  cookTime: initialData.cookTime,
                  servings: initialData.servings,
                  tags: initialData.tags,
              }
            : {
                  title: '',
                  pictures: undefined,
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
        const files = e.target.files;
        if (files) {
            const fileArray = Array.from(files);
            const currentPictures = form.getValues('pictures') || [];

            fileArray.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    setImagePreviews((prev) => [...prev, result]);
                    setIsExistingImages((prev) => [...prev, false]);
                };
                reader.readAsDataURL(file);
            });

            form.setValue('pictures', [...currentPictures, ...fileArray]);
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
        setIsSubmitting(true);
        let uploadedImagePaths: string[] = [];

        values.tags = selectedTags;

        try {
            // Handle image uploads
            if (values.pictures && values.pictures.length > 0) {
                const uploadFilesResponse = await uploadImages(values.pictures);
                uploadedImagePaths = uploadFilesResponse.paths;
            }

            // If we're editing and keeping existing images, combine them with new ones
            if (
                initialData?.images &&
                isExistingImages.some((isExisting) => isExisting)
            ) {
                const existingImages = initialData.images.filter(
                    (_, index) => isExistingImages[index]
                );
                uploadedImagePaths = [...existingImages, ...uploadedImagePaths];
            }

            const recipe: CreateRecipeFormData = {
                title: values.title,
                images: uploadedImagePaths,
                ingredients: values.ingredients.split('\n'),
                steps: values.steps,
                tags: selectedTags,
                prepTime: values.prepTime,
                cookTime: values.cookTime,
                servings: values.servings,
                difficulty: values.difficulty,
            };

            if (recipeId) {
                // Update existing recipe
                await updateRecipe(recipeId, recipe);
                toast.success(t('notifications.updateSuccess'));
                router.push(`/r/${recipeId}`);
            } else {
                // Create new recipe
                await createRecipe(recipe);
                toast.success(t('notifications.createSuccess'));
                router.push('/');
            }
        } catch {
            toast.error(
                recipeId
                    ? t('notifications.updateError')
                    : t('notifications.createError')
            );
        } finally {
            setIsSubmitting(false);
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
                            {/* Left column - Images (1/3 width) */}
                            <div className="md:w-1/3 flex justify-center">
                                <FormField
                                    control={form.control}
                                    name="pictures"
                                    render={() => (
                                        <FormItem className="flex-1">
                                            <FormLabel>
                                                {t('form.pictures.label')}
                                                {imagePreviews.length > 0 && (
                                                    <span className="ml-2 text-sm text-muted-foreground">
                                                        {t(
                                                            'form.pictures.imageCount',
                                                            {
                                                                count: imagePreviews.length,
                                                                plural:
                                                                    imagePreviews.length >
                                                                    1
                                                                        ? 's'
                                                                        : '',
                                                            }
                                                        )}
                                                    </span>
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <div
                                                    className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-md border border-dashed border-input bg-muted/50 hover:bg-muted/80"
                                                    onClick={() =>
                                                        document
                                                            .getElementById(
                                                                'pictures-upload'
                                                            )
                                                            ?.click()
                                                    }
                                                >
                                                    {imagePreviews.length >
                                                    0 ? (
                                                        <div className="relative h-full w-full p-2">
                                                            <div
                                                                className={`grid gap-2 h-full ${
                                                                    imagePreviews.length ===
                                                                    1
                                                                        ? 'grid-cols-1'
                                                                        : imagePreviews.length <=
                                                                            4
                                                                          ? 'grid-cols-2'
                                                                          : 'grid-cols-3'
                                                                }`}
                                                            >
                                                                {imagePreviews
                                                                    .slice(0, 6)
                                                                    .map(
                                                                        (
                                                                            preview,
                                                                            index
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="relative aspect-square rounded-md overflow-hidden"
                                                                            >
                                                                                <Image
                                                                                    src={
                                                                                        preview
                                                                                    }
                                                                                    fill
                                                                                    alt={`Aperçu de la recette - Image ${index + 1}`}
                                                                                    className="object-cover"
                                                                                />
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="destructive"
                                                                                    size="icon"
                                                                                    className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                                                                                    onClick={(
                                                                                        e
                                                                                    ) => {
                                                                                        e.stopPropagation();

                                                                                        // Remove from preview arrays
                                                                                        setImagePreviews(
                                                                                            imagePreviews.filter(
                                                                                                (
                                                                                                    _,
                                                                                                    i
                                                                                                ) =>
                                                                                                    i !==
                                                                                                    index
                                                                                            )
                                                                                        );

                                                                                        const newIsExistingImages =
                                                                                            isExistingImages.filter(
                                                                                                (
                                                                                                    _,
                                                                                                    i
                                                                                                ) =>
                                                                                                    i !==
                                                                                                    index
                                                                                            );
                                                                                        setIsExistingImages(
                                                                                            newIsExistingImages
                                                                                        );

                                                                                        // Only filter pictures array if this is a new upload (not existing)
                                                                                        if (
                                                                                            !isExistingImages[
                                                                                                index
                                                                                            ]
                                                                                        ) {
                                                                                            const currentPictures =
                                                                                                form.getValues(
                                                                                                    'pictures'
                                                                                                ) ||
                                                                                                [];
                                                                                            // Find the index in the pictures array (only counting non-existing images)
                                                                                            let pictureIndex = 0;
                                                                                            for (
                                                                                                let i = 0;
                                                                                                i <
                                                                                                index;
                                                                                                i++
                                                                                            ) {
                                                                                                if (
                                                                                                    !isExistingImages[
                                                                                                        i
                                                                                                    ]
                                                                                                ) {
                                                                                                    pictureIndex++;
                                                                                                }
                                                                                            }
                                                                                            form.setValue(
                                                                                                'pictures',
                                                                                                currentPictures.filter(
                                                                                                    (
                                                                                                        _,
                                                                                                        i
                                                                                                    ) =>
                                                                                                        i !==
                                                                                                        pictureIndex
                                                                                                )
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                    <span className="sr-only">
                                                                                        {t(
                                                                                            'form.pictures.removeImage'
                                                                                        )}
                                                                                    </span>
                                                                                </Button>
                                                                            </div>
                                                                        )
                                                                    )}
                                                            </div>
                                                            {imagePreviews.length >
                                                                6 && (
                                                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                                    {t(
                                                                        'form.pictures.moreImages',
                                                                        {
                                                                            count:
                                                                                imagePreviews.length -
                                                                                6,
                                                                        }
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-full w-full flex-col items-center justify-center">
                                                            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                                                            <p className="text-sm text-muted-foreground">
                                                                {t(
                                                                    'form.pictures.uploadText'
                                                                )}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <input
                                                        id="pictures-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={
                                                            handleImageUpload
                                                        }
                                                        multiple
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
                                                {t('form.title.label')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        'form.title.placeholder'
                                                    )}
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
                                                    {t('form.prepTime.label')}
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
                                                    {t('form.cookTime.label')}
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
                                                <FormLabel>
                                                    {t('form.servings.label')}
                                                </FormLabel>
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
                                                    {t('form.difficulty.label')}
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
                                                            className="pt-4"
                                                        />
                                                        <div className="flex justify-between text-xs text-muted-foreground">
                                                            <span>
                                                                {
                                                                    difficultyLabels.easy
                                                                }
                                                            </span>
                                                            <span>
                                                                {
                                                                    difficultyLabels.medium
                                                                }
                                                            </span>
                                                            <span>
                                                                {
                                                                    difficultyLabels.hard
                                                                }
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
                                    {t('form.tags.label')}
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <Badge
                                            key={tag.id}
                                            tag={tag}
                                            onClick={() => toggleTag(tag.id)}
                                            variant={
                                                selectedTags.includes(tag.id)
                                                    ? undefined
                                                    : 'unselected'
                                            }
                                            className="cursor-pointer transition-all duration-150"
                                        />
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
                                            <FormLabel>
                                                {t('form.ingredients.label')}
                                            </FormLabel>
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
                                                                {t(
                                                                    'form.ingredients.tooltip.info'
                                                                )}
                                                            </span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            {t(
                                                                'form.ingredients.tooltip.format1'
                                                            )}
                                                        </p>
                                                        <p>
                                                            {t(
                                                                'form.ingredients.tooltip.format2'
                                                            )}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t(
                                                    'form.ingredients.placeholder'
                                                )}
                                                className="min-h-32 font-mono text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {t('form.ingredients.description')}
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
                                    {t('form.steps.label')}
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addStep}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    <span className="hidden md:block">
                                        {t('form.steps.addStep')}
                                    </span>
                                    <span className="block md:hidden">
                                        {t('form.steps.addStepShort')}
                                    </span>
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
                                                            {t(
                                                                'form.steps.removeStep'
                                                            )}
                                                        </span>
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="mb-4 flex items-center gap-2">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                                    {stepIndex + 1}
                                                </div>
                                                <h3 className="text-sm font-medium">
                                                    {t(
                                                        'form.steps.stepNumber',
                                                        {
                                                            number:
                                                                stepIndex + 1,
                                                        }
                                                    )}
                                                </h3>
                                            </div>

                                            <div className="grid gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`steps.${stepIndex}.title`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                {t(
                                                                    'form.steps.stepTitle.label'
                                                                )}
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder={t(
                                                                        'form.steps.stepTitle.placeholder'
                                                                    )}
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
                                                            {t(
                                                                'form.steps.instructions.label'
                                                            )}
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
                                                            <span className="hidden md:block">
                                                                {t(
                                                                    'form.steps.instructions.addInstruction'
                                                                )}
                                                            </span>
                                                            <span className="block md:hidden">
                                                                {t(
                                                                    'form.steps.instructions.addInstructionShort'
                                                                )}
                                                            </span>
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
                                                                                        <Textarea
                                                                                            placeholder={t(
                                                                                                'form.steps.instructions.placeholder'
                                                                                            )}
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
                                                                                {t(
                                                                                    'form.steps.instructions.removeInstruction'
                                                                                )}
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
                    <Button
                        variant="coquo"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {recipeId
                                    ? t('form.submit.updating')
                                    : t('form.submit.creating')}
                            </>
                        ) : (
                            <>
                                {recipeId
                                    ? t('form.submit.update')
                                    : t('form.submit.create')}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
