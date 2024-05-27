import { Connection } from "mysql2/promise";

//*Datos del Hospital
export type HospitalData = {
    id_unit: number;
    unit_clue: string;
    unit_name: string;
    attention_level: string;
    internet: boolean;
    enabled_offices: boolean;
    SINERHIAS_office: boolean;
    administrator_name: string;
    phone_number: number;
    simba_use: boolean;
    pharmacy: boolean;
}

//*Datos a Editar para el nuevo hospital
export interface NewHospitalData {
    unit_clue?: string;
    unit_name: string;
    attention_level: string;
    internet: boolean;
    enabled_offices: boolean;
    SINERHIAS_office: boolean;
    administrator_name: string;
    phone_number: number;
    simba_use: boolean;
    pharmacy: boolean;
}

//*Datos para un nuevo hospital
export interface NewHospital{
    unit_clue: string;
    unit_name: string;
    attention_level: string;
    internet: boolean;
    enabled_offices: boolean;
    SINERHIAS_office: boolean;
    administrator_name: string;
    phone_number: number;
    simba_use: boolean;
    pharmacy: boolean;
}

//*Conexión a la a base de datos y Gets de las funciones 
export interface HospitalsUtilsInterface {
    databaseConexion: Connection;

    getInstance(db: Connection);
    getHospitals();
    getHospitalById(id_unit: string): Promise<boolean | HospitalData>;
    getHospitalByName(unit_name: string): Promise<boolean | HospitalData>;
    getHospitalByUnitClue(unit_clue: string): Promise<boolean | HospitalData>;
    newHospital(params: NewHospitalData);
    updateFullHospital(params: NewHospitalData, id_unit);
    updatePartialHospital(params: Partial<NewHospitalData>, id_unit: string);
    deleteHospital(id_unit:String);
    createHospitalQR(id_unit: string);
}