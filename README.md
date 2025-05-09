# coquo

WORK IN PROGRESS

Self hosted recipe manager written in Next.js.

## Ideas

- [x] Ajouter des tags a une recette (pays, rapide, végé, sophie...)
- [ ] Add a "Keep screen awake" feature => https://www.npmjs.com/package/react-screen-wake-lock
- [ ] Add a "Print" feature => https://www.npmjs.com/package/react-to-print
- [x] Add "Season" to recipes
- [x] Add a Favorite star to recipes
- [x] Add a step list with checkboxes to grey out completed steps
- [ ] Add a HTML parser with package cheerio, then https://github.com/Charlie85270/recipes-parser to get recipes from marmiton
- [ ] Implement push notifications for PWA
- [x] Separation entre entrées, plats, desserts dans la liste des recettes (fait via les tags ?)
- [ ] Une page CHANGELOG
- [ ] fuzzy text search
- [ ] Image compression with https://dev.to/franciscomendes10866/image-compression-with-node-js-4d7h
- [ ] Upload a profile picture when credentials signin
- [ ] Google OAuth

## Docker push

```bash
yarn docker:build
docker tag coquo atocqueville/coquo:latest
docker push atocqueville/coquo
```
