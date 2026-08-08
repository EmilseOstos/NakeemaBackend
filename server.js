/**
 * =====================================================================
 * Nakeema API REST - Punto de entrada del servidor
 * ---------------------------------------------------------------------
 * Evidencia: GA7-220501096-AA5-EV03 "Diseño y desarrollo de servicios web"
 * Tecnologías: Node.js, Express 5, MySQL (mysql2), CORS, body-parser
 *
 * Este servidor expone los servicios web (API REST) necesarios para el
 * proyecto formativo Nakeema: autenticación, clientes, técnicos,
 * servicios, solicitudes, proveedores, inventario, chat, satisfacción
 * y reportes.
 * =====================================================================
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importación de las rutas (servicios) de la API
const authRoutes = require('./routes/auth.routes');
const clienteRoutes = require('./routes/clientes.routes');
const tecnicoRoutes = require('./routes/tecnicos.routes');
const servicioRoutes = require('./routes/servicios.routes');
const solicitudRoutes = require('./routes/solicitudes.routes');
const proveedorRoutes = require('./routes/proveedores.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const chatRoutes = require('./routes/chat.routes');
const satisfaccionRoutes = require('./routes/satisfaccion.routes');
const reportesRoutes = require('./routes/reportes.routes');

// Creación de la aplicación Express
const app = express();

// Middlewares globales
app.use(cors());              // Habilita peticiones desde cualquier origen (frontend)
app.use(bodyParser.json());   // Parsea el cuerpo de las peticiones como JSON

// Configuración de prefijos por módulo de la API
app.use('/api/auth', authRoutes);            // Registro e inicio de sesión
app.use('/api/clientes', clienteRoutes);     // Gestión de clientes
app.use('/api/tecnicos', tecnicoRoutes);     // Gestión de técnicos
app.use('/api/servicios', servicioRoutes);   // Gestión de servicios
app.use('/api/solicitudes', solicitudRoutes);// Gestión de solicitudes de servicio
app.use('/api/proveedores', proveedorRoutes);// Gestión de proveedores
app.use('/api/inventario', inventarioRoutes);// Gestión de inventario (repuestos)
app.use('/api/chat', chatRoutes);            // Chat de soporte
app.use('/api/satisfaccion', satisfaccionRoutes); // Encuestas de satisfacción
app.use('/api/reportes', reportesRoutes);    // Reportes del sistema

// Ruta raíz informativa de la API
app.get('/', (req, res) => {
    res.json({
        nombre: 'Nakeema API REST',
        version: '1.0.0',
        descripcion: 'Servicios web del proyecto formativo Nakeema',
        documentacion: 'Ver archivo API_DOCUMENTACION.md'
    });
});

// Manejo global de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Puerto de escucha del servidor (configurable por variable de entorno)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor Nakeema API corriendo en http://localhost:${PORT}`);
});
