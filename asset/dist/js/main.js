;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var config = {
    MARKING_LOGIN : 'http://192.168.1.52:8080/ctb-portlet/restful/markingLogin/',
    MARKING_NAME : 'http://192.168.1.52:8080/ctb-portlet/restful/markingName/',
    MARKING_ORDER_NO : 'http://192.168.1.52:8080/ctb-portlet/restful/markingOrderNo/',
    MARKING_IMG : 'http://192.168.1.52:8080/ctb-portlet/restful/markingImg/',
    MARKING_SAVE : 'http://192.168.1.52:8080/ctb-portlet/restful/markingSave/',

    IMG_PREFIX : 'http://192.168.1.52:8080/ctb-portlet/files/examination/'
};
module.exports = config;
},{}],2:[function(require,module,exports){
var loading = require('./unit/loading');
var router = require('./router');
router();
loading.hide();
},{"./router":7,"./unit/loading":10}],3:[function(require,module,exports){
var config   = require('../config'),
    dom   = require('../unit/dom'),
    ajax  = require('../unit/ajax'),
    store = require('../unit/store'),
    viewport = require('../unit/viewport');

module.exports = function () {
    ajax({
        url: config.MARKING_NAME,
        type: 'post',
        data: {
            pdata : {
                teacherId: store('teacherId')
            }
        },
        success: function (data) {
            data = data || {};
            // data = {data:data}
            var tpl      = dom.find('#examListTpl')[0].innerHTML,
                template = Handlebars.compile(tpl),
                html     = template(data);
            dom.find('#examList')[0].innerHTML = html;
            function eventBind(e) {
                var target = e.target;
                if (target.nodeName === 'BUTTON') {
                    store('markingType', target.getAttribute('data-markingType'));
                    store('examId', target.getAttribute('data-examId'));
                    ajax({
                        url : config.MARKING_ORDER_NO,
                        type : 'post',
                        data : {
                            pdata : {
                                markingType: store('markingType'),
                                examId: store('examId'),
                                teacherId: store('teacherId')
                            }
                        },
                        success : function (data) {
                            store('allOrderNos', data);
                            viewport.show('#orderList');
                        }
                    });
                }
            }

            dom.find('#examList')[0].addEventListener('touchstart', eventBind, false);
        }
    });
};
},{"../config":1,"../unit/ajax":8,"../unit/dom":9,"../unit/store":12,"../unit/viewport":15}],4:[function(require,module,exports){
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
},{"../config":1,"../unit/ajax":8,"../unit/dom":9,"../unit/store":12,"../unit/tips":13}],5:[function(require,module,exports){
var cfg      = require('../config'),
    dom      = require('../unit/dom'),
    ajax     = require('../unit/ajax'),
    store    = require('../unit/store');

module.exports = function () {
    var data = store('allOrderNos') || {};
    var tpl  = dom.find('#orderListTpl')[0].innerHTML,
        template = Handlebars.compile(tpl),
        html     = template(data);
    dom.find('#orderList')[0].innerHTML = html;
    function eventBind(e) {
        var target = e.target || {};
        console.log(e);
        if (target.nodeName === 'LI') {
            ajax({
                url : cfg.MARKING_IMG,
                type : 'post',
                data : {
                    pdata : {
                        markingType: store('markingType'),
                        examId : store('examId'),
                        teacherId: store('teacherId'),
                        orderNo: target.getAttribute('data-orderNo')
                    }
                },

                success : function (data) {
                    store('viewExam', data);
                    window.Router('viewExam');
                }
            });
        }
    }
    dom.find('#orderList')[0].addEventListener('touchstart', eventBind, false);
};
},{"../config":1,"../unit/ajax":8,"../unit/dom":9,"../unit/store":12}],6:[function(require,module,exports){
var cfg      = require('../config'),
    dom      = require('../unit/dom'),
    ajax     = require('../unit/ajax'),
    store    = require('../unit/store');

module.exports = function () {
    var starTime;
    function render(data) {
        if (data.finishType !== false) {
            alert('题目已判完！');
            return;
        }
        starTime = + new Date();

        data.imgPrefix = cfg.IMG_PREFIX;
        data.marking.imgSrc = data.marking.imgSrc + '?t=' + (+new Date());
        data = {viewExam: data};
        var tpl  = dom.find('#viewExamTpl')[0].innerHTML,
        template = Handlebars.compile(tpl),
        html     = template(data);
        dom.find('#viewExam')[0].innerHTML = html;
    }
    render(store('viewExam') || {});
    function eventBind(e) {
        var target = e.target || {};
        console.log(e);
        if (target.id === 'save') {
            ajax({
                url : cfg.MARKING_SAVE,
                type : 'post',
                data : {
                    pdata: {
                        studentDetailId: store('viewExam').marking.studentDetailId,
                        teacherId: store('exames').teacherId,
                        score: 1,
                        evaluation: encodeURIComponent('中国漂亮妹纸'),
                        markingType: store('markingType'),
                        hour: ((+ new Date() - starTime) / 1000) | 0
                    }
                },

                success : function (data) {
                    store('viewExam', data);
                    render(data);
                }
            });
        }
    }
    dom.find('#viewExam')[0].addEventListener('touchstart', eventBind, false);
};
},{"../config":1,"../unit/ajax":8,"../unit/dom":9,"../unit/store":12}],7:[function(require,module,exports){
var lists = {
    login : require('./page/login'),
    examList : require('./page/examList'),
    orderList : require('./page/orderList'),
    viewExam : require('./page/viewExam')
};

var viewport = require('./unit/viewport');
function router(viewName) {
	viewName = viewName || 'login';
	viewport.show('#' + viewName);
	lists[viewName]();
}

module.exports = window.Router = router;
},{"./page/examList":3,"./page/login":4,"./page/orderList":5,"./page/viewExam":6,"./unit/viewport":15}],8:[function(require,module,exports){
var unit = require('./unit');
var store = require('./store');
var loading = require('./loading');
var tips = require('./tips');
var viewport = require('./viewport');

var xhr = new XMLHttpRequest();
function ajax(param) {
    loading.show();
    var ticketId = store('ticketId') || '';
    var type, data;
    var cfg = {
        url: '',
        type: '',
        success : function () {},
        failure: function () {
            var viewport = require('./viewport');
            tips.show({
                msg : '您没有权限',
                callback : function () {
                    // TODO 这里为什么会被调用两次
                    // alert(999)
                    viewport.show('#login');
                }
            });
        }
    };
    unit.extend(cfg, param);

    type = cfg.type.toUpperCase();

    if (/GET|DELETE/.test(type)) {
        data = JSON.stringify(cfg.data)
              .replace(/^\{|\}$/g, '')
              .replace(/"/g, '')
              .replace(/:/g, '=')
              .replace(/,/g, '&');

        xhr.open(type,
            cfg.url  +
            (cfg.url.indexOf('?') > -1 ? '&':'?') +
            data +
            '&__t=' + (+new Date()),
        true);
        xhr.setRequestHeader('ticketId', store('ticketId') || '');
        xhr.send(null);
    }

    if (/POST|PUT/.test(type)) {
        xhr.open(type, cfg.url, true);
        xhr.setRequestHeader('ticketId', store('ticketId') || '');
        xhr.send(JSON.stringify(cfg.data));
    }
    xhr.onreadystatechange = function () {
        var data;
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                ticketId = xhr.getResponseHeader('ticketId');
                ticketId && store('ticketId', ticketId);
                data = JSON.parse(xhr.responseText || '{}');
                cfg.success(data);
            } else if (xhr.status === 401) {

                tips.show({
                    msg : '用户未登录',
                    callback: function () {
                        viewport.show('#login');
                    }
                });
            } else if (xhr.status === 400) {
                cfg.failure(data);
            }
            loading.hide();
        }
    };
}
module.exports = ajax;
},{"./loading":10,"./store":12,"./tips":13,"./unit":14,"./viewport":15}],9:[function(require,module,exports){
module.exports = {
    find : function (el) {
        return document.querySelectorAll(el);
    }
};
},{}],10:[function(require,module,exports){
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
},{"./dom":9,"./mask":11}],11:[function(require,module,exports){
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
},{"./dom":9}],12:[function(require,module,exports){
var uid = 'markingData';
localStorage[uid] = localStorage[uid] || '{}';
function store(key, value) {
    if (arguments.length === 1) {
        return JSON.parse(localStorage[uid])[key];
    }

    var _tmp = JSON.parse(
        localStorage[uid]
    );
    _tmp[key] = value;

    localStorage[uid] = JSON.stringify(_tmp);
}
module.exports = store;
},{}],13:[function(require,module,exports){
var dom = require('./dom');
// var mask = require('./mask');

var tips = (function () {
    var _tips =  dom.find('.plg-tips')[0] ||
                    document.createElement('div');

    _tips.setAttribute('class', 'plg-tips');
    document.body.appendChild(_tips);
    return tips ? tips : _tips;
})();

module.exports = {
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
},{"./dom":9}],14:[function(require,module,exports){
// unit

module.exports = {
    extend : function (flag, to, from) {
        function _extend(flag, a, b) {
            for (var i in b) {
                a[i] = b[i];
            }
            flag && b[i] && _extend(flag, a[i], b[i]);
        }
        if (typeof flag !== 'boolean') {
            from = to;
            to = flag;
            flag = null;
        }
        _extend(flag, to, from);
    }
};
},{}],15:[function(require,module,exports){
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
        if (localStorage.lastPanel !== selector) {
            localStorage.lastPanel = selector;
        }

        callback && callback();
    }
};
module.exports = viewport;

},{"./dom":9}]},{},[2])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJFOlxcbWFya2luZ1xcYXNzZXRcXHNyY1xcanNcXGNvbmZpZy5qcyIsIkU6XFxtYXJraW5nXFxhc3NldFxcc3JjXFxqc1xcbWFpbi5qcyIsIkU6XFxtYXJraW5nXFxhc3NldFxcc3JjXFxqc1xccGFnZVxcZXhhbUxpc3QuanMiLCJFOlxcbWFya2luZ1xcYXNzZXRcXHNyY1xcanNcXHBhZ2VcXGxvZ2luLmpzIiwiRTpcXG1hcmtpbmdcXGFzc2V0XFxzcmNcXGpzXFxwYWdlXFxvcmRlckxpc3QuanMiLCJFOlxcbWFya2luZ1xcYXNzZXRcXHNyY1xcanNcXHBhZ2VcXHZpZXdFeGFtLmpzIiwiRTpcXG1hcmtpbmdcXGFzc2V0XFxzcmNcXGpzXFxyb3V0ZXIuanMiLCJFOlxcbWFya2luZ1xcYXNzZXRcXHNyY1xcanNcXHVuaXRcXGFqYXguanMiLCJFOlxcbWFya2luZ1xcYXNzZXRcXHNyY1xcanNcXHVuaXRcXGRvbS5qcyIsIkU6XFxtYXJraW5nXFxhc3NldFxcc3JjXFxqc1xcdW5pdFxcbG9hZGluZy5qcyIsIkU6XFxtYXJraW5nXFxhc3NldFxcc3JjXFxqc1xcdW5pdFxcbWFzay5qcyIsIkU6XFxtYXJraW5nXFxhc3NldFxcc3JjXFxqc1xcdW5pdFxcc3RvcmUuanMiLCJFOlxcbWFya2luZ1xcYXNzZXRcXHNyY1xcanNcXHVuaXRcXHRpcHMuanMiLCJFOlxcbWFya2luZ1xcYXNzZXRcXHNyY1xcanNcXHVuaXRcXHVuaXQuanMiLCJFOlxcbWFya2luZ1xcYXNzZXRcXHNyY1xcanNcXHVuaXRcXHZpZXdwb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY29uZmlnID0ge1xuICAgIE1BUktJTkdfTE9HSU4gOiAnaHR0cDovLzE5Mi4xNjguMS41Mjo4MDgwL2N0Yi1wb3J0bGV0L3Jlc3RmdWwvbWFya2luZ0xvZ2luLycsXG4gICAgTUFSS0lOR19OQU1FIDogJ2h0dHA6Ly8xOTIuMTY4LjEuNTI6ODA4MC9jdGItcG9ydGxldC9yZXN0ZnVsL21hcmtpbmdOYW1lLycsXG4gICAgTUFSS0lOR19PUkRFUl9OTyA6ICdodHRwOi8vMTkyLjE2OC4xLjUyOjgwODAvY3RiLXBvcnRsZXQvcmVzdGZ1bC9tYXJraW5nT3JkZXJOby8nLFxuICAgIE1BUktJTkdfSU1HIDogJ2h0dHA6Ly8xOTIuMTY4LjEuNTI6ODA4MC9jdGItcG9ydGxldC9yZXN0ZnVsL21hcmtpbmdJbWcvJyxcbiAgICBNQVJLSU5HX1NBVkUgOiAnaHR0cDovLzE5Mi4xNjguMS41Mjo4MDgwL2N0Yi1wb3J0bGV0L3Jlc3RmdWwvbWFya2luZ1NhdmUvJyxcblxuICAgIElNR19QUkVGSVggOiAnaHR0cDovLzE5Mi4xNjguMS41Mjo4MDgwL2N0Yi1wb3J0bGV0L2ZpbGVzL2V4YW1pbmF0aW9uLydcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZzsiLCJ2YXIgbG9hZGluZyA9IHJlcXVpcmUoJy4vdW5pdC9sb2FkaW5nJyk7XG52YXIgcm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXInKTtcbnJvdXRlcigpO1xubG9hZGluZy5oaWRlKCk7IiwidmFyIGNvbmZpZyAgID0gcmVxdWlyZSgnLi4vY29uZmlnJyksXG4gICAgZG9tICAgPSByZXF1aXJlKCcuLi91bml0L2RvbScpLFxuICAgIGFqYXggID0gcmVxdWlyZSgnLi4vdW5pdC9hamF4JyksXG4gICAgc3RvcmUgPSByZXF1aXJlKCcuLi91bml0L3N0b3JlJyksXG4gICAgdmlld3BvcnQgPSByZXF1aXJlKCcuLi91bml0L3ZpZXdwb3J0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgIGFqYXgoe1xuICAgICAgICB1cmw6IGNvbmZpZy5NQVJLSU5HX05BTUUsXG4gICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgcGRhdGEgOiB7XG4gICAgICAgICAgICAgICAgdGVhY2hlcklkOiBzdG9yZSgndGVhY2hlcklkJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICAgICAgLy8gZGF0YSA9IHtkYXRhOmRhdGF9XG4gICAgICAgICAgICB2YXIgdHBsICAgICAgPSBkb20uZmluZCgnI2V4YW1MaXN0VHBsJylbMF0uaW5uZXJIVE1MLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHRwbCksXG4gICAgICAgICAgICAgICAgaHRtbCAgICAgPSB0ZW1wbGF0ZShkYXRhKTtcbiAgICAgICAgICAgIGRvbS5maW5kKCcjZXhhbUxpc3QnKVswXS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICAgICAgZnVuY3Rpb24gZXZlbnRCaW5kKGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldC5ub2RlTmFtZSA9PT0gJ0JVVFRPTicpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUoJ21hcmtpbmdUeXBlJywgdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1tYXJraW5nVHlwZScpKTtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUoJ2V4YW1JZCcsIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZXhhbUlkJykpO1xuICAgICAgICAgICAgICAgICAgICBhamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCA6IGNvbmZpZy5NQVJLSU5HX09SREVSX05PLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGRhdGEgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtpbmdUeXBlOiBzdG9yZSgnbWFya2luZ1R5cGUnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhhbUlkOiBzdG9yZSgnZXhhbUlkJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlYWNoZXJJZDogc3RvcmUoJ3RlYWNoZXJJZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlKCdhbGxPcmRlck5vcycsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdwb3J0LnNob3coJyNvcmRlckxpc3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb20uZmluZCgnI2V4YW1MaXN0JylbMF0uYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGV2ZW50QmluZCwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfSk7XG59OyIsInZhciBjZmcgPSByZXF1aXJlKCcuLi9jb25maWcnKTtcbnZhciBkb20gPSByZXF1aXJlKCcuLi91bml0L2RvbScpO1xudmFyIGFqYXggPSByZXF1aXJlKCcuLi91bml0L2FqYXgnKTtcbnZhciB0aXBzID0gcmVxdWlyZSgnLi4vdW5pdC90aXBzJyk7XG52YXIgc3RvcmUgPSByZXF1aXJlKCcuLi91bml0L3N0b3JlJyk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmFyIG9Mb2dpbkZvcm0gPSBkb20uZmluZCgnI2xvZ2luIGZvcm0nKVswXTtcbiAgICBvTG9naW5Gb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZnVuY3Rpb24gc2VyaWFsaXplKCkge1xuICAgICAgICAgICAgdmFyIGtleSwgdmFsdWU7XG4gICAgICAgICAgICB2YXIgcmV0ID0ge307XG4gICAgICAgICAgICB2YXIgaW5wdXRzID0gZG9tLmZpbmQoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdLCBpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl0nKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gaW5wdXRzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgICAgIGtleSAgPSBpbnB1dHNbaV0uZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgJyc7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBpbnB1dHNbaV0udmFsdWUgfHwgJyc7XG4gICAgICAgICAgICAgICAgcmV0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgICAgYWpheCh7XG4gICAgICAgICAgICB1cmwgOiBjZmcuTUFSS0lOR19MT0dJTixcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwZGF0YSA6IHNlcmlhbGl6ZSgpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnMCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUoJ3RlYWNoZXJJZCcsIGRhdGEudGVhY2hlcklkKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LlJvdXRlcignZXhhbUxpc3QnKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRpcHMuc2hvdyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtc2cgOiAn55m75b2V5aSx6LSlJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RvcmUoJ2V4YW1lcycsIGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LCBmYWxzZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdDsiLCJ2YXIgY2ZnICAgICAgPSByZXF1aXJlKCcuLi9jb25maWcnKSxcbiAgICBkb20gICAgICA9IHJlcXVpcmUoJy4uL3VuaXQvZG9tJyksXG4gICAgYWpheCAgICAgPSByZXF1aXJlKCcuLi91bml0L2FqYXgnKSxcbiAgICBzdG9yZSAgICA9IHJlcXVpcmUoJy4uL3VuaXQvc3RvcmUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRhdGEgPSBzdG9yZSgnYWxsT3JkZXJOb3MnKSB8fCB7fTtcbiAgICB2YXIgdHBsICA9IGRvbS5maW5kKCcjb3JkZXJMaXN0VHBsJylbMF0uaW5uZXJIVE1MLFxuICAgICAgICB0ZW1wbGF0ZSA9IEhhbmRsZWJhcnMuY29tcGlsZSh0cGwpLFxuICAgICAgICBodG1sICAgICA9IHRlbXBsYXRlKGRhdGEpO1xuICAgIGRvbS5maW5kKCcjb3JkZXJMaXN0JylbMF0uaW5uZXJIVE1MID0gaHRtbDtcbiAgICBmdW5jdGlvbiBldmVudEJpbmQoZSkge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQgfHwge307XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICBpZiAodGFyZ2V0Lm5vZGVOYW1lID09PSAnTEknKSB7XG4gICAgICAgICAgICBhamF4KHtcbiAgICAgICAgICAgICAgICB1cmwgOiBjZmcuTUFSS0lOR19JTUcsXG4gICAgICAgICAgICAgICAgdHlwZSA6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICBkYXRhIDoge1xuICAgICAgICAgICAgICAgICAgICBwZGF0YSA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtpbmdUeXBlOiBzdG9yZSgnbWFya2luZ1R5cGUnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4YW1JZCA6IHN0b3JlKCdleGFtSWQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlYWNoZXJJZDogc3RvcmUoJ3RlYWNoZXJJZCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJObzogdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1vcmRlck5vJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUoJ3ZpZXdFeGFtJywgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5Sb3V0ZXIoJ3ZpZXdFeGFtJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZG9tLmZpbmQoJyNvcmRlckxpc3QnKVswXS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZXZlbnRCaW5kLCBmYWxzZSk7XG59OyIsInZhciBjZmcgICAgICA9IHJlcXVpcmUoJy4uL2NvbmZpZycpLFxuICAgIGRvbSAgICAgID0gcmVxdWlyZSgnLi4vdW5pdC9kb20nKSxcbiAgICBhamF4ICAgICA9IHJlcXVpcmUoJy4uL3VuaXQvYWpheCcpLFxuICAgIHN0b3JlICAgID0gcmVxdWlyZSgnLi4vdW5pdC9zdG9yZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3RhclRpbWU7XG4gICAgZnVuY3Rpb24gcmVuZGVyKGRhdGEpIHtcbiAgICAgICAgaWYgKGRhdGEuZmluaXNoVHlwZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGFsZXJ0KCfpopjnm67lt7LliKTlrozvvIEnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzdGFyVGltZSA9ICsgbmV3IERhdGUoKTtcblxuICAgICAgICBkYXRhLmltZ1ByZWZpeCA9IGNmZy5JTUdfUFJFRklYO1xuICAgICAgICBkYXRhLm1hcmtpbmcuaW1nU3JjID0gZGF0YS5tYXJraW5nLmltZ1NyYyArICc/dD0nICsgKCtuZXcgRGF0ZSgpKTtcbiAgICAgICAgZGF0YSA9IHt2aWV3RXhhbTogZGF0YX07XG4gICAgICAgIHZhciB0cGwgID0gZG9tLmZpbmQoJyN2aWV3RXhhbVRwbCcpWzBdLmlubmVySFRNTCxcbiAgICAgICAgdGVtcGxhdGUgPSBIYW5kbGViYXJzLmNvbXBpbGUodHBsKSxcbiAgICAgICAgaHRtbCAgICAgPSB0ZW1wbGF0ZShkYXRhKTtcbiAgICAgICAgZG9tLmZpbmQoJyN2aWV3RXhhbScpWzBdLmlubmVySFRNTCA9IGh0bWw7XG4gICAgfVxuICAgIHJlbmRlcihzdG9yZSgndmlld0V4YW0nKSB8fCB7fSk7XG4gICAgZnVuY3Rpb24gZXZlbnRCaW5kKGUpIHtcbiAgICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0IHx8IHt9O1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgaWYgKHRhcmdldC5pZCA9PT0gJ3NhdmUnKSB7XG4gICAgICAgICAgICBhamF4KHtcbiAgICAgICAgICAgICAgICB1cmwgOiBjZmcuTUFSS0lOR19TQVZFLFxuICAgICAgICAgICAgICAgIHR5cGUgOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgZGF0YSA6IHtcbiAgICAgICAgICAgICAgICAgICAgcGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0dWRlbnREZXRhaWxJZDogc3RvcmUoJ3ZpZXdFeGFtJykubWFya2luZy5zdHVkZW50RGV0YWlsSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWFjaGVySWQ6IHN0b3JlKCdleGFtZXMnKS50ZWFjaGVySWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2YWx1YXRpb246IGVuY29kZVVSSUNvbXBvbmVudCgn5Lit5Zu95ryC5Lqu5aa557q4JyksXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJraW5nVHlwZTogc3RvcmUoJ21hcmtpbmdUeXBlJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBob3VyOiAoKCsgbmV3IERhdGUoKSAtIHN0YXJUaW1lKSAvIDEwMDApIHwgMFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZSgndmlld0V4YW0nLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRvbS5maW5kKCcjdmlld0V4YW0nKVswXS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZXZlbnRCaW5kLCBmYWxzZSk7XG59OyIsInZhciBsaXN0cyA9IHtcbiAgICBsb2dpbiA6IHJlcXVpcmUoJy4vcGFnZS9sb2dpbicpLFxuICAgIGV4YW1MaXN0IDogcmVxdWlyZSgnLi9wYWdlL2V4YW1MaXN0JyksXG4gICAgb3JkZXJMaXN0IDogcmVxdWlyZSgnLi9wYWdlL29yZGVyTGlzdCcpLFxuICAgIHZpZXdFeGFtIDogcmVxdWlyZSgnLi9wYWdlL3ZpZXdFeGFtJylcbn07XG5cbnZhciB2aWV3cG9ydCA9IHJlcXVpcmUoJy4vdW5pdC92aWV3cG9ydCcpO1xuZnVuY3Rpb24gcm91dGVyKHZpZXdOYW1lKSB7XG5cdHZpZXdOYW1lID0gdmlld05hbWUgfHwgJ2xvZ2luJztcblx0dmlld3BvcnQuc2hvdygnIycgKyB2aWV3TmFtZSk7XG5cdGxpc3RzW3ZpZXdOYW1lXSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5Sb3V0ZXIgPSByb3V0ZXI7IiwidmFyIHVuaXQgPSByZXF1aXJlKCcuL3VuaXQnKTtcbnZhciBzdG9yZSA9IHJlcXVpcmUoJy4vc3RvcmUnKTtcbnZhciBsb2FkaW5nID0gcmVxdWlyZSgnLi9sb2FkaW5nJyk7XG52YXIgdGlwcyA9IHJlcXVpcmUoJy4vdGlwcycpO1xudmFyIHZpZXdwb3J0ID0gcmVxdWlyZSgnLi92aWV3cG9ydCcpO1xuXG52YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5mdW5jdGlvbiBhamF4KHBhcmFtKSB7XG4gICAgbG9hZGluZy5zaG93KCk7XG4gICAgdmFyIHRpY2tldElkID0gc3RvcmUoJ3RpY2tldElkJykgfHwgJyc7XG4gICAgdmFyIHR5cGUsIGRhdGE7XG4gICAgdmFyIGNmZyA9IHtcbiAgICAgICAgdXJsOiAnJyxcbiAgICAgICAgdHlwZTogJycsXG4gICAgICAgIHN1Y2Nlc3MgOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgZmFpbHVyZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHZpZXdwb3J0ID0gcmVxdWlyZSgnLi92aWV3cG9ydCcpO1xuICAgICAgICAgICAgdGlwcy5zaG93KHtcbiAgICAgICAgICAgICAgICBtc2cgOiAn5oKo5rKh5pyJ5p2D6ZmQJyxcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyDov5nph4zkuLrku4DkuYjkvJrooqvosIPnlKjkuKTmrKFcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQoOTk5KVxuICAgICAgICAgICAgICAgICAgICB2aWV3cG9ydC5zaG93KCcjbG9naW4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdW5pdC5leHRlbmQoY2ZnLCBwYXJhbSk7XG5cbiAgICB0eXBlID0gY2ZnLnR5cGUudG9VcHBlckNhc2UoKTtcblxuICAgIGlmICgvR0VUfERFTEVURS8udGVzdCh0eXBlKSkge1xuICAgICAgICBkYXRhID0gSlNPTi5zdHJpbmdpZnkoY2ZnLmRhdGEpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFx7fFxcfSQvZywgJycpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoLzovZywgJz0nKVxuICAgICAgICAgICAgICAucmVwbGFjZSgvLC9nLCAnJicpO1xuXG4gICAgICAgIHhoci5vcGVuKHR5cGUsXG4gICAgICAgICAgICBjZmcudXJsICArXG4gICAgICAgICAgICAoY2ZnLnVybC5pbmRleE9mKCc/JykgPiAtMSA/ICcmJzonPycpICtcbiAgICAgICAgICAgIGRhdGEgK1xuICAgICAgICAgICAgJyZfX3Q9JyArICgrbmV3IERhdGUoKSksXG4gICAgICAgIHRydWUpO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcigndGlja2V0SWQnLCBzdG9yZSgndGlja2V0SWQnKSB8fCAnJyk7XG4gICAgICAgIHhoci5zZW5kKG51bGwpO1xuICAgIH1cblxuICAgIGlmICgvUE9TVHxQVVQvLnRlc3QodHlwZSkpIHtcbiAgICAgICAgeGhyLm9wZW4odHlwZSwgY2ZnLnVybCwgdHJ1ZSk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCd0aWNrZXRJZCcsIHN0b3JlKCd0aWNrZXRJZCcpIHx8ICcnKTtcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoY2ZnLmRhdGEpKTtcbiAgICB9XG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGE7XG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIHRpY2tldElkID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKCd0aWNrZXRJZCcpO1xuICAgICAgICAgICAgICAgIHRpY2tldElkICYmIHN0b3JlKCd0aWNrZXRJZCcsIHRpY2tldElkKTtcbiAgICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0IHx8ICd7fScpO1xuICAgICAgICAgICAgICAgIGNmZy5zdWNjZXNzKGRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh4aHIuc3RhdHVzID09PSA0MDEpIHtcblxuICAgICAgICAgICAgICAgIHRpcHMuc2hvdyh7XG4gICAgICAgICAgICAgICAgICAgIG1zZyA6ICfnlKjmiLfmnKrnmbvlvZUnLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld3BvcnQuc2hvdygnI2xvZ2luJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoeGhyLnN0YXR1cyA9PT0gNDAwKSB7XG4gICAgICAgICAgICAgICAgY2ZnLmZhaWx1cmUoZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2FkaW5nLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGFqYXg7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZmluZCA6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbCk7XG4gICAgfVxufTsiLCJ2YXIgZG9tID0gcmVxdWlyZSgnLi9kb20nKTtcbnZhciBtYXNrID0gcmVxdWlyZSgnLi9tYXNrJyk7XG52YXIgbG9hZGluZyA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9sb2FkaW5nID0gIGRvbS5maW5kKCcucGxnLWxvYWRpbmcnKVswXSB8fFxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIF9sb2FkaW5nLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAncGxnLWxvYWRpbmcnKTtcbiAgICBfbG9hZGluZy5pbm5lckhUTUwgPSAn5Yqg6L2944CC44CC44CCJztcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKF9sb2FkaW5nKTtcbiAgICByZXR1cm4gbG9hZGluZyA/IGxvYWRpbmcgOiBfbG9hZGluZztcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gIHtcbiAgICBzaG93IDogZnVuY3Rpb24gKCkge1xuICAgICAgICBtYXNrLnNob3coKTtcbiAgICAgICAgbG9hZGluZy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9LFxuXG4gICAgaGlkZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbWFzay5oaWRlKCk7XG4gICAgICAgIGxvYWRpbmcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG59OyIsInZhciBkb20gPSByZXF1aXJlKCcuL2RvbScpO1xuXG52YXIgbWFzayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9tYXNrID0gZG9tLmZpbmQoJy5wbGctbWFzaycpWzBdIHx8XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBfbWFzay5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3BsZy1tYXNrJyk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChfbWFzayk7XG4gICAgcmV0dXJuIG1hc2sgPyBtYXNrIDogX21hc2s7XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBzaG93IDogZnVuY3Rpb24gKCkge1xuICAgICAgICBtYXNrLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH0sXG5cbiAgICBoaWRlIDogZnVuY3Rpb24gKCkge1xuICAgICAgICBtYXNrLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxufTsiLCJ2YXIgdWlkID0gJ21hcmtpbmdEYXRhJztcbmxvY2FsU3RvcmFnZVt1aWRdID0gbG9jYWxTdG9yYWdlW3VpZF0gfHwgJ3t9JztcbmZ1bmN0aW9uIHN0b3JlKGtleSwgdmFsdWUpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbdWlkXSlba2V5XTtcbiAgICB9XG5cbiAgICB2YXIgX3RtcCA9IEpTT04ucGFyc2UoXG4gICAgICAgIGxvY2FsU3RvcmFnZVt1aWRdXG4gICAgKTtcbiAgICBfdG1wW2tleV0gPSB2YWx1ZTtcblxuICAgIGxvY2FsU3RvcmFnZVt1aWRdID0gSlNPTi5zdHJpbmdpZnkoX3RtcCk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlOyIsInZhciBkb20gPSByZXF1aXJlKCcuL2RvbScpO1xuLy8gdmFyIG1hc2sgPSByZXF1aXJlKCcuL21hc2snKTtcblxudmFyIHRpcHMgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBfdGlwcyA9ICBkb20uZmluZCgnLnBsZy10aXBzJylbMF0gfHxcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBfdGlwcy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3BsZy10aXBzJyk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChfdGlwcyk7XG4gICAgcmV0dXJuIHRpcHMgPyB0aXBzIDogX3RpcHM7XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBzaG93IDogZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICAgIHBhcmFtID0gcGFyYW0gfHwge307XG4gICAgICAgIHZhciBtZSA9IHRoaXM7XG4gICAgICAgIHRpcHMuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIHRpcHMuaW5uZXJIVE1MID0gcGFyYW0ubXNnO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1lLmhpZGUoKTtcbiAgICAgICAgICAgIHBhcmFtLmNhbGxiYWNrICYmIHBhcmFtLmNhbGxiYWNrKCk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgICByZXR1cm4gbWU7XG4gICAgfSxcblxuICAgIGhpZGUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRpcHMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTsiLCIvLyB1bml0XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGV4dGVuZCA6IGZ1bmN0aW9uIChmbGFnLCB0bywgZnJvbSkge1xuICAgICAgICBmdW5jdGlvbiBfZXh0ZW5kKGZsYWcsIGEsIGIpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gYikge1xuICAgICAgICAgICAgICAgIGFbaV0gPSBiW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmxhZyAmJiBiW2ldICYmIF9leHRlbmQoZmxhZywgYVtpXSwgYltpXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmbGFnICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGZyb20gPSB0bztcbiAgICAgICAgICAgIHRvID0gZmxhZztcbiAgICAgICAgICAgIGZsYWcgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIF9leHRlbmQoZmxhZywgdG8sIGZyb20pO1xuICAgIH1cbn07IiwidmFyIGRvbSA9IHJlcXVpcmUoJy4vZG9tJyk7XG52YXIgdmlld3BvcnRzID0gZG9tLmZpbmQoJy4tdmlld3BvcnQnKTtcbnZhciB2aWV3cG9ydCA9IHtcbiAgICBzaG93IDogZnVuY3Rpb24gKHNlbGVjdG9yLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgY3VyVmlld3BvcnQgPSBkb20uZmluZChzZWxlY3RvcilbMF07XG4gICAgICAgIGlmIChjdXJWaWV3cG9ydC5zdHlsZS52aXNpYmlsaXR5ID09PSAndmlzaWJsZScpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdmlld3BvcnRzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICAgICAgdmlld3BvcnRzW2ldLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgfVxuICAgICAgICBjdXJWaWV3cG9ydC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmxhc3RQYW5lbCAhPT0gc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5sYXN0UGFuZWwgPSBzZWxlY3RvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gdmlld3BvcnQ7XG4iXX0=
;