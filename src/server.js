const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const { passport } = require('./auth');
const { searchCity, getAllReviews,createUser, findByUsername, getUserById,
  getReviewsByUserId, getCurrentCityByUserId, updateUser, deleteReviewById,
  getReviewById, updateReview, newReview } = require('./database');

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
        <li role="presentation" class="active"><a href="/cities">City Search</a></li>
        <li role="presentation" class="active"><a href="/profile">Profile</a></li>
        <li role="presentation" class="active"><a href="/logout">Logout</a></li>
      </ul>
    </nav>
  </div>
</header>`);


app.use(express.static('src/public'));
app.set('views', './src/views');
app.set('view engine', 'hbs');

router.get('/cities', (req,res) => {
  getAllReviews()
  .then(reviews => {
    res.render('cities',{
      reviews:reviews
    });
  })
})
router.post('/cities',(req,res) => {
  const searchQuery = req.body.city
  searchCity(searchQuery)
  .then(reviews =>{
    res.render('cities',{
      reviews:reviews
    });
  })
})

router.get('/', (req, res) => {
  if (req.user) {
    res.redirect('/profile')
  } else {
    res.render('splash');
  }
});

router.get('/signup', (req, res) => {
  getAllReviews()
  .then(reviews => {
    res.render('signup');
  })
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

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.render('login', {message: "Invalid Username or Password"}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/profile');
    });
  })(req, res, next);
});

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

router.get('/review/new', (req, res) => {
  res.render('new_review')
})

router.get('/profile/edit', (req, res) => {
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

    res.render('edit_profile', {
      user: user,
      reviews: reviews,
      currentCity: currentCity
    })
  }).catch( err => {
    console.error(err)
  })
})

router.post('/profile/edit', (req, res) => {
  const userid = req.user.id
  const username = req.body.username
  const user_image = req.body.user_image

  updateUser({
    id: userid,
    username: username,
    user_image: user_image
  })
  .then(() => {
    res.redirect('/profile')
  })
})

router.get('/review/delete/:id', (req, res) => {
  const id = req.params.id
  deleteReviewById(id)
  .then(() => {
    res.redirect('/profile')
  })
})

router.get('/review/edit/:id', (req, res) => {
  const reviewId = req.params.id
  getReviewById(reviewId)
  .then((review) => {
    res.render('edit_review', review)
  })
})

router.post('/review/edit/:id', (req, res) => {
  const id = req.params.id
  const city = req.body.city
  const tip = req.body.tip
  const city_image = req.body.city_image
  const thumbs = req.body.thumbs

  updateReview({
    id: id,
    city: city,
    tip: tip,
    city_image: city_image,
    thumbs: thumbs
  })
  .then(() => {
    res.redirect('/profile')
  })
})

router.post('/review/new', (req, res) => {
  const users_id = req.user.id
  const city = req.body.city
  const tip = req.body.tip
  const city_image = req.body.city_image
  const thumbs = req.body.thumbs

  newReview({
    users_id: users_id,
    city: city,
    tip: tip,
    city_image: city_image,
    thumbs: thumbs
  })
  .then(() => {
    res.redirect('/profile')
  })
})

app.use('/', router);

app.listen(3000, err => {
  console.log(`running server on port: ${port}`);
});
