var config = require('./config.json');
var mongoConfig = require('./mongo.config.json');

module.exports = function(secret = false) {
    config['mongo'] = mongoConfig;

    return eachRecursive(config, secret);
};

function eachRecursive(obj, secret)
{
    for (var key in obj) {
        if(key[0] == '_') {
            if(secret)
                obj[key.substring(1, key.length)] = obj[key];
                
            delete obj[key];

            key = key.substring(1, key.length);
        }

        if (typeof obj[key] == 'object' && obj[key] !== null)
            eachRecursive(obj[key], secret);
    }

    return obj;
}