# Documentación de los Servicios Web - Nakeema API REST

**Evidencia:** GA7-220501096-AA5-EV03 "Diseño y desarrollo de servicios web - proyecto"
**Tecnologías:** Node.js, Express 5, MySQL (mysql2)
**Base de datos:** `nakeema_db` (script en `database/nakeema_db.sql`)

## Índice de servicios

| # | Módulo | Endpoints | Descripción |
|---|--------|-----------|-------------|
| 1 | Autenticación | 3 | Registro e inicio de sesión de usuarios |
| 2 | Clientes | 5 | CRUD de clientes |
| 3 | Técnicos | 5 | CRUD de técnicos |
| 4 | Servicios | 8 | CRUD de servicios, tipos y estados |
| 5 | Solicitudes | 4 | Solicitudes de servicio de los clientes |
| 6 | Proveedores | 5 | CRUD de proveedores |
| 7 | Inventario | 6 | CRUD de repuestos y control de stock |
| 8 | Chat | 2 | Chat de soporte en línea |
| 9 | Satisfacción | 3 | Encuestas de satisfacción del servicio |
| 10 | Reportes | 3 | Reportes gerenciales |

---

## 1. Módulo de Autenticación (`/api/auth`)

### 1.1 POST /api/auth/registro — Registro de usuario

Registra un nuevo usuario en el sistema.

**Cuerpo de la petición (JSON):**

```json
{
  "email": "nuevo@correo.com",
  "password": "clave123",
  "nombre": "Nuevo Usuario",
  "role_id": 3
}
```

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "id_usuario": 5
}
```

**Posibles errores:**
- `400` — Faltan campos obligatorios
- `409` — El email ya está registrado
- `500` — Error del servidor

### 1.2 POST /api/auth/login — Inicio de sesión

Autentica un usuario con su email y contraseña. Si la autenticación es correcta devuelve un mensaje de autenticación satisfactoria; en caso contrario devuelve error de autenticación.

**Cuerpo de la petición (JSON):**

```json
{
  "email": "admin@nakeema.com",
  "password": "admin123"
}
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Autenticación satisfactoria",
  "id_usuario": 1,
  "nombre": "Administrador Nakeema",
  "rol": "Administrador"
}
```

**Respuesta de error (401):**

```json
{
  "success": false,
  "message": "Error en la autenticación: contraseña incorrecta"
}
```

### 1.3 GET /api/auth/usuarios — Listar usuarios

Devuelve la lista de usuarios registrados con su rol.

---

## 2. Módulo de Clientes (`/api/clientes`)

| Método | Endpoint | Función |
|--------|----------|---------|
| GET | `/api/clientes` | Lista todos los clientes |
| GET | `/api/clientes/:id` | Consulta un cliente por id |
| POST | `/api/clientes` | Crea un cliente. Cuerpo: `{ nombre, email, telefono, direccion }` |
| PUT | `/api/clientes/:id` | Actualiza un cliente. Cuerpo: `{ nombre, email, telefono, direccion }` |
| DELETE | `/api/clientes/:id` | Elimina un cliente |

**Ejemplo de respuesta GET /api/clientes:**

```json
{
  "success": true,
  "data": [
    { "id": 1, "nombre": "Carlos Pérez", "email": "carlos@correo.com", "telefono": "3001112233", "direccion": "Calle 1 # 2-3" }
  ]
}
```

---

## 3. Módulo de Técnicos (`/api/tecnicos`)

| Método | Endpoint | Función |
|--------|----------|---------|
| GET | `/api/tecnicos` | Lista todos los técnicos |
| GET | `/api/tecnicos/:id` | Consulta un técnico por id |
| POST | `/api/tecnicos` | Crea un técnico. Cuerpo: `{ nombre, email, telefono, especialidad }` |
| PUT | `/api/tecnicos/:id` | Actualiza un técnico. Cuerpo: `{ nombre, email, telefono, especialidad, estado }` |
| DELETE | `/api/tecnicos/:id` | Elimina un técnico |

---

## 4. Módulo de Servicios (`/api/servicios`)

| Método | Endpoint | Función |
|--------|----------|---------|
| GET | `/api/servicios` | Lista todos los servicios con datos relacionados |
| GET | `/api/servicios/:id` | Consulta un servicio por id |
| POST | `/api/servicios` | Crea un servicio. Cuerpo: `{ descripcion, fecha, precio, tipo_servicio_id, estado_servicio_id, tecnico_id, cliente_id }` |
| PUT | `/api/servicios/:id` | Actualiza un servicio |
| DELETE | `/api/servicios/:id` | Elimina un servicio |
| GET | `/api/servicios/tipos` | Lista los tipos de servicio |
| GET | `/api/servicios/estados` | Lista los estados de servicio |

---

## 5. Módulo de Solicitudes (`/api/solicitudes`)

| Método | Endpoint | Función |
|--------|----------|---------|
| GET | `/api/solicitudes` | Lista todas las solicitudes |
| POST | `/api/solicitudes` | Crea una solicitud. Cuerpo: `{ cliente_id, descripcion }` |
| PUT | `/api/solicitudes/:id/estado` | Actualiza estado. Cuerpo: `{ estado, tecnico_id }` |
| GET | `/api/solicitudes/tecnico/:id` | Solicitudes asignadas a un técnico |

---

## 6. Módulo de Proveedores (`/api/proveedores`)

| Método | Endpoint | Función |
|--------|----------|---------|
| GET | `/api/proveedores` | Lista todos los proveedores |
| GET | `/api/proveedores/:id` | Consulta un proveedor por id |
| POST | `/api/proveedores` | Crea un proveedor. Cuerpo: `{ nombre, email, telefono, direccion }` |
| PUT | `/api/proveedores/:id` | Actualiza un proveedor |
| DELETE | `/api/proveedores/:id` | Elimina un proveedor |

---

## 7. Módulo de Inventario (`/api/inventario`)

| Método | Endpoint | Función |
|--------|----------|---------|
| GET | `/api/inventario` | Lista todos los repuestos |
| GET | `/api/inventario/:id` | Consulta un repuesto por id |
| POST | `/api/inventario` | Crea un repuesto. Cuerpo: `{ nombre, descripcion, stock, precio, proveedor_id }` |
| PUT | `/api/inventario/:id` | Actualiza un repuesto |
| DELETE | `/api/inventario/:id` | Elimina un repuesto |
| GET | `/api/inventario/stock/bajo` | Repuestos con stock menor o igual a 5 |

---

## 8. Módulo de Chat (`/api/chat`)

| Método | Endpoint | Función |
|--------|----------|---------|
| GET | `/api/chat/mensajes` | Lista todos los mensajes del chat |
| POST | `/api/chat/mensajes` | Envía un mensaje. Cuerpo: `{ usuario_id, mensaje }` |

---

## 9. Módulo de Satisfacción (`/api/satisfaccion`)

| Método | Endpoint | Función |
|--------|----------|---------|
| GET | `/api/satisfaccion` | Lista las encuestas de satisfacción |
| POST | `/api/satisfaccion` | Registra una encuesta. Cuerpo: `{ cliente_id, calificacion (1-5), comentario }` |
| GET | `/api/satisfaccion/promedio` | Promedio de calificación del servicio |

---

## 10. Módulo de Reportes (`/api/reportes`)

| Método | Endpoint | Función |
|--------|----------|---------|
| GET | `/api/reportes/servicios` | Reporte de servicios por estado |
| GET | `/api/reportes/tecnicos` | Reporte de técnicos por estado |
| GET | `/api/reportes/inventario` | Valor total del inventario |

---

## Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Crear la base de datos (requiere MySQL corriendo)
mysql -u nakeema_user -p < database/nakeema_db.sql

# 3. Iniciar el servidor
npm start
```

El servidor queda disponible en `http://localhost:3000`.

## Estándares de codificación aplicados

- **Nombramiento de variables y funciones:** lowerCamelCase (`idCliente`, `obtenerCliente`)
- **Archivos y módulos:** minúsculas con separador de punto (`clientes.routes.js`)
- **Rutas REST:** sustantivos en plural, verbos HTTP semánticos (GET/POST/PUT/DELETE)
- **Comentarios:** cabecera de cada módulo y comentarios en cada endpoint
- **Seguridad:** uso de consultas parametrizadas (Prepared Statements) para prevenir inyección SQL
