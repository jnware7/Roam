const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('src/public'));
app.set('views', './src/views');

// const handlebars = require('express-handlebars')
// app.engine('.hbs', handlebars({extname:'hbs'}));
app.set('view engine', 'hbs');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('splash', {title: "Welcome!"});
});

app.use('/', router);

app.listen(3000, err => {
  console.log(`running server on port: ${port}`);
});
