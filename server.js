const express = require('express');
const app = express();
app.use(express.json());

let voiceStreams = {}; // Holds global buffers

app.post('/send', (req, res) => {
    const { userId, audioData } = req.body;
    voiceStreams[userId] = audioData;
    res.sendStatus(200);
});

app.get('/receive', (req, res) => {
    res.json(voiceStreams);
});

app.listen(3000, () => console.log("Render Server Active"));
