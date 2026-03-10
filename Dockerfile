FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl


########################################################
# DEPENDENCIES
########################################################
FROM base AS deps
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile


########################################################
# BUILDER
########################################################
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1
# BETTER_AUTH_SECRET is required at runtime; placeholder only for the Next.js build to pass
ENV BETTER_AUTH_SECRET=build-placeholder-not-used-at-runtime

# Generate Prisma client, then build the Next.js app
RUN yarn run build:prod

# Build express app in file-storage
WORKDIR /app/file-storage
RUN yarn --frozen-lockfile


########################################################
# PRODUCTION
########################################################
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL=file:../../config/db/db.sqlite3

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install only PM2 and Prisma CLI globally (minimal footprint)
# TODO use binaries
RUN npm install -g pm2@5.4.2 prisma@7.4.2

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma schema and migrations
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Express File-Storage
COPY --from=builder --chown=nextjs:nodejs /app/file-storage ./file-storage

# PM2 Config
COPY --from=builder --chown=nextjs:nodejs /app/ecosystem.config.cjs ./ecosystem.config.cjs

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"

CMD ["npx", "pm2-runtime", "ecosystem.config.cjs"]
