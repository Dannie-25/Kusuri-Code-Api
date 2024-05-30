import express, { Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import Controller from "../controllers/user"

const routes = express.Router();

//Todo:Rutas de la funciones - Obtiene la peticion de del controlador para ser transmitida al HTML

//*Validar si ya esta existente un correo electronico
async function getUser(request: Request, response: Response) {
    const { email } = request.params;
    try {
        const result = await Controller.getUser(email);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos del Usuario por id
async function getUserById(request: Request, response: Response) {
    const { id_user } = request.params
    try {
        const result = await Controller.getUserById(id_user);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos de un Usuario por email
async function getUserByEmail(request: Request, response: Response) {
    const { email } = request.params
    try {
        const result = await Controller.getUserByEmail(email);
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
                const token = jwt.sign(user, process.env.SECRET_KEY);
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
    const { names, lastNames, email, password } = request.body;
    try {
        const result = await Controller.newUser({
            names,
            lastNames,
            email,
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
    const { names, lastNames, email, password, id_user } = request.body;
    try {
        const result = await Controller.updateFullUser({
            names,
            lastNames,
            email,
            password
        }, id_user);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Actualiza algun dato en especifico del Usuario
async function updatePartialUser(request: Request, response: Response) {
    const { names, lastNames, email, password } = request.body;
    const { id_user } = request.params;
    const partialUserData = {
        names,
        lastNames,
        email,
        password
    };

    try {
        const result = await Controller.updatePartialUser(partialUserData, id_user);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Elimina un Usuario por id
async function deleteUser(request: Request, response: Response) {
    const { id_user } = request.params
    try {
        const result = await Controller.deleteUser(id_user);
        console.log('User deleted');
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Todas las rutas para realizar consultas
routes.get("/", getUser);
routes.get("/all", getUsers);
routes.get("/id_user/:id_user", getUserById);
routes.get("/email/:email", getUserByEmail);
routes.post("/login", login);
routes.post("/", newUser);
routes.put("/:id_user", (req, res) => {
    const { id_user } = req.params; //? Captura el id_user de la URL
    const params = req.body; //? Captura el resto de los parámetros del cuerpo de la solicitud
    Controller.updateFullUser(params, id_user)
        .then(result => res.send(result))
        .catch(error => res.status(500).send(error));
});
routes.patch("/:id_user", updatePartialUser);
routes.delete("/:id_user", deleteUser);

export default routes;
