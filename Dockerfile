FROM node:20.19-alpine AS base
RUN apk add --no-cache openssl


########################################################
# DEPENDENCIES
########################################################
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile


########################################################
# PROD DEPS (for smaller runner image)
########################################################
FROM base AS prod-deps
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install --production --frozen-lockfile


########################################################
# BUILDER
########################################################
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV BETTER_AUTH_SECRET=build-placeholder-not-used-at-runtime
ENV DATABASE_URL="build-placeholder-not-used-at-runtime"

RUN yarn build


########################################################
# PRODUCTION
########################################################
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL=file:../../config/db/db.sqlite3
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3847
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder /app/CHANGELOG.md ./CHANGELOG.md

USER nextjs
EXPOSE 3847

CMD ["npm", "start"]
