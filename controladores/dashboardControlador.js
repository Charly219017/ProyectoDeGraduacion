// Carpeta backend/controladores/dashboardControlador.js
const logger = require('../utilidades/logger');
const { Empleados, Vacaciones, Evaluaciones } = require('../modelos');

/**
 * Controlador para obtener estadísticas del dashboard
 */
const obtenerEstadisticas = async (req, res) => {
  try {
    // Ejecutar todas las consultas en paralelo para mejorar el rendimiento
    const [
      empleadosActivos,
      vacacionesAprobadas,
      evaluacionesPendientes,
    ] = await Promise.all([
      Empleados.count({ where: { activo: true } }),
      Vacaciones.count({ where: { estado: 'Aprobada', activo: true } }),
      Evaluaciones.count({ where: { puntuacion_total: null, activo: true } })
    ]);

    const estadisticas = {
      empleadosActivos,
      vacacionesAprobadas,
      evaluacionesPendientes,
      ultimaActualizacion: new Date().toISOString()
    };

    logger.info(`Dashboard consultado por usuario: ${req.usuario.nombre_usuario}`);

    res.json({
      mensaje: 'Estadísticas obtenidas exitosamente',
      estadisticas
    });

  } catch (error) {
    logger.error('Error al obtener estadísticas del dashboard:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};

/**
 * Controlador para obtener información resumida del sistema
 */
const obtenerResumen = async (req, res) => {
  try {
    const resumen = {
      sistema: 'Sistema Jireh - CRM de Recursos Humanos',
      version: '1.0.0',
      estado: 'Activo',
      fechaServidor: new Date().toISOString(),
      usuario: {
        nombre: req.usuario.nombre_usuario,
        rol: req.usuario.roles
      }
    };

    logger.info(`Resumen del sistema consultado por: ${req.usuario.nombre_usuario}`);

    res.json({
      mensaje: 'Resumen del sistema obtenido exitosamente',
      resumen
    });

  } catch (error) {
    logger.error('Error al obtener resumen del sistema:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};

module.exports = {
  obtenerEstadisticas,
  obtenerResumen
};