# syntax=docker/dockerfile:1.6

FROM node:20-bullseye AS base
ENV NODE_ENV=production \
    NITRO_PRESET=node-server
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-bullseye AS runtime
ENV NODE_ENV=production \
    NITRO_PRESET=node-server \
    PORT=3000 \
    HOST=0.0.0.0
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
