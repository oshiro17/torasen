FROM --platform=linux/arm64 node:18-alpine

WORKDIR /app

# 依存定義を先にコピーしてインストール
COPY package*.json ./
RUN npm install

# アプリ本体をコピー
COPY . .

# 開発サーバ起動
CMD ["npm", "start"]
