const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const pool = require('./db');
const tools = require('./tools');
const { getAllUsers, getAllSchedules } = require('./tools');
const req = require('express/lib/request');

const app = express();

app.use(expressLayouts);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('./img', express.static(__dirname + 'public/img'));

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/../views`);

const authTokens = {};

app.use((req, res, next) => {
    const authToken = req.cookies['AuthToken'];
    req.user = authTokens[authToken];

    next();
});


app.get('/', (req, res) => {
    res.render('main')
});


app.route('/signup')
    .get((req, res) => {
        res.render('signup')
    })
    .post(async (req, res) => {
        const { firstname, lastname, email, password, password_confirm } = req.body;
        const users = (await getAllUsers(pool)).rows;

        if (users.find(user => user.email === email)) {
            res.render('signup', {
                message: 'User already registered.',
                messageClass: 'alert-danger'
            });

            return;
        }

        if (password !== password_confirm) {
            res.render('signup', {
                message: 'Password does not match.',
                messageClass: 'alert-danger'
            });

            return;
        };

        const hashedPassword = tools.getHashedPassword(password);

        pool.query(`INSERT INTO users (firstname, lastname, email, password) VALUES 
        ('${req.body.firstname}', '${req.body.lastname}', '${req.body.email}', '${hashedPassword}');`)
        res.redirect('/homepage');
    });


app.route('/login')
    .get((req, res) => {
        res.render('login');
    })
    .post(async (req, res) => {
        const { email, password } = req.body;
        const hashedPassword = tools.getHashedPassword(password);
        const users = (await getAllUsers(pool)).rows;

        const user = users.find(u => {
            return u.email === email && u.password === hashedPassword
        });

        if (!user) {
            res.render('login', {
                message: 'Invalid username or password',
                messageClass: 'alert-danger'
            });
            
            return;
        }

        const authToken = tools.generateAuthToken();

        authTokens[authToken] = user;
        res.cookie('AuthToken', authToken);

        res.redirect('/homepage');
    });


app.get('/logout', (req, res) => {
    res.clearCookie('AuthToken');
    res.redirect('/');
});


app.route('/homepage')
    .get(async (req, res) => {
        if (!req.user) {
            res.render('main', {
                message: 'Please login to continue',
                messageClass: 'alert-danger'
            });
            return;
        }
        const schedules = await getAllSchedules(pool);
        const userId= req.user.id
        const user = (await pool.query(`SELECT * FROM users WHERE (id='${userId}');`)).rows;
        res.render('homepage', { schedules: schedules.rows, user: user });
    })
    .post(async (req, res) => {
        const payload = req.body;
        await pool.query(`INSERT INTO schedules (user_id, day, start_at, end_at) VALUES ('${payload.user_id}', '${payload.day}', '${payload.start_at}', '${payload.end_at}') RETURNING *;`);
        res.redirect('/homepage');
    });


app.get('/new', async (req, res) => {
    if (!req.user) {
        res.render('main', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        });
        return;
    }
    const userId= req.user.id
    const schedule = (await pool.query(`SELECT * FROM schedules WHERE (user_id='${userId}');`)).rows;
    res.render('newSchedule', {schedules: schedule});
});


app.get('/user/:id', async (req, res) => {
    if(!req.user) {
        res.render('main');
        return
    }
    const idUser = req.params.id;
    const user = await pool.query(`SELECT * FROM users JOIN schedules ON users.id=user_id WHERE user_id=${idUser};`)
    const userFirstname = user.rows[0].firstname;
    const userLastname = user.rows[0].lastname;
    res.render('user', {user: user.rows, firstname: userFirstname, lastname: userLastname})
});


app.listen(3000, () => {
    console.log(`http://localhost:3000/`)
});
