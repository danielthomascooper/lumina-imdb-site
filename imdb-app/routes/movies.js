const express = require('express');
const router = express.Router();
const movies = require('../services/movies');

// handle GET requests to db
router.get('/', function(req, res, next) {
  try {
    if ("userlist" in req.query) {
      res.json(movies.getNames());
    } else if ("user" in req.query) {
      res.json(movies.getUserMovies(req.query.user));
    } else {
      res.json(movies.getMultiple(req.query.page));
    }
  } catch(err) {
    console.error(`Error while getting movie lists `, err.message);
    next(err);
  }
});

// handle POST requests to db
router.post("/", function(req, res, next) {
  try {
    body = req.body;
    if ("add-user" == body.operation) {
      res.json(movies.addUser(body.firstName, body.lastName));
    } else if ("remove-user" == body.operation) {
      res.json(movies.removeUser(body.firstName, body.lastName));
    } else if ("update-list" == body.operation) {
      res.json(movies.updateMovieList(body.movielist, body.firstName, body.lastName))
    }
    else {
      throw Error("Unknown request operation")
    }
  } catch(err) {
    console.error(`Error while changing movie database `, err.message);
    next(err);
  }
});

module.exports = router;