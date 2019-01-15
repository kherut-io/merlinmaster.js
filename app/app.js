const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const ip = require('ip');
const cors = require('cors');

const LocalStrategy = require('passport-local').Strategy;

const root = path.resolve(path.dirname(require.main.filename), '..');

const api = express();
const webserver = express();
const config = require(root + '/config')(true);

const apiPort = process.env.API_PORT || config.apiPort;
const httpPort = process.env.HTTP_PORT || config.httpPort;
const localIP = ip.address();

//SET UP API AND WEBSERVER
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(cors());
api.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: config._cookieKeys
}));
api.use(passport.initialize());
api.use(passport.session());
api.use(function(req, res, next) {
    next();
});

webserver.use(express.static(path.join(root, '/app/www/views'))); 
webserver.engine('.ejs', require('ejs').__express);
webserver.set('views', path.join(root, '/app/www/views'));
webserver.set('view engine', 'ejs');

webserver.get('/favicon.ico', (req, res) => {
    //HANDLE FAVICON
});

webserver.get('*', (req, res) => {
    if(typeof req.user == 'undefined')
        return res.render(root + '/app/www/login', { config: config, localIP: localIP });

    res.render(root + '/app/www/' + req.url, { user: req.user, config: config, localIP: localIP });
});

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

api.listen(apiPort, (err) => {
    if(err)
        console.log('Something didn\'t go as expected :(');

    else {
        console.log('API listening on http://' + localIP + ':' + apiPort + '/');

        webserver.listen(httpPort, (err) => {
            if(err)
                console.log('Something didn\'t go as expected :(');

            else
                console.log('HTTP listening on http://' + localIP + ':' + httpPort + '/');
        });
    }
});