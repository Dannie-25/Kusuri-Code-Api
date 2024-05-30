import express, { Request, Response } from "express";
import Controller from "../controllers/printer"

const routes = express.Router();

//Todo:Rutas de la funciones - Obtiene la peticion de del controlador para ser transmitida al HTML

//*Validar si ya esta existente una Impresora por su numero de serie
async function getPrinter(request: Request, response: Response) {
    const { serial_number } = request.params;
    try {
        const result = await Controller.getPrinter(serial_number);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene todos las Impresoras registradas
async function getPrinters(request: Request, response: Response) {
    try {
        const result = await Controller.getPrinters();
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos de la Impresora por id
async function getPrinterById(request: Request, response: Response) {
    const { id_printer } = request.params
    try {
        const result = await Controller.getPrinterById(id_printer);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos de la Impresora por id Unit
async function getPrinterByIdUnit(request: Request, response: Response) {
    const { id_unit } = request.params;
    try {
        const result = await Controller.getPrinterByIdUnit(id_unit);
        if (result) {
            response.send(result);
        } else {
            response.status(404).send({ message: "No printers found for the given unit ID." });
        }
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos de la Impresora por su nombre
async function getPrinterByName(request: Request, response: Response) {
    const { printer_type } = request.params
    try {
        const result = await Controller.getPrinterByName(printer_type);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Agregar una nueva Impresora
async function newPrinter(request: Request, response: Response) {
    const { id_unit, brand, model, serial_number, printer_type, print_format, consumable_type, printer_status, entry_type, location, comments } = request.body;
    try {
        const result = await Controller.newPrinter({
            id_unit,
            brand,
            model,
            serial_number,
            printer_type,
            print_format,
            consumable_type,
            printer_status,
            entry_type,
            location,
            comments,
        });
        response.send(result);
    } catch (error) {
        console.log(error);
        response.status(500).send(error.message);
    }
}

//*Actualiza todos los campos de la Impresora
async function updateFullPrinter(request: Request, response: Response) {
    const { id_unit, brand, model, serial_number, printer_type, print_format, consumable_type, printer_status, entry_type, location, comments, id_printer } = request.body;
    try {
        const result = await Controller.updateFullPrinter({
            id_unit,
            brand,
            model,
            serial_number,
            printer_type,
            print_format,
            consumable_type,
            printer_status,
            entry_type,
            location,
            comments,
        }, id_printer);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

    //*Actualizar algun dato en especifico del Impresora
    async function updatePartialPrinter(request: Request, response: Response) {
        const { id_unit, brand, model, serial_number, printer_type, print_format, consumable_type, printer_status, entry_type, location, comments } = request.body;
        const { id_printer } = request.params;
        const partialPrinterData = {
            id_unit,
            brand,
            model,
            serial_number,
            printer_type,
            print_format,
            consumable_type,
            printer_status,
            entry_type,
            location,
            comments,
        };
        try {
            const result = await Controller.updatePartialPrinter(partialPrinterData, id_printer);
            response.send(result);
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    //*Eliminar una Impresora por id
    async function deletePrinter(request: Request, response: Response) {
        const { id_printer } = request.params;
        try {
            const result = await Controller.deletePrinter(id_printer);
            console.log('Printer deleted');
            response.send(result);
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    //*Obtiene los datos de una Impresora por id para generar el QR
    async function createPrinterQR(request: Request, response: Response) {
        const { id_printer } = request.params;
        try {
            const qrUrl = await Controller.createPrinterQR(id_printer);
            response.send(`<img src="${qrUrl}" />`);
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    //*Todas las rutas para realizar consultas
    routes.get("/all", getPrinters);
    routes.get("/", getPrinter);
    routes.get("/id_printer/:id_printer", getPrinterById);
    routes.get("/id_unit/:id_unit", getPrinterByIdUnit);
    routes.get("/printer_type/:printer_type", getPrinterByName);
    routes.post("/", newPrinter);
    routes.put("/:id_printer", (req, res) => {
        const { id_printer } = req.params; //? Captura el id_printer de la URL
        const params = req.body; //? Captura el resto de los parámetros del cuerpo de la solicitud
        Controller.updateFullPrinter(params, id_printer)
            .then(result => res.send(result))
            .catch(error => res.status(500).send(error));
    });
    routes.patch("/:id_printer", updatePartialPrinter);
    routes.delete("/:id_printer", deletePrinter);
    routes.get("/qr/:id_printer", createPrinterQR);

    export default routes;
