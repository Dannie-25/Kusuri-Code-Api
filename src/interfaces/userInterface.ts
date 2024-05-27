import { Connection } from "mysql2/promise";

//*Datos completos del Usuario
export type UserData = {
    id_user: number;
    names: string;
    lastNames: string;
    email: string;
    password: string;
}

//*Datos almacenados del Usuario
export interface NewUserData {
    names?: string;
    lastNames: string;
    email: string;
    password: string;
}

//*Datos para un nuevo Usuario
export interface NewUser{
    names: string;
    lastNames: string;
    email: string;
    password: string;
}

//*Conexión a la a base de datos y Gets de las funciones 
export interface UsersUtilsInterface {
    databaseConexion: Connection;
    
    getInstance(db: Connection);
    getUsers();
    getUserByEmail(email: string): Promise<boolean | UserData>;
    getUserById(id_user: string): Promise<boolean | UserData>;
    newUser(params: NewUserData);
    updateFullUser(params: NewUserData, id_user);
    updatePartialUser(params: Partial<NewUserData>, id_user: string);
    deleteUser(id_user:string);
}