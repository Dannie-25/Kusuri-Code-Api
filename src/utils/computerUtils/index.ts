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
            id_equipo: data.id_equipo,
            id_unidad: data.id_unidad,
            tipo_equipo: data.tipo_equipo,
            marca: data.marca,
            modelo: data.modelo,
            numero_serie: data.numero_serie,
            sistema_operativo: data.sistema_operativo,
            capacidad_memoria: data.capacidad_memoria,
            capacidad_disco: data.capacidad_disco,
            arquitectura: data.arquitectura,
            procesador_marca: data.procesador_marca,
            procesador_modelo: data.procesador_modelo,
            procesador_velocidad: data.procesador_velocidad,
            numero_inventario: data.numero_inventarioio,
            internet: data.internet,
            tipo_conexion: data.tipo_conexion,
            tipo_ingreso: data.tipo_ingreso,
            ubicacion: data.ubicacion,
            comentarios: data.comentarios,
        }
    }

    //*Comprobacion de Equipos ya existentes
    async exitsComputer(numero_serie: string): Promise<boolean> {
        const query = "SELECT * FROM equipos_computo WHERE numero_serie = ?";
        const [rows] = await this.databaseConexion.query(query, [numero_serie]);
        return Array.isArray(rows) && rows.length > 0;
    }

    //*Obtiene todos los Equipos registrados en la Base de Datos
    async getComputers(): Promise<any> {
        const query = "SELECT * FROM equipos_computo";
        const [rows] = await this.databaseConexion.query(query);
        return rows
    }

    //*Obtiene un Equipo por su id
    async getComputerById(id_equipo: string): Promise<boolean | ComputerData> {
        const query = "SELECT * FROM equipos_computo WHERE id_equipo = ?";
        const [rows] = await this.databaseConexion.query(query, [id_equipo]);
        if (Array.isArray(rows) && rows.length > 0) {
            const equipment = rows[0];
            return this.getDataFromDatabase(equipment);
        }
        return false;
    }

    //*Obtiene un Equipo por id de unidad
    async getComputerByIdUnit(id_unidad: string): Promise<boolean | ComputerData[]> {
        const query = "SELECT * FROM equipos_computo WHERE id_unidad = ?";
        const [rows] = await this.databaseConexion.query(query, [id_unidad]);
        if (Array.isArray(rows) && rows.length > 0) {
            const equipment = rows.map((row) => this.getDataFromDatabase(row));
            return equipment;
        }
        return false;
    }

    //*Obtiene el Equipo por su nombre
    async getComputerByName(tipo_equipo: string): Promise<boolean | ComputerData> {
        const query = "SELECT * FROM equipos_computo WHERE tipo_equipo = ?";
        const [rows] = await this.databaseConexion.query(query, [tipo_equipo]);
        if (Array.isArray(rows) && rows.length > 0) {
            const equipment = rows[0];
            return this.getDataFromDatabase(equipment);
        }
        return false;
    }

    //*Inserción de un nuevo Equipo en la Base de Datos
    async newComputer(params: NewComputerData) {

        const query = "INSERT INTO equipos_computo (id_unidad, tipo_equipo, marca, modelo, numero_serie, sistema_operativo, capacidad_memoria, capacidad_disco, arquitectura, procesador_marca, procesador_modelo, procesador_velocidad, numero_inventario, internet, tipo_conexion, tipo_ingreso, ubicacion, comentarios) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        const { id_unidad, tipo_equipo, marca, modelo, numero_serie, sistema_operativo, capacidad_memoria, capacidad_disco, arquitectura, procesador_marca, procesador_modelo, procesador_velocidad, numero_inventario, internet, tipo_conexion, tipo_ingreso, ubicacion, comentarios } = params;
        const existComputer = await this.exitsComputer(numero_serie);
        if (existComputer) {
            return Promise.reject("Equipment already exists");
        }
        const result = await this.databaseConexion.query(query, [id_unidad, tipo_equipo, marca, modelo, numero_serie, sistema_operativo, capacidad_memoria, capacidad_disco, arquitectura, procesador_marca, procesador_modelo, procesador_velocidad, numero_inventario, internet, tipo_conexion, tipo_ingreso, ubicacion, comentarios]);
        return result;
    }

    //*Actualiza todos los datos del Equipo
    async updateFullComputer(params: NewComputerData, id_equipo: string) {

        const query = "UPDATE equipos_computo SET id_unidad = ?, tipo_equipo = ?, marca = ?, modelo = ?, numero_serie = ?, sistema_operativo = ?, capacidad_memoria = ?, capacidad_disco = ?, arquitectura = ?, procesador_marca = ?, procesador_modelo = ?, procesador_velocidad = ?, numero_inventario = ?, internet = ?, tipo_conexion = ?, tipo_ingreso = ?, ubicacion= ?, comentarios = ? WHERE id_equipo = ?";
        const { id_unidad, tipo_equipo, marca, modelo, numero_serie, sistema_operativo, capacidad_memoria, capacidad_disco, arquitectura, procesador_marca, procesador_modelo, procesador_velocidad, numero_inventario, internet, tipo_conexion, tipo_ingreso, ubicacion, comentarios } = params;
        const result = await this.databaseConexion.query(query, [id_unidad, tipo_equipo, marca, modelo, numero_serie, sistema_operativo, capacidad_memoria, capacidad_disco, arquitectura, procesador_marca, procesador_modelo, procesador_velocidad, numero_inventario, internet, tipo_conexion, tipo_ingreso, ubicacion, comentarios, id_equipo]);
        return result;
    }

    //*Actualiza algun dato especifico del Equipo
    async updatePartialComputer(params: Partial<NewComputerData>, id_equipo: string) {
        const { id_unidad, tipo_equipo, marca, modelo, numero_serie, sistema_operativo, capacidad_memoria, capacidad_disco, arquitectura, procesador_marca, procesador_modelo, procesador_velocidad, numero_inventario, internet, tipo_conexion, tipo_ingreso, ubicacion, comentarios } = params;
        let consulta = "UPDATE equipos_computo SET ";
        const array = [];

        if (id_unidad) {
            consulta += "id_unidad = ?, ";
            array.push(id_unidad);
        }

        if (tipo_equipo) {
            consulta += "tipo_equipo = ?, ";
            array.push(tipo_equipo);
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

        if (sistema_operativo) {
            consulta += "sistema_operativo = ?, ";
            array.push(sistema_operativo);
        }
        if (capacidad_memoria) {
            consulta += "capacidad_memoria = ?, ";
            array.push(capacidad_memoria);
        }

        if (capacidad_disco) {
            consulta += "capacidad_disco = ?, ";
            array.push(capacidad_disco);
        }

        if (arquitectura) {
            consulta += "arquitectura = ?, ";
            array.push(arquitectura);
        }

        if (procesador_marca) {
            consulta += "procesador_marca = ?, ";
            array.push(procesador_marca);
        }

        if (procesador_modelo) {
            consulta += "procesador_modelo = ?, ";
            array.push(procesador_modelo);
        }

        if (procesador_velocidad) {
            consulta += "procesador_velocidad = ?, ";
            array.push(procesador_velocidad);
        }

        if (numero_inventario) {
            consulta += "numero_inventario = ?, ";
            array.push(numero_inventario);
        }

        if (internet) {
            consulta += "internet = ?, ";
            array.push(internet);
        }

        if (tipo_conexion) {
            consulta += "tipo_conexion = ?, ";
            array.push(tipo_conexion);
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

        consulta = consulta.slice(0, -2) + " WHERE id_equipo = ?";
        array.push(id_equipo);

        const result = await this.databaseConexion.query(consulta, array);
        return result;
    }

    //*Elimina un Equipo por su id
    async deleteComputer(id_equipo: string) {
        const query = "DELETE FROM equipos_computo WHERE id_equipo = " + id_equipo;
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