import express, { Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import Controller from "../controllers/user"
import { SECRET_KEY } from "../utils/configs/configs";

const routes = express.Router();

//Todo:Rutas de la funciones - Obtiene la peticion de del controlador para ser transmitida al HTML

//*Validar si ya esta existente un correo electronico
async function getUser(request: Request, response: Response) {
    const { correo } = request.params;
    try {
        const result = await Controller.getUser(correo);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos del Usuario por id
async function getUserById(request: Request, response: Response) {
    const { id_usuario } = request.params
    try {
        const result = await Controller.getUserById(id_usuario);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos de un Usuario por correo
async function getUserBycorreo(request: Request, response: Response) {
    const { correo } = request.params
    try {
        const result = await Controller.getUserBycorreo(correo);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Login del Usuario
function login(request: Request, response: Response) {
    passport.authenticate(
        'local',
        (error, user, info) => {
            if (error) {
                response.status(400).json({
                    message: "Error in Login",
                    error
                });
            }
            if (!user) {
                response.status(401).json(info);
            }
            if (user) {
                const token = jwt.sign(user, SECRET_KEY);
                response.status(200).json({ user, token });
            }
        }
    )(request, response)
}

//*Obtiene todos los Usuarios registrados
async function getUsers(request: Request, response: Response) {
    try {
        const result = await Controller.getUsers();
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Agrega un nuevo Usuario
async function newUser(request: Request, response: Response) {
    const { nombre, apellido, correo, password } = request.body;
    try {
        const result = await Controller.newUser({
            nombre,
            apellido,
            correo,
            password
        });
        response.send(result);
    } catch (error) {
        console.log(error);
        response.status(500).send(error.message);
    }
}

//*Actualiza todos los datos del Usuario
async function updateFullUser(request: Request, response: Response) {
    const { nombre, apellido, correo, password, id_usuario } = request.body;
    try {
        const result = await Controller.updateFullUser({
            nombre,
            apellido,
            correo,
            password
        }, id_usuario);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Actualiza algun dato en especifico del Usuario
async function updatePartialUser(request: Request, response: Response) {
    const { nombre, apellido, correo, password } = request.body;
    const { id_usuario } = request.params;
    const partialUserData = {
        nombre,
        apellido,
        correo,
        password
    };

    try {
        const result = await Controller.updatePartialUser(partialUserData, id_usuario);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Elimina un Usuario por id
async function deleteUser(request: Request, response: Response) {
    const { id_usuario } = request.params
    try {
        const result = await Controller.deleteUser(id_usuario);
        console.log('User deleted');
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Todas las rutas para realizar consultas
routes.get("/", getUser);
routes.get("/all", getUsers);
routes.get("/id_usuario/:id_usuario", getUserById);
routes.get("/correo/:correo", getUserBycorreo);
routes.post("/login", login);
routes.post("/", newUser);
routes.put("/:id_usuario", (req, res) => {
    const { id_usuario } = req.params; //? Captura id_usuariosuario de la URL
    const params = req.body; //? Captura el resto de los parámetros del cuerpo de la solicitud
    Controller.updateFullUser(params, id_usuario)
        .then(result => res.send(result))
        .catch(error => res.status(500).send(error));
});
routes.patch("/:id_usuario", updatePartialUser);
routes.delete("/:id_usuario", deleteUser);

export default routes;
