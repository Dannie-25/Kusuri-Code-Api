import { NewHospital } from "../interfaces/hospitalInterface";
import { getHospitalsUtils } from "../services/serviceLocator/composer";
//import { HospitalsUtils } from "../utils/userUtils";
import { HospitalsUtils } from "../utils/hospitalUtils";


//*Obtener la clave de la unidad para validacion
function getHospital(unit_clue: string) {

}

//*Obtener todos los hospitales
async function getHospitals() {
    const client = getHospitalsUtils();
    return client.getHospitals();
}

//*Obtiene a la unidad por ID
function getHospitalById(id_unit: string) {
    const client = getHospitalsUtils();
    return client.getHospitalById(id_unit);
}

//*Obtiene a la unidad por la clave de unidad
function getHospitalByUnitClue(unit_clue: string) {
    const client = getHospitalsUtils();
    return client.getHospitalByUnitClue(unit_clue);
}

//*Obtiene a la unnidad porel nombre
function getHospitalByName(unit_name: string) {
    const client = getHospitalsUtils();
    return client.getHospitalByName(unit_name);
}

//*Agregar nuevo hospital
function newHospital(params: NewHospital) {
    const client = getHospitalsUtils();
    return client.newHospital(params);
}

//*Actualizar todo los datos del hospital
function updateFullHospital(params: NewHospital, id_unit: string) {
    const client = getHospitalsUtils();
    return client.updateFullHospital(params, id_unit);
}

//*Actualizar solo algunos datos del hospital
function updatePartialHospital(params: Partial<NewHospital>, id_unit: string) {
    const client = getHospitalsUtils();
    return client.updatePartialHospital(params, id_unit);

}

//*Eliminar un hospital
function deleteHospital(id_unit: string) {
    const client = getHospitalsUtils();
    return client.deleteHospital(id_unit);

}

//!Convierte los datos del user a QR
async function createHospitalQR(id_unit: string) {
    const client = getHospitalsUtils();
    const hospital = await client.getHospitalById(id_unit);

    if (!hospital || typeof hospital === 'boolean') {
        throw new Error('Unidad no encontrada');
    }

    const formattedData = `
    Información:
    unit_clue: ${hospital.unit_clue}
    unit_name: ${hospital.unit_name}
    attention_level: ${hospital.attention_level}
    internet: ${hospital.internet}
    enabled_offices: ${hospital.enabled_offices}
    SINERHIAS_office: ${hospital.SINERHIAS_office}
    administrator_name: ${hospital.administrator_name}
    phone_number: ${hospital.phone_number}
    simba_use: ${hospital.simba_use}
    pharmacy: ${hospital.pharmacy}
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
    createHospitalQR
}

