import express, { Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import Controller from "../controllers/user"

const routes = express.Router();

//*Validar si ya esta existente un correo electronico
function getUser(request: Request, response: Response) {
    const { email } = request.params;
    Controller.getUser(email)
}

//*Obtener los datos de un usuario por id
function getUserById(request: Request, response: Response) {
    const { id_user } = request.params
    Controller.getUserById(id_user)
        .then((result) => {
            response.send(result)
        })
        .catch((error) => response.send(error))
}

//*Obtener los datos de un usuario por email
function getUserByEmail(request: Request, response: Response) {
    const { email } = request.params
    Controller.getUserByEmail(email)
        .then((result) => {
            response.send(result)
        })
        .catch((error) => response.send(error))
}

//*Login de usuario con metodos de tratamientos de errores
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

//*Obtener los usuarios desde el controller
function getUsers(request: Request, response: Response) {
    Controller.getUsers()
        .then((result) => response.send(result))
        .catch((error) => response.send(error))
}

//*Agregar un usuario, llamando al controller para la solicitud
function newUser(request: Request, response: Response) {
    const { names, lastNames, email, password } = request.body;

    Controller.newUser({
        names,
        lastNames,
        email,
        password
    })
        .then((result) => response.send(result))
        .catch((error) => {
            console.log(error)
            response.send(error)
        })
}

//*Actualizar todos los campos del usuario desde el controller
function updateFullUser(request: Request, response: Response) {
    const { names, lastNames, email, password, id_user } = request.body;
    Controller.updateFullUser({
        names,
        lastNames,
        email,
        password
    }, id_user)
        .then((result) => response.send(result))
        .catch((error) => response.send(error))
}

//*Actualizar algunos campos del usuario desde el controller
function updatePartialUser(request: Request, response: Response) {
    const { names, lastNames, email, password } = request.body;
    const { id_user } = request.params;
    const partialUserData = {
        names,
        lastNames,
        email,
        password
    };

    Controller.updatePartialUser(partialUserData, id_user)
        .then((result) => response.send(result))
        .catch((error) => response.send(error));
}

//*Eliminar un usuario desde el controller
function deleteUser(request: Request, response: Response) {
    const { id_user } = request.params
    Controller.deleteUser(id_user)
        .then((result) => {
            console.log('User deleted')
            response.send(result)
        })
        .catch((error) => response.send(error))
}

//!Obtener los datos de un usuario por id para qr
async function createUserQR(request: Request, response: Response) {
    const { id_user } = request.params;
    try {
        const qrUrl = await Controller.createUserQR(id_user);
        response.send(`<img src="${qrUrl}" />`);
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
    const { id_user } = req.params; //? Captura el id_equipment de la URL
    const params = req.body; //? Captura el resto de los parámetros del cuerpo de la solicitud
    Controller.updateFullUser(params, id_user)
        .then(result => res.send(result))
        .catch(error => res.status(500).send(error));
});
routes.patch("/:id_user", updatePartialUser);
routes.delete("/:id_user", deleteUser);
routes.get("/qr/:id_user", createUserQR);

export default routes;
