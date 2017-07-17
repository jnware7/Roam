const pgp = require('pg-promise')();
const connectionString = 'postgres://localhost:5432/roam';
const db = pgp(connectionString);
const bcrypt = require('bcrypt')
const saltRounds = 12;

const CREATE_USER = `INSERT INTO users (username, password) VALUES($1, $2) RETURNING *`

const createUser = (username,password) => {
  return bcrypt.hash(password, saltRounds)
  .then(function(hash) {
    return db.one(CREATE_USER, [username, hash])
  });
};


module.exports = {createUser};
