let host = '103.20.205.85';
let port = 5683;
let _token = 'b395cc80-b0dd-11e8-8e2c-19a3b7904cb9';

var dgram = require('dgram');
var client = dgram.createSocket('udp4');

let ct = 1;

let msgId = Buffer.alloc(2);
let byte1 = Buffer.alloc(1);
let byte2 = Buffer.alloc(1);

const confirmable = 0b00;
const non_confirmable = 0b01;
const acknowledgement = 0b10;
const reset = 0b11;

const version = 0b01 << 6;
const type = confirmable << 4;

byte1.writeUInt8(version | type);
byte2.writeUInt8(0b00000000 | 2);
msgId.writeUInt16LE(ct);

const b = Buffer.concat([
  Buffer.from(byte1), // 40
  Buffer.from(byte2), // 02
  Buffer.from(msgId), // .....
  Buffer.from('b5', 'hex'),
  Buffer.from('4e42496f54', 'hex'), // NBIoT
  Buffer.from('0d', 'hex'),
  Buffer.from('17', 'hex'),
  Buffer.from(_token),
  Buffer.from('ff', 'hex'),
  Buffer.from(JSON.stringify({
    a: new Date().getTime(),
    ct: ct,
  })),
]);

client.send(b, port, host, function(err, bytes) {
  if (err) {
    console.log(error);
  }
  else {
    console.log(b);
    console.log(`(${bytes}) <- UDP message sent to ` + host + ':' + port);
  }
});