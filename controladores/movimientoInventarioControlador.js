// carpeta: controladores/movimientoInventarioControlador.js
const { validationResult } = require('express-validator');
const { MovimientosInventario, Productos, Usuarios, sequelize } = require('../modelos');
const logger = require('../utilidades/logger');

const crearMovimiento = async (req, res) => {
    logger.info('Usuario en crearMovimiento:', req.usuario);
    if (!req.usuario || !req.usuario.id) {
        logger.error('El ID del usuario para la auditoría está vacío en req.usuario.');
        return res.status(400).json({ mensaje: 'El ID del usuario para la auditoría no puede estar vacío.' });
    }

    const t = await sequelize.transaction();

    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        const { id_producto, tipo_movimiento, cantidad } = req.body;

        const producto = await Productos.findByPk(id_producto, { transaction: t });
        if (!producto) {
            await t.rollback();
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        if (tipo_movimiento === 'Salida' && producto.stock_actual < cantidad) {
            await t.rollback();
            return res.status(400).json({ mensaje: 'Stock insuficiente para realizar la salida' });
        }

        const nuevoMovimiento = await MovimientosInventario.create({
            ...req.body,
            creado_por: req.usuario.id
        }, { transaction: t });
        
        // The trigger in the database will handle the stock update.
        // We commit the transaction to fire the trigger.

        await t.commit();

        logger.info(`Movimiento de inventario creado exitosamente para el producto ID ${id_producto} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Movimiento de inventario creado exitosamente',
            movimiento: nuevoMovimiento
        });

    } catch (error) {
        await t.rollback();
        logger.error('Error al crear movimiento de inventario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const obtenerTodosMovimientos = async (req, res) => {
    try {
        const movimientos = await MovimientosInventario.findAll({
            where: {
                activo: true
            },
            include: [
                { model: Productos, as: 'producto' },
                { model: Usuarios, as: 'creador' }
            ],
            order: [['fecha_movimiento', 'DESC']]
        });

        logger.info(`Lista de movimientos de inventario consultada por ${req.usuario.nombre_usuario}`);
        res.json(movimientos);

    } catch (error) {
        logger.error('Error al obtener todos los movimientos de inventario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const obtenerMovimientoPorId = async (req, res) => {
    try {
        const { id_movimiento } = req.params;

        const movimiento = await MovimientosInventario.findByPk(id_movimiento, {
            include: [
                { model: Productos, as: 'producto' },
                { model: Usuarios, as: 'creador' }
            ]
        });

        if (!movimiento || !movimiento.activo) {
            return res.status(404).json({ mensaje: 'Movimiento de inventario no encontrado' });
        }

        logger.info(`Movimiento de inventario con ID ${id_movimiento} consultado por ${req.usuario.nombre_usuario}`);
        res.json(movimiento);

    } catch (error) {
        logger.error(`Error al obtener movimiento de inventario por ID ${req.params.id_movimiento}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};


module.exports = {
    crearMovimiento,
    obtenerTodosMovimientos,
    obtenerMovimientoPorId
};
