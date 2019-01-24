const path = require('path');

const root = path.resolve(path.dirname(require.main.filename), '..');

const config = require(root + '/config')(true);
const userProperties = require(root + '/app/functions/userProperties.function');

var Account = require(root + '/app/api/models/account.model');

exports.getUser = (req, res) => {
    if(typeof req.user == 'undefined')
        return res.send({ ok: 0, message: 'It looks like you\'re not logged in!' });
    
    return res.send(userProperties(req.user, config.userProperties));
};

exports.getProfile = (req, res) => {
    if(typeof req.user == 'undefined')
        return res.send({ ok: 0, message: 'You need to be logged in first!' });

    else {
        for(var i = 0; i < req.user.profiles.length; i++) {
            if(req.user.profiles[i].name == req.params.name)
                return res.send({ ok: 1, profile: req.user.profiles[i] });
        }

        return res.send({ ok: 0, message: 'There\'s no profile with that name.' });
    }  
};

//IT NEEDS PROPER HANDLING (PIN LENGTH, NAME UNIQUENESS, AND PRIVILEGES) ALSO REMOVING PROFILES AND SO ON
exports.newProfile = (req, res) => {
    if(typeof req.user == 'undefined')
        return res.send({ ok: 0, message: 'You need to be logged in first!' });

    else {
        var account = req.user;
        var profiles = req.user.profiles;

        profiles.push({ name: req.body.name, PIN: req.body.pin, privileges: req.body.privileges.split(',') });

        account.profiles = profiles;

        Account.findOneAndUpdate({ username: req.user.username }, account, (err, data) => {
            if(err)
                return res.send({ ok: 0, error: err });

            return res.send({ ok: 1 });
        });
    }
};