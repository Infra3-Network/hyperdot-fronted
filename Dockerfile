FROM node:18.17.1-buster AS builder

WORKDIR /app

COPY . .

ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm install --force

RUN npm run build

# 第二阶段：使用 Nginx 镜像运行
FROM nginx:latest

EXPOSE 80

# 复制第一阶段编译产物到 Nginx 的默认站点目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置文件到容器
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 设置容器启动时执行的命令，Nginx 默认会启动
CMD ["nginx", "-g", "daemon off;"]