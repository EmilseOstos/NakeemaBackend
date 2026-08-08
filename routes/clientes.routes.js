/**
 * =====================================================================
 * API - Gestión de Clientes (CRUD)
 * ---------------------------------------------------------------------
 * Servicios:
 *   GET    /api/clientes          -> Lista todos los clientes
 *   GET    /api/clientes/:id      -> Consulta un cliente por su id
 *   POST   /api/clientes          -> Crea un nuevo cliente
 *   PUT    /api/clientes/:id      -> Actualiza los datos de un cliente
 *   DELETE /api/clientes/:id      -> Elimina un cliente
 * =====================================================================
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * GET /api/clientes
 * Devuelve la lista completa de clientes del sistema.
 */
router.get('/', async (req, res) => {
    try {
        // Consulta todos los clientes ordenados por id
        const [rows] = await pool.query('SELECT * FROM clientes ORDER BY id');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * GET /api/clientes/:id
 * Consulta un cliente específico por su identificador.
 */
router.get('/:id', async (req, res) => {
    try {
        // Extrae el id de los parámetros de la URL
        const { id } = req.params;

        // Consulta el cliente por su id
        const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);

        // Si no existe se devuelve 404
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }

        // Devuelve el cliente encontrado
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * POST /api/clientes
 * Crea un nuevo cliente.
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

        // Inserta el nuevo cliente en la base de datos
        const [result] = await pool.query(
            'INSERT INTO clientes (nombre, email, telefono, direccion) VALUES (?, ?, ?, ?)',
            [nombre, email, telefono || null, direccion || null]
        );

        // Respuesta exitosa con el id del cliente creado
        res.status(201).json({
            success: true,
            message: 'Cliente creado exitosamente',
            id_cliente: result.insertId
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * PUT /api/clientes/:id
 * Actualiza los datos de un cliente existente.
 * Cuerpo esperado: { nombre, email, telefono, direccion } (parcial o completo)
 */
router.put('/:id', async (req, res) => {
    try {
        // Extrae el id y los datos a actualizar
        const { id } = req.params;
        const { nombre, email, telefono, direccion } = req.body;

        // Ejecuta la actualización sobre el cliente indicado
        const [result] = await pool.query(
            'UPDATE clientes SET nombre = ?, email = ?, telefono = ?, direccion = ? WHERE id = ?',
            [nombre, email, telefono, direccion, id]
        );

        // Si ninguna fila fue afectada el cliente no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }

        // Respuesta exitosa
        res.json({ success: true, message: 'Cliente actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * DELETE /api/clientes/:id
 * Elimina un cliente del sistema.
 */
router.delete('/:id', async (req, res) => {
    try {
        // Extrae el id de los parámetros de la URL
        const { id } = req.params;

        // Elimina el cliente indicado
        const [result] = await pool.query('DELETE FROM clientes WHERE id = ?', [id]);

        // Si ninguna fila fue afectada el cliente no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
        }

        // Respuesta exitosa
        res.json({ success: true, message: 'Cliente eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

module.exports = router;
