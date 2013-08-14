define (function (require) {
    var cfg = require('../config'),
        dom = require('../unit/dom'),
        ajax = require('../unit/ajax'),
        viewport = require('../unit/viewport'),
        store = require('../unit/store');

    var oLoginForm = dom.find('#login form')[0];
    oLoginForm.addEventListener('submit', function (e){
        e.preventDefault();
        function serialize () {
            var key, value;
            var ret = {};
            var inputs = dom.find('input[type="text"], input[type="password"]');
            for (var i = 0,l = inputs.length; i < l; ++i) {
                key  = inputs[i].getAttribute('name') || '';
                value = inputs[i].value || '';
                ret[key] = value;
            };
            return ret;
        }
        ajax({
            url : cfg.LOGIN_URI,
            type: 'post',
            data: {
                pdata : serialize()
            },
            success : function (data) {
                store('exames', data);
                viewport.show('#examList');
            }
        });
    }, false);
});