#!/bin/sh

if [ "$COMMAND" = "test" ]; then
  npm run serve &
  npx playwright test
else
  nginx -g "daemon off;"
fi