import express, { Request, Response } from "express";
import Controller from "../controllers/hospital"

const routes = express.Router();

//Todo:Rutas de la funciones - Obtiene la peticion de del controlador para ser transmitida al HTML

//*Valida si ya existe una Unidad Medica por su unit clue
function getHospital(request: Request, response: Response) {
    const { unit_clue } = request.params;
    Controller.getHospital(unit_clue)
}

//*Obtiene todas la Unidades Medicas registradas
function getHospitals(request: Request, response: Response) {
    Controller.getHospitals()

        .then((result) => response.send(result.rows))
        .catch((error) => response.send(error))
}

//*Obtiene los datos de la Unidad Medica por id
function getHospitalById(request: Request, response: Response) {
    const { id_unit } = request.params
    Controller.getHospitalById(id_unit)
    .then((result) => {
        response.send(result)
    })
        .catch((error) => response.send(error))
}

//*Obtiene los datos de la Unidad Medica por unit clue
function getHospitalByUnitClue(request: Request, response: Response) {
    const { unit_clue } = request.params
    Controller.getHospitalByUnitClue(unit_clue)
    .then((result) => {
        response.send(result)
    })
        .catch((error) => response.send(error))
}

//*Obtiene los datos de la Unidad Medica por el nombre
function getHospitalByName(request: Request, response: Response) {
    const { unit_name } = request.params
    Controller.getHospitalByName(unit_name)
    .then((result) => {
        response.send(result)
    })
        .catch((error) => response.send(error))
}

//*Agrega una nueva Unidad Medica
function newHospital(request: Request, response: Response) {
    const { unit_clue, unit_name, attention_level, internet, enabled_offices, SINERHIAS_office, administrator_name, phone_number, simba_use, pharmacy } = request.body;

    Controller.newHospital({
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
    })
        .then((result) => response.send(result))
        .catch((error) => {
            console.log(error)
            response.send(error)
        })
}

//*Actualiza todos los datos de la Unidad Medica
function updateFullHospital(request: Request, response: Response) {
    const { unit_clue, unit_name, attention_level, internet, enabled_offices, SINERHIAS_office, administrator_name, phone_number, simba_use, pharmacy, id_unit } = request.body;
    Controller.updateFullHospital({
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
    }, id_unit)
        .then((result) => response.send(result))
        .catch((error) => response.send(error))
}

//*Actualiza algunos datos de la Unidad Medica
function updatePartialHospital(request: Request, response: Response) {
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

    Controller.updatePartialHospital(partialHospitalData, id_unit)
        .then((result) => response.send(result))
        .catch((error) => response.send(error));
}

//*Elimina una Unidad Medica por id
function deleteHospital(request: Request, response: Response){
    const { id_unit } = request.params;
    Controller.deleteHospital(id_unit)
        .then((result) => {
            console.log('Unidad Medica deleted')
            response.send(result)
    })
        .catch((error) => response.send(error))
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

export default routes;
