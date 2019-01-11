const glob = require('glob');
const path = require('path');

const root = path.resolve(path.dirname(require.main.filename), '..');

module.exports = function(secret = false) {
    var config = JSON.parse(JSON.stringify(require(root + '/config/config.json')));
    var configSeparate = glob.sync(root + '/config/*.config.json');

    for(var i = 0; i < configSeparate.length; i++)
        config[path.basename(configSeparate[i]).split('.config.json')[0]] = JSON.parse(JSON.stringify(require('./' + path.basename(configSeparate[i]))));

    return eachRecursive(config, secret);
};

function eachRecursive(obj, secret)
{
    for (var key in obj) {
        if(key[0] == '_' && !secret) {
            delete obj[key];
        }

        if (typeof obj[key] == 'object' && obj[key] !== null)
            eachRecursive(obj[key], secret);
    }

    return obj;
}