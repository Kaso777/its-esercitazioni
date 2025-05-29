const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'myuser',
    password: 'mypass',
    database: 'mydb',
});

// Create the table if it doesn't exist
db.query(
    `CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    note VARCHAR(100),
    status BOOLEAN DEFAULT FALSE
    )`,
    (err) => {
        if (err) {
            console.error('Error creating table:', err);
            db.end();
            return;
        }

        console.log('Table ready.');

        // Dati iniziali per le note da inserire
        const notes = [
            ['Comprare il pane', false],
            ['Chiamare il meccanico', false],
        ];

        // Query per l’inserimento
    const insertQuery = `INSERT INTO notes (note, status) VALUES (note, status)`;

    // Inserisce ogni nota
    notes.forEach(note => {
      db.query(insertQuery, note, (err) => {
        if (err) {
          console.error('Errore inserimento nota:', err);
        } else {
          console.log(`Nota inserita: ${note[0]}`);
        }
      });
    });

        db.end();
    }
);
