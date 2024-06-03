import { UserData, NewUser } from "../interfaces/userInterface";
import { getUsersUtils } from "../services/serviceLocator/composer";
import { UsersUtils } from "../utils/userUtils";

//*Obtiene el correo para validación
async function getUser(correo: string) {
    const client = getUsersUtils();
    try {
        return await client.getUsers();
    } catch (error) {
        console.error(`Error al Obtener el Usuario con correo ${correo}:`, error);
        return null;
    }
}

//*Obtiene todos los Usuarios registrados
async function getUsers() {
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
async function getUserById(id_usuario: string) {
    const client = getUsersUtils();
    try {
        return await client.getUserById(id_usuario);
    } catch (error) {
        console.error('Error al Obtener el ID del Usuario:', error);
        return false;
    }
}

//*Obtiene al usuario por correo
async function getUserBycorreo(correo: string) {
    const client = getUsersUtils();
    try {
        return await client.getUserBycorreo(correo);
    } catch (error) {
        console.error(`Error al Obtener el Usuario por correo: ${correo}:`, error);
    }
}

//*Agrega nuevos Usuarios
async function newUser(params: NewUser) {
    const client = getUsersUtils();
    try {
        return await client.newUser(params);
    } catch (error) {
        console.error(`Error al Agregar Usuario:`, error);
        return false;
    }
}

//*Actualiza todo los datos del Usuario
async function updateFullUser(params: NewUser, id_usuario: string) {
    const client = getUsersUtils();
    try {
        return await client.updateFullUser(params, id_usuario);
    } catch (error) {
        console.error(`Error al Actualizar los Datos del Usuario con ID ${id_usuario}:`, error);
        return false;
    }
}

//*Actualizar solo algunos datos del Usuario
async function updatePartialUser(params: Partial<NewUser>, id_usuario: string) {
    const client = getUsersUtils();
    try {
        return client.updatePartialUser(params, id_usuario);
    } catch (error) {
        console.error(`Error al Actualizar el Dato del Usuario con ID ${id_usuario}:`, error);
        return false;
    }
}

//*Eliminar los datos del Usuarios por id
async function deleteUser(id_usuario: string) {
    const client = getUsersUtils();
    try {
        return client.deleteUser(id_usuario);
    } catch (error) {
        console.error('Error al Eliminar el Usuario:', error);
        return false;
    }
}

export default {
    getUser,
    getUsers,
    getUserById,
    getUserBycorreo,
    newUser,
    updateFullUser,
    updatePartialUser,
    deleteUser,
}