const express = require('express');
const http = require('http');
const path = require('path');
const { emit } = require('process');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, 
    currentUser,
    userLeave, 
    getRoomUsers
} = require('./utils/users')

const app = express();

const server = http.createServer(app)
const io = socketio(server)
const PORT =  process.env.PORT || 3000


app.use(express.static(path.join(__dirname, 'public')))

const botName = 'BOT'
// run when user connect
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id,username,room)
        socket.join(user.room)
        switch (user.room) {
            case user.room = 'Genshin Impact':
                socket.emit('bg', 'Genshin')
                break;
            case user.room = 'General':
                socket.emit('bg', 'General')
                break;
            case user.room = 'Music':
                socket.emit('bg', 'Music')
                break;
            case user.room = 'Call Of Duty':
                socket.emit('bg', 'COD')
                break;
            case user.room = 'CS:GO':
                socket.emit('bg', 'CS')
                break;
            case user.room = 'League of Legends':
                socket.emit('bg', 'lol')
                break;
            default:
                break;
        }
        // Welcome new user
        socket.emit('message', formatMessage(botName, 'Welcome To Chat App'))
        // broadcast when user connect
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(botName,`${user.username} has joined the chat`))
        // user and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
   
    // get chat message
    socket.on('chatMessage', msg =>{
        const user = currentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username, msg))
    })
    // alert when user disconnect
    socket.on('disconnect', () =>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`))

        }
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
})


server.listen(PORT, () =>{
    console.log('listening on port '+PORT);
});