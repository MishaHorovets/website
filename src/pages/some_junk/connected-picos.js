const express = require('express');
const { SerialPort } = require('serialport');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());

// Endpoint to get connected devices
app.get('/get-connected-picos', (req, res) => {
  SerialPort.list().then(ports => {
    const picos = ports.filter(port => port.manufacturer && port.manufacturer.includes('Raspberry Pi'));
    console.log(picos);
    res.json(picos);
  }).catch(err => {
    console.error("Error listing serial ports:", err);
    res.status(500).json({ error: "Failed to get connected devices" });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
