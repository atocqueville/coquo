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
- 🏷️ **Tag organization** - Create and assign tags to keep your recipes organized
- 🔒 **Self-hosted** - Keep your recipe data private and under your control
- ⏰ **Keep screen awake** - Prevent your device from sleeping while cooking
- 🔐 **Whitelist management** - Grant or revoke user access to your recipe collection

## Features to Come

- 🖨️ **Print-friendly format** - Print your recipes with a clean layout
- 🌙 **Dark mode** - Easy on the eyes during those late-night cooking sessions
- 🔔 **Push notifications** - Stay updated with recipe reminders
- 🔄 **Recipe import** - Import recipes from popular cooking websites with cheerio
- 🌐 **Internationalization** - Support for multiple languages
- 💬 **Comments** - Add notes and comments to each recipe
- 🔍 **Fuzzy text search** - Find recipes quickly even with partial or misspelled terms

## Preview

<img src="public/screenshot.jpeg" alt="Coquo Screenshot"/>

## Usage

- with docker-cli

```bash
docker run -d \
  --name coquo \
  -p 3030:3000 \
  -v ./config:/config \
  atocqueville/coquo:latest
```

- with docker compose (**recommended**)

```
services:
  coquo:
    container_name: coquo
    image: atocqueville/coquo:latest
    ports:
      - 3030:3000
    volumes:
      - ./config:/config
    environment:
      - AUTH_URL=**insert your production domain**/api/auth
      - AUTH_SECRET="insert a hash secret"

```
## Development

To start the development server:

```bash
yarn install # Install every needed dependencies
yarn prisma:reset # Remove your eventual existing database, creates an empty one and plays migrations

yarn dev # Start the Next.js web app
yarn start:fs # Start the file uploader proxy in another terminal
```

You can then log in with the combo `alex@admin.io` / `azerty`

### Building and pushing the Docker image

```bash
yarn docker:build
docker tag coquo atocqueville/coquo:latest
docker push atocqueville/coquo
```

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM and toolkit
- [Auth.js](https://authjs.dev/) - Authentication library
- [Docker](https://www.docker.com/) - Containerization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
