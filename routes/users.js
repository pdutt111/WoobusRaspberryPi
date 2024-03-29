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

var usersLogic=require('../logic/Login');

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
/* GET users listing. */

router.post('/create',params({body:['phonenumber']},{message : config.get('error.badrequest')}),
    function(req,res,next){
        usersLogic.pinLogic(req,res)
            .then(function(response){
                res.json({pin:response});
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            })
    });
router.post('/verifyPhonenumber',params({body:['phonenumber','pin']},{message : config.get('error.badrequest')}),
    function(req,res,next) {
        usersLogic.verifyPhonenumber(req,res)
            .then(function(response){
                req.user=response;
                next();
            })
            .catch(function(err){
                log.info(err);
                if(err.status==404){
                        usersLogic.userCreate(req,res)
                            .then(function(user){
                                req.user=user;
                                req.secret=true;
                                next();
                            })
                            .catch(function(err){
                                res.status(err.status).json(err.message);
                            }).done();
                }else{
                    res.status(err.status).json(err.message);
                }
            }).done();
    },
    function(req, res, next) {
        usersLogic.sendToken(req,res)
            .then(function(response){
                res.json(response);
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            }).done();
    });
router.post('/protected/updateUserProfile',
    function(req,res,next) {
        usersLogic.updateUserProfile(req,res)
            .then(function(response){
                res.json(response);
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            }).done();
    });
router.post('/protected/feedback',
    function(req,res,next){
        usersLogic.sendFeedback(req,res)
            .then(function(){
                res.json(config.get('ok'))
            }).catch(function(err){
                log.error(err);
                res.status(500).json(config.get('error.dberror'));
            })
    });
router.post('/signin',params({body:['phonenumber','password']},{message : config.get('error.badrequest')}),
    function(req,res,next){
        usersLogic.signin(req,res)
            .then(function(user){
                req.user=user;
                req.secret=false;
                next();
            }).catch(function(err){
                res.status(err.status).json(err.message);
            }).done();
    },
    function(req,res,next){
        usersLogic.sendToken(req,res)
            .then(function(response){
                res.json(response);
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            }).done();
    })
router.post('/protected/info/renew',params({body:['secret']},{message : config.get('error.badrequest')}),
    function(req,res,next){
        usersLogic.renewToken(req,res)
            .then(function(){
                req.secret=false;
                next();
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            }).done();
    },
    function(req,res,next){
        usersLogic.sendToken(req,res)
            .then(function(response){
                res.json(response);
            })
            .catch(function(err){
                log.error(err);
                res.status(500).json(config.get('error.dberror'));
            }).done();
    });

router.get('/protected/info',params({headers:['authorization']},{message : config.get('error.badrequest')}),function(req,res,next){
    delete req.user.password;
    delete req.user._id;
    res.json(req.user);
});
router.get('/state',
    function(req,res,next){
        usersLogic.getstate(req,res)
            .then(function(state){
                res.json(state);
            })
            .catch(function(err){
                res.status(500).json(config.get('error.dberror'));
            })
    });
module.exports = router;
