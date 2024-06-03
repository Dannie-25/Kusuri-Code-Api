import * as mysql from 'mysql2/promise';
import { DB_HOST, DB_USER, DB_NAME, DB_PASSWORD, DB_PORT } from "../../utils/configs/configs";

//*Conexión a la Base de Datos
const access: mysql.ConnectionOptions = {
  user: DB_USER,
  database: DB_NAME,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: Number(DB_PORT),
};

const conn = mysql.createConnection(access);

export default conn;