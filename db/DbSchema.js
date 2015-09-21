/**
 * Created by pariskshitdutt on 09/06/15.
 */
var mongoose = require('mongoose');
//var mockgoose=require('mockgoose');
var config = require('config');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));
var ObjectId = require('mongoose').Types.ObjectId;
var validate = require('mongoose-validator');
if(config.get('mockgoose')) {
    //mockgoose(mongoose);
}
var nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Name should be between 3 and 50 characters'
    })
];
var emailValidator=[
    validate({
        validator: 'isEmail',
        message: "not a valid email"
    })
];
var db=mongoose.createConnection(config.get('mongo.location'),config.get('mongo.database'));
var userdef;
var pindef;
var busdef;
var stopsdef;
var bookingsdef;
var buslocationdef;
var Schema = mongoose.Schema;
mongoose.set('debug', config.get('mongo.debug'));
/**
 * user schema stores the user data the password is hashed
 * @type {Schema}
 */
var userSchema=new Schema({
    email:{type:String,validate:emailValidator,unique:true,dropDups:true,required:true},
    phonenumber:String,
    password:{type:String,required:true},
    name:{type:String},
    is_verified:{type:Boolean,default:false},
    device:{service:String,reg_id:String,active:{type:Boolean,default:true}},
    contacts:[{phonenumber:{type:String},name:String,_id:false}],
    profession:{type:String},
    url:{type:String},
    is_operator:Boolean,
    devices:[{device_id:String,registration_id:String,enabled:Boolean,last_used:Date}],
    address:{type:String},
    loc:{type:[Number], index:"2dsphere"},
    is_service:{type:Boolean,default:false},
    created_time:{type:Date,default:Date.now},
    modified_time:{type:Date,default:Date.now}
});
var pinschema=new Schema({
    phonenumber:{type:String},
    pin:Number,
    used:{type:Boolean,default:false}
})
var busschema=new Schema({
    user_id:{type:Schema.ObjectId,ref:'user'},
    start:String,
    end:String,
    bus_identifier:String,
    fare:Number,
    discounts:String,
    scheduled_stops:[{stop:{type:Schema.ObjectId,ref:'stops'},time:Date,_id:false}],
    discounted_price:Number,
    departure_time:Date,
    arrival_time:Date,
    distance:Number,
    images:[String],
    boarding_points:[{point:String, location:{type:[Number],index:"2dsphere"},time:Date,_id:false}],
    total_seats:Number,
    in_transit:Boolean,
    seats:[{seat_no:Number,is_window:Boolean,is_booked:Boolean,booking_id:{type:Schema.ObjectId,ref:'bookings'},_id:false}],
    in_booking:Boolean,
    media_loaded:[{name:String,path:String,is_active:Boolean,views:Number,skips:Number,_id:false}],
    media_update:[{path:String,name:String,Description:String,replace:String}],
    loo_requests:Number,
    is_completed:Boolean,
    created_time:{type:Date,default:Date.now},
    modified_time:{type:Date,default:Date.now}
});
var stopschema=new Schema({
    name:String,
    location:{type:[Number], index:"2dsphere"},
    restaurants_available:[String],
    is_loo:Boolean,
    is_snacks:Boolean,
    is_food:Boolean,
    created_time:{type:Date,default:Date.now},
    modified_time:{type:Date,default:Date.now}
});
var buslocationschema=new Schema({
    bus_identifier:String,
    temperature:Number,
    humidity:String,
    speed:Number,
    load_average:Number,
    ram_used:Number,
    ip:String,
    bearing:String,
    users_connected:Number,
    pi_time:Date,
    location:{type:[Number], index:"2dsphere"},
    created_time:{type:Date,default:Date.now},
    modified_time:{type:Date,default:Date.now}
})
var bookingschema=new Schema({
    user_id:{type:Schema.ObjectId,ref:'user'},
    bus_id:{type:Schema.ObjectId,ref:'buses'},
    amount:Number,
    is_confirmed:{type:Boolean,default:false},
    seat_no:Number,
    feedback:String,
    created_time:{type:Date,default:Date.now},
    modified_time:{type:Date,default:Date.now}
});
bookingschema.index({bus_id:1,seat_no:1},{unique:true});
db.on('error', function(err){
    log.info(err);
});
/**
 * once the connection is opened then the definitions of tables are exported and an event is raised
 * which is recieved in other files which read the definitions only when the event is received
 */
    userdef=db.model('user',userSchema);
    pindef=db.model('pins',pinschema);
    busdef=db.model('buses',busschema);
    stopsdef=db.model('stops',stopschema);
    bookingsdef=db.model('bookings',bookingschema);
    buslocationdef=db.model('buslocation',buslocationschema);

    exports.getpindef=pindef;
    exports.getbusdef=busdef;
    exports.getbookingsdef=bookingsdef;
    exports.getstopsdef=stopsdef;
    exports.getuserdef= userdef;
    exports.getbuslocationdef= buslocationdef;
    events.emitter.emit("db_data");

