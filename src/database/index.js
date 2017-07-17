const pgp = require('pg-promise')();
const connectionString = 'postgres://localhost:5432/roam';
const db = pgp(connectionString);

const CREATE_USER = `INSERT INTO users (username, password) VALUES($1, $2) RETURNING *`

const createUser = (username,password) => {
  return db.one(CREATE_USER, [username, password])
};


module.exports = {createUser};
