// carpeta: controladores/nominaControlador.js
const { validationResult } = require('express-validator');
const { Nomina, Empleados, Usuarios } = require('../modelos');
const logger = require('../utilidades/logger');
const { calcularNomina } = require('../utilidades/calculoNomina');

/**
 * Controlador para crear un nuevo registro de nómina calculado.
 */
const crearNomina = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }

        // 1. Recibir los datos de entrada
        const { id_empleado, mes, anio, ...datosEntrada } = req.body;

        // 2. Realizar el cálculo de la nómina
        const nominaCalculada = calcularNomina(datosEntrada);

        // 3. Combinar datos de entrada y calculados para guardar en la BD
        const datosParaGuardar = {
            id_empleado,
            mes,
            anio,
            ...nominaCalculada,
            creado_por: req.usuario.id
        };

        const nuevaNomina = await Nomina.create(datosParaGuardar, { usuario: req.usuario });

        logger.info(`Nómina creada exitosamente con ID: ${nuevaNomina.id_nomina} por ${req.usuario.nombre_usuario}`);
        res.status(201).json({
            mensaje: 'Registro de nómina creado y calculado exitosamente',
            nomina: nuevaNomina
        });

    } catch (error) {
        logger.error('Error al crear registro de nómina:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener todos los registros de nómina.
 */
const obtenerTodasNominas = async (req, res) => {
    try {
        const nominas = await Nomina.findAll({
            where: { activo: true },
            include: [
                { model: Empleados, as: 'empleado' },
                { model: Usuarios, as: 'creador' },
                { model: Usuarios, as: 'actualizador' }
            ],
            order: [['anio', 'DESC'], ['mes', 'DESC']]
        });

        logger.info(`Lista de nóminas consultada por ${req.usuario.nombre_usuario}`);
        res.json(nominas);

    } catch (error) {
        logger.error('Error al obtener todos los registros de nómina:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para obtener un registro de nómina por su ID.
 */
const obtenerNominaPorId = async (req, res) => {
    try {
        const { id_nomina } = req.params;

        const nomina = await Nomina.findByPk(id_nomina, {
            include: [
                { model: Empleados, as: 'empleado' },
                { model: Usuarios, as: 'creador' },
                { model: Usuarios, as: 'actualizador' }
            ]
        });

        if (!nomina || !nomina.activo) {
            return res.status(404).json({ mensaje: 'Registro de nómina no encontrado' });
        }

        logger.info(`Nómina con ID ${id_nomina} consultada por ${req.usuario.nombre_usuario}`);
        res.json(nomina);

    } catch (error) {
        logger.error(`Error al obtener registro de nómina por ID ${req.params.id_nomina}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para actualizar y recalcular un registro de nómina.
 */
const actualizarNomina = async (req, res) => {
    try {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                mensaje: 'Datos de entrada inválidos',
                errores: errores.array()
            });
        }
        
        const { id_nomina } = req.params;
        const nominaAActualizar = await Nomina.findOne({
            where: { id_nomina, activo: true }
        });

        if (!nominaAActualizar) {
            return res.status(404).json({ mensaje: 'Registro de nómina no encontrado' });
        }

        // 1. Fusionar datos existentes con los nuevos datos del body
        const datosParaCalculo = {
            salario_base: req.body.salario_base || nominaAActualizar.salario_base,
            horas_extras: req.body.horas_extras || nominaAActualizar.horas_extras,
            comisiones: req.body.comisiones || nominaAActualizar.comisiones,
            isr: req.body.isr || nominaAActualizar.isr,
            otros_descuentos: req.body.otros_descuentos || nominaAActualizar.otros_descuentos
        };

        // 2. Recalcular la nómina
        const nominaCalculada = calcularNomina(datosParaCalculo);

        // 3. Preparar datos para la actualización
        const datosParaGuardar = {
            ...req.body, // Permite actualizar mes, anio, id_empleado si se envían
            ...nominaCalculada,
            actualizado_por: req.usuario.id,
            fecha_actualizacion: new Date()
        };

        await nominaAActualizar.update(datosParaGuardar, { usuario: req.usuario });

        logger.info(`Nómina con ID ${id_nomina} actualizada por ${req.usuario.nombre_usuario}`);
        res.json({
            mensaje: 'Registro de nómina actualizado y recalculado exitosamente',
            nomina: nominaAActualizar
        });

    } catch (error) {
        logger.error(`Error al actualizar registro de nómina por ID ${req.params.id_nomina}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/**
 * Controlador para eliminar lógicamente un registro de nómina por su ID.
 */
const eliminarNomina = async (req, res) => {
    try {
        const { id_nomina } = req.params;
        const nominaAEliminar = await Nomina.findOne({
            where: { id_nomina, activo: true }
        });

        if (!nominaAEliminar) {
            return res.status(404).json({ mensaje: 'Registro de nómina no encontrado' });
        }

        await nominaAEliminar.update({ 
            activo: false,
            actualizado_por: req.usuario.id,
            fecha_actualizacion: new Date()
        }, { usuario: req.usuario });

        logger.info(`Nómina con ID ${id_nomina} eliminada lógicamente por ${req.usuario.nombre_usuario}`);
        res.json({ mensaje: 'Registro de nómina eliminado exitosamente' });

    } catch (error) {
        logger.error(`Error al eliminar registro de nómina por ID ${req.params.id_nomina}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

const { generarPdfNomina, dibujarReciboEnPagina } = require('../utilidades/generadorPdfNomina');
const { Puestos } = require('../modelos');

/**
 * Controlador para generar y enviar un recibo de nómina en PDF.
 */
const imprimirNominaPorId = async (req, res) => {
    try {
        const { id_nomina } = req.params;

        // Medida de seguridad: Verificar que el usuario sea Administrador
        if (req.usuario.roles !== 'Administrador') {
            logger.warn(`Intento de acceso no autorizado a la nómina ID ${id_nomina} por el usuario ${req.usuario.nombre_usuario}. Se requiere rol de Administrador.`);
            return res.status(403).json({ mensaje: 'Acceso prohibido. Permiso denegado.' });
        }

        const nomina = await Nomina.findByPk(id_nomina, {
            include: [
                {
                    model: Empleados,
                    as: 'empleado',
                    include: [{ model: Puestos, as: 'puesto' }]
                },
                { model: Usuarios, as: 'creador' },
                { model: Usuarios, as: 'actualizador' }
            ]
        });

        if (!nomina || !nomina.activo) {
            return res.status(404).json({ mensaje: 'Registro de nómina no encontrado' });
        }

        logger.info(`Generando PDF para nómina con ID ${id_nomina} por ${req.usuario.nombre_usuario}`);
        
        // La función generadora se encarga de la respuesta HTTP
        generarPdfNomina(nomina, res);

    } catch (error) {
        logger.error(`Error al generar PDF de nómina por ID ${req.params.id_nomina}:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor al generar el PDF' });
    }
};

/**
 * Controlador para generar y enviar un PDF con múltiples recibos de nómina por lote.
 */
const imprimirNominasPorLote = async (req, res) => {
    try {
        const { mes, anio } = req.query;

        if (!mes || !anio) {
            return res.status(400).json({ mensaje: 'Los parámetros "mes" y "anio" son obligatorios.' });
        }

        const nominas = await Nomina.findAll({
            where: { mes, anio, activo: true },
            include: [
                {
                    model: Empleados,
                    as: 'empleado',
                    include: [{ model: Puestos, as: 'puesto' }]
                }
            ],
            order: [['id_empleado', 'ASC']]
        });

        if (nominas.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron registros de nómina para el período especificado.' });
        }

        logger.info(`Generando PDF por lote para ${mes}/${anio} por ${req.usuario.nombre_usuario}`);

        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument({ margin: 50, autoFirstPage: false });

        const nombreArchivo = `Recibos_Lote_${mes}_${anio}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
        doc.pipe(res);

        nominas.forEach((nomina) => {
            doc.addPage();
            
            // --- INICIO DEL DISEÑO DEL RECIBO (Copiado y adaptado para el lote) ---
            doc.fontSize(20).font('Helvetica-Bold').text('Recibo de Pago de Nómina', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).font('Helvetica').text(`Fecha de Emisión: ${new Date(nomina.fecha_generacion).toLocaleDateString('es-GT')}`, { align: 'right' });
            doc.text(`Período: ${String(nomina.mes).padStart(2, '0')}/${nomina.anio}`, { align: 'right' });
            doc.moveDown(1);

            doc.fontSize(14).font('Helvetica-Bold').text('Información del Empleado');
            doc.rect(doc.x, doc.y, 510, 80).stroke();
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
            doc.moveDown(3);

            const tableTop = doc.y + 10;
            const itemX = 60;
            const amountX = 450;
            const drawLine = (y) => doc.moveTo(50, y).lineTo(560, y).stroke();
            const addRow = (item, amount) => {
                const y = doc.y;
                doc.text(item, itemX, y);
                doc.text(parseFloat(amount).toFixed(2), amountX, y, { width: 100, align: 'right' });
                doc.moveDown();
            };

            doc.fontSize(14).font('Helvetica-Bold').text('Ingresos', itemX, tableTop);
            doc.text('Monto (Q)', amountX, tableTop, { width: 100, align: 'right' });
            doc.moveDown();
            drawLine(doc.y);
            doc.moveDown(0.5);
            doc.fontSize(12).font('Helvetica');
            addRow('Salario Base', nomina.salario_base);
            addRow('Bonificación Decreto 37-2001', nomina.bonificacion_decreto);
            if (parseFloat(nomina.pago_horas_extras) > 0) addRow('Pago Horas Extras', nomina.pago_horas_extras);
            if (parseFloat(nomina.comisiones) > 0) addRow('Comisiones', nomina.comisiones);
            doc.moveDown();
            doc.font('Helvetica-Bold');
            addRow('Total Ingresos', nomina.total_ingresos);
            doc.moveDown(2);

            doc.fontSize(14).font('Helvetica-Bold').text('Deducciones', itemX, doc.y);
            doc.moveDown();
            drawLine(doc.y);
            doc.moveDown(0.5);
            doc.fontSize(12).font('Helvetica');
            addRow('Cuota IGSS', nomina.deduccion_igss);
            if (parseFloat(nomina.isr) > 0) addRow('Retención ISR', nomina.isr);
            if (parseFloat(nomina.otros_descuentos) > 0) addRow('Otros Descuentos', nomina.otros_descuentos);
            doc.font('Helvetica-Bold');
            addRow('Total Deducciones', nomina.total_descuentos);
            doc.moveDown(1);

            drawLine(doc.y);
            doc.moveDown();
            doc.fontSize(16).font('Helvetica-Bold');
            doc.text('Sueldo Líquido a Recibir:', itemX, doc.y);
            doc.text(`Q ${parseFloat(nomina.sueldo_liquido).toFixed(2)}`, amountX - 50, doc.y, { width: 150, align: 'right' });
            doc.moveDown(2);

            doc.fontSize(10).font('Helvetica-Oblique');
            doc.text('___________________________', 50, doc.y, { align: 'center' });
            doc.text('Firma del Empleado', 50, doc.y, { align: 'center' });
            doc.moveDown(1);
            doc.text('He recibido a mi entera satisfacción el monto líquido especificado en este recibo.', 50, doc.y, { align: 'center' });
            // --- FIN DEL DISEÑO ---
        });

        doc.end();
    } catch (error) {
        logger.error(`Error al generar PDF de nómina por lote:`, error);
        res.status(500).json({ mensaje: 'Error interno del servidor al generar el PDF por lote.' });
    }
};


module.exports = {
    crearNomina,
    obtenerTodasNominas,
    obtenerNominaPorId,
    actualizarNomina,
    eliminarNomina,
    imprimirNominaPorId,
    imprimirNominasPorLote
};