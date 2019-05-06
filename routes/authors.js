const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

function connectDb() {
    return new Promise(function(resolve, reject) {
        let db = new sqlite3.Database('./db/library.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            reject(new Error('Failed database connect'));
            console.error(err.message);
        }
        resolve(db);
    }); 
  });
}

router.get('/', function(req, res, next) {
    connectDb()
        .then(function (db) {
            db.all("SELECT * FROM authors", function(err, authors) {
              if (err) {
                console.error(err.message);
              }
            // res.render({authors});
            res.send({authors});
            });
        })
        .catch(function(err) {
            console.error('Error db connect')
        });
    });

router.get('/:id/edit', function(req, res, next) {
  Books().where('id', req.params.id).first().then(function (book) {
    res.render('books/edit', {book: book});
  });
});

router.post('/:id', function (req, res, next) {
  Books().where('id', req.params.id).update(req.body).then(function (results) {
    res.redirect('/books');
  })
});

router.post('books/:id/delete', function (req, res, next) {
  Books().where('id', req.params.id).del().then(function (results) {
    res.redirect('/books');
  })
})

module.exports = router;
