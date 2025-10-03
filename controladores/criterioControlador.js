// carpeta: controladores/criterioControlador.js
const { validationResult } = require('express-validator');
const { Criterios, Usuarios, Auditoria } = require('../modelos');
const logger = require('../utilidades/logger');

/**
 * Controlador para crear un nuevo criterio.
 */
const crearCriterio = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        const nuevoCriterio = await Criterios.create({
            ...req.body,
            creado_por: req.usuario.id
        }, { usuario: req.usuario });

        logger.info(`Criterio creado exitosamente: ${nuevoCriterio.nombre_criterio} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Criterio creado exitosamente',
            criterio: nuevoCriterio
        });

    } catch (error) {
        logger.error('Error al crear criterio:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener todos los criterios.
 */
const obtenerTodosCriterios = async (req, res) => {
    try {
        const criterios = await Criterios.findAll({
            where: { activo: true },
            include: [
                { model: Usuarios, as: 'creador' }
            ]
        });

        logger.info(`Lista de criterios consultada por ${req.usuario.nombre_usuario}`);
        res.json(criterios);

    } catch (error) {
        logger.error('Error al obtener todos los criterios:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener un criterio por su ID.
 */
const obtenerCriterioPorId = async (req, res) => {
    try {
        const { id_criterio } = req.params;

        const criterio = await Criterios.findByPk(id_criterio, {
            include: [
                { model: Usuarios, as: 'creador' }
            ]
        });

        if (!criterio || !criterio.activo) {
            return res.status(404).json({ mensaje: 'Criterio no encontrado' });
        }

        logger.info(`Criterio con ID ${id_criterio} consultado por ${req.usuario.nombre_usuario}`);
        res.json(criterio);

    } catch (error) {
        logger.error(`Error al obtener criterio por ID ${req.params.id_criterio}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para actualizar un criterio por su ID.
 */
const actualizarCriterio = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_criterio } = req.params;
        const criterioAActualizar = await Criterios.findByPk(id_criterio);

        if (!criterioAActualizar) {
            return res.status(404).json({ mensaje: 'Criterio no encontrado' });
        }

        await criterioAActualizar.update(req.body, { usuario: req.usuario });

        logger.info(`Criterio con ID ${id_criterio} actualizado por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Criterio actualizado exitosamente',
            criterio: criterioAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar criterio por ID ${req.params.id_criterio}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para eliminar un criterio por su ID.
 */
const eliminarCriterio = async (req, res) => {
    try {
        const { id_criterio } = req.params;
        const criterioAEliminar = await Criterios.findByPk(id_criterio);

        if (!criterioAEliminar || !criterioAEliminar.activo) {
            return res.status(404).json({ mensaje: 'Criterio no encontrado' });
        }

        // Borrado lógico
        await criterioAEliminar.update({ activo: false }, { usuario: req.usuario });

        logger.info(`Criterio con ID ${id_criterio} eliminado lógicamente por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Criterio eliminado exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar criterio por ID ${req.params.id_criterio}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    crearCriterio,
    obtenerTodosCriterios,
    obtenerCriterioPorId,
    actualizarCriterio,
    eliminarCriterio
};