import { Connection } from "mysql2/promise";
import { DependencyLocator } from "./dependenciesLocator";
import database from "../database";
import { UsersUtils } from "../../utils/userUtils";
import { UsersUtilsInterface } from "../../interfaces/userInterface";
import { HospitalsUtils } from "../../utils/hospitalUtils";
import { HospitalsUtilsInterface } from "../../interfaces/hospitalInterface";
import { ComputersUtils } from "../../utils/computerUtils";
import { ComputersUtilsInterface } from "../../interfaces/computerInterface";
import { PrintersUtils } from "../../utils/printerUtils";
import { PrintersUtilsInterface } from "../../interfaces/printerInterface";

export const di = DependencyLocator.getInstance();

//!Evita errores de Typo
const types ={
    database: "database",
    usersUtils: "usersUtils",
    hospitalsUtils: "hospitalsUtils",
    computersUtils: "computersUtils",
    printersUtils: "printersUtils",
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
    di.bindFactory(
        "printersUtils",
        () => new PrintersUtils(
            getDatabase()
        )
    );
}

//*Conexión a la Base de Datos
function getDatabase():Connection{
    return di.get(types.database)
}

//*Utils de Usuarios
export function getUsersUtils(): UsersUtilsInterface{
    return di.get(types.usersUtils)
}

//*Utils de Unidades Medicas
export function getHospitalsUtils(): HospitalsUtilsInterface{
    return di.get(types.hospitalsUtils)
}

//*Utils de Equipos
export function getComputersUtils(): ComputersUtilsInterface{
    return di.get(types.computersUtils)
}

//*Utils de Impresoras
export function getPrintersUtils(): PrintersUtilsInterface{
    return di.get(types.printersUtils)
}
