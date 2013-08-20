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