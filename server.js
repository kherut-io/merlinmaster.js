//REQUIREs
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const connect = require('connect');
const serveStatic = require('serve-static');
const winston = require('winston');

//CONFIG
const config = require('./config.json');

//LOGGING
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: {service: 'user-service'},
    transports: [
        new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'log/combined.log' })
    ]
});

if (config.environment == 'development') {
    logger.add(new winston.transports.Console());
}

//LOGGING MIDDLEWARE
function logMiddleware(req, res, next) {
    logger.info({ originalUrl: req.originalUrl, method: req.method, body: req.body });

    next();
}

//INITIALISE VARIABLES
const app = express();
const apiPort = process.env.API_PORT || config.apiPort;
const httpPort = process.env.HTTP_PORT || config.httpPort;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(logMiddleware);

//CONNECT TO MONGODB
MongoClient.connect(config.mongoAddress, (err, database) => {
    //COULDN'T CONNECT TO MONGODB
    if (err) {
        logger.error(err);
        process.exit(1);
    }

    //GET ALL THE ROUTES FOR THE API
    require('./api/routes')(app, database);

    //MAKE THE API LISTEN ON apiPort
    app.listen(apiPort, () => {
        logger.info('API on localhost:' + apiPort);

        //CREATE HTTP SERVER ON httpPort -> SERVES /www
        connect().use(serveStatic(__dirname + '/www')).listen(httpPort, function(){
            logger.info('HTTP on localhost:' + httpPort);
        });
    });               
})