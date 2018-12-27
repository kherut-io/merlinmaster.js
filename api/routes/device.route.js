const controller = require("../controllers/device.controller");

module.exports = function(app, db) {
    app.get('/device', (req, res) => {
        controller.listAllDevices(app, db, req, res);
    });

    app.post('/device', (req, res) => {
        controller.addDevice(app, db, req, res);
    });

    app.get('/device/:mid', (req, res) => {
        controller.showDevice(app, db, req, res);
    });

    app.delete('/device/:mid', (req, res) => {
        controller.removeDevice(app, db, req, res);
    });

    app.put('/device/:mid', (req, res) => {
        controller.updateDevice(app, db, req, res);
    });
};