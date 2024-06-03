import { Connection } from "mysql2/promise";
import { NewHospitalData, HospitalData } from "../../interfaces/hospitalInterface";
import 'dotenv/config';
import QRCode from 'qrcode'


//*UTILS de Unidades Medicas
export class HospitalsUtils {

    //*Conexión con la Base de Datos
    private databaseConexion: Connection;
    private static instance;

    constructor(db: Connection) {
        this.databaseConexion = db;
    }

    getInstance(db) {
        if (HospitalsUtils.instance === null) {
            HospitalsUtils.instance = new HospitalsUtils(db);
        }
        return HospitalsUtils.instance;
    }

    //*Transforma los resultados de una consulta a la Base de Datos en un objeto 
    getDataFromDatabase(data: any): HospitalData {
        return {
            clue_unidad: data.clue_unidad,
            id_unidad: data.id_unidad,
            nombre_unidad: data.nombre_unidad,
            nivel_atencion: data.nivel_atencion,
            internet: data.internet,
            consultorios_habilitados: data.consultorios_habilitados,
            consultorio_SINERHIAS: data.consultorio_SINERHIAS,
            nombre_administrador: data.nombre_administrador,
            numero_telefonico: data.numero_telefonico,
            uso_simba: data.uso_simba,
            farmacia: data.farmacia
        }
    }

    //*Comprobacion de Unidades Medicas ya existentes
    async exitsHospital(clue_unidad: string): Promise<boolean> {
        const query = "SELECT * FROM unidades_medicas WHERE clue_unidad = ?";
        const [rows] = await this.databaseConexion.query(query, [clue_unidad]);
        return Array.isArray(rows) && rows.length > 0;
    }

    //*Obtiene todas las Unidades Medicas registradas en la Base de Datos
    async getHospitals(): Promise<any> {
        const query = "SELECT * FROM unidades_medicas";
        const [rows] = await this.databaseConexion.query(query);
        return rows
    }

    //*Obtiene una Unidad Medica por id
    async getHospitalById(id_unidad: string): Promise<boolean | HospitalData> {
        const query = "SELECT * FROM unidades_medicas WHERE id_unidad = ?";
        const [rows] = await this.databaseConexion.query(query, [id_unidad]);
        if (Array.isArray(rows) && rows.length > 0) {
            const unit = rows[0];
            return this.getDataFromDatabase(unit);
        }
        return false;
    }

    //*Obtiene todos los datos de id_unidad
    async getFullById(id_unidad: string) {
        const query = `SELECT
        mu.id_unidad,
        mu.clue_unidad,
        mu.nombre_unidad,
        mu.nivel_atencion,
        mu.internet,
        mu.consultorios_habilitados,
        mu.consultorio_SINERHIAS,
        mu.nombre_administrador,
        mu.numero_telefonico,
        mu.uso_simba,
        mu.farmacia,
        ce.tipo_equipo,
        ce.marca AS equipos_computo_marca,
        ce.modelo AS equipos_computo_modelo,
        ce.numero_serie AS computer_numero_serie,
        ce.sistema_operativo,
        ce.capacidad_memoria,
        ce.capacidad_disco,
        ce.arquitectura,
        ce.procesador_marca,
        ce.procesador_modelo,
        ce.procesador_velocidad,
        ce.numero_inventario,
        ce.tipo_conexion,
        ce.tipo_ingreso,
        ce.ubicacion AS computer_ubicacion,
        ce.comentarios AS computer_comentarios,
        pe.marca AS equipos_impresion_marca,
        pe.modelo AS equipos_impresion_modelo,
        pe.numero_serie AS printer_numero_serie,
        pe.tipo_impresora,
        pe.formato_impresion,
        pe.tipo_consumible,
        pe.estado_impresora,
        pe.tipo_ingreso,
        pe.ubicacion AS printer_ubicacion,
        pe.comentarios AS printer_comentarios
      FROM unidades_medicas mu
      LEFT JOIN equipos_computo ce ON mu.id_unidad = ce.id_unidad
      LEFT JOIN equipos_impresion pe ON mu.id_unidad = pe.id_unidad
      WHERE mu.id_unidad = ?;
      
    `;
        const [rows] = await this.databaseConexion.query(query, [id_unidad]);
        if (Array.isArray(rows) && rows.length > 0) {
            const unit = rows[0];
            return unit;
        }
        return false;
    }

    //*Obtiene una Unidad Medica por clue unit
    async getHospitalByUnitClue(clue_unidad: string): Promise<boolean | HospitalData> {
        const query = "SELECT * FROM unidades_medicas WHERE clue_unidad = ?";
        const [rows] = await this.databaseConexion.query(query, [clue_unidad]);
        if (Array.isArray(rows) && rows.length > 0) {
            const unit = rows[0];
            return this.getDataFromDatabase(unit);
        }
        return false;
    }

    //*Obtiene una Unidad Medica por su nombre
    async getHospitalByName(nombre_unidad: string): Promise<boolean | HospitalData> {
        const query = "SELECT * FROM unidades_medicas WHERE nombre_unidad = ?";
        const [rows] = await this.databaseConexion.query(query, [nombre_unidad]);
        if (Array.isArray(rows) && rows.length > 0) {
            const unit = rows[0];
            return this.getDataFromDatabase(unit);
        }
        return false;
    }

    //*Inserción de una nueva Unidad Medica en la Base de Datos
    async newHospital(params: NewHospitalData) {

        const query = "INSERT INTO unidades_medicas ( clue_unidad, nombre_unidad, nivel_atencion, internet, consultorios_habilitados, consultorio_SINERHIAS, nombre_administrador, numero_telefonico, uso_simba, farmacia) VALUES (?,?,?,?,?,?,?,?,?,?)";
        const { clue_unidad, nombre_unidad, nivel_atencion, internet, consultorios_habilitados, consultorio_SINERHIAS, nombre_administrador, numero_telefonico, uso_simba, farmacia } = params;
        const existHospital = await this.exitsHospital(clue_unidad);
        if (existHospital) {
            return Promise.reject("Unit Medical already exists");
        }
        const result = await this.databaseConexion.query(query, [clue_unidad, nombre_unidad, nivel_atencion, internet, consultorios_habilitados, consultorio_SINERHIAS, nombre_administrador, numero_telefonico, uso_simba, farmacia]);
        return result;
    }

    //*Actualiza todos los datos de una Unidad Medica
    async updateFullHospital(params: NewHospitalData, id_unidad: string) {

        const query = "UPDATE unidades_medicas SET clue_unidad = ?, nombre_unidad = ?, nivel_atencion = ?, internet = ?, consultorios_habilitados = ?, consultorio_SINERHIAS = ?, nombre_administrador = ?, numero_telefonico = ?, uso_simba = ?, farmacia = ? WHERE id_unidad = ?";
        const { clue_unidad, nombre_unidad, nivel_atencion, internet, consultorios_habilitados, consultorio_SINERHIAS, nombre_administrador, numero_telefonico, uso_simba, farmacia } = params;
        const result = await this.databaseConexion.query(query, [clue_unidad, nombre_unidad, nivel_atencion, internet, consultorios_habilitados, consultorio_SINERHIAS, nombre_administrador, numero_telefonico, uso_simba, farmacia, id_unidad]);
        return result;
    }

    //*Actualiza algun dato especifico de la Unidad Medica
    async updatePartialHospital(params: Partial<NewHospitalData>, id_unidad: string) {
        const { clue_unidad, nombre_unidad, nivel_atencion, internet, consultorios_habilitados, consultorio_SINERHIAS, nombre_administrador, numero_telefonico, uso_simba, farmacia } = params;
        let consulta = "UPDATE unidades_medicas SET ";
        const array = [];

        if (clue_unidad) {
            consulta += "clue_unidad = ?, ";
            array.push(clue_unidad);
        }

        if (nombre_unidad) {
            consulta += "nombre_unidad = ?, ";
            array.push(nombre_unidad);
        }

        if (nivel_atencion) {
            consulta += "nivel_atencion = ?, ";
            array.push(nivel_atencion);
        }

        if (internet) {
            consulta += "internet = ?, ";
            array.push(internet);
        }

        if (consultorios_habilitados) {
            consulta += "consultorios_habilitados = ?, ";
            array.push(consultorios_habilitados);
        }

        if (consultorio_SINERHIAS) {
            consulta += "consultorio_SINERHIAS = ?, ";
            array.push(consultorio_SINERHIAS);
        }

        if (nombre_administrador) {
            consulta += "nombre_administrador = ?, ";
            array.push(nombre_administrador);
        }

        if (numero_telefonico) {
            consulta += "numero_telefonico = ?, ";
            array.push(numero_telefonico);
        }
        if (uso_simba) {
            consulta += "uso_simba = ?, ";
            array.push(uso_simba);
        }

        if (farmacia) {
            consulta += "farmacia = ?, ";
            array.push(farmacia);
        }

        consulta = consulta.slice(0, -2) + " WHERE id_unidad = ?";
        array.push(id_unidad);

        const result = await this.databaseConexion.query(consulta, array);
        return result;
    }

    //*Elimina un Unidad Medica por su id
    async deleteHospital(id_unidad: string) {
        const query = "DELETE FROM unidades_medicas WHERE id_unidad = " + id_unidad;
        const result = await this.databaseConexion.query(query);
        return result
    }

    //*Generar un código QR para almacenar los atributos de una Unidad Medica
    async createHospitalQR(data: string): Promise<string> {
        try {
            return await QRCode.toDataURL(data);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}
