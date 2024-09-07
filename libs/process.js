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

    saveCategory: (category) => {
        const existingIndex = data.categories.findIndex(c => c.id === category.id);
        if (existingIndex !== -1) {
            data.categories[existingIndex] = category;
        } else {
            data.categories.push(category);
        }
        saveData();
    },

    deleteCategory: (id) => {
        data.categories = data.categories.filter(c => c.id !== id);
        saveData();
    },

    deleteNote: (categoryId, noteId) => {
        const category = data.categories.find(c => c.id === categoryId);
        if (category) {
            category.notes = category.notes.filter(n => n.id !== noteId);
            saveData();
        }
    },

    searchNotes: (query) => {
        return data.categories
            .flatMap(category => category.notes)
            .filter(note => note.title.toLowerCase().includes(query.toLowerCase()));
    }
};
