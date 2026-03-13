# Coquo

<div align="center">
<img src="public/logo.png" alt="Coquo Logo" width="200"/>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/docker/pulls/atocqueville/coquo)](https://hub.docker.com/r/atocqueville/coquo)
[![GitHub issues](https://img.shields.io/github/issues/atocqueville/coquo)](https://github.com/atocqueville/coquo/issues)
[![GitHub stars](https://img.shields.io/github/stars/atocqueville/coquo)](https://github.com/atocqueville/coquo/stargazers)

**Self-hosted recipe manager built with modern web technologies**
</div>

## Introduction

Coquo is a modern, self-hosted recipe management application built with Next.js. It allows you to save, organize, and search your favorite recipes in a clean, user-friendly interface that's accessible from any device.

> ⚠️ **Note**: This project is still under active development!

## Features

- 📱 **Progressive Web App** - Install on any device and access your recipes offline
- 🔒 **Self-hosted** - Keep your recipe data private and under your control
- 🏷️ **Tag organization** - Create and assign tags to keep your recipes organized
- ⏰ **Keep screen awake** - Prevent your device from sleeping while cooking
- 🔐 **Whitelist management** - Grant or revoke user access to your recipe collection
- 🌐 **Internationalization** - Support for multiple languages (EN, FR)

## Features to Come

- 🖨️ **Print-friendly format** - Print your recipes with a clean layout
- 🌙 **Dark mode** - Easy on the eyes during those late-night cooking sessions
- 🔔 **Push notifications** - Stay updated with recipe reminders
- 🔄 **Recipe import** - Import recipes from popular cooking websites with cheerio
- 💬 **Comments** - Add notes and comments to each recipe

## Preview

<img src="public/screenshot.jpeg" alt="Coquo Screenshot"/>

## Usage

- with docker compose (**recommended**)

```yaml
services:
  coquo:
    container_name: coquo
    image: atocqueville/coquo:latest
    ports:
      - 3847:3847
    volumes:
      - ./config:/config
    environment:
      - AUTH_SECRET=****   # Required, used for encryption, signing, and hashing
```

### Add Google Sign In Provider

To enable Google Sign In, you'll need to set up OAuth credentials in the Google Cloud Console:

1. **Create a Google Cloud Project** (if you don't have one):
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Select "Web application" as the application type
   - Add:
     - Authorized Javascript origins: `https://yourdomain.com`
     - Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`

3. **Configure Docker Environment Variables**:
```yaml
    environment:
      - AUTH_SECRET=****
      - GOOGLE_CLIENT_ID=your_google_client_id # Required to use Google OAuth
      - GOOGLE_CLIENT_SECRET=your_google_client_secret # Required to use Google OAuth
      - OAUTH_AUTH_URL=https://yourdomain.com # Required to use Google OAuth
```

## Development

**Prerequisites**: Node.js 22.x, npm. You can `nvm use` in project root.

Start the development server:

```bash
npm install
npm run db:reset   # Recreates the database, runs migrations
npm run db:seed    # Seed the database with fake data
npm run dev        # Serves on port 3847
```

Test login: `admin@coquo.io` / `azerty` at http://localhost:3847

### Building the Docker image locally

```bash
npm run docker:build
docker tag coquo:latest coquo:dev
docker compose up
```

The repo's `compose.yml` uses the image `coquo:dev` and sets dev environment variables.

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM and toolkit
- [Better-auth](https://www.better-auth.com/) - Authentication library
- [Docker](https://www.docker.com/) - Containerization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
