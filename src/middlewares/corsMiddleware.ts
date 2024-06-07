const cors = require ('cors');

//*Peticiones HTML para la API
const corsMiddleware = cors({
    origin: 'kusuri-code-api.up.railway.app',
    optionsSuccessStatus: 200,
});

export default corsMiddleware;