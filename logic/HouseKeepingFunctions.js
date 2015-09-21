/**
 * Created by pariskshitdutt on 21/09/15.
 */
var sensorLib = require('node-dht-sensor');
var os=require('os');
var util = require('util');

var func={
    getDHTReading:function(){
        sensorLib.initialize(22, 4);
        var readout = sensorLib.read();
        console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
            'humidity: ' + readout.humidity.toFixed(2) + '%');
        return readout;
    },
    getCoordinates:function(){
        var coords={
            lat:0,
            lon:0
        }
        return coords;
    },

    getIP:function(){
        return "192.168.0.1";
    },
    getUsersConnected:function(){
        return 0;
    },
    getSpeed:function(){
        return 0;
    },
    getBearing:function(){
        return "";
    },
    getUptime:function(){
        return os.uptime()
    },
    getLoadAverage:function(){
        return os.loadavg()[2];
    },
    getCPUModel:function(){
        return os.cpus()[0].model;
    },
    getCPUSpeed:function(){
        return os.cpus()[0].speed;
    },
    getCPUCount:function(){
        return os.cpus().length;
    },
    getRamUsed:function(){
        return os.freemem();
    },
    getTotalRam:function(){
        return os.totalmem();
    },
    getRamUsedProcess:function(){
        return util.inspect(process.memoryUsage()).heapTotal;
    }
}