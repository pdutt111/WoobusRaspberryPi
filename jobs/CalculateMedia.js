/**
 * Created by pariskshitdutt on 22/11/15.
 */
var config= require('config');

var db=require('../db/DbSchema');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));
var CronJob = require('cron').CronJob;
var request=require('request');
var fs=require('fs');
var WebTorrent = require('webtorrent');
var exif = require('exif2');
//var redis = require("redis"),
//    client = redis.createClient();
var catalog=db.getcatalogdef;
//var job = new CronJob({
//    cronTime: '15 * * * * *',
//    onTick: function() {
//
//    },
//    start: false,
//    timeZone: 'Asia/Kolkata'
//});
//job.start();
populateMedia();
function populateMedia(){
    fs.readdir('./movies',function(err,items){
        if(!err&&items&&items.length>0){
            for(var i=0;i<items.length;i++){
                log.info('./movies/'+items[i]);
                exif('./movies/'+items[i], function (err, metadata) {
                    log.info(err,metadata.title);
                    var client = new WebTorrent()
                    //var buffer = fs.readFileSync('./movies/'+this.name);
                    client.seed(['./movies/'+this.name], function (torrent) {
                        console.log('Client is seeding ' + torrent.infoHash)
                    })

                }.bind({name:items[i]}));
            }
        }


    })
}