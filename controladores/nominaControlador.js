// carpeta: controladores/nominaControlador.js
const { validationResult } = require('express-validator');
const { Nomina, Empleados, Usuarios, Auditoria } = require('../modelos');
const logger = require('../utilidades/logger');

/**
 * Controlador para crear un nuevo registro de nómina.
 */
const crearNomina = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        const nuevaNomina = await Nomina.create({
            ...req.body,
            creado_por: req.usuario.id
        }, { usuario: req.usuario });

        logger.info(`Nómina creada exitosamente con ID: ${nuevaNomina.id_nomina} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Registro de nómina creado exitosamente',
            nomina: nuevaNomina
        });

    } catch (error) {
        logger.error('Error al crear registro de nómina:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener todos los registros de nómina.
 */
const obtenerTodasNominas = async (req, res) => {
    try {
        const nominas = await Nomina.findAll({
            where: { activo: true },
            include: [
                { model: Empleados, as: 'empleado' },
                { model: Usuarios, as: 'creador' },
                { model: Usuarios, as: 'actualizador' }
            ]
        });

        logger.info(`Lista de nóminas consultada por ${req.usuario.nombre_usuario}`);
        res.json(nominas);

    } catch (error) {
        logger.error('Error al obtener todos los registros de nómina:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener un registro de nómina por su ID.
 */
const obtenerNominaPorId = async (req, res) => {
    try {
        const { id_nomina } = req.params;

        const nomina = await Nomina.findByPk(id_nomina, {
            include: [
                { model: Empleados, as: 'empleado' },
                { model: Usuarios, as: 'creador' },
                { model: Usuarios, as: 'actualizador' }
            ]
        });

        if (!nomina || !nomina.activo) {
            return res.status(404).json({ mensaje: 'Registro de nómina no encontrado' });
        }

        logger.info(`Nómina con ID ${id_nomina} consultada por ${req.usuario.nombre_usuario}`);
        res.json(nomina);

    } catch (error) {
        logger.error(`Error al obtener registro de nómina por ID ${req.params.id_nomina}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para actualizar un registro de nómina por su ID.
 */
const actualizarNomina = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_nomina } = req.params;
        const nominaAActualizar = await Nomina.findOne({
            where: { id_nomina, activo: true }
        });

        if (!nominaAActualizar) {
            return res.status(404).json({ mensaje: 'Registro de nómina no encontrado' });
        }

        await nominaAActualizar.update({
            ...req.body,
            actualizado_por: req.usuario.id,
            fecha_actualizacion: new Date()
        }, { usuario: req.usuario });

        logger.info(`Nómina con ID ${id_nomina} actualizada por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Registro de nómina actualizado exitosamente',
            nomina: nominaAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar registro de nómina por ID ${req.params.id_nomina}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para eliminar lógicamente un registro de nómina por su ID.
 */
const eliminarNomina = async (req, res) => {
    try {
        const { id_nomina } = req.params;
        const nominaAEliminar = await Nomina.findOne({
            where: { id_nomina, activo: true }
        });

        if (!nominaAEliminar) {
            return res.status(404).json({ mensaje: 'Registro de nómina no encontrado' });
        }

        await nominaAEliminar.update({ 
            activo: false,
            actualizado_por: req.usuario.id,
            fecha_actualizacion: new Date()
        }, { usuario: req.usuario });

        logger.info(`Nómina con ID ${id_nomina} eliminada lógicamente por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Registro de nómina eliminado exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar registro de nómina por ID ${req.params.id_nomina}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    crearNomina,
    obtenerTodasNominas,
    obtenerNominaPorId,
    actualizarNomina,
    eliminarNomina
};