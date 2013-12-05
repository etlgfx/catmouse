var MongoClient = require('mongodb').MongoClient,
	fs = require('fs');

MongoClient.connect('mongodb://127.0.0.1:27017/catmouse', function(err, db) {
	if (err) {
		throw err;
	}

	var collection = db.collection('cats');

	var file = fs.readFileSync('./data.csv', {encoding: 'utf8'});

	file.split('\n').forEach(function (line) {
		if (!line) {
			return;
		}

		console.log(line);

		var line = line.split(',');

		// Locate all the entries using find
		collection.insert({
			filename: line[0],
			coords: [line[1] * 72 / 1046, line[2] * 72 / 1046]
			/*
			coords: line[1].split('x').map(function (v) {
				return parseInt(v) / 1046;
			})
			*/
		}, function (err, docs) {
			if (err) {
				throw err;
			}

			console.log(docs);
		});
	});
});
