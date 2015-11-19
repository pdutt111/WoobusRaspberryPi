/**
 * Created by pariskshitdutt on 03/11/15.
 */
var db=require('../db/DbSchema.js');

var route=db.getroutedef;

var rt=new route({
        "start": "Bangalore",
        "end": "Hyderabad",
        "fare": 1200,
        "distance": 1000,
        "time_taken": 1000000,
        "_id": "5623babac95cff606f40ebd4",
        "active": true,
        "scheduled_stops": [
            {
                "name": "mcdonalds",
                "location": [
                    90,
                    90
                ],
                "time_taken": 1000,
                "is_loo": true,
                "is_food": true,
                "restaurants_available": [
                    "mcdonalds",
                    "kfc"
                ]
            }
        ],
        "boarding_points": [
            {
                "point": "kashmere Gate",
                "location": [
                    0,
                    0
                ],
                "time_taken": 10000
            }
        ]
    })
rt.save(function(err,row,info){
    console.log(err,row);
})