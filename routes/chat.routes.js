/**
 * =====================================================================
 * API - Chat de Soporte
 * ---------------------------------------------------------------------
 * Servicios:
 *   GET  /api/chat/mensajes          -> Lista todos los mensajes del chat
 *   POST /api/chat/mensajes          -> Envía un nuevo mensaje al chat
 * =====================================================================
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * GET /api/chat/mensajes
 * Devuelve la lista completa de mensajes del chat de soporte.
 */
router.get('/mensajes', async (req, res) => {
    try {
        // Consulta los mensajes con el nombre del usuario que los envía
        const [rows] = await pool.query(
            `SELECT m.id, m.mensaje, m.fecha, u.nombre AS usuario, r.nombre_rol AS rol
             FROM mensajes_chat m
             JOIN usuarios u ON m.usuario_id = u.id
             JOIN roles r ON u.role_id = r.id
             ORDER BY m.id`
        );

        // Devuelve la lista de mensajes
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * POST /api/chat/mensajes
 * Registra un nuevo mensaje en el chat de soporte.
 * Cuerpo esperado: { usuario_id, mensaje }
 */
router.post('/mensajes', async (req, res) => {
    try {
        // Extrae los datos del cuerpo de la petición
        const { usuario_id, mensaje } = req.body;

        // Validación de campos obligatorios
        if (!usuario_id || !mensaje) {
            return res.status(400).json({
                success: false,
                message: 'Los campos usuario_id y mensaje son obligatorios'
            });
        }

        // Inserta el nuevo mensaje en la base de datos
        const [result] = await pool.query(
            'INSERT INTO mensajes_chat (usuario_id, mensaje, fecha) VALUES (?, ?, ?)',
            [usuario_id, mensaje, new Date()]
        );

        // Respuesta exitosa con el id del mensaje creado
        res.status(201).json({
            success: true,
            message: 'Mensaje enviado exitosamente',
            id_mensaje: result.insertId
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

module.exports = router;
