// carpeta: controladores/productoControlador.js
const { validationResult } = require('express-validator');
const { Productos, CategoriasInventario, Usuarios } = require('../modelos');
const logger = require('../utilidades/logger');

const crearProducto = async (req, res) => {
    logger.info('Usuario en crearProducto:', req.usuario);
    if (!req.usuario || !req.usuario.id) {
        logger.error('El ID del usuario para la auditoría está vacío en req.usuario.');
        return res.status(400).json({ mensaje: 'El ID del usuario para la auditoría no puede estar vacío.' });
    }
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        const nuevoProducto = await Productos.create({
            ...req.body,
            creado_por: req.usuario.id
        });

        logger.info(`Producto creado exitosamente: ${nuevoProducto.nombre_producto} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Producto creado exitosamente',
            producto: nuevoProducto
        });

    } catch (error) {
        logger.error('Error al crear producto:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const obtenerTodosProductos = async (req, res) => {
    try {
        const productos = await Productos.findAll({
            where: {
                activo: true
            },
            include: [
                { model: CategoriasInventario, as: 'categoria' },
                { model: Usuarios, as: 'creador' },
                { model: Usuarios, as: 'actualizador' }
            ]
        });

        logger.info(`Lista de productos consultada por ${req.usuario.nombre_usuario}`);
        res.json(productos);

    } catch (error) {
        logger.error('Error al obtener todos los productos:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const obtenerProductoPorId = async (req, res) => {
    try {
        const { id_producto } = req.params;

        const producto = await Productos.findByPk(id_producto, {
            include: [
                { model: CategoriasInventario, as: 'categoria' },
                { model: Usuarios, as: 'creador' },
                { model: Usuarios, as: 'actualizador' }
            ]
        });

        if (!producto || !producto.activo) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        logger.info(`Producto con ID ${id_producto} consultado por ${req.usuario.nombre_usuario}`);
        res.json(producto);

    } catch (error) {
        logger.error(`Error al obtener producto por ID ${req.params.id_producto}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const actualizarProducto = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_producto } = req.params;
        const productoAActualizar = await Productos.findByPk(id_producto);

        if (!productoAActualizar || !productoAActualizar.activo) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        await productoAActualizar.update({
            ...req.body,
            actualizado_por: req.usuario.id
        });

        logger.info(`Producto con ID ${id_producto} actualizado por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Producto actualizado exitosamente',
            producto: productoAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar producto por ID ${req.params.id_producto}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const eliminarProducto = async (req, res) => {
    try {
        const { id_producto } = req.params;
        const productoAEliminar = await Productos.findByPk(id_producto);

        if (!productoAEliminar || !productoAEliminar.activo) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        await productoAEliminar.update({ 
            activo: false,
            actualizado_por: req.usuario.id
        });

        logger.info(`Producto con ID ${id_producto} eliminado por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Producto eliminado exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar producto por ID ${req.params.id_producto}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    crearProducto,
    obtenerTodosProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
};
