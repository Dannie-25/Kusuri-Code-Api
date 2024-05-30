import express, { Request, Response } from "express";
import Controller from "../controllers/computer"

const routes = express.Router();

//Todo:Rutas de la funciones - Obtiene la peticion de del controlador para ser transmitida al HTML

//*Validar si ya esta existente un Equipo por su numero de serie
async function getComputer(request: Request, response: Response) {
    const { serial_number } = request.params;
    try {
        const result = await Controller.getComputer(serial_number);
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
    const { id_equipment } = request.params
    try {
        const result = await Controller.getComputerById(id_equipment);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos del Equipo por id_unit
async function getComputerByIdUnit(request: Request, response: Response) {
    const { id_unit } = request.params;
    try {
        const result = await Controller.getComputerByIdUnit(id_unit);
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
    const { equipment_type } = request.params
    try {
        const result = await Controller.getComputerByName(equipment_type);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Agregar nuevo Equipo
async function newComputer(request: Request, response: Response) {
    const { id_unit, equipment_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_brand, processor_model, processor_speed, inventory_number, internet, connection_type, entry_type, location, comments } = request.body;
    try {
        const result = await Controller.newComputer({
            id_unit,
            equipment_type,
            brand,
            model,
            serial_number,
            operating_system,
            memory_capacity,
            disk_capacity,
            architecture,
            processor_brand,
            processor_model,
            processor_speed,
            inventory_number,
            internet,
            connection_type,
            entry_type,
            location,
            comments
        });
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Actualiza todos los campos del Equipo
async function updateFullComputer(request: Request, response: Response) {
    const { id_unit, equipment_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_brand, processor_model, processor_speed, inventory_number, internet, connection_type, entry_type, location, comments, id_equipment } = request.body;
    try {
        const result = await Controller.updateFullComputer({
            id_unit,
            equipment_type,
            brand,
            model,
            serial_number,
            operating_system,
            memory_capacity,
            disk_capacity,
            architecture,
            processor_brand,
            processor_model,
            processor_speed,
            inventory_number,
            internet,
            connection_type,
            entry_type,
            location,
            comments
        }, id_equipment);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Actualiza algun dato en especifico del Equipo
async function updatePartialComputer(request: Request, response: Response) {
    const { id_unit, equipment_type, brand, model, serial_number, operating_system, memory_capacity, disk_capacity, architecture, processor_brand, processor_model, processor_speed, inventory_number, internet, connection_type, entry_type, location, comments } = request.body;
    const { id_equipment } = request.params;
    const partialComputerData = {
        id_unit,
        equipment_type,
        brand,
        model,
        serial_number,
        operating_system,
        memory_capacity,
        disk_capacity,
        architecture,
        processor_brand,
        processor_model,
        processor_speed,
        inventory_number,
        internet,
        connection_type,
        entry_type,
        location,
        comments
    };
    try {
        const result = await Controller.updatePartialComputer(partialComputerData, id_equipment);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Eliminar un Equipo por id
async function deleteComputer(request: Request, response: Response) {
    const { id_equipment } = request.params;
    try {
        const result = await Controller.deleteComputer(id_equipment);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos de un Equipo por id para generar el QR
async function createComputerQR(request: Request, response: Response) {
    const { id_equipment } = request.params;
    try {
        const qrUrl = await Controller.createComputerQR(id_equipment);
        response.send(`<img src="${qrUrl}" />`);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Todas las rutas para realizar consultas
routes.get("/all", getComputers);
routes.get("/", getComputer);
routes.get("/id_equipment/:id_equipment", getComputerById);
routes.get("/id_unit/:id_unit", getComputerByIdUnit);
routes.get("/equipment_type/:equipment_type", getComputerByName);
routes.post("/", newComputer);
routes.put("/:id_equipment", (req, res) => {
    const { id_equipment } = req.params; //? Captura el id_equipment de la URL
    const params = req.body; //? Captura el resto de los parámetros del cuerpo de la solicitud
    Controller.updateFullComputer(params, id_equipment)
        .then(result => res.send(result))
        .catch(error => res.status(500).send(error));
});
routes.patch("/:id_equipment", updatePartialComputer);
routes.delete("/:id_equipment", deleteComputer);
routes.get("/qr/:id_equipment", createComputerQR);

export default routes;
