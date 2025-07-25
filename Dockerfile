#------------ Stage 1: Build ------------
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./

RUN npm ci --omit=dev --legacy-peer-deps

COPY . .

#------------ Stage 2: Production ------------
FROM node:20-alpine AS production
ENV NODE_ENV=production

WORKDIR /app
COPY --from=builder /app /app

EXPOSE 5000
CMD ["node", "src/index.js"]
