import { Connection } from "mysql2/promise";

//*Datos completo de la Impresora
export type PrinterData = {
    id_printer: number;
    id_unit: number;
    brand: string;
    model: string;
    serial_number: string;
    printer_type: string;
    print_format: string;
    consumable_type: string;
    printer_status: string;
    entry_type: string;
    location: string;
    comments: string;
}

//*Datos almacenados de la Impresora
export interface NewPrinterData {
    id_unit?: number;
    brand: string;
    model: string;
    serial_number: string;
    printer_type: string;
    print_format: string;
    consumable_type: string;
    printer_status: string;
    entry_type: string;
    location: string;
    comments: string;
}

//*Datos para una nueva Impresora
export interface NewPrinter {
    id_unit: number;
    brand: string;
    model: string;
    serial_number: string;
    printer_type: string;
    print_format: string;
    consumable_type: string;
    printer_status: string;
    entry_type: string;
    location: string;
    comments: string;
}

//*Conexión a la a base de datos y Gets de las funciones 
export interface PrintersUtilsInterface {
    databaseConexion: Connection;

    getInstance(db: Connection);
    getPrinters();
    getPrinterById(id_printer: string): Promise<boolean | PrinterData>;
    getPrinterByIdUnit(id_unit: string): Promise<boolean | PrinterData[]>;
    getPrinterByName(printer_type: string): Promise<boolean | PrinterData>;
    newPrinter(params: NewPrinterData);
    updateFullPrinter(params: NewPrinterData, id_printer);
    updatePartialPrinter(params: Partial<NewPrinterData>, id_printer: string);
    deletePrinter(id_printer: string);
    createPrinterQR(id_printer: string);
}