// carpeta: backend/utilidades/productoValidadores.js
const { body } = require('express-validator');

const validarCreacionProducto = [
    body('nombre_producto')
        .trim()
        .isLength({ min: 2, max: 150 }).withMessage('El nombre del producto debe tener entre 2 y 150 caracteres')
        .notEmpty().withMessage('El nombre del producto es requerido'),
    body('descripcion')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('La descripción debe ser una cadena de texto'),
    body('id_categoria')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ gt: 0 }).withMessage('El ID de la categoría debe ser un número entero positivo'),
    body('precio_unitario')
        .optional({ nullable: true, checkFalsy: true })
        .isFloat({ min: 0 }).withMessage('El precio unitario debe ser un número positivo'),
    body('stock_actual')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 0 }).withMessage('El stock actual debe ser un número entero no negativo'),
    body('stock_minimo')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 0 }).withMessage('El stock mínimo debe ser un número entero no negativo'),
];

const validarActualizacionProducto = [
    body('nombre_producto')
        .trim()
        .optional()
        .isLength({ min: 2, max: 150 }).withMessage('El nombre del producto debe tener entre 2 y 150 caracteres'),
    body('descripcion')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('La descripción debe ser una cadena de texto'),
    body('id_categoria')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ gt: 0 }).withMessage('El ID de la categoría debe ser un número entero positivo'),
    body('precio_unitario')
        .optional({ nullable: true, checkFalsy: true })
        .isFloat({ min: 0 }).withMessage('El precio unitario debe ser un número positivo'),
    body('stock_minimo')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ min: 0 }).withMessage('El stock mínimo debe ser un número entero no negativo'),
];

module.exports = {
    validarCreacionProducto,
    validarActualizacionProducto
};