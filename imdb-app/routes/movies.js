const express = require('express');
const router = express.Router();
const movies = require('../services/movies');

router.get('/', function(req, res, next) {
  try {
    console.log(req.query)
    if ("userlist" in req.query) {
      console.log("userlist requested")
      res.json(movies.getNames())
    } else {
      res.json(movies.getMultiple(req.query.page));
    }
  } catch(err) {
    console.error(`Error while getting movie lists `, err.message);
    next(err);
  }
});

module.exports = router;