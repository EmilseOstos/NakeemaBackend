-- =====================================================================
-- Nakeema - Base de datos del servicio web (API REST)
-- Evidencia: GA7-220501096-AA5-EV03 "Diseño y desarrollo de servicios web"
-- Motor: MySQL 8+
-- Ejecutar con: mysql -u root -p < nakeema_db.sql
-- =====================================================================

-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS nakeema_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nakeema_db;

-- =====================================================================
-- Tabla: roles
-- Almacena los roles de los usuarios del sistema
-- =====================================================================
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- =====================================================================
-- Tabla: usuarios
-- Almacena los usuarios registrados (clientes, técnicos y administradores)
-- =====================================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- =====================================================================
-- Tabla: clientes
-- Almacena los datos de los clientes del proyecto
-- =====================================================================
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(200)
);

-- =====================================================================
-- Tabla: tecnicos
-- Almacena los datos de los técnicos especializados
-- =====================================================================
CREATE TABLE IF NOT EXISTS tecnicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    telefono VARCHAR(20),
    especialidad VARCHAR(100) NOT NULL,
    estado VARCHAR(30) DEFAULT 'Disponible'
);

-- =====================================================================
-- Tabla: tipos_servicio
-- Almacena los tipos de servicio que ofrece Nakeema
-- =====================================================================
CREATE TABLE IF NOT EXISTS tipos_servicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- =====================================================================
-- Tabla: estados_servicio
-- Almacena los estados por los que pasa un servicio
-- =====================================================================
CREATE TABLE IF NOT EXISTS estados_servicio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- =====================================================================
-- Tabla: servicios
-- Almacena los servicios registrados en el sistema
-- =====================================================================
CREATE TABLE IF NOT EXISTS servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion TEXT NOT NULL,
    fecha DATE,
    precio DECIMAL(10, 2) DEFAULT 0,
    tipo_servicio_id INT NOT NULL,
    estado_servicio_id INT NOT NULL,
    tecnico_id INT,
    cliente_id INT NOT NULL,
    FOREIGN KEY (tipo_servicio_id) REFERENCES tipos_servicio(id),
    FOREIGN KEY (estado_servicio_id) REFERENCES estados_servicio(id),
    FOREIGN KEY (tecnico_id) REFERENCES tecnicos(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- =====================================================================
-- Tabla: solicitudes
-- Almacena las solicitudes de servicio realizadas por los clientes
-- =====================================================================
CREATE TABLE IF NOT EXISTS solicitudes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    tecnico_id INT,
    descripcion TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(30) DEFAULT 'Pendiente',
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (tecnico_id) REFERENCES tecnicos(id)
);

-- =====================================================================
-- Tabla: proveedores
-- Almacena los proveedores de repuestos y materiales
-- =====================================================================
CREATE TABLE IF NOT EXISTS proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(200)
);

-- =====================================================================
-- Tabla: repuestos
-- Almacena el inventario de repuestos (control de stock)
-- =====================================================================
CREATE TABLE IF NOT EXISTS repuestos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200),
    stock INT NOT NULL DEFAULT 0,
    precio DECIMAL(10, 2) NOT NULL DEFAULT 0,
    proveedor_id INT,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);

-- =====================================================================
-- Tabla: mensajes_chat
-- Almacena los mensajes del chat de soporte
-- =====================================================================
CREATE TABLE IF NOT EXISTS mensajes_chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =====================================================================
-- Tabla: satisfaccion
-- Almacena las encuestas de satisfacción del servicio
-- =====================================================================
CREATE TABLE IF NOT EXISTS satisfaccion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    calificacion INT NOT NULL,
    comentario TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- =====================================================================
-- Datos iniciales (SEED)
-- =====================================================================

-- Roles del sistema
INSERT INTO roles (nombre_rol) VALUES
('Administrador'),
('Tecnico'),
('Cliente');

-- Usuario administrador de prueba (contraseña: admin123)
INSERT INTO usuarios (email, password, nombre, role_id) VALUES
('admin@nakeema.com', 'admin123', 'Administrador Nakeema', 1);

-- Tipos de servicio
INSERT INTO tipos_servicio (nombre) VALUES
('Mantenimiento Preventivo'),
('Reparación Eléctrica'),
('Soporte Tecnológico'),
('Revisión General');

-- Estados de servicio
INSERT INTO estados_servicio (nombre) VALUES
('Solicitado'),
('En Proceso'),
('Completado'),
('Cancelado');

-- Clientes de ejemplo
INSERT INTO clientes (nombre, email, telefono, direccion) VALUES
('Carlos Pérez', 'carlos@correo.com', '3001112233', 'Calle 1 # 2-3'),
('María Gómez', 'maria@correo.com', '3004445566', 'Carrera 4 # 5-6');

-- Técnicos de ejemplo
INSERT INTO tecnicos (nombre, email, telefono, especialidad, estado) VALUES
('Juan Rodríguez', 'juan@correo.com', '3007778899', 'Reparación Eléctrica', 'Disponible'),
('Ana Martínez', 'ana@correo.com', '3001112223', 'Soporte Tecnológico', 'Disponible');

-- Proveedores de ejemplo
INSERT INTO proveedores (nombre, email, telefono, direccion) VALUES
('ElectroRepuestos S.A.', 'ventas@electro.com', '3101234567', 'Zona Industrial');

-- Repuestos de ejemplo
INSERT INTO repuestos (nombre, descripcion, stock, precio, proveedor_id) VALUES
('Cable HDMI 2m', 'Cable de alta velocidad', 20, 25000, 1),
('Fuente de poder 500W', 'Fuente ATX estándar', 8, 180000, 1);
