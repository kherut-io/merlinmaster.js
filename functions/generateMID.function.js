module.exports = function(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    var mid = '';

    for(var i = 0; i < length; i++)
        mid += characters[Math.floor(Math.random() * characters.length)];

    return mid;
};