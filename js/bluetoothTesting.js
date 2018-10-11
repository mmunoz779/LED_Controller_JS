var serialport = require("serialport");
var $ = require("jquery");
var portList;
var portName;
let parser;
let myport;

$(document).ready(function () {
    portList = document.getElementById('portList');
    var index = 0;
    serialport.list(function (err, ports) {
        ports.forEach(function(port) {
            var optn = document.createElement("option");
            optn.value = index;
            optn.innerHTML = port.comName;
            console.log(port.comName);
            portList.appendChild(optn);
            index++;
        });
    });
});

portList.onchange(selection, function() {
    portName = selection.value();

    myport = new serialport(portName, {
        baudRate: 9600
    });

    parser = myport.pipe(new serialport.parsers.Readline({delimiter: '\r\n'}));
});

myport.on('open', function () {
        console.log("Open connection");
    }
);

parser.on('data', console.log);