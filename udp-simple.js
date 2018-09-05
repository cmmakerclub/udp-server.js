var PORT = 3002;
var HOST = '0.0.0.0';

var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var server = dgram.createSocket('udp4');
var parsers = require('cmmc-parsers');
const axios = require('axios');
const mqtt = require('cmmc-mqtt').mqtt;

var cmmc = require('mqtt').connect('mqtt://cmmc.io');
cmmc.on('connect', function() { console.log('cmmc connected'); });
cmmc.on('packetsend', function(packet) { console.log(packet); });

var counter = 0;
let data_sent_counter = 0;

setInterval(function() {
  //console.log('counter = ', counter, ' m/s')
  counter = 0;
}, 1000);

server.on('listening', function() {
  var address = server.address();
  console.log(
      new Date() + ' - UDP Server listening on ' + address.address + ':' +
      address.port);
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

var sockets = {};
server.on('message', function(message, remote) {
  counter++;
  console.log('Received %d bytes from %s:%d\n', message.length, remote.address,
      remote.port);
  console.log('Data received from client : ' + message.toString());
  var inByte = Buffer.from(message);
  //console.log(remote);
  console.log(Buffer.from(message).toString('hex').toUpperCase());
  let len = message.length;
  let host = remote.address;
  let port = remote.port;
  let b = Buffer.from(`${++data_sent_counter * 1000}`);
  console.log(`sent `, b);
  sockets[`${host}-${port}`] = {host, port};
  //client.send(inByte, port, host, function(err, bytes) {
  //  console.log('sent1')
  //});
  console.log(typeof inByte);
  client.send(b, port, host, function(err, bytes) {
    if (err) {
      console.log(error);
    }
    else {
      console.log(b, bytes,
          ' (bytes) <-- UDP message sent to ' + host + ':' + port);
    }
  });
  //setInterval(() => {
  //  for (let value of Object.values(sockets)) {
  //   client.send(inByte, value.port, value.host, function(err, bytes) {
  //        if (err)  {
  //            console.log(error);
  //        }
  //        else {
  //          console.log(inByte.toString() + ' <-- UDP message sent to ' + value.host + ':'+ value.port);
  //        }
  //    });
  //  }
  //}, 5000);
});

server.bind(PORT, HOST); 
