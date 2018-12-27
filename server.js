const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const db = require('./config');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.mongoAddress, (err, database) => {
    if (err)
        return console.log(err);

    require('./app/routes')(app, database);

    app.listen(port, () => {
        console.log('API on localhost:' + port);
    });               
})