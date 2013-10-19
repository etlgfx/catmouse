var cat = null,
	data = [],
	coords = [],
	lastCoords = [],
	still = 0;

function move(e) {
	if (coords) {
		lastCoords = [coords[0], coords[1]];
	}
	coords = [e.clientX, e.clientY];
}

function catchit() {
	if (coords[0] == lastCoords[0] && coords[1] == lastCoords[1]) {
		still++;
	}
	else {
		still = 0;
	}

	if (still === 3) {
		var closest = null;
		data.forEach(function (cat) {
			var dx = coords[0] - cat.coords[0];
			var dy = coords[1] - cat.coords[1];
			cat.d = dx * dx + dy * dy;

			if (!closest) {
				closest = cat;
			}
			else {
				if (cat.d < closest.d) {
					closest = cat;
				}
			}
		});

		cat.style.background = 'url(images/'+ closest.filename +')';
	}
}

function loadData() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', './data.csv');
	xhr.addEventListener('readystatechange', function () {
		if (this.readyState === 4 && this.status === 200) {
			this.responseText.split('\n').forEach(function (line) {
				if (!line) {
					return;
				}

				var line = line.split('	');

				data.push({
					filename: line[0],
					coords: line[1].split('x').map(function (v) {
						return parseInt(v)
					})
				});
			});
		}
	}, true);
	xhr.send(null);
}

function init() {
	cat = document.getElementById('cat');
	cat.addEventListener('mousemove', move, true);
	loadData();
	setInterval(catchit, 100);
}

window.addEventListener('load', function () {
	init();
}, true);
