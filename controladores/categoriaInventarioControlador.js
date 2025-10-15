// carpeta: controladores/categoriaInventarioControlador.js
const { validationResult } = require('express-validator');
const { CategoriasInventario, Usuarios } = require('../modelos');
const logger = require('../utilidades/logger');

const crearCategoria = async (req, res) => {
    logger.info('Usuario en crearCategoria:', req.usuario);
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

        const nuevaCategoria = await CategoriasInventario.create({
            ...req.body,
            creado_por: req.usuario.id
        });

        logger.info(`Categoría creada exitosamente: ${nuevaCategoria.nombre_categoria} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Categoría creada exitosamente',
            categoria: nuevaCategoria
        });

    } catch (error) {
        logger.error('Error al crear categoría:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const obtenerTodasCategorias = async (req, res) => {
    try {
        const categorias = await CategoriasInventario.findAll({
            where: {
                activo: true
            },
            include: [
                { model: Usuarios, as: 'creador' }
            ]
        });

        logger.info(`Lista de categorías consultada por ${req.usuario.nombre_usuario}`);
        res.json(categorias);

    } catch (error) {
        logger.error('Error al obtener todas las categorías:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const obtenerCategoriaPorId = async (req, res) => {
    try {
        const { id_categoria } = req.params;

        const categoria = await CategoriasInventario.findByPk(id_categoria, {
            include: [
                { model: Usuarios, as: 'creador' }
            ]
        });

        if (!categoria || !categoria.activo) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        logger.info(`Categoría con ID ${id_categoria} consultada por ${req.usuario.nombre_usuario}`);
        res.json(categoria);

    } catch (error) {
        logger.error(`Error al obtener categoría por ID ${req.params.id_categoria}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const actualizarCategoria = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_categoria } = req.params;
        const categoriaAActualizar = await CategoriasInventario.findByPk(id_categoria);

        if (!categoriaAActualizar || !categoriaAActualizar.activo) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        await categoriaAActualizar.update({
            ...req.body
        });

        logger.info(`Categoría con ID ${id_categoria} actualizada por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Categoría actualizada exitosamente',
            categoria: categoriaAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar categoría por ID ${req.params.id_categoria}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const eliminarCategoria = async (req, res) => {
    try {
        const { id_categoria } = req.params;
        const categoriaAEliminar = await CategoriasInventario.findByPk(id_categoria);

        if (!categoriaAEliminar || !categoriaAEliminar.activo) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }

        await categoriaAEliminar.update({ 
            activo: false
        });

        logger.info(`Categoría con ID ${id_categoria} eliminada por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Categoría eliminada exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar categoría por ID ${req.params.id_categoria}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = {
    crearCategoria,
    obtenerTodasCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    eliminarCategoria
};
