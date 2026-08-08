/**
 * =====================================================================
 * Configuración de la conexión a la base de datos MySQL
 * ---------------------------------------------------------------------
 * Se utiliza mysql2 en modo pool (grupo de conexiones) para manejar
 * múltiples peticiones concurrentes de forma eficiente.
 * =====================================================================
 */

const mysql = require('mysql2/promise');

// Creación del pool de conexiones a la base de datos nakeema_db
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',   // Host del servidor MySQL
    user: process.env.DB_USER || 'nakeema_user', // Usuario de la base de datos
    password: process.env.DB_PASSWORD || 'nakeema_segura', // Contraseña
    database: process.env.DB_NAME || 'nakeema_db', // Nombre de la base de datos
    waitForConnections: true,  // Espera conexiones disponibles si el pool está lleno
    connectionLimit: 10,       // Máximo de conexiones simultáneas
    queueLimit: 0              // Sin límite de peticiones en cola
});

/**
 * Exporta el pool de conexiones para que las rutas lo utilicen.
 */
module.exports = pool;
