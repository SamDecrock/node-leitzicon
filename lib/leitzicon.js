#!/usr/bin/env node

var ipp = require('ipp');
var fs = require('fs');
var async = require('async');
var png2lwxl = require('png2lwxl');

function printPNG (pngFilepath, printerEndpoint, png2lwxlOptions, callback) {
	var printer = ipp.Printer(printerEndpoint);
	var printdata;

	async.waterfall([

		function ($) {
			png2lwxl.convert(pngFilepath, png2lwxlOptions, $);
		},

		function (_printdata, $) {
			printdata = _printdata;
			cancelUncompletedJob(printer, $);
		},

		function (success, cancelledJobid, $) {
			createJob(printer, $);
		},

		function (jobid, $) {
			sendDocument(printer, jobid, printdata, "application/octet-stream", $);
		}

	], callback);
}

function cancelUncompletedJob(printer, callback) {
	var msg = {
		"operation-attributes-tag": {
			"which-jobs": "not-completed"
		}
	}
	printer.execute("Get-Jobs", msg, function (err, res){
		if(err) return callback(err);

		var jobAttributes = res['job-attributes-tag'];

		if(res['job-attributes-tag'] && res['job-attributes-tag']['job-id']) {
			var jobid = res['job-attributes-tag']['job-id'];

			// cancel this job:
			var msg = {
				"operation-attributes-tag": {
					"job-id": jobid
				}
			}
			printer.execute("Cancel-Job", msg, function (err, res){
				if(err) return callback(err);

				if(res['statusCode'] == 'successful-ok') {
					return callback(null, true, jobid);
				}else{
					return callback(null, false, null);
				}
			});

		}else{
			return callback(null, false, null);
		}
	});

}

function createJob(printer, callback) {
	var msg = {
		"operation-attributes-tag": {
			"attributes-charset": "utf-8",
			"attributes-natural-language": "nl",
			"requesting-user-name": "mobile"
		},
		"job-attributes-tag": {
			"media-col": {},
			"orientation-requested": "3",
			"print-color-mode": "monochrome",
			"print-quality": "4"
		}
	};

	console.log('> Creating printing job');

	printer.execute("Create-Job", msg, function (err, res){
		if(err) return callback(err);

		if(res['job-attributes-tag'] && res['job-attributes-tag']['job-id']) {
			jobid = res['job-attributes-tag']['job-id'];
			callback(null, jobid);
		}else{
			callback(new Error("Got no job-id when creating job"));
		}
	});
}

function sendDocument(printer, jobid, buffer, mimetype, callback) {
	if(jobid === null) return callback("got no job-id to work with");

	var msg = {
		"operation-attributes-tag": {
			"attributes-charset": "utf-8",
			"attributes-natural-language": "nl",
			"job-id": jobid,
			"requesting-user-name": "mobile",
			"last-document": "true",
			"document-format": mimetype
		},
		data: buffer
	};

	console.log('> Sending Document to printer');

	printer.execute("Send-Document", msg, function (err, res){
		if(err) return callback(err);
		callback()
	});
}



exports.printPNG = printPNG;