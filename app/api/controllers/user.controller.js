const path = require('path');
const md5 = require('md5');

const root = path.resolve(path.dirname(require.main.filename), '..');

const config = require(root + '/config')(true);
const showProperties = require(root + '/app/functions/showProperties.function');

var Account = require(root + '/app/api/models/account.model');

exports.getUser = (req, res) => {
    if(typeof req.user == 'undefined')
        return res.send({ ok: 0, message: 'It looks like you\'re not logged in!' });
    
    return res.send(showProperties(req.user, config.userProperties));
};

exports.getUserData = (req, res) => {
    if(typeof req.user == 'undefined')
        return res.send({ ok: 0, message: 'You need to be logged in first!' });

    else {
        if(!config.userProperties.includes(req.params.property))
            return res.send({ ok: 0, message: 'No such property!' });

        var data = { ok: 1 };

        data[req.params.property] = req.user[req.params.property];

        return res.send(data);
    }  
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

//IT NEEDS PROPER HANDLING (PRIVILEGES) ALSO REMOVING PROFILES AND SO ON
exports.newProfile = (req, res) => {
    if(typeof req.user == 'undefined')
        return res.send({ ok: 0, message: 'You need to be logged in first!' });

    else {
        var account = req.user;
        var profiles = req.user.profiles;

        for(var i = 0; i < profiles.length; i++) {
            if(profiles[i].name == req.body.name)
                return res.send({ ok: 0, message: 'There\'s a profile with that name already.' });
        }

        profiles.push({ name: req.body.name, pinHash: md5(req.body.pin), privileges: req.body.privileges.split(',') });

        account.profiles = profiles;

        Account.findOneAndUpdate({ username: req.user.username }, account, (err, data) => {
            if(err)
                return res.send({ ok: 0, error: err });

            return res.send({ ok: 1 });
        });
    }
};

exports.removeProfile = (req, res) => {
    if(typeof req.user == 'undefined')
        return res.send({ ok: 0, message: 'You need to be logged in first!' });

    else {
        var account = req.user;
        var profiles = req.user.profiles;
        var i;

        for(i = 0; i < profiles.length; i++) {
            if(profiles[i].name == req.params.name) {
                profiles.splice(i, 1);

                break;
            }
        }

        if(i == profiles.length)
            return res.send({ ok: 0, message: 'No such profile!' });


        account.profiles = profiles;

        Account.findOneAndUpdate({ username: req.user.username }, account, (err, data) => {
            if(err)
                return res.send({ ok: 0, error: err });

            return res.send({ ok: 1 });
        });
    }
};

exports.editProfile = (req, res) => {
    if(typeof req.user == 'undefined')
        return res.send({ ok: 0, message: 'You need to be logged in first!' });

    else {
        var account = req.user;
        var profiles = req.user.profiles;
        var i;
        
        const properties = ['name', 'pin', 'privileges'];

        for(i = 0; i < profiles.length; i++) {
            if(profiles[i].name == req.params.name)
                break;
        }

        if(i == profiles.length)
            return res.send({ ok: 0, message: 'No such profile!' });

        for(var key in req.body) {
            if(properties.includes(key)) {
                if(key == 'pin')
                    profiles[i].pinHash = md5(req.body[key]);

                else
                    profiles[i][key] = req.body[key];
            }
        }

        account.profiles = profiles;

        Account.findOneAndUpdate({ username: req.user.username }, account, (err, data) => {
            if(err)
                return res.send({ ok: 0, error: err });

            return res.send({ ok: 1 });
        });
    }
};