import {NewComputer} from "../interfaces/computerInterface";
import { getComputersUtils } from "../services/serviceLocator/composer";
import { ComputersUtils } from "../utils/userUtils";


//*Obtener el numero de serie de la computadora para validación
function getComputer(serial_number: string){

}

//*Obtener todas las computer
async function getComputers(){
    const client = getComputersUtils();
    return client.getComputers();
}

//*Agregar nuevas computer
function newComputer(params:NewComputer){
    const client = getComputersUtils();
    return client.newComputer(params);
}

//*Actualizar todo los datos del computer
function updateFullComputer(params: NewComputer, id_computer: string){
    const client = getComputersUtils();
    return client.updateFullComputer(params, id_computer);
}

//*Actualizar solo algunos datos de la computadora
function updatePartialComputer(params: Partial<NewComputer>, id_computer: string){
    const client = getComputersUtils();
    return client.updatePartialComputer(params, id_computer);

}

//*Eliminar las computadoras
function deleteComputer(id_computer: string){
    const client = getComputersUtils();
    return client.deleteComputer(id_computer);

}

export default {
    getComputer,
    getComputers,
    newComputer,
    updateFullComputer,
    updatePartialComputer,
    deleteComputer,
}