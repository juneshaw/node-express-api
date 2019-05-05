var express = require('express');
var router = express.Router();
var knex = require('knex');
const sqlite3 = require('sqlite3').verbose();


function connectDb() {
    return new Promise(function(resolve, reject) {
        let db = new sqlite3.Database('./db/library.db.sql', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            reject(new Error('Failed database connect'));
            console.error(err.message);
        }
        console.log('the db: ', db);
        resolve(db);
    }); 
  });
}


// let db = new sqlite3.Database('./db/library.db.sql', sqlite3.OPEN_READWRITE, (err) => {
    // if (err) {
    //     console.error(err.message);
    //   }
    //   console.log('Connected to the library database.');
    // });
// let db = sqlite3.connect('./db/library.db.sql');
// console.log('Connected to the library database.');

// const sqlStmt = `SELECT id as id,
// name as name,
// year as year
// FROM books`;
// console.log('Making query');
// db.each(sqlStmt, [], (err, row) => {
//     if (err) {
//     console.error(err.message);
//     }
//     console.log(row.id + "\t" + row.name + "\t" + row.year);
// });

router.get('/', function(req, res, next) {
    connectDb()
        .then(function (db) {
            console.log('Async db connect', db);
            
            db.all("SELECT * FROM books", function(err, rows) {
              if (err) {
                console.error(err.message);
              }
              console.log("Row: ", rows);
            //   console.log("Row: ", row.id + "\t" + row.name + "\t" + row.year);
            });
        })
        .catch(function(err) {
            console.log('Error db connect')
        });
    });
    // let db = sqlite3.connect('./db/library.db.sql');
    // db.all(() => {
    //     db.each(`SELECT id as id,
    //                     name as name,
    //                     year as year
    //              FROM books`, (err, row) => {
    //       if (err) {
    //         console.error(err.message);
    //       }
    //       console.log(row.id + "\t" + row.name + "\t" + row.year);
    //     });
    //   });
// router.get('/', function(req, res, next) {
//   Books().select().then(function (books) {
//     res.render('books/index', {books: books});
//   })
// });

// router.post('/', function (req, res, next) {
//   Books().insert(req.body).then(function (results) {
//     res.redirect('/books');
//   })
// })

// router.get('/new', function(req, res, next) {
//   res.render('books/new');
// });

// router.get('/:id', function(req, res, next) {
//   Books().where('id', req.params.id).first().then(function (book) {
//     res.render('books/show', {book: book});
//   });
// });

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
