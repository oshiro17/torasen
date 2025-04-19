#!/usr/bin/env bash
set -e

# 古い PID が残っていたら削除
rm -f /app/tmp/pids/server.pid

# DB がまだなら作って、マイグレーションも実行
bundle exec rails db:create db:migrate

# 最後に Rails サーバを起動
exec "$@"
