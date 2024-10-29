const socket = io();

// DOM Elements
const joinScreen = document.getElementById('join-screen');
const chatScreen = document.getElementById('chat-screen');
const joinChatBtn = document.getElementById('join-chat');
const leaveChatBtn = document.getElementById('leave-chat');
const messageInput = document.getElementById('message-input');
const sendMessageBtn = document.getElementById('send-message');
const messagesContainer = document.getElementById('messages');

let username = '';

// Join Chat Event
joinChatBtn.addEventListener('click', () => {
  username = document.getElementById('username').value.trim();
  if (username) {
    socket.emit('join', username);
    joinScreen.classList.remove('active');
    chatScreen.classList.add('active');
  }
});

// Send Message Event
sendMessageBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('message', { username, message });
    displayMessage({ username: 'You', message });
    messageInput.value = '';
  }
}

leaveChatBtn.addEventListener('click', () => {
  socket.emit('leave', username);
  joinScreen.classList.add('active');
  chatScreen.classList.remove('active');
  messagesContainer.innerHTML = '';
});

// Display Message Function
function displayMessage({ username, message }) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `<strong>${username}:</strong> ${message}`;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Socket Events
socket.on('message', (data) => displayMessage(data));
socket.on('user-joined', (username) => {
  displayMessage({ username: 'System', message: `${username} joined the chat` });
});
socket.on('user-left', (username) => {
  displayMessage({ username: 'System', message: `${username} left the chat` });
});
