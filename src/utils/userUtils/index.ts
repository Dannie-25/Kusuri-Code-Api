import { Connection } from "mysql2/promise";
import AES = require("crypto-js/aes");
import { NewUserData, UserData } from "../../interfaces/userInterface";
import { SECRET_KEY } from "../configs/configs";

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
            id_usuario: data.id_usuario,
            nombre: data.nombre,
            apellido: data.apellido,
            correo: data.correo,
            password: data.password,
        }
    }

    //*Comprobacion de Usuarios ya existentes
    async exitsUser(correo: string): Promise<boolean> {
        const query = "SELECT * FROM usuarios WHERE correo = ?";
        const [rows] = await this.databaseConexion.query(query, [correo]);
        return Array.isArray(rows) && rows.length > 0;
    }

    //*Obtiene todos los Usuarios de la Base de Datos
    async getUsers(): Promise<any> {
        const query = "SELECT * FROM usuarios";
        const [rows] = await this.databaseConexion.query(query);
        return rows
    }

    //*Obtiene Usuario por id
    async getUserById(id_usuario: string): Promise<boolean | UserData> {
        const query = "SELECT * FROM usuarios WHERE id_usuario = ?";
        const [rows] = await this.databaseConexion.query(query, [id_usuario]);
        if (Array.isArray(rows) && rows.length > 0) {
            const user = rows[0];
            return this.getDataFromDatabase(user);
        }
        return false;
    }

    //*Obtiene Usuario por correo
    async getUserBycorreo(correo: string): Promise<boolean | UserData> {
        const query = "SELECT * FROM usuarios WHERE correo = ?";
        const [rows] = await this.databaseConexion.query(query, [correo]);
        if (Array.isArray(rows) && rows.length > 0) {
            const user = rows[0];
            return this.getDataFromDatabase(user);
        }
        return false;
    }

    //*Inserción de nuevo Usuario
    async newUser(params: NewUserData) {

        const query = "INSERT INTO usuarios (nombre, apellido, correo, password) VALUES (?, ?, ?, ?)";
        const { nombre, apellido, correo, password } = params;
        const existUser = await this.exitsUser(correo);
        if (existUser) {
            return Promise.reject("User already exists");
        }
        const encryptedpassword = AES.encrypt(password, SECRET_KEY).toString();
        const result = await this.databaseConexion.query(query, [nombre, apellido, correo, encryptedpassword]);
        return result;
    }

    //*Actualiza todos los datos del Usuario 
    async updateFullUser(params: NewUserData, id_usuario: string) {

        const query = "UPDATE usuarios SET nombre = ?, apellido = ?, correo = ?, password = ? WHERE id_usuario = ?";
        const { nombre, apellido, correo, password } = params;
        const encryptedpassword = AES.encrypt(password, SECRET_KEY).toString();
        const result = await this.databaseConexion.query(query, [nombre, apellido, correo, encryptedpassword, id_usuario]);
        return result;
    }

    //*Actualiza algun dato especifico del Usuario
    async updatePartialUser(params: Partial<NewUserData>, id_usuario: string) {
        const { nombre, apellido, correo, password } = params;
        let consulta = "UPDATE usuarios SET ";
        const array = [];

        if (nombre) {
            consulta += "nombre = ?, ";
            array.push(nombre);
        }

        if (apellido) {
            consulta += "apellido = ?, ";
            array.push(apellido);
        }

        if (correo) {
            consulta += "correo = ?, ";
            array.push(correo);
        }

        if (password) {
            const encryptedpassword = AES.encrypt(password, SECRET_KEY).toString();
            consulta += "password = ?, ";
            array.push(encryptedpassword);
        }

        consulta = consulta.slice(0, -2) + " WHERE id_usuario = ?";
        array.push(id_usuario);

        const result = await this.databaseConexion.query(consulta, array);
        return result;
    }

    //*Elimina un Usuario por su id
    async deleteUser(id_usuario: string) {
        const query = "DELETE FROM usuarios WHERE id_usuario = " + id_usuario;
        const result = await this.databaseConexion.query(query);
        return result
    }
}
