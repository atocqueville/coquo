# Migration Auth.js → Better-Auth

Ce document détaille le processus de migration de l'authentification de **Auth.js (NextAuth v5)** vers **Better-Auth** pour l'application Coquo.

## Objectifs

- ✅ Éliminer la variable d'environnement `AUTH_URL` → **Non nécessaire** (auto-détection Next.js)
- ✅ Éliminer la variable d'environnement `AUTH_SECRET` → **Génération automatique**
- ✅ Réduire l'overhead de Auth.js
- ✅ Garder les fonctionnalités existantes (credentials + Google OAuth)
- ✅ Conserver le système de rôles (ADMIN/USER)
- ✅ Maintenir la vérification d'email (validation admin)

### 🎉 Résultat : Zéro variable d'environnement auth à configurer !

| Variable | Auth.js (avant) | Better-Auth (après) |
|----------|-----------------|---------------------|
| `AUTH_URL` | ❌ Requis | ✅ Auto-détecté par Next.js |
| `AUTH_SECRET` | ❌ Requis | ✅ Auto-généré dans `/config/auth-secret.txt` |

## Stratégie pour les variables d'environnement

### `BETTER_AUTH_URL` - Non nécessaire ✅

Better Auth utilise `baseURL` pour :
- Callbacks OAuth (Google)
- Origine des cookies de session
- Liens dans les emails

**Pourquoi on peut s'en passer :**
1. **Auto-détection Next.js** : Better Auth détecte automatiquement l'URL via les headers HTTP (`host`, `x-forwarded-host`)
2. **Pas d'emails automatiques** : L'app utilise une vérification manuelle par admin, donc pas besoin de générer des liens email
3. **OAuth fonctionne** : Les callbacks Google utilisent l'URL détectée automatiquement

### `BETTER_AUTH_SECRET` - Génération automatique ✅

**Choix retenu : Génération automatique au premier démarrage avec persistance**

Le secret sera généré automatiquement au premier lancement de l'application et persisté dans le volume Docker `/config`.

```
/config/
├── db/
│   └── db.sqlite3      # Base de données existante
└── auth-secret.txt     # Nouveau: secret auto-généré
```

**Avantages :**
- Zero configuration pour l'utilisateur
- Secret unique par instance
- Persisté entre les redémarrages via le volume Docker existant

## État actuel de l'application

### Packages Auth.js utilisés
- `next-auth@5.0.0-beta.28`
- `@auth/prisma-adapter@2.9.1`

### Fichiers d'authentification actuels
| Fichier | Description |
|---------|-------------|
| `src/auth.ts` | Configuration principale NextAuth |
| `src/auth.config.ts` | Configuration des providers (Google + Credentials) |
| `src/lib/auth.ts` | Helpers `currentUser()` et `currentRole()` |
| `src/middleware.ts` | Protection des routes, vérification email |
| `src/app/api/auth/[...nextauth]/route.ts` | Route API NextAuth |
| `src/components/auth-buttons.tsx` | Bouton de déconnexion |
| `src/hooks/use-current-role.tsx` | Hook client pour le rôle |
| `src/components/auth/auto-verification-checker.tsx` | Vérification auto du statut email |

### Fonctionnalités d'auth actuelles
1. **Connexion par credentials** (email/password)
2. **Connexion Google OAuth**
3. **Système de rôles** (ADMIN/USER) - Premier utilisateur = ADMIN
4. **Vérification d'email** - Validée manuellement par admin
5. **Protection des routes** via middleware
6. **Session JWT** (pas de sessions en DB)

### Variables d'environnement actuelles (Docker)
```env
AUTH_URL=http://localhost:3030/api/auth
AUTH_SECRET="define_auth_secret"
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## Plan de migration

### Phase 1: Préparation

- [ ] **1.1** Sauvegarder l'état actuel (commit Git)
- [ ] **1.2** Lire la documentation complète de Better-Auth
- [ ] **1.3** Identifier les équivalences de fonctionnalités

### Phase 2: Installation et configuration de base

- [ ] **2.1** Installer Better-Auth
  ```bash
  yarn add better-auth
  ```

- [ ] **2.2** Créer le helper de génération/récupération du secret
  - Fichier: `src/lib/auth-secret.ts`
  ```typescript
  import { randomBytes } from 'crypto';
  import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
  import path from 'path';

  // En production Docker, utilise /config (volume persistant)
  // En dev, utilise le dossier local .auth
  const CONFIG_DIR = process.env.NODE_ENV === 'production' 
    ? '/config' 
    : path.join(process.cwd(), '.auth');
  const SECRET_FILE = path.join(CONFIG_DIR, 'auth-secret.txt');

  export function getAuthSecret(): string {
    // Si variable d'environnement définie, l'utiliser (override manuel possible)
    if (process.env.BETTER_AUTH_SECRET) {
      return process.env.BETTER_AUTH_SECRET;
    }

    // Vérifier si le secret existe déjà
    if (existsSync(SECRET_FILE)) {
      return readFileSync(SECRET_FILE, 'utf-8').trim();
    }

    // Créer le dossier si nécessaire
    if (!existsSync(CONFIG_DIR)) {
      mkdirSync(CONFIG_DIR, { recursive: true });
    }

    // Générer un nouveau secret
    const newSecret = randomBytes(32).toString('base64');
    writeFileSync(SECRET_FILE, newSecret, { mode: 0o600 });
    
    console.log('🔐 Auth secret generated and saved to', SECRET_FILE);
    return newSecret;
  }
  ```

- [ ] **2.3** Ajouter `.auth/` au `.gitignore` (pour le dev local)
  ```gitignore
  # Auth secret (dev)
  .auth/
  ```

- [ ] **2.4** Créer la nouvelle instance Better-Auth
  - Fichier: `src/lib/better-auth.ts`
  - Configuration database avec Prisma adapter
  - Configuration email/password
  - Configuration Google OAuth
  - Utilisation de `getAuthSecret()` pour le secret

### Phase 3: Adaptation du schéma Prisma

- [ ] **3.1** Comparer le schéma actuel avec celui requis par Better-Auth
  
  **Schéma actuel:**
  - `User`: id, name, email, emailVerified, password, role, image, locale, isBlocked
  - `Account`: pour OAuth (Google)
  
  **Better-Auth requiert:**
  - `user`: id, name, email, emailVerified, image, createdAt, updatedAt
  - `session`: id, expiresAt, token, createdAt, updatedAt, ipAddress, userAgent, userId
  - `account`: id, accountId, providerId, userId, accessToken, refreshToken, etc.
  - `verification`: id, identifier, value, expiresAt, createdAt, updatedAt

- [ ] **3.2** Mettre à jour `prisma/schema.prisma`
  - Ajouter la table `Session` (Better-Auth utilise sessions DB, pas JWT)
  - Ajouter la table `Verification`
  - Adapter les champs existants si nécessaire
  - Garder les champs custom (role, locale, isBlocked)

- [ ] **3.3** Générer et appliquer la migration Prisma
  ```bash
  yarn prisma:migrate add_better_auth_tables
  ```

### Phase 4: Configuration Better-Auth

- [ ] **4.1** Créer `src/lib/better-auth.ts` (serveur)
  ```typescript
  import { betterAuth } from "better-auth";
  import { prismaAdapter } from "better-auth/adapters/prisma";
  import { prisma } from "@/lib/prisma";
  import { getAuthSecret } from "@/lib/auth-secret";
  
  export const auth = betterAuth({
    // 🔐 Secret auto-généré et persisté dans /config/auth-secret.txt
    secret: getAuthSecret(),
    
    // 🌐 baseURL non défini = auto-détection via headers Next.js
    // (pas besoin de BETTER_AUTH_URL !)
    
    database: prismaAdapter(prisma, {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
      // Configuration password hashing (bcrypt déjà utilisé)
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    // Plugins pour fonctionnalités additionnelles
    plugins: [],
    // Callbacks pour logique custom (rôles, premier user admin, etc.)
  });
  ```

- [ ] **4.2** Créer `src/lib/auth-client.ts` (client)
  ```typescript
  import { createAuthClient } from "better-auth/react";
  
  export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
  });
  
  export const { signIn, signOut, signUp, useSession } = authClient;
  ```

- [ ] **4.3** Créer la route API
  - Fichier: `src/app/api/auth/[...all]/route.ts`
  ```typescript
  import { auth } from "@/lib/better-auth";
  import { toNextJsHandler } from "better-auth/next-js";
  
  export const { GET, POST } = toNextJsHandler(auth.handler);
  ```

### Phase 5: Migration des composants

- [ ] **5.1** Migrer `src/components/auth-buttons.tsx`
  - Remplacer `signOut` de next-auth par Better-Auth

- [ ] **5.2** Migrer `src/app/auth/login/login-form.tsx`
  - Adapter l'appel `signIn('credentials', ...)` pour Better-Auth

- [ ] **5.3** Migrer `src/app/auth/login/social-login.tsx`
  - Adapter l'appel `signIn('google')` pour Better-Auth

- [ ] **5.4** Migrer `src/app/auth/register/register-form.tsx`
  - Utiliser `signUp` de Better-Auth (gère la création user)
  - Adapter la logique "premier user = admin"

- [ ] **5.5** Migrer `src/hooks/use-current-role.tsx`
  - Utiliser `useSession` de Better-Auth

- [ ] **5.6** Migrer `src/components/auth/auto-verification-checker.tsx`
  - Adapter pour Better-Auth session

### Phase 6: Migration du middleware

- [ ] **6.1** Réécrire `src/middleware.ts`
  ```typescript
  import { NextRequest, NextResponse } from "next/server";
  import { auth } from "@/lib/better-auth";
  
  export async function middleware(request: NextRequest) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    
    // Logique de protection des routes
    // Logique de vérification email
    // Logique de redirection
  }
  ```

### Phase 7: Migration des helpers serveur

- [ ] **7.1** Réécrire `src/lib/auth.ts`
  ```typescript
  import { auth } from "@/lib/better-auth";
  import { headers } from "next/headers";
  
  export const currentUser = async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user;
  };
  
  export const currentRole = async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user?.role;
  };
  ```

- [ ] **7.2** Adapter tous les fichiers utilisant `auth()` de NextAuth
  - `src/auth.ts` → remplacer par import de better-auth
  - `src/lib/api/recipe.ts` → adapter les appels `await auth()`
  - `src/i18n/request.ts` → adapter
  - `src/app/(home)/settings/account/account-wrapper.tsx` → adapter
  - `src/app/(home)/r/[id]/components/recipe.tsx` → adapter

### Phase 8: Gestion des rôles et permissions

- [ ] **8.1** Installer et configurer le [Plugin Admin](https://www.better-auth.com/docs/plugins/admin)
  ```typescript
  import { betterAuth } from "better-auth";
  import { admin } from "better-auth/plugins";
  
  export const auth = betterAuth({
    // ... config
    plugins: [
      admin({
        defaultRole: "user",
        // adminRoles: ["admin"], // rôles avec accès admin
      }),
    ],
  });
  ```
  
  Le plugin Admin fournit :
  - ✅ Champ `role` sur User (par défaut: "user", "admin")
  - ✅ Fonction `banUser()` / `unbanUser()` → remplace `isBlocked`
  - ✅ `listUsers()` pour l'administration
  - ✅ `setRole()` pour changer les rôles

- [ ] **8.2** Implémenter la logique "premier utilisateur = admin" via [Hooks](https://www.better-auth.com/docs/concepts/hooks)
  ```typescript
  import { betterAuth } from "better-auth";
  import { prisma } from "@/lib/prisma";
  
  export const auth = betterAuth({
    // ...
    hooks: {
      after: [
        {
          matcher: (context) => context.path === "/sign-up/email",
          handler: async (ctx) => {
            // Vérifier si c'est le premier utilisateur
            const userCount = await prisma.user.count();
            if (userCount === 1) {
              // Promouvoir en admin
              await prisma.user.update({
                where: { id: ctx.context.user.id },
                data: { role: "admin" },
              });
            }
          },
        },
      ],
    },
  });
  ```

- [ ] **8.3** Gérer le champ `locale` (préférence de langue)
  - Ajouter comme champ additionnel sur le modèle User
  - Utiliser les [Additional Fields](https://www.better-auth.com/docs/concepts/users-accounts) pour l'exposer dans la session

### Phase 9: Tests et validation

- [ ] **9.1** Tester l'inscription (credentials)
- [ ] **9.2** Tester la connexion (credentials)
- [ ] **9.3** Tester la connexion Google OAuth
- [ ] **9.4** Tester la déconnexion
- [ ] **9.5** Tester la protection des routes
- [ ] **9.6** Tester la vérification d'email (admin approval)
- [ ] **9.7** Tester le système de rôles (admin vs user)
- [ ] **9.8** Tester la persistance de session

### Phase 10: Nettoyage

- [ ] **10.1** Supprimer les anciennes dépendances
  ```bash
  yarn remove next-auth @auth/prisma-adapter
  ```

- [ ] **10.2** Supprimer les fichiers obsolètes
  - `src/auth.ts` (ancienne config NextAuth)
  - `src/auth.config.ts`
  - `src/app/api/auth/[...nextauth]/route.ts`

- [ ] **10.3** Mettre à jour `compose.yml`
  ```yaml
  services:
    coquo:
      container_name: coquo-next
      image: coquo
      ports:
        - 3030:3000
      volumes:
        - ./config:/config
      environment:
        # 🎉 AUTH_URL supprimé - auto-détecté par Next.js!
        # 🎉 AUTH_SECRET supprimé - auto-généré dans /config/auth-secret.txt!
        - GOOGLE_CLIENT_ID=your_google_client_id
        - GOOGLE_CLIENT_SECRET=your_google_client_secret
  ```
  
  **🎉 Résultat : Zéro variable d'auth à configurer !**
  
  Seules les variables Google OAuth restent nécessaires (car ce sont des credentials externes).

- [ ] **10.4** Vérifier que le Dockerfile n'a pas besoin de modifications
  - Le volume `/config` est déjà monté
  - Le secret sera créé automatiquement au premier démarrage

---

## Équivalences de code

### Session côté serveur

**Avant (NextAuth):**
```typescript
import { auth } from '@/auth';
const session = await auth();
const userId = session?.user?.id;
```

**Après (Better-Auth):**
```typescript
import { auth } from '@/lib/better-auth';
import { headers } from 'next/headers';

const session = await auth.api.getSession({
  headers: await headers(),
});
const userId = session?.user?.id;
```

### Session côté client

**Avant (NextAuth):**
```typescript
import { useSession } from 'next-auth/react';
const { data: session } = useSession();
```

**Après (Better-Auth):**
```typescript
import { useSession } from '@/lib/auth-client';
const { data: session } = useSession();
```

### Sign In (Credentials)

**Avant (NextAuth):**
```typescript
import { signIn } from 'next-auth/react';
await signIn('credentials', { email, password, redirectTo: '/' });
```

**Après (Better-Auth):**
```typescript
import { signIn } from '@/lib/auth-client';
await signIn.email({ email, password });
```

### Sign In (Google)

**Avant (NextAuth):**
```typescript
import { signIn } from 'next-auth/react';
signIn('google');
```

**Après (Better-Auth):**
```typescript
import { signIn } from '@/lib/auth-client';
signIn.social({ provider: 'google' });
```

### Sign Out

**Avant (NextAuth):**
```typescript
import { signOut } from 'next-auth/react';
signOut({ redirectTo: '/' });
```

**Après (Better-Auth):**
```typescript
import { signOut } from '@/lib/auth-client';
await signOut();
```

---

## Points d'attention

### 1. Sessions
Better-Auth utilise des **sessions stockées en base de données** par défaut, contrairement à NextAuth qui utilise JWT. Cela signifie:
- Plus de contrôle sur les sessions (révocation, liste des sessions actives)
- Légère augmentation des requêtes DB
- Meilleure sécurité

### 2. Hashage des mots de passe
L'application utilise actuellement `bcryptjs`. Better-Auth supporte bcrypt nativement, mais il faut s'assurer de la compatibilité des hash existants.

### 3. Migration des utilisateurs existants
Les utilisateurs existants avec leurs mots de passe hashés devraient fonctionner si le même algorithme de hashage est utilisé.

### 4. Variables d'environnement - Simplification totale 🎉

| Avant (Auth.js) | Après (Better-Auth) | Raison |
|-----------------|---------------------|--------|
| `AUTH_URL` | ❌ Supprimé | Auto-détecté via headers Next.js |
| `AUTH_SECRET` | ❌ Supprimé | Auto-généré dans `/config/auth-secret.txt` |
| `GOOGLE_CLIENT_ID` | ✅ Conservé | Credential externe Google |
| `GOOGLE_CLIENT_SECRET` | ✅ Conservé | Credential externe Google |

⚠️ **Note importante sur le secret auto-généré :**
- Le secret est créé au premier démarrage et persisté dans `/config/auth-secret.txt`
- Si ce fichier est supprimé, un nouveau secret sera généré et **toutes les sessions existantes seront invalidées**
- Pour une migration avec utilisateurs existants, il est recommandé de garder le même volume `/config`
- Override possible via la variable `BETTER_AUTH_SECRET` si nécessaire

💡 **Pourquoi `BETTER_AUTH_URL` n'est pas nécessaire :**
- Better-Auth détecte automatiquement l'URL via les headers HTTP de la requête
- L'app n'envoie pas d'emails automatiques (vérification manuelle par admin)
- Les callbacks OAuth fonctionnent avec l'URL auto-détectée

### 5. Champs custom sur User
Les champs `role`, `locale`, `isBlocked` ne font pas partie du schéma standard Better-Auth. Options:
- Étendre le schéma avec des colonnes additionnelles
- Utiliser les callbacks pour enrichir la session

---

## Ressources officielles Better-Auth

### Documentation principale
- [Documentation complète](https://www.better-auth.com/docs)
- [Index LLM](https://www.better-auth.com/llms.txt) - Structure complète de la doc

### Migration
- ⭐ [**Guide migration Auth.js → Better Auth**](https://www.better-auth.com/docs/guides/next-auth-migration-guide) - Guide officiel étape par étape

### Intégration
- [Intégration Next.js](https://www.better-auth.com/docs/integrations/next) - Setup API routes, middleware, client
- [Adaptateur Prisma](https://www.better-auth.com/docs/adapters/prisma) - Configuration avec Prisma ORM
- [Adaptateur SQLite](https://www.better-auth.com/docs/adapters/sqlite) - Spécificités SQLite

### Authentification
- [Email & Password](https://www.better-auth.com/docs/authentication/email-password) - Auth credentials
- [Google OAuth](https://www.better-auth.com/docs/authentication/google) - Social login Google

### Concepts clés
- [Hooks](https://www.better-auth.com/docs/concepts/hooks) - Personnaliser le comportement (ex: 1er user = admin)
- [Session Management](https://www.better-auth.com/docs/concepts/session-management) - Sessions en DB
- [User & Accounts](https://www.better-auth.com/docs/concepts/users-accounts) - Gestion utilisateurs, champs custom
- [Database](https://www.better-auth.com/docs/concepts/database) - Schéma requis

### Plugins pertinents
- ⭐ [**Plugin Admin**](https://www.better-auth.com/docs/plugins/admin) - Rôles, ban, permissions (ADMIN/USER)
- [Plugin Username](https://www.better-auth.com/docs/plugins/username) - Champ username optionnel

### Référence
- [Options de configuration](https://www.better-auth.com/docs/reference/options) - Toutes les options disponibles
- [Sécurité](https://www.better-auth.com/docs/reference/security) - Best practices sécurité
- [FAQ](https://www.better-auth.com/docs/reference/faq) - Questions fréquentes

---

## Progression

| Phase | Description | Statut |
|-------|-------------|--------|
| 1 | Préparation | ⏳ En attente |
| 2 | Installation et config de base | ⏳ En attente |
| 3 | Adaptation schéma Prisma | ⏳ En attente |
| 4 | Configuration Better-Auth | ⏳ En attente |
| 5 | Migration des composants | ⏳ En attente |
| 6 | Migration du middleware | ⏳ En attente |
| 7 | Migration des helpers serveur | ⏳ En attente |
| 8 | Gestion des rôles | ⏳ En attente |
| 9 | Tests et validation | ⏳ En attente |
| 10 | Nettoyage | ⏳ En attente |

---

*Document créé le: $(date)*
*Dernière mise à jour: À mettre à jour au fur et à mesure*

