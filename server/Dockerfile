# Dockerfile.server
FROM node:22.12.0-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN npm run db

EXPOSE 3000

CMD ["node", "dist/server.js"]

FROM node:22.12.0-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=development /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]