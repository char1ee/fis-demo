// unit

module.exports = {
    extend : function (flag, to, from) {
        function _extend(flag, a, b) {
            for (var i in b) {
                a[i] = b[i];
            }
            flag && b[i] && _extend(flag, a[i], b[i]);
        }
        if (typeof flag !== 'boolean') {
            from = to;
            to = flag;
            flag = null;
        }
        _extend(flag, to, from);
    }
};