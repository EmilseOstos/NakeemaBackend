/**
 * =====================================================================
 * API - Autenticación (Registro e Inicio de Sesión)
 * ---------------------------------------------------------------------
 * Servicios:
 *   POST /api/auth/registro  -> Crea un nuevo usuario (cliente o técnico)
 *   POST /api/auth/login     -> Autentica un usuario con email y contraseña
 *   GET  /api/auth/usuarios  -> Lista todos los usuarios (solo administrador)
 * =====================================================================
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * POST /api/auth/registro
 * Registra un nuevo usuario en la tabla "usuarios".
 * Cuerpo esperado: { email, password, nombre, role_id }
 */
router.post('/registro', async (req, res) => {
    try {
        // Extrae los datos enviados por el cliente
        const { email, password, nombre, role_id } = req.body;

        // Validación de campos obligatorios
        if (!email || !password || !nombre || !role_id) {
            return res.status(400).json({
                success: false,
                message: 'Los campos email, password, nombre y role_id son obligatorios'
            });
        }

        // Inserta el nuevo usuario (en producción se recomienda cifrar la contraseña con bcrypt)
        const [result] = await pool.query(
            'INSERT INTO usuarios (email, password, nombre, role_id) VALUES (?, ?, ?, ?)',
            [email, password, nombre, role_id]
        );

        // Respuesta exitosa con el id del usuario creado
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            id_usuario: result.insertId
        });
    } catch (err) {
        // Si el email ya existe se devuelve un error de conflicto
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'El email ya está registrado' });
        }
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * POST /api/auth/login
 * Autentica un usuario consultando su email, contraseña y rol.
 * Cuerpo esperado: { email, password }
 * Si la autenticación es correcta devuelve un mensaje de autenticación
 * satisfactoria; en caso contrario devuelve error de autenticación.
 */
router.post('/login', async (req, res) => {
    try {
        // Extrae los datos enviados por el cliente
        const { email, password } = req.body;

        // Validación de campos obligatorios
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Los campos email y password son obligatorios'
            });
        }

        // Consulta el usuario junto con el nombre de su rol
        const [rows] = await pool.query(
            `SELECT u.id, u.email, u.nombre, u.password, r.nombre_rol
             FROM usuarios u
             JOIN roles r ON u.role_id = r.id
             WHERE u.email = ?`,
            [email]
        );

        // Si el usuario no existe se devuelve error de autenticación
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Error en la autenticación: usuario no encontrado' });
        }

        const usuario = rows[0];

        // Compara la contraseña recibida con la almacenada
        if (usuario.password !== password) {
            return res.status(401).json({ success: false, message: 'Error en la autenticación: contraseña incorrecta' });
        }

        // Autenticación satisfactoria
        res.json({
            success: true,
            message: 'Autenticación satisfactoria',
            id_usuario: usuario.id,
            nombre: usuario.nombre,
            rol: usuario.nombre_rol
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * GET /api/auth/usuarios
 * Lista todos los usuarios registrados en el sistema.
 */
router.get('/usuarios', async (req, res) => {
    try {
        // Consulta todos los usuarios con el nombre de su rol
        const [rows] = await pool.query(
            `SELECT u.id, u.email, u.nombre, r.nombre_rol
             FROM usuarios u
             JOIN roles r ON u.role_id = r.id
             ORDER BY u.id`
        );

        // Devuelve la lista de usuarios
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

module.exports = router;
