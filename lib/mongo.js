var MongoClient = require('mongodb').MongoClient;

exports.findCats = function (x, y, callback) {
	MongoClient.connect('mongodb://127.0.0.1:27017/catmouse', function(err, db) {
		if (err) {
			throw err;
		}

		var collection = db.collection('cats');

        //console.log({coords: {$near: [x, y]}});
		// Locate all the entries using find
		collection.find({coords: {$near: [x, y]}}).limit(1).toArray(function(err, results) {
			callback(results);
			db.close();
		});
	});
};

exports.findAll = function (callback) {
    MongoClient.connect('mongodb://127.0.0.1:27017/catmouse', function (err, db) {
        if (err) {
            throw err;
        }

        var collection = db.collection('cats');

        collection.find().toArray(function (err, results) {
            callback(results);
            db.close();
        });
    });
};

exports.updateCat = function (data) {
    MongoClient.connect('mongodb://127.0.0.1:27017/catmouse', function (err, db) {
        if (err) {
            throw err;
        }

        var collection = db.collection('cats');

        collection.update({filename: data.filename}, {$set: {coords: [data.x, data.y]}}, {w: 0, upsert: true});
    });
};
