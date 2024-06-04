import { Connection } from "mysql2/promise";

//*Datos completo del Equipo
export type ComputerData = {
    id_equipo: number;
    id_unidad: number;
    tipo_equipo: string;
    marca: string;
    modelo: string;
    numero_serie: string;
    sistema_operativo: string;
    capacidad_memoria: string;
    capacidad_disco: string;
    arquitectura: string;
    procesador_marca: string;
    procesador_modelo: string;
    procesador_velocidad: string;
    numero_inventario: string;
    internet: boolean;
    tipo_conexion: string;
    tipo_ingreso: string;
    ubicacion: string;
    comentarios: string;
}

//*Datos almacenados del Equipo
export interface NewComputerData {
    id_unidad?: number;
    tipo_equipo: string;
    marca: string;
    modelo: string;
    numero_serie: string;
    sistema_operativo: string;
    capacidad_memoria: string;
    capacidad_disco: string;
    arquitectura: string;
    procesador_marca: string;
    procesador_modelo: string;
    procesador_velocidad: string;
    numero_inventario: string;
    internet: boolean;
    tipo_conexion: string;
    tipo_ingreso: string;
    ubicacion: string;
    comentarios: string;
}

//*Datos para un nuevo Equipo
export interface NewComputer {
    id_unidad: number;
    tipo_equipo: string;
    marca: string;
    modelo: string;
    numero_serie: string;
    sistema_operativo: string;
    capacidad_memoria: string;
    capacidad_disco: string;
    arquitectura: string;
    procesador_marca: string;
    procesador_modelo: string;
    procesador_velocidad: string;
    numero_inventario: string;
    internet: boolean;
    tipo_conexion: string;
    tipo_ingreso: string;
    ubicacion: string;
    comentarios: string;
}

//*Conexión a la a base de datos y Gets de las funciones 
export interface ComputersUtilsInterface {
    databaseConexion: Connection;

    getInstance(db: Connection);
    getComputers();
    getComputerById(id_equipo: string): Promise<boolean | ComputerData>;
    getComputerByIdUnit(id_unidad: string): Promise<boolean | ComputerData[]>;
    getComputerByName(marca: string): Promise<boolean | ComputerData[]>;
    newComputer(params: NewComputerData);
    updateFullComputer(params: NewComputerData, id_equipo);
    updatePartialComputer(params: Partial<NewComputerData>, id_equipo: string);
    deleteComputer(id_equipo: string);
    createComputerQR(id_equipo: string);
}