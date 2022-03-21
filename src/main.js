const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const pool = require('./db');

const app = express();

app.use(expressLayouts);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/../views`);

app.listen(3000, () => {
    console.log(`http://localhost:3000/`)
});