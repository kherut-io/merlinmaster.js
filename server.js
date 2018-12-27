const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const config = require('./config.json');
const app = express();
const port = process.env.PORT || config.apiPort;

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(config.mongoAddress, (err, database) => {
    if (err)
        return console.log(err);

    require('./api/routes')(app, database);

    app.listen(port, () => {
        console.log('API on localhost:' + port);
    });               
})