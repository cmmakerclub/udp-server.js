var PORT = 55566;
var HOST = '0.0.0.0';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var parsers = require("cmmc-parsers")
const axios = require('axios'); 
const mqtt = require('cmmc-mqtt').mqtt
var cmmc = require('mqtt').connect('mqtt://mqtt.cmmc.io')
cmmc.on('connect', function () {
  console.log('cmmc connected')
})
cmmc.on('packetsend', function(packet) {
  console.log(packet);
});

var counter = 0;

setInterval(function() {
  //console.log('counter = ', counter, ' m/s')
  counter = 0; 
}, 1000);

server.on('listening', function () {
    var address = server.address();
    console.log(new Date() + ' - UDP Server listening on ' + address.address + ":" + address.port);
  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Server is listening at port' + port);
  console.log('Server ip :' + ipaddr);
  console.log('Server is IP4/IP6 : ' + family);
});


server.on('close', function() {
  console.log('udp socket closed..'); 
});

server.on('message', function (message, remote) {
    counter++;
    console.log('Data received from client : ' + message.toString());
    console.log('data comming...');
    console.log('Received %d bytes from %s:%d\n', message.length, remote.address, remote.port); 
    var inByte = Buffer.from(message); 
    console.log(Buffer.from(message).toString('hex'));
});

server.bind(PORT, HOST); 
