/**
 * Created by pariskshitdutt on 25/10/15.
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
    cronTime: '0 */10 * * * *',
    onTick: function() {
        log.info("making routesync request");
        try {
            var options = {
                method: 'get',
                uri:config.get('serverUrl')+"/api/v1/box/route/get?bus_identifier=" + config.get('bus_id')
            };
            request(options, function (err, res, body) {
                if(!err){
                    try {
                        var businfo = JSON.parse(body);
                        log.info(businfo);
                        if(businfo.route.start&&businfo.route.end){
                            businfo.route.scheduled_stops=JSON.stringify(businfo.route.scheduled_stops);
                            businfo.route.boarding_points=JSON.stringify(businfo.route.boarding_points);
                            routeTable.find({start:businfo.route.start,end:businfo.route.end},function(err,route){
                                if(!err) {
                                    routeTable.remove({},function(err,info){
                                        var route = new routeTable(businfo.route);
                                        route.save(function (err, route, info) {
                                        })
                                    });
                                }
                            });
                        }else{
                            routeTable.remove({},function(err,info){
                                log.info("route completed");
                            })
                        }
                    } catch (e) {
                        log.warn(e);
                    }
                }
            })
        }catch(e){};

    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
job.start();