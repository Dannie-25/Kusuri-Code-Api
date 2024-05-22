import * as mysql from 'mysql2/promise';
import "dotenv/config"

//*Conexión a la base de datos con su configuración
const access: mysql.ConnectionOptions = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
  };
  
  const conn = mysql.createConnection(access);

  export default conn;