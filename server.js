const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('A new client connected');
    ws.on('message', (message) => {
        const messageString = Buffer.isBuffer(message) ? message.toString() : message;

        console.log('Received message:', messageString);

        // Broadcast message to all clients as a string
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(messageString);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
