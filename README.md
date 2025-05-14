# coquo

⚠️ WORK IN PROGRESS ⚠️

Self hosted recipe manager written in Next.js.

## Needed for v1

- [ ] Add a "Keep screen awake" feature => https://www.npmjs.com/package/react-screen-wake-lock
- [x] Add "Season" to recipes
- [x] Add a Favorite star to recipes
- [x] Add a step list with checkboxes to grey out completed steps
- [x] Find a way to label recipes (tags ?)
- [x] Une page CHANGELOG
- [ ] Image compression with https://dev.to/franciscomendes10866/image-compression-with-node-js-4d7h
- [ ] Upload a profile picture when credentials signin
- [ ] Google OAuth
- [ ] Difficulty input in create form
- [ ] Redesign create form
- [ ] Edit recipe
- [ ] Add remaining filters:
  - [x] Title text search
  - [x] Tags
  - [ ] Author
  - [ ] Difficulty

## Feature Ideas
- [ ] fuzzy text search
- [ ] Create new tags
- [ ] Implement push notifications for PWA
- [ ] Add a "Print" feature => https://www.npmjs.com/package/react-to-print
- [ ] Add a HTML parser with package cheerio, then https://github.com/Charlie85270/recipes-parser to get recipes from marmiton

## Docker push

```bash
yarn docker:build
docker tag coquo atocqueville/coquo:latest
docker push atocqueville/coquo
```
