# 1) Use an ARM64 Ruby base
FROM --platform=linux/arm64 ruby:3.2

# 2) Install OS packages: Node (for Webpacker/Vite/etc.) & Postgres client
RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends \
      nodejs \
      postgresql-client \
 && rm -rf /var/lib/apt/lists/*

# 3) Set working dir
WORKDIR /app

# 4) Cache and install gems
COPY Gemfile Gemfile.lock ./
RUN bundle install --jobs=4 --retry=3

# 5) Copy the rest of the app
COPY . .

# 6) Make sure our entrypoint is executable
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

# 7) Remove any old server.pid, then launch
ENTRYPOINT ["entrypoint.sh"]

# 8) Expose and start Puma
EXPOSE 3000
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
