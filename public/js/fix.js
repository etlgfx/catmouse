function init() {
    var elms = document.querySelectorAll('img');

    for (var i = 0; i < elms.length; i++) {
        elms[i].addEventListener('click', function (evt) {
            var matches = evt.target.src.match(/\/(\w+_\d+.jpg)/)

            if (matches && matches[1]) {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/fix');
                xhr.setRequestHeader('Content-type', 'application/json');
                xhr.send(JSON.stringify({filename: matches[1], x: evt.layerX / 1046, y: evt.layerY / 1046}));
            }
        }, true);
    }
}


window.addEventListener('load', function () {
	init();
}, true);
