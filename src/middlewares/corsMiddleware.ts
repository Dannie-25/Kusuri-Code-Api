const cors = require ('cors');

//*Peticiones HTML para la API
const corsMiddleware = cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
});

export default corsMiddleware;