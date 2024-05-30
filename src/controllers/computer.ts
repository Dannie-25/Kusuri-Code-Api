import { ComputerData, NewComputer } from "../interfaces/computerInterface";
import { getComputersUtils } from "../services/serviceLocator/composer";
import { ComputersUtils } from "../utils/computerUtils";

//*Obtiene el numero de serie del Equipo para su validación
async function getComputer(serial_number: string): Promise<ComputerData | null> {
    const client = getComputersUtils();
    try {
        return await client.getComputers();
    } catch (error) {
        console.error(`Error al Obtener Equipo de Computo con Número de Serie ${serial_number}:`, error);
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
async function getComputerById(id_equipment: string): Promise<ComputerData | boolean> {
    const client = getComputersUtils();
    try {
        return await client.getComputerById(id_equipment);
    } catch (error) {
        console.error('Error al Obtener el ID del Equipo:', error);
        return false;
    }
}

//*Obtiene el Equipo por la Id Unit
async function getComputerByIdUnit(id_unit: string): Promise<ComputerData[] | boolean> {
    const client = getComputersUtils();
    try {
        return await client.getComputerByIdUnit(id_unit);
    } catch (error) {
        console.error(`Error al Obtener los Equipos de Computo por el ID ${id_unit}:`, error);
    }
}

//*Obtiene el Equipo por el nombre
async function getComputerByName(equipment_type: string): Promise<ComputerData | boolean> {
    const client = getComputersUtils();
    try {
        return await client.getComputerByName(equipment_type);
    } catch (error) {
        console.error(`Error al Obtener ${equipment_type}:`, error);
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
async function updateFullComputer(params: NewComputer, id_equipment: string): Promise<boolean> {
    const client = getComputersUtils();
    try {
        return await client.updateFullComputer(params, id_equipment);
    } catch (error) {
        console.error(`Error al Actualizar los Datos del Equipo de Computo con ID ${id_equipment}:`, error);
        return false;
    }
}

//*Actualizar algun dato en especifico del Equipo
async function updatePartialComputer(params: Partial<NewComputer>, id_equipment: string): Promise<boolean> {
    const client = getComputersUtils();
    try {
        return await client.updatePartialComputer(params, id_equipment);
    } catch (error) {
        console.error(`Error al Actualizar el Dato del Equipo de COmputo con ID ${id_equipment}:`, error);
        return false;
    }
}

//*Eliminar el Equipo por id
async function deleteComputer(id_equipment: string): Promise<boolean> {
    const client = getComputersUtils();
    try {
        return await client.deleteComputer(id_equipment);
    } catch (error) {
        console.error('Error al Eliminar el Equipo de Computo:', error);
        return false;
    }
}

//*Convierte los datos del Equipo a QR
async function createComputerQR(id_equipment: string): Promise<string> {
    const client = getComputersUtils();
    try {
        const computer = await client.getComputerById(id_equipment);
        if (!computer || typeof computer === 'boolean') {
            throw new Error('Equipo No Encontrado');
        }

        const formattedData = `
        INFORMACIÓN
        Identificación del equipo: ${computer.id_equipment}
        Identificación de la unidad: ${computer.id_unit}
        Tipo de equipo: ${computer.equipment_type}
        Marca: ${computer.brand}
        Modelo: ${computer.model}
        Número de serie: ${computer.serial_number}
        Sistema operativo: ${computer.operating_system}
        Capacidad de memoria: ${computer.memory_capacity}
        Capacidad del disco: ${computer.disk_capacity}
        Arquitectura: ${computer.architecture}
        Marca del procesador: ${computer.processor_brand}
        Modelo del procesador: ${computer.processor_model}
        Velocidad del procesador: ${computer.processor_speed}
        Número de inventario: ${computer.inventory_number}
        Conexión a internet: ${computer.internet}
        Tipo de conexión: ${computer.connection_type}
        Tipo de entrada: ${computer.entry_type}
        Ubicación: ${computer.location}
        Comentarios: ${computer.comments}
        `;
        return client.createComputerQR(formattedData.trim());
    } catch (error) {
        console.error(`Error al Generar el QR del Equipo de Computo con ID ${id_equipment}:`, error);
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