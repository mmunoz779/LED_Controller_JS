var express = require('express');
const http = require('http');
const url = require('url');
var router = express.Router();
var serial = undefined;
var io = undefined;
var clientSocket = undefined;

const ledAddress = '00:14:03:06:0E:59';
const ledChannel = 1;

let ledState = "0";

const possibleStates = ['0', '1'];

/* GET home page. */
router.get('/console', function (req, res, next) {
    const queryObject = url.parse(req.url, true).query.command;

    if (possibleStates.includes(queryObject)) {
        serial.write(Buffer.from(queryObject, 'utf-8'),
            function (err, bytesWritten) {
                if (err) {
                    console.log(err);
                    res.json({'Success': false});
                } else {
                    res.json({'Success': true});
                }
            });
    } else {
        res.json({'Success': false, 'error': 'Invalid command'});
    }
});

router.get('/state', function (req, res, next) {
    res.json({'Success': true, 'State': ledState});
});

module.exports = function(socketIO, ledSerial) {
    serial = ledSerial;
    io = socketIO;

    io.on('connection', function (socket) {
        socket.emit('event', {data: 'Server connected successfully'});
        socket.emit('event', {
            "data": "ledState",
            "ledState": ledState
        });
        clientSocket = socket;
    });

    serial.connect(ledAddress, ledChannel, function () {
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        // Allow for command line access from server directly
        console.log('Press "1" or "0" and "ENTER" to turn on or off the Arduino');
        process.stdin.on('data', function (data) {
            serial.write(Buffer.from(data, 'utf-8'), function (err, bytesWritten) {
                if (err) console.log(err);
            });
        });

        // Read data from Arduino to check for current LED state
        serial.on('data', function (data) {
            let newState = data.toString()[0];
            if (possibleStates.includes(newState) && newState !== ledState) {
                ledState = newState;

                // Broadcast current state to all clients
                io.emit('event', {
                    "data": "ledState",
                    "ledState": ledState
                });
            }
        });
    }, function () {
        console.log('cannot connect');
    });
    return router;
};