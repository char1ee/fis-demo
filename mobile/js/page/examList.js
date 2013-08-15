define(function (require) {
    var config   = require('../config'),
        dom   = require('../unit/dom'),
        ajax  = require('../unit/ajax'),
        store = require('../unit/store'),
        viewport = require('../unit/viewport');
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
});