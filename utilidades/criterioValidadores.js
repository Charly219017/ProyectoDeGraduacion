// carpeta: backend/utilidades/criterioValidadores.js
const { body } = require('express-validator');

const validarCreacionCriterio = [
    body('nombre_criterio')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre del criterio debe tener entre 2 y 100 caracteres'),
    body('descripcion')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('La descripción debe ser una cadena de texto')
];

const validarActualizacionCriterio = [
    body('nombre_criterio')
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage('El nombre del criterio debe tener entre 2 y 100 caracteres'),
    body('descripcion')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('La descripción debe ser una cadena de texto')
];

module.exports = {
    validarCreacionCriterio,
    validarActualizacionCriterio
};
