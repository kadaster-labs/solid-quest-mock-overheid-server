
# First Stage: to install and build dependences
FROM node:gallium AS builder

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY src src
COPY data data

RUN npm run build && \
    npm prune --production


# Second Stage: use lightweight alpine image and run as non-root
FROM node:gallium-alpine

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

USER node

EXPOSE 8080

ENTRYPOINT node ./dist/src/main.js
