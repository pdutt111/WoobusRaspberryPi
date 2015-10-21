/**
 * Created by pariskshitdutt on 21/09/15.
 */
//var sensorLib = require('node-dht-sensor');
var q= require('q');
var os=require('os');
var util = require('util');
var speedtest=require('speedtest-net');

var func={
    getDHTReading:function(){
        var readout={temperature:0,humidity:0};
        //sensorLib.initialize(22, 4);
        //readout = sensorLib.read();
        //console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
        //    'humidity: ' + readout.humidity.toFixed(2) + '%');
        return readout;
    },
    getCoordinates:function(){
        var coords={
            lat:0,
            lon:0
        }
        return coords;
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
        var ramUsage=process.memoryUsage();
        return ramUsage.heapTotal;
    },
    getNetSpeed:function(){
        var def= q.defer();
        speedtest().on('data',function(data){
            def.resolve(data.speeds);
        });
        def.resolve({download:0,upload:0});
        return def.promise;
    }
};
module.exports=func;