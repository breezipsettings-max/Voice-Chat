const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

var voiceData = {}; 

// Root route to handle global sync
app.post('/', function(req, res) {
    var userId = req.body.userId;
    var data = req.body.data; 
    
    if (userId) {
        voiceData[userId] = { 
            info: data, 
            ts: Date.now() 
        };
    }
    
    // Return the global state so other clients can see the "Dead Icon" and "Mic"
    res.status(200).json(voiceData);
});

// CLEANUP: Run this once every 5 seconds instead of every request
setInterval(function() {
    var now = Date.now();
    for (var id in voiceData) {
        if (now - voiceData[id].ts > 5000) { // Increased to 5s to prevent flickering
            delete voiceData[id];
        }
    }
}, 5000);

var PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', function() {
    console.log("GLOBAL VC SERVER ACTIVE ON PORT " + PORT);
});
