//master.js
var levelup  = require('levelup')
var SubLevel = require('level-sublevel')
var net      = require('net')
var Master   = require('level-master')

//setup the database.
var db = SubLevel(levelup(process.cwd()+"/dbfiles/buslocation.db"))

//install Master plugin!
var master = Master(db, 'buslocation.db')

//create a server, and stream data to who ever connects.
net.createServer(function (stream) {
    stream.pipe(master.createStream({tail: true})).pipe(stream);
}).listen(9999, function () {
    console.log('master db listening on 9999')
})
var i = 0
var ts = 0
var int = setInterval(function () {
    ts = ts || Date.now()
    var key = "2"
    var val = new Date().toString()
    db.put(key, val, function (err) {
        if(err) throw err
    })

    if(i++ > 3) {
//    clearInterval(int)
        return
        master.createPullStream({tail: true, since: ts})
//    pl.read(db, {tail: true})
            .pipe(pull.log())
    }
}, 1000)