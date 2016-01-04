/**
 * Created by pariskshitdutt on 30/09/15.
 */
var q= require('q');
var config= require('config');
var jwt = require('jwt-simple');
var db=require('../db/DbSchema');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));
var calcDist=require('../jobs/calculateDistance');

var userTable=db.getuserdef;
var routeTable=db.getroutedef;

var route={
    getRoute:function(req,res){
        var def= q.defer();
        routeTable.find({active:true}).sort({created_time:1}).limit(1).exec(function(err,routes){
            if(!err&&routes.length>0){
                //routes[0].scheduled_stops=JSON.parse(routes[0].scheduled_stops);
                def.resolve(routes[0]);
            }else{
                log.warn(err);
                def.reject({status: 500, message: config.get('error.dberror')});
            }
        });
        return def.promise;
    },
    postLocation:function(req,res){
        var def= q.defer();
        if(req.body.accuracy<100){
            events.emitter.emit('location',req.body);
        }
        def.resolve();
        return def.promise;
    }
}

module.exports=route;