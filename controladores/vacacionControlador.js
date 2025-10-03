// carpeta: controladores/vacacionControlador.js
const { validationResult } = require('express-validator');
const { Vacaciones, Empleados, Usuarios, Auditoria } = require('../modelos');
const logger = require('../utilidades/logger');

/**
 * Controlador para crear una nueva solicitud de vacaciones.
 */
const crearVacacion = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        const nuevaVacacion = await Vacaciones.create({
            ...req.body,
            creado_por: req.usuario.id
        }, { usuario: req.usuario });

        logger.info(`Solicitud de vacaciones creada exitosamente con ID: ${nuevaVacacion.id_vacacion} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Solicitud de vacaciones creada exitosamente',
            vacacion: nuevaVacacion
        });

    } catch (error) {
        logger.error('Error al crear solicitud de vacaciones:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener todas las solicitudes de vacaciones.
 */
const obtenerTodasVacaciones = async (req, res) => {
    try {
        const vacaciones = await Vacaciones.findAll({
            where: { activo: true },
            include: [
                { model: Empleados, as: 'empleado' },
                { model: Usuarios, as: 'creador' },
                { model: Usuarios, as: 'actualizador' }
            ]
        });

        logger.info(`Lista de vacaciones consultada por ${req.usuario.nombre_usuario}`);
        res.json(vacaciones);

    } catch (error) {
        logger.error('Error al obtener todas las solicitudes de vacaciones:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener una solicitud de vacaciones por su ID.
 */
const obtenerVacacionPorId = async (req, res) => {
    try {
        const { id_vacacion } = req.params;

        const vacacion = await Vacaciones.findByPk(id_vacacion, {
            include: [
                { model: Empleados, as: 'empleado' },
                { model: Usuarios, as: 'creador' },
                { model: Usuarios, as: 'actualizador' }
            ]
        });

        if (!vacacion || !vacacion.activo) {
            return res.status(404).json({ mensaje: 'Solicitud de vacaciones no encontrada' });
        }

        logger.info(`Vacación con ID ${id_vacacion} consultada por ${req.usuario.nombre_usuario}`);
        res.json(vacacion);

    } catch (error) {
        logger.error(`Error al obtener solicitud de vacaciones por ID ${req.params.id_vacacion}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para actualizar una solicitud de vacaciones por su ID.
 */
const actualizarVacacion = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_vacacion } = req.params;
        const vacacionAActualizar = await Vacaciones.findByPk(id_vacacion);

        if (!vacacionAActualizar || !vacacionAActualizar.activo) {
            return res.status(404).json({ mensaje: 'Solicitud de vacaciones no encontrada' });
        }

        await vacacionAActualizar.update({
            ...req.body,
            actualizado_por: req.usuario.id,
            fecha_actualizacion: new Date()
        }, { usuario: req.usuario });

        logger.info(`Vacación con ID ${id_vacacion} actualizada por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Solicitud de vacaciones actualizada exitosamente',
            vacacion: vacacionAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar solicitud de vacaciones por ID ${req.params.id_vacacion}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para eliminar una solicitud de vacaciones por su ID.
 */
const eliminarVacacion = async (req, res) => {
    try {
        const { id_vacacion } = req.params;
        const vacacionAEliminar = await Vacaciones.findOne({ 
            where: { id_vacacion, activo: true } 
        });

        if (!vacacionAEliminar) {
            return res.status(404).json({ mensaje: 'Solicitud de vacaciones no encontrada' });
        }

        // Borrado lógico
        await vacacionAEliminar.update({ 
            activo: false,
            actualizado_por: req.usuario.id,
            fecha_actualizacion: new Date()
        }, { usuario: req.usuario });

        logger.info(`Solicitud de vacaciones con ID ${id_vacacion} eliminada lógicamente por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Solicitud de vacaciones eliminada exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar solicitud de vacaciones por ID ${req.params.id_vacacion}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    crearVacacion,
    obtenerTodasVacaciones,
    obtenerVacacionPorId,
    actualizarVacacion,
    eliminarVacacion
};