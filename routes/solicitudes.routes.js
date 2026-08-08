/**
 * =====================================================================
 * API - Gestión de Solicitudes de Servicio
 * ---------------------------------------------------------------------
 * Servicios:
 *   GET    /api/solicitudes             -> Lista todas las solicitudes
 *   POST   /api/solicitudes             -> Crea una nueva solicitud
 *   PUT    /api/solicitudes/:id/estado  -> Actualiza el estado de una solicitud
 *   GET    /api/solicitudes/tecnico/:id -> Solicitudes asignadas a un técnico
 * =====================================================================
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * GET /api/solicitudes
 * Devuelve la lista completa de solicitudes de servicio.
 */
router.get('/', async (req, res) => {
    try {
        // Consulta las solicitudes con datos del cliente y del servicio
        const [rows] = await pool.query(
            `SELECT s.id, s.fecha, s.descripcion, s.estado,
                    cl.nombre AS cliente, tec.nombre AS tecnico
             FROM solicitudes s
             JOIN clientes cl ON s.cliente_id = cl.id
             LEFT JOIN tecnicos tec ON s.tecnico_id = tec.id
             ORDER BY s.id`
        );

        // Devuelve la lista de solicitudes
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * POST /api/solicitudes
 * Crea una nueva solicitud de servicio.
 * Cuerpo esperado: { cliente_id, descripcion }
 */
router.post('/', async (req, res) => {
    try {
        // Extrae los datos del cuerpo de la petición
        const { cliente_id, descripcion } = req.body;

        // Validación de campos obligatorios
        if (!cliente_id || !descripcion) {
            return res.status(400).json({
                success: false,
                message: 'Los campos cliente_id y descripcion son obligatorios'
            });
        }

        // Inserta la nueva solicitud (estado inicial: Pendiente)
        const [result] = await pool.query(
            'INSERT INTO solicitudes (cliente_id, descripcion, fecha, estado) VALUES (?, ?, ?, ?)',
            [cliente_id, descripcion, new Date(), 'Pendiente']
        );

        // Respuesta exitosa con el id de la solicitud creada
        res.status(201).json({
            success: true,
            message: 'Solicitud creada exitosamente',
            id_solicitud: result.insertId
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * PUT /api/solicitudes/:id/estado
 * Actualiza el estado de una solicitud y le asigna un técnico.
 * Cuerpo esperado: { estado, tecnico_id }
 */
router.put('/:id/estado', async (req, res) => {
    try {
        // Extrae el id de la solicitud y los datos a actualizar
        const { id } = req.params;
        const { estado, tecnico_id } = req.body;

        // Validación del nuevo estado
        if (!estado) {
            return res.status(400).json({ success: false, message: 'El campo estado es obligatorio' });
        }

        // Actualiza el estado y el técnico asignado de la solicitud
        const [result] = await pool.query(
            'UPDATE solicitudes SET estado = ?, tecnico_id = ? WHERE id = ?',
            [estado, tecnico_id || null, id]
        );

        // Si ninguna fila fue afectada la solicitud no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
        }

        // Respuesta exitosa
        res.json({ success: true, message: 'Estado de la solicitud actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * GET /api/solicitudes/tecnico/:id
 * Devuelve las solicitudes asignadas a un técnico específico.
 */
router.get('/tecnico/:id', async (req, res) => {
    try {
        // Extrae el id del técnico de los parámetros de la URL
        const { id } = req.params;

        // Consulta las solicitudes del técnico indicado
        const [rows] = await pool.query(
            `SELECT s.id, s.fecha, s.descripcion, s.estado, cl.nombre AS cliente
             FROM solicitudes s
             JOIN clientes cl ON s.cliente_id = cl.id
             WHERE s.tecnico_id = ?
             ORDER BY s.id`,
            [id]
        );

        // Devuelve las solicitudes del técnico
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

module.exports = router;
