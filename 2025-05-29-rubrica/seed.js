const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'myuser',
    password: 'mypass',
    database: 'mydb',
});

// Create the table if it doesn't exist
db.query(
    `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
    )`,
    (err) => {
        if (err) {
            console.error('Error creating table:', err);
            db.end();
            return;
        }

        console.log('Table ready.');

        const users = [
            ['Diana', 'diana@example.com'],
            ['Eve', 'eve@example.com'],
            ['Pippo', 'pippo@topolino.it'],
            ['Mario', 'mario@blablabla.com'],
            ['Mariano', 'marianogiusti@boris.com'],
        ];

        users.forEach(([name, email]) => {
            db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err) => {
                if (err) console.error('Insert error:', err);
            });
        });

        db.end();
    }
);
