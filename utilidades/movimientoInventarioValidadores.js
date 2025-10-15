// carpeta: backend/utilidades/movimientoInventarioValidadores.js
const { body } = require('express-validator');

const validarCreacionMovimiento = [
    body('id_producto')
        .notEmpty().withMessage('El ID del producto es requerido')
        .isInt({ gt: 0 }).withMessage('El ID del producto debe ser un número entero positivo'),
    body('tipo_movimiento')
        .trim()
        .isIn(['Entrada', 'Salida']).withMessage('El tipo de movimiento no es válido, debe ser Entrada o Salida'),
    body('cantidad')
        .notEmpty().withMessage('La cantidad es requerida')
        .isInt({ gt: 0 }).withMessage('La cantidad debe ser un número entero positivo'),
    body('observaciones')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('Las observaciones deben ser una cadena de texto'),
];

module.exports = {
    validarCreacionMovimiento
};
