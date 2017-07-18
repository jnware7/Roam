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
          console.log('entered LC 1');
          return done(error)
        }
        if (!result) {
          console.log('entered LC 2');
          return done(null, false)
        }
        console.log('entered LC 3', user);
        return done(null, user)
      })
    })
  })
)

passport.serializeUser(function(user, done){
  console.log('in serializeUser.  user is ->', user)
  done(null, user.username)
})

passport.deserializeUser(function(username,done){
  console.log('in deserializeUser')
  findByUsername(username)
  .then(user =>{
    console.log('in deserializeUser.  user is ->', user)
    done(null, user)
  })
})

module.exports = { passport }
