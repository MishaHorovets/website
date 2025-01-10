const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3002;

const fs = require('fs');
const path = require('path');
app.use(cors());


app.get('/photo-hex', (req, res) => {
    // Path to the photo.txt file
    const filePath = path('photo.txt');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            // If there's an error reading the file, send an error response
            return res.status(500).send('Error reading file');
        }
        res.send(data);
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
