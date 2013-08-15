define(function (require) {
    var cfg      = require('../config'),
        dom      = require('../unit/dom'),
        ajax     = require('../unit/ajax'),
        store    = require('../unit/store');
        // viewport = require('../unit/viewport');
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
            // for (var i=0,l=dom.find('#viewExam input[type=text]').length; ++i){

            // }

            ajax({
                url : cfg.MARKING_SAVE,
                type : 'post',
                data : {
                    pdata: {
                        studentDetailId: store('viewExam').marking.studentDetailId,
                        teacherId: store('exames').teacherId,
                        score: 1,
                        evaluation: 999999999,
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
});