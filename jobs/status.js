/**
 * Created by pariskshitdutt on 21/09/15.
 */
/**
 * Created by pariskshitdutt on 15/09/15.
 */
var express = require('express');
var router = express.Router();
var params = require('parameters-middleware');
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
var funcs=require('../logic/HouseKeepingFunctions');

var job = new CronJob({
    cronTime: '0 * * * * *',
    onTick: function() {
        var latlng=func.getCoordinates();
        var reading=func.getDHTReading();
        var params={
            bus_id:config.get('bus_id'),
            temperature:reading.temperature.toFixed(2),
            humidity:reading.humidity.toFixed(2),
            lat:latlng.lat,
            lon:latlng.lon,
            time:(new Date()).toISOString(),
            load_average:func.getLoadAverage(),
            ram_used:func.getRamUsed(),
            total_ram:func.getTotalRam(),
            ram_used_process:func.getRamUsedProcess(),
            users_connected:func.getUsersConnected(),
            speed:func.getSpeed(),
            uptime:func.getUptime(),
            cpu_model:func.getCPUModel(),
            cpu_speed:func.getCPUSpeed(),
            cpu_count:func.getCPUCount(),
            bearing:func.getBearing()

        }
        request.post(config.get('url')+'/api/v1/status').form(params).on('response', function(response) {
            console.log(response.statusCode);
            console.log(response.headers['content-type']);
        })
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
job.start();
var userTable;
userTable=db.getuserdef;
router.post('/status',params({body:['bus_id','temperature','humidity','lat','lon','time',
    'load_average','ram_used','users_connected','speed','bearing']},{message : config.get('error.badrequest')}),function(req,res){
    sync.postStatus(req,res)
        .then(function(response){
            res.json(response);
        })
        .catch(function(err){
            res.status(err.status).json(err.message);
        });
});


module.exports = router;
