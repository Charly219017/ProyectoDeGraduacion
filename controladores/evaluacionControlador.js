// carpeta: controladores/evaluacionControlador.js
const { validationResult } = require('express-validator');
const { Evaluaciones, Empleados, Usuarios, Auditoria } = require('../modelos');
const logger = require('../utilidades/logger');

/**
 * Controlador para crear una nueva evaluación.
 */
const crearEvaluacion = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        const nuevaEvaluacion = await Evaluaciones.create({
            ...req.body,
            creado_por: req.usuario.id_usuario
        });

        await Auditoria.create({
            tabla_afectada: 'evaluaciones',
            id_registro: nuevaEvaluacion.id_evaluacion,
            accion: 'CREAR',
            usuario: req.usuario.id_usuario,
            descripcion: `Creación de nueva evaluación para el empleado ID ${nuevaEvaluacion.id_empleado}`
        });

        logger.info(`Evaluación creada exitosamente con ID: ${nuevaEvaluacion.id_evaluacion} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Evaluación creada exitosamente',
            evaluacion: nuevaEvaluacion
        });

    } catch (error) {
        logger.error('Error al crear evaluación:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener todas las evaluaciones.
 */
const obtenerTodasEvaluaciones = async (req, res) => {
    try {
        const evaluaciones = await Evaluaciones.findAll({
            include: [
                { model: Empleados, as: 'empleado' },
                { model: Usuarios, as: 'creador' }
            ]
        });

        logger.info(`Lista de evaluaciones consultada por ${req.usuario.nombre_usuario}`);
        res.json(evaluaciones);

    } catch (error) {
        logger.error('Error al obtener todas las evaluaciones:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener una evaluación por su ID.
 */
const obtenerEvaluacionPorId = async (req, res) => {
    try {
        const { id_evaluacion } = req.params;

        const evaluacion = await Evaluaciones.findByPk(id_evaluacion, {
            include: [
                { model: Empleados, as: 'empleado' },
                { model: Usuarios, as: 'creador' }
            ]
        });

        if (!evaluacion) {
            return res.status(404).json({ mensaje: 'Evaluación no encontrada' });
        }

        logger.info(`Evaluación con ID ${id_evaluacion} consultada por ${req.usuario.nombre_usuario}`);
        res.json(evaluacion);

    } catch (error) {
        logger.error(`Error al obtener evaluación por ID ${req.params.id_evaluacion}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para actualizar una evaluación por su ID.
 */
const actualizarEvaluacion = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_evaluacion } = req.params;
        const evaluacionAActualizar = await Evaluaciones.findByPk(id_evaluacion);

        if (!evaluacionAActualizar) {
            return res.status(404).json({ mensaje: 'Evaluación no encontrada' });
        }

        await evaluacionAActualizar.update(req.body);

        await Auditoria.create({
            tabla_afectada: 'evaluaciones',
            id_registro: evaluacionAActualizar.id_evaluacion,
            accion: 'ACTUALIZAR',
            usuario: req.usuario.id_usuario,
            descripcion: `Actualización de evaluación con ID: ${evaluacionAActualizar.id_evaluacion}`
        });

        logger.info(`Evaluación con ID ${id_evaluacion} actualizada por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Evaluación actualizada exitosamente',
            evaluacion: evaluacionAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar evaluación por ID ${req.params.id_evaluacion}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para eliminar una evaluación por su ID.
 */
const eliminarEvaluacion = async (req, res) => {
    try {
        const { id_evaluacion } = req.params;
        const evaluacionAEliminar = await Evaluaciones.findByPk(id_evaluacion);

        if (!evaluacionAEliminar) {
            return res.status(404).json({ mensaje: 'Evaluación no encontrada' });
        }

        await evaluacionAEliminar.destroy();

        await Auditoria.create({
            tabla_afectada: 'evaluaciones',
            id_registro: id_evaluacion,
            accion: 'ELIMINAR',
            usuario: req.usuario.id_usuario,
            descripcion: `Eliminación de evaluación con ID: ${id_evaluacion}`
        });

        logger.info(`Evaluación con ID ${id_evaluacion} eliminada por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Evaluación eliminada exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar evaluación por ID ${req.params.id_evaluacion}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    crearEvaluacion,
    obtenerTodasEvaluaciones,
    obtenerEvaluacionPorId,
    actualizarEvaluacion,
    eliminarEvaluacion
};
