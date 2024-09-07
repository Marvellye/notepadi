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
    socket.emit('loadData', process.getData());

    socket.on('saveQuickNote', (data) => {
        process.saveQuickNote(data.content);
        io.emit('quicknoteUpdated', data);
    });

    socket.on('resetQuickNote', () => {
        process.resetQuickNote();
        io.emit('quicknoteReset');
    });

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
