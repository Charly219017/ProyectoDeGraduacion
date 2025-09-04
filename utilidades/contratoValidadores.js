// carpeta: backend/utilidades/contratoValidadores.js
const { body } = require('express-validator');

const validarCreacionContrato = [
    body('id_empleado')
        .isInt({ gt: 0 }).withMessage('El ID del empleado debe ser un número entero positivo'),
    body('tipo_contrato')
        .isIn(['Indefinido', 'Temporal', 'Por Obra', 'Prácticas']).withMessage('Tipo de contrato no válido'),
    body('fecha_inicio')
        .isISO8601().toDate().withMessage('La fecha de inicio debe ser una fecha válida'),
    body('fecha_fin')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601().toDate().withMessage('La fecha de fin debe ser una fecha válida'),
    body('observaciones')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('Las observaciones deben ser una cadena de texto')
];

const validarActualizacionContrato = [
    body('id_empleado')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID del empleado debe ser un número entero positivo'),
    body('tipo_contrato')
        .optional()
        .isIn(['Indefinido', 'Temporal', 'Por Obra', 'Prácticas']).withMessage('Tipo de contrato no válido'),
    body('fecha_inicio')
        .optional()
        .isISO8601().toDate().withMessage('La fecha de inicio debe ser una fecha válida'),
    body('fecha_fin')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601().toDate().withMessage('La fecha de fin debe ser una fecha válida'),
    body('observaciones')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('Las observaciones deben ser una cadena de texto')
];

module.exports = {
    validarCreacionContrato,
    validarActualizacionContrato
};
