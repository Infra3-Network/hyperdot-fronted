#!/bin/sh

if [ "$COMMAND" = "test" ]; then
  npm run serve &
  npx playwright test
else
    echo "server {
      listen 80;
      gzip on;
      gzip_min_length 1k;
      gzip_comp_level 9;
      gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
      gzip_vary on;
      gzip_disable \"MSIE [1-6]\\.\";

      root /app/dist;

      location / {
          try_files \$uri \$uri/index.html /index.html;
      }
      location /apis {
          proxy_pass $PROXY_PASS;
          proxy_set_header   X-Forwarded-Proto \$scheme;
          proxy_set_header   X-Real-IP         \$remote_addr;
      }
  }" | tee /etc/nginx/conf.d/default.conf > /dev/null


  nginx -g "daemon off;"
fi