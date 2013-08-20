var env = process.env.NODE_ENV || 'development';
var common = {
    VERSION: '0.0.1',
    CHARSET: 'utf-8',
    NAME: '20中',
    DESCRIPTION : '20中',
    KEYWORDS    : '20中',

    SESSION_SECRET   : process.env.SESSION_SECRET   || 'a743894a0e',
    COOKIE_SECRET    : process.env.COOKIE_SECRET    || 'a743894a0e',
    AUTH_COOKIE_NAME : process.env.AUTH_COOKIE_NAME || 'nd_secret',
    SPAM_COOKIE_NAME : process.env.SPAM_COOKIE_NAME || 'nd_spam',
    PORT             : process.env.PORT             || 3000
};

var obj = {
    development: {
        db: 'mongodb://localhost/app'
    },
    production: { }
};

for (var i in common) {
    obj.development[i] = common[i];
    obj.production[i] = common[i];
}

module.exports = obj[env];