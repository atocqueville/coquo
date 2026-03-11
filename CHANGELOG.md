# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-11

### Changed

- Migrate to Prisma 7 (client généré dans `prisma/generated/prisma`).

## [1.0.0] - 2025-05-27

### Added

- **Authentification** : inscription et connexion email/mot de passe (better-auth), option Google OAuth, vérification email, session.
- **Modération des comptes** : approbation des nouveaux utilisateurs par un admin ; redirection vers `/auth/error` si non approuvé.
- **Recettes** : création, édition, suppression, détail (ingrédients, étapes, difficulté, temps de préparation/cuisson, portions), liste avec pagination.
- **Recettes avec images** : upload d’images via le serveur Express file-storage, affichage via l’API image-proxy (compatible Next.js Image).
- **Tags** : tags système et utilisateur avec couleur, filtrage des recettes par tags, création de tags personnalisés dans Paramètres > Personnalisation.
- **Favoris** : mise en favori des recettes (starred), page dédiée `/favorite`.
- **Recherche et filtres** : recherche texte (`q`), filtre par tags, filtre par auteur.
- **Administration** : onglet Paramètres > Administration (réservé aux admins) pour approuver, bannir ou débannir des utilisateurs ; plugin better-auth admin.
- **Paramètres** : compte, personnalisation (tags), administration, à propos / changelog.
- **Internationalisation** : next-intl avec français et anglais (`messages/fr.json`, `messages/en.json`), locale utilisateur.
- **PWA** : manifest pour installation sur appareil et usage hors ligne.
- **Garder l’écran actif** : option sur la page recette (react-screen-wake-lock) pour éviter la mise en veille pendant la cuisine.
- **UI** : sidebar, barre de navigation mobile, composants Radix UI, thème Tailwind.
- **Déploiement** : Dockerfile multi-stage, image standalone Next.js, PM2 (migrations Prisma, app Next, file-storage), exemple `compose.yml`.