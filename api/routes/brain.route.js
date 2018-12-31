const controller = require("../controllers/brain.controller");

module.exports = function(api, db) {
    api.get('/brain', (req, res) => {
        controller.printAllData(api, db, req, res);
    });

    api.get('/brain/:info', (req, res) => {
        controller.printData(api, db, req, res);
    });
};