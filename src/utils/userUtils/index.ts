import { Connection } from "mysql2/promise";
import AES = require("crypto-js/aes");
import { NewUserData, UserData } from "../../interfaces/userInterface";
import 'dotenv/config';
import QRCode from 'qrcode'

//*UTILS de Usuarios
export class UsersUtils {

    //*Conexión a la Base de Datos
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

    //*Transforma los resultados de una consulta a la Base de Datos en un objeto 
    getDataFromDatabase(data: any): UserData {
        return {
            id_user: data.id_user,
            names: data.names,
            lastNames: data.lastNames,
            email: data.email,
            password: data.password,
        }
    }

    //*Comprobacion de Usuarios ya existentes
    async exitsUser(email: string): Promise<boolean> {
        const query = "SELECT * FROM users WHERE email = ?";
        const [rows] = await this.databaseConexion.query(query, [email]);
        return Array.isArray(rows) && rows.length > 0;
    }

    //*Obtiene todos los Usuarios de la Base de Datos
    async getUsers(): Promise<any> {
        const query = "SELECT * FROM users";
        const [rows] = await this.databaseConexion.query(query);
        return rows
    }

    //*Obtiene Usuario por id
    async getUserById(id_user: string): Promise<boolean | UserData> {
        const query = "SELECT * FROM users WHERE id_user = ?";
        const [rows] = await this.databaseConexion.query(query, [id_user]);
        if (Array.isArray(rows) && rows.length > 0) {
            const user = rows[0];
            return this.getDataFromDatabase(user);
        }
        return false;
    }

    //*Obtiene Usuario por email
    async getUserByEmail(email: string): Promise<boolean | UserData> {
        const query = "SELECT * FROM users WHERE email = ?";
        const [rows] = await this.databaseConexion.query(query, [email]);
        if (Array.isArray(rows) && rows.length > 0) {
            const user = rows[0];
            return this.getDataFromDatabase(user);
        }
        return false;
    }

    //*Inserción de nuevo Usuario
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

    //*Actualiza todos los datos del Usuario 
    async updateFullUser(params: NewUserData, id_user: string) {

        const query = "UPDATE users SET names = ?, lastNames = ?, email = ?, password = ? WHERE id_user = ?";
        const { names, lastNames, email, password } = params;
        const encryptedPassword = AES.encrypt(password, process.env.SECRET_KEY).toString();
        const result = await this.databaseConexion.query(query, [names, lastNames, email, encryptedPassword, id_user]);
        return result;
    }

    //*Actualiza algun dato especifico del Usuario
    async updatePartialUser(params: Partial<NewUserData>, id_user: string) {
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

        consulta = consulta.slice(0, -2) + " WHERE id_user = ?";
        array.push(id_user);

        const result = await this.databaseConexion.query(consulta, array);
        return result;
    }

    //*Elimina un Usuario por su id
    async deleteUser(id_user: string) {
        const query = "DELETE FROM users WHERE id_user = " + id_user;
        const result = await this.databaseConexion.query(query);
        return result
    }
}
