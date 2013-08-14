define (function (require) {
    var cfg   = require('../config'),
        dom   = require('../unit/dom'),
        ajax  = require('../unit/ajax'),
        store = require('../unit/store'),
        viewport = require('../unit/viewport');
    var data = store('exames') || {};
    var tpl      = dom.find('#examListTpl')[0].innerHTML,
        template = Handlebars.compile(tpl),
        html     = template(data);
    dom.find('#examList')[0].innerHTML = html;
    function eventBind (e){
        var target = e.target;
        // var
        console.log(e);
        if(target.nodeName === 'BUTTON'){
            ajax({
                url : cfg.EXAM_LIST_URI,
                type : 'post',
                data : {
                    markingType : target.getAttribute('data-markingType'),
                    examId : target.getAttribute('data-examId')
                },
                success : function (data){
                    store('allOrderNos', data);
                    viewport.show('#orderList')
                }
            });
        }
    }
    dom.find('#examList')[0].addEventListener('touchstart', eventBind, false);

});