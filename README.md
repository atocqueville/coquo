# coquo

WORK IN PROGRESS

Self hosted recipe manager written in Next.js.

## Ideas

- [ ] Add a "Keep screen awake" feature => https://www.npmjs.com/package/react-screen-wake-lock
- [ ] Add a "Print" feature => https://www.npmjs.com/package/react-to-print
- [ ] Add "Season" to recipes
- [ ] Add a Favorite star to recipes
- [ ] Add a step list with checkboxes to grey out completed steps
- [ ] Add a HTML parser with package cheerio, then https://github.com/Charlie85270/recipes-parser
- [ ] Implement push notifications for PWA
- [ ] Separation entre entrées, plats, desserts dans la liste des recettes

## Docker push

```bash
yarn docker:build
docker tag coquo atocqueville/coquo:latest
docker push atocqueville/coquo
```
