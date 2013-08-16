define(function (require) {
    var cfg      = require('../config'),
        dom      = require('../unit/dom'),
        ajax     = require('../unit/ajax'),
        store    = require('../unit/store'),
        viewport = require('../unit/viewport');

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
                    viewport.show('#viewExam');
                }
            });
        }
    }
    dom.find('#orderList')[0].addEventListener('touchstart', eventBind, false);
});