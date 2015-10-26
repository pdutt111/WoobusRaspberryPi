/**
 * Created by pariskshitdutt on 26/10/15.
 */
var WebTorrent = require('webtorrent-hybrid')
var fs=require('fs');
var client = new WebTorrent()

fs.readdir('../movies',function(err,files){
    client.seed(files, function onTorrent (torrent) {
        console.log('Client is seeding:', torrent.infoHash)
    })
})