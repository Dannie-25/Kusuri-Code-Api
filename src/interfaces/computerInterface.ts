import { Connection } from "mysql2/promise";

//*Datos completo del Equipo
export type ComputerData = {
    id_equipment: number;
    id_unit: number;
    equipment_type: string;
    brand: string;
    model: string;
    serial_number: string;
    operating_system: string;
    memory_capacity: string;
    disk_capacity: string;
    architecture: string;
    processor_brand:string;
    processor_model: string;
    processor_speed: string;
    inventory_number: string;
    internet: boolean;
    connection_type: string;
    entry_type: string;
    location: string;
    comments: string;
}

//*Datos almacenados del Equipo
export interface NewComputerData {
    id_unit?: number;
    equipment_type: string;
    brand: string;
    model: string;
    serial_number: string;
    operating_system: string;
    memory_capacity: string;
    disk_capacity: string;
    architecture: string;
    processor_brand:string;
    processor_model: string;
    processor_speed: string;
    inventory_number: string;
    internet: boolean;
    connection_type: string;
    entry_type: string;
    location: string;
    comments: string;
}

//*Datos para un nuevo Equipo
export interface NewComputer{
    id_unit: number;
    equipment_type: string;
    brand: string;
    model: string;
    serial_number: string;
    operating_system: string;
    memory_capacity: string;
    disk_capacity: string;
    architecture: string;
    processor_brand:string;
    processor_model: string;
    processor_speed: string;
    inventory_number: string;
    internet: boolean;
    connection_type: string;
    entry_type: string;
    location: string;
    comments: string;
}

//*Conexión a la a base de datos y Gets de las funciones 
export interface ComputersUtilsInterface {
    databaseConexion: Connection;

    getInstance(db: Connection);
    getComputers();
    getComputerById(id_equipment: string): Promise<boolean | ComputerData>;
    getComputerByIdUnit(id_unit: string): Promise<boolean | ComputerData[]>;
    getComputerByName(equipment_type: string): Promise<boolean | ComputerData>;
    newComputer(params: NewComputerData);
    updateFullComputer(params: NewComputerData, id_equipment);
    updatePartialComputer(params: Partial<NewComputerData>, id_equipment: string);
    deleteComputer(id_equipment: string);
    createComputerQR(id_equipment: string);
    
}