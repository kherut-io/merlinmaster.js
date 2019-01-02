const controller = require("../controllers/brain.controller");

module.exports = function(api, webserver, db) {
    api.get('/brain', (req, res) => {
        controller.printAllData(api, db, req, res);
    });

    api.get('/brain/:info', (req, res) => {
        controller.printData(api, db, req, res);
    });

    //RESTARTS MERLIN
    api.get('/brain/restart', (req, res) => {
        console.log("Route");

        controller.restart(api, webserver, db, req, res);
    });
};