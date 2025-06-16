const mysql = require('mysql2'); // Importa il modulo mysql2 per connettersi a MySQL

// Crea una connessione al database MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'myuser',
    password: 'mypass',
    database: 'mydb',
});

// Prima droppa la tabella notes (se esiste)
db.query(`DROP TABLE IF EXISTS notes`, (err) => {
    if (err) {
        console.error('Errore durante DROP TABLE:', err);
        db.end();
        return;
    }

    // Poi droppa la tabella lists (se esiste)
    db.query(`DROP TABLE IF EXISTS lists`, (err) => {
        if (err) {
            console.error('Errore durante DROP TABLE lists:', err);
            db.end();
            return;
        }

        // Creo la tabella lists
        db.query(
            `CREATE TABLE IF NOT EXISTS lists (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL
            )`,
            (err) => {
                if (err) {
                    console.error('Errore durante CREATE TABLE lists:', err);
                    db.end();
                    return;
                }

                console.log('Tabella lists pronta.');

                // Crea la tabella notes
                db.query(
                    `CREATE TABLE IF NOT EXISTS notes (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    note VARCHAR(100),
                    status BOOLEAN DEFAULT FALSE,
                    list_id INT NOT NULL,
                    FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
                )`,
                    (err) => {
                        if (err) {
                            console.error('Errore durante CREATE TABLE notes:', err);
                            db.end();
                            return;
                        }

                        console.log('Tabella notes pronta.');
                        // Inserimento dati esempio
                        // Prima le liste
                        const lists = [
                            ['Spesa'],
                            ['Lavoro'],
                        ];
                        const insertListQuery = `INSERT INTO lists (name) VALUES (?)`;

                        let completedLists = 0;
                        lists.forEach(list => {
                            db.query(insertListQuery, list, (err, results) => {
                                if (err) {
                                    console.error('Errore inserimento lista:', err);
                                } else {
                                    console.log(`Lista inserita: ${list[0]}`);

                                    // Quando l'inserimento della lista è fatto,
                                    // inseriamo qualche nota collegata a quella lista
                                    const listId = results.insertId;
                                    const notes = listId === 1
                                        ? [['Comprare il pane', false, listId]]
                                        : [['Scrivere mail', false, listId]];

                                    const insertNoteQuery = `INSERT INTO notes (note, status, list_id) VALUES (?, ?, ?)`;

                                    let completedNotes = 0;
                                    notes.forEach(note => {
                                        db.query(insertNoteQuery, note, (err) => {
                                            if (err) {
                                                console.error('Errore inserimento nota:', err);
                                            } else {
                                                console.log(`Nota inserita: ${note[0]}`);
                                            }

                                            completedNotes++;
                                            if (completedNotes === notes.length) {
                                                completedLists++;
                                                if (completedLists === lists.length) {
                                                    db.end();
                                                }
                                            }
                                        });
                                    });
                                }
                            });
                        });
                    }
                );
            }
        );
    });
});