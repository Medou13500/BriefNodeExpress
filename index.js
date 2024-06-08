const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configurer body-parser pour analyser les corps des requêtes en JSON
app.use(bodyParser.json());

// Déclaration initiale des utilisateurs
const users = [
    { name: 'Alice', age: 25, email: 'alice@example.com' },
    { name: 'Bob', age: 30, email: 'bob@example.com' },
    { name: 'Moh', age: 38, email: 'moh@yahoo.fr' }
];

// Route de bienvenue
app.get('/', (req, res) => {
    res.send('Bienvenue sur ma page ExpressJS');
});

// Route pour récupérer la liste des utilisateurs
app.get('/users', (req, res) => {
    res.json(users);
});

// Route pour ajouter un nouvel utilisateur
app.post('/users', (req, res) => {
    const { name, age, email } = req.body;  // Destructuration pour extraire les données
    if (users.some(user => user.email === email)) {
        return res.status(409).send('Un utilisateur avec cet email existe déjà.');
    }
    const newUser = { name, age, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Route pour mettre à jour un utilisateur par son nom
app.patch('/users/:name', (req, res) => {
    const { name } = req.params;
    const { name : newName, age, email } = req.body;

    const userIndex = users.findIndex(user => user.name.trim().toLowerCase() === name.trim().toLowerCase());
    if (userIndex !== -1) {
        if (newName && newName.trim()) {
            users[userIndex].name = newName.trim();
        }
        if (age !== undefined) {
            users[userIndex].age = age;
        }
        if (email && !users.some((user, idx) => user.email === email && idx !== userIndex)) {
            users[userIndex].email = email;
        }
        res.json(users[userIndex]);
    } else {
        res.status(404).send('Utilisateur non trouvé');
    }
});
app.delete('/users/:name', (req, res) => {
    const { name } = req.params;
    console.log("Nom recherché:", name);
    console.log("Utilisateurs disponibles:", users.map(u => u.name));
    const userIndex = users.findIndex(user => user.name.trim().toLowerCase() === name.trim().toLowerCase());

    if (userIndex !== -1) {
        users.splice(userIndex, 1); // Supprime l'utilisateur du tableau
        res.send('Utilisateur supprimé avec succès.');
    } else {
        res.status(404).send('Utilisateur non trouvé');
    }
});


// Démarrage du serveur sur le port spécifié
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
