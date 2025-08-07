// carpeta backend/middlewares/errorMiddleware.js
const logger = require('../utilidades/logger');

/**
 * Middleware para manejar todos los errores de la aplicación, priorizando los errores de Sequelize.
 * @param {Error} error - El objeto de error.
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * @param {Function} next - La función para pasar al siguiente middleware.
 */
const manejarErrores = (error, req, res, next) => {
    // Manejar errores específicos de Sequelize primero
    if (error.name === 'SequelizeValidationError') {
        const errores = error.errors.map(err => ({
            campo: err.path,
            mensaje: err.message
        }));
        logger.warn(`Errores de validación: ${JSON.stringify(errores)}`);
        return res.status(400).json({
            mensaje: 'Datos de entrada inválidos',
            errores
        });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
        const campo = error.errors[0]?.path || 'campo';
        logger.warn(`Violación de restricción única en campo: ${campo}`);
        return res.status(409).json({
            mensaje: `El ${campo} ya existe en el sistema`
        });
    }

    if (error.name === 'SequelizeConnectionError') {
        logger.error('Error de conexión a la base de datos:', error.message);
        return res.status(503).json({
            mensaje: 'Servicio temporalmente no disponible'
        });
    }

    if (error.name === 'SequelizeDatabaseError') {
        logger.error('Error de base de datos:', error.message);
        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }

    // Manejar otros errores no manejados
    logger.error('Error no manejado:', {
        mensaje: error.message,
        stack: error.stack,
        url: req.url,
        metodo: req.method,
        ip: req.ip
    });

    const statusCode = error.statusCode || 500;
    const mensaje = error.message || 'Error interno del servidor';

    const respuesta = {
        mensaje,
        ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack,
            detalles: error
        })
    };

    res.status(statusCode).json(respuesta);
};

/**
 * Middleware para manejar rutas no encontradas (404).
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 */
const rutaNoEncontrada = (req, res) => {
    logger.warn(`Ruta no encontrada: ${req.method} ${req.url}`);
    res.status(404).json({
        mensaje: 'Ruta no encontrada'
    });
};

module.exports = {
    manejarErrores,
    rutaNoEncontrada
};