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

const GET_ALL_REVIEWS = `SELECT * FROM reviews`;
const getAllReviews = () => {
  return db.any(GET_ALL_REVIEWS, []);
};

const FIND_BY_USERNAME = `SELECT * FROM users WHERE username = $1`;
const findByUsername = (username) => {
  return db.one(FIND_BY_USERNAME, [username]);
};

const GET_USER_BY_ID = `SELECT * FROM users WHERE id = $1`
const getUserById = (id) => {
  return db.one(GET_USER_BY_ID, [id])
}
const GET_REVIEWS_BY_USER_ID = `SELECT * FROM reviews WHERE users_id = $1`
const getReviewsByUserId = (users_id) => {
  return db.any(GET_REVIEWS_BY_USER_ID, [users_id])
}

const GET_CURRENT_CITY_BY_USER_ID = `SELECT city FROM reviews WHERE id = $1 LIMIT 1`
const getCurrentCityByUserId = (users_id) => {
  return db.one(GET_CURRENT_CITY_BY_USER_ID,[users_id])
    .then(result => result.city)
}

const UPDATE_USER = `UPDATE users SET (username, user_image) = ($1, $2) WHERE id = $3 RETURNING *`
const updateUser = (options) => {
  return db.one(UPDATE_USER, [options.username, options.user_image, options.id])
}


const SEARCH_CITY = `SELECT * FROM reviews WHERE lower(city) LIKE $1::text`
const searchCity = (searchQuery) => {
  return db.any(SEARCH_CITY, [`%${searchQuery.toLowerCase().replace(/\s+/,'%')}%`])
}

const DELETE_REVIEW = `DELETE FROM reviews WHERE id = $1 RETURNING *`
const deleteReviewById = (reviewId) => {
  return db.one(DELETE_REVIEW, [reviewId])
}

const GET_REVIEW_BY_ID = `SELECT * FROM reviews WHERE id = $1`
const getReviewById = (reviewId) => {
  return db.one(GET_REVIEW_BY_ID, [reviewId])
}

const UPDATE_REVIEW = `UPDATE reviews SET (city, tip, city_image) = ($1, $2, $3) where id = $4 RETURNING *`
const updateReview = (options) => {
  return db.one(UPDATE_REVIEW, [options.city, options.tip, options.city_image, options.id])
}

module.exports = {
  searchCity,
  getAllReviews,
  createUser,
  findByUsername,
  getUserById,
  getReviewsByUserId,
  getCurrentCityByUserId,
  updateUser,
  deleteReviewById,
  getReviewById,
  updateReview
};
