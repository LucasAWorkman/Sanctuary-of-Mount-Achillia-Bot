const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // Parse JSON bodies

// Example in-memory storage (replace with a database later)
let robloxData = {};

// Endpoint for Roblox to send data
app.post('/roblox-data', (req, res) => {
    robloxData = req.body; // Save the posted data
    console.log("Received data from Roblox:", robloxData);
    res.sendStatus(200);
});

// Endpoint for Discord to get data
app.get('/roblox-data', (req, res) => {
    res.json(robloxData);
});

// Start the server
app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});
