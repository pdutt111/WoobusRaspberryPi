/**
 * Created by pariskshitdutt on 02/11/15.
 */
var q= require('q');
var config= require('config');
var db=require('../db/DbSchema');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));
var route=require('../logic/RouteDetails')

var routeTable=db.getroutedef;
var distance = require('google-distance');
distance.apiKey = 'AIzaSyCRYtCmC0c8Cgxa5t5mrrXThyXW7KAUAw0';

var location_data={lat:0,lon:0,speed:0,track:0};
events.emitter.on('location',function(data){
    location_data=data;
});
//var distanceInterval;
//if(!distanceInterval){
//distanceInterval=setInterval(getRoute,1000*10);
//}
var getRoute=function(){
    route.getRoute(null,null)
        .then(function(routes){
            if(location_data.lat==0&&location_data.lon==0) {
                location_data.lat=routes.start_loc[1];
                location_data.lon=routes.start_loc[0];
            }
            log.info(location_data);
            log.info(routes.end_loc);
            distance.get(
                {
                    origin:location_data.lat+","+location_data.lon,
                    destination: routes.end_loc[1] + "," + routes.end_loc[0]
                },
                function (err, data) {
                    if (!err){
                        log.info(data);
                        data.calc_time=new Date();
                        events.emitter.emit('distance_calculations',data)
                    }else{
                        log.warn(err);
                    }
                });
        });
}
module.exports=getRoute;
