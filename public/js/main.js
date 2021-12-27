const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});
const getRoom= document.querySelector('#room-name')
const usersList = document.querySelector('#users')

const socket = io()

// Join 
socket.emit('joinRoom', {username, room})

// get room and user info
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room)
    outputUsers(users)
})

// message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll
   chatMessages.scrollTop = chatMessages.scrollHeight
})

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const msg = e.target.elements.msg.value
    socket.emit('chatMessage', msg)
    
    // Clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
        
})

// output message to DOM
function outputMessage (message){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username}</p> <span>${message.time}</span></p>
						<p class="text">
							${message.textMessage}
						</p>`
    document.querySelector('.chat-messages').appendChild(div)
}
// output room name to DOM
function outputRoomName(room) {
   
   getRoom.innerText = room
}
function outputUsers(users) {
    usersList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `

}