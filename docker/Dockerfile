FROM node:18.17.1-buster

WORKDIR /app

RUN apt-get update && apt install -y nginx \
    libx11-xcb1 \
    libxrandr2 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxfixes3 \
    libxi6 \
    libxtst6 \
    libgtk-3-0 \
    libatk1.0-0 \
    libasound2 \
    libdbus-glib-1-2 \
    libdbus-1-3 \
    libnspr4 \
    libdrm2 \
    libgbm1 \
    libnss3

COPY . .

ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm install --force 
RUn npm run build
RUN npx playwright install

RUN cp /app/docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

ENV PROXY_PASS=http://127.0.0.1:3030

RUN chmod +x /app/docker/entrypoint.sh

CMD ["/app/docker/entrypoint.sh"]