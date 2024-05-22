import express, { Request, Response } from "express";
import Controller from "../controllers/hospital"

const routes = express.Router();

//*Validar si ya existe un hospital por la unidad
function getHospital(request: Request, response: Response) {
    const { name } = request.params;
    Controller.getHospital(name)
}

//*Agregar hospital, llamando al controller para la solicitud
function newHospital(request: Request, response: Response) {
    const {name, leve_attention, internet, authorized_office, NIS_office, administrator_name, telephone_number, sinba, pharmacy } = request.body;

    Controller.newHospital({
        name,
        leve_attention,
        internet,
        authorized_office,
        NIS_office,
        administrator_name,
        telephone_number,
        sinba,
        pharmacy
    })
        .then((result) => response.send(result))
        .catch((error) => {
            console.log(error)
            response.send(error)
        })
}

//Todo: POST Y PATCH

//*Obtener los hospitales desde el controller
function getHospitals(request: Request, response: Response) {
    Controller.getHospitals()

        .then((result) => response.send(result.rows))
        .catch((error) => response.send(error))
}

//*Actualizar todos los campos del hospital desde el controller
function updateFullHospital(request: Request, response: Response) {
    const { name, leve_attention, internet, authorized_office, NIS_office, administrator_name, telephone_number, sinba, pharmacy, id_unit } = request.body;
    Controller.updateFullHospital({
        name,
        leve_attention,
        internet,
        authorized_office,
        NIS_office,
        administrator_name,
        telephone_number,
        sinba,
        pharmacy
    }, id_unit)
        .then((result) => response.send(result))
        .catch((error) => response.send(error))
}

//*Actualizar algunos campos del hospital desde el controller
function updatePartialHospital(request: Request, response: Response) {
    const { name, leve_attention, internet, authorized_office, NIS_office, administrator_name, telephone_number, sinba, pharmacy } = request.body;
    const { id_unit } = request.params;
    const partialHospitalData = {
        name,
        leve_attention,
        internet,
        authorized_office,
        NIS_office,
        administrator_name,
        telephone_number,
        sinba,
        pharmacy
    };

    Controller.updatePartialHospital(partialHospitalData, id_unit)
        .then((result) => response.send(result))
        .catch((error) => response.send(error));
}

function deleteHospital(request: Request, response: Response){
    const { id_unit } = request.params;
    Controller.deleteHospital(id_unit)
        .then((result) => {
            console.log('Hospital deleted')
            response.send(result)
    })
        .catch((error) => response.send(error))
}


//*Todas las rutas para realizar consultas
routes.get("/", getHospital);
routes.get("/all", getHospitals);
routes.post("/", newHospital);
routes.put("/:id_unit", updateFullHospital);
routes.patch("/:id_unit", updatePartialHospital);
routes.delete("/:id_unit", deleteHospital);

export default routes;
