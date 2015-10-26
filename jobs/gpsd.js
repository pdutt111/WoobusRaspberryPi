/**
 * Created by pariskshitdutt on 25/10/15.
 */
var gpsd = require('node-gpsd');
var events=require('../events');
var config= require('config');
var log = require('tracer').colorConsole(config.get('log'));

var daemon = new gpsd.Daemon({
    program: 'gpsd',
    device: '/dev/ttyAMA0',
    port: 2947,
    pid: '/tmp/gpsd.pid',
    logger: {
        info: function(info) {
            log.info(info);
        },
        warn: console.warn,
        error: console.error
    }
});
daemon.start(function() {
    console.log('Started');
});
var listener = new gpsd.Listener({
    port: 2947,
    hostname: 'localhost',
    logger:  {
        info: function(info) {
            log.info(info)
        },
        warn: console.warn,
        error: console.error
    },
    parse: true
});
listener.on('TPV', function(tpvData){
    log.info(tpvData);
    events.emitter.emit("location",tpvData);
})