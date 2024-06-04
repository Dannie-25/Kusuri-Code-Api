import express, { Request, Response } from "express";
import Controller from "../controllers/computer"

const routes = express.Router();

//Todo:Rutas de la funciones - Obtiene la peticion de del controlador para ser transmitida al HTML

//*Validar si ya esta existente un Equipo por su numero de serie
async function getComputer(request: Request, response: Response) {
    const { numero_serie } = request.params;
    try {
        const result = await Controller.getComputer(numero_serie);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene todos los equipos registrados
async function getComputers(request: Request, response: Response) {
    try {
        const result = await Controller.getComputers();
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos del Equipo por id
async function getComputerById(request: Request, response: Response) {
    const { id_equipo } = request.params
    try {
        const result = await Controller.getComputerById(id_equipo);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos del Equipo por id_unidad
async function getComputerByIdUnit(request: Request, response: Response) {
    const { id_unidad } = request.params;
    try {
        const result = await Controller.getComputerByIdUnit(id_unidad);
        if (result) {
            response.send(result);
        } else {
            response.status(404).send({ message: "No se han encontrado Equipos de Computo para el ID" });
        }
    } catch (error) {
        response.status(500).send(error.message);
    }
}
//*Obtiene los datos de un Equipo por su nombre
async function getComputerByName(request: Request, response: Response) {
    const { tipo_equipo } = request.params
    try {
        const result = await Controller.getComputerByName(tipo_equipo);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Agregar nuevo Equipo
async function newComputer(request: Request, response: Response) {
    const { id_unidad, tipo_equipo, marca, modelo, numero_serie, sistema_operativo, capacidad_memoria, capacidad_disco, arquitectura, procesador_marca, procesador_modelo, procesador_velocidad, numero_inventario, internet, tipo_conexion, tipo_ingreso, ubicacion, comentarios } = request.body;
    try {
        const result = await Controller.newComputer({
            id_unidad,
            tipo_equipo,
            marca,
            modelo,
            numero_serie,
            sistema_operativo,
            capacidad_memoria,
            capacidad_disco,
            arquitectura,
            procesador_marca,
            procesador_modelo,
            procesador_velocidad,
            numero_inventario,
            internet,
            tipo_conexion,
            tipo_ingreso,
            ubicacion,
            comentarios
        });
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Actualiza todos los campos del Equipo
async function updateFullComputer(request: Request, response: Response) {
    const { id_unidad, tipo_equipo, marca, modelo, numero_serie, sistema_operativo, capacidad_memoria, capacidad_disco, arquitectura, procesador_marca, procesador_modelo, procesador_velocidad, numero_inventario, internet, tipo_conexion, tipo_ingreso, ubicacion, comentarios, id_equipo } = request.body;
    try {
        const result = await Controller.updateFullComputer({
            id_unidad,
            tipo_equipo,
            marca,
            modelo,
            numero_serie,
            sistema_operativo,
            capacidad_memoria,
            capacidad_disco,
            arquitectura,
            procesador_marca,
            procesador_modelo,
            procesador_velocidad,
            numero_inventario,
            internet,
            tipo_conexion,
            tipo_ingreso,
            ubicacion,
            comentarios
        }, id_equipo);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Actualiza algun dato en especifico del Equipo
async function updatePartialComputer(request: Request, response: Response) {
    const { id_unidad, tipo_equipo, marca, modelo, numero_serie, sistema_operativo, capacidad_memoria, capacidad_disco, arquitectura, procesador_marca, procesador_modeloo, procesador_velocidad, numero_inventario, internet, tipo_conexion, tipo_ingreso, ubicacion, comentarios } = request.body;
    const { id_equipo } = request.params;
    const partialComputerData = {
        id_unidad,
        tipo_equipo,
        marca,
        modelo,
        numero_serie,
        sistema_operativo,
        capacidad_memoria,
        capacidad_disco,
        arquitectura,
        procesador_marca,
        procesador_modeloo,
        procesador_velocidad,
        numero_inventario,
        internet,
        tipo_conexion,
        tipo_ingreso,
        ubicacion,
        comentarios
    };
    try {
        const result = await Controller.updatePartialComputer(partialComputerData, id_equipo);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Eliminar un Equipo por id
async function deleteComputer(request: Request, response: Response) {
    const { id_equipo } = request.params;
    try {
        const result = await Controller.deleteComputer(id_equipo);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos de un Equipo por id para generar el QR
async function createComputerQR(request: Request, response: Response) {
    const { id_equipo } = request.params;
    try {
        const qrUrl = await Controller.createComputerQR(id_equipo);
        response.send(`<img src="${qrUrl}" />`);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Todas las rutas para realizar consultas
routes.get("/all", getComputers);
routes.get("/", getComputer);
routes.get("/id_equipo/:id_equipo", getComputerById);
routes.get("/id_unidad/:id_unidad", getComputerByIdUnit);
routes.get("/marca/:marca", getComputerByName);
routes.post("/", newComputer);
routes.put("/:id_equipo", (req, res) => {
    const { id_equipo } = req.params; //? Captura el id_equipo de la URL
    const params = req.body; //? Captura el resto de los parámetros del cuerpo de la solicitud
    Controller.updateFullComputer(params, id_equipo)
        .then(result => res.send(result))
        .catch(error => res.status(500).send(error));
});
routes.patch("/:id_equipo", updatePartialComputer);
routes.delete("/:id_equipo", deleteComputer);
routes.get("/qr/:id_equipo", createComputerQR);

export default routes;
