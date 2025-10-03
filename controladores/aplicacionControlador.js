// carpeta: controladores/aplicacionControlador.js
const { validationResult } = require('express-validator');
const { Aplicaciones, Vacantes, Candidatos, Usuarios, Auditoria } = require('../modelos');
const logger = require('../utilidades/logger');

/**
 * Controlador para crear una nueva aplicación.
 */
const crearAplicacion = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        // Excluir fecha_aplicacion del cuerpo para que la BD la genere
        const { fecha_aplicacion, ...datosAplicacion } = req.body;

        const nuevaAplicacion = await Aplicaciones.create({
            ...datosAplicacion,
            creado_por: req.usuario.id
        }, { usuario: req.usuario });

        logger.info(`Aplicación creada exitosamente con ID: ${nuevaAplicacion.id_aplicacion} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Aplicación creada exitosamente',
            aplicacion: nuevaAplicacion
        });

    } catch (error) {
        logger.error('Error al crear aplicación:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener todas las aplicaciones.
 */
const obtenerTodasAplicaciones = async (req, res) => {
    try {
        const aplicaciones = await Aplicaciones.findAll({
            attributes: ['id_aplicacion', 'id_vacante', 'id_candidato', 'estado_aplicacion', 'observaciones', 'fecha_aplicacion', 'creado_por', 'activo'],
            where: { activo: true },
            include: [
                { 
                    model: Vacantes, 
                    as: 'vacante',
                    where: { activo: true }
                },
                { 
                    model: Candidatos, 
                    as: 'candidato',
                    where: { activo: true }
                },
                { model: Usuarios, as: 'creador' }
            ]
        });

        logger.info(`Lista de aplicaciones consultada por ${req.usuario.nombre_usuario}`);
        res.json(aplicaciones);

    } catch (error) {
        logger.error('Error al obtener todas las aplicaciones:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener una aplicación por su ID.
 */
const obtenerAplicacionPorId = async (req, res) => {
    try {
        const { id_aplicacion } = req.params;

        const aplicacion = await Aplicaciones.findByPk(id_aplicacion, {
            attributes: ['id_aplicacion', 'id_vacante', 'id_candidato', 'estado_aplicacion', 'observaciones', 'fecha_aplicacion', 'creado_por', 'activo'],
            include: [
                { 
                    model: Vacantes, 
                    as: 'vacante',
                    where: { activo: true }
                },
                { 
                    model: Candidatos, 
                    as: 'candidato',
                    where: { activo: true }
                },
                { model: Usuarios, as: 'creador' }
            ]
        });

        if (!aplicacion || !aplicacion.activo) {
            return res.status(404).json({ mensaje: 'Aplicación no encontrada' });
        }

        logger.info(`Aplicación con ID ${id_aplicacion} consultada por ${req.usuario.nombre_usuario}`);
        res.json(aplicacion);

    } catch (error) {
        logger.error(`Error al obtener aplicación por ID ${req.params.id_aplicacion}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para actualizar una aplicación por su ID.
 */
const actualizarAplicacion = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_aplicacion } = req.params;
        const aplicacionAActualizar = await Aplicaciones.findByPk(id_aplicacion);

        if (!aplicacionAActualizar || !aplicacionAActualizar.activo) {
            return res.status(404).json({ mensaje: 'Aplicación no encontrada' });
        }

        // Excluir fecha_aplicacion para evitar que se actualice
        const { fecha_aplicacion, ...datosActualizacion } = req.body;

        await aplicacionAActualizar.update(datosActualizacion, { usuario: req.usuario });

        logger.info(`Aplicación con ID ${id_aplicacion} actualizada por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Aplicación actualizada exitosamente',
            aplicacion: aplicacionAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar aplicación por ID ${req.params.id_aplicacion}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para eliminar una aplicación por su ID.
 */
const eliminarAplicacion = async (req, res) => {
    try {
        const { id_aplicacion } = req.params;
        const aplicacionAEliminar = await Aplicaciones.findByPk(id_aplicacion);

        if (!aplicacionAEliminar || !aplicacionAEliminar.activo) {
            return res.status(404).json({ mensaje: 'Aplicación no encontrada' });
        }

        // Borrado lógico usando el campo activo
        await aplicacionAEliminar.update({
            activo: false
        }, { usuario: req.usuario });

        logger.info(`Aplicación con ID ${id_aplicacion} eliminada por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Aplicación eliminada exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar aplicación por ID ${req.params.id_aplicacion}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    crearAplicacion,
    obtenerTodasAplicaciones,
    obtenerAplicacionPorId,
    actualizarAplicacion,
    eliminarAplicacion
};