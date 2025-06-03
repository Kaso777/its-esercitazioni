const mysql = require('mysql2'); // Importa il modulo mysql2 per connettersi a MySQL

// Crea una connessione al database MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'myuser',
    password: 'mypass',
    database: 'mydb',
});

// Prima droppa la tabella
db.query(`DROP TABLE IF EXISTS notes`, (err) => {
    if (err) {
        console.error('Errore durante DROP TABLE:', err);
        db.end();
        return;
    }

    // Crea la tabella
    db.query(
        `CREATE TABLE IF NOT EXISTS notes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            note VARCHAR(100),
            status BOOLEAN DEFAULT FALSE
        )`,
        (err) => {
            if (err) {
                console.error('Errore durante CREATE TABLE:', err);
                db.end();
                return;
            }

            console.log('Tabella pronta.');

            // Dati iniziali
            const notes = [
                ['Comprare il pane', false],
                ['Chiamare il meccanico', false],
            ];

            const insertQuery = `INSERT INTO notes (note, status) VALUES (?, ?)`;

            // Inserisce ogni nota
            let completed = 0;

            notes.forEach(note => {
                db.query(insertQuery, note, (err) => {
                    if (err) {
                        console.error('Errore inserimento nota:', err);
                    } else {
                        console.log(`Nota inserita: ${note[0]}`);
                    }

                    // Controlla se tutte le query sono completate prima di chiudere la connessione
                    completed++;
                    if (completed === notes.length) {
                        db.end();
                    }
                });
            });
        }
    );
});
