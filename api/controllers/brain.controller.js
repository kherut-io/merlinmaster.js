exports.printAllData = function(api, db, req, res) {
    res.send(getData(["temperatureCPU", "uptime, cpuinfo"]));
};

exports.printData = function(api, db, req, res) {
    res.send(getData([req.params.info]));
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