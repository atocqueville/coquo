## [1.2.0] - 2026-03-12

### Fixed

- Fixed the starred recipe UI on recipe cards.

### Changed

- Migrated to Next.js custom server (single Node process: Express + Next.js, media mounted at `/media`, Prisma migrations on startup in production).
- Added a Changelog tab in /settings route.

### Removed

- PM2: dependency and ecosystem configs (`ecosystem.config.cjs`, `ecosystem.dev.config.cjs`); dev/start/stop/status scripts.
- `/api/image-proxy` route; images are served directly from `/media/`.

## [1.1.0] - 2026-03-11

### Changed

- Migrated to Prisma 7 (client generated in `prisma/generated/prisma`).

## [1.0.0] - 2025-05-27

### Added

- **Authentication**: Email/password sign-up and sign-in (better-auth), optional Google OAuth, email verification, session.
- **Account moderation**: New users require admin approval; redirect to `/auth/error` if not approved.
- **Recipes**: Create, edit, delete, and view details (ingredients, steps, difficulty, prep/cook time, servings); list with pagination.
- **Recipes with images**: Image upload via Express file-storage server, display via `/file-storage/media/` (Next.js Image compatible).
- **Tags**: System and user tags with colors; filter recipes by tags; create custom tags in Settings > Customization.
- **Favorites**: Star recipes, dedicated page at `/favorite`.
- **Search and filters**: Text search (`q`), filter by tags, filter by author.
- **Administration**: Settings > Administration tab (admin only) to approve, ban, or unban users; better-auth admin plugin.
- **Settings**: Account, customization (tags), administration, about/changelog.
- **Internationalization**: next-intl with French and English (`messages/fr.json`, `messages/en.json`), user locale.
- **PWA**: Manifest for install on device and offline use.
- **Keep screen awake**: Option on recipe page (react-screen-wake-lock) to prevent sleep while cooking.
- **UI**: Sidebar, mobile nav bar, Radix UI components, Tailwind theme.
- **Deployment**: Multi-stage Dockerfile, custom server (no PM2), Prisma migrations on startup, example `compose.yml`.
