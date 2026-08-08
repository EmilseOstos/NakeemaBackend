/**
 * =====================================================================
 * API - Encuestas de Satisfacción
 * ---------------------------------------------------------------------
 * Servicios:
 *   GET  /api/satisfaccion          -> Lista todas las encuestas de satisfacción
 *   POST /api/satisfaccion          -> Registra una nueva encuesta
 *   GET  /api/satisfaccion/promedio -> Calcula el promedio de calificación
 * =====================================================================
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * GET /api/satisfaccion
 * Devuelve la lista completa de encuestas de satisfacción.
 */
router.get('/', async (req, res) => {
    try {
        // Consulta las encuestas con el nombre del cliente
        const [rows] = await pool.query(
            `SELECT s.id, s.calificacion, s.comentario, s.fecha, cl.nombre AS cliente
             FROM satisfaccion s
             JOIN clientes cl ON s.cliente_id = cl.id
             ORDER BY s.id`
        );

        // Devuelve la lista de encuestas
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * POST /api/satisfaccion
 * Registra una nueva encuesta de satisfacción.
 * Cuerpo esperado: { cliente_id, calificacion, comentario }
 */
router.post('/', async (req, res) => {
    try {
        // Extrae los datos del cuerpo de la petición
        const { cliente_id, calificacion, comentario } = req.body;

        // Validación de campos obligatorios (calificación de 1 a 5)
        if (!cliente_id || calificacion === undefined || calificacion < 1 || calificacion > 5) {
            return res.status(400).json({
                success: false,
                message: 'El campo cliente_id es obligatorio y calificacion debe estar entre 1 y 5'
            });
        }

        // Inserta la nueva encuesta de satisfacción
        const [result] = await pool.query(
            'INSERT INTO satisfaccion (cliente_id, calificacion, comentario, fecha) VALUES (?, ?, ?, ?)',
            [cliente_id, calificacion, comentario || null, new Date()]
        );

        // Respuesta exitosa con el id de la encuesta creada
        res.status(201).json({
            success: true,
            message: 'Encuesta de satisfacción registrada exitosamente',
            id_encuesta: result.insertId
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * GET /api/satisfaccion/promedio
 * Calcula el promedio de calificación de todas las encuestas.
 */
router.get('/promedio', async (req, res) => {
    try {
        // Consulta el promedio de calificación y el total de encuestas
        const [rows] = await pool.query(
            'SELECT ROUND(AVG(calificacion), 2) AS promedio, COUNT(*) AS total FROM satisfaccion'
        );

        // Devuelve el promedio de satisfacción
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

module.exports = router;
