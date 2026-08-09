#!/bin/bash
# =====================================================================
# Instalación y configuración de MariaDB para la API Nakeema
# Evidencia: GA7-220501096-AA5-EV04 "API del proyecto"
# Uso: sudo bash instalar_mariadb.sh
# =====================================================================

set -e

echo "==> [1/4] Instalando MariaDB Server..."
dnf install -y mariadb-server

echo "==> [2/4] Iniciando el servicio..."
systemctl enable --now mariadb

echo "==> [3/4] Creando usuario y base de datos..."
mysql -u root <<'SQL'
CREATE DATABASE IF NOT EXISTS nakeema_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'nakeema_user'@'localhost' IDENTIFIED BY 'nakeema_segura';
GRANT ALL PRIVILEGES ON nakeema_db.* TO 'nakeema_user'@'localhost';
FLUSH PRIVILEGES;
SQL

echo "==> [4/4] Importando el esquema y datos iniciales..."
mysql -u root nakeema_db < "$(dirname "$0")/database/nakeema_db.sql"

echo ""
echo "=============================================="
echo "MariaDB listo. Base de datos: nakeema_db"
echo "Usuario: nakeema_user / Contraseña: nakeema_segura"
echo ""
echo "Ahora inicia la API con:"
echo "  cd Nakeema-Backend && npm start"
echo "Y en Postman importa: Nakeema_API.postman_collection.json"
echo "=============================================="
