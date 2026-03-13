FROM node:22.12-alpine AS base
RUN apk add --no-cache openssl


########################################################
# DEPENDENCIES
########################################################
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci


########################################################
# PROD DEPS (for smaller runner image)
########################################################
FROM base AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev


########################################################
# BUILDER
########################################################
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="build-placeholder-not-used-at-runtime"

RUN npm run build


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

COPY --chown=nextjs:nodejs . .
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist

USER nextjs
EXPOSE 3847

CMD ["npm", "start"]
