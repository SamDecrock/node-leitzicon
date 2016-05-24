#!/usr/bin/env node

var leitz = require('./lib/leitzicon');
var fs = require('fs');


leitz.printPNG(__dirname + '/test.png', 'http://192.168.1.1:631/ipp/print', {
	landscape: false,          // rotates image 90 degrees [default = false]
	blackwhiteThreshold: 110   // 0-256: the higher the value, the more pixels will be treated as black
}, function (err) {
	if(err) return console.log(err);
	console.log("print complete");
});

