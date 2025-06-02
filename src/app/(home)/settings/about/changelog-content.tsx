'use client';

import type React from 'react';

import { useState } from 'react';
import { Calendar, Bug, Zap, ArrowRight, ChevronDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// This would typically come from a markdown file that's processed
const changelogData = [
    {
        version: '1.2.0',
        date: '2023-05-15',
        description:
            "Ajout de nouvelles fonctionnalités et améliorations de l'interface",
        changes: [
            {
                type: 'feature',
                title: 'Système de tags colorés',
                description:
                    "Ajout d'un système de tags colorés pour catégoriser les recettes (végétarien, viande, saison, etc.)",
            },
            {
                type: 'feature',
                title: 'Page de création de recettes',
                description:
                    'Nouvelle interface pour créer et éditer des recettes avec un formulaire intuitif et des champs pour tous les détails nécessaires',
            },
            {
                type: 'improvement',
                title: 'Navigation améliorée',
                description:
                    'Refonte de la barre latérale pour une meilleure organisation et accès plus rapide aux fonctionnalités principales',
            },
            {
                type: 'improvement',
                title: 'Responsive design',
                description:
                    "Amélioration de l'expérience sur mobile avec une interface adaptative et des contrôles optimisés pour les écrans tactiles",
            },
        ],
    },
    {
        version: '1.1.0',
        date: '2023-04-10',
        description: 'Nouvelles fonctionnalités et corrections de bugs',
        changes: [
            {
                type: 'feature',
                title: 'Système de favoris',
                description:
                    'Ajout de la possibilité de marquer des recettes comme favorites et de les retrouver facilement',
            },
            {
                type: 'feature',
                title: 'Filtrage avancé',
                description:
                    'Nouveau système de filtrage des recettes par temps de préparation, difficulté et ingrédients',
            },
            {
                type: 'bugfix',
                title: "Correction d'affichage",
                description:
                    "Résolution de problèmes d'affichage sur certains navigateurs et appareils",
            },
            {
                type: 'bugfix',
                title: 'Performance',
                description:
                    'Amélioration des temps de chargement et optimisation des images',
            },
        ],
    },
    {
        version: '1.0.0',
        date: '2023-03-01',
        description: 'Lancement initial',
        changes: [
            {
                type: 'feature',
                title: 'Catalogue de recettes',
                description:
                    'Première version du catalogue de recettes avec recherche et navigation de base',
            },
            {
                type: 'feature',
                title: 'Pages de détail',
                description:
                    "Pages détaillées pour chaque recette avec liste d'ingrédients, instructions et informations nutritionnelles",
            },
            {
                type: 'feature',
                title: 'Compte utilisateur',
                description:
                    'Système de création de compte et connexion pour les utilisateurs',
            },
        ],
    },
];

type ChangeType = 'feature' | 'improvement' | 'bugfix';

const changeTypeConfig: Record<
    ChangeType,
    {
        icon: React.ReactNode;
        label: string;
        badgeVariant: string;
        badgeClassName: string;
    }
> = {
    feature: {
        icon: <Zap className="h-3 w-3" />,
        label: 'Nouvelle',
        badgeVariant: 'default',
        badgeClassName:
            'bg-green-500 hover:bg-green-600 text-[10px] px-1.5 py-0',
    },
    improvement: {
        icon: <ArrowRight className="h-3 w-3" />,
        label: 'Amélioration',
        badgeVariant: 'default',
        badgeClassName: 'bg-blue-500 hover:bg-blue-600 text-[10px] px-1.5 py-0',
    },
    bugfix: {
        icon: <Bug className="h-3 w-3" />,
        label: 'Correction',
        badgeVariant: 'default',
        badgeClassName:
            'bg-amber-500 hover:bg-amber-600 text-[10px] px-1.5 py-0',
    },
};

const BETA = true;

export function ChangelogContent() {
    const [expandedVersions, setExpandedVersions] = useState<
        Record<string, boolean>
    >(
        Object.fromEntries(
            changelogData.map((version) => [version.version, true])
        )
    );

    const toggleVersion = (version: string) => {
        setExpandedVersions((prev) => ({
            ...prev,
            [version]: !prev[version],
        }));
    };

    return (
        <div className="space-y-6">
            {BETA ? (
                <div className="bg-yellow-500 text-white p-4 rounded-md">
                    <p>
                        Cette fonctionnalité est en cours de développement et
                        n&apos;est pas encore disponible.
                    </p>
                </div>
            ) : (
                <>
                    {changelogData.map((versionData) => (
                        <div
                            key={versionData.version}
                            className="relative border rounded-md"
                        >
                            <div className="sticky top-0 z-10 bg-background/95 px-3 py-2 backdrop-blur border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-bold">
                                            v{versionData.version}
                                        </h2>
                                        <Badge
                                            variant="outline"
                                            className="flex items-center gap-1 text-xs text-muted-foreground"
                                        >
                                            <Calendar className="h-3 w-3" />
                                            {versionData.date}
                                        </Badge>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() =>
                                            toggleVersion(versionData.version)
                                        }
                                    >
                                        <ChevronDown
                                            className={cn(
                                                'h-3 w-3 transition-transform',
                                                {
                                                    'rotate-180':
                                                        !expandedVersions[
                                                            versionData.version
                                                        ],
                                                }
                                            )}
                                        />
                                        <span className="sr-only">
                                            {expandedVersions[
                                                versionData.version
                                            ]
                                                ? 'Réduire'
                                                : 'Développer'}
                                        </span>
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {versionData.description}
                                </p>
                            </div>

                            {expandedVersions[versionData.version] && (
                                <div className="px-3 py-2 space-y-0 divide-y">
                                    {versionData.changes.map(
                                        (change, index) => {
                                            const config =
                                                changeTypeConfig[
                                                    change.type as ChangeType
                                                ];
                                            return (
                                                <div
                                                    key={index}
                                                    className="py-2"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            className={cn(
                                                                config.badgeClassName
                                                            )}
                                                        >
                                                            <span className="flex items-center gap-1">
                                                                {config.icon}
                                                                {config.label}
                                                            </span>
                                                        </Badge>
                                                        <h3 className="text-sm font-medium">
                                                            {change.title}
                                                        </h3>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-0.5 pl-14">
                                                        {change.description}
                                                    </p>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}
