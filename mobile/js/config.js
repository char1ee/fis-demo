define('config', function (require, exports, module) {
    var config = {
        MARKING_LOGIN : 'http://192.168.1.52:8080/ctb-portlet/restful/markingLogin/',
        MARKING_NAME : 'http://192.168.1.52:8080/ctb-portlet/restful/markingName/',
        MARKING_ORDER_NO : 'http://192.168.1.52:8080/ctb-portlet/restful/markingOrderNo/',
        MARKING_IMG : 'http://192.168.1.52:8080/ctb-portlet/restful/markingImg/',
        MARKING_SAVE : 'http://192.168.1.52:8080/ctb-portlet/restful/markingSave/',

        IMG_PREFIX : 'http://192.168.1.52:8080/ctb-portlet/files/examination/'
    };
    module.exports = config;
});