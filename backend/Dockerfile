# backend/Dockerfile
FROM node:20

# この Dockerfile はプロジェクトルート（torasen）を build context にする前提
WORKDIR /app

# Copy backend package.json for installing dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend source files
COPY backend/ ./

# 自己署名証明書と鍵（backend ディレクトリ内に置くこと）
COPY backend/cert.pem backend/key.pem ./

# フロントエンドをコピー（ビルドコンテキストのルートに合わせる）
COPY frontend ./frontend

CMD ["node", "index.js"]