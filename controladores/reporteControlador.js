const { Empleado, Puesto } = require('../modelos');
const { Op } = require('sequelize');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

// @desc    Obtener estadísticas de empleados
// @ruta    GET /api/reportes/estadisticas-empleados
// @acceso  Privado
exports.obtenerEstadisticasEmpleados = async (req, res) => {
  try {
    const totalEmpleados = await Empleado.count();
    const empleadosPorPuesto = await Empleado.findAll({
        attributes: [
          [Empleado.sequelize.fn('COUNT', Empleado.sequelize.col('id_empleado')), 'cantidad']
        ],
        include: [{
          model: Puesto,
          attributes: ['nombre_puesto']
        }],
        group: ['Puesto.id_puesto', 'Puesto.nombre_puesto']
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
    const empleados = await Empleado.findAll({
      include: [
        { model: Puesto, attributes: ['nombre_puesto'] }
      ],
      raw: true,
      nest: true
    });

    const filePath = path.join(__dirname, '..', 'logs', 'empleados.csv');
    
    const writer = csvWriter({
      path: filePath,
      header: [
        { id: 'id_empleado', title: 'ID' },
        { id: 'nombre', title: 'Nombre' },
        { id: 'apellido', title: 'Apellido' },
        { id: 'cedula', title: 'Cédula' },
        { id: 'telefono', title: 'Teléfono' },
        { id: 'correo_electronico', title: 'Email' },
        { id: 'direccion', title: 'Dirección' },
        { id: 'fecha_nacimiento', title: 'Fecha de Nacimiento' },
        { id: 'Puesto.nombre_puesto', title: 'Puesto' }
      ]
    });

    const records = empleados.map(emp => ({
      ...emp,
      'Puesto.nombre_puesto': emp.Puesto.nombre_puesto
    }));

    await writer.writeRecords(records);
    
    res.download(filePath, 'reporte_empleados.csv', (err) => {
      if (err) {
        console.error(`Error al descargar el archivo: ${err.message}`);
      }
      // Opcional: eliminar el archivo después de la descarga
      // fs.unlinkSync(filePath);
    });

  } catch (error) {
    console.error(`Error al exportar empleados a CSV: ${error.message}`);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
};
