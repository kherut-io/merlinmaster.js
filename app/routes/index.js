const deviceRoutes = require('./device.route');

module.exports = function(app, db) {
  deviceRoutes(app, db);
};