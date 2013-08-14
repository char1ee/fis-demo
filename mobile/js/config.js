define('config', function (require, exports, module) {
    var config = {
        LOGIN_URI : 'http://192.168.1.52:8080/ctb-portlet/restful/markingLogin/',
        EXAM_LIST_URI : '/examList'
    }
    module.exports = config;
});