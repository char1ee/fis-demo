var express = require('express'),
    http    = require('http'),
    path    = require('path');

var config  = require('./var/config');
var restful = require('./var/restful');

var app = express();

// all environments
app.set('port', config.PORT);

app.set('views', __dirname + '/templates');
app.set('view engine', 'mu');
app.engine('mu', require('./lib/mustache').__express);

app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());


app.use(app.router);
app.use(express.static(path.join(__dirname, '../', 'www')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}
restful(app);
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});