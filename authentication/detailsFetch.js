/**
 * Created by pariskshitdutt on 25/07/15.
 */
var q=require('q');
var config= require('config');
var log = require('tracer').colorConsole(config.get('log'));
var db=require('../db/DbSchema');
var events = require('../events');

var userTable;
var reviewTable;
    userTable=db.getuserdef;
    reviewTable=db.getreviewdef;

var details=function(req,res,next){
    var def= q.defer();
    if(req.originalUrl.indexOf("/info")>-1) {
        userTable.findOne({_id: req.user._id}, function (err, user) {
            if(!user){

            }
            if (!err) {
                def.resolve(user)
            }else{
                console.log(err);
                def.reject({status:401,message:config.get('error.unauthorized')});
            }
        });
    }else{
        def.resolve();
    }
    return def.promise;
}

module.exports=details;