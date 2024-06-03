import { Connection } from "mysql2/promise";

//*Datos completos del Usuario
export type UserData = {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
}

//*Datos almacenados del Usuario
export interface NewUserData {
    nombre?: string;
    apellido: string;
    correo: string;
    password: string;
}

//*Datos para un nuevo Usuario
export interface NewUser {
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
}

//*Conexión a la a base de datos y Gets de las funciones 
export interface UsersUtilsInterface {
    databaseConexion: Connection;

    getInstance(db: Connection);
    getUsers();
    getUserBycorreo(correo: string): Promise<boolean | UserData>;
    getUserById(id_usuario: string): Promise<boolean | UserData>;
    newUser(params: NewUserData);
    updateFullUser(params: NewUserData, id_usuario);
    updatePartialUser(params: Partial<NewUserData>, id_usuario: string);
    deleteUser(id_usuario: string);
}