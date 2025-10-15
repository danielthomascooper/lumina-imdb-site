const sqlite = require('better-sqlite3');
const path = require('path');
const db = new sqlite(path.resolve('my_db.sqlite'), {fileMustExist: true});

// wrapper for db queries
function query(sql, params) {
    return db.prepare(sql).all(params);
}

// wrapper for db commands (returns nothing)
function run(sql, params) {
    return db.prepare(sql).run(params);
}

module.exports = {
    query,
    run
}