console.log("Funzionaaa! Ho inventato qualcosa che funziona!!!");

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',       // or '127.0.0.1'
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