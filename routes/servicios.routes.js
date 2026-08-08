/**
 * =====================================================================
 * API - Gestión de Servicios (CRUD)
 * ---------------------------------------------------------------------
 * Servicios:
 *   GET    /api/servicios            -> Lista todos los servicios
 *   GET    /api/servicios/:id        -> Consulta un servicio por su id
 *   POST   /api/servicios            -> Crea un nuevo servicio
 *   PUT    /api/servicios/:id        -> Actualiza un servicio existente
 *   DELETE /api/servicios/:id        -> Elimina un servicio
 *   GET    /api/servicios/tipos      -> Lista los tipos de servicio
 *   GET    /api/servicios/estados    -> Lista los estados de servicio
 * =====================================================================
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * GET /api/servicios
 * Devuelve la lista completa de servicios con datos relacionados.
 */
router.get('/', async (req, res) => {
    try {
        // Consulta los servicios con el nombre del tipo, estado, técnico y cliente
        const [rows] = await pool.query(
            `SELECT s.id, s.descripcion, s.fecha, s.precio,
                    t.nombre AS tipo_servicio, e.nombre AS estado,
                    tec.nombre AS tecnico, cl.nombre AS cliente
             FROM servicios s
             JOIN tipos_servicio t ON s.tipo_servicio_id = t.id
             JOIN estados_servicio e ON s.estado_servicio_id = e.id
             LEFT JOIN tecnicos tec ON s.tecnico_id = tec.id
             LEFT JOIN clientes cl ON s.cliente_id = cl.id
             ORDER BY s.id`
        );

        // Devuelve la lista de servicios
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * GET /api/servicios/:id
 * Consulta un servicio específico por su identificador.
 */
router.get('/:id', async (req, res) => {
    try {
        // Extrae el id de los parámetros de la URL
        const { id } = req.params;

        // Consulta el servicio por su id
        const [rows] = await pool.query(
            `SELECT s.*, t.nombre AS tipo_servicio, e.nombre AS estado
             FROM servicios s
             JOIN tipos_servicio t ON s.tipo_servicio_id = t.id
             JOIN estados_servicio e ON s.estado_servicio_id = e.id
             WHERE s.id = ?`,
            [id]
        );

        // Si no existe se devuelve 404
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
        }

        // Devuelve el servicio encontrado
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * POST /api/servicios
 * Crea un nuevo servicio.
 * Cuerpo esperado: { descripcion, fecha, precio, tipo_servicio_id,
 *                    estado_servicio_id, tecnico_id, cliente_id }
 */
router.post('/', async (req, res) => {
    try {
        // Extrae los datos del cuerpo de la petición
        const { descripcion, fecha, precio, tipo_servicio_id, estado_servicio_id, tecnico_id, cliente_id } = req.body;

        // Validación de campos obligatorios
        if (!descripcion || !tipo_servicio_id || !cliente_id) {
            return res.status(400).json({
                success: false,
                message: 'Los campos descripcion, tipo_servicio_id y cliente_id son obligatorios'
            });
        }

        // Inserta el nuevo servicio en la base de datos
        const [result] = await pool.query(
            `INSERT INTO servicios
             (descripcion, fecha, precio, tipo_servicio_id, estado_servicio_id, tecnico_id, cliente_id)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                descripcion,
                fecha || new Date(),
                precio || 0,
                tipo_servicio_id,
                estado_servicio_id || 1, // Por defecto: "Solicitado"
                tecnico_id || null,
                cliente_id
            ]
        );

        // Respuesta exitosa con el id del servicio creado
        res.status(201).json({
            success: true,
            message: 'Servicio creado exitosamente',
            id_servicio: result.insertId
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * PUT /api/servicios/:id
 * Actualiza un servicio existente.
 * Cuerpo esperado: { descripcion, fecha, precio, tipo_servicio_id,
 *                    estado_servicio_id, tecnico_id, cliente_id }
 */
router.put('/:id', async (req, res) => {
    try {
        // Extrae el id y los datos a actualizar
        const { id } = req.params;
        const { descripcion, fecha, precio, tipo_servicio_id, estado_servicio_id, tecnico_id, cliente_id } = req.body;

        // Ejecuta la actualización sobre el servicio indicado
        const [result] = await pool.query(
            `UPDATE servicios SET
                descripcion = ?, fecha = ?, precio = ?, tipo_servicio_id = ?,
                estado_servicio_id = ?, tecnico_id = ?, cliente_id = ?
             WHERE id = ?`,
            [descripcion, fecha, precio, tipo_servicio_id, estado_servicio_id, tecnico_id, cliente_id, id]
        );

        // Si ninguna fila fue afectada el servicio no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
        }

        // Respuesta exitosa
        res.json({ success: true, message: 'Servicio actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * DELETE /api/servicios/:id
 * Elimina un servicio del sistema.
 */
router.delete('/:id', async (req, res) => {
    try {
        // Extrae el id de los parámetros de la URL
        const { id } = req.params;

        // Elimina el servicio indicado
        const [result] = await pool.query('DELETE FROM servicios WHERE id = ?', [id]);

        // Si ninguna fila fue afectada el servicio no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
        }

        // Respuesta exitosa
        res.json({ success: true, message: 'Servicio eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * GET /api/servicios/tipos
 * Lista los tipos de servicio disponibles en el sistema.
 */
router.get('/tipos', async (req, res) => {
    try {
        // Consulta todos los tipos de servicio
        const [rows] = await pool.query('SELECT * FROM tipos_servicio ORDER BY id');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * GET /api/servicios/estados
 * Lista los estados de servicio disponibles en el sistema.
 */
router.get('/estados', async (req, res) => {
    try {
        // Consulta todos los estados de servicio
        const [rows] = await pool.query('SELECT * FROM estados_servicio ORDER BY id');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

module.exports = router;
