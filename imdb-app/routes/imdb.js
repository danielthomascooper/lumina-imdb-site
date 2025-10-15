const express = require('express');
const router = express.Router();
const imdb = require('../services/imdb');

// wrapper for requests to omdb API
router.get('/', async function(req, res, next) {
  try {
    if (req.query.code == undefined) {
      throw Error("No IMBD code specified...")
    }
    const imdb_promise = await imdb.getMovieInfo(req.query.code);
    res.json(await imdb_promise.json());

  } catch(err) {
    console.error(`Error while getting external request `, err.message);
    next(err);
  }
});

module.exports = router;