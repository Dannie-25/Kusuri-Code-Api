import { Connection } from "mysql2/promise";

//*Datos de la computer
export type ComputerData = {
    id_computer: number;
    id_unit: number;
    device_type: string;
    brand: string;
    model: string;
    serial_number: string;
    operating_system: string;
    memory_capacity: string;
    disk_capacity: string;
    architecture: string;
    processor_band:string;
    processor_model: string;
    processor_speed: string;
    inventory_number: string;
    internet: boolean;
    connection_type: string;
    input_type: string;
    location: string;
    comments: string;
}


export interface NewComputerData {
    id_unit?: number;
    device_type: string;
    brand: string;
    model: string;
    serial_number: string;
    operating_system: string;
    memory_capacity: string;
    disk_capacity: string;
    architecture: string;
    processor_band:string;
    processor_model: string;
    processor_speed: string;
    inventory_number: string;
    internet: boolean;
    connection_type: string;
    input_type: string;
    location: string;
    comments: string;
}

//*Datos para un nuevo computer
export interface NewComputer{
    id_unit: number;
    device_type: string;
    brand: string;
    model: string;
    serial_number: string;
    operating_system: string;
    memory_capacity: string;
    disk_capacity: string;
    architecture: string;
    processor_band:string;
    processor_model: string;
    processor_speed: string;
    inventory_number: string;
    internet: boolean;
    connection_type: string;
    input_type: string;
    location: string;
    comments: string;
}

//*Conexión a la a base de datos y Gets de las funciones 
export interface ComputersUtilsInterface {
    databaseConexion: Connection;

    getInstance(db: Connection);
    getComputers();
    getComputerBySerialNumber(serial_number: string): Promise<boolean | ComputerData>;
    getComputerById(id_computer: string): Promise<boolean | ComputerData>;
    newComputer(params: NewComputerData);
    updateFullComputer(params: NewComputerData, id_computer);
    updatePartialComputer(params: Partial<NewComputerData>, id_computer: string);
    deleteComputer(id_computer:String);
}