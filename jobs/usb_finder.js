/**
 * Created by pariskshitdutt on 21/12/15.
 */
//var usb = require('usb')
//usb.getDeviceList(function(device){console.log(device)});
var usbDetect = require('usb-detection');
usbDetect.on('add', function(device) {
    console.log('add', device);
});
