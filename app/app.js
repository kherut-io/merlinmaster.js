const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const ip = require('ip');

const LocalStrategy = require('passport-local').Strategy;

const root = path.resolve(path.dirname(require.main.filename), '..');

const showProperties = require(root + '/app/functions/showProperties.function');
const master = express();
const config = require(root + '/config')(true);

const httpPort = process.env.HTTP_PORT || config.httpPort;
const localIP = ip.address();

mongoose.set('useFindAndModify', false);

//SET UP MASTER
master.use(bodyParser.json());
master.use(bodyParser.urlencoded({ extended: true }));
master.use(session({
    name: 'merlinmaster.session',
    secret: config._sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));
master.use(passport.initialize());
master.use(passport.session());

master.use(express.static(path.join(root, '/app/www/views'))); 
master.engine('.ejs', require('ejs').__express);
master.set('views', path.join(root, '/app/www/views'));
master.set('view engine', 'ejs');

//MIDDLEWARE
master.use((req, res, next) => {
    next();
});

//ROUTES
master.use('/' + config.apiPrefix + '/user', require(root + '/app/api/routes/user.route'));
master.use('/' + config.apiPrefix + '/auth', require(root + '/app/api/routes/auth.route'));

//FAVICON
master.use('/favicon.ico', (req, res) => {

});

master.use((req, res) => {
    if(typeof req.user == 'undefined')
        return res.render(root + '/app/www/site/login', { redirectURL: req.url, localIP: localIP, config: config });

    res.render(root + '/app/www/site/' + path.basename(req.url), { user: showProperties(req.user, config.userProperties), localIP: localIP, config: config }, (err, html) => {
        if(err)
            return res.status(404).render(root + '/app/www/errors/404');

        res.send(html);
    });
});

//PASSPORT CONFIG
var Account = require(root + '/app/api/models/account.model');

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//CONNECT TO MONGODB
mongoose.connect(config.mongo._mongoAddress, { useNewUrlParser: true, useCreateIndex: true });

master.listen(httpPort, (err) => {
    if(err)
        return console.log('Something didn\'t go as expected :(');

    console.log('Merlin Master on http://' + localIP + ':' + httpPort + '/');
});