const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');

const app = express();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const routes = require('./routes/index');
const books = require('./routes/books');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Use router
app.use('/', routes);
app.use('/books', books);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

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