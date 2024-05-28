import { NewPrinter } from "../interfaces/printerInterface";
import { getPrintersUtils } from "../services/serviceLocator/composer";
import { PrintersUtils } from "../utils/printerUtils";

//*Obtiene el numero de serie de la Impresora para su validación
function getPrinter(serial_number: string) {

}

//*Obtiene todos los Impresoras registrados
async function getPrinters() {
    const client = getPrintersUtils();
    return client.getPrinters();
}

//*Obtiene la Impresora por Id
function getPrinterById(id_printer: string) {
    const client = getPrintersUtils();
    return client.getPrinterById(id_printer);
}

//*Obtiene la Impresora por la clave de Unidad
function getPrinterByIdUnit(id_unit: string) {
    const client = getPrintersUtils();
    return client.getPrinterByIdUnit(id_unit);
}

//*Obtiene la Impresora por el nombre
function getPrinterByName(printer_type: string) {
    const client = getPrintersUtils();
    return client.getPrinterByName(printer_type);
}

//*Agregar nuevas Impresoras
function newPrinter(params: NewPrinter) {
    const client = getPrintersUtils();
    return client.newPrinter(params);
}

//*Actualiza todo los datos de la Impresora
function updateFullPrinter(params: NewPrinter, id_printer: string) {
    const client = getPrintersUtils();
    return client.updateFullPrinter(params, id_printer);
}

//*Actualizar algun dato en especifico de la Impresora
function updatePartialPrinter(params: Partial<NewPrinter>, id_printer: string) {
    const client = getPrintersUtils();
    return client.updatePartialPrinter(params, id_printer);
}

//*Eliminar la Impresora por id
function deletePrinter(id_printer: string) {
    const client = getPrintersUtils();
    return client.deletePrinter(id_printer);

}

//*Convierte los datos de la Impresora a QR
async function createPrinterQR(id_unit: string) {
    const client = getPrintersUtils();
    const printer = await client.getPrinterById(id_unit);

    if (!printer || typeof printer === 'boolean') {
        throw new Error('Impresora no encontrado');
    }

    const formattedData = `
    INFORMACIÓN
    Identificación de la Impresora: ${printer.id_printer}
    Identificación de la unidad: ${printer.id_unit}
    Marca: ${printer.brand}
    Modelo: ${printer.model}
    Número de serie: ${printer.serial_number}
    Tipo de impresora: ${printer.printer_type}
    Formato de impresión: ${printer.print_format}
    Tipo de consumible: ${printer.consumable_type}
    Estado de la impresora: ${printer.printer_status}
    Tipo de entrada: ${printer.entry_type}
    Ubicación: ${printer.location}
    Comentarios: ${printer.comments}
    `;
    return client.createPrinterQR(formattedData.trim());
}

export default {
    getPrinter,
    getPrinters,
    getPrinterById,
    getPrinterByIdUnit,
    getPrinterByName,
    newPrinter,
    updateFullPrinter,
    updatePartialPrinter,
    deletePrinter,
    createPrinterQR
}