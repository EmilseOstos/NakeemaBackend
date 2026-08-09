# Pruebas de las API's del Proyecto Nakeema con Postman

**Evidencia:** GA7-220501096-AA5-EV04 "API del proyecto"
**Herramienta:** Postman (https://www.postman.com/downloads/)
**Servidor local:** http://localhost:3000
**Base de datos:** nakeema_db (script: `database/nakeema_db.sql`)

---

## 1. Instalación de Postman

1. Descargar Postman desde https://www.postman.com/downloads/
2. Ejecutar el instalador y completar la instalación
3. Abrir Postman y crear una cuenta (o usar el modo "Skip" / continuar sin cuenta)

## 2. Configuración del entorno de pruebas

1. Crear la base de datos: `mysql -u nakeema_user -p < database/nakeema_db.sql`
2. Iniciar el servidor: `npm start` (dentro de la carpeta `Nakeema-Backend`)
3. En Postman: `Import` → seleccionar el archivo `Nakeema_API.postman_collection.json`
4. La colección contiene las **43 peticiones** organizadas en 10 carpetas (una por módulo)
5. Verificar que el servidor responde: `GET http://localhost:3000/` → debe devolver `{"nombre":"Nakeema API REST",...}`

## 3. Resultados de las pruebas

> **Instrucción:** para cada endpoint, pegar debajo el pantallazo de Postman
> (petición + respuesta) y marcar el resultado: ✅ APROBADO / ❌ FALLIDO.

---

### MÓDULO 1 - AUTENTICACIÓN

#### 1.1 POST /api/auth/registro — Registrar usuario
**Petición (Body → raw → JSON):**
```json
{
  "email": "nuevo@correo.com",
  "password": "clave123",
  "nombre": "Nuevo Usuario",
  "role_id": 3
}
```
**Respuesta esperada (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "id_usuario": 5
}
```
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 1.2 POST /api/auth/login — Inicio de sesión correcto
**Petición:**
```json
{ "email": "admin@nakeema.com", "password": "admin123" }
```
**Respuesta esperada (200):**
```json
{
  "success": true,
  "message": "Autenticación satisfactoria",
  "id_usuario": 1,
  "nombre": "Administrador Nakeema",
  "rol": "Administrador"
}
```
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 1.3 POST /api/auth/login — Inicio de sesión con contraseña incorrecta (prueba de error)
**Petición:**
```json
{ "email": "admin@nakeema.com", "password": "incorrecta" }
```
**Respuesta esperada (401):**
```json
{ "success": false, "message": "Error en la autenticación: contraseña incorrecta" }
```
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 1.4 GET /api/auth/usuarios — Listar usuarios
**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "email": "admin@nakeema.com", "nombre": "Administrador Nakeema", "nombre_rol": "Administrador" }
  ]
}
```
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

---

### MÓDULO 2 - CLIENTES (/api/clientes)

#### 2.1 GET /api/clientes — Listar clientes
**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "nombre": "Carlos Pérez", "email": "carlos@correo.com", "telefono": "3001112233", "direccion": "Calle 1 # 2-3" }
  ]
}
```
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 2.2 GET /api/clientes/1 — Consultar cliente por id
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 2.3 POST /api/clientes — Crear cliente
**Petición:**
```json
{ "nombre": "Laura Díaz", "email": "laura@correo.com", "telefono": "3005556677", "direccion": "Av 8 # 9-10" }
```
**Respuesta esperada (201):** `{ "success": true, "message": "Cliente creado exitosamente", "id_cliente": 3 }`
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 2.4 PUT /api/clientes/1 — Actualizar cliente
**Petición:**
```json
{ "nombre": "Carlos Pérez", "email": "carlos@correo.com", "telefono": "3001112233", "direccion": "Calle 1 # 2-3" }
```
**Respuesta esperada (200):** `{ "success": true, "message": "Cliente actualizado exitosamente" }`
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 2.5 DELETE /api/clientes/3 — Eliminar cliente
**Respuesta esperada (200):** `{ "success": true, "message": "Cliente eliminado exitosamente" }`
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

---

### MÓDULO 3 - TÉCNICOS (/api/tecnicos)

#### 3.1 GET /api/tecnicos — Listar técnicos
**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "nombre": "Juan Rodríguez", "email": "juan@correo.com", "telefono": "3007778899", "especialidad": "Reparación Eléctrica", "estado": "Disponible" }
  ]
}
```
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 3.2 GET /api/tecnicos/1 — Consultar técnico por id
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 3.3 POST /api/tecnicos — Crear técnico
**Petición:**
```json
{ "nombre": "Pedro Ramírez", "email": "pedro@correo.com", "telefono": "3008889900", "especialidad": "Mantenimiento Preventivo" }
```
**Respuesta esperada (201):** `{ "success": true, "message": "Técnico creado exitosamente", "id_tecnico": 3 }`
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 3.4 PUT /api/tecnicos/1 — Actualizar técnico
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 3.5 DELETE /api/tecnicos/3 — Eliminar técnico
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

---

### MÓDULO 4 - SERVICIOS (/api/servicios)

#### 4.1 GET /api/servicios — Listar servicios
**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "descripcion": "Mantenimiento preventivo computador",
      "fecha": "2026-08-07",
      "precio": 80000,
      "tipo_servicio": "Mantenimiento Preventivo",
      "estado": "Solicitado",
      "tecnico": "Juan Rodríguez",
      "cliente": "Carlos Pérez"
    }
  ]
}
```
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 4.2 GET /api/servicios/:id — Consultar servicio por id
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 4.3 POST /api/servicios — Crear servicio
**Petición:**
```json
{
  "descripcion": "Mantenimiento preventivo computador",
  "precio": 80000,
  "tipo_servicio_id": 1,
  "estado_servicio_id": 1,
  "tecnico_id": 1,
  "cliente_id": 1
}
```
**Respuesta esperada (201):** `{ "success": true, "message": "Servicio creado exitosamente", "id_servicio": 1 }`
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 4.4 PUT /api/servicios/1 — Actualizar servicio
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 4.5 DELETE /api/servicios/1 — Eliminar servicio
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 4.6 GET /api/servicios/tipos — Listar tipos de servicio
**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "nombre": "Mantenimiento Preventivo" },
    { "id": 2, "nombre": "Reparación Eléctrica" },
    { "id": 3, "nombre": "Soporte Tecnológico" },
    { "id": 4, "nombre": "Revisión General" }
  ]
}
```
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 4.7 GET /api/servicios/estados — Listar estados de servicio
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

---

### MÓDULO 5 - SOLICITUDES (/api/solicitudes)

#### 5.1 GET /api/solicitudes — Listar solicitudes
**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "fecha": "2026-08-07", "descripcion": "Se solicita soporte para impresora", "estado": "Pendiente", "cliente": "Carlos Pérez", "tecnico": null }
  ]
}
```
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 5.2 POST /api/solicitudes — Crear solicitud
**Petición:**
```json
{ "cliente_id": 1, "descripcion": "Se solicita soporte para impresora" }
```
**Respuesta esperada (201):** `{ "success": true, "message": "Solicitud creada exitosamente", "id_solicitud": 1 }`
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 5.3 PUT /api/solicitudes/1/estado — Actualizar estado de solicitud
**Petición:**
```json
{ "estado": "En Proceso", "tecnico_id": 1 }
```
**Respuesta esperada (200):** `{ "success": true, "message": "Estado de la solicitud actualizado exitosamente" }`
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 5.4 GET /api/solicitudes/tecnico/1 — Solicitudes por técnico
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

---

### MÓDULO 6 - PROVEEDORES (/api/proveedores)

#### 6.1 GET /api/proveedores — Listar proveedores
**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "nombre": "ElectroRepuestos S.A.", "email": "ventas@electro.com", "telefono": "3101234567", "direccion": "Zona Industrial" }
  ]
}
```
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 6.2 GET /api/proveedores/1 — Consultar proveedor por id
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 6.3 POST /api/proveedores — Crear proveedor
**Petición:**
```json
{ "nombre": "Suministros Técnicos Ltda", "email": "ventas@suministros.com", "telefono": "3109876543", "direccion": "Calle 10 # 20-30" }
```
**Respuesta esperada (201):** `{ "success": true, "message": "Proveedor creado exitosamente", "id_proveedor": 2 }`
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 6.4 PUT /api/proveedores/1 — Actualizar proveedor
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 6.5 DELETE /api/proveedores/2 — Eliminar proveedor
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

---

### MÓDULO 7 - INVENTARIO (/api/inventario)

#### 7.1 GET /api/inventario — Listar repuestos
**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "nombre": "Cable HDMI 2m", "descripcion": "Cable de alta velocidad", "stock": 20, "precio": 25000, "proveedor": "ElectroRepuestos S.A." }
  ]
}
```
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 7.2 GET /api/inventario/1 — Consultar repuesto por id
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 7.3 POST /api/inventario — Crear repuesto
**Petición:**
```json
{ "nombre": "Teclado USB", "descripcion": "Teclado estándar", "stock": 15, "precio": 45000, "proveedor_id": 1 }
```
**Respuesta esperada (201):** `{ "success": true, "message": "Repuesto creado exitosamente", "id_repuesto": 3 }`
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 7.4 PUT /api/inventario/1 — Actualizar repuesto
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 7.5 DELETE /api/inventario/3 — Eliminar repuesto
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 7.6 GET /api/inventario/stock/bajo — Repuestos con stock bajo
**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": [
    { "id": 2, "nombre": "Fuente de poder 500W", "descripcion": "Fuente ATX estándar", "stock": 8, "precio": 180000, "proveedor_id": 1 }
  ]
}
```
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

---

### MÓDULO 8 - CHAT (/api/chat)

#### 8.1 GET /api/chat/mensajes — Listar mensajes del chat
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 8.2 POST /api/chat/mensajes — Enviar mensaje
**Petición:**
```json
{ "usuario_id": 1, "mensaje": "Buen día, necesito ayuda con mi equipo" }
```
**Respuesta esperada (201):** `{ "success": true, "message": "Mensaje enviado exitosamente", "id_mensaje": 1 }`
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

---

### MÓDULO 9 - SATISFACCIÓN (/api/satisfaccion)

#### 9.1 GET /api/satisfaccion — Listar encuestas
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 9.2 POST /api/satisfaccion — Registrar encuesta
**Petición:**
```json
{ "cliente_id": 1, "calificacion": 5, "comentario": "Excelente servicio" }
```
**Respuesta esperada (201):** `{ "success": true, "message": "Encuesta de satisfacción registrada exitosamente", "id_encuesta": 1 }`
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 9.3 GET /api/satisfaccion/promedio — Promedio de satisfacción
**Respuesta esperada (200):**
```json
{ "success": true, "data": { "promedio": 5, "total": 1 } }
```
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

---

### MÓDULO 10 - REPORTES (/api/reportes)

#### 10.1 GET /api/reportes/servicios — Reporte de servicios por estado
**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": [
    { "estado": "Solicitado", "cantidad": 0 },
    { "estado": "En Proceso", "cantidad": 0 },
    { "estado": "Completado", "cantidad": 0 },
    { "estado": "Cancelado", "cantidad": 0 }
  ]
}
```
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 10.2 GET /api/reportes/tecnicos — Reporte de técnicos por estado
**Respuesta esperada (200):**
```json
{ "success": true, "data": [ { "estado": "Disponible", "cantidad": 2 } ] }
```
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

#### 10.3 GET /api/reportes/inventario — Reporte del valor del inventario
**Respuesta esperada (200):**
```json
{ "success": true, "data": { "valor_total": 1940000, "total_repuestos": 2 } }
```
**Pantallazo Postman:** *[PEGAR PANTALLAZO AQUÍ]*
**Resultado:** ☐ Aprobado / ☐ Fallido

---

## 4. Resumen de resultados

| Módulo | Endpoints probados | Aprobados | Fallidos |
|--------|--------------------|-----------|----------|
| 1. Autenticación | 4 | | |
| 2. Clientes | 5 | | |
| 3. Técnicos | 5 | | |
| 4. Servicios | 7 | | |
| 5. Solicitudes | 4 | | |
| 6. Proveedores | 5 | | |
| 7. Inventario | 6 | | |
| 8. Chat | 2 | | |
| 9. Satisfacción | 3 | | |
| 10. Reportes | 3 | | |
| **TOTAL** | **44** | | |

> Nota: el total de 44 incluye la prueba adicional del login con error (1.3).

## 5. Video demostrativo

**Instrucción:** grabar un video mostrando el testing de las API's con Postman
(importar la colección, ejecutar los endpoints de cada módulo y mostrar las
respuestas). Nombre sugerido: `Video_Testing_Postman.mp4`
