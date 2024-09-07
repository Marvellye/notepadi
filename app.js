const express = require('express');
const path = require('path');
const process = require('./libs/process');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    // Send initial data to the client
    socket.emit('loadData', process.getData());

    // Handle Quicknote updates with latency
    let quicknoteTimeout;
    socket.on('saveQuickNote', (data) => {
        if (quicknoteTimeout) clearTimeout(quicknoteTimeout);
        quicknoteTimeout = setTimeout(() => {
            process.saveQuickNote(data.content);
            socket.broadcast.emit('quicknoteUpdated', data.content); // Broadcast update to other clients
        }, 1000); // Adjust latency here
    });

    socket.on('resetQuickNote', () => {
        process.resetQuickNote();
        io.emit('quicknoteReset'); // Broadcast reset to all clients
    });

    // Handle Password actions
    socket.on('savePassword', (data) => {
        process.savePassword(data);
        io.emit('passwordUpdated', data);
    });

    socket.on('deletePassword', (id) => {
        process.deletePassword(id);
        io.emit('passwordDeleted', id);
    });

    socket.on('searchNotes', (query) => {
        const results = process.searchNotes(query);
        socket.emit('searchResults', results);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
