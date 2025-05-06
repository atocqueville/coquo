'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Upload, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { uploadImage } from '@/lib/api/file-storage';
import { createRecipe } from '@/lib/api/recipe';

export default function CreateRecipeForm({ tags }: { tags: string[] }) {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [steps, setSteps] = useState<
        Array<{ id: number; title: string; instructions: string[] }>
    >([{ id: 1, title: '', instructions: [''] }]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addIngredient = () => {
        setIngredients([...ingredients, '']);
    };

    const updateIngredient = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const removeIngredient = (index: number) => {
        if (ingredients.length > 1) {
            const newIngredients = [...ingredients];
            newIngredients.splice(index, 1);
            setIngredients(newIngredients);
        }
    };

    const addStep = () => {
        const newId =
            steps.length > 0
                ? Math.max(...steps.map((step) => step.id)) + 1
                : 1;
        setSteps([...steps, { id: newId, title: '', instructions: [''] }]);
    };

    const updateStepTitle = (index: number, value: string) => {
        const newSteps = [...steps];
        newSteps[index].title = value;
        setSteps(newSteps);
    };

    const addInstruction = (stepIndex: number) => {
        const newSteps = [...steps];
        newSteps[stepIndex].instructions.push('');
        setSteps(newSteps);
    };

    const updateInstruction = (
        stepIndex: number,
        instructionIndex: number,
        value: string
    ) => {
        const newSteps = [...steps];
        newSteps[stepIndex].instructions[instructionIndex] = value;
        setSteps(newSteps);
    };

    const removeInstruction = (stepIndex: number, instructionIndex: number) => {
        if (steps[stepIndex].instructions.length > 1) {
            const newSteps = [...steps];
            newSteps[stepIndex].instructions.splice(instructionIndex, 1);
            setSteps(newSteps);
        }
    };

    const removeStep = (index: number) => {
        if (steps.length > 1) {
            const newSteps = [...steps];
            newSteps.splice(index, 1);
            setSteps(newSteps);
        }
    };

    const addTag = (tag: string) => {
        if (tag && !selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
        setTagInput('');
    };

    const removeTag = (tag: string) => {
        setSelectedTags(selectedTags.filter((t) => t !== tag));
    };

    const filteredTags = tags.filter(
        (tag) =>
            !selectedTags.includes(tag) &&
            tag.toLowerCase().includes(tagInput.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let uploadFileResponse: { path: string } | null = null;

        try {
            if (imageFile) {
                uploadFileResponse = await uploadImage([imageFile]);
            }

            // Filter out empty ingredients and instructions
            const filteredIngredients = ingredients.filter(
                (ingredient) => ingredient.trim() !== ''
            );
            const filteredSteps = steps
                .map((step) => ({
                    ...step,
                    instructions: step.instructions.filter(
                        (instruction) => instruction.trim() !== ''
                    ),
                }))
                .filter(
                    (step) =>
                        step.title.trim() !== '' && step.instructions.length > 0
                );

            const recipe = {
                title,
                picture: uploadFileResponse?.path,
                ingredients: filteredIngredients,
                steps: filteredSteps,
                tags: selectedTags,
            };

            console.log('Recipe to save:', recipe);

            await createRecipe(recipe);
        } catch (error) {
            console.log(error);
            return 'Error while saving recipe';
        }
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">
                        Créer une nouvelle recette
                    </h1>
                </div>
            </div>

            <form
                id="recipe-form"
                onSubmit={handleSubmit}
                className="space-y-8"
            >
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title" className="text-base">
                                    Titre de la recette
                                </Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex: Tarte aux pommes traditionnelle"
                                    className="mt-1.5"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="image" className="text-base">
                                    Image de la recette
                                </Label>
                                <div className="mt-1.5 flex items-center gap-4">
                                    <div className="relative flex h-40 w-40 cursor-pointer items-center justify-center rounded-md border border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50">
                                        <input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 cursor-pointer opacity-0"
                                            onChange={handleImageChange}
                                        />
                                        {imagePreview ? (
                                            <img
                                                src={
                                                    imagePreview ||
                                                    '/placeholder.svg'
                                                }
                                                alt="Preview"
                                                className="h-full w-full rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <Upload className="mb-2 h-8 w-8" />
                                                <span>Ajouter une image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <p>Formats acceptés: JPG, PNG, GIF</p>
                                        <p>Taille maximale: 5 MB</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label className="text-base">Tags</Label>
                                <div className="mt-1.5 space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant={tag as never}
                                                className="flex items-center gap-1"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeTag(tag)
                                                    }
                                                    className="ml-1 rounded-full hover:bg-white/20"
                                                >
                                                    <X className="h-3 w-3" />
                                                    <span className="sr-only">
                                                        Supprimer le tag {tag}
                                                    </span>
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <Input
                                            value={tagInput}
                                            onChange={(e) =>
                                                setTagInput(e.target.value)
                                            }
                                            placeholder="Ajouter un tag..."
                                            className="w-full"
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === 'Enter' &&
                                                    tagInput
                                                ) {
                                                    e.preventDefault();
                                                    addTag(tagInput);
                                                }
                                            }}
                                        />
                                        {tagInput && (
                                            <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg">
                                                <div className="max-h-60 overflow-auto p-1">
                                                    {filteredTags.length > 0 ? (
                                                        filteredTags.map(
                                                            (tag) => (
                                                                <div
                                                                    key={tag}
                                                                    className="cursor-pointer rounded-sm px-2 py-1.5 hover:bg-muted"
                                                                    onClick={() =>
                                                                        addTag(
                                                                            tag
                                                                        )
                                                                    }
                                                                >
                                                                    {tag}
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <div className="px-2 py-1.5 text-muted-foreground">
                                                            Aucun tag
                                                            correspondant
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tags.slice(0, 8).map((tag) => (
                                            <Button
                                                key={tag}
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addTag(tag)}
                                                disabled={selectedTags.includes(
                                                    tag
                                                )}
                                                className="text-xs"
                                            >
                                                {tag}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                Ingrédients
                            </h2>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addIngredient}
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                Ajouter un ingrédient
                            </Button>
                        </div>
                        <Separator className="mb-4" />
                        <div className="space-y-3">
                            {ingredients.map((ingredient, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <Input
                                        value={ingredient}
                                        onChange={(e) =>
                                            updateIngredient(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ex: 100g de farine"
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeIngredient(index)}
                                        disabled={ingredients.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">
                                            Supprimer
                                        </span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                Étapes de préparation
                            </h2>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addStep}
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                Ajouter une étape
                            </Button>
                        </div>
                        <Separator className="mb-6" />
                        <div className="space-y-8">
                            {steps.map((step, stepIndex) => (
                                <div
                                    key={step.id}
                                    className="rounded-lg border p-4"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium">
                                                Étape {stepIndex + 1}
                                            </h3>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                removeStep(stepIndex)
                                            }
                                            disabled={steps.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">
                                                Supprimer l&apos;étape
                                            </span>
                                        </Button>
                                    </div>

                                    <div className="mb-4">
                                        <Label
                                            htmlFor={`step-title-${step.id}`}
                                            className="mb-1.5 block"
                                        >
                                            Titre de l&apos;étape
                                        </Label>
                                        <Input
                                            id={`step-title-${step.id}`}
                                            value={step.title}
                                            onChange={(e) =>
                                                updateStepTitle(
                                                    stepIndex,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Ex: Préparation de la pâte"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="block">
                                            Instructions
                                        </Label>
                                        {step.instructions.map(
                                            (instruction, instructionIndex) => (
                                                <div
                                                    key={instructionIndex}
                                                    className="flex items-start gap-2"
                                                >
                                                    <Textarea
                                                        value={instruction}
                                                        onChange={(e) =>
                                                            updateInstruction(
                                                                stepIndex,
                                                                instructionIndex,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Ex: Mélanger la farine, le sucre et la levure"
                                                        className="flex-1 min-h-[80px]"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            removeInstruction(
                                                                stepIndex,
                                                                instructionIndex
                                                            )
                                                        }
                                                        disabled={
                                                            step.instructions
                                                                .length === 1
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Supprimer
                                                            l&apos;instruction
                                                        </span>
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                addInstruction(stepIndex)
                                            }
                                            className="mt-2"
                                        >
                                            <Plus className="mr-1 h-4 w-4" />
                                            Ajouter une instruction
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" asChild>
                        <Link href="/">Annuler</Link>
                    </Button>
                    <Button type="submit">Enregistrer la recette</Button>
                </div>
            </form>
        </>
    );
}
