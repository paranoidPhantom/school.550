FROM node:22-alpine AS build
WORKDIR /usr/src/frontend

RUN npm install -g nuxi

COPY package.json .
RUN npm install


COPY . .

ENV NODE_OPTIONS="--max-old-space-size=12288"

RUN npx nuxi build

FROM --platform=linux/amd64 node:20-alpine AS release
WORKDIR /usr/src/frontend

COPY --from=build /usr/src/frontend/.output .output

# run the app
ENTRYPOINT [ "node", ".output/server/index.mjs" ]
