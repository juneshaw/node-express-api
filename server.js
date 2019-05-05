const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Initialize database from files
// let db = new sqlite3.Database('./db/library.db.sql', sqlite3.OPEN_READWRITE, (err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log('Connected to the library database.');
//   });

var routes = require('./routes/index');
var books = require('./routes/books');

// Use router
app.use('/', routes);
app.use('/books', books);

// Routes before router added
app.get('/', (req, res) => {
    res.send('Hello from API!');
});

app.get('/error', (req, res) => {
    res.send('Error from API!');
});

app.get('/books', (req, res) => {
    res.send('Books');
});

// Listen for requests on environment port if specified, or 8080
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`I am listening on port ${PORT}`);
})