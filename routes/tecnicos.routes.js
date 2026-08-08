/**
 * =====================================================================
 * API - Gestión de Técnicos (CRUD)
 * ---------------------------------------------------------------------
 * Servicios:
 *   GET    /api/tecnicos          -> Lista todos los técnicos
 *   GET    /api/tecnicos/:id      -> Consulta un técnico por su id
 *   POST   /api/tecnicos          -> Crea un nuevo técnico
 *   PUT    /api/tecnicos/:id      -> Actualiza los datos de un técnico
 *   DELETE /api/tecnicos/:id      -> Elimina un técnico
 * =====================================================================
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * GET /api/tecnicos
 * Devuelve la lista completa de técnicos del sistema.
 */
router.get('/', async (req, res) => {
    try {
        // Consulta todos los técnicos ordenados por id
        const [rows] = await pool.query('SELECT * FROM tecnicos ORDER BY id');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * GET /api/tecnicos/:id
 * Consulta un técnico específico por su identificador.
 */
router.get('/:id', async (req, res) => {
    try {
        // Extrae el id de los parámetros de la URL
        const { id } = req.params;

        // Consulta el técnico por su id
        const [rows] = await pool.query('SELECT * FROM tecnicos WHERE id = ?', [id]);

        // Si no existe se devuelve 404
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Técnico no encontrado' });
        }

        // Devuelve el técnico encontrado
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * POST /api/tecnicos
 * Crea un nuevo técnico.
 * Cuerpo esperado: { nombre, email, telefono, especialidad }
 */
router.post('/', async (req, res) => {
    try {
        // Extrae los datos del cuerpo de la petición
        const { nombre, email, telefono, especialidad } = req.body;

        // Validación de campos obligatorios
        if (!nombre || !email || !especialidad) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre, email y especialidad son obligatorios'
            });
        }

        // Inserta el nuevo técnico (estado inicial: Disponible)
        const [result] = await pool.query(
            'INSERT INTO tecnicos (nombre, email, telefono, especialidad, estado) VALUES (?, ?, ?, ?, ?)',
            [nombre, email, telefono || null, especialidad, 'Disponible']
        );

        // Respuesta exitosa con el id del técnico creado
        res.status(201).json({
            success: true,
            message: 'Técnico creado exitosamente',
            id_tecnico: result.insertId
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * PUT /api/tecnicos/:id
 * Actualiza los datos de un técnico existente.
 * Cuerpo esperado: { nombre, email, telefono, especialidad, estado }
 */
router.put('/:id', async (req, res) => {
    try {
        // Extrae el id y los datos a actualizar
        const { id } = req.params;
        const { nombre, email, telefono, especialidad, estado } = req.body;

        // Ejecuta la actualización sobre el técnico indicado
        const [result] = await pool.query(
            'UPDATE tecnicos SET nombre = ?, email = ?, telefono = ?, especialidad = ?, estado = ? WHERE id = ?',
            [nombre, email, telefono, especialidad, estado || 'Disponible', id]
        );

        // Si ninguna fila fue afectada el técnico no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Técnico no encontrado' });
        }

        // Respuesta exitosa
        res.json({ success: true, message: 'Técnico actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * DELETE /api/tecnicos/:id
 * Elimina un técnico del sistema.
 */
router.delete('/:id', async (req, res) => {
    try {
        // Extrae el id de los parámetros de la URL
        const { id } = req.params;

        // Elimina el técnico indicado
        const [result] = await pool.query('DELETE FROM tecnicos WHERE id = ?', [id]);

        // Si ninguna fila fue afectada el técnico no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Técnico no encontrado' });
        }

        // Respuesta exitosa
        res.json({ success: true, message: 'Técnico eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

module.exports = router;
