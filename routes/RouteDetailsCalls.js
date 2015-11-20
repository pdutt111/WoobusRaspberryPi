/**
 * Created by pariskshitdutt on 14/10/15.
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
var crypto=require('../authentication/crypto');

var routeLogic=require('../logic/RouteDetails');
var distanceCalc=require('../jobs/distance_final');

var userTable;
var pinTable;
userTable=db.getuserdef;
pinTable=db.getpindef;

router.get('/currentRoute',
    function(req,res,next) {
        routeLogic.getRoute(req,res)
            .then(function(content){
                req.content=content;
                next();
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            }).done();
    },
function(req,res){
    var calcs=distanceCalc.getJourneyDetails();
    var response=req.content;
    //log.info(calcs);
    try{
        response=response.toObject();
    }catch(e){
        log.warn(e);
    }
    for(var i in calcs){
        response[i]=calcs[i];
        //log.info(response[i]);
    }

    var scheduled_stops= JSON.parse(response.scheduled_stops);
    var boarding_points=JSON.parse(response.boarding_points);
    delete response.scheduled_stops;
    delete response.boarding_points;
    response.scheduled_stops=scheduled_stops;
    response.boarding_points=boarding_points;
    res.json(response);
});

module.exports = router;
