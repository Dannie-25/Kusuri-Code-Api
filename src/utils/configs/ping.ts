const axios = require('axios');
const cron = require('node-cron');

// URL de tu API
const apiURL = 'https://kusuri-code-api.up.railway.app/v1/hospital/all';

// Función para hacer el ping
const pingAPI = async () => {
  try {
    const response = await axios.get(apiURL);
    console.log(`Ping successful: ${response.status}`);
  } catch (error) {
    console.error(`Ping failed: `);
  }
};

// Programa la tarea para que se ejecute cada 30 minutos
cron.schedule('0 */30 * * * *', () => {
  console.log('Pinging API...');
  pingAPI();
});

console.log('Ping service started...');