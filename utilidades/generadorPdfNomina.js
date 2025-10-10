// utilidades/generadorPdfNomina.js
const PDFDocument = require('pdfkit');

function dibujarReciboEnPagina(doc, nomina) {
  // --- INICIO DEL DISEÑO DEL RECIBO ---

  // 1. Encabezado
  doc.fontSize(20).font('Helvetica-Bold').text('Recibo de Pago de Nómina', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).font('Helvetica').text(`Fecha de Emisión: ${new Date(nomina.fecha_generacion).toLocaleDateString('es-GT')}`, { align: 'right' });
  doc.text(`Período: ${String(nomina.mes).padStart(2, '0')}/${nomina.anio}`, { align: 'right' });
  doc.moveDown(1);

  // 2. Información del Empleado
  doc.fontSize(14).font('Helvetica-Bold').text('Información del Empleado');
  doc.rect(doc.x, doc.y, 510, 80).stroke(); // Dibuja un recuadro alrededor de la info
  doc.moveDown(0.5);
  doc.fontSize(12).font('Helvetica');
  
  const xInfo = doc.x + 15;
  const yInfoStart = doc.y;

  doc.text(`Nombre:`, xInfo, yInfoStart);
  doc.font('Helvetica-Bold').text(`${nomina.empleado.nombre_completo}`, 150, yInfoStart);
  
  doc.font('Helvetica').text(`DPI:`, xInfo, yInfoStart + 20);
  doc.text(`${nomina.empleado.dpi || 'N/A'}`, 150, yInfoStart + 20);

  doc.text(`Puesto:`, xInfo, yInfoStart + 40);
  doc.text(`${nomina.empleado.puesto ? nomina.empleado.puesto.nombre_puesto : 'N/A'}`, 150, yInfoStart + 40);
  
  doc.moveDown(3); // Reducido el espacio excesivo para compactar la parte superior

  // 3. Detalle de Ingresos y Deducciones (Formato de tabla)
  const tableTop = doc.y + 10;
  const itemX = 60;
  const amountX = 450;

  doc.fontSize(14).font('Helvetica-Bold');
  doc.text('Ingresos', itemX, tableTop);
  doc.text('Monto (Q)', amountX, tableTop, { width: 100, align: 'right' });
  
  doc.moveDown();
  const drawLine = (y) => doc.moveTo(50, y).lineTo(560, y).stroke();
  drawLine(doc.y);
  doc.moveDown(0.5);
  
  doc.fontSize(12).font('Helvetica');

  const addRow = (item, amount) => {
    const y = doc.y;
    doc.text(item, itemX, y);
    doc.text(parseFloat(amount).toFixed(2), amountX, y, { width: 100, align: 'right' });
    doc.moveDown();
  };

  addRow('Salario Base', nomina.salario_base);
  addRow('Bonificación Decreto 37-2001', nomina.bonificacion_decreto);
  if (parseFloat(nomina.pago_horas_extras) > 0) addRow('Pago Horas Extras', nomina.pago_horas_extras);
  if (parseFloat(nomina.comisiones) > 0) addRow('Comisiones', nomina.comisiones);
  
  doc.moveDown();
  doc.font('Helvetica-Bold');
  addRow('Total Ingresos', nomina.total_ingresos);
  doc.moveDown(2);

  // Deducciones
  doc.fontSize(14).font('Helvetica-Bold');
  doc.text('Deducciones', itemX, doc.y);
  doc.moveDown();
  drawLine(doc.y);
  doc.moveDown(0.5);
  doc.fontSize(12).font('Helvetica');
  addRow('Cuota IGSS', nomina.deduccion_igss);
  if (parseFloat(nomina.isr) > 0) addRow('Retención ISR', nomina.isr);
  if (parseFloat(nomina.otros_descuentos) > 0) addRow('Otros Descuentos', nomina.otros_descuentos);

  doc.font('Helvetica-Bold');
  addRow('Total Deducciones', nomina.total_descuentos);
  doc.moveDown(1); // Reducido el salto de línea para un diseño más compacto

  // 4. Totales
  drawLine(doc.y);
  doc.moveDown();
  doc.fontSize(16).font('Helvetica-Bold');
  doc.text('Sueldo Líquido a Recibir:', itemX, doc.y);
  doc.text(`Q ${parseFloat(nomina.sueldo_liquido).toFixed(2)}`, amountX - 50, doc.y, { width: 150, align: 'right' });
  doc.moveDown(2); // Compactado el espacio después del total

  // 5. Pie de Página y Firma
  // El contenido fluye naturalmente para evitar saltos de página.
  doc.fontSize(10).font('Helvetica-Oblique');
  doc.text('___________________________', 50, doc.y, { align: 'center' });
  doc.text('Firma del Empleado', 50, doc.y, { align: 'center' });
  doc.moveDown(1); // Espacio mínimo antes del texto final
  doc.text('He recibido a mi entera satisfacción el monto líquido especificado en este recibo.', 50, doc.y, { align: 'center' });
}


function generarPdfNomina(nomina, res) {
  const doc = new PDFDocument({ margin: 50 });

  const nombreArchivo = `Recibo_Nomina_${nomina.empleado.nombre_completo.replace(/ /g, '_')}_${nomina.mes}_${nomina.anio}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);

  doc.pipe(res);

  dibujarReciboEnPagina(doc, nomina);

  doc.end();
}

module.exports = {
  generarPdfNomina,
  dibujarReciboEnPagina
};
