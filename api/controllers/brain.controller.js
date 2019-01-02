exports.printAllData = function(api, db, req, res) {
    res.send(getData(["temperatureCPU", "uptime, cpuinfo"]));
};

exports.printData = function(api, db, req, res) {
    res.send(getData([req.params.info]));
};

exports.settings = function(api, db, req, res) {
    //IT DOESN"T WRITE TO FILE - WHY?
    var fs = require('fs');
    var fileName = '../../config.json';
    var file = require(fileName);
    var stream = fs.createWriteStream(fileName);
    
    stream.once('open', function(fd) {
        for(var key in req.body)
            file[key] = (typeof file[key] == 'number' ? parseInt(req.body[key]) : req.body[key]); 

        console.log(JSON.stringify(file, null, 2));
        stream.write(JSON.stringify(file, null, 2));
    
        res.end();
        stream.end();
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