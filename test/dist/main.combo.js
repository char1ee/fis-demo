/* math.js */
define("\\math", function(require, exports, module) {
    module.exports = {
        plus: function(a, b) {
            return a + b;
        }
    };
});
/* main.js */
define("main", function(require) {
    var a = require("\\math").plus(1, 2);
    // 3
    alert(a);
});