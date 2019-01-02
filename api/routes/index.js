const deviceRoutes = require('./device.route');
const brainRoutes = require('./brain.route');

module.exports = function(api, db) {
  deviceRoutes(api, db);
  brainRoutes(api, db);
};