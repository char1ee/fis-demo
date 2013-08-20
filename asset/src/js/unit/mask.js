var dom = require('./dom');

var mask = (function () {
    var _mask = dom.find('.plg-mask')[0] ||
                document.createElement('div');

    _mask.setAttribute('class', 'plg-mask');
    document.body.appendChild(_mask);
    return mask ? mask : _mask;
})();

module.exports = {
    show : function () {
        mask.style.display = 'block';
    },

    hide : function () {
        mask.style.display = 'none';
    }
};