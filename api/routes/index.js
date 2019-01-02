const deviceRoutes = require('./device.route');
const brainRoutes = require('./brain.route');

module.exports = function(api, webserver, db) {
  deviceRoutes(api, db);
  brainRoutes(api, webserver, db);
};