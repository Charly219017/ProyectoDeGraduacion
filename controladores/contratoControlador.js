// carpeta: controladores/contratoControlador.js
const { validationResult } = require('express-validator');
const { Contratos, Empleados, Usuarios, Auditoria } = require('../modelos');
const logger = require('../utilidades/logger');

/**
 * Controlador para crear un nuevo contrato.
 */
const crearContrato = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        const nuevoContrato = await Contratos.create({
            ...req.body,
            creado_por: req.usuario.id
        }, { usuario: req.usuario });

        logger.info(`Contrato creado exitosamente con ID: ${nuevoContrato.id_contrato} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Contrato creado exitosamente',
            contrato: nuevoContrato
        });

    } catch (error) {
        logger.error('Error al crear contrato:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener todos los contratos.
 */
const obtenerTodosContratos = async (req, res) => {
    try {
        const contratos = await Contratos.findAll({
            where: { activo: true },
            include: [
                { model: Empleados, as: 'empleado' },
                { model: Usuarios, as: 'creador' },
                { model: Usuarios, as: 'actualizador' }
            ]
        });

        logger.info(`Lista de contratos consultada por ${req.usuario.nombre_usuario}`);
        res.json(contratos);

    } catch (error) {
        logger.error('Error al obtener todos los contratos:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener un contrato por su ID.
 */
const obtenerContratoPorId = async (req, res) => {
    try {
        const { id_contrato } = req.params;

        const contrato = await Contratos.findByPk(id_contrato, {
            include: [
                { model: Empleados, as: 'empleado' },
                { model: Usuarios, as: 'creador' },
                { model: Usuarios, as: 'actualizador' }
            ]
        });

        if (!contrato || !contrato.activo) {
            return res.status(404).json({ mensaje: 'Contrato no encontrado' });
        }

        logger.info(`Contrato con ID ${id_contrato} consultado por ${req.usuario.nombre_usuario}`);
        res.json(contrato);

    } catch (error) {
        logger.error(`Error al obtener contrato por ID ${req.params.id_contrato}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para actualizar un contrato por su ID.
 */
const actualizarContrato = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_contrato } = req.params;
        const contratoAActualizar = await Contratos.findByPk(id_contrato);

        if (!contratoAActualizar) {
            return res.status(404).json({ mensaje: 'Contrato no encontrado' });
        }

        await contratoAActualizar.update({
            ...req.body,
            actualizado_por: req.usuario.id,
            fecha_actualizacion: new Date()
        }, { usuario: req.usuario });

        logger.info(`Contrato con ID ${id_contrato} actualizado por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Contrato actualizado exitosamente',
            contrato: contratoAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar contrato por ID ${req.params.id_contrato}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para eliminar un contrato por su ID.
 */
const eliminarContrato = async (req, res) => {
    try {
        const { id_contrato } = req.params;
        const contratoAEliminar = await Contratos.findByPk(id_contrato);

        if (!contratoAEliminar || !contratoAEliminar.activo) {
            return res.status(404).json({ mensaje: 'Contrato no encontrado' });
        }

        // Borrado lógico
        await contratoAEliminar.update({ activo: false }, { usuario: req.usuario });

        logger.info(`Contrato con ID ${id_contrato} eliminado lógicamente por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Contrato eliminado exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar contrato por ID ${req.params.id_contrato}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    crearContrato,
    obtenerTodosContratos,
    obtenerContratoPorId,
    actualizarContrato,
    eliminarContrato
};