const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

/**
 * @swagger
 * components:
 *    schemas:
 *      Movie:
 *       type: object
 *       required:
 *         - imdbId
 *         - title
 *         - genres
 *         - releaseDate
 *         - budget
 *       properties:
 *         imdbId:
 *           type: string
 *           description: IMDB id
 *         title:
 *           type: string
 *           description: title
 *         genres:
 *           type: string
 *           description: genres
 *         releaseDate:
 *           type: date
 *           description: release date
 *         budget:
 *           type: number
 *           description: budget in dollar units
 * 
 */

 /**
  * @swagger
  * tags:
  *   name: Movies
  *   description: The movies managing API
  */

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
};
const queryBasic = () => `SELECT imdbId, title, genres, releaseDate, printf ('$%d', budget) AS budget FROM movies `;
const queryFull = () => `SELECT imdbId, title, overview, releaseDate, printf ('$%d', budget) AS budget, runtime, genres, language, productionCompanies FROM movies `;

const queryPageSuffix = (req) => {
  const pageOffset = req.query.page && !isNaN(req.query.page) ?
    (Math.max(req.query.page, 1)-1) * pageSize :
    0;
  const pageLimit = req.query.page ? pageSize : -1;  
  return ` LIMIT ${pageLimit} OFFSET ${pageOffset}`;
};  

const queryYear = year => {
  let yearBeginDate = `${year}-01-01`;
  let yearEndDate = `${year}-12-31`;
  return `${queryBasic()} WHERE releaseDate BETWEEN '${yearBeginDate}' AND '${yearEndDate}'`;
  // return `SELECT imdbId, title, genres, releaseDate, printf ('$%d', budget) AS budget FROM movies
  // WHERE releaseDate BETWEEN '${yearBeginDate}' AND '${yearEndDate}'`;
};

const queryGenre = genre => {
  const genreWithoutQuotes = genre.replace(/['"]+/g, '');
  return `${queryBasic()} WHERE movies.genres LIKE '%${genreWithoutQuotes}%'`
};

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Returns the list of all the movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: The list of the movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */

 router.get('/', function(req, res, next) {
  let queryString;

  if (req.query.year) {
    queryString = queryYear(req.query.year).concat(queryPageSuffix(req));
  } else if (req.query.genre) {
    queryString = queryGenre(req.query.genre).concat(queryPageSuffix(req));
  } else {
    queryString = queryBasic().concat(queryPageSuffix(req));
    console.log('query for movies: ', queryString);
  }

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

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get the movie by id
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The movie id
 *     responses:
 *       200:
 *         description: The book description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: The movie was not found
 */

router.get('/:id', function(req, res, next) {
  const queryString = 
  `SELECT imdbId, title, overview, releaseDate, printf ('$%d', budget) AS budget, runtime, genres, language, productionCompanies,
  avg(r.rating) AS averageRating FROM movies m
  LEFT OUTER JOIN ratings r
  ON m.movieId = r.movieId WHERE m.movieId = ${req.params.id}`;

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
