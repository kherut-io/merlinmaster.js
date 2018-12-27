const deviceController = require("../controllers/device.controller");

module.exports = function(app, db) {
    app.get('/device', (req, res) => {
        deviceController.listAllDevices(app, db, req, res);
    });

    app.post('/device', (req, res) => {
        deviceController.addDevice(app, db, req, res);
    });

    app.get('/device/:mid', (req, res) => {
        deviceController.showDevice(app, db, req, res);
    });

    app.delete('/device/:mid', (req, res) => {
        deviceController.removeDevice(app, db, req, res);
    });

    app.put('/device/:mid', (req, res) => {
        deviceController.updateDevice(app, db, req, res);
    });
};