import { NewHospital } from "../interfaces/hospitalInterface";
import { getHospitalsUtils } from "../services/serviceLocator/composer";
import { HospitalsUtils } from "../utils/hospitalUtils";
import { getComputersUtils } from "../services/serviceLocator/composer";
import { getPrintersUtils } from "../services/serviceLocator/composer";

//*Obtiene la clave de la unidad para validación
function getHospital(unit_clue: string) {

}

//*Obtiene todas las Unidades Medicas Registradas
async function getHospitals() {
    const client = getHospitalsUtils();
    return client.getHospitals();
}

//*Obtiene una Unidad Medica por ID
function getHospitalById(id_unit: string) {
    const client = getHospitalsUtils();
    return client.getHospitalById(id_unit);
}

//*Obtiene todos los datos que tiene id_unit
async function getFullById(id_unit: string) {
    try {
        const hospitalData = await getHospitalsUtils().getHospitalById(id_unit);
        const computerData = await getComputersUtils().getComputerByIdUnit(id_unit);
        const printerData = await getPrintersUtils().getPrinterByIdUnit(id_unit);

        if (hospitalData || computerData || printerData) {
            const fullData = {
                Unidad_Medica: hospitalData,
                Equipos_de_Computo: computerData,
                Impresoras: printerData,
            };
            return fullData;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error al obtener datos completos:", error);
        return false;
    }
}

//*Obtiene una Unidad Medica por la clave de Unidad
function getHospitalByUnitClue(unit_clue: string) {
    const client = getHospitalsUtils();
    return client.getHospitalByUnitClue(unit_clue);
}

//*Obtiene una Unidad Medica por el nombre
function getHospitalByName(unit_name: string) {
    const client = getHospitalsUtils();
    return client.getHospitalByName(unit_name);
}

//*Agrega una nueva Unidad Medica
function newHospital(params: NewHospital) {
    const client = getHospitalsUtils();
    return client.newHospital(params);
}

//*Actualiza todos los datos de la Unidad Medica
function updateFullHospital(params: NewHospital, id_unit: string) {
    const client = getHospitalsUtils();
    return client.updateFullHospital(params, id_unit);
}

//*Actualiza todo los datos de la Unidad Medica
function updatePartialHospital(params: Partial<NewHospital>, id_unit: string) {
    const client = getHospitalsUtils();
    return client.updatePartialHospital(params, id_unit);

}

//*Eliminar una Unidad Medica por id
function deleteHospital(id_unit: string) {
    const client = getHospitalsUtils();
    return client.deleteHospital(id_unit);

}

//*Convierte los datos de la Unidad Medica a QR
async function createHospitalQR(id_unit: string) {
    const client = getHospitalsUtils();
    const hospital = await client.getHospitalById(id_unit);

    if (!hospital || typeof hospital === 'boolean') {
        throw new Error('Unidad no encontrada');
    }

    const formattedData = `
    INFORMACIÓN
    Clave de la unidad: ${hospital.unit_clue}
    Nombre de la unidad: ${hospital.unit_name}
    Nivel de atención: ${hospital.attention_level}
    Conexión a internet: ${hospital.internet}
    Oficinas habilitadas: ${hospital.enabled_offices}
    Oficina SINERHIAS: ${hospital.SINERHIAS_office}
    Nombre del administrador: ${hospital.administrator_name}
    Número de teléfono: ${hospital.phone_number}
    Uso de SIMBA: ${hospital.simba_use}
    Farmacia: ${hospital.pharmacy}
    `;
    return client.createHospitalQR(formattedData.trim());
}

export default {
    getHospital,
    getHospitals,
    getHospitalById,
    getHospitalByUnitClue,
    getHospitalByName,
    newHospital,
    updateFullHospital,
    updatePartialHospital,
    deleteHospital,
    createHospitalQR,
    getFullById
}

