import express, { Request, Response } from "express";
import Controller from "../controllers/printer"

const routes = express.Router();

//Todo:Rutas de la funciones - Obtiene la peticion de del controlador para ser transmitida al HTML

//*Validar si ya esta existente una Impresora por su numero de serie
function getPrinter(request: Request, response: Response) {
    const { serial_number } = request.params;
    Controller.getPrinter(serial_number)
}

//*Obtiene todos las Impresoras registradas
function getPrinters(request: Request, response: Response) {
    Controller.getPrinters()

        .then((result) => response.send(result))
        .catch((error) => response.send(error))
}

//*Obtiene los datos de la Impresora por id
function getPrinterById(request: Request, response: Response) {
    const { id_printer } = request.params
    Controller.getPrinterById(id_printer)
    .then((result) => {
        response.send(result)
    })
        .catch((error) => response.send(error))
}

//*Obtiene los datos de la Impresora por id Unit
function getPrinterByIdUnit(request: Request, response: Response) {
    const { id_unit } = request.params
    Controller.getPrinterByIdUnit(id_unit)
    .then((result) => {
        response.send(result)
    })
        .catch((error) => response.send(error))
}

//*Obtiene los datos de la Impresora por su nombre
function getPrinterByName(request: Request, response: Response) {
    const { printer_type } = request.params
    Controller.getPrinterByName(printer_type)
    .then((result) => {
        response.send(result)
    })
        .catch((error) => response.send(error))
}

//*Agregar una nueva Impresora
function newPrinter(request: Request, response: Response) {
    const { id_unit, brand, model, serial_number, printer_type, print_format, consumable_type, printer_status, entry_type, location, comments } = request.body;

    Controller.newPrinter({
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
    })
        .then((result) => response.send(result))
        .catch((error) => {
            console.log(error)
            response.send(error)
        })
}

//*Actualiza todos los campos de la Impresora
function updateFullPrinter(request: Request, response: Response) {
    
    const { id_unit, brand, model, serial_number, printer_type, print_format, consumable_type, printer_status, entry_type, location, comments, id_printer} = request.body;
    Controller.updateFullPrinter({
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
    }, id_printer)
        .then((result) => response.send(result))
        .catch((error) => response.send(error))
}

//*Actualizar algun dato en especifico del Impresora
function updatePartialPrinter(request: Request, response: Response) {
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

    Controller.updatePartialPrinter(partialPrinterData, id_printer)
        .then((result) => response.send(result))
        .catch((error) => response.send(error));
}

//*Eliminar una Impresora por id
function deletePrinter(request: Request, response: Response){
    const { id_printer } = request.params;
    Controller.deletePrinter(id_printer)
        .then((result) => {
            console.log('Printer deleted')
            response.send(result)
    })
        .catch((error) => response.send(error))
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
