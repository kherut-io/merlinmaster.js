exports.printAllData = function(api, db, req, res) {
    res.send(getData(["temperatureCPU", "uptime, cpuinfo"]));
};

exports.printData = function(api, db, req, res) {
    res.send(getData([req.params.info]));
};

exports.settings = function(api, db, req, res) {
    var fs = require('fs');
    var configFRead = '../../config.json';
    var configFWrite = './config.json';
    var config = require(configFRead);

    for(var key in req.body)
        config[key] = (typeof config[key] == 'number' ? parseInt(req.body[key]) : req.body[key]); 

    fs.writeFile(configFWrite, JSON.stringify(config, null, 2), function(err) {
        if(err) {
            res.send({ ok: 0, error: err });
            return;
        }

        else
            res.send({ ok: 1 });
    }); 
};

function getData(info) {
    var data = Object();

    //RETRIEVE DATA
    for(var i = 0; i < info.length; i++) {
        switch(info[i]) {
            case "temperatureCPU":
                data[info[i]] = 50.0;
                break;
            case "uptime":
                data[info[i]] = 3600;
                break;
            case "cpuinfo":
                data[info[i]] = "cat /proc/cpuinfo <- output";
                break;
        }
    }

    return data;
}