FROM --platform=linux/amd64 node:20 AS build
WORKDIR /usr/src/frontend

RUN npm install -g nuxi

COPY package.json .
RUN npm install


COPY . .

ENV NODE_OPTIONS=--max-old-space-size=16000

RUN nuxi build

FROM --platform=linux/amd64 node:20 AS release
WORKDIR /usr/src/frontend

COPY --from=build /usr/src/frontend/.output .output

# run the app
ENTRYPOINT [ "node", ".output/server/index.mjs" ]