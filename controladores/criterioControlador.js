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
            creado_por: req.usuario.id_usuario
        });

        await Auditoria.create({
            tabla_afectada: 'criterios',
            id_registro: nuevoCriterio.id_criterio,
            accion: 'CREAR',
            usuario: req.usuario.id_usuario,
            descripcion: `Creación de nuevo criterio: ${nuevoCriterio.nombre_criterio}`
        });

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

        if (!criterio) {
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

        await criterioAActualizar.update(req.body);

        await Auditoria.create({
            tabla_afectada: 'criterios',
            id_registro: criterioAActualizar.id_criterio,
            accion: 'ACTUALIZAR',
            usuario: req.usuario.id_usuario,
            descripcion: `Actualización de criterio con ID: ${criterioAActualizar.id_criterio}`
        });

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

        if (!criterioAEliminar) {
            return res.status(404).json({ mensaje: 'Criterio no encontrado' });
        }

        await criterioAEliminar.destroy();

        await Auditoria.create({
            tabla_afectada: 'criterios',
            id_registro: id_criterio,
            accion: 'ELIMINAR',
            usuario: req.usuario.id_usuario,
            descripcion: `Eliminación de criterio con ID: ${id_criterio}`
        });

        logger.info(`Criterio con ID ${id_criterio} eliminado por ${req.usuario.nombre_usuario}`);
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
