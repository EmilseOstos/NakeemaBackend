# Nakeema API REST

Servicios web (API REST) del proyecto formativo **Nakeema** — Evidencias:
- **GA7-220501096-AA5-EV03 "Diseño y desarrollo de servicios web - proyecto"**
- **GA7-220501096-AA5-EV04 "API del proyecto"** (testing con Postman)

API desarrollada en **Node.js + Express** que expone los servicios necesarios
para el software Nakeema: autenticación, clientes, técnicos, servicios,
solicitudes, proveedores, inventario, chat, satisfacción y reportes.

## Tecnologías

| Tecnología | Versión |
|------------|---------|
| Node.js | 20+ |
| Express | 5.x |
| MySQL (mysql2) | 3.x |
| CORS / body-parser | — |

## Estructura del proyecto

```
Nakeema-Backend/
├── server.js                    # Punto de entrada del servidor
├── config/
│   └── db.js                    # Conexión a la base de datos (pool)
├── routes/                      # Servicios (endpoints) de la API
│   ├── auth.routes.js           # Registro e inicio de sesión
│   ├── clientes.routes.js       # CRUD de clientes
│   ├── tecnicos.routes.js       # CRUD de técnicos
│   ├── servicios.routes.js      # CRUD de servicios
│   ├── solicitudes.routes.js    # Solicitudes de servicio
│   ├── proveedores.routes.js    # CRUD de proveedores
│   ├── inventario.routes.js     # CRUD de repuestos (stock)
│   ├── chat.routes.js           # Chat de soporte
│   ├── satisfaccion.routes.js   # Encuestas de satisfacción
│   └── reportes.routes.js       # Reportes gerenciales
├── database/
│   └── nakeema_db.sql           # Script de creación y datos iniciales
├── API_DOCUMENTACION.md         # Documentación de cada servicio
└── enlace_repositorio.txt       # Enlace del repositorio GitHub
```

## Puesta en marcha

```bash
npm install                 # 1. Instalar dependencias
mysql -u nakeema_user -p < database/nakeema_db.sql  # 2. Crear la BD
npm start                   # 3. Iniciar el servidor
```

Servidor disponible en `http://localhost:3000`.

## Documentación de los servicios

Consulta [`API_DOCUMENTACION.md`](API_DOCUMENTACION.md) para ver el detalle de
cada uno de los 43 endpoints de la API (petición, respuesta y errores).

## Testing con Postman (AA5-EV04)

- [`Nakeema_API.postman_collection.json`](Nakeema_API.postman_collection.json) — colección Postman
  con las 43 peticiones lista para importar (Postman → Import)
- [`ENDPOINTS.txt`](ENDPOINTS.txt) — listado completo de los endpoints
- [`PRUEBAS_API.md`](PRUEBAS_API.md) — documento de pruebas con casos, respuestas esperadas y
  espacio para los pantallazos

## Versionamiento

Repositorio Git + GitHub: `https://github.com/EmilseOstos/NakeemaBackend.git`
