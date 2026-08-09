/**
 * Generador de la colección Postman de la API Nakeema
 * Evidencia: GA7-220501096-AA5-EV04 "API del proyecto"
 *
 * Ejecutar: node tools/generar_postman.js
 * Genera:   Nakeema_API.postman_collection.json (importable en Postman)
 */

const fs = require('fs');

// URL base del servidor local
const BASE = 'http://localhost:3000';

// Configuración de los módulos de la API
const modulos = [
    {
        nombre: '1. Autenticacion',
        base: '/api/auth',
        rutas: [
            { nombre: 'Registrar usuario', metodo: 'POST', path: '/registro', body: { email: 'nuevo@correo.com', password: 'clave123', nombre: 'Nuevo Usuario', role_id: 3 } },
            { nombre: 'Iniciar sesion', metodo: 'POST', path: '/login', body: { email: 'admin@nakeema.com', password: 'admin123' } },
            { nombre: 'Listar usuarios', metodo: 'GET', path: '/usuarios' }
        ]
    },
    {
        nombre: '2. Clientes',
        base: '/api/clientes',
        rutas: [
            { nombre: 'Listar clientes', metodo: 'GET', path: '/' },
            { nombre: 'Consultar cliente por id', metodo: 'GET', path: '/1' },
            { nombre: 'Crear cliente', metodo: 'POST', path: '/', body: { nombre: 'Laura Díaz', email: 'laura@correo.com', telefono: '3005556677', direccion: 'Av 8 # 9-10' } },
            { nombre: 'Actualizar cliente', metodo: 'PUT', path: '/1', body: { nombre: 'Carlos Pérez', email: 'carlos@correo.com', telefono: '3001112233', direccion: 'Calle 1 # 2-3' } },
            { nombre: 'Eliminar cliente', metodo: 'DELETE', path: '/1' }
        ]
    },
    {
        nombre: '3. Tecnicos',
        base: '/api/tecnicos',
        rutas: [
            { nombre: 'Listar tecnicos', metodo: 'GET', path: '/' },
            { nombre: 'Consultar tecnico por id', metodo: 'GET', path: '/1' },
            { nombre: 'Crear tecnico', metodo: 'POST', path: '/', body: { nombre: 'Pedro Ramírez', email: 'pedro@correo.com', telefono: '3008889900', especialidad: 'Mantenimiento Preventivo' } },
            { nombre: 'Actualizar tecnico', metodo: 'PUT', path: '/1', body: { nombre: 'Juan Rodríguez', email: 'juan@correo.com', telefono: '3007778899', especialidad: 'Reparación Eléctrica', estado: 'Disponible' } },
            { nombre: 'Eliminar tecnico', metodo: 'DELETE', path: '/1' }
        ]
    },
    {
        nombre: '4. Servicios',
        base: '/api/servicios',
        rutas: [
            { nombre: 'Listar servicios', metodo: 'GET', path: '/' },
            { nombre: 'Consultar servicio por id', metodo: 'GET', path: '/1' },
            { nombre: 'Crear servicio', metodo: 'POST', path: '/', body: { descripcion: 'Mantenimiento preventivo computador', precio: 80000, tipo_servicio_id: 1, estado_servicio_id: 1, tecnico_id: 1, cliente_id: 1 } },
            { nombre: 'Actualizar servicio', metodo: 'PUT', path: '/1', body: { descripcion: 'Mantenimiento preventivo computador', precio: 80000, tipo_servicio_id: 1, estado_servicio_id: 2, tecnico_id: 1, cliente_id: 1 } },
            { nombre: 'Eliminar servicio', metodo: 'DELETE', path: '/1' },
            { nombre: 'Listar tipos de servicio', metodo: 'GET', path: '/tipos' },
            { nombre: 'Listar estados de servicio', metodo: 'GET', path: '/estados' }
        ]
    },
    {
        nombre: '5. Solicitudes',
        base: '/api/solicitudes',
        rutas: [
            { nombre: 'Listar solicitudes', metodo: 'GET', path: '/' },
            { nombre: 'Crear solicitud', metodo: 'POST', path: '/', body: { cliente_id: 1, descripcion: 'Se solicita soporte para impresora' } },
            { nombre: 'Actualizar estado solicitud', metodo: 'PUT', path: '/1/estado', body: { estado: 'En Proceso', tecnico_id: 1 } },
            { nombre: 'Solicitudes por tecnico', metodo: 'GET', path: '/tecnico/1' }
        ]
    },
    {
        nombre: '6. Proveedores',
        base: '/api/proveedores',
        rutas: [
            { nombre: 'Listar proveedores', metodo: 'GET', path: '/' },
            { nombre: 'Consultar proveedor por id', metodo: 'GET', path: '/1' },
            { nombre: 'Crear proveedor', metodo: 'POST', path: '/', body: { nombre: 'Suministros Técnicos Ltda', email: 'ventas@suministros.com', telefono: '3109876543', direccion: 'Calle 10 # 20-30' } },
            { nombre: 'Actualizar proveedor', metodo: 'PUT', path: '/1', body: { nombre: 'ElectroRepuestos S.A.', email: 'ventas@electro.com', telefono: '3101234567', direccion: 'Zona Industrial' } },
            { nombre: 'Eliminar proveedor', metodo: 'DELETE', path: '/1' }
        ]
    },
    {
        nombre: '7. Inventario',
        base: '/api/inventario',
        rutas: [
            { nombre: 'Listar repuestos', metodo: 'GET', path: '/' },
            { nombre: 'Consultar repuesto por id', metodo: 'GET', path: '/1' },
            { nombre: 'Crear repuesto', metodo: 'POST', path: '/', body: { nombre: 'Teclado USB', descripcion: 'Teclado estándar', stock: 15, precio: 45000, proveedor_id: 1 } },
            { nombre: 'Actualizar repuesto', metodo: 'PUT', path: '/1', body: { nombre: 'Cable HDMI 2m', descripcion: 'Cable de alta velocidad', stock: 20, precio: 25000, proveedor_id: 1 } },
            { nombre: 'Eliminar repuesto', metodo: 'DELETE', path: '/1' },
            { nombre: 'Repuestos con stock bajo', metodo: 'GET', path: '/stock/bajo' }
        ]
    },
    {
        nombre: '8. Chat',
        base: '/api/chat',
        rutas: [
            { nombre: 'Listar mensajes del chat', metodo: 'GET', path: '/mensajes' },
            { nombre: 'Enviar mensaje', metodo: 'POST', path: '/mensajes', body: { usuario_id: 1, mensaje: 'Buen día, necesito ayuda con mi equipo' } }
        ]
    },
    {
        nombre: '9. Satisfaccion',
        base: '/api/satisfaccion',
        rutas: [
            { nombre: 'Listar encuestas', metodo: 'GET', path: '/' },
            { nombre: 'Registrar encuesta', metodo: 'POST', path: '/', body: { cliente_id: 1, calificacion: 5, comentario: 'Excelente servicio' } },
            { nombre: 'Promedio de satisfaccion', metodo: 'GET', path: '/promedio' }
        ]
    },
    {
        nombre: '10. Reportes',
        base: '/api/reportes',
        rutas: [
            { nombre: 'Reporte de servicios por estado', metodo: 'GET', path: '/servicios' },
            { nombre: 'Reporte de tecnicos por estado', metodo: 'GET', path: '/tecnicos' },
            { nombre: 'Reporte de inventario', metodo: 'GET', path: '/inventario' }
        ]
    }
];

// Construye la colección Postman en formato v2.1
const coleccion = {
    info: {
        name: 'Nakeema API - Testing (AA5-EV04)',
        description: 'Colección para el testing de las API del proyecto Nakeema con Postman. Evidencia GA7-220501096-AA5-EV04.',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    item: modulos.map(modulo => ({
        name: modulo.nombre,
        item: modulo.rutas.map(ruta => {
            const request = {
                method: ruta.metodo,
                header: [{ key: 'Content-Type', value: 'application/json' }],
                url: { raw: BASE + modulo.base + ruta.path, host: [BASE.replace('http://', '')], path: [modulo.base + ruta.path] },
                description: `Endpoint: ${ruta.metodo} ${modulo.base}${ruta.path}`
            };
            if (ruta.body) {
                request.body = {
                    mode: 'raw',
                    raw: JSON.stringify(ruta.body, null, 4),
                    options: { raw: { language: 'json' } }
                };
            }
            return { name: `${ruta.metodo} ${ruta.path} - ${ruta.nombre}`, request };
        })
    }))
};

// Escribe el archivo de la colección
const salida = 'Nakeema_API.postman_collection.json';
fs.writeFileSync(salida, JSON.stringify(coleccion, null, 2), 'utf8');
console.log(`Colección Postman generada: ${salida}`);
console.log(`Total de peticiones: ${modulos.reduce((acc, m) => acc + m.rutas.length, 0)}`);
