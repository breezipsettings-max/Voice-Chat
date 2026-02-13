const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

var voiceData = {}; 

// 1. THE WEBSITE INTERFACE
// This is what you see when you visit the URL in Chrome/Edge
app.get('/', function(req, res) {
    var userList = Object.keys(voiceData).map(id => `<li>User ID: ${id} [ALIVE]</li>`).join('');
    
    res.send(`
        <body style="background:#0a0a0a; color:#00ff00; font-family: 'Courier New', monospace; padding: 40px;">
            <div style="border: 2px solid #00ff00; padding: 20px; box-shadow: 0 0 15px #00ff00;">
                <h1 style="text-shadow: 2px 2px #005500;">BREEZIP GLOBAL VOICE ENGINE</h1>
                <hr style="border-color:#00ff00;">
                <p><strong>STATUS:</strong> <span style="color:white; background:green; padding:2px 5px;">OPERATIONAL</span></p>
                <p><strong>ACTIVE NODES:</strong> ${Object.keys(voiceData).length}</p>
                <div style="background:#111; padding:10px; border:1px solid #333;">
                    <p style="color:#888;">// CONNECTION_LOG:</p>
                    <ul style="list-style:none; padding:0;">
                        ${userList || '<li style="color:#555;">Waiting for connections...</li>'}
                    </ul>
                </div>
                <p style="font-size:12px; margin-top:20px; color:#444;">BANDICAM_MPEG4_COMPATIBLE // 2026_BUILD</p>
            </div>
        </body>
    `);
});

// 2. THE ROBLOX DATA RELAY
app.post('/', function(req, res) {
    var userId = req.body.userId;
    var data = req.body.data;
    
    if (userId) {
        voiceData[userId] = { 
            info: data, 
            ts: Date.now() 
        };
    }
    
    // Clean up users who haven't sent data in 5 seconds
    var now = Date.now();
    for (var id in voiceData) {
        if (now - voiceData[id].ts > 5000) {
            delete voiceData[id];
        }
    }

    res.status(200).json(voiceData);
});

var PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', function() {
    console.log("Voice Chat Yeah");
});
