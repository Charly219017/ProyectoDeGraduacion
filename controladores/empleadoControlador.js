// carpeta: controladores/empleadoControlador.js
const { validationResult } = require('express-validator');
const { Empleados, Puestos, Carreras, Usuarios, Auditoria } = require('../modelos');
const logger = require('../utilidades/logger');

/**
 * Controlador para crear un nuevo empleado.
 */
const crearEmpleado = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        const nuevoEmpleado = await Empleados.create({
            ...req.body,
            creado_por: req.usuario.id
        });

        // Registrar la acción en la tabla de auditoría
        await Auditoria.create({
            accion: 'CREAR_EMPLEADO',
            usuario: req.usuario.id,
            descripcion: JSON.stringify({
                mensaje: `Creación de nuevo empleado: ${nuevoEmpleado.nombre_completo}`,
                nuevo_empleado_id: nuevoEmpleado.id_empleado,
            }),
            tabla_afectada: 'empleados',
            id_registro_afectado: nuevoEmpleado.id_empleado
        });

        logger.info(`Empleado creado exitosamente: ${nuevoEmpleado.nombre_completo} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Empleado creado exitosamente',
            empleado: nuevoEmpleado
        });

    } catch (error) {
        logger.error('Error al crear empleado:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener todos los empleados.
 */
const obtenerTodosEmpleados = async (req, res) => {
    try {
        const empleados = await Empleados.findAll({
            // Añadimos la condición para filtrar solo empleados activos
            where: {
                activo: true
            },
            // Incluir las relaciones con Puestos, Creador y Actualizador
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

        logger.info(`Lista de empleados consultada por ${req.usuario.nombre_usuario}`);
        res.json(empleados);

    } catch (error) {
        logger.error('Error al obtener todos los empleados:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener un empleado por su ID.
 */
const obtenerEmpleadoPorId = async (req, res) => {
    try {
        const { id_empleado } = req.params;

        const empleado = await Empleados.findByPk(id_empleado, {
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

        if (!empleado || !empleado.activo) {
            return res.status(404).json({ mensaje: 'Empleado no encontrado' });
        }

        logger.info(`Empleado con ID ${id_empleado} consultado por ${req.usuario.nombre_usuario}`);
        res.json(empleado);

    } catch (error) {
        logger.error(`Error al obtener empleado por ID ${req.params.id_empleado}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para actualizar un empleado por su ID.
 */
const actualizarEmpleado = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_empleado } = req.params;
        const empleadoAActualizar = await Empleados.findByPk(id_empleado);

        if (!empleadoAActualizar || !empleadoAActualizar.activo) {
            return res.status(404).json({ mensaje: 'Empleado no encontrado' });
        }

        await empleadoAActualizar.update({
            ...req.body,
            actualizado_por: req.usuario.id
        });

        // Registrar la acción en la tabla de auditoría
        await Auditoria.create({
            accion: 'ACTUALIZAR_EMPLEADO',
            usuario: req.usuario.id,
            descripcion: JSON.stringify({
                mensaje: `Actualización de empleado: ${empleadoAActualizar.nombre_completo}`,
                empleado_actualizado_id: empleadoAActualizar.id_empleado,
                nuevos_datos: req.body
            }),
            tabla_afectada: 'empleados',
            id_registro_afectado: empleadoAActualizar.id_empleado
        });

        logger.info(`Empleado con ID ${id_empleado} actualizado por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Empleado actualizado exitosamente',
            empleado: empleadoAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar empleado por ID ${req.params.id_empleado}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para eliminar un empleado por su ID.
 */
const eliminarEmpleado = async (req, res) => {
    try {
        const { id_empleado } = req.params;
        const empleadoAEliminar = await Empleados.findByPk(id_empleado);

        if (!empleadoAEliminar || !empleadoAEliminar.activo) {
            return res.status(404).json({ mensaje: 'Empleado no encontrado' });
        }

        // Borrado lógico: cambiar el estado a false (inactivo)
        await empleadoAEliminar.update({ 
            activo: false,
            actualizado_por: req.usuario.id
        });

        // Registrar la acción en la tabla de auditoría
        await Auditoria.create({
            accion: 'ELIMINAR_EMPLEADO',
            usuario: req.usuario.id,
            descripcion: JSON.stringify({
                mensaje: `Eliminación de empleado: ${empleadoAEliminar.nombre_completo}`,
                empleado_eliminado_id: empleadoAEliminar.id_empleado,
            }),
            tabla_afectada: 'empleados',
            id_registro_afectado: empleadoAEliminar.id_empleado
        });

        logger.info(`Empleado con ID ${id_empleado} eliminado por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Empleado eliminado exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar empleado por ID ${req.params.id_empleado}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    crearEmpleado,
    obtenerTodosEmpleados,
    obtenerEmpleadoPorId,
    actualizarEmpleado,
    eliminarEmpleado
};