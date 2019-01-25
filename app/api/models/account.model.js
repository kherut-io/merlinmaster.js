const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

var Account = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    profiles: [
        {
            name: {
                type: String
            },
            pin: {
                type: String
            },
            privileges: {
                type: Array
            }
        }
    ]
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);