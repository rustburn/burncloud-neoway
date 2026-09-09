# ==========================================
# 阶段 1: 构建阶段 (Build Stage)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install --no-audit

# 复制源码并执行静态构建
COPY . .
RUN npm run build

# ==========================================
# 阶段 2: 开发阶段 (Dev Stage - 可配合 compose profile 使用)
# ==========================================
FROM node:20-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# ==========================================
# 阶段 3: 生产运行阶段 (Nginx Runner)
# ==========================================
FROM nginx:alpine AS runner

# 清理默认静态文件
RUN rm -rf /usr/share/nginx/html/*

# 复制产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露容器端口
EXPOSE 80

# 容器探针健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --spider -q http://localhost:80/healthz || exit 1

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
