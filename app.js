const express = require('express');
const path = require('path');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const routes = require('./routes/index');
const movies = require('./routes/movies');

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Movies API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

routes.use('/api-docs', swaggerUI.serve);
routes.get('/api-docs', swaggerUI.setup(specs));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Swagger documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// Use router
app.use('/', routes);
app.use('/movies', movies);

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
