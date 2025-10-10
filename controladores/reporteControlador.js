
const { Empleados, Puestos, Aplicaciones, Evaluaciones, Nomina } = require('../modelos');
const { Op } = require('sequelize');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

// @desc    Obtener estadísticas de empleados
// @ruta    GET /api/reportes/estadisticas-empleados
// @acceso  Privado
exports.obtenerEstadisticasEmpleados = async (req, res) => {
  try {
    const totalEmpleados = await Empleados.count({ where: { activo: true } });
    const empleadosPorPuesto = await Empleados.findAll({
        where: { activo: true },
        attributes: [
          [Empleados.sequelize.fn('COUNT', Empleados.sequelize.col('id_empleado')), 'cantidad']
        ],
        include: [{
          model: Puestos,
          as: 'puesto',
          attributes: ['nombre_puesto']
        }],
        group: ['puesto.id_puesto', 'puesto.nombre_puesto']
      });

    res.status(200).json({
      success: true,
      data: {
        totalEmpleados,
        empleadosPorPuesto
      }
    });
  } catch (error) {
    console.error(`Error al obtener estadísticas de empleados: ${error.message}`);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

// @desc    Exportar datos de empleados a CSV
// @ruta    GET /api/reportes/exportar-empleados
// @acceso  Privado
exports.exportarEmpleadosCSV = async (req, res) => {
  try {
    const empleados = await Empleados.findAll({
      include: [
        { model: Puestos, as: 'puesto', attributes: ['nombre_puesto'] }
      ],
      raw: true,
      nest: true
    });

    const filePath = path.join(__dirname, '..', 'logs', 'empleados.csv');
    
    const writer = csvWriter({
      path: filePath,
      header: [
        { id: 'id_empleado', title: 'ID' },
        { id: 'nombre_completo', title: 'Nombre Completo' },
        { id: 'dpi', title: 'DPI' },
        { id: 'telefono', title: 'Teléfono' },
        { id: 'correo_personal', title: 'Email' },
        { id: 'direccion', title: 'Dirección' },
        { id: 'fecha_nacimiento', title: 'Fecha de Nacimiento' },
        { id: 'puesto.nombre_puesto', title: 'Puesto' }
      ]
    });

    await writer.writeRecords(empleados);
    
    res.download(filePath, 'reporte_empleados.csv', (err) => {
      if (err) {
        console.error(`Error al descargar el archivo: ${err.message}`);
      }
    });

  } catch (error) {
    console.error(`Error al exportar empleados a CSV: ${error.message}`);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

// @desc    Obtener estado de los candidatos
// @ruta    GET /api/reportes/estado-candidatos
// @acceso  Privado
exports.obtenerEstadoCandidatos = async (req, res) => {
  try {
    const estadoCandidatos = await Aplicaciones.findAll({
      attributes: [
        'estado_aplicacion',
        [Aplicaciones.sequelize.fn('COUNT', Aplicaciones.sequelize.col('id_aplicacion')), 'cantidad']
      ],
      group: ['estado_aplicacion']
    });

    res.status(200).json({
      success: true,
      data: estadoCandidatos
    });
  } catch (error) {
    console.error(`Error al obtener estado de candidatos: ${error.message}`);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

// @desc    Obtener promedio de desempeño anual
// @ruta    GET /api/reportes/promedio-desempeno
// @acceso  Privado
exports.obtenerPromedioDesempeno = async (req, res) => {
  try {
    const promedioDesempeno = await Evaluaciones.findAll({
      attributes: [
        [Evaluaciones.sequelize.fn('AVG', Evaluaciones.sequelize.col('puntuacion_total')), 'promedio_puntuacion']
      ],
      include: [{
        model: Empleados,
        as: 'empleado',
        attributes: [],
        include: [{
          model: Puestos,
          as: 'puesto',
          attributes: ['nombre_puesto']
        }]
      }],
      group: ['empleado.puesto.nombre_puesto']
    });

    res.status(200).json({
      success: true,
      data: promedioDesempeno
    });
  } catch (error) {
    console.error(`Error al obtener promedio de desempeño: ${error.message}`);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};

// @desc    Obtener total de sueldos por mes
// @ruta    GET /api/reportes/total-sueldos-mes
// @acceso  Privado
exports.obtenerTotalSueldosPorMes = async (req, res) => {
  try {
    const totalSueldos = await Nomina.findAll({
      attributes: [
        'anio',
        'mes',
        [Nomina.sequelize.fn('SUM', Nomina.sequelize.col('sueldo_liquido')), 'total_sueldos']
      ],
      group: ['anio', 'mes'],
      order: [['anio', 'DESC'], ['mes', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: totalSueldos
    });
  } catch (error) {
    console.error(`Error al obtener total de sueldos por mes: ${error.message}`);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};
