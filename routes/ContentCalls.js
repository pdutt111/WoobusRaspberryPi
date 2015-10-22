/**
 * Created by pariskshitdutt on 30/09/15.
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

var contentLogic=require('../logic/Content');

var userTable;
var pinTable;
userTable=db.getuserdef;
pinTable=db.getpindef;
//router.post('/pin',params({body:['phonenumber']}),function(req,res){
//    usersLogic.pinLogic(req,res)
//        .then(function(info){
//            res.json(config.get('ok'))
//        })
//        .catch(function(err){
//            res.status(err.status).json(err.message);
//        })
//});

router.get('/content',
    function(req,res,next) {
        contentLogic.getContent(req,res)
            .then(function(content){
                res.json(content);
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            }).done();
    });

module.exports = router;
