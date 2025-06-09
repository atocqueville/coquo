'use client';

import { toast } from 'sonner';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
    const t = useTranslations('RecipePage.deleteDialog');
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteRecipe(Number(recipeId));
            setIsDialogOpen(false);
            router.push('/');
        } catch {
            toast.error(t('error'));
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
                    <span className="sr-only">{t('title')}</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>{t('description')}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isDeleting}
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? t('deleting') : t('delete')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
