// carpeta: backend/utilidades/categoriaInventarioValidadores.js
const { body } = require('express-validator');

const validarCreacionCategoria = [
    body('nombre_categoria')
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('El nombre de la categoría debe tener entre 2 y 100 caracteres')
        .notEmpty().withMessage('El nombre de la categoría es requerido'),
    body('descripcion')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('La descripción debe ser una cadena de texto'),
];

const validarActualizacionCategoria = [
    body('nombre_categoria')
        .trim()
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage('El nombre de la categoría debe tener entre 2 y 100 caracteres'),
    body('descripcion')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('La descripción debe ser una cadena de texto'),
];

module.exports = {
    validarCreacionCategoria,
    validarActualizacionCategoria
};
