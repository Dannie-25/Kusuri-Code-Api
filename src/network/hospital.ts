import express, { Request, Response } from "express";
import Controller from "../controllers/hospital"

const routes = express.Router();

//Todo:Rutas de la funciones - Obtiene la peticion de del controlador para ser transmitida al HTML

//*Valida si ya existe una Unidad Medica por su unit clue
async function getHospital(request: Request, response: Response) {
    const { clue_unidad } = request.params;
    try {
        const result = Controller.getHospital(clue_unidad)
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene todas la Unidades Medicas registradas
async function getHospitals(request: Request, response: Response) {
    try {
        const result = await Controller.getHospitals()
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos de la Unidad Medica por id
async function getHospitalById(request: Request, response: Response) {
    const { id_unidad } = request.params
    try {
        const result = await Controller.getHospitalById(id_unidad);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos que contiene id_unidad
async function getFullById(request: Request, response: Response) {
    try {
        const { id_unidad } = request.params;
        const result = await Controller.getFullById(id_unidad);
        if (result) {
            response.send(result);
        } else {
            response.status(404).send("No se encontraron datos completos para la unidad.");
        }
    } catch (error) {
        console.error("Error al obtener datos completos:", error);
        response.status(500).send("Error interno del servidor");
    }
}

//*Obtiene los datos de la Unidad Medica por unit clue
async function getHospitalByUnitClue(request: Request, response: Response) {
    const { clue_unidad } = request.params
    try {
        const result = await Controller.getHospitalByUnitClue(clue_unidad);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos de la Unidad Medica por el nombre
async function getHospitalByName(request: Request, response: Response) {
    const { nombre_unidad } = request.params
    try {
        const result = await Controller.getHospitalByName(nombre_unidad);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Agrega una nueva Unidad Medica
async function newHospital(request: Request, response: Response) {
    const { clue_unidad, nombre_unidad, nivel_atencion, internet, consultorios_habilitados, consultorio_SINERHIAS, nombre_administrador, numero_telefonico, uso_simba, farmacia } = request.body;
    try {
        const result = await Controller.newHospital({
            clue_unidad,
            nombre_unidad,
            nivel_atencion,
            internet,
            consultorios_habilitados,
            consultorio_SINERHIAS,
            nombre_administrador,
            numero_telefonico,
            uso_simba,
            farmacia
        });
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Actualiza todos los datos de la Unidad Medica
async function updateFullHospital(request: Request, response: Response) {
    const { clue_unidad, nombre_unidad, nivel_atencion, internet, consultorios_habilitados, consultorio_SINERHIAS, nombre_administrador, numero_telefonico, uso_simba, farmacia, id_unidad } = request.body;
    try {
        const result = await Controller.updateFullHospital({
            clue_unidad,
            nombre_unidad,
            nivel_atencion,
            internet,
            consultorios_habilitados,
            consultorio_SINERHIAS,
            nombre_administrador,
            numero_telefonico,
            uso_simba,
            farmacia
        }, id_unidad);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Actualiza algunos datos de la Unidad Medica
async function updatePartialHospital(request: Request, response: Response) {
    const { clue_unidad, nombre_unidad, nivel_atencion, internet, consultorios_habilitados, consultorio_SINERHIAS, nombre_administrador, numero_telefonico, uso_simba, farmacia } = request.body;
    const { id_unidad } = request.params;
    const partialHospitalData = {
        clue_unidad,
        nombre_unidad,
        nivel_atencion,
        internet,
        consultorios_habilitados,
        consultorio_SINERHIAS,
        nombre_administrador,
        numero_telefonico,
        uso_simba,
        farmacia
    };

    try {
        const result = await Controller.updatePartialHospital(partialHospitalData, id_unidad);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Elimina una Unidad Medica por id
async function deleteHospital(request: Request, response: Response) {
    const { id_unidad } = request.params;
    try {
        const result = await Controller.deleteHospital(id_unidad);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos de la Unidad Medica por id para generar el QR
async function createHospitalQR(request: Request, response: Response) {
    const { id_unidad } = request.params;
    try {
        const qrUrl = await Controller.createHospitalQR(id_unidad);
        response.send(`<img src="${qrUrl}" />`);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Todas las rutas para realizar consultas
routes.get("/", getHospital);
routes.get("/all", getHospitals);
routes.get("/id_unidad/:id_unidad", getHospitalById);
routes.get("/clue_unidad/:clue_unidad", getHospitalByUnitClue);
routes.get("/nombre_unidad/:nombre_unidad", getHospitalByName);
routes.post("/", newHospital);
routes.put("/:id_unidad", (req, res) => {
    const { id_unidad } = req.params; //? Captura el id_unidad de la URL
    const params = req.body; //? Captura el resto de los parámetros del cuerpo de la solicitud
    Controller.updateFullHospital(params, id_unidad)
        .then(result => res.send(result))
        .catch(error => res.status(500).send(error));
});
routes.patch("/:id_unidad", updatePartialHospital);
routes.delete("/:id_unidad", deleteHospital);
routes.get("/qr/:id_unidad", createHospitalQR);
routes.get("/id_full/:id_unidad", getFullById);

export default routes;
