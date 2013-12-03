var MongoClient = require('mongodb').MongoClient;

exports.findCats = function (x, y, callback) {
	MongoClient.connect('mongodb://127.0.0.1:27017/catmouse', function(err, db) {
		if (err) {
			throw err;
		}

		var collection = db.collection('cats');

		// Locate all the entries using find
		collection.find({coords: {$near: [x, y]}}).limit(1).toArray(function(err, results) {
			callback(results);
			db.close();
		});
	});
};

