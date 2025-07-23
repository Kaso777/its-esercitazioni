# syntax=docker/dockerfile:1
FROM php:8.3-cli-alpine

# OS & PHP extensions
RUN apk add --no-cache git curl libzip-dev unzip sqlite-dev && docker-php-ext-install pdo pdo_sqlite

# Composer (copied from the official image)
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www/html
COPY . .

# Install PHP dependencies at build time
RUN composer install --no-ansi --no-interaction --no-progress --prefer-dist

EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]