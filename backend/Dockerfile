FROM node:lts-slim AS development
RUN apt-get update && apt-get install -y curl
HEALTHCHECK --interval=15s --timeout=2s --retries=2 --start-period=30s \
    CMD curl http://localhost:3000 || exit 1
WORKDIR /app
ENTRYPOINT ["bash", "-c", "npm ci && npm run start:dev"]

FROM node:lts-slim AS build
COPY . /build
WORKDIR /build
#RUN npm ci
RUN npm run build
#RUN npm prune --omit=dev
RUN npm run start:prod
#RUN rm -f ./dist/tsconfig.build.tsbuildinfo
#RUN rm -rf ./dist/node_modules
#RUN mv -f ./node_modules ./dist/node_modules

FROM node:lts-slim AS production
COPY --from=build /build/dist /dist
RUN apt-get update && apt-get install -y curl
HEALTHCHECK --interval=10s --timeout=2s --retries=2 --start-period=5s \
    CMD curl http://localhost:3000 || exit 1
WORKDIR /dist
CMD ["main.js"]

#EXPOSE 3000
