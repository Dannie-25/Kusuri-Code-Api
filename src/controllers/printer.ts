import { PrinterData, NewPrinter } from "../interfaces/printerInterface";
import { getPrintersUtils } from "../services/serviceLocator/composer";
import { PrintersUtils } from "../utils/printerUtils";

//*Obtiene el numero de serie de la Impresora para su validación
async function getPrinter(numero_serie: string): Promise<PrinterData | null> {
    const client = getPrintersUtils();
    try {
        return await client.getPrinters();
    } catch (error) {
        console.error(`Error al Obtener la Impresora con Número de Serie ${numero_serie}:`, error);
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
async function getPrinterById(id_impresora: string): Promise<PrinterData | boolean> {
    const client = getPrintersUtils();
    try {
        return await client.getPrinterById(id_impresora);
    } catch (error) {
        console.error('Error al Obtener el ID del Equipo:', error);
        return false;
    }
}

//*Obtiene la Impresora por la Id Unit
async function getPrinterByIdUnit(id_unidad: string): Promise<PrinterData[] | boolean> {
    const client = getPrintersUtils();
    try {
        return await client.getPrinterByIdUnit(id_unidad);
    } catch (error) {
        console.error(`Error al Obtener las Impresoras por el ID ${id_unidad}:`, error);
    }
}


//*Obtiene la Impresora por el nombre
async function getPrinterByName(marca: string): Promise<PrinterData[] | boolean> {
    const client = getPrintersUtils();
    try {
        return await client.getPrinterByName(marca);
    } catch (error) {
        console.error(`Error al Obtener ${marca}:`, error);
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
async function updateFullPrinter(params: NewPrinter, id_impresora: string): Promise<boolean> {
    const client = getPrintersUtils();
    try {
        return await client.updateFullPrinter(params, id_impresora);
    } catch (error) {
        console.error(`Error al Actualizar los Datos de la Impresora con ID ${id_impresora}:`, error);
        return false;
    }
}

//*Actualizar algun dato en especifico de la Impresora
async function updatePartialPrinter(params: Partial<NewPrinter>, id_impresora: string): Promise<boolean> {
    const client = getPrintersUtils();
    try {
        return await client.updatePartialPrinter(params, id_impresora);
    } catch (error) {
        console.error(`Error al Actualizar el Dato de la Impresora con ID ${id_impresora}:`, error);
        return false;
    }
}

//*Eliminar la Impresora por id
async function deletePrinter(id_impresora: string): Promise<boolean> {
    const client = getPrintersUtils();
    try {
        return await client.deletePrinter(id_impresora);
    } catch (error) {
        console.error('Error al Eliminar la Impresora:', error);
        return false;
    }
}

//*Convierte los datos de la Impresora a QR
async function createPrinterQR(id_unidad: string) {
    const client = getPrintersUtils();
    try {
        const printer = await client.getPrinterById(id_unidad);

        if (!printer || typeof printer === 'boolean') {
            throw new Error('Impresora no encontrado');
        }

        const formattedData = `
    INFORMACIÓN
    Identificación de la Impresora: ${printer.id_impresora}
    Identificación de la unidad: ${printer.id_unidad}
    Marca: ${printer.marca}
    Modelo: ${printer.modelo}
    Número de serie: ${printer.numero_serie}
    Tipo de impresora: ${printer.tipo_impresora}
    Formato de impresión: ${printer.formato_impresion}
    Tipo de consumible: ${printer.tipo_consumible}
    Estado de la impresora: ${printer.estado_impresora}
    Tipo de entrada: ${printer.tipo_ingreso}
    Ubicación: ${printer.ubicacion}
    Comentarios: ${printer.comentarios}
    `;
        return client.createPrinterQR(formattedData.trim());
    } catch (error) {
        console.error(`Error al Generar el QR de la Impresora con ID ${id_unidad}:`, error);
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