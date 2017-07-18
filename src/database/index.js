const pgp = require('pg-promise')();
const connectionString = 'postgres://localhost:5432/roam';
const db = pgp(connectionString);
const bcrypt = require('bcrypt');
const saltRounds = 12;

const CREATE_USER = `INSERT INTO users (username, password) VALUES($1, $2) RETURNING *`;

const createUser = (username,password) => {
  return bcrypt.hash(password, saltRounds)
  .then(function(hash) {
    return db.one(CREATE_USER, [username, hash]);
  });
};

const FIND_BY_USERNAME = `SELECT * FROM users WHERE username = $1`;
const findByUsername = (username) => {
  return db.any(FIND_BY_USERNAME, [username]);
};

module.exports = {
  createUser,
  findByUsername
};
