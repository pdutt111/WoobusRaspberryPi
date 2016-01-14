/**
 * Created by pariskshitdutt on 14/01/16.
 */
/**
 * Created by pariskshitdutt on 21/12/15.
 */
process.env['ALLOW_CONFIG_MUTATIONS']=true;
var config= require('config');
var jwt = require('jwt-simple');
var fs=require('fs');
var ObjectId = require('mongoose').Types.ObjectId;
var moment= require('moment');
var async= require('async');
var db=require('../db/DbSchema');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));
var request=require('request');
var _basePath="/boot/";
try{
    var data=fs.readFileSync(_basePath+"woobus_bus_id.txt",'utf8')
    log.info("the woobus id is",data);
    //config.util.setPath(config,"bus_id",data);
    config["bus_id"]=data;
    log.info(config.get('bus_id'));
}catch(e){
    fs.writeFile(_basePath+"woobus_bus_id.txt",config.get('bus_id'),function(err,info){
        log.info("created a woobus_bus_id file");
    })
}