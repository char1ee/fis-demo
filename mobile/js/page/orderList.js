define (function (require) {
	var cfg	     = require('../config'),
		dom      = require('../unit/dom'),
		ajax     = require('../unit/ajax'),
		store    = require('../unit/store'),
		viewport = require('../unit/viewport');

	var data = store('allOrderNos') || {};
	var tpl	 = dom.find('#orderListTpl')[0].innerHTML,
		template = Handlebars.compile(tpl),
		html     = template(data);
	dom.find('#orderList')[0].innerHTML = html;
	function eventBind (e){
		var target = e.target;
		console.log(e);
		if(target.nodeName === 'LI'){
			ajax({
			   url : cfg.EXAM_LIST_URI,
			   type : 'post',
			   data : {
				   orderNo : target.getAttribute('data-orderNo'),
				   examId : target.getAttribute('data-examId')
			   },
			   success : function (data){
				   store('allOrderNos', data.allOrderNos);
				   viewport.show('#orderList')
			   }
			});
	   }
   }
   dom.find('#orderList li')[0].addEventListener('touchstart', eventBind, false);
});