/**
 * Created by pariskshitdutt on 21/09/15.
 */
var config= require('config');
var jwt = require('jwt-simple');
var fs = require('fs');
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
var synctimefile="synctimefeedback";
var syncTime;
var feedbackTable=db.getfeedbackdef;
//var redis = require("redis"),//    client = redis.createClient();
var job = new CronJob({
    cronTime: '*/10 * * * * *',
    onTick: function() {
        try{
            fs.readFile(synctimefile, "utf8", function(err, data) {
                if(!err){
                    console.log(data);
                    syncTime=new Date(data);
                }
                log.info(syncTime);
                if(!syncTime){
                    syncTime=new Date(0);
                }
                var queryTime = moment(syncTime.getTime()).subtract(15, 'minutes');
                log.info(queryTime.toString());
                feedbackTable.find({created_time:{$gte:new Date(queryTime.toString())}},function(err,feedbacks){
                    //log.info(err,feedbacks);
                    if(feedbacks.length>0) {
                        var data = {
                            bus_identifier: config.get("bus_id"),
                            feedbacks: feedbacks
                        };
                        try {
                            var options = {
                                method: 'post',
                                body: data,
                                json: true,
                                uri: config.get('serverUrl') + "/api/v1/box/feedback"
                            }
                            request(options, function (err, res, body) {
                                log.info(err,body);
                                if(!err){
                                    if (body.result == "ok") {
                                        updateSyncTime();
                                        log.info("feedbacks synced");
                                    }
                                }
                            })
                        } catch (e) {

                        }
                        ;
                    }
                });
            });
        }catch(e){log.warn(e);}
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
function updateSyncTime(){
    syncTime = new Date();
    fs.writeFile(synctimefile, syncTime.toUTCString(), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}
job.start();