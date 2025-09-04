-- TABLA: roles
CREATE TABLE IF NOT EXISTS roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- TABLA: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena_hash TEXT NOT NULL,
    id_rol INTEGER NOT NULL,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE,
    creado_por INTEGER,
    actualizado_por INTEGER,
    estadousuario BOOLEAN DEFAULT TRUE NOT NULL,
    CONSTRAINT fk_id_rol FOREIGN KEY (id_rol) REFERENCES roles (id_rol),
    CONSTRAINT fk_creado_por_usuarios FOREIGN KEY (creado_por) REFERENCES usuarios (id_usuario),
    CONSTRAINT fk_actualizado_por_usuarios FOREIGN KEY (actualizado_por) REFERENCES usuarios (id_usuario)
);

-- TABLA: auditoria
CREATE TABLE IF NOT EXISTS auditoria (
    id_log SERIAL PRIMARY KEY,
    tabla_afectada VARCHAR(100),
    id_registro INTEGER,
    accion VARCHAR(50),
    usuario INTEGER,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    CONSTRAINT fk_usuario_auditoria FOREIGN KEY (usuario) REFERENCES usuarios (id_usuario)
);

-- TABLA: carreras
CREATE TABLE IF NOT EXISTS carreras (
    id_carrera SERIAL PRIMARY KEY,
    nombre_carrera VARCHAR(100) NOT NULL UNIQUE,
    creado_por INTEGER,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_por INTEGER,
    fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_creado_por_carreras FOREIGN KEY (creado_por) REFERENCES usuarios (id_usuario),
    CONSTRAINT fk_actualizado_por_carreras FOREIGN KEY (actualizado_por) REFERENCES usuarios (id_usuario)
);

-- TABLA: puestos
CREATE TABLE IF NOT EXISTS puestos (
    id_puesto SERIAL PRIMARY KEY,
    nombre_puesto VARCHAR(100) NOT NULL UNIQUE,
    salario_base NUMERIC(10,2) NOT NULL,
    id_carrera INTEGER,
    creado_por INTEGER,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_por INTEGER,
    fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_id_carrera FOREIGN KEY (id_carrera) REFERENCES carreras (id_carrera),
    CONSTRAINT fk_creado_por_puestos FOREIGN KEY (creado_por) REFERENCES usuarios (id_usuario),
    CONSTRAINT fk_actualizado_por_puestos FOREIGN KEY (actualizado_por) REFERENCES usuarios (id_usuario)
);

-- TABLA: empleados
CREATE TABLE IF NOT EXISTS empleados (
    id_empleado SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    dpi VARCHAR(25) UNIQUE,
    telefono VARCHAR(20),
    correo_personal VARCHAR(100),
    direccion TEXT,
    fecha_nacimiento DATE,
    genero VARCHAR(15),
    estado_civil VARCHAR(20),
    fecha_ingreso DATE NOT NULL,
    id_puesto INTEGER,
    estado_empleo VARCHAR(20) DEFAULT 'Activo',
    creado_por INTEGER,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_por INTEGER,
    fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE,
    estadoempleado BOOLEAN DEFAULT TRUE NOT NULL,
    CONSTRAINT fk_id_puesto FOREIGN KEY (id_puesto) REFERENCES puestos (id_puesto),
    CONSTRAINT fk_creado_por_empleados FOREIGN KEY (creado_por) REFERENCES usuarios (id_usuario),
    CONSTRAINT fk_actualizado_por_empleados FOREIGN KEY (actualizado_por) REFERENCES usuarios (id_usuario)
);

-- TABLA: dependencias
CREATE TABLE IF NOT EXISTS public.dependencias(
    id_dependencia serial NOT NULL,
    id_puesto_superior integer,
    id_puesto_subordinado integer,
    CONSTRAINT dependencias_pkey PRIMARY KEY (id_dependencia),
    CONSTRAINT dependencias_id_puesto_subordinado_key UNIQUE (id_puesto_subordinado)
);

-- TABLA: bienestar
CREATE TABLE IF NOT EXISTS bienestar (
    id_bienestar SERIAL PRIMARY KEY,
    nombre_actividad VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_actividad DATE NOT NULL,
    creado_por INTEGER,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_creado_por_bienestar FOREIGN KEY (creado_por) REFERENCES usuarios (id_usuario)
);

-- TABLA: contratos
CREATE TABLE IF NOT EXISTS contratos (
    id_contrato SERIAL PRIMARY KEY,
    id_empleado INTEGER NOT NULL,
    tipo_contrato VARCHAR(50) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    observaciones TEXT,
    creado_por INTEGER,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_por INTEGER,
    fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_id_empleado_contratos FOREIGN KEY (id_empleado) REFERENCES empleados (id_empleado),
    CONSTRAINT fk_creado_por_contratos FOREIGN KEY (creado_por) REFERENCES usuarios (id_usuario),
    CONSTRAINT fk_actualizado_por_contratos FOREIGN KEY (actualizado_por) REFERENCES usuarios (id_usuario)
);

-- TABLA: candidatos
CREATE TABLE IF NOT EXISTS candidatos (
    id_candidato SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100),
    correo VARCHAR(100),
    telefono VARCHAR(20),
    cv_url TEXT,
    fecha_aplicacion DATE DEFAULT CURRENT_DATE,
    creado_por INTEGER,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_creado_por_candidatos FOREIGN KEY (creado_por) REFERENCES usuarios (id_usuario)
);

-- TABLA: vacantes
CREATE TABLE IF NOT EXISTS vacantes (
    id_vacante SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_publicacion DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'Abierta',
    id_puesto INTEGER,
    creado_por INTEGER,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_por INTEGER,
    fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_id_puesto_vacantes FOREIGN KEY (id_puesto) REFERENCES puestos (id_puesto),
    CONSTRAINT fk_creado_por_vacantes FOREIGN KEY (creado_por) REFERENCES usuarios (id_usuario),
    CONSTRAINT fk_actualizado_por_vacantes FOREIGN KEY (actualizado_por) REFERENCES usuarios (id_usuario)
);

-- TABLA: aplicaciones
CREATE TABLE IF NOT EXISTS aplicaciones (
    id_aplicacion SERIAL PRIMARY KEY,
    id_vacante INTEGER,
    id_candidato INTEGER,
    estado_aplicacion VARCHAR(30) DEFAULT 'En revisión',
    observaciones TEXT,
    fecha_aplicacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creado_por INTEGER,
    CONSTRAINT fk_id_vacante_aplicaciones FOREIGN KEY (id_vacante) REFERENCES vacantes (id_vacante),
    CONSTRAINT fk_id_candidato_aplicaciones FOREIGN KEY (id_candidato) REFERENCES candidatos (id_candidato),
    CONSTRAINT fk_creado_por_aplicaciones FOREIGN KEY (creado_por) REFERENCES usuarios (id_usuario)
);

-- TABLA: evaluaciones
CREATE TABLE IF NOT EXISTS evaluaciones (
    id_evaluacion SERIAL PRIMARY KEY,
    id_empleado INTEGER,
    fecha_evaluacion DATE NOT NULL,
    evaluador VARCHAR(100),
    comentarios TEXT,
    puntuacion_total NUMERIC(5,2),
    creado_por INTEGER,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_id_empleado_evaluaciones FOREIGN KEY (id_empleado) REFERENCES empleados (id_empleado),
    CONSTRAINT fk_creado_por_evaluaciones FOREIGN KEY (creado_por) REFERENCES usuarios (id_usuario)
);

-- TABLA: criterios
CREATE TABLE IF NOT EXISTS criterios (
    id_criterio SERIAL PRIMARY KEY,
    nombre_criterio VARCHAR(100) NOT NULL,
    descripcion TEXT,
    creado_por INTEGER,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_creado_por_criterios FOREIGN KEY (creado_por) REFERENCES usuarios (id_usuario)
);

-- TABLA: detalle_evaluacion
CREATE TABLE IF NOT EXISTS detalle_evaluacion (
    id_detalle SERIAL PRIMARY KEY,
    id_evaluacion INTEGER,
    id_criterio INTEGER,
    puntuacion NUMERIC(5,2),
    creado_por INTEGER,
    CONSTRAINT uc_evaluacion_criterio UNIQUE (id_evaluacion, id_criterio),
    CONSTRAINT fk_id_evaluacion_detalle FOREIGN KEY (id_evaluacion) REFERENCES evaluaciones (id_evaluacion),
    CONSTRAINT fk_id_criterio_detalle FOREIGN KEY (id_criterio) REFERENCES criterios (id_criterio),
    CONSTRAINT fk_creado_por_detalle_evaluacion FOREIGN KEY (creado_por) REFERENCES usuarios (id_usuario)
);

-- TABLA: nomina
CREATE TABLE IF NOT EXISTS nomina (
    id_nomina SERIAL PRIMARY KEY,
    id_empleado INTEGER,
    mes INTEGER CHECK (mes >= 1 AND mes <= 12),
    anio INTEGER CHECK (anio >= 2000),
    sueldo_bruto NUMERIC(10,2),
    bonificaciones NUMERIC(10,2),
    descuentos NUMERIC(10,2),
    sueldo_neto NUMERIC(10,2),
    fecha_generacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creado_por INTEGER,
    actualizado_por INTEGER,
    fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_id_empleado_nomina FOREIGN KEY (id_empleado) REFERENCES empleados (id_empleado),
    CONSTRAINT fk_creado_por_nomina FOREIGN KEY (creado_por) REFERENCES usuarios (id_usuario),
    CONSTRAINT fk_actualizado_por_nomina FOREIGN KEY (actualizado_por) REFERENCES usuarios (id_usuario)
);

-- TABLA: vacaciones
CREATE TABLE IF NOT EXISTS vacaciones (
    id_vacacion SERIAL PRIMARY KEY,
    id_empleado INTEGER NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    creado_por INTEGER,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_por INTEGER,
    fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_id_empleado_vacaciones FOREIGN KEY (id_empleado) REFERENCES empleados (id_empleado),
    CONSTRAINT fk_creado_por_vacaciones FOREIGN KEY (creado_por) REFERENCES usuarios (id_usuario),
    CONSTRAINT fk_actualizado_por_vacaciones FOREIGN KEY (actualizado_por) REFERENCES usuarios (id_usuario)
);