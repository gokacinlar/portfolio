#!/usr/bin/env bash

# This bash script will initiate an empty local WordPress site for my back-end in root, in a /wp folder
# ***Requires wp-cli***
# To install wp-cli: https://make.wordpress.org/cli/handbook/guides/installing/#recommended-installation

# Set strict bash
set -euo pipefail
IFS=$'\n\t'

# Dirs & env
DIR="/wp"
ENV_FILE=".wp-env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env file not found"
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

# Create directory if it doesn't exist
mkdir -p "$DIR"
cd "$DIR"

# Download WordPress core files
wp core download --allow-root

# Create wp-config.php using variables from .env
wp config create \
    --dbname="$DB_NAME" \
    --dbuser="$DB_USER" \
    --dbpass="$DB_PASSWORD" \
    --dbhost="$DB_HOST" \
    --allow-root

# Install WordPress using variables from .env
wp core install \
    --url="$SITE_URL" \
    --title="$SITE_TITLE" \
    --admin_user="$ADMIN_USER" \
    --admin_password="$ADMIN_PASSWORD" \
    --admin_email="$ADMIN_EMAIL" \
    --allow-root

echo "WordPress installed at $DIR"

read -p "Do you want to start live server? (Y/N): " choice
case $choice in
  [Y]* ) 
  echo "Starting WordPress live server..."
  wp server --port=9821
  echo "Server started at port 9821..."
  ;;
  [N]* ) echo "Understood. Exiting..."; exit 0 ;;
  * ) echo "Invalid choice. Exiting..."; exit 2 ;;
esac