FROM node:lts AS development
WORKDIR /app
ENTRYPOINT ["bash", "-c", "npm run start:dev"]

FROM node:lts-slim AS build
COPY . /build
WORKDIR /build
RUN npm i && \
    npm run build && \
    npm prune --omit=dev && \
    rm -f ./dist/tsconfig.build.tsbuildinfo && \
    rm -rf ./dist/node_modules && \
    mv -f ./node_modules ./dist/node_modules

FROM node:lts-slim AS production
COPY --from=build /build/dist /dist
RUN apt-get update && \
    apt-get install -y curl
HEALTHCHECK --interval=15s --timeout=5s --retries=2 --start-period=5s \
    CMD curl http://localhost:3000 || exit 1
WORKDIR /dist
CMD ["main.js"]
