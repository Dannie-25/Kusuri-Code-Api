import {UserData, NewUser} from "../interfaces/userInterface";
import { getUsersUtils } from "../services/serviceLocator/composer";
import { UsersUtils } from "../utils/userUtils";

//*Obtiene el email para validación
async function getUser(email: string){
    const client = getUsersUtils();
    try {
        return await client.getUsers();
    } catch (error) {
        console.error(`Error al Obtener el Usuario con Email ${email}:`, error);
        return null;
    }
}

//*Obtiene todos los Usuarios registrados
async function getUsers(){
    const client = getUsersUtils();
    try {
        return await client.getUsers();
    }
    catch (error) {
        console.error('Error al Obtener los Usuarios:', error)
        return [];
    }
}

//*Obtiene al usuario por id
async function getUserById(id_user: string){
    const client = getUsersUtils();
    try {
        return await client.getUserById(id_user);
    } catch (error) {
        console.error('Error al Obtener el ID del Usuario:', error);
        return false;
    }
}

//*Obtiene al usuario por email
async function getUserByEmail(email: string){
    const client = getUsersUtils();
    try {
        return await client.getUserByEmail(email);
    } catch (error) {
        console.error(`Error al Obtener el Usuario por Email: ${email}:`, error);
    }
}

//*Agrega nuevos Usuarios
async function newUser(params:NewUser){
    const client = getUsersUtils();
    try {
        return await client.newUser(params);
    } catch (error) {
        console.error(`Error al Agregar Usuario:`, error);
        return false;
    }
}

//*Actualiza todo los datos del Usuario
async function updateFullUser(params: NewUser, id_user: string){
    const client = getUsersUtils();
    try {
        return await client.updateFullUser(params, id_user);
    } catch (error) {
        console.error(`Error al Actualizar los Datos del Usuario con ID ${id_user}:`, error);
        return false;
    }
}

//*Actualizar solo algunos datos del Usuario
async function updatePartialUser(params: Partial<NewUser>, id_user: string){
    const client = getUsersUtils();
    try {
        return client.updatePartialUser(params, id_user);
    } catch (error) {
        console.error(`Error al Actualizar el Dato del Usuario con ID ${id_user}:`, error);
        return false;
    }
}

//*Eliminar los datos del Usuarios por id
async function deleteUser(id_user: string){
    const client = getUsersUtils();
    try {
        return client.deleteUser(id_user);
    } catch (error) {
        console.error('Error al Eliminar el Usuario:', error);
        return false;
    }
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