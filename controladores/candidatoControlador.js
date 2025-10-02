// carpeta: controladores/candidatoControlador.js
const { validationResult } = require('express-validator');
const { Candidatos, Usuarios, Auditoria } = require('../modelos');
const logger = require('../utilidades/logger');

/**
 * Controlador para crear un nuevo candidato.
 */
const crearCandidato = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        const nuevoCandidato = await Candidatos.create({
            ...req.body,
            creado_por: req.usuario.id
        });

        await Auditoria.create({
            tabla_afectada: 'candidatos',
            id_registro: nuevoCandidato.id_candidato,
            accion: 'CREAR',
            usuario: req.usuario.id,
            valor_nuevo: JSON.stringify(nuevoCandidato),
            descripcion: JSON.stringify({ mensaje: `Creación de nuevo candidato: ${nuevoCandidato.nombre_completo}` })
        });

        logger.info(`Candidato creado exitosamente: ${nuevoCandidato.nombre_completo} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Candidato creado exitosamente',
            candidato: nuevoCandidato
        });

    } catch (error) {
        logger.error('Error al crear candidato:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener todos los candidatos.
 */
const obtenerTodosCandidatos = async (req, res) => {
    try {
        const candidatos = await Candidatos.findAll({
            where: { activo: true },
            include: [
                { model: Usuarios, as: 'creador' }
            ]
        });

        logger.info(`Lista de candidatos consultada por ${req.usuario.nombre_usuario}`);
        res.json(candidatos);

    } catch (error) {
        logger.error('Error al obtener todos los candidatos:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener un candidato por su ID.
 */
const obtenerCandidatoPorId = async (req, res) => {
    try {
        const { id_candidato } = req.params;

        const candidato = await Candidatos.findByPk(id_candidato, {
            include: [
                { model: Usuarios, as: 'creador' }
            ]
        });

        if (!candidato || !candidato.activo) {
            return res.status(404).json({ mensaje: 'Candidato no encontrado' });
        }

        logger.info(`Candidato con ID ${id_candidato} consultado por ${req.usuario.nombre_usuario}`);
        res.json(candidato);

    } catch (error) {
        logger.error(`Error al obtener candidato por ID ${req.params.id_candidato}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para actualizar un candidato por su ID.
 */
const actualizarCandidato = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_candidato } = req.params;
        const candidatoAActualizar = await Candidatos.findByPk(id_candidato);

        if (!candidatoAActualizar || !candidatoAActualizar.activo) {
            return res.status(404).json({ mensaje: 'Candidato no encontrado' });
        }

        const valorAnterior = { ...candidatoAActualizar.get({ plain: true }) };

        await candidatoAActualizar.update(req.body);

        await Auditoria.create({
            tabla_afectada: 'candidatos',
            id_registro: candidatoAActualizar.id_candidato,
            accion: 'ACTUALIZAR',
            usuario: req.usuario.id,
            valor_anterior: JSON.stringify(valorAnterior),
            valor_nuevo: JSON.stringify(req.body),
            descripcion: JSON.stringify({ mensaje: `Actualización de candidato con ID: ${candidatoAActualizar.id_candidato}` })
        });

        logger.info(`Candidato con ID ${id_candidato} actualizado por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Candidato actualizado exitosamente',
            candidato: candidatoAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar candidato por ID ${req.params.id_candidato}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para eliminar un candidato por su ID.
 */
const eliminarCandidato = async (req, res) => {
    try {
        const { id_candidato } = req.params;
        const candidatoAEliminar = await Candidatos.findByPk(id_candidato);

        if (!candidatoAEliminar || !candidatoAEliminar.activo) {
            return res.status(404).json({ mensaje: 'Candidato no encontrado' });
        }

        // Borrado lógico usando el campo activo
        await candidatoAEliminar.update({
            activo: false
        });

        await Auditoria.create({
            tabla_afectada: 'candidatos',
            id_registro: id_candidato,
            accion: 'ELIMINAR',
            usuario: req.usuario.id,
            valor_anterior: JSON.stringify(candidatoAEliminar),
            descripcion: JSON.stringify({ mensaje: `Eliminación de candidato con ID: ${id_candidato}` })
        });

        logger.info(`Candidato con ID ${id_candidato} eliminado por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Candidato eliminado exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar candidato por ID ${req.params.id_candidato}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    crearCandidato,
    obtenerTodosCandidatos,
    obtenerCandidatoPorId,
    actualizarCandidato,
    eliminarCandidato
};