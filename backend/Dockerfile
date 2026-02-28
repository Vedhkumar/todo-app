FROM node:25-alpine3.22 AS deps

WORKDIR /backend

COPY package*.json .

RUN --mount=type=cache,target=/root/.npm npm ci --only=production

FROM node:25-alpine3.22 AS runtime

WORKDIR /backend

USER node

COPY --from=deps --chown=node:node /backend/node_modules ./node_modules

COPY --chown=node:node src ./src

EXPOSE 3001

CMD ["node", "src/index.js"]

