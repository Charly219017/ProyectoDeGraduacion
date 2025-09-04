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

        const nuevaAplicacion = await Aplicaciones.create({
            ...req.body,
            creado_por: req.usuario.id_usuario
        });

        await Auditoria.create({
            tabla_afectada: 'aplicaciones',
            id_registro: nuevaAplicacion.id_aplicacion,
            accion: 'CREAR',
            usuario: req.usuario.id_usuario,
            descripcion: `Creación de nueva aplicación para la vacante ID ${nuevaAplicacion.id_vacante} por el candidato ID ${nuevaAplicacion.id_candidato}`
        });

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
            include: [
                { model: Vacantes, as: 'vacante' },
                { model: Candidatos, as: 'candidato' },
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
            include: [
                { model: Vacantes, as: 'vacante' },
                { model: Candidatos, as: 'candidato' },
                { model: Usuarios, as: 'creador' }
            ]
        });

        if (!aplicacion) {
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

        if (!aplicacionAActualizar) {
            return res.status(404).json({ mensaje: 'Aplicación no encontrada' });
        }

        await aplicacionAActualizar.update(req.body);

        await Auditoria.create({
            tabla_afectada: 'aplicaciones',
            id_registro: aplicacionAActualizar.id_aplicacion,
            accion: 'ACTUALIZAR',
            usuario: req.usuario.id_usuario,
            descripcion: `Actualización de aplicación con ID: ${aplicacionAActualizar.id_aplicacion}`
        });

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

        if (!aplicacionAEliminar) {
            return res.status(404).json({ mensaje: 'Aplicación no encontrada' });
        }

        await aplicacionAEliminar.destroy();

        await Auditoria.create({
            tabla_afectada: 'aplicaciones',
            id_registro: id_aplicacion,
            accion: 'ELIMINAR',
            usuario: req.usuario.id_usuario,
            descripcion: `Eliminación de aplicación con ID: ${id_aplicacion}`
        });

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
