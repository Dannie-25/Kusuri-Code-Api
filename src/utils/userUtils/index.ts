import { Connection } from "mysql2/promise";
import AES = require("crypto-js/aes");
import { NewUserData, UserData } from "../../interfaces/userInterface";
import { NewComputerData, ComputerData } from "../../interfaces/computerInterface";
import { HospitalData, NewHospitalData } from "../../interfaces/hospitalInterface";
import 'dotenv/config';
import QRCode from 'qrcode'


//*UTILS User
export class UsersUtils {

    //*Conexión a la base de datos
    private databaseConexion: Connection;
    private static instance;

    constructor(db: Connection) {
        this.databaseConexion = db;
    }

    getInstance(db) {
        if (UsersUtils.instance === null) {
            UsersUtils.instance = new UsersUtils(db);
        }
        return UsersUtils.instance;
    }

    //*Consulta en la base de datos
    getDataFromDatabase(data: any): UserData {
        return {
            id: data.id,
            names: data.names,
            lastNames: data.lastNames,
            email: data.email,
            password: data.password,
        }
    }
/**
    //*Crear Codigo QR para almacenamiento de los atributos del User
    async createUserQR(data: any): Promise<any> {
        const generateQR = async (UserData: any) => {
            try {
                return await QRCode.toDataURL(JSON.stringify(UserData))
            } catch (err) {
                console.error(err)
                throw err;
            }
        }
        return await generateQR(data);
    }
*/

    //*Obtener todos los usuarios de la base de datos
    async getUsers(): Promise<any> {
        const query = "SELECT * FROM users";
        const [rows] = await this.databaseConexion.query(query);
        return rows
    }

    //*Consultar usuario por id
    async getUserById(id: string): Promise<boolean | UserData> {
        const query = "SELECT * FROM users WHERE id = ?";
        const [rows] = await this.databaseConexion.query(query, [id]);
        if (Array.isArray(rows) && rows.length > 0) {
            const user = rows[0];
            return this.getDataFromDatabase(user);
        }
        return false;
    }

    //*Consultar usuario por email
    async getUserByEmail(email: string): Promise<boolean | UserData> {
        const query = "SELECT * FROM users WHERE email = ?";
        const [rows] = await this.databaseConexion.query(query, [email]);
        if (Array.isArray(rows) && rows.length > 0) {
            const user = rows[0];
            return this.getDataFromDatabase(user);
        }
        return false;
    }

    //*Usuarios existentes
    async exitsUser(email: string): Promise<boolean> {
        const query = "SELECT * FROM users WHERE email = ?";
        const [rows] = await this.databaseConexion.query(query, [email]);
        return Array.isArray(rows) && rows.length > 0;
    }

    //*Inserción de nuevo usuario
    async newUser(params: NewUserData) {

        const query = "INSERT INTO users (names, lastNames, email, password) VALUES (?, ?, ?, ?)";
        const { names, lastNames, email, password } = params;
        const existUser = await this.exitsUser(email);
        if (existUser) {
            return Promise.reject("User already exists");
        }
        const encryptedPassword = AES.encrypt(password, process.env.SECRET_KEY).toString();
        const result = await this.databaseConexion.query(query, [names, lastNames, email, encryptedPassword]);
        return result;
    }

    //*Actualizar todos los campos de usuario 
    async updateFullUser(params: NewUserData, id: string) {

        const query = "UPDATE users SET names = ?, lastNames = ?, email = ?, password = ? WHERE id = ?";
        const { names, lastNames, email, password } = params;
        const encryptedPassword = AES.encrypt(password, process.env.SECRET_KEY).toString();
        const result = await this.databaseConexion.query(query, [names, lastNames, email, encryptedPassword, id]);
        return result;
    }

    //*Actualizar por partes al usuario
    async updatePartialUser(params: Partial<NewUserData>, id: string) {
        const { names, lastNames, email, password } = params;
        let consulta = "UPDATE users SET ";
        const array = [];

        if (names) {
            consulta += "names = ?, ";
            array.push(names);
        }

        if (lastNames) {
            consulta += "lastNames = ?, ";
            array.push(lastNames);
        }

        if (email) {
            consulta += "email = ?, ";
            array.push(email);
        }

        if (password) {
            const encryptedPassword = AES.encrypt(password, process.env.SECRET_KEY).toString();
            consulta += "password = ?, ";
            array.push(encryptedPassword);
        }

        consulta = consulta.slice(0, -2) + " WHERE id = ?";
        array.push(id);

        const result = await this.databaseConexion.query(consulta, array);
        return result;
    }

    //*Eliminar usuario
    async deleteUser(id: string) {
        const query = "DELETE FROM users WHERE id = " + id;
        const result = await this.databaseConexion.query(query);
        return result
    }
}

//*UTILS Computer
export class ComputersUtils {

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

    //*Consulta en la base de datos
    getDataFromDatabase(data: any): ComputerData {
        return {
            id_computer: data.id_computer,
            id_unit: data.id_unit,
            device_type: data.device_type,
            brand: data.brand,
            model: data.model,
            serial_number: data.serial_number,
            operating_system: data.operating_system,
            memory_capacity: data.memory_capacity,
            disk_capacity: data.disk_capacity,
            architecture: data.architecture,
            processor_band: data.processor_band,
            processor_model: data.processor_model,
            processor_speed: data.processor_speed,
            inventory_number: data.inventory_number,
            internet: data.internet,
            connection_type: data.connection_type,
            input_type: data.input_type,
            location: data.location,
            comments: data.comments,
        }
    }

    //*Obtener todas las computers por la base de datos
    async getComputers(): Promise<any> {
        const query = "SELECT * FROM computers";
        const [rows] = await this.databaseConexion.query(query);
        return rows
    }

    //*Computers existentes
    async exitsComputer(serial_number: string): Promise<boolean> {
        const query = "SELECT * FROM computers WHERE serial_number = ?";
        const [rows] = await this.databaseConexion.query(query, [serial_number]);
        return Array.isArray(rows) && rows.length > 0;
    }

    //*Consultar existencia de computer por serial number
    async getComputerBySerialNumber(serial_number: string): Promise<boolean | ComputerData> {
        const query = "SELECT * FROM computers WHERE serial_number = ?";
        const [rows] = await this.databaseConexion.query(query, [serial_number]);
        if (Array.isArray(rows) && rows.length > 0) {
            const computer = rows[0];
            return this.getDataFromDatabase(computer);
        }
        return false;
    }

    //*Inserción de una nueva computer
    async newComputer(params: NewComputerData) {

        const query = "INSERT INTO computers (id_unit, device_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_band, processor_model, processor_speed, inventory_number, internet, connection_type, input_type, location, comments) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        const { id_unit, device_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_band, processor_model, processor_speed, inventory_number, internet, connection_type, input_type, location, comments } = params;
        const existComputer = await this.exitsComputer(serial_number);
        if (existComputer) {
            return Promise.reject("computer already exists");
        }
        const result = await this.databaseConexion.query(query, [id_unit, device_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_band, processor_model, processor_speed, inventory_number, internet, connection_type, input_type, location, comments]);
        return result;
    }
    //*Actualizar todos los campos de la computer
    async updateFullComputer(params: NewComputerData, id_computer: string) {

        const query = "UPDATE computers SET device_type = ?, brand = ?, model = ?, serial_number = ?, operating_system = ?, memory_capacity = ?, disk_capacity = ?, architecture = ?, processor_band = ?, processor_model = ?, processor_speed = ?, inventory_number = ?, internet = ?, connection_type = ?, input_type = ?, location= ?, comments = ? WHERE id_computer = ?";
        const { device_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_band, processor_model, processor_speed, inventory_number, internet, connection_type, input_type, location, comments } = params;
        const result = await this.databaseConexion.query(query, [device_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_band, processor_model, processor_speed, inventory_number, internet, connection_type, input_type, location, comments, id_computer]);
        return result;
    }
    //*Actualizar por partes a la computer
    async updatePartialComputer(params: Partial<NewComputerData>, id_computer: string) {
        const { id_unit, device_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_band, processor_model, processor_speed, inventory_number, internet, connection_type, input_type, location, comments } = params;
        let consulta = "UPDATE computers SET ";
        const array = [];

        if (id_unit) {
            consulta += "id_unit = ?, ";
            array.push(id_unit);
        }

        if (device_type) {
            consulta += "device_type = ?, ";
            array.push(device_type);
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

        if (processor_band) {
            consulta += "processor_band = ?, ";
            array.push(processor_band);
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

        if (input_type) {
            consulta += "input_type = ?, ";
            array.push(input_type);
        }

        if (location) {
            consulta += "location = ?, ";
            array.push(location);
        }

        if (comments) {
            consulta += "comments = ?, ";
            array.push(comments);
        }

        consulta = consulta.slice(0, -2) + " WHERE id_computer = ?";
        array.push(id_computer);

        const result = await this.databaseConexion.query(consulta, array);
        return result;
    }

    //*Eliminar computer
    async deleteComputer(id_computer: string) {
        const query = "DELETE FROM computers WHERE id_computer = " + id_computer;
        const result = await this.databaseConexion.query(query);
        return result
    }
}

//*UTILS Hospital
export class HospitalsUtils {

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

    //*Consulta en la base de datos
    getDataFromDatabase(data: any): HospitalData {
        return {
            id_unit: data.id_unit,
            name: data.name,
            leve_attention: data.leve_attention,
            internet: data.internet,
            authorized_office: data.authorized_office,
            NIS_office: data.NIS_office,
            administrator_name: data.administrator_name,
            telephone_number: data.telephone_number,
            sinba: data.sinba,
            pharmacy: data.pharmacy
        }
    }

    //*Obtener todas los Hospitales por la base de datos
    async getHospitals(): Promise<any> {
        const query = "SELECT * FROM hospitals";
        const [rows] = await this.databaseConexion.query(query);
        return rows
    }

    //*Consultar existencia de computer por serial number
    async getHospitalByName(name: string): Promise<boolean | HospitalData> {
        const query = "SELECT * FROM hospitals WHERE name = ?";
        const [rows] = await this.databaseConexion.query(query, [name]);
        if (Array.isArray(rows) && rows.length > 0) {
            const hospital = rows[0];
            return this.getDataFromDatabase(hospital);
        }
        return false;
    }

    //*Hospitales existentes
    async exitsHospital(name: string): Promise<boolean> {
        const query = "SELECT * FROM hospitals WHERE name = ?";
        const [rows] = await this.databaseConexion.query(query, [name]);
        return Array.isArray(rows) && rows.length > 0;
    }

    //*Inserción de una nuevo Hospital
    async newHospital(params: NewHospitalData) {

        const query = "INSERT INTO hospitals (name, leve_attention, internet, authorized_office, NIS_office, administrator_name, telephone_number, sinba, pharmacy) VALUES (?,?,?,?,?,?,?,?,?)";
        const { name, leve_attention, internet, authorized_office, NIS_office, administrator_name, telephone_number, sinba, pharmacy } = params;
        const existHospital = await this.exitsHospital(name);
        if (existHospital) {
            return Promise.reject("Hospital already exists");
        }
        const result = await this.databaseConexion.query(query, [name, leve_attention, internet, authorized_office, NIS_office, administrator_name, telephone_number, sinba, pharmacy]);
        return result;
    }

    //*Actualizar todos los campos del Hospital
    async updateFullHospital(params: NewHospitalData, id_unit: string) {

        const query = "UPDATE hospitals SET name = ?, leve_attention = ?, internet = ?, authorized_office = ?, NIS_office = ?, administrator_name = ?, telephone_number = ?, sinba = ?, pharmacy = ? WHERE id_unit = ?";
        const { name, leve_attention, internet, authorized_office, NIS_office, administrator_name, telephone_number, sinba, pharmacy } = params;
        const result = await this.databaseConexion.query(query, [name, leve_attention, internet, authorized_office, NIS_office, administrator_name, telephone_number, sinba, pharmacy, id_unit]);
        return result;
    }

    //*Actualizar por partes el Hospital
    async updatePartialHospital(params: Partial<NewHospitalData>, id_unit: string) {
        const { name, leve_attention, internet, authorized_office, NIS_office, administrator_name, telephone_number, sinba, pharmacy } = params;
        let consulta = "UPDATE hospitals SET ";
        const array = [];

        if (name) {
            consulta += "name = ?, ";
            array.push(name);
        }

        if (leve_attention) {
            consulta += "leve_attention = ?, ";
            array.push(leve_attention);
        }

        if (internet) {
            consulta += "internet = ?, ";
            array.push(internet);
        }

        if (authorized_office) {
            consulta += "authorized_office = ?, ";
            array.push(authorized_office);
        }

        if (NIS_office) {
            consulta += "NIS_office = ?, ";
            array.push(NIS_office);
        }

        if (administrator_name) {
            consulta += "administrator_name = ?, ";
            array.push(administrator_name);
        }

        if (telephone_number) {
            consulta += "telephone_number = ?, ";
            array.push(telephone_number);
        }
        if (sinba) {
            consulta += "sinba = ?, ";
            array.push(sinba);
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

    //*Eliminar Hospital
    async deleteHospital(id_unit: string) {
        const query = "DELETE FROM hospitals WHERE id_unit = " + id_unit;
        const result = await this.databaseConexion.query(query);
        return result
    }
}
