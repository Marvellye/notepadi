const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'notes.json');

app.use(express.static('public'));

// Load existing notes
let notes = {};
if (fs.existsSync(FILE_PATH)) {
    notes = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
}

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle socket connections
io.on('connection', (socket) => {
    // Send current notes to new clients
    socket.emit('loadNotes', notes);

    socket.on('saveNote', (data) => {
        notes[data.id] = data.content;

        // Save notes to file
        fs.writeFileSync(FILE_PATH, JSON.stringify(notes));

        // Broadcast the updated notes to all connected clients
        io.emit('noteUpdated', data);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
