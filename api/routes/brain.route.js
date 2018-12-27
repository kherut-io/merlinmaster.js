const controller = require("../controllers/brain.controller");

module.exports = function(app, db) {
    app.get('/brain', (req, res) => {
        controller.printAllData(app, db, req, res);
    });

    app.get('/brain/:info', (req, res) => {
        controller.printData(app, db, req, res);
    });
};