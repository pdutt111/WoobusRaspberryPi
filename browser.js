/**
 * Created by pariskshitdutt on 27/10/15.
 */
var dragDrop = require('drag-drop')

var client = new WebTorrent()

// When user drops files on the browser, create a new torrent and start seeding it!
    client.seed(['file:///Users/pariskshitdutt/Downloads/GPIO_Pi2.png'], function onTorrent (torrent) {
        // Client is seeding the file!
        console.log('Torrent info hash:', torrent.infoHash)
    })