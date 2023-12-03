# FROM node:18-alpine
FROM node:18.18-buster-slim
RUN apt-get update && apt-get install openssl -y
RUN mkdir -p /app
COPY app/ /app
WORKDIR /app

RUN yarn
RUN yarn build
RUN yarn prisma:gen:prod
RUN yarn init-db:prod

EXPOSE 3000
CMD ["yarn", "start:prod"]


# FROM node:18.18-buster-slim AS base


# WORKDIR /app

# COPY package.json yarn.lock ./

# FROM base as build

# RUN export NODE_ENV=production
# RUN yarn

# COPY . .
# RUN yarn run prisma:generate
# RUN yarn build

# FROM base as prod-build

# RUN yarn install --production
# COPY prisma prisma
# RUN yarn run prisma:generate
# RUN cp -R node_modules prod_node_modules

# FROM base as prod

# COPY --from=prod-build /app/prod_node_modules /app/node_modules
# COPY --from=build  /app/.next /app/.next
# COPY --from=build  /app/public /app/public
# COPY --from=build  /app/prisma /app/prisma

# EXPOSE 3000
# CMD ["yarn", "start"]