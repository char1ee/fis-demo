var dom = require('./dom');
var mask = require('./mask');
var loading = (function () {
    var _loading =  dom.find('.plg-loading')[0] ||
                    document.createElement('div');

    _loading.setAttribute('class', 'plg-loading');
    _loading.innerHTML = '加载。。。';
    document.body.appendChild(_loading);
    return loading ? loading : _loading;
})();

module.exports =  {
    show : function () {
        mask.show();
        loading.style.display = 'block';
    },

    hide : function () {
        mask.hide();
        loading.style.display = 'none';
    }
};