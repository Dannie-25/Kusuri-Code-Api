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

//*Login de usuario con metodos de tratamientos de errores
function login(request: Request, response: Response){
    passport.authenticate(
        'local',
        (error, user, info) =>{
            if (error){
                response.status(400).json({
                message: "Error in Login",
                error
                });
            }
            if (!user){
                response.status(401).json(info);
            }
            if (user){
                const token = jwt.sign(user, process.env.SECRET_KEY);
                response.status(200).json({ user, token });
            }
        }
    )(request,response)
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
    const { names, lastNames, email, password, id } = request.body;
    Controller.updateFullUser({
        names,
        lastNames,
        email,
        password
    }, id)
        .then((result) => response.send(result))
        .catch((error) => response.send(error))
}

//*Actualizar algunos campos del usuario desde el controller
function updatePartialUser(request: Request, response: Response) {
    const { names, lastNames, email, password} = request.body; 
    const {id} = request.params;
    const partialUserData = {
        names,
        lastNames,
        email,
        password
    };

    Controller.updatePartialUser(partialUserData, id)
        .then((result) => response.send(result))
        .catch((error) => response.send(error));
}

//*Eliminar un usuario desde el controller
function deleteUser(request: Request, response: Response) {
    const { id } = request.params
    Controller.deleteUser(id)
    .then((result) => {
        console.log('User deleted')
        response.send(result)
    })
        .catch((error) => response.send(error))
}

//*Todas las rutas para realizar consultas
routes.get("/", getUser);
routes.get("/all", getUsers);
routes.post("/login", login);
routes.post("/", newUser);
routes.put("/:id", updateFullUser);
routes.patch("/:id", updatePartialUser);
routes.delete("/:id", deleteUser);

export default routes;
