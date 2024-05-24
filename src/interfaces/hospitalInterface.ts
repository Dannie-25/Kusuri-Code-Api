import { Connection } from "mysql2/promise";

//*Datos del Hospital
export type HospitalData = {
    id_unit: number;
    clue_unit: string;
    name: string;
    leve_attention: string;
    internet: boolean;
    authorized_office: boolean;
    NIS_office: boolean;
    administrator_name: string;
    telephone_number: number;
    sinba: boolean;
    pharmacy: boolean;
}

//*Datos a Editar para el nuevo hospital
export interface NewHospitalData {
    clue_unit?: string;
    name: string;
    leve_attention: string;
    internet: boolean;
    authorized_office: boolean;
    NIS_office: boolean;
    administrator_name: string;
    telephone_number: number;
    sinba: boolean;
    pharmacy: boolean;
}

//*Datos para un nuevo hospital
export interface NewHospital{
    clue_unit: string;
    name: string;
    leve_attention: string;
    internet: boolean;
    authorized_office: boolean;
    NIS_office: boolean;
    administrator_name: string;
    telephone_number: number;
    sinba: boolean;
    pharmacy: boolean;
}

//*Conexión a la a base de datos y Gets de las funciones 
export interface HospitalsUtilsInterface {
    databaseConexion: Connection;

    getInstance(db: Connection);
    getHospitals();
    getHospitalByName(name: string): Promise<boolean | HospitalData>;
    getHospitalById(id_unit: string): Promise<boolean | HospitalData>;
    newHospital(params: NewHospitalData);
    updateFullHospital(params: NewHospitalData, id_unit);
    updatePartialHospital(params: Partial<NewHospitalData>, id_unit: string);
    deleteHospital(id_unit:String);
}