// carpeta: controladores/vacanteControlador.js
const { validationResult } = require('express-validator');
const { Vacantes, Puestos, Carreras, Usuarios, Auditoria } = require('../modelos');
const logger = require('../utilidades/logger');

/**
 * Controlador para crear una nueva vacante.
 */
const crearVacante = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        const nuevaVacante = await Vacantes.create({
            ...req.body,
            creado_por: req.usuario.id
        });

        await Auditoria.create({
            tabla_afectada: 'vacantes',
            id_registro: nuevaVacante.id_vacante,
            accion: 'CREAR',
            usuario: req.usuario.id,
            descripcion: JSON.stringify({ mensaje: `Creación de nueva vacante: ${nuevaVacante.titulo}` })
        });

        logger.info(`Vacante creada exitosamente: ${nuevaVacante.titulo} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Vacante creada exitosamente',
            vacante: nuevaVacante
        });

    } catch (error) {
        logger.error('Error al crear vacante:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener todas las vacantes.
 */
const obtenerTodasVacantes = async (req, res) => {
    try {
        const vacantes = await Vacantes.findAll({
            where: { activo: true },
            include: [
                { 
                    model: Puestos, 
                    as: 'puesto',
                    where: { activo: true },
                    include: [
                        { model: Carreras, as: 'carrera' }
                    ]
                },
                { model: Usuarios, as: 'creador' },
                { model: Usuarios, as: 'actualizador' }
            ]
        });

        logger.info(`Lista de vacantes consultada por ${req.usuario.nombre_usuario}`);
        res.json(vacantes);

    } catch (error) {
        logger.error('Error al obtener todas las vacantes:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener una vacante por su ID.
 */
const obtenerVacantePorId = async (req, res) => {
    try {
        const { id_vacante } = req.params;

        const vacante = await Vacantes.findByPk(id_vacante, {
            include: [
                { 
                    model: Puestos, 
                    as: 'puesto',
                    include: [
                        { model: Carreras, as: 'carrera' }
                    ]
                },
                { model: Usuarios, as: 'creador' },
                { model: Usuarios, as: 'actualizador' }
            ]
        });

        if (!vacante || !vacante.activo) {
            return res.status(404).json({ mensaje: 'Vacante no encontrada' });
        }

        logger.info(`Vacante con ID ${id_vacante} consultada por ${req.usuario.nombre_usuario}`);
        res.json(vacante);

    } catch (error) {
        logger.error(`Error al obtener vacante por ID ${req.params.id_vacante}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para actualizar una vacante por su ID.
 */
const actualizarVacante = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_vacante } = req.params;
        const vacanteAActualizar = await Vacantes.findByPk(id_vacante);

        if (!vacanteAActualizar || !vacanteAActualizar.activo) {
            return res.status(404).json({ mensaje: 'Vacante no encontrada' });
        }

        await vacanteAActualizar.update({
            ...req.body,
            actualizado_por: req.usuario.id
        });

        await Auditoria.create({
            tabla_afectada: 'vacantes',
            id_registro: vacanteAActualizar.id_vacante,
            accion: 'ACTUALIZAR',
            usuario: req.usuario.id,
            descripcion: JSON.stringify({ mensaje: `Actualización de vacante con ID: ${vacanteAActualizar.id_vacante}` })
        });

        logger.info(`Vacante con ID ${id_vacante} actualizada por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Vacante actualizada exitosamente',
            vacante: vacanteAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar vacante por ID ${req.params.id_vacante}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para eliminar una vacante por su ID.
 */
const eliminarVacante = async (req, res) => {
    try {
        const { id_vacante } = req.params;
        const vacanteAEliminar = await Vacantes.findByPk(id_vacante);

        if (!vacanteAEliminar || !vacanteAEliminar.activo) {
            return res.status(404).json({ mensaje: 'Vacante no encontrada' });
        }

        // Borrado lógico usando el campo activo
        await vacanteAEliminar.update({
            activo: false,
            actualizado_por: req.usuario.id,
            fecha_actualizacion: new Date()
        });

        await Auditoria.create({
            tabla_afectada: 'vacantes',
            id_registro: id_vacante,
            accion: 'ELIMINAR',
            usuario: req.usuario.id,
            descripcion: JSON.stringify({ mensaje: `Eliminación de vacante con ID: ${id_vacante}` })
        });

        logger.info(`Vacante con ID ${id_vacante} eliminada por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Vacante eliminada exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar vacante por ID ${req.params.id_vacante}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    crearVacante,
    obtenerTodasVacantes,
    obtenerVacantePorId,
    actualizarVacante,
    eliminarVacante
};