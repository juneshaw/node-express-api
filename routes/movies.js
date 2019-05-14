const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const pageSize = 50;

function connectDb() {
    return new Promise(function(resolve, reject) {
        let db = new sqlite3.Database('./db/movies.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            reject(new Error('Failed database connect'));
            console.error(err.message);
        }
        resolve(db);
    }); 
  });
}

router.get('/', function(req, res, next) {
  const pageOffset = req.query.page && !isNaN(req.query.page) ? 
    (Math.max(req.query.page, 1)-1) * pageSize :
    0;
  const pageLimit = req.query.page ? pageSize : -1;
  const queryString = `SELECT imdbId, title, genres, releaseDate, printf ('$%d', budget) AS budget FROM movies LIMIT ${pageLimit} OFFSET ${pageOffset}`
  connectDb()
      .then(function (db) {
          console.log('query string: ', queryString);
          db.all(queryString, function(err, movies) {
            if (err) {
              console.error(err.message);
            }
          // res.render({movies});
          res.send({movies});
          });
      })
      .catch(function(err) {
          console.error('Error db connect')
      });
  });

  router.get('/:id', function(req, res, next) {
    connectDb()
        .then(function (db) {
            db.all("SELECT * FROM movies where id = " + req.params.id, function(err, movie) {
              if (err) {
                console.error(err.message);
              }
            // res.render({movie});
            res.send({movies});
            });
        })
        .catch(function(err) {
            console.error('Error db connect')
        });
    });

module.exports = router;
