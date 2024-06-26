import { Application } from "express";
import Routes from "../utils/constants/routes.json";
import UserNetwork from "../network/user";
import ComputerNetwork from "../network/computer";
import HospitalNetwork from "../network/hospital";
import PrinterNetwork from "../network/printer";

//*Conexión de routes con el network 
function routes(servidor:Application){
    servidor.use(Routes.user, UserNetwork)
    servidor.use(Routes.computer, ComputerNetwork)
    servidor.use(Routes.hospital, HospitalNetwork)
    servidor.use(Routes.printer, PrinterNetwork)
}

export default routes;