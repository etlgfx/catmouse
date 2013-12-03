var STATE_MOVING = 1,
	STATE_WAITING = 2,
	STATE_DISPLAY = 3;

var cat = null,
	coords = [],
	lastCoords = [],
	state = STATE_MOVING,
	timeout = null,
	multiplier = 1,
	size = 1,
	correction = 50;

function move(e) {
	coords[0] = e.offsetX;
	coords[1] = e.offsetY;
	changeState(STATE_MOVING);

	clearTimeout(timeout);
	timeout = setTimeout(catchit, 1000);
}

function catchit() {
	/*-----------
	 *   100
	 *
	 *     ---------------
	 * 100 | 100
	 *     |
	 * |----
	 */
	if (coords.length == 2 && coords[0] && coords[1]) {
		changeState(STATE_WAITING);

		loadCat(coords, function (closest) {
			var catCoords = [size * closest.coords[0], size * closest.coords[1]];
			var imgCoords = [catCoords[0] - correction, catCoords[1] - correction];
			var offset = [(imgCoords[0] - catCoords[0]) + Math.max(-correction, Math.min(correction, coords[0] - imgCoords[0])), (imgCoords[1] - catCoords[1]) + Math.max(-correction, Math.min(correction, coords[1] - imgCoords[1]))];

			console.log(catCoords, imgCoords, offset);

			changeState(STATE_DISPLAY);
			cat.style.background = 'url(images/'+ closest.filename +')';
			cat.style.backgroundPosition = offset[0] +'px '+ offset[1] +'px';
		});
	}
}

function loadCat(coords, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/cats');
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.addEventListener('readystatechange', function () {
		if (this.readyState === 4 && this.status === 200) {
			try {
				var data = JSON.parse(this.responseText);
				callback(data);
			}
			catch (e) { }
		}
	}, true);

	xhr.send(JSON.stringify({'x': multiplier * coords[0] / size, 'y': multiplier * coords[1] / size}));
}

function changeState(state) {
	switch (state) {
		case STATE_MOVING:
			document.querySelector('#cat p.hint').style.display = 'none';
			cat.style.background = 'black';
			break;

		case STATE_WAITING:
			var wait = document.querySelector('#cat p.wait');
			wait.style.display = 'block';
			wait.style.left = coords[0];
			wait.style.top = coords[1];
			break;

		case STATE_DISPLAY:
			document.querySelector('#cat p.wait').style.display = 'none';
			break;
	}
}

function init() {
	cat = document.getElementById('cat');
	multiplier = Number(cat.getAttribute('data-size')) / cat.clientWidth;
	size = Number(cat.getAttribute('data-size'));

	cat.addEventListener('mousemove', move, true);
	catchit();
}

window.addEventListener('load', function () {
	init();
}, true);
