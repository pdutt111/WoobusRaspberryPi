/**
 * Created by pariskshitdutt on 04/09/15.
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

var userTable;
var pinTable;
userTable=db.getuserdef;
pinTable=db.getpindef;
var feedbackTable=db.getfeedbackdef;

var users={
    pinLogic:function(req,res){
        var def= q.defer();
        var pin=Math.floor(Math.random()*90000) + 10000;
        pinTable.update({phonenumber:req.body.phonenumber},{phonenumber:req.body.phonenumber,pin:pin,used:false},
            {upsert:true},function(err,info){
                if(!err) {
                    def.resolve(pin);
                }else{
                    def.reject({status: 500, message: config.get('error.dberror')});
                }
            });
        return def.promise;
    },
    userCreate:function(req,res){
        var def= q.defer();
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(randomString(5,'aA#'), salt, function(err, hash) {
                // Store hash in your password DB.
                req.body.password=hash;
                req.body.is_operator=false;
                req.body.is_operator=false;
                req.body.bus_id=config.get('bus_id');
                req.body.is_random_password=true;
                req.body.is_verified=true;
                req.body.created_time=new Date();
                req.body.modified_time=new Date();

                var user = new userTable(req.body);
                user.save(function(err,user,info){
                    log.info(err,user);
                    if(!err&&user){
                        var tokendata={
                            _id:user._id,
                            phonenumber:user.phonenumber,
                            is_verified:user.is_verified,
                            is_operator:user.is_operator,
                            is_admin:user.is_admin

                        };
                        def.resolve(tokendata);
                    }else{
                            userTable.findOne({phonenumber:req.body.phonenumber},function(err,user){
                                if(!err&&user) {
                                    log.info(err,user);
                                    user.is_verified = false;
                                    user.save(function (err, user, info) {
                                        def.resolve(user);
                                    })
                                }else{
                                    def.reject({status: 500, message: config.get('error.dberror')});
                                }
                            });
                    }
                });
            });
        });

        return def.promise;
    },
    signin:function(req,res){
        var def= q.defer();
        def.reject({status: 500, message: config.get('error.dberror')});
        return def.promise;
    },
    verifyPhonenumber:function(req,res){
        var def=new q.defer();
        console.log(req.body);
        pinTable.find({phonenumber:req.body.phonenumber,pin:Number(req.body.pin),used:false},function(err,pin){
            log.warn(err,pin);
                if(!err&&pin.length>0){
                    userTable.findOne({phonenumber:req.body.phonenumber},function(err,user) {
                        if(!err&&user) {
                            pinTable.update({phonenumber:req.body.phonenumber},{$set:{used:true}},function(err,info){

                            });
                            userTable.update({_id:user._id},{$set:{is_verified:true}},function(err,info){
                               log.info(err,info);
                            });
                            user.save(function(err,user,info){
                                var tokendata={
                                    _id:user._id,
                                    phonenumber:user.phonenumber,
                                    is_verified:true,
                                    is_operator:user.is_operator,
                                    is_admin:user.is_admin

                                };
                                log.info(tokendata);
                                def.resolve(tokendata);
                            });
                        }else{
                            def.reject({status: 404, message: config.get('error.notfound')});
                        }
                    });
                }else{
                    def.reject({status: 401, message: config.get('error.unauthorized')});
                }
            });
        return def.promise;
    },
    renewToken:function(req,res){
        var def= q.defer();
        if(req.user._id==req.body.secret) {
            def.resolve();
        }else{
            def.reject({status:401,message:config.get('error.unauthorized')});
        }
        return def.promise;
    },
    sendToken:function(req,res){
        var def= q.defer();
        delete req.user.is_operator;
        delete req.user.password;
        var expires = new Date(moment().add(config.get('token.expiry'), 'days').valueOf()).toISOString();
        var token_data={
            user: req.user,
            exp: expires
        };
        var token = jwt.encode({
            data:crypto.encryptObject(token_data)
        }, config.get('jwtsecret'));
        var response={
            token: token,
            secret:req.user._id,
            expires: expires
        };
        if(!req.secret){
            delete response.secret;
        }

        def.resolve(response);
        return def.promise;
    },
    sendFeedback:function(req,res){
        var def= q.defer();
        req.body.created_time=new Date();
        req.body.modified_time=new Date();
        req.body.bus_id=config.get('bus_id');
        req.body.phonenumber=req.user.phonenumber;
        req.body.user_id=req.user._id;
        req.body.bus_id=config.get('bus_id');
        log.info(JSON.stringify(req.body));
        var feedback=new feedbackTable(req.body);
            feedback.save(function(err, rows) {
                if(!err) {
                    def.resolve();
                } else {
                    def.reject({status: 500, message: config.get('error.dberror')});
                }
            });
        return def.promise;
    },
    getstate:function(req,res){
        var def= q.defer();
        def.resolve(config.get('state'));
        return def.promise;
    },
    updateUserProfile:function(req,res){
        var def= q.defer();
            def.reject({status: 500, message: config.get('error.dberror')});
        return def.promise;
    }

};
function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
    return result;
}
module.exports=users;