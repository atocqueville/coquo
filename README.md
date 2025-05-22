# coquo

⚠️ WORK IN PROGRESS ⚠️

Self hosted recipe manager written in Next.js.

## Feature Ideas
- [ ] i18n
- [ ] fuzzy text search
- [x] Create new tags
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
