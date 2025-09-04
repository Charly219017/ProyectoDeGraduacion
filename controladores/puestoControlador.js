// carpeta: controladores/puestoControlador.js
const { validationResult } = require('express-validator');
const { Puestos, Departamentos, Auditoria, Usuarios } = require('../modelos');
const logger = require('../utilidades/logger');

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
        });

        // Registrar la acción en la tabla de auditoría
        await Auditoria.create({
            accion: 'CREAR_PUESTO',
            usuario: req.usuario.id,
            descripcion: JSON.stringify({
                mensaje: `Creación de nuevo puesto: ${nuevoPuesto.nombre_puesto}`,
                nuevo_puesto_id: nuevoPuesto.id_puesto,
            }),
            tabla_afectada: 'puestos',
            id_registro_afectado: nuevoPuesto.id_puesto
        });

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
        const puestos = await Puestos.findAll({ // Se elimina el filtro de estado ya que la columna no existe en la BD
            include: [
                // { model: Departamentos, as: 'departamento' }, // Modelo Departamentos no existe
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
        const puesto = await Puestos.findByPk(id_puesto, {
            include: [
                // { model: Departamentos, as: 'departamento' }, // Modelo Departamentos no existe
                { model: Usuarios, as: 'creador' },
                { model: Usuarios, as: 'actualizador' }
            ]
        });

        if (!puesto) {
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
        const puestoAActualizar = await Puestos.findByPk(id_puesto);

        if (!puestoAActualizar) {
            return res.status(404).json({ mensaje: 'Puesto no encontrado' });
        }

        await puestoAActualizar.update({
            ...req.body,
            actualizado_por: req.usuario.id,
            fecha_actualizacion: new Date()
        });

        // Registrar la acción en la tabla de auditoría
        await Auditoria.create({
            accion: 'ACTUALIZAR_PUESTO',
            usuario: req.usuario.id,
            descripcion: JSON.stringify({
                mensaje: `Actualización de puesto: ${puestoAActualizar.nombre_puesto}`,
                puesto_actualizado_id: puestoAActualizar.id_puesto,
                nuevos_datos: req.body
            }),
            tabla_afectada: 'puestos',
            id_registro_afectado: puestoAActualizar.id_puesto
        });

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
        const puestoAEliminar = await Puestos.findByPk(id_puesto);

        if (!puestoAEliminar) {
            return res.status(404).json({ mensaje: 'Puesto no encontrado' });
        }

        // Borrado físico, ya que la tabla no tiene campo de estado
        await puestoAEliminar.destroy();

        // Registrar la acción en la tabla de auditoría
        await Auditoria.create({
            accion: 'ELIMINAR_PUESTO',
            usuario: req.usuario.id,
            descripcion: JSON.stringify({
                mensaje: `Eliminación de puesto: ${puestoAEliminar.nombre_puesto}`,
                puesto_eliminado_id: puestoAEliminar.id_puesto,
            }),
            tabla_afectada: 'puestos',
            id_registro_afectado: puestoAEliminar.id_puesto
        });

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
