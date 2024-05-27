import { NewComputer } from "../interfaces/computerInterface";
import { getComputersUtils } from "../services/serviceLocator/composer";
//import { ComputersUtils } from "../utils/userUtils";
import { ComputersUtils } from "../utils/computerUtils";

//*Obtener el numero de serie de la computadora para validación
function getComputer(serial_number: string) {

}

//*Obtener todas las computer
async function getComputers() {
    const client = getComputersUtils();
    return client.getComputers();
}

//*Obtiene el equipo por ID
function getComputerById(id_equipment: string) {
    const client = getComputersUtils();
    return client.getComputerById(id_equipment);
}

//*Obtiene a la unidad por la clave de unidad
function getComputerByIdUnit(id_unit: string) {
    const client = getComputersUtils();
    return client.getComputerByIdUnit(id_unit);
}

//*Obtiene a la unidad por el nombre
function getComputerByName(equipment_type: string) {
    const client = getComputersUtils();
    return client.getComputerByName(equipment_type);
}

//*Agregar nuevas computer
function newComputer(params: NewComputer) {
    const client = getComputersUtils();
    return client.newComputer(params);
}

//*Actualizar todo los datos del computer
function updateFullComputer(params: NewComputer, id_equipment: string) {
    const client = getComputersUtils();
    return client.updateFullComputer(params, id_equipment);
}

//*Actualizar solo algunos datos de la computadora
function updatePartialComputer(params: Partial<NewComputer>, id_equipment: string) {
    const client = getComputersUtils();
    return client.updatePartialComputer(params, id_equipment);
}

//*Eliminar las computadoras
function deleteComputer(id_equipment: string) {
    const client = getComputersUtils();
    return client.deleteComputer(id_equipment);

}

//!Convierte los datos del user a QR
async function createComputerQR(id_unit: string) {
    const client = getComputersUtils();
    const computer = await client.getComputerById(id_unit);

    if (!computer || typeof computer === 'boolean') {
        throw new Error('Equipo no encontrado');
    }

    const formattedData = `
    Información:
    id_equipment: ${computer.id_equipment}
    id_unit: ${computer.id_unit}
    equipment_type: ${computer.equipment_type}
    brand: ${computer.brand}
    model: ${computer.model}
    serial_number: ${computer.serial_number}
    operating_system: ${computer.operating_system}
    memory_capacity: ${computer.memory_capacity}
    disk_capacity: ${computer.disk_capacity}
    architecture: ${computer.architecture}
    processor_brand: ${computer.processor_brand}
    processor_model: ${computer.processor_model}
    processor_speed: ${computer.processor_speed}
    inventory_number: ${computer.inventory_number}
    internet: ${computer.internet}
    connection_type: ${computer.connection_type}
    entry_type: ${computer.entry_type}
    location: ${computer.location}
    comments: ${computer.comments}
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