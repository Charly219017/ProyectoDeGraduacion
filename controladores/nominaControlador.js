// carpeta: controladores/nominaControlador.js
const { validationResult } = require('express-validator');
const { Nomina, Empleados, Usuarios } = require('../modelos');
const logger = require('../utilidades/logger');
const { calcularNomina } = require('../utilidades/calculoNomina');

/**
 * Controlador para crear un nuevo registro de nómina calculado.
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

        // 1. Recibir los datos de entrada
        const { id_empleado, mes, anio, ...datosEntrada } = req.body;

        // 2. Realizar el cálculo de la nómina
        const nominaCalculada = calcularNomina(datosEntrada);

        // 3. Combinar datos de entrada y calculados para guardar en la BD
        const datosParaGuardar = {
            id_empleado,
            mes,
            anio,
            ...nominaCalculada,
            creado_por: req.usuario.id
        };

        const nuevaNomina = await Nomina.create(datosParaGuardar, { usuario: req.usuario });

        logger.info(`Nómina creada exitosamente con ID: ${nuevaNomina.id_nomina} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Registro de nómina creado y calculado exitosamente',
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
            ],
            order: [['anio', 'DESC'], ['mes', 'DESC']]
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
 * Controlador para actualizar y recalcular un registro de nómina.
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

        // 1. Fusionar datos existentes con los nuevos datos del body
        const datosParaCalculo = {
            salario_base: req.body.salario_base || nominaAActualizar.salario_base,
            horas_extras: req.body.horas_extras || nominaAActualizar.horas_extras,
            comisiones: req.body.comisiones || nominaAActualizar.comisiones,
            isr: req.body.isr || nominaAActualizar.isr,
            otros_descuentos: req.body.otros_descuentos || nominaAActualizar.otros_descuentos
        };

        // 2. Recalcular la nómina
        const nominaCalculada = calcularNomina(datosParaCalculo);

        // 3. Preparar datos para la actualización
        const datosParaGuardar = {
            ...req.body, // Permite actualizar mes, anio, id_empleado si se envían
            ...nominaCalculada,
            actualizado_por: req.usuario.id,
            fecha_actualizacion: new Date()
        };

        await nominaAActualizar.update(datosParaGuardar, { usuario: req.usuario });

        logger.info(`Nómina con ID ${id_nomina} actualizada por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Registro de nómina actualizado y recalculado exitosamente',
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
