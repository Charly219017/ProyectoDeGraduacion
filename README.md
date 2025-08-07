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

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/registro` - Registrar usuario (solo administradores)
- `GET /api/auth/perfil` - Obtener perfil del usuario

### Dashboard
- `GET /api/dashboard/estadisticas` - Obtener estadísticas
- `GET /api/dashboard/resumen` - Obtener resumen del sistema

### Salud del Sistema
- `GET /api/health` - Verificar estado del servidor

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