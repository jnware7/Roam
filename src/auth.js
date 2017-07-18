const {findByUsername} = require('./database')
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(
  function(username, password, done) {
    findByUsername(username)
    .then(result =>{
      const user = result[0]
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
  })
)

passport.serializeUser(function(user, done){
  done(null, user.username)
})

passport.deserializeUser(function(username,done){
  findByUsername(username)
  .then(user =>{
    done(null, user)
  })
})

module.exports = { passport }
