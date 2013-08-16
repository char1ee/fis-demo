define(function (require, exports, module) {
    var dom = require('./dom');
    var viewports = dom.find('.-viewport');

    var viewport = {
        show : function (selector, callback) {
            var curViewport = dom.find(selector)[0];
            if (curViewport.style.visibility === 'visible') {
                return;
            }

            for (var i = 0, l = viewports.length; i < l; ++i) {
                viewports[i].style.visibility = 'hidden';
            }
            curViewport.style.visibility = 'visible';
            seajs.use('page/' + selector.slice(1));
            if (localStorage.lastPanel !== selector) {
                localStorage.lastPanel = selector;
            }

            callback && callback();
        }
    };

    module.exports = viewport;
});