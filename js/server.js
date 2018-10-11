var http = require('http');
var connect = require('connect');
var express = require('express');
var bluetooth = require('node-bluetooth');
var serial = require('serialport');
    bt = new serial('COM6');
var BTSP = require('bluetooth-serial-port');
var serial = new BTSP.BluetoothSerialPort();

var fs = require('fs');
const port = 8080;
const goodStatus = 200;

var app = express();
console.log("Server is now online.\n");

bt.on('data', function(data) {
    var incomming = data.toString();
    console.log(incomming);
});

process.stdin.on('data', function (data) {
    bt.write(Buffer.alloc(data.length,data));
});

app.use(express.static('C:\\Users\\mmuno\\PWA_LED_Controller'));

// Route for everything else.
app.get('*', function(request, response){
    response.send('Error 404: Not found');
});

app.get("/home", function (request, response) {
    response.writeHead(goodStatus);
});

app.listen(port);