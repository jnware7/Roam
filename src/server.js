const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

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

router.post('/signup', (req, res) => {
  res.send('Signed in!')
})

app.use('/', router);

app.listen(3000, err => {
  console.log(`running server on port: ${port}`);
});
