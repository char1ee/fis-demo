define (function (require) {
    var dom = require('unit/dom'),
        loading = require('unit/loading'),
        viewport = require('unit/viewport');

    viewport.show(localStorage.lastPanel || '#login');
    loading.hide();
});