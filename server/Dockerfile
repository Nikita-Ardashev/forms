FROM node:22.12.0-alpine as production

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY .env ./

RUN mkdir -p logs

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]