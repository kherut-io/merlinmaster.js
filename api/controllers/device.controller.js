const config = require("../../config.json");

exports.listAllDevices = function(app, db, req, res) {
    db.collection('device').find({}).toArray((err, result) => {
        if (err) {
            res.send({'error':'An error has occurred'});
        } else {
            res.send(result);
        } 
    });
};

exports.addDevice = function(app, db, req, res) {
    const device = { mid: generateMID(config.midLength), name: req.body.name, alias: null, ip: req.body.ip, status: "UP", value: null, time: new Date().getTime() };

    db.collection('device').insert(device, (err, result) => {
        if (err) { 
            res.send({ 'error': 'An error has occurred' }); 
        } else {
            res.send(result.ops[0]);
        }
    });
};

exports.showDevice = function(app, db, req, res) {
    const details = { 'mid': req.params.mid };

    db.collection('device').findOne(details, (err, result) => {
        if (err) {
            res.send({'error':'An error has occurred'});
        } else {
            if(result == null) {
                res.send({ ok: 0 });
            } else
                res.send(result);
        } 
    });
};

exports.removeDevice = function(app, db, req, res) {
    const details = { 'mid': req.params.mid };

    db.collection('device').findOne(details, (err, result) => {
        if (err) {
            res.send({'error':'An error has occurred'});
        } else {
            if(result == null) {
                res.send({ ok: 0 });
            }
            
            else {
                db.collection('device').remove(details, (err, result) => {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {
                        res.send({ ok: 1 });
                    } 
                });
            }
                
        } 
    });
};

exports.updateDevice = function(app, db, req, res) {
    const details = { 'mid': req.params.mid };

    db.collection('device').findOne(details, (err, result) => {
        if (err) {
            res.send({'error':'An error has occurred'});
        } else {
            var currDevice = result;

            var newAlias = req.body.alias,
                newStatus = req.body.status,
                newValue = req.body.value;

            if(newAlias == null)
                newAlias = currDevice.alias;

            if(newStatus == null)
                newStatus = currDevice.status;

            if(newValue == null)
                newValue = currDevice.value;

            const device = { mid: currDevice.mid, name: currDevice.name, ip: currDevice.ip, alias: newAlias, status: newStatus, value: newValue, time: currDevice.time };

            db.collection('device').update(details, device, (err, result) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    db.collection('device').findOne(details, (err, result) => {
                        if (err) {
                            res.send({'error':'An error has occurred'});
                        } else {
                            res.send(result);
                        }
                    });
                } 
            });
        } 
    });
};

function generateMID(length) {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

    var mid = "";

    for(var i = 0; i < length; i++)
        mid += characters[Math.floor(Math.random() * characters.length)];

    return mid;
}