const fs = require('fs');
const glob = require('glob');
const path = require('path');

const root = path.resolve(path.dirname(require.main.filename), '..');
const functions = require(root + '/app/functions');

exports.printAllData = function(api, db, req, res) {
    res.send(functions.getData(["temperatureCPU", "uptime, cpuinfo"]));
};

exports.printData = function(api, db, req, res) {
    res.send(functions.getData([req.params.info]));
};

exports.settings = function(api, db, req, res) {
    if(typeof req.body.json != 'undefined') {
        if(functions.validJSON(req.body.json)) {
            var configJSON = JSON.parse(req.body.json);
            var configFile = JSON.parse(JSON.stringify(require(root + '/config/config.json')));
            var configSeparate = glob.sync(root + '/config/*.config.json');

            var errorFiles = [];

            for(var i = 0; i < configSeparate.length; i++) 
                configFile[path.basename(configSeparate[i]).split('.config.json')[0]] = JSON.parse(JSON.stringify(require(root + '/config/' + path.basename(configSeparate[i]))));

            for(var i = 0; i < configSeparate.length; i++) {
                var propertyFile = path.basename(configSeparate[i]).split('.config.json')[0];

                for(var key in configJSON) {
                    if(key == propertyFile) {
                        fs.writeFile(root + '/config/' + propertyFile + '.config.json', JSON.stringify(configJSON[key], null, 2), function(err) {
                            if(err)
                                errorFiles.push(root + '/config/' + propertyFile + '.config.json');
                        });

                        delete configJSON[key];
                    }
                }
            }

            fs.writeFile(root + '/config/config.json', JSON.stringify(configJSON, null, 2), function(err) {
                if(err)
                    errorFiles.push(root + '/config/config.json');
            });

            if(errorFiles.length > 0) 
                res.send({ ok: 0, error: 'There was a problem while writing to following config files: ' + errorFiles.join(', ') });

            else
                res.send({ ok: 1 });
        }

        else
            res.send({ ok: 0, error: 'Oopsie! JSON was not valid.' });
    }

    else {
        var config = require(configFRead);

        for(var key in req.body)
            config[key] = (typeof config[key] == 'number' ? parseInt(req.body[key]) : req.body[key]); 

        fs.writeFile(configFWrite, JSON.stringify(config, null, 2), function(err) {
            if(err) {
                res.send({ ok: 0, error: err });
                return;
            }

            else
                res.send({ ok: 1 });
        }); 
    }
};