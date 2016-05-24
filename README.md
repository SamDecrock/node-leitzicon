# Leitz Icon label printer
A node.js module to print labels using the [Leitz Icon printer](http://www.leitz.com/en-GB/Design--Concepts/Icon-Label-Printer/).

It uses the Internet Printing Protocol (IPP), which is the prefered option when printing over wifi.

It also uses the [png2lwxl node.js module](https://github.com/SamDecrock/node-png2lwxl), written by me, to convert PNG files to the appropriate printer format.

## Install

You can install __leitzicon__ using the Node Package Manager (npm):

    npm install leitzicon

## Simple example
```js
var leitz = require('leitzicon');
var fs = require('fs');

leitz.printPNG(__dirname + '/test.png', 'http://192.168.1.1:631/ipp/print', {}, function (err) {
    if(err) return console.log(err);
    console.log("print complete");
});
```

__png2lwxl options__
 - landscape: rotates image 90 degrees [default = false].
 - blackwhiteThreshold: enter a value between 0 and 255. The higher the value, the more pixels will be treated as black [default = 128].

__example with options__

```js
var leitz = require('leitzicon');
var fs = require('fs');

leitz.printPNG(__dirname + '/test.png', 'http://192.168.1.1:631/ipp/print', {
    landscape: true,
    blackwhiteThreshold: 110
}, function (err) {
    if(err) return console.log(err);
    console.log("print complete");
});
```
