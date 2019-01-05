const config = require('./config.json');
const mongoConfig = require('./mongo.config.json');

module.exports = function(secret = false) {
    var configClone = JSON.parse(JSON.stringify(config)); //BECAUSE THE BEST SOLUTIONS ARE THE SIMPLEST
    var mongoConfigClone = JSON.parse(JSON.stringify(mongoConfig));

    configClone['mongo'] = mongoConfigClone;

    return eachRecursive(configClone, secret);
};

function eachRecursive(obj, secret)
{
    for (var key in obj) {
        if(key[0] == '_') {
            if(secret) {
                obj[key.substring(1, key.length)] = obj[key];
            }
                
            delete obj[key];

            key = key.substring(1, key.length);
        }

        if (typeof obj[key] == 'object' && obj[key] !== null)
            eachRecursive(obj[key], secret);
    }

    return obj;
}