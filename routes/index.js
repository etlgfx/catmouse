var express = require('express'),
	mongo = require('../lib/mongo');

exports.index = function(req, res) {
  res.render('index', { title: 'Cat & Mouse' });
};

exports.cats = function(req, res) {
	if (req.body && req.body.x !== undefined && req.body.y !== undefined) {
		mongo.findCats(req.body.x, req.body.y, function (results) {
			res.send(JSON.stringify(results[0]));
		});
	}
};
