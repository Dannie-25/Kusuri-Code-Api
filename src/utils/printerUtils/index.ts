import { Connection } from "mysql2/promise";
import { NewPrinterData, PrinterData } from "../../interfaces/printerInterface";
import 'dotenv/config';
import QRCode from 'qrcode'

//*UTILS de Impresoras
export class PrintersUtils {

    //*Conexión con la Base de Datos
    private databaseConexion: Connection;
    private static instance;

    constructor(db: Connection) {
        this.databaseConexion = db;
    }

    getInstance(db) {
        if (PrintersUtils.instance === null) {
            PrintersUtils.instance = new PrintersUtils(db);
        }
        return PrintersUtils.instance;
    }

    //*Transforma los resultados de una consulta a la Base de Datos en un objeto 
    getDataFromDatabase(data: any): PrinterData {
        return {
            id_printer: data.id_printer,
            id_unit: data.id_unit,
            brand: data.brand,
            model: data.model,
            serial_number: data.serial_number,
            printer_type: data.printer_type,
            print_format: data.print_format,
            consumable_type: data.consumable_type,
            printer_status: data.printer_status,
            entry_type: data.entry_type,
            location: data.location,
            comments: data.comments
        }
    }

    //*Comprobacion de Impresoras ya existentes
    async exitsPrinter(serial_number: string): Promise<boolean> {
        const query = "SELECT * FROM printer_equipment WHERE serial_number = ?";
        const [rows] = await this.databaseConexion.query(query, [serial_number]);
        return Array.isArray(rows) && rows.length > 0;
    }

    //*Obtiene todas las Impresoras registrados en la Base de Datos
    async getPrinters(): Promise<any> {
        const query = "SELECT * FROM printer_equipment";
        const [rows] = await this.databaseConexion.query(query);
        return rows
    }

    //*Obtiene una Impresora por su id
    async getPrinterById(id_printer: string): Promise<boolean | PrinterData> {
        const query = "SELECT * FROM printer_equipment WHERE id_printer = ?";
        const [rows] = await this.databaseConexion.query(query, [id_printer]);
        if (Array.isArray(rows) && rows.length > 0) {
            const equipment = rows[0];
            return this.getDataFromDatabase(equipment);
        }
        return false;
    }

    //*Obtiene una Impresora por id de unidad
    async getPrinterByIdUnit(id_unit: string): Promise<boolean | PrinterData[]> {
        const query = "SELECT * FROM printer_equipment WHERE id_unit = ?";
        const [rows] = await this.databaseConexion.query(query, [id_unit]);
        if (Array.isArray(rows) && rows.length > 0) {
            const equipment = rows.map((row) => this.getDataFromDatabase(row));
            return equipment;
        }
        return false;
    }

    //*Obtiene la Impresora por su nombre
    async getPrinterByName(printer_type: string): Promise<boolean | PrinterData> {
        const query = "SELECT * FROM printer_equipment WHERE printer_type = ?";
        const [rows] = await this.databaseConexion.query(query, [printer_type]);
        if (Array.isArray(rows) && rows.length > 0) {
            const equipment = rows[0];
            return this.getDataFromDatabase(equipment);
        }
        return false;
    }

    //*Inserción de una nueva Impresora en la Base de Datos
    async newPrinter(params: NewPrinterData) {

        const query = "INSERT INTO printer_equipment ( id_unit, brand, model, serial_number, printer_type, print_format, consumable_type, printer_status, entry_type, location, comments) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        const { id_unit, brand, model, serial_number, printer_type, print_format, consumable_type, printer_status, entry_type, location, comments } = params;
        const existPrinter = await this.exitsPrinter(serial_number);
        if (existPrinter) {
            return Promise.reject("Equipment already exists");
        }
        const result = await this.databaseConexion.query(query, [id_unit, brand, model, serial_number, printer_type, print_format, consumable_type, printer_status, entry_type, location, comments]);
        return result;
    }

    //*Actualiza todos los datos de la Impresora
    async updateFullPrinter(params: NewPrinterData, id_printer: string) {

        const query = "UPDATE printer_equipment SET id_unit = ?, brand = ?, model = ?, serial_number = ?, printer_type = ?, print_format = ?, consumable_type = ?, printer_status = ?, entry_type = ?, location= ?, comments = ? WHERE id_printer = ?";
        const { id_unit, brand, model, serial_number, printer_type, print_format, consumable_type, printer_status, entry_type, location, comments } = params;
        const result = await this.databaseConexion.query(query, [id_unit, brand, model, serial_number, printer_type, print_format, consumable_type, printer_status, entry_type, location, comments, id_printer]);
        return result;
    }

    //*Actualiza algun dato especifico de la Impresora
    async updatePartialPrinter(params: Partial<NewPrinterData>, id_printer: string) {
        const { id_unit, brand, model, serial_number, printer_type, print_format, consumable_type, printer_status, entry_type, location, comments } = params;
        let consulta = "UPDATE printer_equipment SET ";
        const array = [];

        if (id_unit) {
            consulta += "id_unit = ?, ";
            array.push(id_unit);
        }

        if (brand) {
            consulta += "brand = ?, ";
            array.push(brand);
        }

        if (model) {
            consulta += "model = ?, ";
            array.push(model);
        }

        if (serial_number) {
            consulta += "serial_number = ?, ";
            array.push(serial_number);
        }

        if (printer_type) {
            consulta += "printer_type = ?, ";
            array.push(printer_type);
        }
        if (print_format) {
            consulta += "print_format = ?, ";
            array.push(print_format);
        }

        if (consumable_type) {
            consulta += "consumable_type = ?, ";
            array.push(consumable_type);
        }

        if (printer_status) {
            consulta += "printer_status = ?, ";
            array.push(printer_status);
        }

        if (entry_type) {
            consulta += "entry_type = ?, ";
            array.push(entry_type);
        }

        if (location) {
            consulta += "location = ?, ";
            array.push(location);
        }

        if (comments) {
            consulta += "comments = ?, ";
            array.push(comments);
        }

        consulta = consulta.slice(0, -2) + " WHERE id_printer = ?";
        array.push(id_printer);

        const result = await this.databaseConexion.query(consulta, array);
        return result;
    }

    //*Elimina una Impresora por su id
    async deletePrinter(id_printer: string) {
        const query = "DELETE FROM printer_equipment WHERE id_printer = " + id_printer;
        const result = await this.databaseConexion.query(query);
        return result
    }

    //*Generar un código QR para almacenar los atributos de la Impresora
    async createPrinterQR(data: string): Promise<string> {
        try {
            return await QRCode.toDataURL(data);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}