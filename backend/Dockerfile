# M1 では ARM イメージを指定
FROM --platform=linux/arm64 ruby:3.2

# PostgreSQL クライアント等をインストール
RUN apt-get update -qq && \
    apt-get install -y nodejs postgresql-client

WORKDIR /app

# Ruby の依存をコピー＆インストール
COPY Gemfile* ./
RUN bundle install

# アプリ本体をコピー
COPY . .

# ポート3000で起動（Railsなら）
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
