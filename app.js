const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'notes.json');

app.use(express.static('public'));

let notes = { text: "", passwords: [] };
if (fs.existsSync(FILE_PATH)) {
    notes = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    socket.emit('loadNotes', notes);

    socket.on('saveNote', (data) => {
        notes.text = data.content;
        fs.writeFileSync(FILE_PATH, JSON.stringify(notes));
        io.emit('noteUpdated', data);
    });

    socket.on('savePassword', (data) => {
        const index = notes.passwords.findIndex(p => p.id === data.id);
        if (index !== -1) {
            notes.passwords[index] = data;
        } else {
            notes.passwords.push(data);
        }
        fs.writeFileSync(FILE_PATH, JSON.stringify(notes));
        io.emit('passwordUpdated', data);
    });

    socket.on('deletePassword', (id) => {
        notes.passwords = notes.passwords.filter(p => p.id !== id);
        fs.writeFileSync(FILE_PATH, JSON.stringify(notes));
        io.emit('passwordDeleted', id);
    });

    socket.on('refreshPasswords', () => {
        socket.emit('loadNotes', notes);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
