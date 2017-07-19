const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const { passport } = require('./auth');
const { createUser, findByUsername, getUserById,
  getReviewsByUserId, getCurrentCityByUserId } = require('./database');

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

hbs.registerPartial('nav', `<header>
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
</header>`);

hbs.registerPartial('loggedinnav', `<header>
  <div class=".col-xs-12 .col-md-8"></div>
  <div class=".col-xs-6 .col-md-4">
    <nav>
      <ul class="breadcrumb">
        <li role="presentation" class="active"><a href="/profile">Profile</a></li>
        <li role="presentation" class="active"><a href="/logout">Logout</a></li>
      </ul>
    </nav>
  </div>
</header>`);

app.use(express.static('src/public'));
app.set('views', './src/views');
app.set('view engine', 'hbs');


router.get('/', (req, res) => {
  if (req.user) {
    res.redirect('/profile')
  } else {
    res.render('splash');
  }
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
      res.redirect('/profile')
    });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/failure'
}))

router.use((req, res, next) => {
  if(req.user) {
    next()
  } else {
    res.redirect('/login')
  }
})

router.get('/logout', (req,res) => {
  req.logout()
  res.redirect('/')
})

router.get('/profile', (req, res) => {
    const userid = req.user.id

    Promise.all([
      getUserById(userid),
      getReviewsByUserId(userid),
      getCurrentCityByUserId(userid)
    ])
    .then(results => {
      const user = results[0]
      const reviews = results[1]
      const currentCity = results[2]

      res.render('profile', {
        user: user,
        reviews: reviews,
        currentCity: currentCity
      })
    }).catch( err => {
      console.error(err)
    })
})

app.use('/', router);

app.listen(3000, err => {
  console.log(`running server on port: ${port}`);
});
