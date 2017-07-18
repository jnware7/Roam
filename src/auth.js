const {findByUsername} = require('./database')
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(
  function(username, password, done){
    console.log('password==>', password)
    findByUsername(username)
    .then(user =>{
      if (!user) {
        return done(null,false,{message:'Incorrect username.'})
      }
      bcrypt.compare(password,user.password,(error,result) => {
        console.log('result==>', result)
        if (error) {
          return done(err)
        }
        if (!result) {
          return done(null,false)
        }
        return done(null,user)
    })
   })
 })
)


passport.serializeUser(function(user,done){
  console.log('entered serializeUser', user);
  done(null,user.user_name)
})

passport.deserializeUser(function(username,done){
  console.log('entered deserializeUser', username)
  dbusers.findByUsersName(username)
  .then(user =>{
    done(null,user)
  })
})

module.exports = {passport}
