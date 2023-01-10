FROM node:latest AS development
VOLUME ["/app"]
HEALTHCHECK --interval=15s --timeout=2s --start-period=60s \
    CMD curl http://localhost:3000 || exit 1
WORKDIR /app
ENTRYPOINT ["bash", "-c", "npm ci && npm run start:dev"]

FROM node:latest AS build
COPY . /build
WORKDIR /build
RUN npm ci && \
    npm run build && \
    npm prune --omit=dev && \
    rm ./dist/tsconfig.build.tsbuildinfo && \
    mv ./node_modules ./dist/node_modules

FROM gcr.io/distroless/nodejs18-debian11:latest AS production
COPY --from=build /build/dist /dist
HEALTHCHECK --interval=10s --timeout=2s --start-period=5s \
    CMD curl http://localhost:3000 || exit 1
WORKDIR /dist
CMD ["main.js"]

EXPOSE 3000
