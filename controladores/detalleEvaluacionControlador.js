// carpeta: controladores/detalleEvaluacionControlador.js
const { validationResult } = require('express-validator');
const { DetalleEvaluacion, Evaluaciones, Criterios, Usuarios, Auditoria } = require('../modelos');
const logger = require('../utilidades/logger');

/**
 * Controlador para crear un nuevo detalle de evaluación.
 */
const crearDetalleEvaluacion = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        const nuevoDetalle = await DetalleEvaluacion.create({
            ...req.body,
            creado_por: req.usuario.id
        }, { usuario: req.usuario });

        logger.info(`Detalle de evaluación creado exitosamente con ID: ${nuevoDetalle.id_detalle} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Detalle de evaluación creado exitosamente',
            detalle: nuevoDetalle
        });

    } catch (error) {
        logger.error('Error al crear detalle de evaluación:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener todos los detalles de evaluación, con opción de filtrar por id_evaluacion.
 */
const obtenerTodosDetallesEvaluacion = async (req, res) => {
    try {
        const { id_evaluacion } = req.query; // Filtrar por query param
        const whereClause = { activo: true };
        if (id_evaluacion) {
            whereClause.id_evaluacion = id_evaluacion;
        }

        const detalles = await DetalleEvaluacion.findAll({
            where: whereClause,
            include: [
                { model: Evaluaciones, as: 'evaluacion' },
                { model: Criterios, as: 'criterio' },
                { model: Usuarios, as: 'creador' }
            ]
        });

        logger.info(`Lista de detalles de evaluación consultada por ${req.usuario.nombre_usuario}`);
        res.json(detalles);

    } catch (error) {
        logger.error('Error al obtener los detalles de evaluación:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener un detalle de evaluación por su ID.
 */
const obtenerDetalleEvaluacionPorId = async (req, res) => {
    try {
        const { id_detalle } = req.params;

        const detalle = await DetalleEvaluacion.findByPk(id_detalle, {
            include: [
                { model: Evaluaciones, as: 'evaluacion' },
                { model: Criterios, as: 'criterio' },
                { model: Usuarios, as: 'creador' }
            ]
        });

        if (!detalle || !detalle.activo) {
            return res.status(404).json({ mensaje: 'Detalle de evaluación no encontrado' });
        }

        logger.info(`Detalle de evaluación con ID ${id_detalle} consultado por ${req.usuario.nombre_usuario}`);
        res.json(detalle);

    } catch (error) {
        logger.error(`Error al obtener detalle de evaluación por ID ${req.params.id_detalle}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para actualizar un detalle de evaluación por su ID.
 */
const actualizarDetalleEvaluacion = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_detalle } = req.params;
        const detalleAActualizar = await DetalleEvaluacion.findByPk(id_detalle);

        if (!detalleAActualizar) {
            return res.status(404).json({ mensaje: 'Detalle de evaluación no encontrado' });
        }

        await detalleAActualizar.update(req.body, { usuario: req.usuario });

        logger.info(`Detalle de evaluación con ID ${id_detalle} actualizado por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Detalle de evaluación actualizado exitosamente',
            detalle: detalleAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar detalle de evaluación por ID ${req.params.id_detalle}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para eliminar un detalle de evaluación por su ID.
 */
const eliminarDetalleEvaluacion = async (req, res) => {
    try {
        const { id_detalle } = req.params;
        const detalleAEliminar = await DetalleEvaluacion.findByPk(id_detalle);

        if (!detalleAEliminar || !detalleAEliminar.activo) {
            return res.status(404).json({ mensaje: 'Detalle de evaluación no encontrado' });
        }

        // Borrado lógico
        await detalleAEliminar.update({ activo: false }, { usuario: req.usuario });

        logger.info(`Detalle de evaluación con ID ${id_detalle} eliminado lógicamente por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Detalle de evaluación eliminado exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar detalle de evaluación por ID ${req.params.id_detalle}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    crearDetalleEvaluacion,
    obtenerTodosDetallesEvaluacion,
    obtenerDetalleEvaluacionPorId,
    actualizarDetalleEvaluacion,
    eliminarDetalleEvaluacion
};