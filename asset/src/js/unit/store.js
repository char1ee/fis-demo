var uid = 'markingData';
localStorage[uid] = localStorage[uid] || '{}';
function store(key, value) {
    if (arguments.length === 1) {
        return JSON.parse(localStorage[uid])[key];
    }

    var _tmp = JSON.parse(
        localStorage[uid]
    );
    _tmp[key] = value;

    localStorage[uid] = JSON.stringify(_tmp);
}
module.exports = store;