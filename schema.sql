DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS users;


CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username TEXT,
  password TEXT,
  user_image TEXT
);

CREATE TABLE reviews(
  id SERIAL PRIMARY KEY,
  city TEXT,
  tip TEXT,
  city_image TEXT,
  users_id INT REFERENCES users,
  logged TIMESTAMP DEFAULT now(),
  thumbs BOOLEAN default true
);
