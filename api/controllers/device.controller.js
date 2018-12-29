const config = require("../../config.json");
const functions = require("../../functions");

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
    var device = { mid: functions.generateMID(config.midLength), name: req.body.name, alias: req.body.alias, ip: req.body.ip, status: req.body.status, value: req.body.value, additional: req.body.additional, time: new Date().toJSON() };

    for(var key in device) {
        if(device[key] == undefined || device[key] == '')
            device[key] = null;
    }

    if(device.name == null || device.ip == null) {
        res.send({ ok: 0, error: "You didn't specify a name or an IP for the device." });
        return;
    }

    device.additional = (device.additional == null ? {} : JSON.parse(device.additional));

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
                res.send({ ok: 0, error: "There's no device with such MID." });
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
                res.send({ ok: 0, error: "There's no device with such MID." });
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
            var newData = new Object();

            newData.alias = req.body.alias;
            newData.status = req.body.status;
            newData.value = req.body.value;
            newData.additional = req.body.additional;

            for(var key in newData) {
                if(newData[key] == undefined || newData[key] == '') {
                    if(key != "additional")
                        newData[key] = currDevice[key];
                    else
                        newData[key] = JSON.stringify(currDevice[key]);
                }
            }

            newData.additional = (newData.additional == null ? {} : JSON.parse(newData.additional)); 

            const device = { mid: currDevice.mid, name: currDevice.name, ip: currDevice.ip, alias: newData.alias, status: newData.status, value: newData.value, additional: newData.additional, time: currDevice.time };

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