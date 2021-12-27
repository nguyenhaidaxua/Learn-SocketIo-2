const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});
const getRoom= document.querySelector('#room-name')
const usersList = document.querySelector('#users')
const chatContainer = document.querySelector('.chat-container')
const chatTitle = document.querySelector('.chat-title')
const socket = io()
// Change the bg
socket.on('bg', bg => {
    if (bg === 'Genshin'){
        chatContainer.classList.add('bg-genshin')
        chatTitle.innerText = 'Genshin Impact'
    }
    else if(bg === 'General') {
        chatContainer.classList.add('bg-general')
        chatTitle.innerText = 'General'
    }
    else if(bg === 'Music') {
        chatContainer.classList.add('bg-music')
        chatTitle.innerText= 'Music'
    }
    else if(bg === 'COD') {
        chatContainer.classList.add('bg-cod')
        chatTitle.innerText= 'Call of Duty'
    }
    else if(bg === 'CS') {
        chatContainer.classList.add('bg-csgo')
        chatTitle.innerText = 'Counter-Strike'
    }
    else if(bg === 'lol') {
        chatContainer.classList.add('bg-lol')
        chatTitle.innerText = 'League of Legends'
    }
})
// Join 
socket.emit('joinRoom', {username, room})

// get room and user info
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room)
    outputUsers(users)
})

// message from server
socket.on('message', message => {
    
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
    div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p> 
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