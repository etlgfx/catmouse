var STATE_MOVING = 1,
	STATE_WAITING = 2,
	STATE_DISPLAY = 3;

var cat = null,
	coords = [],
	lastCoords = [],
	state = STATE_MOVING,
	timeout = null;

function move(e) {
	coords[0] = e.offsetX;
	coords[1] = e.offsetY;
	changeState(STATE_MOVING);

	clearTimeout(timeout);
	timeout = setTimeout(catchit, 1000);
}

function catchit() {
	if (coords.length == 2 && coords[0] && coords[1]) {
		changeState(STATE_WAITING);

		loadCat(coords, function (closest) {
			changeState(STATE_DISPLAY);
			cat.style.background = 'url(images/'+ closest.filename +')';
		});
	}
}

function loadCat(coords, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/cats');
	xhr.addEventListener('readystatechange', function () {
		if (this.readyState === 4 && this.status === 200) {
			try {
				var data = JSON.parse(this.responseText);
				callback(data);
			}
			catch (e) { }
		}
	}, true);

	var args = new FormData();
	args.append('x', coords[0]);
	args.append('y', coords[1]);
	xhr.send(args);
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
	cat.addEventListener('mousemove', move, true);
	catchit();
}

window.addEventListener('load', function () {
	init();
}, true);
