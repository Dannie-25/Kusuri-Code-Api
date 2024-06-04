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
            id_impresora: data.id_impresora,
            id_unidad: data.id_unidad,
            marca: data.marca,
            modelo: data.modelo,
            numero_serie: data.numero_serie,
            tipo_impresora: data.tipo_impresora,
            formato_impresion: data.formato_impresion,
            tipo_consumible: data.tipo_consumible,
            estado_impresora: data.estado_impresora,
            tipo_ingreso: data.tipo_ingreso,
            ubicacion: data.ubicacion,
            comentarios: data.comentarios
        }
    }

    //*Comprobacion de Impresoras ya existentes
    async exitsPrinter(numero_serie: string): Promise<boolean> {
        const query = "SELECT * FROM equipos_impresion WHERE numero_serie = ?";
        const [rows] = await this.databaseConexion.query(query, [numero_serie]);
        return Array.isArray(rows) && rows.length > 0;
    }

    //*Obtiene todas las Impresoras registrados en la Base de Datos
    async getPrinters(): Promise<any> {
        const query = "SELECT * FROM equipos_impresion";
        const [rows] = await this.databaseConexion.query(query);
        return rows
    }

    //*Obtiene una Impresora por su id
    async getPrinterById(id_impresora: string): Promise<boolean | PrinterData> {
        const query = "SELECT * FROM equipos_impresion WHERE id_impresora = ?";
        const [rows] = await this.databaseConexion.query(query, [id_impresora]);
        if (Array.isArray(rows) && rows.length > 0) {
            const equipment = rows[0];
            return this.getDataFromDatabase(equipment);
        }
        return false;
    }

    //*Obtiene una Impresora por id de unidad
    async getPrinterByIdUnit(id_unidad: string): Promise<boolean | PrinterData[]> {
        const query = "SELECT * FROM equipos_impresion WHERE id_unidad = ?";
        const [rows] = await this.databaseConexion.query(query, [id_unidad]);
        if (Array.isArray(rows) && rows.length > 0) {
            const equipment = rows.map((row) => this.getDataFromDatabase(row));
            return equipment;
        }
        return false;
    }

    //*Obtiene la Impresora por su nombre
    async getPrinterByName(marca: string): Promise<boolean | PrinterData> {
        const query = "SELECT * FROM equipos_impresion WHERE marca = ?";
        const [rows] = await this.databaseConexion.query(query, [marca]);
        if (Array.isArray(rows) && rows.length > 0) {
            const equipment = rows[0];
            return this.getDataFromDatabase(equipment);
        }
        return false;
    }

    //*Inserción de una nueva Impresora en la Base de Datos
    async newPrinter(params: NewPrinterData) {

        const query = "INSERT INTO equipos_impresion ( id_unidad, marca, modelo, numero_serie, tipo_impresora, formato_impresion, tipo_consumible, estado_impresora, tipo_ingreso, ubicacion, comentarios) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        const { id_unidad, marca, modelo, numero_serie, tipo_impresora, formato_impresion, tipo_consumible, estado_impresora, tipo_ingreso, ubicacion, comentarios } = params;
        const existPrinter = await this.exitsPrinter(numero_serie);
        if (existPrinter) {
            return Promise.reject("Equipment already exists");
        }
        const result = await this.databaseConexion.query(query, [id_unidad, marca, modelo, numero_serie, tipo_impresora, formato_impresion, tipo_consumible, estado_impresora, tipo_ingreso, ubicacion, comentarios]);
        return result;
    }

    //*Actualiza todos los datos de la Impresora
    async updateFullPrinter(params: NewPrinterData, id_impresora: string) {

        const query = "UPDATE equipos_impresion SET id_unidad = ?, marca = ?, modelo = ?, numero_serie = ?, tipo_impresora = ?, formato_impresion = ?, tipo_consumible = ?, estado_impresora = ?, tipo_ingreso = ?, ubicacion= ?, comentarios = ? WHERE id_impresora = ?";
        const { id_unidad, marca, modelo, numero_serie, tipo_impresora, formato_impresion, tipo_consumible, estado_impresora, tipo_ingreso, ubicacion, comentarios } = params;
        const result = await this.databaseConexion.query(query, [id_unidad, marca, modelo, numero_serie, tipo_impresora, formato_impresion, tipo_consumible, estado_impresora, tipo_ingreso, ubicacion, comentarios, id_impresora]);
        return result;
    }

    //*Actualiza algun dato especifico de la Impresora
    async updatePartialPrinter(params: Partial<NewPrinterData>, id_impresora: string) {
        const { id_unidad, marca, modelo, numero_serie, tipo_impresora, formato_impresion, tipo_consumible, estado_impresora, tipo_ingreso, ubicacion, comentarios } = params;
        let consulta = "UPDATE equipos_impresion SET ";
        const array = [];

        if (id_unidad) {
            consulta += "id_unidad = ?, ";
            array.push(id_unidad);
        }

        if (marca) {
            consulta += "marca = ?, ";
            array.push(marca);
        }

        if (modelo) {
            consulta += "modelo = ?, ";
            array.push(modelo);
        }

        if (numero_serie) {
            consulta += "numero_serie = ?, ";
            array.push(numero_serie);
        }

        if (tipo_impresora) {
            consulta += "tipo_impresora = ?, ";
            array.push(tipo_impresora);
        }
        if (formato_impresion) {
            consulta += "formato_impresion = ?, ";
            array.push(formato_impresion);
        }

        if (tipo_consumible) {
            consulta += "tipo_consumible = ?, ";
            array.push(tipo_consumible);
        }

        if (estado_impresora) {
            consulta += "estado_impresora = ?, ";
            array.push(estado_impresora);
        }

        if (tipo_ingreso) {
            consulta += "tipo_ingreso = ?, ";
            array.push(tipo_ingreso);
        }

        if (ubicacion) {
            consulta += "ubicacion = ?, ";
            array.push(ubicacion);
        }

        if (comentarios) {
            consulta += "comentarios = ?, ";
            array.push(comentarios);
        }

        consulta = consulta.slice(0, -2) + " WHERE id_impresora = ?";
        array.push(id_impresora);

        const result = await this.databaseConexion.query(consulta, array);
        return result;
    }

    //*Elimina una Impresora por su id
    async deletePrinter(id_impresora: string) {
        const query = "DELETE FROM equipos_impresion WHERE id_impresora = " + id_impresora;
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