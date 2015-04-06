/**
 * Module dependencies.
 */

var express = require('express');
var socketio = require('socket.io');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorhandler = require('errorhandler');

var mongo = require('mongoose');

var index = require('./routes/index');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});

	socket.on('chat', function(msg){
		socket.broadcast.emit('chat', msg);
	});
});

// all environments
app.set('port', process.env.PORT || 3000);
// template html file
app.set('views', path.join(__dirname, '/public/views'));
//app.set('view engine', 'html');
app.set('view engine', 'jade');
//third-party midllerware
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
//css and html
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == process.env.NODE_ENV) {
  app.use(errorhandler());
}

app.get('/', index.index);
// app.get('/users', user.list);


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});