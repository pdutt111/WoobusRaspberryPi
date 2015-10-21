var levelup  = require('levelup');
var SubLevel = require('level-sublevel');
var net      = require('net');
var Master   = require('level-master');


var db = SubLevel(levelup(process.cwd()+"/db_files2"));
var slave = Master.Slave(db, 'buslocation');

var stream = net.connect(9999)

stream.pipe(slave.createStream()).pipe(stream);

db.post(console.log)