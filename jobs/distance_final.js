/**
 * Created by pariskshitdutt on 03/11/15.
 */
var q= require('q');
var config= require('config');
var db=require('../db/DbSchema');
var events = require('../events');
var func=require('../jobs/HouseKeepingFunctions');
var log = require('tracer').colorConsole(config.get('log'));
var data;
events.emitter.on('distance_calculations',function(loc_data){
   data=loc_data;
    //log.info(data);
});
var getJourneyDetails=function(){
    var response={};
    log.info(data);
    if(data){
        var speed=func.getSpeed();
        if(speed!=0){
            speed=50;
        }
        var timeElapsed=(new Date()-data.calc_time);
        console.log(new Date(),data.calc_time);
        var distanceCovered=speed*timeElapsed/(1000*60*60);
        response.current_distance=Number(((data.distanceValue-distanceCovered)/1000).toFixed(0));
        response.current_time_taken=(data.durationValue*1000-timeElapsed);
    }
    //log.info(response);
    return response;
}
module.exports.getJourneyDetails=getJourneyDetails;