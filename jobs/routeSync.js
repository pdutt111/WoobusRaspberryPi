/**
 * Created by pariskshitdutt on 25/10/15.
 */
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
//var redis = require("redis"),
//    client = redis.createClient();
var buslocation=db.getbuslocationdef;
var routeTable=db.getroutedef;
var job = new CronJob({
    cronTime: '50 * * * * *',
    onTick: function() {
        try {
            var options = {
                method: 'get',
                host: config.get('serverUrl'),
                path:"/api/v1/box/route/get?bus_identifier=" + config.get('bus_id')
            };
            request(options, function (err, res, body) {
                try {
                    var businfo = JSON.parse(body);
                    log.info(businfo.route);
                    routeTable.find({start:businfo.route.start,end:businfo.route.end},function(err,route){
                        if(!err&&route.length==0) {
                            log.info(err,route);
                            var route = new routeTable(businfo.route);
                            route.save(function (err, route, info) {
                                log.info(route);
                            })
                        }
                    });
                } catch (e) {
                    log.warn(e);
                }
            })
        }catch(e){};

    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
job.start();