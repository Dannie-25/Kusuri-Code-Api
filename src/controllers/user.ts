import {NewUser} from "../interfaces/userInterface";
import { getUsersUtils } from "../services/serviceLocator/composer";
import { UsersUtils } from "../utils/userUtils";



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
function updateFullUser(params: NewUser, id: string){
    const client = getUsersUtils();
    return client.updateFullUser(params, id);
}

//*Actualizar solo algunos datos del usuario
function updatePartialUser(params: Partial<NewUser>, id: string){
    const client = getUsersUtils();
    return client.updatePartialUser(params, id);

}

//*Eliminar los datos del usuarios
function deleteUser(id: string){
    const client = getUsersUtils();
    return client.deleteUser(id);
}

//*Obtiene usuario por ID
function getUserById(id: string){
    const client = getUsersUtils();
    return client.getUserById(id);
}

//*Obtiene usuario por email
function getUserByEmail(email: string){
    const client = getUsersUtils();
    return client.getUserByEmail(email);
}

//!Convierte los datos del user a QR
async function createUserQR(id: string) {
    const client = getUsersUtils();
    const user = await client.getUserById(id);

    if (!user || typeof user === 'boolean') {
        throw new Error('Usuario no encontrado');
    }

    const formattedData =`
    Informacion:
    Nombre: ${user.names}
    Apellido: ${user.lastNames}
    Email: ${user.email}
    Password: ${user.password}
    `;

    return client.createUserQR(formattedData.trim());
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