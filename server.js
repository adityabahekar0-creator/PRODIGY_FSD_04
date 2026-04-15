// Made by: Aditya Bahekar
// Internship Task 04 - April 2026
// This file starts the server and sets up Socket.IO for real time chat

const mongoose = require('mongoose');
const app      = require('./app');
const http     = require('http');
const { Server } = require('socket.io');
const chatSocket = require('./sockets/chatSocket');

// create http server from express app
const server = http.createServer(app);

// attach socket.io to the server
const io = new Server(server);

// setup chat socket logic
chatSocket(io);

// connect to mongodb then start server
mongoose.connect('mongodb://127.0.0.1:27017/chat-app', {
  directConnection: true,
  family: 4,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  server.listen(5000, () => {
    console.log('\n🚀 Server running at http://localhost:5000');
    console.log('🔑 Login      → http://localhost:5000/login');
    console.log('📝 Register   → http://localhost:5000/register');
    console.log('🏠 Dashboard  → http://localhost:5000/dashboard');
    console.log('💬 Chat       → http://localhost:5000/chat/:userId\n');
  });
})
.catch(err => {
  console.error('❌ MongoDB Failed:', err.message);
});
