/**
 * =====================================================================
 * Nakeema-Backend - Servicio Web (API REST)
 * ---------------------------------------------------------------------
 * Evidencia: GA7-220501096-AA5-EV01 "Diseño y desarrollo de servicios web"
 * Tecnologías: Node.js, Express, MySQL (mysql2), CORS, body-parser
 *
 * Servicio web que expone dos endpoints:
 *   - POST /api/register  -> Registro de un nuevo usuario
 *   - POST /api/login     -> Inicio de sesión (autenticación)
 *
 * Si la autenticación es correcta devuelve un mensaje de autenticación
 * satisfactoria; en caso contrario devuelve un error de autenticación.
 * =====================================================================
 */

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

// Configuración básica del servidor Express
const app = express();
app.use(cors());                 // Permite peticiones desde cualquier origen (frontend)
app.use(bodyParser.json());      // Parsea el cuerpo de las peticiones como JSON

/**
 * 1. Conexión a la Base de Datos
 * ---------------------------------------------------------------------
 * Se establece la conexión con el motor MySQL usando el pool de
 * conexiones de mysql2. Los datos de acceso corresponden al entorno
 * local de desarrollo (XAMPP/MySQL).
 */
const db = mysql.createConnection({
    host: 'localhost',          // Host del servidor de base de datos
    user: 'nakeema_user',       // Usuario de MySQL
    password: 'nakeema_segura', // Contraseña de MySQL
    database: 'nakeema_db'      // Nombre de la base de datos
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos MySQL con éxito.');
});

/**
 * 2. Endpoint de REGISTRO (Create)
 * ---------------------------------------------------------------------
 * Recibe en el cuerpo de la petición: { email, password, role_id }
 * Inserta el nuevo usuario en la tabla "usuarios" de la base de datos.
 */
app.post('/api/register', (req, res) => {
    // Extrae los datos enviados por el cliente
    const { email, password, role_id } = req.body;

    // Validación básica de campos obligatorios
    if (!email || !password || !role_id) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son obligatorios (email, password, role_id)'
        });
    }

    // Consulta SQL parametrizada para insertar el nuevo usuario
    const sql = 'INSERT INTO usuarios (email, password, role_id) VALUES (?, ?, ?)';

    db.query(sql, [email, password, role_id], (err, result) => {
        // Manejo de errores del servidor de base de datos
        if (err) {
            // Error 1062 = duplicado (email ya registrado)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ success: false, message: 'El email ya está registrado' });
            }
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        // Respuesta exitosa con el id del nuevo registro
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            id_usuario: result.insertId
        });
    });
});

/**
 * 3. Endpoint de INICIO DE SESIÓN (Login)
 * ---------------------------------------------------------------------
 * Recibe en el cuerpo de la petición: { email, password, role }
 * Consulta el usuario en la tabla "usuarios" junto con su rol.
 * Si las credenciales son correctas devuelve un mensaje de autenticación
 * satisfactoria; de lo contrario devuelve error de autenticación.
 */
app.post('/api/login', (req, res) => {
    // Extrae los datos enviados por el cliente
    const { email, password, role } = req.body;

    // Validación básica de campos obligatorios
    if (!email || !password || !role) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son obligatorios (email, password, role)'
        });
    }

    // Consulta SQL parametrizada para buscar al usuario y su rol
    const sql = `
        SELECT u.email, u.password, u.role_id, r.nombre_rol 
        FROM usuarios u 
        JOIN roles r ON u.role_id = r.id 
        WHERE u.email = ? AND r.nombre_rol = ?`;

    db.query(sql, [email, role], (err, results) => {
        // Manejo de errores del servidor de base de datos
        if (err) {
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        // Si existe un usuario con ese email y rol
        if (results.length > 0) {
            const user = results[0];

            // Validación de contraseña (en producción se recomienda bcrypt)
            if (user.password === password) {
                // Autenticación satisfactoria
                res.json({
                    success: true,
                    role: user.nombre_rol,
                    message: "Login exitoso - Autenticación satisfactoria"
                });
            } else {
                // Error de autenticación: contraseña incorrecta
                res.status(401).json({ success: false, message: 'Error en la autenticación: contraseña incorrecta' });
            }
        } else {
            // Error de autenticación: usuario o rol no encontrados
            res.status(401).json({ success: false, message: 'Error en la autenticación: usuario no encontrado' });
        }
    });
});

/**
 * 4. Arranque del servidor
 * ---------------------------------------------------------------------
 * El servicio web queda disponible en el puerto 3000
 */
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
