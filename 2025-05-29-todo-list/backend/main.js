
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

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

// Api Endpoints
app.get('/api/notes', (req, res) => {
    const query = 'SELECT * FROM notes';  // Prende TUTTE le note dal database
    db.query(query, (err, results) => {   // Esegue la query
        if (err) {                        // Se c'è un errore
            console.error(err);           // Lo mostra nella console
            return res.status(500).json({ error: 'Errore DB' }); // Manda errore al client
        }
        res.json(results);               // Altrimenti manda i risultati al client
    });
});

// Aggiunge una nuova nota al database
app.post('/api/notes/add', (req, res) => {
    const note = req.body.note;           // Prende il testo della nota dalla richiesta
    const status = req.body.status || false;  // Prende lo status (se non c'è usa false)
    
    // Usa ? come placeholder per prevenire SQL injection
    const insertQuery = 'INSERT INTO notes (note, status) VALUES (?, ?)';
    
    // Passa i valori separatamente come array
    db.query(insertQuery, [note, status], (err, results) => {
        if (err) return res.status(500).send(err);  // Se c'è errore, lo manda al client
        res.json(results);                          // Altrimenti manda il risultato
    });
});

/*
// Elimina una nota dal database
app.delete('/api/notes/:id', (req, res) => {
    const id =req.params.id;  // Prende l'ID della nota dalla richiesta
    db.query('DELETE FROM notes WHERE id = ?', [id], (err, result) => { // Uso l'ID come parametro per prevenire SQL injection
            if (err) return res.status(500).json({ error: 'Errore DB' });
            res.json({ success: true });  // Manda una risposta di successo
        }
    );
}
);
*/

// Elimina tutte le note completate dal database
app.delete('/api/notes/completed', (req, res) => { // Endpoint per eliminare tutte le note completate
    db.query('DELETE FROM notes WHERE status = true', (err, result) => { // Elimina le note con status true
        if (err) return res.status(500).json({ error: 'Errore DB' });
        res.json({ success: true });
    });
});

// Aggiorna lo stato della nota nel database
app.put('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    db.query(
        'UPDATE notes SET status = ? WHERE id = ?',
        [status, id],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Errore DB' });
            res.json({ success: true });
        }
    );
});

// Avvia il server. Il server inizia ad ascoltare sulla porta 3000 le richieste HTTP
app.listen(3000, () => console.log('Server listening on http://localhost:3000'));

console.log("Funziona");