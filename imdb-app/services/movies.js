const db = require('../services/db');
const config = require('../config');

// get a page of users, currently only for testing
function getMultiple(page = 1) {
  const offset = (page - 1) * config.listPerPage;
  const data = db.query(`SELECT * FROM users LIMIT ?,?`, [offset, config.listPerPage]);
  const meta = {page};

  return {
    data,
    meta
  }
}

// get all first & last names from db
function getNames() {
  const data = db.query('SELECT firstName, lastName FROM users', []);

  return {
    data
  }
}

// get list of favourite movies from a specified user
function getUserMovies(user) {
  names = user.split("_");
  const data = db.query(`SELECT favourite_movies FROM users WHERE (firstName = ?) AND (lastName = ?)`, [names[0], names[1]]);

  return {
    data
  }
}

// add a new user to db, note we use autoincremented key (different from provided schema)
function addUser(firstName, lastName) {
  const return_data = db.run('INSERT INTO users VALUES (NULL, ?, ?, ?)', [firstName, lastName, ""]);

  return {
    return_data
  }
}

// remove user from db with first & last name. also removes any accidental duplicates.
function removeUser(firstName, lastName) {
  const return_data = db.run('DELETE FROM users WHERE (firstName = ?) AND (lastName = ?)', [firstName, lastName]);

  return {
    return_data
  }
}

// update list of movies for a user
function updateMovieList(movielist, firstName, lastName) {
  const return_data = db.run('UPDATE users SET favourite_movies = ? WHERE (firstName = ?) AND (lastName = ?)', [movielist, firstName, lastName]);

  return {
    return_data
  }
}


module.exports = {
  getMultiple,
  getNames,
  getUserMovies,
  addUser,
  removeUser,
  updateMovieList,
}