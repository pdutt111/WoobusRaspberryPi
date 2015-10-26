/**
 * Created by pariskshitdutt on 09/06/15.
 */
var LinvoDB = require("linvodb3");
var config = require('config');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));
var userdef;
var pindef;
var busdef;
var routedef;
var bookingsdef;
var catalogdef;
var buslocationdef;
/**
 * user schema stores the user data the password is hashed
 * @type {Schema}
 */
//LinvoDB.defaults.store = { db: require("medeadown") }; // Comment out to use LevelDB instead of Medea

LinvoDB.dbPath = process.cwd()+config.get('dblocation');
var userSchema=new LinvoDB("users",{
    email:String,
    phonenumber:{type:String,unique:true},
    password:{type:String},
    name:{type:String},
    device:{service:String,reg_id:String,active:{type:Boolean,default:true}},
    contacts:[{phonenumber:{type:String},name:String,_id:false}],
    profession:{type:String},
    url:{type:String},
    is_operator:{type:Boolean,default:false},
    is_admin:{type:Boolean,default:false},
    address:{type:String},
    is_verified:{type:Boolean,default:false},
    is_service:{type:Boolean,default:false},
    is_random_password:{type:Boolean,default:true},
    created_time:{type:Date,default:Date.now},
    modified_time:{type:Date,default:Date.now}
});
userSchema.ensureIndex({fieldName:"phonenumber",unique:true});

var pinschema=new LinvoDB("pins",{
    phonenumber:{type:String},
    pin:Number,
    used:{type:Boolean,default:false}
})
var busschema=new LinvoDB("bus",{
    start:String,
    end:String,
    bus_identifier:String,
    fare:Number,
    discounts:String,
    scheduled_stops:[{stop:{type:String},time:Date,_id:false}],
    departure_time:Date,
    arrival_time:Date,
    distance:Number,
    boarding_points:[{point:String, location:{type:[Number]},time:Date,_id:false}],
    total_seats:Number,
    in_transit:Boolean,
    in_booking:Boolean,
    media_loaded:[{name:String,path:String,is_active:Boolean,views:Number,skips:Number,_id:false}],
    media_update:[{path:String,name:String,Description:String,replace:String}],
    loo_requests:Number,
    is_completed:Boolean,
    created_time:{type:Date,default:Date.now},
    modified_time:{type:Date,default:Date.now}
},{});
var routesSchema=new LinvoDB("Routes",{
    start:{type:String,index:true},
    end:{type:String,index:true},
    start_loc:{type:[Number]},
    end_loc:{type:[Number]},
    boarding_points:[{
        point:String,
        location:{type:[Number]},
        time_taken:Number,
        _id:false}],
    scheduled_stops:[{
        name:String,
        location:{type:[Number]},
        restaurants_available:[String],
        is_loo:Boolean,
        is_snacks:Boolean,
        is_food:Boolean,
        time_taken:Number,
        _id:false
    }],
    fare:Number,
    distance:Number,
    time_taken:Number,
    active:{type:Boolean,default:false},
    created_time:{type:Date,default:Date.now},
    modified_time:{type:Date,default:Date.now}
},{});
var buslocationschema=new LinvoDB("buslocation",{
    bus_identifier:String,
    temperature:Number,
    humidity:String,
    speed:Number,
    load_average:Number,
    ram_used:Number,
    total_ram:Number,
    ram_used_process:Number,
    upload_speed:Number,
    download_speed:Number,
    ip:String,
    uptime:Number,
    cpus:{model:String,speed:Number,count:Number},
    bearing:String,
    users_connected:Number,
    pi_time:Date,
    location:{type:[Number]},
    created_time:{type:Date,default:Date.now},
    modified_time:{type:Date,default:Date.now}
},{});
var catalogSchema=new LinvoDB("catalog",{
    name:String,
    description:String,
    pic:String,
    path:String,
    skips:Number,
    views:Number,
    language:String,
    content_type:String,
    is_verified:Boolean
},{});

/**
 * once the connection is opened then the definitions of tables are exported and an event is raised
 * which is recieved in other files which read the definitions only when the event is received
 */
    userdef=userSchema;
    pindef=pinschema;
    busdef=busschema;
    routedef=routesSchema;
    catalogdef=catalogSchema;
    buslocationdef=buslocationschema;

    exports.getpindef=pindef;
    exports.getbusdef=busdef;
    exports.getroutedef=routedef;
    exports.getuserdef= userdef;
    exports.getcatalogdef= catalogdef;
    exports.getbuslocationdef= buslocationdef;
    events.emitter.emit("db_data");

