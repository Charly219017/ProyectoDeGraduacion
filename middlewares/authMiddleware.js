// Carpeta backend/middlewares/authMiddleware.js
const { verificarToken, extraerToken } = require('../utilidades/jwt');
const logger = require('../utilidades/logger');
// Importa el objeto de modelos centralizado desde index.js
const db = require('../modelos');
const { Usuarios, Roles } = db;


/**
 * Middleware para verificar la autenticación JWT
 */
const autenticarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = extraerToken(authHeader);

    if (!token) {
      logger.warn('Intento de acceso sin token de autenticación');
      return res.status(401).json({
        mensaje: 'Token de autenticación requerido'
      });
    }

    const decoded = verificarToken(token);

    const usuario = await Usuarios.findByPk(decoded.id, {
      include: [{
        model: Roles,
        as: 'roles'
      }]
    });

    if (!usuario) {
      logger.warn(`Usuario no encontrado: ${decoded.id}`);
      return res.status(401).json({
        mensaje: 'Usuario no válido'
      });
    }

    req.usuario = {
      id: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      correo: usuario.correo,
      roles: usuario.roles?.nombre_rol || 'Invitado'
    };

    logger.info(`Usuario autenticado: ${usuario.nombre_usuario} (${req.usuario.rol})`);
    next();
  } catch (error) {
    logger.error('Error en autenticación:', error.message);
    return res.status(401).json({
      mensaje: 'Token inválido o expirado'
    });
  }
};

/**
 * Middleware para autorizar roles específicos
 */
const autorizarRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      logger.warn('Intento de autorización sin usuario autenticado');
      return res.status(401).json({
        mensaje: 'Autenticación requerida'
      });
    }

    if (!roles.includes(req.usuario.roles)) {
      logger.warn(`Acceso denegado para usuario ${req.usuario.nombre_usuario} con rol ${req.usuario.roles}`);
      return res.status(403).json({
        mensaje: 'No tienes permisos para realizar esta acción'
      });
    }

    logger.info(`Acceso autorizado para usuario ${req.usuario.nombre_usuario} con rol ${req.usuario.roles}`);
    next();
  };
};

const soloAdministradores = autorizarRoles('Administrador');
const empleadosYAdmin = autorizarRoles('Administrador', 'Supervisor', 'Digitador','Empleado','Externo');

module.exports = {
  autenticarToken,
  autorizarRoles,
  soloAdministradores,
  empleadosYAdmin
};
