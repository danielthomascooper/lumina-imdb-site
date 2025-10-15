const sqlite = require('better-sqlite3');
const path = require('path');
const cache = new sqlite(path.resolve('cache.sqlite'), {fileMustExist: true});

// wrapper for db queries
function query(sql, params) {
    return cache.prepare(sql).all(params);
}

// wrapper for db commands (returns nothing)
function run(sql, params) {
    return cache.prepare(sql).run(params);
}

module.exports = {
    query,
    run
}