const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const FILE_PATH = path.join(__dirname, '../data.json');

let data = {
    quicknote: "",
    passwords: [],
    categories: []
};

if (fs.existsSync(FILE_PATH)) {
    data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
}

const saveData = () => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data));
};

module.exports = {
    getData: () => data,

    saveQuickNote: (content) => {
        data.quicknote = content;
        saveData();
    },

    resetQuickNote: () => {
        data.quicknote = "";
        saveData();
    },

    savePassword: (password) => {
        const existingIndex = data.passwords.findIndex(p => p.id === password.id);
        if (existingIndex !== -1) {
            data.passwords[existingIndex] = password;
        } else {
            data.passwords.push(password);
        }
        saveData();
    },

    deletePassword: (id) => {
        data.passwords = data.passwords.filter(p => p.id !== id);
        saveData();
    },

    searchNotes: (query) => {
        return data.categories
            .flatMap(category => category.notes)
            .filter(note => note.title.toLowerCase().includes(query.toLowerCase()));
    }
};
