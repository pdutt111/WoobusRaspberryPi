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

var userTable;
var pinTable;
userTable=db.getuserdef;
pinTable=db.getpindef;

router.get('/currentRoute',
    function(req,res,next) {
        routeLogic.getRoute(req,res)
            .then(function(content){
                res.json(content);
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            }).done();
    });

module.exports = router;
