# coquo

⚠️ WORK IN PROGRESS ⚠️

Self hosted recipe manager written in Next.js.

## Needed for v1

- [x] Get a Logo (and a color scheme ?)
- [x] Add a "Keep screen awake" feature => https://www.npmjs.com/package/react-screen-wake-lock
- [x] Add "Season" to recipes
- [x] Add a Favorite star to recipes
- [x] Add a step list with checkboxes to grey out completed steps
- [x] Find a way to label recipes (tags ?)
- [x] Image compression with https://dev.to/franciscomendes10866/image-compression-with-node-js-4d7h
- [ ] Google OAuth
- [x] Redesign create form
  - [x] Add difficulty input
  - [x] Add option to be in edit mode
- [x] Add remaining filters:
  - [x] Title text search
  - [x] Tags
  - [x] Author

## Feature Ideas
- [ ] i18n
- [ ] fuzzy text search
- [ ] Create new tags
- [ ] Implement push notifications for PWA
- [ ] Add a "Print" feature => https://www.npmjs.com/package/react-to-print
- [ ] Add a HTML parser with package cheerio, then https://github.com/Charlie85270/recipes-parser to get recipes from marmiton
- [ ] Improve the keep screen awake switch design
- [ ] CHANGELOG page
- [ ] Upload a profile picture
- [ ] Comment section on each recipe

## Docker push

```bash
yarn docker:build
docker tag coquo atocqueville/coquo:latest
docker push atocqueville/coquo
```
