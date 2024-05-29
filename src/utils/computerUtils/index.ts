import { Connection } from "mysql2/promise";
import { NewComputerData, ComputerData } from "../../interfaces/computerInterface";
import 'dotenv/config';
import QRCode from 'qrcode'

//*UTILS de Equipos
export class ComputersUtils {

    //*Conexión con la Base de Datos
    private databaseConexion: Connection;
    private static instance;

    constructor(db: Connection) {
        this.databaseConexion = db;
    }

    getInstance(db) {
        if (ComputersUtils.instance === null) {
            ComputersUtils.instance = new ComputersUtils(db);
        }
        return ComputersUtils.instance;
    }

    //*Transforma los resultados de una consulta a la Base de Datos en un objeto 
    getDataFromDatabase(data: any): ComputerData {
        return {
            id_equipment: data.id_equipment,
            id_unit: data.id_unit,
            equipment_type: data.equipment_type,
            brand: data.brand,
            model: data.model,
            serial_number: data.serial_number,
            operating_system: data.operating_system,
            memory_capacity: data.memory_capacity,
            disk_capacity: data.disk_capacity,
            architecture: data.architecture,
            processor_brand: data.processor_brand,
            processor_model: data.processor_model,
            processor_speed: data.processor_speed,
            inventory_number: data.inventory_number,
            internet: data.internet,
            connection_type: data.connection_type,
            entry_type: data.entry_type,
            location: data.location,
            comments: data.comments,
        }
    }

    //*Comprobacion de Equipos ya existentes
    async exitsComputer(serial_number: string): Promise<boolean> {
        const query = "SELECT * FROM computer_equipment WHERE serial_number = ?";
        const [rows] = await this.databaseConexion.query(query, [serial_number]);
        return Array.isArray(rows) && rows.length > 0;
    }

    //*Obtiene todos los Equipos registrados en la Base de Datos
    async getComputers(): Promise<any> {
        const query = "SELECT * FROM computer_equipment";
        const [rows] = await this.databaseConexion.query(query);
        return rows
    }

    //*Obtiene un Equipo por su id
    async getComputerById(id_equipment: string): Promise<boolean | ComputerData> {
        const query = "SELECT * FROM computer_equipment WHERE id_equipment = ?";
        const [rows] = await this.databaseConexion.query(query, [id_equipment]);
        if (Array.isArray(rows) && rows.length > 0) {
            const equipment = rows[0];
            return this.getDataFromDatabase(equipment);
        }
        return false;
    }

    //*Obtiene un Equipo por id de unidad
    async getComputerByIdUnit(id_unit: string): Promise<boolean | ComputerData[]> {
        const query = "SELECT * FROM computer_equipment WHERE id_unit = ?";
        const [rows] = await this.databaseConexion.query(query, [id_unit]);
        if (Array.isArray(rows) && rows.length > 0) {
            const equipment = rows.map((row) => this.getDataFromDatabase(row));
            return equipment;
        }
        return false;
    }

    //*Obtiene el Equipo por su nombre
    async getComputerByName(equipment_type: string): Promise<boolean | ComputerData> {
        const query = "SELECT * FROM computer_equipment WHERE equipment_type = ?";
        const [rows] = await this.databaseConexion.query(query, [equipment_type]);
        if (Array.isArray(rows) && rows.length > 0) {
            const equipment = rows[0];
            return this.getDataFromDatabase(equipment);
        }
        return false;
    }

    //*Inserción de un nuevo Equipo en la Base de Datos
    async newComputer(params: NewComputerData) {

        const query = "INSERT INTO computer_equipment (id_unit, equipment_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_brand, processor_model, processor_speed, inventory_number, internet, connection_type, entry_type, location, comments) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        const { id_unit, equipment_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_brand, processor_model, processor_speed, inventory_number, internet, connection_type, entry_type, location, comments } = params;
        const existComputer = await this.exitsComputer(serial_number);
        if (existComputer) {
            return Promise.reject("Equipment already exists");
        }
        const result = await this.databaseConexion.query(query, [id_unit, equipment_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_brand, processor_model, processor_speed, inventory_number, internet, connection_type, entry_type, location, comments]);
        return result;
    }

    //*Actualiza todos los datos del Equipo
    async updateFullComputer(params: NewComputerData, id_equipment: string) {

        const query = "UPDATE computer_equipment SET id_unit = ?, equipment_type = ?, brand = ?, model = ?, serial_number = ?, operating_system = ?, memory_capacity = ?, disk_capacity = ?, architecture = ?, processor_brand = ?, processor_model = ?, processor_speed = ?, inventory_number = ?, internet = ?, connection_type = ?, entry_type = ?, location= ?, comments = ? WHERE id_equipment = ?";
        const { id_unit, equipment_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_brand, processor_model, processor_speed, inventory_number, internet, connection_type, entry_type, location, comments } = params;
        const result = await this.databaseConexion.query(query, [id_unit, equipment_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_brand, processor_model, processor_speed, inventory_number, internet, connection_type, entry_type, location, comments, id_equipment]);
        return result;
    }

    //*Actualiza algun dato especifico del Equipo
    async updatePartialComputer(params: Partial<NewComputerData>, id_equipment: string) {
        const { id_unit, equipment_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_brand, processor_model, processor_speed, inventory_number, internet, connection_type, entry_type, location, comments } = params;
        let consulta = "UPDATE computer_equipment SET ";
        const array = [];

        if (id_unit) {
            consulta += "id_unit = ?, ";
            array.push(id_unit);
        }

        if (equipment_type) {
            consulta += "equipment_type = ?, ";
            array.push(equipment_type);
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

        if (operating_system) {
            consulta += "operating_system = ?, ";
            array.push(operating_system);
        }
        if (memory_capacity) {
            consulta += "memory_capacity = ?, ";
            array.push(memory_capacity);
        }

        if (disk_capacity) {
            consulta += "disk_capacity = ?, ";
            array.push(disk_capacity);
        }

        if (architecture) {
            consulta += "architecture = ?, ";
            array.push(architecture);
        }

        if (processor_brand) {
            consulta += "processor_brand = ?, ";
            array.push(processor_brand);
        }

        if (processor_model) {
            consulta += "processor_model = ?, ";
            array.push(processor_model);
        }

        if (processor_speed) {
            consulta += "processor_speed = ?, ";
            array.push(processor_speed);
        }

        if (inventory_number) {
            consulta += "inventory_number = ?, ";
            array.push(inventory_number);
        }

        if (internet) {
            consulta += "internet = ?, ";
            array.push(internet);
        }

        if (connection_type) {
            consulta += "connection_type = ?, ";
            array.push(connection_type);
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

        consulta = consulta.slice(0, -2) + " WHERE id_equipment = ?";
        array.push(id_equipment);

        const result = await this.databaseConexion.query(consulta, array);
        return result;
    }

    //*Elimina un Equipo por su id
    async deleteComputer(id_equipment: string) {
        const query = "DELETE FROM computer_equipment WHERE id_equipment = " + id_equipment;
        const result = await this.databaseConexion.query(query);
        return result
    }

    //*Generar un código QR para almacenar los atributos de un Equipo
    async createComputerQR(data: string): Promise<string> {
        try {
            return await QRCode.toDataURL(data);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}