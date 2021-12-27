const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');


const app = express();

const server = http.createServer(app)
const io = socketio(server)
const PORT = 3000 || process.env.PORT 


app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', socket => {
    console.log('New Connection');
    socket.emit('message', 'welcome to chat app')
})


server.listen(PORT, () =>{
    console.log('listening on port '+PORT);
});