const WebSocket = require('ws');
const express = require('express');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

//get curr time  
function set_time() {
  var d = new Date();
  var c_hour = d.getHours();
  var c_min = d.getMinutes();var c_sec = d.getSeconds();
  var t = c_hour + ":" + c_min + ":" + c_sec;
  return t;
}


// currently opened serial port 
let currentPort = null;
app.post('/read-pico', (req, res) => {

  const { path } = req.body;
  
  //close the current port if it is opened 
  if (currentPort && currentPort.isOpen) {
    currentPort.close((err) => {
      if (err) {
        console.error(`Error closing port ${currentPort.path}:`, err.message);
      }
      console.log(`Port ${currentPort.path} closed`);
    });
  }


  if (!path) {
    return res.status(400).json({ success: false, error: 'No Pico path provided.' });
  }

  const port = new SerialPort({ path: path, baudRate: 115200 }, (err) => {
    if (err) {
      console.error(`Error opening port ${path}:`, err.message);
      return res.status(500).json({ success: false, error: 'Failed to open serial port.' });
    }
  });
  currentPort = port;

  const parser = new ReadlineParser();
  port.pipe(parser);

  let dt = null;
  parser.on('data', (data) => {
    dt = data.toString();
    console.log('Data received:', data.toString());
    // i need to traverse the data that i receive from pico 
    // and if this equals to Good to go i need to setWifi to true   
    if (data.toString() === "Good to go") {
      setWifiStatus(true);
    }
  });
  res.json({ success: true, message: dt });
});
// Endpoint to send data to a Pico
app.post('/send-data', (req, res) => {
  const { picoPath, message } = req.body;
  if (!picoPath || !message) {
    return res.status(400).json({ success: false, error: 'picoPath and message are required' });
  }
  // Open the serial port
  const selectedPort = new SerialPort({ path: picoPath, baudRate: 115200 }, (err) => {
    if (err) {
      console.error(`Error opening port ${picoPath}:`, err.message);
      return res.status(500).json({ success: false, error: 'Failed to open serial port.' });
    }

    
    console.log(`Received message for Pico at ${picoPath}:`, message);
    //print the data from the serial port 
    // Write message to the serial port
    selectedPort.write(`${message}\n`, (writeErr) => {
      if (writeErr) {
        console.error(`Error writing to port ${picoPath}:`, writeErr.message);
        selectedPort.close(); // Ensure port is closed on failure
        return res.status(500).json({ success: false, error: 'Failed to send message to Pico.' });
      }

      console.log(`Message successfully sent to Pico at ${picoPath}`);
      res.json({ success: true, receivedMessage: message });

      // Close the port after operation
      selectedPort.close((closeErr) => {
        if (closeErr) {
          console.error(`Error closing port ${picoPath}:`, closeErr.message);
        }
      });
    });
  });
});

// REST API endpoint to fetch connected Picos
app.get('/get-connected-picos', async (req, res) => {
  try {
    const ports = await SerialPort.list();
    const picos = ports.filter(
      (port) => port.manufacturer && port.manufacturer.includes('Raspberry Pi')
    );
    res.json(picos);
  } catch (err) {
    console.error('Error listing serial ports:', err);
    res.status(500).json({ error: 'Failed to get connected devices' });
  }
});

// WebSocket server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });


wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  const sendPicoUpdates = async () => {
    try {
      const ports = await SerialPort.list();
      const picos = ports.filter(
        (port) => port.manufacturer && port.manufacturer.includes('Raspberry Pi')
      );
      ws.send(JSON.stringify(picos));
    } catch (err) {
      console.error('Error listing serial ports:', err);
      ws.send(JSON.stringify({ error: 'Failed to fetch connected devices' }));
    }
  };

  // Send updates every 0.5 seconds
  const interval = setInterval(sendPicoUpdates, 500);

  // Initial data push
  sendPicoUpdates();

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    clearInterval(interval);
  });
});
