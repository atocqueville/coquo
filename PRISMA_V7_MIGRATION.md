# Migration Prisma v6 → v7

## Résumé des changements

- **Dépendances** : `prisma` et `@prisma/client` en ^7, ajout de `@prisma/adapter-better-sqlite3`, `better-sqlite3`, `dotenv`, `tsx` (dev).
- **Schema** : `provider = "prisma-client"`, `output = "./generated/prisma"`, suppression de `url` dans le bloc `datasource` (géré par `prisma.config.ts`), suppression de `binaryTargets`.
- **prisma.config.ts** : Nouveau fichier à la racine (schema, migrations, seed, `datasource.url` via `env("DATABASE_URL")`). Chargement de `.env.local` puis `.env`.
- **Client** : `src/lib/prisma.ts` utilise `PrismaBetterSqlite3` et importe depuis `../../generated/prisma/client.js`. Réexport de `PrismaClient`, `Prisma`, et des types utilisés.
- **Imports** : Tous les `@prisma/client` ont été remplacés par `@/lib/prisma` (ou le chemin généré pour `prisma/mocks/recipes.ts`).
- **Seed** : `prisma/seed.ts` utilise l’adapter, `dotenv/config`, et importe depuis le client généré.
- **package.json** : `"type": "module"`, suppression de `prisma.seed` (défini dans `prisma.config.ts`), `engines.node` = `^20.19 || ^22.12 || >=24.0`.
- **.gitignore** : ajout de `/generated`.

## Prérequis

- **Node.js** : `^20.19`, `^22.12` ou `>=24.0` (obligatoire pour Prisma 7). Vérifier avec `node -v`.

## Commandes à lancer

```bash
# Avec Node 20.19+ ou 22.12+
yarn install
npx prisma generate
npx dotenv -e .env.local -- prisma migrate dev   # si besoin
npx dotenv -e .env.local -- prisma db seed
yarn build:prod
```

## Pas d’Accelerate

Aucun usage de Prisma Accelerate détecté. Connexion en **Direct TCP** via l’adapter SQLite (`@prisma/adapter-better-sqlite3`).

## Enums avec `@map`

Le schéma actuel n’utilise pas d’enums avec `@map`. Si tu en ajoutes plus tard, voir la doc Prisma v7 (changement de comportement des valeurs générées et bug connu #28591).
