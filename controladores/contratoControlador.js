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
        });

        await Auditoria.create({
            tabla_afectada: 'contratos',
            id_registro: nuevoContrato.id_contrato,
            accion: 'CREAR',
            usuario: req.usuario.id,
            valor_nuevo: JSON.stringify(nuevoContrato),
            descripcion: JSON.stringify({ mensaje: `Creación de nuevo contrato para el empleado con ID: ${nuevoContrato.id_empleado}` })
        });

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

        const valorAnterior = { ...contratoAActualizar.get({ plain: true }) };

        await contratoAActualizar.update({
            ...req.body,
            actualizado_por: req.usuario.id,
            fecha_actualizacion: new Date()
        });

        await Auditoria.create({
            tabla_afectada: 'contratos',
            id_registro: contratoAActualizar.id_contrato,
            accion: 'ACTUALIZAR',
            usuario: req.usuario.id,
            valor_anterior: JSON.stringify(valorAnterior),
            valor_nuevo: JSON.stringify(req.body),
            descripcion: JSON.stringify({ mensaje: `Actualización de contrato con ID: ${contratoAActualizar.id_contrato}` })
        });

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
        await contratoAEliminar.update({ activo: false });

        await Auditoria.create({
            tabla_afectada: 'contratos',
            id_registro: id_contrato,
            accion: 'ELIMINAR',
            usuario: req.usuario.id,
            valor_anterior: JSON.stringify(contratoAEliminar),
            descripcion: JSON.stringify({ mensaje: `Eliminación lógica de contrato con ID: ${id_contrato}` })
        });

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