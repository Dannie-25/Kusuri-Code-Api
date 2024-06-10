import { HospitalData, NewHospital } from "../interfaces/hospitalInterface";
import { getHospitalsUtils } from "../services/serviceLocator/composer";
import { HospitalsUtils } from "../utils/hospitalUtils";
import { getComputersUtils } from "../services/serviceLocator/composer";
import { getPrintersUtils } from "../services/serviceLocator/composer";

//*Obtiene la clave de la unidad para validación
async function getHospital(clue_unidad: string): Promise<HospitalData | null> {
    const client = getHospitalsUtils();
    try {
        return await client.getHospitals();
    } catch (error) {
        console.error(`Error al Obtener la Unidad Medica ${clue_unidad}:`, error);
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
async function getHospitalById(id_unidad: string): Promise<boolean | HospitalData> {
    const client = getHospitalsUtils();
    try {
        return await client.getHospitalById(id_unidad);
    } catch (error) {
        console.error(`Error al Obterner la Unidad Medica con ID ${id_unidad}:`, error);
        return false;
    }
}

//*Obtiene todos los datos que tiene id_unidad
async function getFullById(id_unidad: string): Promise<any | boolean> {
    try {
        const hospitalData = await getHospitalsUtils().getHospitalById(id_unidad);
        const computerData = await getComputersUtils().getComputerByIdUnit(id_unidad);
        const printerData = await getPrintersUtils().getPrinterByIdUnit(id_unidad);

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
async function getHospitalByUnitClue(clue_unidad: string): Promise<any | null> {
    const client = getHospitalsUtils();
    try {
        return await client.getHospitalByUnitClue(clue_unidad);
    } catch (error) {
        console.error(`Error al Obtener la Unidad Medica por ID ${clue_unidad}:`, error);
        return null;
    }
}

//*Obtiene una Unidad Medica por el nombre
async function getHospitalByName(nombre_unidad: string): Promise<any | null> {
    const client = getHospitalsUtils();
    try {
        return await client.getHospitalByName(nombre_unidad);
    } catch (error) {
        console.error(`Error al Obtener la Unidad Medica ${nombre_unidad}:`, error);
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
async function updateFullHospital(params: NewHospital, id_unidad: string): Promise<string> {
    const client = getHospitalsUtils();
    try {
        return await client.updateFullHospital(params, id_unidad);
    } catch (error) {
        console.error(`Error al Actualizar los Datos de la Unidad Medica con ID ${id_unidad}:`, error);
        return 'Error al actualizar';
    }
}

//*Actualiza todo los datos de la Unidad Medica
async function updatePartialHospital(params: Partial<NewHospital>, id_unidad: string): Promise<boolean> {
    const client = getHospitalsUtils();
    try {
        return await client.updatePartialHospital(params, id_unidad);
    } catch (error) {
        console.error(`Error al Actualizar los Datos de la Unidad Medica con ID ${id_unidad}:`, error);
        return false;
    }
}

//*Eliminar una Unidad Medica por id
async function deleteHospital(id_unidad: string): Promise<boolean> {
    const client = getHospitalsUtils();
    try {
        return await client.deleteHospital(id_unidad);
    } catch (error) {
        console.error('Error al Eliminar la Unidad Medica:', error);
        return false;
    }
}

//*Convierte los datos de la Unidad Medica a QR
async function createHospitalQR(id_unidad: string): Promise<string> {
    const client = getHospitalsUtils();
    try {
        const hospital = await client.getHospitalById(id_unidad);

        if (!hospital || typeof hospital === 'boolean') {
            throw new Error('Unidad no encontrada');
        }

        const formattedData = `
        INFORMACIÓN
        Clave de la unidad: ${hospital.clue_unidad}
        Nombre de la unidad: ${hospital.nombre_unidad}
        Nivel de atención: ${hospital.nivel_atencion}
        Conexión a internet: ${hospital.internet}
        Oficinas habilitadas: ${hospital.consultorios_habilitados}
        Oficina SINERHIAS: ${hospital.consultorio_SINERHIAS}
        Nombre del administrador: ${hospital.nombre_administrador}
        Número de teléfono: ${hospital.numero_telefonico}
        Uso de SIMBA: ${hospital.uso_simba}
        Farmacia: ${hospital.farmacia}
        `;
        return client.createHospitalQR(formattedData.trim());
    } catch (error) {
        console.error(`Error al Generar el QR de la Unidad Medica con ID ${id_unidad}:`, error);
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

