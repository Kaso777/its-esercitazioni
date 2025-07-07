/* Questo file contiene i comandi per creare un server Node.js che gestisce una semplice applicazione di Todo List.
    Il server si connette a un database MySQL e fornisce API per gestire liste e note.
    Nella pratica in questo codice sono implementati i seguenti endpoint:
    - GET /api/notes: per ottenere tutte le note di una lista specifica
    - GET /api/lists: per ottenere tutte le liste
    - POST /api/notes/add: per aggiungere una nuova nota
    - POST /api/lists/add: per aggiungere una nuova lista
    - PUT /api/notes/:id: per aggiornare una nota esistente
    - DELETE /api/notes/completed: per eliminare tutte le note completate
    - DELETE /api/notes/:id: per eliminare una nota specifica

*/


const express = require('express'); // Importa il framework Express per creare un server web
const mysql = require('mysql2'); // Importa il modulo mysql2 per connettersi a un database MySQL
const cors = require('cors'); // Importa il middleware CORS per gestire le richieste cross-origin

const app = express(); // Crea un'applicazione Express che gestirà le richieste HTTP
app.use(express.json()); // Usa il middleware per parsare il corpo delle richieste in formato JSON
app.use(cors()); // Usa il middleware CORS per permettere richieste da altri domini

// Crea una connessione al database MySQL con questa configurazione
const db = mysql.createConnection({
    host: 'localhost',      // Il server MySQL è sulla tua macchina
    user: 'myuser',        // Username per accedere al database
    password: 'mypass',    // Password per accedere al database
    database: 'mydb',      // Nome del database che vuoi usare
    port: 3307         // Porta su cui il server MySQL è in ascolto
});

// Avvia la connessione al database MySQL e se c'è un errore lo stampa sulla console
db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Endpoint GET per ottenere tutte le note dal database
app.get('/api/notes', (req, res) => {
    const listId = req.query.list_id; // Estrae il parametro 'list_id' dalla query string (es: /api/notes?list_id=1)

    if (!listId) { // Se 'list_id' non è fornito, ritorna un errore 400
        return res.status(400).json({ error: 'Parametro list_id obbligatorio' });
    }

    const query = 'SELECT * FROM notes WHERE list_id = ?'; // Prendi tutte le note che appartengono alla lista specificata da 'list_id'
    db.query(query, [listId], (err, results) => { // Esegue la query passando 'listId' come parametro (per evitare SQL injection)
        if (err) { // Se c'è un errore durante l'esecuzione della query, lo stampa sulla console e ritorna un errore 500
            console.error(err);
            return res.status(500).json({ error: 'Errore DB' });
        } // Se la query ha successo, ritorna i risultati come risposta JSON
        res.json(results);
    });
});

// Endpoint HTTP GET per ottenere tutte le liste dal database
app.get('/api/lists', (req, res) => {
    const query = 'SELECT * FROM lists';  // Query SQL per selezionare tutte le righe dalla tabella 'lists'
    db.query(query, (err, results) => { // Esegue la query senza parametri (perché prende tutto)
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Errore DB' });
        }
        res.json(results); // Manda le liste al frontend in formato JSON
    });
});

// Endpoint HTTP POST per aggiungere una nuova nota al database
app.post('/api/notes/add', (req, res) => {
    // Prendo i dati dal corpo della richiesta (JSON)
    // Estraggo 'note', 'status' (default false se non fornito) e 'list_id'
    const { note, status = false, list_id } = req.body;

    // Controllo se 'note' e 'list_id' sono stati forniti, altrimenti ritorno un errore 400
    // 'note' è il testo della nota, 'status' indica se la nota è completata (true/false), 'list_id' è l'ID della lista a cui appartiene la nota
    // 'list_id' è necessario per associare la nota a una lista
    if (!note || !list_id) {
        return res.status(400).json({ error: 'Nota e list_id sono obbligatori' });
    }
    // Preparo la query SQL per inserire la nuova nota nella tabella 'notes'
    const insertQuery = 'INSERT INTO notes (note, status, list_id) VALUES (?, ?, ?)';
    // Eseguo la query passando i valori di 'note', 'status' e 'list_id' come parametri. 
    // Questo aiuta a prevenire SQL injection, perché i valori vengono trattati come dati e non come parte della query SQL.
    // 'status' è un booleano che indica se la nota è completata o meno
    // 'list_id' è l'ID della lista a cui la nota appartiene
    // 'note' è il testo della nota che l'utente vuole aggiungere
    db.query(insertQuery, [note, status, list_id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore DB' });
        res.json(results);
    });
});

// Endpoint HTTP POST per aggiungere una nuova lista al database
app.post('/api/lists/add', (req, res) => {
    // Prendo dal corpo della richiesta il campo 'name' (nome della lista)
    const { name } = req.body;
    // Controllo se 'name' è stato fornito, altrimenti ritorno un errore 400
    if (!name) return res.status(400).json({ error: 'Nome lista obbligatorio' });

    // Eseguo la query per inserire una nuova riga nella tabella 'lists' con il nome specificato
    db.query('INSERT INTO lists (name) VALUES (?)', [name], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore DB' });
        res.json(results);
    });
});

// Endpoint HTTP PUT per aggiornare il nome di una lista esistente nel database
app.put('/api/lists/:id', (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Nome richiesto' });

    db.query('UPDATE lists SET name = ? WHERE id = ?', [name, id], (err) => {
        if (err) return res.status(500).json({ error: 'Errore DB' });
        res.json({ success: true });
    });
});

// Endpoint HTTP DELETE per eliminare una lista dal database
app.delete('/api/lists/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM lists WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Errore DB' });
        res.json({ success: true });
    });
});

// Endpoint HTTP PUT per aggiornare una nota esistente nel database
app.put('/api/notes/:id', (req, res) => {
    // Recupera l'id della nota dai parametri dell'URL (es: /api/notes/3 → id = 3)
    const id = req.params.id;
    // Prende i campi 'note' e 'status' dal corpo della richiesta (req.body)
    const { note, status } = req.body;
    // Prepara le variabili per la query SQL e i parametri
    let query, params;

    // Se vengono forniti sia 'note' che 'status'
    if (note !== undefined && status !== undefined) {
        query = 'UPDATE notes SET note = ?, status = ? WHERE id = ?';
        params = [note, status, id];
    }
    // Se viene fornito solo 'note'
    else if (note !== undefined) {
        query = 'UPDATE notes SET note = ? WHERE id = ?';
        params = [note, id];
    }
    // Se viene fornito solo 'status'
    else if (status !== undefined) {
        query = 'UPDATE notes SET status = ? WHERE id = ?';
        params = [status, id];
    }
    // Se non viene fornito nulla da aggiornare, restituisce errore 400
    else {
        return res.status(400).json({ error: 'Nessun campo da aggiornare' });
    }

    // Esegue la query di aggiornamento con i parametri scelti
    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore DB' });
        // Se l'aggiornamento ha successo, restituisce un oggetto JSON con success: true
        res.json({ success: true });
    });
});

// Endpoint HTTP DELETE per eliminare tutte le note completate dal database
app.delete('/api/notes/completed', (req, res) => {
    // Esegue una query SQL per eliminare tutte le note con 'status' = true (cioè completate)
    db.query('DELETE FROM notes WHERE status = true', (err, result) => {
        if (err) return res.status(500).json({ error: 'Errore DB' });
        res.json({ success: true });
    });
});

// Endpoint HTTP DELETE per eliminare una singola nota, identificata dal suo ID
app.delete('/api/notes/:id', (req, res) => {
    // Estrae l'ID della nota dai parametri dell'URL (es: /api/notes/5 → id = 5)
    const id = req.params.id;
    // Esegue una query SQL per eliminare la nota con l'ID specificato
    db.query('DELETE FROM notes WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Errore DB' });
        res.json({ success: true }); // Se l'eliminazione ha successo, restituisce un oggetto JSON con success: true
    });
});


// Avvia il server. Il server inizia ad ascoltare sulla porta 3000 le richieste HTTP
app.listen(3000, () => console.log('Server listening on http://localhost:3000'));

console.log("Funziona");