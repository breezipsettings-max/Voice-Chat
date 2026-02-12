const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

let voiceData = {};

--// WE USE THE ROOT '/' SO THERE ARE NO SUB-NAMES TO FAIL
app.post('/', (req, res) => {
    const { userId, data } = req.body;
    if (userId) {
        voiceData[userId] = { 
            audio: data, 
            ts: Date.now() 
        };
    }
    
    --// Clean up old data (older than 3 seconds) to keep it fast
    const now = Date.now();
    for (let id in voiceData) {
        if (now - voiceData[id].ts > 3000) delete voiceData[id];
    }

    res.status(200).json(voiceData);
});

--// RENDER REQUIREMENT: Listen on 0.0.0.0
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`VC RENDER SERVER RUNNING ON PORT ${PORT}`);
});
