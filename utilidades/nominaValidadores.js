// carpeta: backend/utilidades/nominaValidadores.js
const { body } = require('express-validator');

// Reglas de validación para la creación de un registro de nómina
const validarCreacionNomina = [
    body('id_empleado')
        .notEmpty().withMessage('El ID del empleado es requerido.')
        .isInt({ gt: 0 }).withMessage('El ID del empleado debe ser un número entero positivo.'),
    body('mes')
        .notEmpty().withMessage('El mes es requerido.')
        .isInt({ min: 1, max: 12 }).withMessage('El mes debe ser un número entre 1 y 12.'),
    body('anio')
        .notEmpty().withMessage('El año es requerido.')
        .isInt({ min: 2000 }).withMessage('El año debe ser 2000 o superior.'),
    body('salario_base')
        .notEmpty().withMessage('El salario base es requerido.')
        .isDecimal({ decimal_digits: '1,2' }).withMessage('El salario base debe ser un número decimal con hasta 2 decimales.')
        .toFloat(),
    body('horas_extras')
        .optional()
        .isDecimal({ decimal_digits: '1,2' }).withMessage('Las horas extras deben ser un número decimal.')
        .toFloat(),
    body('comisiones')
        .optional()
        .isDecimal({ decimal_digits: '1,2' }).withMessage('Las comisiones deben ser un número decimal.')
        .toFloat(),
    body('isr')
        .optional()
        .isDecimal({ decimal_digits: '1,2' }).withMessage('El ISR debe ser un número decimal.')
        .toFloat(),
    body('otros_descuentos')
        .optional()
        .isDecimal({ decimal_digits: '1,2' }).withMessage('El campo "otros descuentos" debe ser un número decimal.')
        .toFloat()
];

// Reglas de validación para la actualización de un registro de nómina
const validarActualizacionNomina = [
    body('id_empleado')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID del empleado debe ser un número entero positivo.'),
    body('mes')
        .optional()
        .isInt({ min: 1, max: 12 }).withMessage('El mes debe ser un número entre 1 y 12.'),
    body('anio')
        .optional()
        .isInt({ min: 2000 }).withMessage('El año debe ser 2000 o superior.'),
    body('salario_base')
        .optional()
        .isDecimal({ decimal_digits: '1,2' }).withMessage('El salario base debe ser un número decimal.')
        .toFloat(),
    body('horas_extras')
        .optional()
        .isDecimal({ decimal_digits: '1,2' }).withMessage('Las horas extras deben ser un número decimal.')
        .toFloat(),
    body('comisiones')
        .optional()
        .isDecimal({ decimal_digits: '1,2' }).withMessage('Las comisiones deben ser un número decimal.')
        .toFloat(),
    body('isr')
        .optional()
        .isDecimal({ decimal_digits: '1,2' }).withMessage('El ISR debe ser un número decimal.')
        .toFloat(),
    body('otros_descuentos')
        .optional()
        .isDecimal({ decimal_digits: '1,2' }).withMessage('El campo "otros descuentos" debe ser un número decimal.')
        .toFloat()
];

module.exports = {
    validarCreacionNomina,
    validarActualizacionNomina
};