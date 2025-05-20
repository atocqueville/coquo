FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1
# Set prisma database url

# Generate Prisma client in node_modules, and generate .next directory with build
# It needs the local env var DATABASE_URL, to go deep only one level (NO IDEA WHY)
RUN yarn run build:prod

# Build express app in file-storage
RUN cd file-storage
RUN yarn --frozen-lockfile

# Production image, copy all the files and run next
FROM base AS runner

RUN npm install pm2 -g

WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL=file:../../config/db/db.sqlite3

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

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
COPY --from=builder --chown=nextjs:nodejs /app/ecosystem.config.js ./ecosystem.config.js

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"

CMD ["pm2-runtime", "ecosystem.config.js"]
