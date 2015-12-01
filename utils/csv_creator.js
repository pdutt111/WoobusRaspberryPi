/**
 * Created by pariskshitdutt on 03/09/15.
 */
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var fs = require('fs');
var converter = require('json-2-csv');

var wstream = fs.createWriteStream('myOutput.csv');
wstream.write("aes,arrTime,busType,DateOfJourney,depTime,FromCity,FromCityId,maxLowerColumns," +
    "maxLowerRows,maxUpperColumns,maxUpperRows,MPax,mxSPrTxn,Notes,operatorId,RouteId,ToCity,ToCityId," +
    "Travels,vehicleType,amenties,travelDate,depTimeString,arrTimeString,isBPMapLinkShown,boardingPoints," +
    "total_seats,fare,seats_available,seats_booked\n");
var url = 'mongodb://localhost:27017/redbus';
// Use connect method to connect to the Server\
//last print 453437
MongoClient.connect(url, function(err, db) {
    var cursor =db.collection('redbus').find({});
    var count=0;
    //cursor.skip(455755);
    cursor.each(function(err,doc) {
        console.log(count++);
            if (doc != null && doc.seats_data != null) {
                try {
                    var output = doc.seats_data;
                    output.boardingPoints = "";
                    for (var i = 0; i < output.BPInformationList.length; i++) {
                        output.boardingPoints = output.boardingPoints + "|" + output.BPInformationList[i].BpAddress;
                    }
                    output.total_seats = output.seatlist.length
                    var available = 0;
                    var booked = 0;
                    var fare = 0;
                    for (var i = 0; i < output.seatlist.length; i++) {
                        if (output.seatlist[i].isAvailable) {
                            available++;
                        } else {
                            booked++;
                        }
                        if (fare < output.seatlist[i].Fare) {
                            fare = output.seatlist[i].Fare;
                        }

                    }
                    output.fare = fare;
                    output.seats_available = available;
                    output.seats_booked = booked;
                    delete output.seatlist;
                    delete output.BPInformationList;
                    delete output.DPInformationList;

                } catch (e) {
                    console.log(e);
                }
                for(var key in output){
                    if(typeof output[key]=="string")
                    output[key]=output[key].replace(/,/g,";");
                }
                converter.json2csv(output, function (err, csv) {
                    //console.log(err);
                    if(err){
                        console.log("content:",err,csv);
                        process.kill(process.pid);
                    }
                    wstream.write(csv.split("\n")[1]+"\n");
                });
                if(!cursor.hasNext()._result){
                    //db.close();
                }
            }

    });
});