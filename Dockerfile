# Browser demo of OasisOS. One process, one port. The Electron app is unchanged.
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages ./packages
COPY native ./native
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build:web

FROM node:24-bookworm-slim
WORKDIR /app
COPY --from=build /app/dist/web ./dist/web
COPY server/web-server.mjs ./server/web-server.mjs
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server/web-server.mjs"]
