#!/bin/sh
set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups/$TIMESTAMP"
mkdir -p "$BACKUP_DIR"

echo "[INFO] Starting backup at $TIMESTAMP"

# --- MySQL Dump ---
echo "[INFO] Dumping MariaDB..."
mysqldump -h "$MYSQL_HOST" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" > "$BACKUP_DIR/mariadb.sql"

# --- MongoDB Dump ---
echo "[INFO] Dumping MongoDB..."
mongodump --host "$MONGO_HOST" -u "$MONGO_USER" -p "$MONGO_PASSWORD" --authenticationDatabase admin --out "$BACKUP_DIR/mongodb"

echo "[INFO] Backup completed successfully at $BACKUP_DIR"
