const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { SerialPort } = require('serialport');

const app = express();
const PORT = 3002;

// Enable CORS for cross-origin requests
app.use(cors());

// Path to the photo.txt file
const filePath = path.join(__dirname, 'photo.txt');

// Serial port configuration (adjust as needed)
const picoPort = new SerialPort({
    path: '/dev/tty.usbmodem14501', // Replace with your Pico's serial port path (e.g., COM3 on Windows)
    baudRate: 115200,
});

// Handle requests for pixel data
app.get('/photo-hex', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        // Send the pixel data to the Pico
        picoPort.write(data.trim() + "\n", (err) => {
            if (err) {
                console.error('Error sending data to Pico:', err);
                return res.status(500).send('Error sending data to Pico');
            }
            console.log('Pixel data sent to Pico.');
            res.send('Pixel data sent to Pico successfully');
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
