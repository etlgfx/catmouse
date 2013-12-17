var STATE_MOVING = 1,
	STATE_WAITING = 2,
	STATE_DISPLAY = 3;

var cat = null,
	coords = [],
	state = STATE_MOVING,
	timeout = null,
	multiplier = 1,
	size = 1,
	correction = 50,
    waitTimeout = null,
	cats = 0;

function move(e) {
	if (Math.abs(e.layerX - coords[0]) < 5 && Math.abs(e.layerY - coords[1]) < 5) {
		return;
	}

	coords[0] = e.layerX;
	coords[1] = e.layerY;

    if (state != STATE_WAITING) {
        changeState(STATE_MOVING);
    }

	clearTimeout(timeout);
	clearTimeout(waitTimeout);

    waitTimeout = setTimeout(wait, 400);
	timeout = setTimeout(catchit, 1100);
}

function wait() {
    changeState(STATE_WAITING);
    setTimeout("document.querySelector('.progress .bar').style.width = '30%'", 1);
}

function catchit() {
	if (coords.length == 2 && coords[0] && coords[1]) {
		changeState(STATE_WAITING);

        document.querySelector('.progress .bar').style.width = '100%';

		loadCat(coords, function (closest) {
			var catCoords = [size * closest.coords[0], size * closest.coords[1]];
			var imgCoords = [catCoords[0] - correction, catCoords[1] - correction];
			var offset = [(imgCoords[0] - catCoords[0]) + Math.max(-correction, Math.min(correction, coords[0] - imgCoords[0])), (imgCoords[1] - catCoords[1]) + Math.max(-correction, Math.min(correction, coords[1] - imgCoords[1]))];

			console.log(catCoords, imgCoords, offset, closest.filename);

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
			cats++;

			if (cats > 2) {
				document.getElementById('social').style.visibility = 'visible';
			}

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
			document.querySelector('#cat .hint').style.display = 'block';
			document.querySelector('#cat .wait').style.display = 'none';
            document.querySelector('.progress .bar').style.width = '0px';
			cat.style.background = 'black';
			break;

		case STATE_WAITING:
			document.querySelector('#cat .hint').style.display = 'none';
			document.querySelector('#cat .wait').style.display = 'block';
			break;

		case STATE_DISPLAY:
			document.querySelector('#cat .wait').style.display = 'none';
			break;
	}
}

var cloudClasses = ['cloud1', 'cloud2', 'cloud3', 'cloud4', 'cloud1cat', 'cloud2cat'];

function clouds() {
    var clds = document.querySelectorAll('.cloud');

    for (var i = 0; i < clds.length; i++) {
        if (clds[i].offsetLeft > window.innerWidth + clds[i].clientWidth) {
            document.body.removeChild(clds[i]);
            continue;
        }

        clds[i].style.left = (parseFloat(clds[i].style.left) + 2 - parseFloat(clds[i].style.top) / window.innerHeight) + "px";
    }

    if (clds.length < 12) {
        var cld = document.body.appendChild(document.createElement('div'));
        cld.classList.add('cloud');
        cld.classList.add(cloudClasses[Math.floor(Math.random() * cloudClasses.length)]);

        var y = (Math.random() * window.innerHeight);
        var s = (Math.random() * 0.5 + 1.5 - y / window.innerHeight) * 0.6667;
        cld.style.top = y + "px";
        cld.style.left = -(Math.random() * window.innerWidth + 300) + "px";
        cld.style.webkitTransform = "scale("+ s +")";
        cld.style.mozTransform = "scale("+ s +")";
    }

    window.requestAnimationFrame(clouds);
}

function init() {
	cat = document.getElementById('cat');
	multiplier = Number(cat.getAttribute('data-size')) / cat.clientWidth;
	size = Number(cat.getAttribute('data-size'));

    window.requestAnimationFrame(clouds);
	cat.addEventListener('mousemove', move, true);
	catchit();
}

window.addEventListener('load', function () {
	init();
}, true);
