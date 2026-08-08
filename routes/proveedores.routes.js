/**
 * =====================================================================
 * API - Gestión de Proveedores (CRUD)
 * ---------------------------------------------------------------------
 * Servicios:
 *   GET    /api/proveedores        -> Lista todos los proveedores
 *   GET    /api/proveedores/:id    -> Consulta un proveedor por su id
 *   POST   /api/proveedores        -> Crea un nuevo proveedor
 *   PUT    /api/proveedores/:id    -> Actualiza un proveedor existente
 *   DELETE /api/proveedores/:id    -> Elimina un proveedor
 * =====================================================================
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * GET /api/proveedores
 * Devuelve la lista completa de proveedores del sistema.
 */
router.get('/', async (req, res) => {
    try {
        // Consulta todos los proveedores ordenados por id
        const [rows] = await pool.query('SELECT * FROM proveedores ORDER BY id');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * GET /api/proveedores/:id
 * Consulta un proveedor específico por su identificador.
 */
router.get('/:id', async (req, res) => {
    try {
        // Extrae el id de los parámetros de la URL
        const { id } = req.params;

        // Consulta el proveedor por su id
        const [rows] = await pool.query('SELECT * FROM proveedores WHERE id = ?', [id]);

        // Si no existe se devuelve 404
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
        }

        // Devuelve el proveedor encontrado
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * POST /api/proveedores
 * Crea un nuevo proveedor.
 * Cuerpo esperado: { nombre, email, telefono, direccion }
 */
router.post('/', async (req, res) => {
    try {
        // Extrae los datos del cuerpo de la petición
        const { nombre, email, telefono, direccion } = req.body;

        // Validación de campos obligatorios
        if (!nombre || !email) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre y email son obligatorios'
            });
        }

        // Inserta el nuevo proveedor en la base de datos
        const [result] = await pool.query(
            'INSERT INTO proveedores (nombre, email, telefono, direccion) VALUES (?, ?, ?, ?)',
            [nombre, email, telefono || null, direccion || null]
        );

        // Respuesta exitosa con el id del proveedor creado
        res.status(201).json({
            success: true,
            message: 'Proveedor creado exitosamente',
            id_proveedor: result.insertId
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * PUT /api/proveedores/:id
 * Actualiza los datos de un proveedor existente.
 * Cuerpo esperado: { nombre, email, telefono, direccion }
 */
router.put('/:id', async (req, res) => {
    try {
        // Extrae el id y los datos a actualizar
        const { id } = req.params;
        const { nombre, email, telefono, direccion } = req.body;

        // Ejecuta la actualización sobre el proveedor indicado
        const [result] = await pool.query(
            'UPDATE proveedores SET nombre = ?, email = ?, telefono = ?, direccion = ? WHERE id = ?',
            [nombre, email, telefono, direccion, id]
        );

        // Si ninguna fila fue afectada el proveedor no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
        }

        // Respuesta exitosa
        res.json({ success: true, message: 'Proveedor actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * DELETE /api/proveedores/:id
 * Elimina un proveedor del sistema.
 */
router.delete('/:id', async (req, res) => {
    try {
        // Extrae el id de los parámetros de la URL
        const { id } = req.params;

        // Elimina el proveedor indicado
        const [result] = await pool.query('DELETE FROM proveedores WHERE id = ?', [id]);

        // Si ninguna fila fue afectada el proveedor no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
        }

        // Respuesta exitosa
        res.json({ success: true, message: 'Proveedor eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

module.exports = router;
