/**
 * Created by pariskshitdutt on 21/09/15.
 */
/**
 * Created by pariskshitdutt on 15/09/15.
 */
var config= require('config');
var jwt = require('jwt-simple');
var ObjectId = require('mongoose').Types.ObjectId;
var moment= require('moment');
var async= require('async');
var db=require('../db/DbSchema');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));
var apn=require('../notificationSenders/apnsender');
var gcm=require('../notificationSenders/gcmsender');
var CronJob = require('cron').CronJob;
var request=require('request');
var func=require('../jobs/HouseKeepingFunctions');
//var redis = require("redis"),
//    client = redis.createClient();
var buslocation=db.getbuslocationdef;
var job = new CronJob({
    cronTime: '45 * * * * *',
    onTick: function() {
        try{
        var latlng = func.getCoordinates();
        var reading = func.getDHTReading();
        log.info("status request");
        func.getNetSpeed()
            .then(function (data) {
                console.log("got data");
                var params = {
                    bus_identifier: config.get('bus_id'),
                    temperature: reading.temperature.toFixed(2),
                    humidity: reading.humidity.toFixed(2),
                    location: [latlng.lon, latlng.lat],
                    pi_time: (new Date()).toISOString(),
                    load_average: func.getLoadAverage(),
                    ram_used: func.getRamUsed(),
                    total_ram: func.getTotalRam(),
                    ram_used_process: func.getRamUsedProcess(),
                    users_connected: func.getUsersConnected(),
                    speed: func.getSpeed(),
                    upload_speed: data.upload,
                    download_speed: data.download,
                    uptime: func.getUptime(),
                    cpus: {model: func.getCPUModel(), speed: func.getCPUSpeed(), count: func.getCPUCount()},
                    bearing: func.getBearing()
                };
                try {
                    var options = {
                        method: 'post',
                        body: params,
                        json: true,
                        uri:config.get('serverUrl')+"/api/v1/box/status"
                    }
                    request(options, function (err, res, body) {
                        log.info(body);
                    })
                } catch (e) {
                }
                ;
                var loc = new buslocation(params);
                loc.save(function (err, loc, info) {
                    console.log("saved", err, info);
                });

            })
            .catch(function (err) {
            })
    }catch(e){log.warn(e);}
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
job.start();