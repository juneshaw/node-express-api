const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const pageSize = 50;

function connectDb(databaseName) {
    return new Promise(function(resolve, reject) {
        let db = new sqlite3.Database(databaseName, sqlite3.OPEN_READWRITE, (err) => {
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
  connectDb('./db/movies.db')
  .then(function (db) {
    db.all(queryString, function(err, movies) {
      if (err) {
        console.error(err.message);
      } else {
        // res.render({movies});
        res.send({movies});
      }
    });
  })
  .catch(function(err) {
    console.error('Error db connect')
  });
});

router.get('/:id', function(req, res, next) {
  const queryString = `SELECT imdbId, title, genres, releaseDate, printf ('$%d', budget) AS budget FROM movies INNER JOIN ratings on ratings.movieId = movies.movieId WHERE movies.movieId = ${req.params.id}`
  connectDb('./db/movies.db')
  .then(function (db) {
    db.serialize(() => {
      // Queries scheduled here will be serialized.
      db.run(`ATTACH DATABASE "./db/ratings.db" AS "ratings"`)
        .get(queryString, (err, movie) => {
          if (err) {
            console.error(err.message);
          } else {
            // res.render({movie});
            res.send({movie});
          }
        });
    })
  })
  .catch(function(err) {
    console.error('Error db connect', err);
  });
  // close the database connection
  // db.close((err) => {
  //   if (err) {
  //     return console.error(err.message);
  //   }
  // });
});

module.exports = router;
