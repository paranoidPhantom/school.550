FROM oven/bun:1 AS dependencies
WORKDIR /usr/src/frontend

COPY package.json .

RUN bun install

FROM node:22-alpine AS build
WORKDIR /usr/src/frontend

COPY --from=dependencies /usr/src/frontend/node_modules ./node_modules
COPY . .
RUN npm install -g nuxi

ENV NODE_OPTIONS="--max-old-space-size=12288"
ARG ROBOTS_NO_INDEX
ENV ROBOTS_NO_INDEX=$ROBOTS_NO_INDEX

RUN npx nuxi build

FROM node:22-alpine AS release
WORKDIR /usr/src/frontend

COPY --from=build /usr/src/frontend/.output .output

# run the app
ENTRYPOINT [ "node", ".output/server/index.mjs" ]
