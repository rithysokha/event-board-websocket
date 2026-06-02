FROM node:20-alpine AS base

WORKDIR /app

FROM base AS deps

COPY package*.json ./
RUN npm ci --ignore-scripts

FROM base AS builder

ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run postinstall && npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

COPY --from=builder /app/.output ./.output

EXPOSE 3000

USER node

CMD ["node", ".output/server/index.mjs"]
