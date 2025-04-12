FROM node:20-alpine AS build
WORKDIR /usr/src/frontend

RUN npm install -g nuxi

COPY package.json .
RUN npm install


COPY . .

ENV BUN_JSC_forceRAMSize=134217728

RUN npx nuxi build

FROM --platform=linux/amd64 node:20-alpine AS release
WORKDIR /usr/src/frontend

COPY --from=build /usr/src/frontend/.output .output

# run the app
ENTRYPOINT [ "node", ".output/server/index.mjs" ]