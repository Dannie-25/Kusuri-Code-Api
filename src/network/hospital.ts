import express, { Request, Response } from "express";
import Controller from "../controllers/hospital"

const routes = express.Router();

//Todo:Rutas de la funciones - Obtiene la peticion de del controlador para ser transmitida al HTML

//*Valida si ya existe una Unidad Medica por su unit clue
async function getHospital(request: Request, response: Response) {
    const { unit_clue } = request.params;
    try {
        const result = Controller.getHospital(unit_clue)
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
    const { id_unit } = request.params
    try {
        const result = await Controller.getHospitalById(id_unit);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos que contiene id_unit
async function getFullById(request: Request, response: Response) {
    try {
        const { id_unit } = request.params;
        const result = await Controller.getFullById(id_unit);
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
    const { unit_clue } = request.params
    try {
        const result = await Controller.getHospitalByUnitClue(unit_clue);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos de la Unidad Medica por el nombre
async function getHospitalByName(request: Request, response: Response) {
    const { unit_name } = request.params
    try {
        const result = await Controller.getHospitalByName(unit_name);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Agrega una nueva Unidad Medica
async function newHospital(request: Request, response: Response) {
    const { unit_clue, unit_name, attention_level, internet, enabled_offices, SINERHIAS_office, administrator_name, phone_number, simba_use, pharmacy } = request.body;
    try {
        const result = await Controller.newHospital({
            unit_clue,
            unit_name,
            attention_level,
            internet,
            enabled_offices,
            SINERHIAS_office,
            administrator_name,
            phone_number,
            simba_use,
            pharmacy
        });
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Actualiza todos los datos de la Unidad Medica
async function updateFullHospital(request: Request, response: Response) {
    const { unit_clue, unit_name, attention_level, internet, enabled_offices, SINERHIAS_office, administrator_name, phone_number, simba_use, pharmacy, id_unit } = request.body;
    try {
        const result = await Controller.updateFullHospital({
            unit_clue,
            unit_name,
            attention_level,
            internet,
            enabled_offices,
            SINERHIAS_office,
            administrator_name,
            phone_number,
            simba_use,
            pharmacy
        }, id_unit);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Actualiza algunos datos de la Unidad Medica
async function updatePartialHospital(request: Request, response: Response) {
    const { unit_clue, unit_name, attention_level, internet, enabled_offices, SINERHIAS_office, administrator_name, phone_number, simba_use, pharmacy } = request.body;
    const { id_unit } = request.params;
    const partialHospitalData = {
        unit_clue,
        unit_name,
        attention_level,
        internet,
        enabled_offices,
        SINERHIAS_office,
        administrator_name,
        phone_number,
        simba_use,
        pharmacy
    };

    try {
        const result = await Controller.updatePartialHospital(partialHospitalData, id_unit);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Elimina una Unidad Medica por id
async function deleteHospital(request: Request, response: Response) {
    const { id_unit } = request.params;
    try {
        const result = await Controller.deleteHospital(id_unit);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos de la Unidad Medica por id para generar el QR
async function createHospitalQR(request: Request, response: Response) {
    const { id_unit } = request.params;
    try {
        const qrUrl = await Controller.createHospitalQR(id_unit);
        response.send(`<img src="${qrUrl}" />`);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Todas las rutas para realizar consultas
routes.get("/", getHospital);
routes.get("/all", getHospitals);
routes.get("/id_unit/:id_unit", getHospitalById);
routes.get("/unit_clue/:unit_clue", getHospitalByUnitClue);
routes.get("/unit_name/:unit_name", getHospitalByName);
routes.post("/", newHospital);
routes.put("/:id_unit", (req, res) => {
    const { id_unit } = req.params; //? Captura el id_unit de la URL
    const params = req.body; //? Captura el resto de los parámetros del cuerpo de la solicitud
    Controller.updateFullHospital(params, id_unit)
        .then(result => res.send(result))
        .catch(error => res.status(500).send(error));
});
routes.patch("/:id_unit", updatePartialHospital);
routes.delete("/:id_unit", deleteHospital);
routes.get("/qr/:id_unit", createHospitalQR);

routes.get("/id_full/:id_unit", getFullById);

export default routes;
