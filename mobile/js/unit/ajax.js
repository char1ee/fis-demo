define(function (require) {
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
    window.ajax = ajax;
    return ajax;
});