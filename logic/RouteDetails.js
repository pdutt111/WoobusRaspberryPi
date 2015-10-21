/**
 * Created by pariskshitdutt on 30/09/15.
 */
var q= require('q');
var config= require('config');
var jwt = require('jwt-simple');
var db=require('../db/DbSchema');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));

var userTable=db.getuserdef;
var routeTable=db.getroutedef;

var route={
    getRoute:function(req,res){
        var def= q.defer();
        routeTable.find({active:true},function(err,route){
            if(!err){
                def.resolve(route);
            }else{
                log.warn(err);
                def.reject({status: 500, message: config.get('error.dberror')});
            }
        });
        return def.promise;
    }
}

module.exports=route;