module.exports = function(info) {
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
};