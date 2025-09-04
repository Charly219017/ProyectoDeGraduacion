// carpeta: backend/utilidades/vacacionValidadores.js
const { body } = require('express-validator');

const validarCreacionVacacion = [
    body('id_empleado')
        .isInt({ gt: 0 }).withMessage('El ID del empleado debe ser un número entero positivo'),
    body('fecha_inicio')
        .isISO8601().toDate().withMessage('La fecha de inicio debe ser una fecha válida'),
    body('fecha_fin')
        .isISO8601().toDate().withMessage('La fecha de fin debe ser una fecha válida'),
    body('estado')
        .optional()
        .isIn(['Pendiente', 'Aprobada', 'Rechazada', 'Cancelada']).withMessage('Estado no válido')
];

const validarActualizacionVacacion = [
    body('id_empleado')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID del empleado debe ser un número entero positivo'),
    body('fecha_inicio')
        .optional()
        .isISO8601().toDate().withMessage('La fecha de inicio debe ser una fecha válida'),
    body('fecha_fin')
        .optional()
        .isISO8601().toDate().withMessage('La fecha de fin debe ser una fecha válida'),
    body('estado')
        .optional()
        .isIn(['Pendiente', 'Aprobada', 'Rechazada', 'Cancelada']).withMessage('Estado no válido')
];

module.exports = {
    validarCreacionVacacion,
    validarActualizacionVacacion
};
