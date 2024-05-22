import express, { Request, Response } from "express";
import Controller from "../controllers/computer"

const routes = express.Router();

//*Obtener los computers desde el controller
function getComputers(request: Request, response: Response) {
    Controller.getComputers()

        .then((result) => response.send(result))
        .catch((error) => response.send(error))
}

//*Validar si ya esta existente una computadora por numero de serie
function getComputer(request: Request, response: Response) {
    const { serial_number } = request.params;
    Controller.getComputer(serial_number)
}

//*Agregar computer, llamando al controller para la solicitud
function newComputer(request: Request, response: Response) {
    const { id_unit, device_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_band, processor_model, processor_speed, inventory_number, internet, connection_type, input_type, location, comments } = request.body;

    Controller.newComputer({
        id_unit,
        device_type,
        brand,
        model,
        serial_number,
        operating_system,
        memory_capacity,
        disk_capacity,
        architecture,
        processor_band,
        processor_model,
        processor_speed,
        inventory_number,
        internet,
        connection_type,
        input_type,
        location,
        comments
    })
        .then((result) => response.send(result))
        .catch((error) => {
            console.log(error)
            response.send(error)
        })
}

//*Actualizar todos los campos del computer desde el controller
function updateFullComputer(request: Request, response: Response) {
    
    const { id_unit, device_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_band, processor_model, processor_speed, inventory_number, internet, connection_type, input_type, location, comments, id_computer} = request.body;
    Controller.updateFullComputer({
        id_unit,
        device_type,
        brand,
        model,
        serial_number,
        operating_system,
        memory_capacity,
        disk_capacity,
        architecture,
        processor_band,
        processor_model,
        processor_speed,
        inventory_number,
        internet,
        connection_type,
        input_type,
        location,
        comments
    }, id_computer)
        .then((result) => response.send(result))
        .catch((error) => response.send(error))
}

//*Actualizar algunos campos del computer desde el controller
function updatePartialComputer(request: Request, response: Response) {
    const { id_unit, device_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_band, processor_model, processor_speed, inventory_number, internet, connection_type, input_type, location, comments } = request.body;
    const { id_computer } = request.params;
    const partialComputerData = {
        id_unit,
        device_type,
        brand,
        model,
        serial_number,
        operating_system,
        memory_capacity,
        disk_capacity,
        architecture,
        processor_band,
        processor_model,
        processor_speed,
        inventory_number,
        internet,
        connection_type,
        input_type,
        location,
        comments
    };

    Controller.updatePartialComputer(partialComputerData, id_computer)
        .then((result) => response.send(result))
        .catch((error) => response.send(error));
}

function deleteComputer(request: Request, response: Response){
    const { id_computer } = request.params;
    Controller.deleteComputer(id_computer)
        .then((result) => {
            console.log('Computer deleted')
            response.send(result)
    })
        .catch((error) => response.send(error))
}

//*Todas las rutas para realizar consultas
routes.get("/all", getComputers);
routes.get("/", getComputer);
routes.post("/", newComputer);
//!Tratamiento de error para actualizar los datos de manera full
routes.put("/:id_computer", (req, res) => {
    const { id_computer } = req.params; //? Captura el id_computer de la URL
    const params = req.body; //? Captura el resto de los parámetros del cuerpo de la solicitud
    Controller.updateFullComputer(params, id_computer)
        .then(result => res.send(result))
        .catch(error => res.status(500).send(error));
});
routes.patch("/:id_computer", updatePartialComputer);
routes.delete("/:id_computer", deleteComputer);

export default routes;
