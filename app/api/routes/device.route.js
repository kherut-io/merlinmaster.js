const controller = require("../controllers/device.controller");

module.exports = function(api, db) {
    api.get('/device', (req, res) => {
        controller.listAllDevices(api, db, req, res);
    });

    api.post('/device', (req, res) => {
        controller.addDevice(api, db, req, res);
    });

    api.get('/device/:mid', (req, res) => {
        controller.showDevice(api, db, req, res);
    });

    api.delete('/device/:mid', (req, res) => {
        controller.removeDevice(api, db, req, res);
    });

    api.put('/device/:mid', (req, res) => {
        controller.updateDevice(api, db, req, res);
    });
};