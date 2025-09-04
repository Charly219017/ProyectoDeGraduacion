// carpeta: controladores/carreraControlador.js
const { validationResult } = require('express-validator');
const { Carreras, Auditoria } = require('../modelos');
const logger = require('../utilidades/logger');

/**
 * Controlador para crear una nueva carrera.
 */
const crearCarrera = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        const nuevaCarrera = await Carreras.create({
            ...req.body,
            creado_por: req.usuario.id
        });

        // Registrar la acción en la tabla de auditoría
        await Auditoria.create({
            accion: 'CREAR_CARRERA',
            usuario: req.usuario.id,
            descripcion: JSON.stringify({
                mensaje: `Creación de nueva carrera: ${nuevaCarrera.nombre_carrera}`,
                nueva_carrera_id: nuevaCarrera.id_carrera,
            }),
            tabla_afectada: 'carreras',
            id_registro_afectado: nuevaCarrera.id_carrera
        });

        logger.info(`Carrera creada exitosamente: ${nuevaCarrera.nombre_carrera} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Carrera creada exitosamente',
            carrera: nuevaCarrera
        });

    } catch (error) {
        logger.error('Error al crear carrera:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener todas las carreras.
 */
const obtenerTodasCarreras = async (req, res) => {
    try {
        const carreras = await Carreras.findAll();

        logger.info(`Lista de carreras consultada por ${req.usuario.nombre_usuario}`);
        res.json(carreras);

    } catch (error) {
        logger.error('Error al obtener todas las carreras:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener una carrera por su ID.
 */
const obtenerCarreraPorId = async (req, res) => {
    try {
        const { id_carrera } = req.params;
        const carrera = await Carreras.findByPk(id_carrera);

        if (!carrera) {
            return res.status(404).json({ mensaje: 'Carrera no encontrada' });
        }

        logger.info(`Carrera con ID ${id_carrera} consultada por ${req.usuario.nombre_usuario}`);
        res.json(carrera);

    } catch (error) {
        logger.error(`Error al obtener carrera por ID ${req.params.id_carrera}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para actualizar una carrera por su ID.
 */
const actualizarCarrera = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_carrera } = req.params;
        const carreraAActualizar = await Carreras.findByPk(id_carrera);

        if (!carreraAActualizar) {
            return res.status(404).json({ mensaje: 'Carrera no encontrada' });
        }

        await carreraAActualizar.update({
            ...req.body,
            actualizado_por: req.usuario.id,
            fecha_actualizacion: new Date()
        });

        // Registrar la acción en la tabla de auditoría
        await Auditoria.create({
            accion: 'ACTUALIZAR_CARRERA',
            usuario: req.usuario.id,
            descripcion: JSON.stringify({
                mensaje: `Actualización de carrera: ${carreraAActualizar.nombre_carrera}`,
                carrera_actualizada_id: carreraAActualizar.id_carrera,
                nuevos_datos: req.body
            }),
            tabla_afectada: 'carreras',
            id_registro_afectado: carreraAActualizar.id_carrera
        });

        logger.info(`Carrera con ID ${id_carrera} actualizada por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Carrera actualizada exitosamente',
            carrera: carreraAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar carrera por ID ${req.params.id_carrera}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para eliminar una carrera por su ID.
 */
const eliminarCarrera = async (req, res) => {
    try {
        const { id_carrera } = req.params;
        const carreraAEliminar = await Carreras.findByPk(id_carrera);

        if (!carreraAEliminar) {
            return res.status(404).json({ mensaje: 'Carrera no encontrada' });
        }

        // Borrado físico, ya que la tabla no tiene campo de estado
        await carreraAEliminar.destroy();

        // Registrar la acción en la tabla de auditoría
        await Auditoria.create({
            accion: 'ELIMINAR_CARRERA',
            usuario: req.usuario.id,
            descripcion: JSON.stringify({
                mensaje: `Eliminación de carrera: ${carreraAEliminar.nombre_carrera}`,
                carrera_eliminada_id: carreraAEliminar.id_carrera,
            }),
            tabla_afectada: 'carreras',
            id_registro_afectado: carreraAEliminar.id_carrera
        });

        logger.info(`Carrera con ID ${id_carrera} eliminada por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Carrera eliminada exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar carrera por ID ${req.params.id_carrera}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    crearCarrera,
    obtenerTodasCarreras,
    obtenerCarreraPorId,
    actualizarCarrera,
    eliminarCarrera
};
