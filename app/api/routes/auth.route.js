const router = require('express').Router();
const passport = require('passport');
const path = require('path');

const root = path.resolve(path.dirname(require.main.filename), '..');

const showProperties = require(root + '/app/functions/showProperties.function');
const config = require(root + '/config')(true);

var Account = require(root + '/app/api/models/account.model');

router.post('/register', (req, res) => {
    if(typeof req.user != 'undefined')
        return res.send({ ok: 0, message: 'Sorry m8, but you can\'t register a new account while being logged in :c' });

    Account.register(new Account({ username : req.body.username, email: req.body.email }), req.body.password, (err, account) => {
        if(err)
            return res.send({ ok: 0, message: 'There was an error while registering :\'(', error: err });

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if(err)
                    return next(err);

                res.send({ ok: 1, user: showProperties(account, config.userProperties) });
            });
        });
    });
});

router.post('/login', (req, res) => {
    if(typeof req.user != 'undefined')
        return res.send({ ok: 0, message: 'You need to log out first!' });

    passport.authenticate('local', (err, user, info) => {
        req.login(user, (err) => {
            if(err) {
                req.loggedIn = false;
                
                return res.send({ ok: 0, message: 'Wrong credentials :/', error: err });
            }

            req.loggedIn = true;

            res.send({ ok: 1, user: showProperties(user, config.userProperties) });
        });
    })(req, res);
});

router.get('/logout', (req, res) => {
    if(typeof req.user == 'undefined')
        return res.send({ ok: 0, message: 'You aren\'t logged in!' });

    req.logout();

    res.send({ ok: 1 });
});

module.exports = router;