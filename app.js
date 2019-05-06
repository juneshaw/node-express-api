const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');

const app = express();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const routes = require('./routes/index');
const books = require('./routes/books');
const authors = require('./routes/authors');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Use router
app.use('/', routes);
app.use('/books', books);
app.use('/authors', authors);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

// Error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

module.exports = app;
