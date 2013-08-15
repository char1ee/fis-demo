define(function (require) {
    var dom = require('./dom');
    // var mask = require('./mask');

    var tips = (function () {
        var _tips =  dom.find('.plg-tips')[0] ||
                        document.createElement('div');

        _tips.setAttribute('class', 'plg-tips');
        document.body.appendChild(_tips);
        return tips ? tips : _tips;
    })();

    return {
        show : function (param) {
            param = param || {};
            var me = this;
            tips.style.display = 'block';
            tips.innerHTML = param.msg;
            setTimeout(function () {
                me.hide();
                param.callback && param.callback();
            }, 1000);
            return me;
        },

        hide : function () {
            tips.style.display = 'none';
            return this;
        }
    };
});