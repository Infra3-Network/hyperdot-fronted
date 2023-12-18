FROM node:18.17.1-buster AS builder

WORKDIR /app

COPY . .

ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm install --force

RUN npm run build

FROM nginx:latest

EXPOSE 80

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
