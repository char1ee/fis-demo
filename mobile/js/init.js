define(function (require) {
	var $ = require('$');
    var loading = require('./unit/loading'),
        viewport = require('./unit/viewport');

    viewport.show(localStorage.lastPanel || '#login');
    loading.hide();
});


