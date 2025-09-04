// carpeta: backend/utilidades/dependenciaValidadores.js
const { body } = require('express-validator');

const validarCreacionDependencia = [
    body('id_puesto_superior')
        .isInt({ gt: 0 }).withMessage('El ID del puesto superior debe ser un número entero positivo'),
    body('id_puesto_subordinado')
        .isInt({ gt: 0 }).withMessage('El ID del puesto subordinado debe ser un número entero positivo')
];

const validarActualizacionDependencia = [
    body('id_puesto_superior')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID del puesto superior debe ser un número entero positivo'),
    body('id_puesto_subordinado')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID del puesto subordinado debe ser un número entero positivo')
];

module.exports = {
    validarCreacionDependencia,
    validarActualizacionDependencia
};
