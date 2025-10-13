FROM node:22-bookworm-slim AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY . .
FROM node:22-bookworm-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app .

EXPOSE 3001

CMD [ "npm", "start" ]