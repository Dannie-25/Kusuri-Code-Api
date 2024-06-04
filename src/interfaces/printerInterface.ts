import { Connection } from "mysql2/promise";

//*Datos completo de la Impresora
export type PrinterData = {
    id_impresora: number;
    id_unidad: number;
    marca: string;
    modelo: string;
    numero_serie: string;
    tipo_impresora: string;
    formato_impresion: string;
    tipo_consumible: string;
    estado_impresora: string;
    tipo_ingreso: string;
    ubicacion: string;
    comentarios: string;
}

//*Datos almacenados de la Impresora
export interface NewPrinterData {
    id_unidad?: number;
    marca: string;
    modelo: string;
    numero_serie: string;
    tipo_impresora: string;
    formato_impresion: string;
    tipo_consumible: string;
    estado_impresora: string;
    tipo_ingreso: string;
    ubicacion: string;
    comentarios: string;
}

//*Datos para una nueva Impresora
export interface NewPrinter {
    id_unidad: number;
    marca: string;
    modelo: string;
    numero_serie: string;
    tipo_impresora: string;
    formato_impresion: string;
    tipo_consumible: string;
    estado_impresora: string;
    tipo_ingreso: string;
    ubicacion: string;
    comentarios: string;
}

//*Conexión a la a base de datos y Gets de las funciones 
export interface PrintersUtilsInterface {
    databaseConexion: Connection;

    getInstance(db: Connection);
    getPrinters();
    getPrinterById(id_impresora: string): Promise<boolean | PrinterData>;
    getPrinterByIdUnit(id_unidad: string): Promise<boolean | PrinterData[]>;
    getPrinterByName(marca: string): Promise<boolean | PrinterData[]>;
    newPrinter(params: NewPrinterData);
    updateFullPrinter(params: NewPrinterData, id_impresora);
    updatePartialPrinter(params: Partial<NewPrinterData>, id_impresora: string);
    deletePrinter(id_impresora: string);
    createPrinterQR(id_impresora: string);
}