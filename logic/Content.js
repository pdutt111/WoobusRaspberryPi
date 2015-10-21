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

var content={
    getContent:function(req,res){
        var def= q.defer();
        catalogTable.find({is_verified:true},function(err,catalog){
            if(!err){
                def.resolve(catalog);
            }else{
                def.reject({status: 500, message: config.get('error.dberror')});
            }
        });
        return def.promise;
    }
}

module.exports=content;