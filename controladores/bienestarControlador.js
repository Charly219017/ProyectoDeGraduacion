// carpeta: controladores/bienestarControlador.js
const { validationResult } = require('express-validator');
const { Bienestar, Usuarios, Auditoria } = require('../modelos');
const logger = require('../utilidades/logger');

/**
 * Controlador para crear una nueva actividad de bienestar.
 */
const crearActividadBienestar = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        const nuevaActividad = await Bienestar.create({
            ...req.body,
            creado_por: req.usuario.id_usuario
        });

        await Auditoria.create({
            tabla_afectada: 'bienestar',
            id_registro: nuevaActividad.id_bienestar,
            accion: 'CREAR',
            usuario: req.usuario.id_usuario,
            descripcion: `Creación de nueva actividad de bienestar: ${nuevaActividad.nombre_actividad}`
        });

        logger.info(`Actividad de bienestar creada exitosamente: ${nuevaActividad.nombre_actividad} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Actividad de bienestar creada exitosamente',
            actividad: nuevaActividad
        });

    } catch (error) {
        logger.error('Error al crear actividad de bienestar:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener todas las actividades de bienestar.
 */
const obtenerTodasActividadesBienestar = async (req, res) => {
    try {
        const actividades = await Bienestar.findAll({
            include: [
                { model: Usuarios, as: 'creador' }
            ]
        });

        logger.info(`Lista de actividades de bienestar consultada por ${req.usuario.nombre_usuario}`);
        res.json(actividades);

    } catch (error) {
        logger.error('Error al obtener todas las actividades de bienestar:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener una actividad de bienestar por su ID.
 */
const obtenerActividadBienestarPorId = async (req, res) => {
    try {
        const { id_bienestar } = req.params;

        const actividad = await Bienestar.findByPk(id_bienestar, {
            include: [
                { model: Usuarios, as: 'creador' }
            ]
        });

        if (!actividad) {
            return res.status(404).json({ mensaje: 'Actividad de bienestar no encontrada' });
        }

        logger.info(`Actividad de bienestar con ID ${id_bienestar} consultada por ${req.usuario.nombre_usuario}`);
        res.json(actividad);

    } catch (error) {
        logger.error(`Error al obtener actividad de bienestar por ID ${req.params.id_bienestar}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para actualizar una actividad de bienestar por su ID.
 */
const actualizarActividadBienestar = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_bienestar } = req.params;
        const actividadAActualizar = await Bienestar.findByPk(id_bienestar);

        if (!actividadAActualizar) {
            return res.status(404).json({ mensaje: 'Actividad de bienestar no encontrada' });
        }

        // El modelo Bienestar no tiene campos de actualización, pero se deja la estructura por si se añaden en el futuro.
        await actividadAActualizar.update(req.body);

        await Auditoria.create({
            tabla_afectada: 'bienestar',
            id_registro: actividadAActualizar.id_bienestar,
            accion: 'ACTUALIZAR',
            usuario: req.usuario.id_usuario,
            descripcion: `Actualización de actividad de bienestar con ID: ${actividadAActualizar.id_bienestar}`
        });

        logger.info(`Actividad de bienestar con ID ${id_bienestar} actualizada por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Actividad de bienestar actualizada exitosamente',
            actividad: actividadAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar actividad de bienestar por ID ${req.params.id_bienestar}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para eliminar una actividad de bienestar por su ID.
 */
const eliminarActividadBienestar = async (req, res) => {
    try {
        const { id_bienestar } = req.params;
        const actividadAEliminar = await Bienestar.findByPk(id_bienestar);

        if (!actividadAEliminar) {
            return res.status(404).json({ mensaje: 'Actividad de bienestar no encontrada' });
        }

        await actividadAEliminar.destroy();

        await Auditoria.create({
            tabla_afectada: 'bienestar',
            id_registro: id_bienestar,
            accion: 'ELIMINAR',
            usuario: req.usuario.id_usuario,
            descripcion: `Eliminación de actividad de bienestar con ID: ${id_bienestar}`
        });

        logger.info(`Actividad de bienestar con ID ${id_bienestar} eliminada por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Actividad de bienestar eliminada exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar actividad de bienestar por ID ${req.params.id_bienestar}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    crearActividadBienestar,
    obtenerTodasActividadesBienestar,
    obtenerActividadBienestarPorId,
    actualizarActividadBienestar,
    eliminarActividadBienestar
};
