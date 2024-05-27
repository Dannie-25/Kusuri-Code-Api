import { Connection } from "mysql2/promise";
import { DependencyLocator } from "./dependenciesLocator";
import database from "../database";
import { UsersUtils } from "../../utils/userUtils";
import { UsersUtilsInterface } from "../../interfaces/userInterface";
import { ComputersUtils } from "../../utils/computerUtils";
import { ComputersUtilsInterface } from "../../interfaces/computerInterface";
import { HospitalsUtils } from "../../utils/hospitalUtils";
import { HospitalsUtilsInterface } from "../../interfaces/hospitalInterface";

export const di = DependencyLocator.getInstance();

//!Esta función evita errores de Typo
const types ={
    database: "database",
    usersUtils: "usersUtils",
    computersUtils: "computersUtils",
    hospitalsUtils: "hospitalsUtils"
}

//*Inyeccion de dependencias 
export async function initial(){
    const db = await database
    di.bindLazySingleton(types.database, () => db)
    di.bindFactory(
        "usersUtils",
        () => new UsersUtils(
            getDatabase()
        )
    ); 
    di.bindFactory(
        "computersUtils",
        () => new ComputersUtils(
            getDatabase()
        )
    ); 
    di.bindFactory(
        "hospitalsUtils",
        () => new HospitalsUtils(
            getDatabase()
        )
    );
}

//*Conexión a Data Base
function getDatabase():Connection{
    return di.get(types.database)
}

//*Usuarios
export function getUsersUtils(): UsersUtilsInterface{
    return di.get(types.usersUtils)
}
//*Computers
export function getComputersUtils(): ComputersUtilsInterface{
    return di.get(types.computersUtils)
}
//*Hospitals
export function getHospitalsUtils(): HospitalsUtilsInterface{
    return di.get(types.hospitalsUtils)
}
