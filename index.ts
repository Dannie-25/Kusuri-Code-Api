
import express from "express";
import routes from "./src/routes";
import corsMiddleware from "./src/middlewares/corsMiddleware";
import { initial } from "./src/services/serviceLocator/composer";
import "./src/services/auth";


const server = express();

server.use(corsMiddleware);
server.use(express.json());
routes (server)

initial()

server.listen(9000, function(){
    console.log("Server is listening on port 9000");
})

