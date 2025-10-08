// utilidades/calculoNomina.js

const BONIFICACION_DECRETO = 250.00;
const TASA_IGSS = 0.0483;
const FACTOR_HORA_EXTRA = 1.5;

/**
 * Calcula los montos de la nómina según la ley de Guatemala.
 * @param {object} data - Objeto con los datos de entrada para el cálculo.
 * @param {number} data.salario_base - El salario ordinario del empleado.
 * @param {number} [data.horas_extras=0] - La cantidad de horas extra trabajadas.
 * @param {number} [data.comisiones=0] - El monto de comisiones del mes.
 * @param {number} [data.isr=0] - El monto de ISR a deducir (ingresado manualmente).
 * @param {number} [data.otros_descuentos=0] - Monto de otros descuentos (préstamos, etc.).
 * @returns {object} Un objeto con todos los campos de la nómina calculados.
 */
const calcularNomina = ({
    salario_base,
    horas_extras = 0,
    comisiones = 0,
    isr = 0,
    otros_descuentos = 0
}) => {
    // 1. Calcular pago de horas extras
    const valor_hora_ordinaria = (salario_base / 30) / 8;
    const pago_horas_extras = valor_hora_ordinaria * FACTOR_HORA_EXTRA * horas_extras;

    // 2. Calcular total de ingresos (sueldo bruto)
    const total_ingresos = salario_base + pago_horas_extras + comisiones + BONIFICACION_DECRETO;

    // 3. Calcular deducciones
    // La bonificación de decreto (250) no está sujeta a IGSS.
    const base_calculo_igss = salario_base + pago_horas_extras + comisiones;
    const deduccion_igss = base_calculo_igss * TASA_IGSS;
    const total_descuentos = deduccion_igss + isr + otros_descuentos;

    // 4. Calcular sueldo líquido
    const sueldo_liquido = total_ingresos - total_descuentos;

    // Se retorna el objeto completo para ser guardado en la base de datos.
    return {
        salario_base,
        horas_extras,
        comisiones,
        isr,
        otros_descuentos,
        bonificacion_decreto: BONIFICACION_DECRETO,
        pago_horas_extras: parseFloat(pago_horas_extras.toFixed(2)),
        total_ingresos: parseFloat(total_ingresos.toFixed(2)),
        deduccion_igss: parseFloat(deduccion_igss.toFixed(2)),
        total_descuentos: parseFloat(total_descuentos.toFixed(2)),
        sueldo_liquido: parseFloat(sueldo_liquido.toFixed(2))
    };
};

module.exports = {
    calcularNomina
};
