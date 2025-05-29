const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'myuser',
    password: 'mypass',
    database: 'mydb',
});

// Test connection
db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

app.get('/api/notes', (req, res) => {
    const query = 'SELECT * FROM notes';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Errore DB' });
        }
        res.json(results);
    });
});



app.post('/api/notes/add', (req, res) => {
    const note = req.body.note;
    const status = req.body.status || false;
    const insertQuery = `INSERT INTO notes (note, status) VALUES (${note}, ${status})`;
    db.query(listQuery, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});


app.listen(3000, () => console.log('Server listening on http://localhost:3000'));

console.log("Funziona");