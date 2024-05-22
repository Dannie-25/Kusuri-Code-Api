import {NewHospital } from "../interfaces/hospitalInterface";
import { getHospitalsUtils } from "../services/serviceLocator/composer";
import { HospitalsUtils } from "../utils/userUtils";


//*Obtener el id de unidad del hospital
function getHospital(name: string){

}

//*Obtener todos los hospitales
async function getHospitals(){
    const client = getHospitalsUtils();
    return client.getHospitals();
}

//*Agregar nuevo hospital
function newHospital(params:NewHospital){
    const client = getHospitalsUtils();
    return client.newHospital(params);
}

//*Actualizar todo los datos del hospital
function updateFullHospital(params: NewHospital, id_unit: string){
    const client = getHospitalsUtils();
    return client.updateFullHospital(params, id_unit);
}

//*Actualizar solo algunos datos del hospital
function updatePartialHospital(params: Partial<NewHospital>, id_unit: string){
    const client = getHospitalsUtils();
    return client.updatePartialHospital(params, id_unit);

}

//*Eliminar un hospital
function deleteHospital(id_unit: string){
    const client = getHospitalsUtils();
    return client.deleteHospital(id_unit);

}

export default {
    getHospital,
    getHospitals,
    newHospital,
    updateFullHospital,
    updatePartialHospital,
    deleteHospital,
}