define(function (require){
    var unit = require('./unit');
    var xhr = new XMLHttpRequest();

    function ajax (param){
        var type, data;
        var cfg = {
            success : function () {},
            failure: function () {
                var tips = require('./tips');
                var viewport = require('./viewport');
                tips.show({
                    msg : '您没有权限',
                    callback : function (){
                        // TODO 这里为什么会被调用两次
                        // alert(999)
                        viewport.show('#login');
                    }
                });
            }
        }
        unit.extend(cfg, param);

        type = cfg.type.toUpperCase();

        if (/GET|DELETE/.test(type)) {
            data = JSON.stringify(cfg.data)
                  .replace(/^\{|\}$/g, '')
                  .replace(/"/g, '')
                  .replace(/:/g, '=')
                  .replace(/,/g, '&')

            xhr.open(type,
                cfg.url  +
                (cfg.url.indexOf('?') > -1 ? '&':'?') +
                data +
                '&__t=' + +new Date,
            true);
            xhr.send(null);
        }

        if(/POST|PUT/.test(type)) {
            // xhr.setRequestHeader('ticketId', '999999999999999999999')
            xhr.open(type, cfg.url, true);
            xhr.send(JSON.stringify(cfg.data));
        }
        xhr.onreadystatechange = function () {
            var data;
            if (xhr.readyState === 4) {
                if(xhr.status === 200){
                    data = JSON.parse(xhr.responseText || '{}');
                    cfg.success(data);
                } else if(xhr.status === 400){
                    cfg.failure(data);
                }
            }
        }
    }
    return ajax;
});