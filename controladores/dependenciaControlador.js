// carpeta: controladores/dependenciaControlador.js
const { validationResult } = require('express-validator');
const { Dependencias, Puestos, Auditoria } = require('../modelos');
const logger = require('../utilidades/logger');

/**
 * Controlador para crear una nueva dependencia.
 */
const crearDependencia = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        const nuevaDependencia = await Dependencias.create(req.body, { usuario: req.usuario });

        logger.info(`Dependencia creada exitosamente con ID: ${nuevaDependencia.id_dependencia} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Dependencia creada exitosamente',
            dependencia: nuevaDependencia
        });

    } catch (error) {
        logger.error('Error al crear dependencia:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener todas las dependencias.
 */
const obtenerTodasDependencias = async (req, res) => {
    try {
        const dependencias = await Dependencias.findAll({
            include: [
                { model: Puestos, as: 'puesto_superior' },
                { model: Puestos, as: 'puesto_subordinado' }
            ]
        });

        logger.info(`Lista de dependencias consultada por ${req.usuario.nombre_usuario}`);
        res.json(dependencias);

    } catch (error) {
        logger.error('Error al obtener todas las dependencias:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener una dependencia por su ID.
 */
const obtenerDependenciaPorId = async (req, res) => {
    try {
        const { id_dependencia } = req.params;

        const dependencia = await Dependencias.findByPk(id_dependencia, {
            include: [
                { model: Puestos, as: 'puesto_superior' },
                { model: Puestos, as: 'puesto_subordinado' }
            ]
        });

        if (!dependencia) {
            return res.status(404).json({ mensaje: 'Dependencia no encontrada' });
        }

        logger.info(`Dependencia con ID ${id_dependencia} consultada por ${req.usuario.nombre_usuario}`);
        res.json(dependencia);

    } catch (error) {
        logger.error(`Error al obtener dependencia por ID ${req.params.id_dependencia}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para actualizar una dependencia por su ID.
 */
const actualizarDependencia = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_dependencia } = req.params;
        const dependenciaAActualizar = await Dependencias.findByPk(id_dependencia);

        if (!dependenciaAActualizar) {
            return res.status(404).json({ mensaje: 'Dependencia no encontrada' });
        }

        await dependenciaAActualizar.update(req.body, { usuario: req.usuario });

        logger.info(`Dependencia con ID ${id_dependencia} actualizada por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Dependencia actualizada exitosamente',
            dependencia: dependenciaAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar dependencia por ID ${req.params.id_dependencia}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para eliminar una dependencia por su ID.
 */
const eliminarDependencia = async (req, res) => {
    try {
        const { id_dependencia } = req.params;
        const dependenciaAEliminar = await Dependencias.findByPk(id_dependencia);

        if (!dependenciaAEliminar) {
            return res.status(404).json({ mensaje: 'Dependencia no encontrada' });
        }

        await dependenciaAEliminar.destroy({ usuario: req.usuario });

        logger.info(`Dependencia con ID ${id_dependencia} eliminada por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Dependencia eliminada exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar dependencia por ID ${req.params.id_dependencia}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    crearDependencia,
    obtenerTodasDependencias,
    obtenerDependenciaPorId,
    actualizarDependencia,
    eliminarDependencia
};