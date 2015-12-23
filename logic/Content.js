/**
 * Created by pariskshitdutt on 30/09/15.
 */
var q= require('q');
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
var bcrypt = require('bcrypt');

var userTable=db.getuserdef;
var pinTable=db.getpindef;
var catalogTable=db.getcatalogdef;
var movies=[];

events.emitter.on("movie found",function(movie){
    log.info(movie);
    movies.push(movie);
})
var content={
    getContent:function(req,res){
        var def= q.defer();
        //var movie=new catalogTable({name:"Tanu Weds Manu",
        //    description:"Its a story of a married couple who lose their spark",
        //    pic:"tanuwedsmanu.jpg",path:"tanu.mp4",
        //    skips:0, views:0, language:"hindi",
        //    content_type:"media/mp4",is_verified:true});
        //movie.save(function(err,info){
        //    log.info(err,info);
        //});
        catalogTable.find({},function(err,catalog){
            if(!err){
                response=catalog.concat(movies);
                def.resolve(response);
            }else{
                def.reject({status: 500, message: config.get('error.dberror')});
            }
        });
        return def.promise;
    },
    postContent:function(req,res){
        var def= q.defer();
        catalogTable.remove({},function(err,info){
            if(err)
                log.info(err);
            log.info(req.body);
            catalogTable.save(req.body,function(err,info){
                def.resolve(config.get('ok'));
            });

        });
        return def.promise;
    }
}

module.exports=content;