exports.printAllData = function(app, db, req, res) {
    res.send(getData(["temperatureCPU", "uptime"]));
};

exports.printData = function(app, db, req, res) {
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
        }
    }

    return data;
}