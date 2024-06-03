import { Connection } from "mysql2/promise";

//*Datos completos de la Unidad Medica
export type HospitalData = {
    id_unidad: number;
    clue_unidad: string;
    nombre_unidad: string;
    nivel_atencion: string;
    internet: boolean;
    consultorios_habilitados: boolean;
    consultorio_SINERHIAS: boolean;
    nombre_administrador: string;
    numero_telefonico: number;
    uso_simba: boolean;
    farmacia: boolean;
}

//*Datos almacenados de la Unidad Medica
export interface NewHospitalData {
    clue_unidad?: string;
    nombre_unidad: string;
    nivel_atencion: string;
    internet: boolean;
    consultorios_habilitados: boolean;
    consultorio_SINERHIAS: boolean;
    nombre_administrador: string;
    numero_telefonico: number;
    uso_simba: boolean;
    farmacia: boolean;
}

//*Datos para una nueva Unidad Medica
export interface NewHospital {
    clue_unidad: string;
    nombre_unidad: string;
    nivel_atencion: string;
    internet: boolean;
    consultorios_habilitados: boolean;
    consultorio_SINERHIAS: boolean;
    nombre_administrador: string;
    numero_telefonico: number;
    uso_simba: boolean;
    farmacia: boolean;
}

//*Conexión a la a base de datos y Gets de las funciones 
export interface HospitalsUtilsInterface {
    databaseConexion: Connection;

    getInstance(db: Connection);
    getHospitals();
    getHospitalById(id_unidad: string): Promise<boolean | HospitalData>;
    getHospitalByName(nombre_unidad: string): Promise<boolean | HospitalData>;
    getHospitalByUnitClue(clue_unidad: string): Promise<boolean | HospitalData>;
    newHospital(params: NewHospitalData);
    updateFullHospital(params: NewHospitalData, id_unidad);
    updatePartialHospital(params: Partial<NewHospitalData>, id_unidad: string);
    deleteHospital(id_unidad: string);
    createHospitalQR(id_unidad: string);
    getFullById(id_unidad: string);
}