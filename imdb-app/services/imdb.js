const config = require('../config');

// wrapper for omdbapi, note api key exists in repository for testing purposes, should not be public generally (via .gitignore etc)
async function getMovieInfo(code) {
    return fetch('http://www.omdbapi.com/?i=' + code + '&apikey=' + config.omdb_key)
}


module.exports = {
    getMovieInfo,
}