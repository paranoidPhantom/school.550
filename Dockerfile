FROM node:20 AS build
WORKDIR /usr/src/frontend

RUN npm install -g bun
RUN npm install -g nuxi

COPY package.json .
RUN bun install


COPY . .

RUN nuxi build

FROM node:20 AS release
WORKDIR /usr/src/frontend

COPY --from=build /usr/src/frontend/.output .output

# run the app
ENTRYPOINT [ "node", ".output/server/index.mjs" ]