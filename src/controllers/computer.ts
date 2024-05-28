import { NewComputer } from "../interfaces/computerInterface";
import { getComputersUtils } from "../services/serviceLocator/composer";
import { ComputersUtils } from "../utils/computerUtils";

//*Obtiene el numero de serie del Equipo para su validación
function getComputer(serial_number: string) {

}

//*Obtiene todos los Equipos registrados
async function getComputers() {
    const client = getComputersUtils();
    return client.getComputers();
}

//*Obtiene el Equipo por Id
function getComputerById(id_equipment: string) {
    const client = getComputersUtils();
    return client.getComputerById(id_equipment);
}

//*Obtiene el Equipo por la Id Unit
function getComputerByIdUnit(id_unit: string) {
    const client = getComputersUtils();
    return client.getComputerByIdUnit(id_unit);
}

//*Obtiene el Equipo por el nombre
function getComputerByName(equipment_type: string) {
    const client = getComputersUtils();
    return client.getComputerByName(equipment_type);
}

//*Agregar nuevos Equipos
function newComputer(params: NewComputer) {
    const client = getComputersUtils();
    return client.newComputer(params);
}

//*Actualiza todo los datos del Equipo
function updateFullComputer(params: NewComputer, id_equipment: string) {
    const client = getComputersUtils();
    return client.updateFullComputer(params, id_equipment);
}

//*Actualizar algun dato en especifico del Equipo
function updatePartialComputer(params: Partial<NewComputer>, id_equipment: string) {
    const client = getComputersUtils();
    return client.updatePartialComputer(params, id_equipment);
}

//*Eliminar el Equipo por id
function deleteComputer(id_equipment: string) {
    const client = getComputersUtils();
    return client.deleteComputer(id_equipment);

}

//*Convierte los datos del Equipo a QR
async function createComputerQR(id_unit: string) {
    const client = getComputersUtils();
    const computer = await client.getComputerById(id_unit);

    if (!computer || typeof computer === 'boolean') {
        throw new Error('Equipo no encontrado');
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