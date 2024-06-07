const cors = require ('cors');

//*Peticiones HTML para la API
const corsMiddleware = cors({
    origin: '*',
    optionsSuccessStatus: 200,
    credentials: true
});

export default corsMiddleware;