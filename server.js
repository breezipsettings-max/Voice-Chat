const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

var voiceData = {}; // Use var to be safe on older parsers

// Root route to handle everything
app.post('/', function(req, res) {
    var userId = req.body.userId;
    var data = req.body.data;
    
    if (userId) {
        voiceData[userId] = { 
            audio: data, 
            ts: Date.now() 
        };
    }
    
    // Clean up data older than 3 seconds
    var now = Date.now();
    for (var id in voiceData) {
        if (now - voiceData[id].ts > 3000) {
            delete voiceData[id];
        }
    }

    res.status(200).json(voiceData);
});

// Port binding for Render
var PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', function() {
    console.log("VC SERVER ACTIVE ON PORT " + PORT);
});
