/**
 * =====================================================================
 * API - Gestión de Inventario (Repuestos)
 * ---------------------------------------------------------------------
 * Servicios:
 *   GET    /api/inventario          -> Lista todos los repuestos
 *   GET    /api/inventario/:id      -> Consulta un repuesto por su id
 *   POST   /api/inventario          -> Crea un nuevo repuesto
 *   PUT    /api/inventario/:id      -> Actualiza un repuesto existente
 *   DELETE /api/inventario/:id      -> Elimina un repuesto
 *   GET    /api/inventario/stock/bajo -> Repuestos con stock bajo
 * =====================================================================
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * GET /api/inventario
 * Devuelve la lista completa de repuestos del inventario.
 */
router.get('/', async (req, res) => {
    try {
        // Consulta los repuestos con el nombre de su proveedor
        const [rows] = await pool.query(
            `SELECT r.id, r.nombre, r.descripcion, r.stock, r.precio, p.nombre AS proveedor
             FROM repuestos r
             LEFT JOIN proveedores p ON r.proveedor_id = p.id
             ORDER BY r.id`
        );

        // Devuelve la lista de repuestos
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * GET /api/inventario/:id
 * Consulta un repuesto específico por su identificador.
 */
router.get('/:id', async (req, res) => {
    try {
        // Extrae el id de los parámetros de la URL
        const { id } = req.params;

        // Consulta el repuesto por su id
        const [rows] = await pool.query('SELECT * FROM repuestos WHERE id = ?', [id]);

        // Si no existe se devuelve 404
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Repuesto no encontrado' });
        }

        // Devuelve el repuesto encontrado
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * POST /api/inventario
 * Crea un nuevo repuesto.
 * Cuerpo esperado: { nombre, descripcion, stock, precio, proveedor_id }
 */
router.post('/', async (req, res) => {
    try {
        // Extrae los datos del cuerpo de la petición
        const { nombre, descripcion, stock, precio, proveedor_id } = req.body;

        // Validación de campos obligatorios
        if (!nombre || stock === undefined || precio === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre, stock y precio son obligatorios'
            });
        }

        // Inserta el nuevo repuesto en el inventario
        const [result] = await pool.query(
            'INSERT INTO repuestos (nombre, descripcion, stock, precio, proveedor_id) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion || null, stock, precio, proveedor_id || null]
        );

        // Respuesta exitosa con el id del repuesto creado
        res.status(201).json({
            success: true,
            message: 'Repuesto creado exitosamente',
            id_repuesto: result.insertId
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * PUT /api/inventario/:id
 * Actualiza los datos de un repuesto existente.
 * Cuerpo esperado: { nombre, descripcion, stock, precio, proveedor_id }
 */
router.put('/:id', async (req, res) => {
    try {
        // Extrae el id y los datos a actualizar
        const { id } = req.params;
        const { nombre, descripcion, stock, precio, proveedor_id } = req.body;

        // Ejecuta la actualización sobre el repuesto indicado
        const [result] = await pool.query(
            'UPDATE repuestos SET nombre = ?, descripcion = ?, stock = ?, precio = ?, proveedor_id = ? WHERE id = ?',
            [nombre, descripcion, stock, precio, proveedor_id, id]
        );

        // Si ninguna fila fue afectada el repuesto no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Repuesto no encontrado' });
        }

        // Respuesta exitosa
        res.json({ success: true, message: 'Repuesto actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * DELETE /api/inventario/:id
 * Elimina un repuesto del inventario.
 */
router.delete('/:id', async (req, res) => {
    try {
        // Extrae el id de los parámetros de la URL
        const { id } = req.params;

        // Elimina el repuesto indicado
        const [result] = await pool.query('DELETE FROM repuestos WHERE id = ?', [id]);

        // Si ninguna fila fue afectada el repuesto no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Repuesto no encontrado' });
        }

        // Respuesta exitosa
        res.json({ success: true, message: 'Repuesto eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * GET /api/inventario/stock/bajo
 * Devuelve los repuestos con stock menor o igual a 5 unidades.
 */
router.get('/stock/bajo', async (req, res) => {
    try {
        // Consulta los repuestos con stock bajo (alerta de reposición)
        const [rows] = await pool.query('SELECT * FROM repuestos WHERE stock <= 5 ORDER BY stock');

        // Devuelve la lista de repuestos con stock bajo
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

module.exports = router;
