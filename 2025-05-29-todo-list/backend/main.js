
const express = require('express'); // Importa il framework Express per creare un server web
const mysql = require('mysql2'); // Importa il modulo mysql2 per connettersi a un database MySQL
const cors = require('cors'); // Importa il middleware CORS per gestire le richieste cross-origin

const app = express(); // Crea un'applicazione Express
app.use(express.json()); // Usa il middleware per parsare il corpo delle richieste in formato JSON
app.use(cors()); // Usa il middleware CORS per permettere richieste da altri domini

// Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',      // Il server MySQL è sulla tua macchina
    user: 'myuser',        // Username per accedere al database
    password: 'mypass',    // Password per accedere al database
    database: 'mydb'       // Nome del database che vuoi usare
});

// Test connection 
db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Endpoint per ottenere tutte le note dal database
app.get('/api/notes', (req, res) => {
    const listId = req.query.list_id;

    if (!listId) {
        return res.status(400).json({ error: 'Parametro list_id obbligatorio' });
    }

    const query = 'SELECT * FROM notes WHERE list_id = ?';
    db.query(query, [listId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Errore DB' });
        }
        res.json(results);
    });
});

// Endpoint per ottenere tutte le liste
app.get('/api/lists', (req, res) => {
    const query = 'SELECT * FROM lists';  // Prendi tutte le liste
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Errore DB' });
        }
        res.json(results); // Manda le liste al frontend
    });
});



// Aggiunge una nuova nota al database
app.post('/api/notes/add', (req, res) => {
    const { note, status = false, list_id } = req.body;

    if (!note || !list_id) {
        return res.status(400).json({ error: 'Nota e list_id sono obbligatori' });
    }

    const insertQuery = 'INSERT INTO notes (note, status, list_id) VALUES (?, ?, ?)';
    db.query(insertQuery, [note, status, list_id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore DB' });
        res.json(results);
    });
});

// Aggiungi una nuova lista
app.post('/api/lists/add', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Nome lista obbligatorio' });

    db.query('INSERT INTO lists (name) VALUES (?)', [name], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore DB' });
        res.json(results);
    });
});

// Aggiorna una nota esistente nel database
app.put('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const { note, status } = req.body;

    let query, params;

    if (note !== undefined && status !== undefined) {
        query = 'UPDATE notes SET note = ?, status = ? WHERE id = ?';
        params = [note, status, id];
    } else if (note !== undefined) {
        query = 'UPDATE notes SET note = ? WHERE id = ?';
        params = [note, id];
    } else if (status !== undefined) {
        query = 'UPDATE notes SET status = ? WHERE id = ?';
        params = [status, id];
    } else {
        return res.status(400).json({ error: 'Nessun campo da aggiornare' });
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore DB' });
        res.json({ success: true });
    });
});


// Elimina tutte le note completate dal database
app.delete('/api/notes/completed', (req, res) => { // Endpoint per eliminare tutte le note completate
    db.query('DELETE FROM notes WHERE status = true', (err, result) => { // Elimina le note con status true
        if (err) return res.status(500).json({ error: 'Errore DB' });
        res.json({ success: true });
    });
});


// Elimina una nota specifica dal database
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM notes WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Errore DB' });
        res.json({ success: true });
    });
});



// Avvia il server. Il server inizia ad ascoltare sulla porta 3000 le richieste HTTP
app.listen(3000, () => console.log('Server listening on http://localhost:3000'));

console.log("Funziona");