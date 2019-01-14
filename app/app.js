const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const ip = require('ip');

const LocalStrategy = require('passport-local').Strategy;

const root = path.resolve(path.dirname(require.main.filename), '..');

const api = express();
const config = require(root + '/config')(true);

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(cookieParser());
api.use(require('express-session')({
    secret: 'session-secret',
    resave: false,
    saveUninitialized: false
}));
api.use(passport.initialize());
api.use(passport.session());

//ROUTES
api.use('/user', require('./api/routes/user.route'));
api.use('/auth', require('./api/routes/auth.route'));

//PASSPORT CONFIG
var Account = require('./api/models/account.model');

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//CONNECT TO MONGODB
mongoose.connect(config.mongo._address, { useNewUrlParser: true });

api.listen(config.apiPort, (err) => {
    if(err)
        console.log('Something didn\'t go as expected :(');

    else
        console.log('Listening on http://' + ip.address() + ':' + config.apiPort + '/');
});