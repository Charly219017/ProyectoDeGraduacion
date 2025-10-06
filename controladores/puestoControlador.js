// carpeta: controladores/puestoControlador.js
const { validationResult } = require('express-validator');
const { Puestos, Carreras, Auditoria, Usuarios } = require('../modelos');
const logger = require('../utilidades/logger');

/**
 * Helper para encontrar un puesto por ID y verificar que esté activo.
 * @param {string} id_puesto - El ID del puesto a buscar.
 * @returns {Promise<Puestos|null>} El modelo del puesto o null si no se encuentra.
 */
const findPuestoActivoById = (id_puesto) => {
    return Puestos.findOne({
        where: { id_puesto, activo: true }
    });
};

/**
 * Controlador para crear un nuevo puesto.
 */
const crearPuesto = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        const nuevoPuesto = await Puestos.create({
            ...req.body,
            creado_por: req.usuario.id
        }, { usuario: req.usuario });

        logger.info(`Puesto creado exitosamente: ${nuevoPuesto.nombre_puesto} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Puesto creado exitosamente',
            puesto: nuevoPuesto
        });

    } catch (error) {
        logger.error('Error al crear puesto:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener todos los puestos.
 */
const obtenerTodosPuestos = async (req, res) => {
    try {
        const puestos = await Puestos.findAll({ 
            where: { activo: true },
            include: [
                { model: Carreras, as: 'carrera' },
                { model: Usuarios, as: 'creador' },
                { model: Usuarios, as: 'actualizador' }
            ]
        });

        logger.info(`Lista de puestos consultada por ${req.usuario.nombre_usuario}`);
        res.json(puestos);

    } catch (error) {
        logger.error('Error al obtener todos los puestos:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener un puesto por su ID.
 */
const obtenerPuestoPorId = async (req, res) => {
    try {
        const { id_puesto } = req.params;
        const puesto = await findPuestoActivoById(id_puesto);
        if (!puesto || !puesto.activo) {
            return res.status(404).json({ mensaje: 'Puesto no encontrado' });
        }

        logger.info(`Puesto con ID ${id_puesto} consultado por ${req.usuario.nombre_usuario}`);
        res.json(puesto);

    } catch (error) {
        logger.error(`Error al obtener puesto por ID ${req.params.id_puesto}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para actualizar un puesto por su ID.
 */
const actualizarPuesto = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_puesto } = req.params;
        const puestoAActualizar = await findPuestoActivoById(id_puesto);

        if (!puestoAActualizar) {
            return res.status(404).json({ mensaje: 'Puesto no encontrado' });
        }

        await puestoAActualizar.update({
            ...req.body,
            actualizado_por: req.usuario.id
        }, { usuario: req.usuario });

        logger.info(`Puesto con ID ${id_puesto} actualizado por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Puesto actualizado exitosamente',
            puesto: puestoAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar puesto por ID ${req.params.id_puesto}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para eliminar un puesto por su ID.
 */
const eliminarPuesto = async (req, res) => {
    try {
        const { id_puesto } = req.params;
        const puestoAEliminar = await findPuestoActivoById(id_puesto);

        if (!puestoAEliminar) {
            return res.status(404).json({ mensaje: 'Puesto no encontrado' });
        }

        // Borrado lógico usando el campo activo
        await puestoAEliminar.update({
            activo: false,
            actualizado_por: req.usuario.id
        }, { usuario: req.usuario });

        logger.info(`Puesto con ID ${id_puesto} eliminado por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Puesto eliminado exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar puesto por ID ${req.params.id_puesto}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    crearPuesto,
    obtenerTodosPuestos,
    obtenerPuestoPorId,
    actualizarPuesto,
    eliminarPuesto
};
