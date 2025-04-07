const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); 

let robloxData = {};

app.post('/roblox-data', (req, res) => {
    robloxData = req.body; 
    console.log("Received data from Roblox:", robloxData);
    res.sendStatus(200);
});

app.get('/roblox-data', (req, res) => {
    res.json(robloxData);
});

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});
