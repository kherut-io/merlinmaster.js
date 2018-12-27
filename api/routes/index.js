const deviceRoutes = require('./device.route');
const brainRoutes = require('./brain.route');

module.exports = function(app, db) {
  deviceRoutes(app, db);
  brainRoutes(app, db);
};