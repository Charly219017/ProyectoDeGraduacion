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
   DB_PASSWORD=crenedlr05
   JWT_SECRET=sistema_jireh_jwt_secret_key_2025
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

#### Empleados (`/api/empleados`)
*   `GET /` - Obtiene la lista de todos los empleados.
*   `GET /:id` - Obtiene un empleado específico por su ID.
*   `POST /` - Crea un nuevo empleado.
*   `PUT /:id` - Actualiza un empleado existente.
*   `DELETE /:id` - Elimina un empleado.

#### Puestos (`/api/puestos`)
*   `GET /` - Obtiene todos los puestos.
*   `GET /:id` - Obtiene un puesto por ID.
*   `POST /` - Crea un nuevo puesto.
*   `PUT /:id` - Actualiza un puesto.
*   `DELETE /:id` - Elimina un puesto.

#### Dependencias (`/api/dependencias`)
*   `GET /` - Obtiene todas las relaciones de dependencia.
*   `GET /:id` - Obtiene una dependencia por ID.
*   `POST /` - Crea una nueva relación de dependencia.
*   `PUT /:id` - Actualiza una relación de dependencia.
*   `DELETE /:id` - Elimina una relación de dependencia.

#### Vacantes (`/api/vacantes`)
*   `GET /` - Obtiene todas las vacantes.
*   `GET /:id` - Obtiene una vacante por ID.
*   `POST /` - Crea una nueva vacante.
*   `PUT /:id` - Actualiza una vacante.
*   `DELETE /:id` - Elimina una vacante.

#### Candidatos (`/api/candidatos`)
*   `GET /` - Obtiene todos los candidatos.
*   `GET /:id` - Obtiene un candidato por ID.
*   `POST /` - Crea un nuevo candidato.
*   `PUT /:id` - Actualiza un candidato.
*   `DELETE /:id` - Elimina un candidato.

#### Aplicaciones a Vacantes (`/api/aplicaciones`)
*   `GET /` - Obtiene todas las aplicaciones.
*   `GET /:id` - Obtiene una aplicación por ID.
*   `POST /` - Crea una nueva aplicación.
*   `PUT /:id` - Actualiza el estado de una aplicación.

#### Contratos (`/api/contratos`)
*   `GET /` - Obtiene todos los contratos.
*   `GET /:id` - Obtiene un contrato por ID.
*   `POST /` - Crea un nuevo contrato.
*   `PUT /:id` - Actualiza un contrato.
*   `DELETE /:id` - Elimina un contrato.

#### Nómina (`/api/nomina`)
*   `GET /` - Obtiene todos los registros de nómina.
*   `GET /:id` - Obtiene un registro de nómina por ID.
*   `POST /` - Crea un nuevo registro de nómina.
*   `PUT /:id` - Actualiza un registro de nómina.
*   `DELETE /:id` - Elimina un registro de nómina.

#### Vacaciones (`/api/vacaciones`)
*   `GET /` - Obtiene todas las solicitudes de vacaciones.
*   `GET /:id` - Obtiene una solicitud por ID.
*   `POST /` - Crea una nueva solicitud de vacaciones.
*   `PUT /:id` - Actualiza una solicitud.
*   `DELETE /:id` - Elimina una solicitud.

#### Bienestar (Programas) (`/api/bienestar`)
*   `GET /` - Obtiene todos los programas de bienestar.
*   `GET /:id` - Obtiene un programa por ID.
*   `POST /` - Crea un nuevo programa.
*   `PUT /:id` - Actualiza un programa.
*   `DELETE /:id` - Elimina un programa.

#### Evaluaciones de Desempeño (`/api/evaluaciones`)
*   `GET /` - Obtiene todas las evaluaciones.
*   `GET /:id` - Obtiene una evaluación por ID.
*   `POST /` - Crea una nueva evaluación.

#### Detalles de Evaluación (`/api/detalles-evaluacion`)
*   `GET /evaluacion/:id_evaluacion` - Obtiene los detalles de una evaluación específica.
*   `POST /` - Añade un detalle a una evaluación.

#### Criterios de Evaluación (`/api/criterios`)
*   `GET /` - Obtiene todos los criterios.
*   `POST /` - Crea un nuevo criterio.
*   `PUT /:id` - Actualiza un criterio.
*   `DELETE /:id` - Elimina un criterio.

#### Carreras (`/api/carreras`)
*   `GET /` - Obtiene todas las carreras.
*   `POST /` - Crea una nueva carrera.
*   `PUT /:id` - Actualiza una carrera.
*   `DELETE /:id` - Elimina una carrera.

#### Dashboard (`/api/dashboard`)
*   `GET /counts` - Obtiene contadores generales (empleados, vacantes, etc.).

#### Mantenimiento (`/api/mantenimiento`)
*   `POST /backup` - Realiza un backup de la base de datos.
*   `GET /restore` - Obtiene la lista de backups disponibles.
*   `POST /restore` - Restaura la base de datos desde un backup específico.

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