import express, { Request, Response } from "express";
import Controller from "../controllers/printer"

const routes = express.Router();

//Todo:Rutas de la funciones - Obtiene la peticion de del controlador para ser transmitida al HTML

//*Validar si ya esta existente una Impresora por su numero de serie
async function getPrinter(request: Request, response: Response) {
    const { numero_serie } = request.params;
    try {
        const result = await Controller.getPrinter(numero_serie);
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
    const { id_impresora } = request.params
    try {
        const result = await Controller.getPrinterById(id_impresora);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos de la Impresora por id Unit
async function getPrinterByIdUnit(request: Request, response: Response) {
    const { id_unidad } = request.params;
    try {
        const result = await Controller.getPrinterByIdUnit(id_unidad);
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
    const { tipo_impresora } = request.params
    try {
        const result = await Controller.getPrinterByName(tipo_impresora);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Agregar una nueva Impresora
async function newPrinter(request: Request, response: Response) {
    const { id_unidad, marca, modelo, numero_serie, tipo_impresora, formato_impresion, tipo_consumible, estado_impresora, tipo_ingreso, ubicacion, comentarios } = request.body;
    try {
        const result = await Controller.newPrinter({
            id_unidad,
            marca,
            modelo,
            numero_serie,
            tipo_impresora,
            formato_impresion,
            tipo_consumible,
            estado_impresora,
            tipo_ingreso,
            ubicacion,
            comentarios,
        });
        response.send(result);
    } catch (error) {
        console.log(error);
        response.status(500).send(error.message);
    }
}

//*Actualiza todos los campos de la Impresora
async function updateFullPrinter(request: Request, response: Response) {
    const { id_unidad, marca, modelo, numero_serie, tipo_impresora, formato_impresion, tipo_consumible, estado_impresora, tipo_ingreso, ubicacion, comentarios, id_impresora } = request.body;
    try {
        const result = await Controller.updateFullPrinter({
            id_unidad,
            marca,
            modelo,
            numero_serie,
            tipo_impresora,
            formato_impresion,
            tipo_consumible,
            estado_impresora,
            tipo_ingreso,
            ubicacion,
            comentarios,
        }, id_impresora);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Actualizar algun dato en especifico del Impresora
async function updatePartialPrinter(request: Request, response: Response) {
    const { id_unidad, marca, modelo, numero_serie, tipo_impresora, formato_impresion, tipo_consumible, estado_impresora, tipo_ingreso, ubicacion, comentarios } = request.body;
    const { id_impresora } = request.params;
    const partialPrinterData = {
        id_unidad,
        marca,
        modelo,
        numero_serie,
        tipo_impresora,
        formato_impresion,
        tipo_consumible,
        estado_impresora,
        tipo_ingreso,
        ubicacion,
        comentarios,
    };
    try {
        const result = await Controller.updatePartialPrinter(partialPrinterData, id_impresora);
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Eliminar una Impresora por id
async function deletePrinter(request: Request, response: Response) {
    const { id_impresora } = request.params;
    try {
        const result = await Controller.deletePrinter(id_impresora);
        console.log('Printer deleted');
        response.send(result);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Obtiene los datos de una Impresora por id para generar el QR
async function createPrinterQR(request: Request, response: Response) {
    const { id_impresora } = request.params;
    try {
        const qrUrl = await Controller.createPrinterQR(id_impresora);
        response.send(`<img src="${qrUrl}" />`);
    } catch (error) {
        response.status(500).send(error.message);
    }
}

//*Todas las rutas para realizar consultas
routes.get("/all", getPrinters);
routes.get("/", getPrinter);
routes.get("/id_impresora/:id_impresora", getPrinterById);
routes.get("/id_unidad/:id_unidad", getPrinterByIdUnit);
routes.get("/tipo_impresora/:tipo_impresora", getPrinterByName);
routes.post("/", newPrinter);
routes.put("/:id_impresora", (req, res) => {
    const { id_impresora } = req.params; //? Captura el id_impresora de la URL
    const params = req.body; //? Captura el resto de los parámetros del cuerpo de la solicitud
    Controller.updateFullPrinter(params, id_impresora)
        .then(result => res.send(result))
        .catch(error => res.status(500).send(error));
});
routes.patch("/:id_impresora", updatePartialPrinter);
routes.delete("/:id_impresora", deletePrinter);
routes.get("/qr/:id_impresora", createPrinterQR);

export default routes;
