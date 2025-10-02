// carpeta: backend/utilidades/vacanteValidadores.js
const { body } = require('express-validator');

const validarCreacionVacante = [
    body('titulo')
        .isLength({ min: 2, max: 100 }).withMessage('El título debe tener entre 2 y 100 caracteres')
        .notEmpty().withMessage('El título es requerido'),
    body('descripcion')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('La descripción debe ser una cadena de texto'),
    body('fecha_publicacion')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601().toDate().withMessage('La fecha de publicación debe ser una fecha válida'),
    body('estado')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['Abierta', 'Cerrada', 'En Revisión', 'Cancelada']).withMessage('Estado no válido')
        .isLength({ max: 20 }).withMessage('El estado no puede exceder 20 caracteres'),
    body('id_puesto')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ gt: 0 }).withMessage('El ID del puesto debe ser un número entero positivo')
];

const validarActualizacionVacante = [
    body('titulo')
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage('El título debe tener entre 2 y 100 caracteres'),
    body('descripcion')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('La descripción debe ser una cadena de texto'),
    body('fecha_publicacion')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601().toDate().withMessage('La fecha de publicación debe ser una fecha válida'),
    body('estado')
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['Abierta', 'Cerrada', 'En Revisión', 'Cancelada']).withMessage('Estado no válido')
        .isLength({ max: 20 }).withMessage('El estado no puede exceder 20 caracteres'),
    body('id_puesto')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ gt: 0 }).withMessage('El ID del puesto debe ser un número entero positivo')
];

module.exports = {
    validarCreacionVacante,
    validarActualizacionVacante
};
