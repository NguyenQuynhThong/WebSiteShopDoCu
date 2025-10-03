# Dockerfile cho LAG Vintage Shop Backend
FROM node:18-alpine

# Cài đặt curl cho health check
RUN apk add --no-cache curl

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có)
COPY backend/package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ source code backend
COPY backend/ ./

# Sao chép frontend static files
COPY frontend/ ./frontend/

# Tạo thư mục cho images và sao chép images
RUN mkdir -p images
COPY backend/images/ ./images/

# Tạo thư mục cho uploads nếu cần
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/test-db || exit 1

# Chạy ứng dụng
CMD ["npm", "start"]