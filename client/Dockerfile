FROM node:22.12.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/log/nginx

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]