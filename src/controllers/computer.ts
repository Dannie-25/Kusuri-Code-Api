import { ComputerData, NewComputer } from "../interfaces/computerInterface";
import { getComputersUtils } from "../services/serviceLocator/composer";
import { ComputersUtils } from "../utils/computerUtils";

//*Obtiene el numero de serie del Equipo para su validación
async function getComputer(numero_serie: string): Promise<ComputerData | null> {
    const client = getComputersUtils();
    try {
        return await client.getComputers();
    } catch (error) {
        console.error(`Error al Obtener Equipo de Computo con Número de Serie ${numero_serie}:`, error);
        return null;
    }
}

//*Obtiene todos los Equipos registrados
async function getComputers(): Promise<ComputerData[]> {
    const client = getComputersUtils();
    try {
        return await client.getComputers();
    }
    catch (error) {
        console.error('Error al Obtener los Equipos de Computo:', error)
        return [];
    }
}

//*Obtiene el Equipo por Id
async function getComputerById(id_equipo: string): Promise<ComputerData | boolean> {
    const client = getComputersUtils();
    try {
        return await client.getComputerById(id_equipo);
    } catch (error) {
        console.error('Error al Obtener el ID del Equipo:', error);
        return false;
    }
}

//*Obtiene el Equipo por la Id Unit
async function getComputerByIdUnit(id_unidad: string): Promise<ComputerData[] | boolean> {
    const client = getComputersUtils();
    try {
        return await client.getComputerByIdUnit(id_unidad);
    } catch (error) {
        console.error(`Error al Obtener los Equipos de Computo por el ID ${id_unidad}:`, error);
        return false;
    }
}

//*Obtiene el Equipo por el nombre
async function getComputerByName(marca: string): Promise<ComputerData[] | boolean> {
    const client = getComputersUtils();
    try {
        return await client.getComputerByName(marca);
    } catch (error) {
        console.error(`Error al Obtener ${marca}:`, error);
        return false;
    }
}

//*Agregar nuevos Equipos
async function newComputer(params: NewComputer): Promise<boolean> {
    const client = getComputersUtils();
    try {
        return await client.newComputer(params);
    } catch (error) {
        console.error('Error al Agregar un Nuevo Equipo de Computo:', error);
        return false;
    }
}

//*Actualiza todo los datos del Equipo
async function updateFullComputer(params: NewComputer, id_equipo: string): Promise<boolean> {
    const client = getComputersUtils();
    try {
        return await client.updateFullComputer(params, id_equipo);
    } catch (error) {
        console.error(`Error al Actualizar los Datos del Equipo de Computo con ID ${id_equipo}:`, error);
        return false;
    }
}

//*Actualizar algun dato en especifico del Equipo
async function updatePartialComputer(params: Partial<NewComputer>, id_equipo: string): Promise<boolean> {
    const client = getComputersUtils();
    try {
        return await client.updatePartialComputer(params, id_equipo);
    } catch (error) {
        console.error(`Error al Actualizar el Dato del Equipo de COmputo con ID ${id_equipo}:`, error);
        return false;
    }
}

//*Eliminar el Equipo por id
async function deleteComputer(id_equipo: string): Promise<boolean> {
    const client = getComputersUtils();
    try {
        return await client.deleteComputer(id_equipo);
    } catch (error) {
        console.error('Error al Eliminar el Equipo de Computo:', error);
        return false;
    }
}

//*Convierte los datos del Equipo a QR
async function createComputerQR(id_equipo: string): Promise<string> {
    const client = getComputersUtils();
    try {
        const computer = await client.getComputerById(id_equipo);
        if (!computer || typeof computer === 'boolean') {
            throw new Error('Equipo No Encontrado');
        }

        const formattedData = `
        INFORMACIÓN
        Identificación del equipo: ${computer.id_equipo}
        Identificación de la unidad: ${computer.id_unidad}
        Tipo de equipo: ${computer.tipo_equipo}
        Marca: ${computer.marca}
        Modelo: ${computer.modelo}
        Número de serie: ${computer.numero_serie}
        Sistema operativo: ${computer.sistema_operativo}
        Capacidad de memoria: ${computer.capacidad_memoria}
        Capacidad del disco: ${computer.capacidad_disco}
        Arquitectura: ${computer.arquitectura}
        Marca del procesador: ${computer.procesador_marca}
        Modelo del procesador: ${computer.procesador_modelo}
        Velocidad del procesador: ${computer.procesador_velocidad}
        Número de inventario: ${computer.numero_inventario}
        Conexión a internet: ${computer.internet}
        Tipo de conexión: ${computer.tipo_conexion}
        Tipo de entrada: ${computer.tipo_ingreso}
        Ubicación: ${computer.ubicacion}
        Comentarios: ${computer.comentarios}
        `;
        return client.createComputerQR(formattedData.trim());
    } catch (error) {
        console.error(`Error al Generar el QR del Equipo de Computo con ID ${id_equipo}:`, error);
        throw error;
    }

}

export default {
    getComputer,
    getComputers,
    getComputerById,
    getComputerByIdUnit,
    getComputerByName,
    newComputer,
    updateFullComputer,
    updatePartialComputer,
    deleteComputer,
    createComputerQR
}