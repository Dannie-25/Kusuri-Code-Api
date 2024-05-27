import {NewUser} from "../interfaces/userInterface";
import { getUsersUtils } from "../services/serviceLocator/composer";
import { UsersUtils } from "../utils/userUtils";
import { UserData } from "../interfaces/userInterface";


//*Obtiene el email para validación
function getUser(email: string){
}

//*Obtiene todos los Usuarios registrados
async function getUsers(){
    const client = getUsersUtils();
    return client.getUsers();
}

//*Obtiene al usuario por id
function getUserById(id_user: string){
    const client = getUsersUtils();
    return client.getUserById(id_user);
}

//*Obtiene al usuario por email
function getUserByEmail(email: string){
    const client = getUsersUtils();
    return client.getUserByEmail(email);
}

//*Agrega nuevos Usuarios
function newUser(params:NewUser){
    const client = getUsersUtils();
    return client.newUser(params);
}

//*Actualiza todo los datos del Usuario
function updateFullUser(params: NewUser, id_user: string){
    const client = getUsersUtils();
    return client.updateFullUser(params, id_user);
}

//*Actualizar solo algunos datos del Usuario
function updatePartialUser(params: Partial<NewUser>, id_user: string){
    const client = getUsersUtils();
    return client.updatePartialUser(params, id_user);

}

//*Eliminar los datos del Usuarios por id
function deleteUser(id_user: string){
    const client = getUsersUtils();
    return client.deleteUser(id_user);
}

export default {
    getUser,
    getUsers,
    getUserById,
    getUserByEmail,
    newUser,
    updateFullUser,
    updatePartialUser,
    deleteUser,
}