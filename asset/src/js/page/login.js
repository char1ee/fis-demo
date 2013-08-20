var cfg = require('../config');
var dom = require('../unit/dom');
var ajax = require('../unit/ajax');
var tips = require('../unit/tips');
var store = require('../unit/store');

function init() {
    var oLoginForm = dom.find('#login form')[0];
    oLoginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        function serialize() {
            var key, value;
            var ret = {};
            var inputs = dom.find('input[type="text"], input[type="password"]');
            for (var i = 0, l = inputs.length; i < l; ++i) {
                key  = inputs[i].getAttribute('name') || '';
                value = inputs[i].value || '';
                ret[key] = value;
            }
            return ret;
        }
        ajax({
            url : cfg.MARKING_LOGIN,
            type: 'post',
            data: {
                pdata : serialize()
            },
            success : function (data) {
                data = data || {};
                if (data.status === '0') {
                    store('teacherId', data.teacherId);
                    window.Router('examList');

                } else {
                    tips.show({
                        msg : '登录失败'
                    });
                }
                store('exames', data);
            }
        });
    }, false);
}

module.exports = init;