# backend/Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

# ここでプロジェクト全体をコピー
COPY . .

# ←★ 追加：自己署名証明書と鍵をイメージ内にコピー
# cert.pem と key.pem が backend ディレクトリ直下に置いてある前提
COPY cert.pem key.pem ./

CMD ["node", "index.js"]