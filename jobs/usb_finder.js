/**
 * Created by pariskshitdutt on 21/12/15.
 */
var config= require('config');
var jwt = require('jwt-simple');
var fs=require('fs');
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
var _basePath="/media/"
//var redis = require("redis"),
//    client = redis.createClient();
var buslocation=db.getbuslocationdef;
var routeTable=db.getroutedef;
var job = new CronJob({
    cronTime: '*/15 * * * * *',
    onTick: function() {
        events.emitter.emit("clear movies");
        fs.readdir(_basePath,function(err,files){
            if(!err){
                for (var i = 0; i < files.length; i++) {
                    if (!err) {
                        log.info(_basePath + files[i])
                        fs.readdir(_basePath + files[i], function (err, files) {
                            if(!err) {
                                for (var i = 0; i < files.length; i++) {
                                    if (files[i] == "movies") {
                                        console.log("getting movies");
                                        getmovies(this.path + "/movies");
                                    }
                                }
                            }else{
                                //log.warn(err);
                            }
                        }.bind({'path': _basePath + files[i]}));
                    }else{
                        //log.warn(err);
                    }
                }
            }else{
                log.warn(err);
            }
        });
        function getmovies(path){
            fs.readdir(path,function(err,files){
                if(!err) {
                    for (var i = 0; i < files.length; i++) {
                        if (files[i].split(".")[1] == "mp4") {
                            var movie={
                                name: files[i],
                                path: path + "/" + files[i],
                                content_type: "media/mp4",
                                source: "usb"
                            }
                            log.info(movie);
                            events.emitter.emit("movie found", movie);
                        }
                    }
                }else{
                    log.warn(err);
                }
            })
        }

    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
job.start();