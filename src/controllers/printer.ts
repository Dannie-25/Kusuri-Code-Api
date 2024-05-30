import { PrinterData, NewPrinter } from "../interfaces/printerInterface";
import { getPrintersUtils } from "../services/serviceLocator/composer";
import { PrintersUtils } from "../utils/printerUtils";

//*Obtiene el numero de serie de la Impresora para su validación
async function getPrinter(serial_number: string): Promise<PrinterData | null> {
    const client = getPrintersUtils();
    try {
        return await client.getPrinters();
    } catch (error) {
        console.error(`Error al Obtener la Impresora con Número de Serie ${serial_number}:`, error);
        return null;
    }
}

//*Obtiene todas los Impresoras registrados
async function getPrinters() {
    const client = getPrintersUtils();
    try {
        return await client.getPrinters();
    }
    catch (error) {
        console.error('Error al Obtener la Impresora:', error)
        return [];
    }
}

//*Obtiene la Impresora por Id
async function getPrinterById(id_printer: string): Promise<PrinterData | boolean> {
    const client = getPrintersUtils();
    try {
        return await client.getPrinterById(id_printer);
    } catch (error) {
        console.error('Error al Obtener el ID del Equipo:', error);
        return false;
    }
}

//*Obtiene la Impresora por la Id Unit
async function getPrinterByIdUnit(id_unit: string): Promise<PrinterData[] | boolean> {
    const client = getPrintersUtils();
    try {
        return await client.getPrinterByIdUnit(id_unit);
    } catch (error) {
        console.error(`Error al Obtener las Impresoras por el ID ${id_unit}:`, error);
    }
}


//*Obtiene la Impresora por el nombre
async function getPrinterByName(printer_type: string): Promise<PrinterData | boolean> {
    const client = getPrintersUtils();
    try {
        return await client.getPrinterByName(printer_type);
    } catch (error) {
        console.error(`Error al Obtener ${printer_type}:`, error);
        return false;
    }
}

//*Agregar nuevas Impresoras
async function newPrinter(params: NewPrinter): Promise<boolean> {
    const client = getPrintersUtils();
    try {
        return await client.newPrinter(params);
    } catch (error) {
        console.error('Error al Agregar una Nueva Impresora:', error);
        return false;
    }
}

//*Actualiza todo los datos de la Impresora
async function updateFullPrinter(params: NewPrinter, id_printer: string): Promise<boolean> {
    const client = getPrintersUtils();
    try {
        return await client.updateFullPrinter(params, id_printer);
    } catch (error) {
        console.error(`Error al Actualizar los Datos de la Impresora con ID ${id_printer}:`, error);
        return false;
    }
}

//*Actualizar algun dato en especifico de la Impresora
async function updatePartialPrinter(params: Partial<NewPrinter>, id_printer: string): Promise<boolean> {
    const client = getPrintersUtils();
    try {
        return await client.updatePartialPrinter(params, id_printer);
    } catch (error) {
        console.error(`Error al Actualizar el Dato de la Impresora con ID ${id_printer}:`, error);
        return false;
    }
}

//*Eliminar la Impresora por id
async function deletePrinter(id_printer: string): Promise<boolean> {
    const client = getPrintersUtils();
    try {
        return await client.deletePrinter(id_printer);
    } catch (error) {
        console.error('Error al Eliminar la Impresora:', error);
        return false;
    }
}

//*Convierte los datos de la Impresora a QR
async function createPrinterQR(id_unit: string) {
    const client = getPrintersUtils();
    try {
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
    } catch (error) {
        console.error(`Error al Generar el QR de la Impresora con ID ${id_unit}:`, error);
        throw error;
    }
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