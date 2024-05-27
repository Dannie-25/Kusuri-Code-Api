import {NewUser} from "../interfaces/userInterface";
import { getUsersUtils } from "../services/serviceLocator/composer";
import { UsersUtils } from "../utils/userUtils";
import { UserData } from "../interfaces/userInterface";


//*Obtener el email para validación
function getUser(email: string){
}

//*Obtener todos los usuarios
async function getUsers(){
    const client = getUsersUtils();
    return client.getUsers();
}

//*Agregar nuevos usuarios
function newUser(params:NewUser){
    const client = getUsersUtils();
    return client.newUser(params);
}

//*Actualizar todo los datos del usuario
function updateFullUser(params: NewUser, id_user: string){
    const client = getUsersUtils();
    return client.updateFullUser(params, id_user);
}

//*Actualizar solo algunos datos del usuario
function updatePartialUser(params: Partial<NewUser>, id_user: string){
    const client = getUsersUtils();
    return client.updatePartialUser(params, id_user);

}

//*Eliminar los datos del usuarios
function deleteUser(id_user: string){
    const client = getUsersUtils();
    return client.deleteUser(id_user);
}

//*Obtiene usuario por ID
function getUserById(id_user: string){
    const client = getUsersUtils();
    return client.getUserById(id_user);
}

//*Obtiene usuario por email
function getUserByEmail(email: string){
    const client = getUsersUtils();
    return client.getUserByEmail(email);
}

//*Convierte los datos del user a QR
/**function createUserQR(id: string){
    const client = getUsersUtils();
    //return client.createUserQR(id);
}*/


//!Convierte los datos del user a QR
async function createUserQR(id_user: string) {
    const client = getUsersUtils();
    const user = await client.getUserById(id_user);

    if (!user || typeof user === 'boolean') {
        throw new Error('Usuario no encontrado');
    }

    // Formatear los datos del usuario
    const formattedData = `
        Name: ${user.names}
        Last Name: ${user.lastNames}
        Email: ${user.email}
        Password: ${user.password}
    `;

    return client.createUserQR(formattedData);
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
    createUserQR
}