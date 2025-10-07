# para correr prueba es 
npm test


# Sistema Jireh - Backend

Backend del Sistema Jireh, un CRM de gestión de Recursos Humanos para escuelas de enfermería.

## Características

- **Autenticación JWT**: Sistema seguro de autenticación con tokens JWT
- **Base de Datos PostgreSQL**: ORM Sequelize para gestión de datos
- **Seguridad OWASP**: Implementación de mejores prácticas de seguridad
- **Logging**: Sistema de logs con Winston
- **Validación**: Express-validator para validación de datos
- **API RESTful**: Arquitectura REST para comunicación con el frontend

## Requisitos Previos

- Node.js (versión 16 o superior)
- PostgreSQL (versión 12 o superior)
- npm o yarn

## Instalación

1. **Clonar el repositorio** (si no lo has hecho ya):
   ```bash
   git clone <url-del-repositorio>
   cd PG_sistemaJireh/backend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   - Copia el archivo `env.example` a `.env`
   - Edita el archivo `.env` con tus configuraciones:
   ```env
   PORT=3000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sistemaJireh
   DB_USER=postgres
   DB_PASSWORD=tu_contraseña
   JWT_SECRET=TuSecretoJWT
   JWT_EXPIRES_IN=24h
   LOG_LEVEL=info
   LOG_FILE=logs/app.log
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Configurar la base de datos**:
   - Crea la base de datos PostgreSQL:
   ```sql
   CREATE DATABASE sistemaJireh;
   ```
   - Ejecuta el script SQL para crear las tablas:
   ```bash
   psql -U postgres -d sistemaJireh -f script_base_datos.sql
   ```

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## Estructura del Proyecto

```
backend/
├── aplicacion.js              # Punto de entrada principal
├── configuracion/
│   └── configuracion.js      # Configuración de la base de datos
├── controladores/
│   ├── authControlador.js     # Controlador de autenticación
│   └── dashboardControlador.js # Controlador del dashboard
├── middlewares/
│   ├── authMiddleware.js      # Middleware de autenticación
│   └── errorMiddleware.js     # Middleware de manejo de errores
├── modelos/
│   ├── index.js              # Configuración de Sequelize
│   ├── usuario.js            # Modelo de Usuario
│   ├── rol.js                # Modelo de Rol
│   ├── empleado.js           # Modelo de Empleado
│   ├── vacaciones.js         # Modelo de Vacaciones
│   ├── auditoria.js          # Modelo de Auditoría
│   └── ...                   # Otros modelos
├── rutas/
│   ├── authRutas.js          # Rutas de autenticación
│   └── dashboardRutas.js     # Rutas del dashboard
├── utilidades/
│   ├── logger.js             # Configuración de Winston
│   └── jwt.js                # Utilidades JWT
├── logs/                     # Archivos de logs
├── package.json
├── script_base_datos.sql     # Script de creación de BD
└── README.md
```

## API Endpoints

Esta es una guía detallada de los endpoints del API, agrupados por módulo. Todas las rutas comienzan con el prefijo `/api`.

#### Auth (`/api/auth`)
*   `POST /login` - Para iniciar sesión.
*   `POST /registro` - Registra un nuevo usuario (requiere rol de Administrador).
*   `GET /perfil` - Obtiene el perfil del usuario autenticado.

#### Empleados (`/api/empleados`)
*   `GET /obtenerempleados` - Obtiene la lista de todos los empleados.
*   `POST /crearempleado` - Crea un nuevo empleado.
*   `GET /obtener/:id_empleado` - Obtiene un empleado específico por su ID.
*   `PUT /actualizar/:id_empleado` - Actualiza un empleado existente.
*   `DELETE /eliminar/:id_empleado` - Elimina un empleado.

#### Puestos (`/api/puestos`)
*   `GET /obtenerpuestos` - Obtiene todos los puestos.
*   `POST /crearpuesto` - Crea un nuevo puesto.
*   `GET /:id_puesto` - Obtiene un puesto por ID.
*   `PUT /:id_puesto` - Actualiza un puesto.
*   `DELETE /:id_puesto` - Elimina un puesto.

#### Dependencias (`/api/dependencias`)
*   `GET /obtenerdependencias` - Obtiene todas las relaciones de dependencia.
*   `POST /creardependencia` - Crea una nueva relación de dependencia.
*   `GET /:id_dependencia` - Obtiene una dependencia por ID.
*   `PUT /:id_dependencia` - Actualiza una relación de dependencia.
*   `DELETE /:id_dependencia` - Elimina una relación de dependencia.

#### Vacantes (`/api/vacantes`)
*   `GET /obtenervacantes` - Obtiene todas las vacantes.
*   `POST /crearvacantes` - Crea una nueva vacante.
*   `GET /:id_vacante` - Obtiene una vacante por ID.
*   `PUT /:id_vacante` - Actualiza una vacante.
*   `DELETE /:id_vacante` - Elimina una vacante.

#### Candidatos (`/api/candidatos`)
*   `GET /obtenercandidatos` - Obtiene todos los candidatos.
*   `POST /crearcandidato` - Crea un nuevo candidato.
*   `GET /obtener/:id_candidato` - Obtiene un candidato por ID.
*   `PUT /actualizar/:id_candidato` - Actualiza un candidato.
*   `DELETE /eliminar/:id_candidato` - Elimina un candidato.

#### Aplicaciones a Vacantes (`/api/aplicaciones`)
*   `GET /obtener-aplicaciones` - Obtiene todas las aplicaciones.
*   `POST /crearaplicacion` - Crea una nueva aplicación.
*   `GET /obtener/:id_aplicacion` - Obtiene una aplicación por ID.
*   `PUT /actualizar/:id_aplicacion` - Actualiza el estado de una aplicación.
*   `DELETE /eliminar/:id_aplicacion` - Elimina una aplicación.

#### Contratos (`/api/contratos`)
*   `GET /obtener-todos` - Obtiene todos los contratos.
*   `POST /crear` - Crea un nuevo contrato.
*   `GET /obtener/:id_contrato` - Obtiene un contrato por ID.
*   `PUT /actualizar/:id_contrato` - Actualiza un contrato.
*   `DELETE /eliminar/:id_contrato` - Elimina un contrato.

#### Nómina (`/api/nomina`)
*   `GET /obtenernominas` - Obtiene todos los registros de nómina.
*   `POST /crearnomina` - Crea un nuevo registro de nómina.
*   `GET /:id_nomina` - Obtiene un registro de nómina por ID.
*   `PUT /:id_nomina` - Actualiza un registro de nómina.
*   `DELETE /:id_nomina` - Elimina un registro de nómina.

#### Vacaciones (`/api/vacaciones`)
*   `GET /obtenervacaciones` - Obtiene todas las solicitudes de vacaciones.
*   `POST /crearvacacion` - Crea una nueva solicitud de vacaciones.
*   `GET /:id_vacacion` - Obtiene una solicitud por ID.
*   `PUT /:id_vacacion` - Actualiza una solicitud.
*   `DELETE /:id_vacacion` - Elimina una solicitud.

#### Bienestar (Programas) (`/api/bienestar`)
*   `GET /obtenertodo-bienestar` - Obtiene todos los programas de bienestar.
*   `POST /crearbienestar` - Crea un nuevo programa.
*   `GET /obtener/:id_bienestar` - Obtiene un programa por ID.
*   `PUT /actualizar/:id_bienestar` - Actualiza un programa.
*   `DELETE /eliminar/:id_bienestar` - Elimina un programa.

#### Evaluaciones de Desempeño (`/api/evaluaciones`)
*   `GET /obtenerevaluaciones` - Obtiene todas las evaluaciones.
*   `POST /crearevaluacion` - Crea una nueva evaluación.
*   `GET /:id_evaluacion` - Obtiene una evaluación por ID.
*   `PUT /:id_evaluacion` - Actualiza una evaluación.
*   `DELETE /:id_evaluacion` - Elimina una evaluación.

#### Detalles de Evaluación (`/api/detalles-evaluacion`)
*   `GET /obtenerdetalleevaluacion` - Obtiene los detalles de una evaluación específica.
*   `POST /creardetalleevaluacion` - Añade un detalle a una evaluación.
*   `GET /:id_detalle` - Obtiene un detalle por ID.
*   `PUT /:id_detalle` - Actualiza un detalle.
*   `DELETE /:id_detalle` - Elimina un detalle.

#### Criterios de Evaluación (`/api/criterios`)
*   `GET /obtenercriterios` - Obtiene todos los criterios.
*   `POST /crearcriterio` - Crea un nuevo criterio.
*   `GET /:id_criterio` - Obtiene un criterio por ID.
*   `PUT /:id_criterio` - Actualiza un criterio.
*   `DELETE /:id_criterio` - Elimina un criterio.

#### Carreras (`/api/carreras`)
*   `GET /obtener-todas` - Obtiene todas las carreras.
*   `POST /crear` - Crea una nueva carrera.
*   `GET /obtener/:id_carrera` - Obtiene una carrera por ID.
*   `PUT /actualizar/:id_carrera` - Actualiza una carrera.
*   `DELETE /eliminar/:id_carrera` - Elimina una carrera.

#### Dashboard (`/api/dashboard`)
*   `GET /dashboardestadisticas` - Obtiene estadísticas generales.
*   `GET /dashboardresumen` - Obtiene un resumen del sistema.

#### Mantenimiento (`/api/mantenimiento`)
*   `GET /obtebertodoslosmantenimientos/usuarios` - Obtiene todos los usuarios.
*   `POST /crearmantenimiento/usuarios` - Crea un nuevo usuario.
*   `PUT /usuarios/:id_usuario` - Actualiza un usuario.
*   `DELETE /usuarios/:id_usuario` - Elimina un usuario.
*   `GET /auditoria` - Obtiene los registros de auditoría.

## Seguridad

### Implementaciones OWASP

1. **A01: Broken Access Control**
   - Middleware de autorización por roles
   - Validación de tokens JWT

2. **A02: Cryptographic Failures**
   - Contraseñas hasheadas con bcryptjs
   - JWT con secretos seguros

3. **A03: Injection**
   - ORM Sequelize para prevenir SQL injection
   - Validación de entrada con express-validator

4. **A05: Security Misconfiguration**
   - Helmet para headers de seguridad
   - CORS configurado correctamente

5. **A07: Identification and Authentication Failures**
   - JWT con expiración
   - Logs de intentos de login

6. **A09: Security Logging and Monitoring**
   - Winston para logging
   - Tabla de auditoría

## Logs

Los logs se guardan en:
- `logs/app.log` - Logs generales
- `logs/error.log` - Logs de errores

## Base de Datos

### Tablas Principales
- `usuarios` - Usuarios del sistema
- `roles` - Roles de usuario
- `empleados` - Información de empleados
- `vacaciones` - Solicitudes de vacaciones
- `auditoria` - Logs de auditoría

### Roles Disponibles
- **Administrador**: Acceso completo al sistema
- **Empleado**: Acceso limitado a funcionalidades básicas
- **Externo**: Acceso de solo lectura (placeholder)

## Desarrollo

### Agregar Nuevos Endpoints

1. Crear el controlador en `controladores/`
2. Crear las rutas en `rutas/`
3. Agregar validaciones con express-validator
4. Implementar middleware de autenticación/autorización
5. Agregar logs de auditoría

### Agregar Nuevos Modelos

1. Crear el modelo en `modelos/`
2. Definir las relaciones con otros modelos
3. Agregar validaciones
4. Actualizar el script SQL si es necesario

## Troubleshooting

### Error de Conexión a la Base de Datos
- Verificar que PostgreSQL esté ejecutándose
- Verificar credenciales en `.env`
- Verificar que la base de datos exista

### Error de JWT
- Verificar que JWT_SECRET esté configurado
- Verificar que el token no haya expirado

### Error de CORS
- Verificar configuración de CORS_ORIGIN
- Verificar que el frontend esté en el origen correcto

## Contribución

1. Crear una rama para tu feature
2. Implementar los cambios
3. Agregar tests si es necesario
4. Crear un pull request

## Licencia

MIT License 