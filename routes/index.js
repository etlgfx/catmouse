var express = require('express'),
	mongo = require('../lib/mongo');

exports.index = function(req, res) {
  res.render('index', { title: 'Mouse Grab' });
};

exports.debug = function(req, res) {
    mongo.findAll(function (results) {
        res.render('debug', {cats: results});
    });
};

exports.cats = function(req, res) {
	if (req.body && req.body.x !== undefined && req.body.y !== undefined) {
		mongo.findCats(req.body.x, req.body.y, function (results) {
			res.send(JSON.stringify(results[0]));
		});
	}
};

exports.fix = function(req, res) {
	console.log(req.body);
    mongo.updateCat(req.body);
}
