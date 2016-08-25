var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connection = [];
server.listen(process.env.PORT || 3000);
console.log('server running')
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
io.sockets.on('connection', function(socket) {
    connection.push(socket);
    console.log('connected:%s sockets connected', connection.length);

    //disconnect
    socket.on('disconnect', function(data) {
    	users.splice(users.indexOf(socket.username),1);
    	updateUsername();
        connection.splice(connection.indexOf(socket), 1);
        console.log('disconnected:%s sockets connected', connection.length);
    });
    //send  message
    socket.on('send message',function(data){
    	io.sockets.emit('new message',{msg:data,user:socket.username});
    });
    //new user
    socket.on('new user',function(data,callback){
    	callback(true);
    	socket.username=data;
    	users.push(socket.username);
    	updateUsername();
    });
    function updateUsername(){
    	io.sockets.emit('get users',users);
    }

});
