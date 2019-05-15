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
      db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
      });
    });
  })
  .catch(function(err) {
    console.error('Error db connect')
  });

});

router.get('/:id', function(req, res, next) {
  //Works but no rating average
  // const queryString = `SELECT m.movieID NOT NULL,  m.title, m.genres, m.releaseDate, printf ('$%d', m.budget) AS budget, r.rating FROM movies m LEFT OUTER JOIN ratings r ON m.movieId = r.movieId WHERE m.movieId = ${req.params.id}`
  //Attempt to have LEFT JOIN with flattened average
  // const queryString = `SELECT m.movieID NOT NULL,  m.title, m.genres, m.releaseDate, printf ('$%d', m.budget) AS budget FROM movies m LEFT OUTER JOIN (
  //   select movieId, avg(rating) as averageRating
  //   from ratings
  //   group by movieId
  //   ) as r on r.movieId = m.movieId
  //   GROUP BY m.movieId, r.averageRating ORDER BY m.movieId`
  // Works but nulls from movies even with LEFT JOIN
  const queryString = `SELECT m.imdbId NOT NULL, m.title, m.genres, m.releaseDate, printf ('$%d', m.budget) AS budget, avg(r.rating) AS averageRating FROM movies m LEFT OUTER JOIN ratings r ON m.movieId = r.movieId WHERE m.movieId = ${req.params.id}`
  connectDb('./db/movies.db')
  .then(function (db) {
    db.serialize(() => {
      db.run(`ATTACH DATABASE "./db/ratings.db" AS ratings`)
        .get(queryString, (err, movie) => {
          if (err) {
            return console.error(err.message);
          }
            // res.render({movie});
            res.send({movie});
        });
    })
    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
    });
  })
  .catch(function(err) {
    console.error('Error db connect', err);
  });
});

module.exports = router;
