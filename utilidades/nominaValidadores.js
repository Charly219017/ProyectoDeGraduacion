// carpeta: backend/utilidades/nominaValidadores.js
const { body } = require('express-validator');

const validarCreacionNomina = [
    body('id_empleado')
        .isInt({ gt: 0 }).withMessage('El ID del empleado debe ser un número entero positivo'),
    body('mes')
        .isInt({ min: 1, max: 12 }).withMessage('El mes debe ser un número entre 1 y 12'),
    body('anio')
        .isInt({ min: 2000 }).withMessage('El año debe ser 2000 o superior'),
    body('sueldo_bruto')
        .optional({ nullable: true, checkFalsy: true })
        .isDecimal().withMessage('El sueldo bruto debe ser un número decimal'),
    body('bonificaciones')
        .optional({ nullable: true, checkFalsy: true })
        .isDecimal().withMessage('Las bonificaciones deben ser un número decimal'),
    body('descuentos')
        .optional({ nullable: true, checkFalsy: true })
        .isDecimal().withMessage('Los descuentos deben ser un número decimal'),
    body('sueldo_neto')
        .optional({ nullable: true, checkFalsy: true })
        .isDecimal().withMessage('El sueldo neto debe ser un número decimal')
];

const validarActualizacionNomina = [
    body('id_empleado')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID del empleado debe ser un número entero positivo'),
    body('mes')
        .optional()
        .isInt({ min: 1, max: 12 }).withMessage('El mes debe ser un número entre 1 y 12'),
    body('anio')
        .optional()
        .isInt({ min: 2000 }).withMessage('El año debe ser 2000 o superior'),
    body('sueldo_bruto')
        .optional()
        .isDecimal().withMessage('El sueldo bruto debe ser un número decimal'),
    body('bonificaciones')
        .optional()
        .isDecimal().withMessage('Las bonificaciones deben ser un número decimal'),
    body('descuentos')
        .optional()
        .isDecimal().withMessage('Los descuentos deben ser un número decimal'),
    body('sueldo_neto')
        .optional()
        .isDecimal().withMessage('El sueldo neto debe ser un número decimal')
];

module.exports = {
    validarCreacionNomina,
    validarActualizacionNomina
};
