-- Sentencias para la creación de tablas con sus restricciones y llaves primarias y foráneas.

-- Tabla de Roles de usuario
CREATE TABLE public.roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de Carreras
CREATE TABLE public.carreras (
    id_carrera SERIAL PRIMARY KEY,
    nombre_carrera VARCHAR(100) NOT NULL UNIQUE,
    creado_por INTEGER,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_por INTEGER,
    fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla de Usuarios
CREATE TABLE public.usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena_hash TEXT NOT NULL,
    id_rol INTEGER NOT NULL,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE,
    creado_por INTEGER,
    CONSTRAINT fk_id_rol FOREIGN KEY (id_rol) REFERENCES public.roles(id_rol),
    CONSTRAINT fk_creado_por FOREIGN KEY (creado_por) REFERENCES public.usuarios(id_usuario)
);

-- Tabla de Puestos
CREATE TABLE public.puestos (
    id_puesto SERIAL PRIMARY KEY,
    nombre_puesto VARCHAR(100) NOT NULL UNIQUE,
    salario_base NUMERIC(10,2) NOT NULL,
    id_carrera INTEGER,
    creado_por INTEGER,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_por INTEGER,
    fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_id_carrera FOREIGN KEY (id_carrera) REFERENCES public.carreras(id_carrera),
    CONSTRAINT fk_creado_por FOREIGN KEY (creado_por) REFERENCES public.usuarios(id_usuario),
    CONSTRAINT fk_actualizado_por FOREIGN KEY (actualizado_por) REFERENCES public.usuarios(id_usuario)
);

-- Tabla de Empleados
CREATE TABLE public.empleados (
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
    CONSTRAINT fk_id_puesto FOREIGN KEY (id_puesto) REFERENCES public.puestos(id_puesto),
    CONSTRAINT fk_creado_por FOREIGN KEY (creado_por) REFERENCES public.usuarios(id_usuario),
    CONSTRAINT fk_actualizado_por FOREIGN KEY (actualizado_por) REFERENCES public.usuarios(id_usuario)
);

-- Tabla de Contratos
CREATE TABLE public.contratos (
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
    CONSTRAINT fk_id_empleado FOREIGN KEY (id_empleado) REFERENCES public.empleados(id_empleado),
    CONSTRAINT fk_creado_por FOREIGN KEY (creado_por) REFERENCES public.usuarios(id_usuario),
    CONSTRAINT fk_actualizado_por FOREIGN KEY (actualizado_por) REFERENCES public.usuarios(id_usuario)
);

-- Tabla de Criterios de Evaluación
CREATE TABLE public.criterios (
    id_criterio SERIAL PRIMARY KEY,
    nombre_criterio VARCHAR(100) NOT NULL,
    descripcion TEXT,
    creado_por INTEGER,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_creado_por FOREIGN KEY (creado_por) REFERENCES public.usuarios(id_usuario)
);

-- Tabla de Vacantes
CREATE TABLE public.vacantes (
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
    CONSTRAINT fk_id_puesto FOREIGN KEY (id_puesto) REFERENCES public.puestos(id_puesto),
    CONSTRAINT fk_creado_por FOREIGN KEY (creado_por) REFERENCES public.usuarios(id_usuario),
    CONSTRAINT fk_actualizado_por FOREIGN KEY (actualizado_por) REFERENCES public.usuarios(id_usuario)
);

-- Tabla de Candidatos
CREATE TABLE public.candidatos (
    id_candidato SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100),
    correo VARCHAR(100),
    telefono VARCHAR(20),
    cv_url TEXT,
    fecha_aplicacion DATE DEFAULT CURRENT_DATE,
    creado_por INTEGER,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_creado_por FOREIGN KEY (creado_por) REFERENCES public.usuarios(id_usuario)
);

-- Tabla de Aplicaciones de Vacantes
CREATE TABLE public.aplicaciones (
    id_aplicacion SERIAL PRIMARY KEY,
    id_vacante INTEGER,
    id_candidato INTEGER,
    estado_aplicacion VARCHAR(30) DEFAULT 'En revisión',
    observaciones TEXT,
    fecha_aplicacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creado_por INTEGER,
    CONSTRAINT fk_id_vacante FOREIGN KEY (id_vacante) REFERENCES public.vacantes(id_vacante),
    CONSTRAINT fk_id_candidato FOREIGN KEY (id_candidato) REFERENCES public.candidatos(id_candidato),
    CONSTRAINT fk_creado_por FOREIGN KEY (creado_por) REFERENCES public.usuarios(id_usuario)
);

-- Tabla de Auditoría
CREATE TABLE public.auditoria (
    id_log SERIAL PRIMARY KEY,
    tabla_afectada VARCHAR(100),
    id_registro INTEGER,
    accion VARCHAR(50),
    usuario INTEGER,
    fecha TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    CONSTRAINT fk_usuario FOREIGN KEY (usuario) REFERENCES public.usuarios(id_usuario)
);

-- Tabla de Evaluaciones
CREATE TABLE public.evaluaciones (
    id_evaluacion SERIAL PRIMARY KEY,
    id_empleado INTEGER,
    fecha_evaluacion DATE NOT NULL,
    evaluador VARCHAR(100),
    comentarios TEXT,
    puntuacion_total NUMERIC(5,2),
    creado_por INTEGER,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_id_empleado FOREIGN KEY (id_empleado) REFERENCES public.empleados(id_empleado),
    CONSTRAINT fk_creado_por FOREIGN KEY (creado_por) REFERENCES public.usuarios(id_usuario)
);

-- Tabla de Detalle de Evaluación
CREATE TABLE public.detalle_evaluacion (
    id_detalle SERIAL PRIMARY KEY,
    id_evaluacion INTEGER,
    id_criterio INTEGER,
    puntuacion NUMERIC(5,2),
    CONSTRAINT fk_id_evaluacion FOREIGN KEY (id_evaluacion) REFERENCES public.evaluaciones(id_evaluacion),
    CONSTRAINT fk_id_criterio FOREIGN KEY (id_criterio) REFERENCES public.criterios(id_criterio)
);

-- Tabla de Nómina
CREATE TABLE public.nomina (
    id_nomina SERIAL PRIMARY KEY,
    id_empleado INTEGER,
    mes INTEGER,
    anio INTEGER,
    sueldo_bruto NUMERIC(10,2),
    bonificaciones NUMERIC(10,2),
    descuentos NUMERIC(10,2),
    sueldo_neto NUMERIC(10,2),
    fecha_generacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creado_por INTEGER,
    actualizado_por INTEGER,
    fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT chk_mes CHECK (mes >= 1 AND mes <= 12),
    CONSTRAINT chk_anio CHECK (anio >= 2000),
    CONSTRAINT fk_id_empleado FOREIGN KEY (id_empleado) REFERENCES public.empleados(id_empleado),
    CONSTRAINT fk_creado_por FOREIGN KEY (creado_por) REFERENCES public.usuarios(id_usuario),
    CONSTRAINT fk_actualizado_por FOREIGN KEY (actualizado_por) REFERENCES public.usuarios(id_usuario)
);

