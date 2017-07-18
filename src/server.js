const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const hbs = require('hbs')
const {createUser, findByUsername} = require('./database')
const bodyParser = require('body-parser')
const {passport} = require('./auth')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')


app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())


app.use(cookieSession({
  name: 'session',
  keys: ['domromdom','runsunfun'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(bodyParser.urlencoded({extended: false}))

hbs.registerPartial('nav',`<header>
  <div class=".col-xs-12 .col-md-8"></div>
  <div class=".col-xs-6 .col-md-4">
    <nav>
      <ul class="breadcrumb">
      <li role="presentation" class="active"><a href="/">Home</a></li>
        <li role="presentation" class="active"><a href="/signup">Sign up</a></li>
        <li role="presentation" class="active"><a href="/login">Login</a></li>
      </ul>
    </nav>
  </div>
</header>`)

app.use(express.static('src/public'));
app.set('views', './src/views');

app.set('view engine', 'hbs');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('splash');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  createUser(username, password)
  .then(user=>{
    console.log(user)
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/success',
  failureRedirect: '/failure'
}))

app.use('/', router);

app.listen(3000, err => {
  console.log(`running server on port: ${port}`);
});
