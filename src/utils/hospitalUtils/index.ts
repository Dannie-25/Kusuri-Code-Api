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
            unit_clue: data.unit_clue,
            id_unit: data.id_unit,
            unit_name: data.unit_name,
            attention_level: data.attention_level,
            internet: data.internet,
            enabled_offices: data.enabled_offices,
            SINERHIAS_office: data.SINERHIAS_office,
            administrator_name: data.administrator_name,
            phone_number: data.phone_number,
            simba_use: data.simba_use,
            pharmacy: data.pharmacy
        }
    }

    //*Comprobacion de Unidades Medicas ya existentes
    async exitsHospital(unit_name: string): Promise<boolean> {
        const query = "SELECT * FROM medical_units WHERE unit_name = ?";
        const [rows] = await this.databaseConexion.query(query, [unit_name]);
        return Array.isArray(rows) && rows.length > 0;
    }

    //*Obtiene todas las Unidades Medicas registradas en la Base de Datos
    async getHospitals(): Promise<any> {
        const query = "SELECT * FROM medical_units";
        const [rows] = await this.databaseConexion.query(query);
        return rows
    }

    //*Obtiene una Unidad Medica por id
    async getHospitalById(id_unit: string): Promise<boolean | HospitalData> {
        const query = "SELECT * FROM medical_units WHERE id_unit = ?";
        const [rows] = await this.databaseConexion.query(query, [id_unit]);
        if (Array.isArray(rows) && rows.length > 0) {
            const unit = rows[0];
            return this.getDataFromDatabase(unit);
        }
        return false;
    }

    //*Obtiene una Unidad Medica por clue unit
    async getHospitalByUnitClue(unit_clue: string): Promise<boolean | HospitalData> {
        const query = "SELECT * FROM medical_units WHERE unit_clue = ?";
        const [rows] = await this.databaseConexion.query(query, [unit_clue]);
        if (Array.isArray(rows) && rows.length > 0) {
            const unit = rows[0];
            return this.getDataFromDatabase(unit);
        }
        return false;
    }

    //*Obtiene una Unidad Medica por su nombre
    async getHospitalByName(unit_name: string): Promise<boolean | HospitalData> {
        const query = "SELECT * FROM medical_units WHERE unit_name = ?";
        const [rows] = await this.databaseConexion.query(query, [unit_name]);
        if (Array.isArray(rows) && rows.length > 0) {
            const unit = rows[0];
            return this.getDataFromDatabase(unit);
        }
        return false;
    }

    //*Inserción de una nueva Unidad Medica en la Base de Datos
    async newHospital(params: NewHospitalData) {

        const query = "INSERT INTO medical_units ( unit_clue, unit_name, attention_level, internet, enabled_offices, SINERHIAS_office, administrator_name, phone_number, simba_use, pharmacy) VALUES (?,?,?,?,?,?,?,?,?,?)";
        const { unit_clue, unit_name, attention_level, internet, enabled_offices, SINERHIAS_office, administrator_name, phone_number, simba_use, pharmacy } = params;
        const existHospital = await this.exitsHospital(unit_name);
        if (existHospital) {
            return Promise.reject("Unit already exists");
        }
        const result = await this.databaseConexion.query(query, [unit_clue, unit_name, attention_level, internet, enabled_offices, SINERHIAS_office, administrator_name, phone_number, simba_use, pharmacy]);
        return result;
    }

    //*Actualiza todos los datos de una Unidad Medica
    async updateFullHospital(params: NewHospitalData, id_unit: string) {

        const query = "UPDATE medical_units SET unit_clue = ?, unit_name = ?, attention_level = ?, internet = ?, enabled_offices = ?, SINERHIAS_office = ?, administrator_name = ?, phone_number = ?, simba_use = ?, pharmacy = ? WHERE id_unit = ?";
        const { unit_clue, unit_name, attention_level, internet, enabled_offices, SINERHIAS_office, administrator_name, phone_number, simba_use, pharmacy } = params;
        const result = await this.databaseConexion.query(query, [unit_clue, unit_name, attention_level, internet, enabled_offices, SINERHIAS_office, administrator_name, phone_number, simba_use, pharmacy, id_unit]);
        return result;
    }

    //*Actualiza algun dato especifico de la Unidad Medica
    async updatePartialHospital(params: Partial<NewHospitalData>, id_unit: string) {
        const { unit_clue, unit_name, attention_level, internet, enabled_offices, SINERHIAS_office, administrator_name, phone_number, simba_use, pharmacy } = params;
        let consulta = "UPDATE medical_units SET ";
        const array = [];

        if (unit_clue) {
            consulta += "unit_clue = ?, ";
            array.push(unit_clue);
        }

        if (unit_name) {
            consulta += "unit_name = ?, ";
            array.push(unit_name);
        }

        if (attention_level) {
            consulta += "attention_level = ?, ";
            array.push(attention_level);
        }

        if (internet) {
            consulta += "internet = ?, ";
            array.push(internet);
        }

        if (enabled_offices) {
            consulta += "enabled_offices = ?, ";
            array.push(enabled_offices);
        }

        if (SINERHIAS_office) {
            consulta += "SINERHIAS_office = ?, ";
            array.push(SINERHIAS_office);
        }

        if (administrator_name) {
            consulta += "administrator_name = ?, ";
            array.push(administrator_name);
        }

        if (phone_number) {
            consulta += "phone_number = ?, ";
            array.push(phone_number);
        }
        if (simba_use) {
            consulta += "simba_use = ?, ";
            array.push(simba_use);
        }

        if (pharmacy) {
            consulta += "pharmacy = ?, ";
            array.push(pharmacy);
        }

        consulta = consulta.slice(0, -2) + " WHERE id_unit = ?";
        array.push(id_unit);

        const result = await this.databaseConexion.query(consulta, array);
        return result;
    }

    //*Elimina un Unidad Medica por su id
    async deleteHospital(id_unit: string) {
        const query = "DELETE FROM medical_units WHERE id_unit = " + id_unit;
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
