var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const  Chat  = require("./Models/UserSchema"); 
const  connect  = require("./db");

var body = {}
app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});
users = [];
io.on('connection', function(socket) {
   socket.on('setUsername', function(data) {
      body.name = data
      if(users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users.push(data);
         socket.emit('userSet', {username: data});
      }
      
   });
   
   socket.on('msg', function(data) {
      //Send message to everyone
      io.sockets.emit('newmsg', data);
      console.log("msg",data)
    //   console.log("body",body)
   

connect.then(db  =>  {
    console.log("connected correctly to the server");
    body = {
        message:data.message,sender:data.user
    }
    console.log("body",body)
    let  chatMessage  =  new Chat(body);
    chatMessage.save();
    });
  
})  
});


http.listen(3000, function() {
   console.log('listening on *:3000');
});