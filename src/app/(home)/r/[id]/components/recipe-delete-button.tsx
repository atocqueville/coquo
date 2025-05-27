'use client';

import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { deleteRecipe } from '@/lib/api/recipe';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface RecipeDeleteButtonProps {
    recipeId: string;
}

export default function RecipeDeleteButton({
    recipeId,
}: RecipeDeleteButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteRecipe(Number(recipeId));
            setIsDialogOpen(false);
            router.push('/');
        } catch (error) {
            console.error('Failed to delete recipe:', error);
            alert(
                'Erreur lors de la suppression de la recette. Veuillez réessayer.'
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full bg-red-500/90 backdrop-blur-sm hover:bg-red-600 shadow-lg"
                >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Supprimer la recette</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Supprimer la recette</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer cette recette ? Cette
                        action est irréversible et toutes les données de la
                        recette seront définitivement perdues.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isDeleting}
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Suppression...' : 'Supprimer'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
