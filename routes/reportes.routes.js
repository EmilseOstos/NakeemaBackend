/**
 * =====================================================================
 * API - Reportes del Sistema
 * ---------------------------------------------------------------------
 * Servicios:
 *   GET /api/reportes/servicios       -> Reporte de servicios por estado
 *   GET /api/reportes/tecnicos        -> Reporte de técnicos activos
 *   GET /api/reportes/inventario      -> Valor total del inventario
 * =====================================================================
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * GET /api/reportes/servicios
 * Genera un reporte del número de servicios agrupados por estado.
 */
router.get('/servicios', async (req, res) => {
    try {
        // Consulta la cantidad de servicios por estado
        const [rows] = await pool.query(
            `SELECT e.nombre AS estado, COUNT(s.id) AS cantidad
             FROM estados_servicio e
             LEFT JOIN servicios s ON s.estado_servicio_id = e.id
             GROUP BY e.id, e.nombre
             ORDER BY e.id`
        );

        // Devuelve el reporte de servicios por estado
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * GET /api/reportes/tecnicos
 * Genera un reporte de los técnicos disponibles en el sistema.
 */
router.get('/tecnicos', async (req, res) => {
    try {
        // Consulta la cantidad de técnicos por estado
        const [rows] = await pool.query(
            'SELECT estado, COUNT(*) AS cantidad FROM tecnicos GROUP BY estado'
        );

        // Devuelve el reporte de técnicos por estado
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

/**
 * GET /api/reportes/inventario
 * Genera un reporte del valor total del inventario de repuestos.
 */
router.get('/inventario', async (req, res) => {
    try {
        // Consulta el valor total del inventario y el total de repuestos
        const [rows] = await pool.query(
            'SELECT ROUND(SUM(stock * precio), 2) AS valor_total, COUNT(*) AS total_repuestos FROM repuestos'
        );

        // Devuelve el reporte del inventario
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en el servidor: ' + err.message });
    }
});

module.exports = router;
