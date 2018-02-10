const { findByUsername, getUserById } = require('./database')
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(
  function(username, password, done) {
    findByUsername(username)
    .then(user =>{
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' })
      }
      bcrypt.compare(password, user.password, (error, result) => {
        if (error) {
          return done(error)
        }
        if (!result) {
          return done(null, false)
        }
        return done(null, user)
      })
    })
    .catch( error => {
      return done(null, false, { message: 'Incorrect username.' })
    })
  })
)

passport.serializeUser(function(user, done){
  done(null, user.id)
})

passport.deserializeUser(function(userId, done){
  getUserById(userId)
    .then(user =>{
      done(null, user)
    })
})

module.exports = { passport }
