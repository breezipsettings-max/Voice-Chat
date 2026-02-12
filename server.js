const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); 

let globalVoiceBuffer = {}; 

app.post('/sync', (req, res) => {
    const { userId, audioChunk, timestamp } = req.body;
    
    // Store the audio chunk with a timestamp
    globalVoiceBuffer[userId] = {
        data: audioChunk,
        time: timestamp
    };

    // Only send back data that is NEW (less than 2 seconds old)
    let freshData = {};
    const now = Date.now();
    for (let id in globalVoiceBuffer) {
        if (now - globalVoiceBuffer[id].time < 2000) {
            freshData[id] = globalVoiceBuffer[id].data;
        }
    }

    res.json(freshData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`VC Render Server live on port ${PORT}`));
