const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;
const RENDER_URL= 'https://dominion-fc.onrender.com';

app.use(cors());

app.use('/api', async (req, res) => {
  try {
    const url = `${RENDER_URL}${req.url}`;
    const response = await axios({
      method: req.method,
      url: url,
      data: req.body,
      headers: req.headers,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});



// Keep the Render app awake by pinging it every 10 minutes
setInterval(async () => {
  try {
    await axios.get(`${RENDER_URL}/health`); // Add a health check route in your app
    console.log('Render app pinged');
  } catch (error) {
    console.error('Error pinging Render app:', error.message);
  }
}, 40 * 1000); // Every 40 sec

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
