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
var _basePath="/media/";
var _localPath="/movies/";
//var redis = require("redis"),
//    client = redis.createClient();
var buslocation=db.getbuslocationdef;
var routeTable=db.getroutedef;
getmovies(_localPath);
var job = new CronJob({
    cronTime: '0 */5 * * * *',
    onTick: function() {
        events.emitter.emit("clear movies");
        getmovies(_localPath);
        fs.readdir(_basePath,function(err,files){
            if(!err){
                for (var i = 0; i < files.length; i++) {
                    if (!err) {
                        fs.readdir(_basePath + files[i], function (err, files) {
                            if(!err) {
                                for (var i = 0; i < files.length; i++) {
                                    if (files[i] == "movies") {
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
                //log.warn(err);
            }
        });

    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
function getmovies(path){
    fs.readdir(path,function(err,files){
        if(!err) {
            for (var i = 0; i < files.length; i++) {
                if (files[i].split(".")[files[i].split(".").length-1] == "mp4") {
                    var movie={
                        name: files[i],
                        path: path + "/" + files[i],
                        content_type: "movie",
                        source: "usb"
                    }
                    //log.info(movie);
                    events.emitter.emit("movie found", movie);
                }
            }
        }else{
            log.warn(err);
        }
    })
}
job.start();