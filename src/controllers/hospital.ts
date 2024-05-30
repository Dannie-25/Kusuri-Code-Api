import { HospitalData, NewHospital } from "../interfaces/hospitalInterface";
import { getHospitalsUtils } from "../services/serviceLocator/composer";
import { HospitalsUtils } from "../utils/hospitalUtils";
import { getComputersUtils } from "../services/serviceLocator/composer";
import { getPrintersUtils } from "../services/serviceLocator/composer";

//*Obtiene la clave de la unidad para validación
async function getHospital(unit_clue: string): Promise<HospitalData | null> {
    const client = getHospitalsUtils();
    try {
        return await client.getHospitals();
    } catch (error) {
        console.error(`Error al Obtener la Unidad Medica ${unit_clue}:`, error);
        return null;
    }
}

//*Obtiene todas las Unidades Medicas Registradas
async function getHospitals(): Promise<any[]> {
    const client = getHospitalsUtils();
    try {
        return await client.getHospitals();
    } catch (error) {
        console.error('Error al Obtener las Unidades Medicas:', error);
        return [];
    }
}

//*Obtiene una Unidad Medica por ID
async function getHospitalById(id_unit: string): Promise<boolean | HospitalData> {
    const client = getHospitalsUtils();
    try {
        return await client.getHospitalById(id_unit);
    } catch (error) {
        console.error(`Error al Obterner la Unidad Medica con ID ${id_unit}:`, error);
        return null;
    }
}

//*Obtiene todos los datos que tiene id_unit
async function getFullById(id_unit: string): Promise<any | boolean> {
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
        console.error("Error al Obtener Todos los Datos Completos:", error);
        return false;
    }
}

//*Obtiene una Unidad Medica por la clave de Unidad
async function getHospitalByUnitClue(unit_clue: string): Promise<any | null> {
    const client = getHospitalsUtils();
    try {
        return await client.getHospitalByUnitClue(unit_clue);
    } catch (error) {
        console.error(`Error al Obtener la Unidad Medica por ID ${unit_clue}:`, error);
        return null;
    }
}

//*Obtiene una Unidad Medica por el nombre
async function getHospitalByName(unit_name: string): Promise<any | null> {
    const client = getHospitalsUtils();
    try {
        return await client.getHospitalByName(unit_name);
    } catch (error) {
        console.error(`Error al Obtener la Unidad Medica ${unit_name}:`, error);
        return null;
    }
}

//*Agrega una nueva Unidad Medica
async function newHospital(params: NewHospital): Promise<boolean> {
    const client = getHospitalsUtils();
    try {
        return await client.newHospital(params);
    } catch (error) {
        console.error('Error al Agregar la Nueva Unidad Medica:', error);
        return false;
    }
}

//*Actualiza todos los datos de la Unidad Medica
async function updateFullHospital(params: NewHospital, id_unit: string): Promise<string> {
    const client = getHospitalsUtils();
    try {
        return await client.updateFullHospital(params, id_unit);
    } catch (error) {
        console.error(`Error al Actualizar los Datos de la Unidad Medica con ID ${id_unit}:`, error);
    }
}

//*Actualiza todo los datos de la Unidad Medica
async function updatePartialHospital(params: Partial<NewHospital>, id_unit: string): Promise<boolean> {
    const client = getHospitalsUtils();
    try {
        return await client.updatePartialHospital(params, id_unit);
    } catch (error) {
        console.error(`Error al Actualizar los Datos de la Unidad Medica con ID ${id_unit}:`, error);
        return false;
    }
}

//*Eliminar una Unidad Medica por id
async function deleteHospital(id_unit: string): Promise<boolean> {
    const client = getHospitalsUtils();
    try {
        return await client.deleteHospital(id_unit);
    } catch (error) {
        console.error('Error al Eliminar la Unidad Medica:', error);
        return false;
    }
}

//*Convierte los datos de la Unidad Medica a QR
async function createHospitalQR(id_unit: string): Promise<string> {
    const client = getHospitalsUtils();
    try {
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
    } catch (error) {
        console.error(`Error al Generar el QR de la Unidad Medica con ID ${id_unit}:`, error);
        throw error;
    }
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

