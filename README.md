# 💬 AB Chat - Real Time Chat Application

This is my fourth internship task where I had to build a 
real time chat application like WhatsApp! This was the most 
exciting task so far because messages appear instantly 
without refreshing the page using Socket.IO 🔥

---

## 💡 Why I Built This

My mentor gave me this task to learn about real time 
communication using WebSockets. This is how WhatsApp, 
Instagram DM and all modern chat apps work!

---

## ✨ What This Project Does

- 🔑 Register and Login (reused from Task 01)
- 👥 See all registered users
- 🟢 See who is Online or Offline in real time  
- 💬 Send and receive messages instantly
- ⌨️ Typing indicator when other person is typing
- 💾 Chat history saved in MongoDB database
- 🔍 Search users by name

---

## 🛠️ Technologies I Used

| Technology | Purpose |
|------------|---------|
| Node.js | Backend server |
| Express.js | Routing |
| Socket.IO | Real time messaging |
| MongoDB | Save messages and users |
| EJS | HTML templates |
| express-session | Keep users logged in |
| bcryptjs | Password encryption |
| HTML & CSS | Frontend design |

---

## 📁 Project Structure

```
real-time-chat-app/
│
├── server.js              → starts server with Socket.IO
├── app.js                 → express app setup
├── package.json           → dependencies
│
├── config/
│   └── db.js              → mongodb connection
│
├── models/
│   ├── User.js            → user data
│   └── Message.js         → message data
│
├── routes/
│   └── authRoutes.js      → all routes
│
├── sockets/
│   └── chatSocket.js      → real time chat logic
│
├── views/
│   ├── login.ejs          → login page
│   ├── register.ejs       → register page
│   ├── dashboard.ejs      → users list
│   └── chat.ejs           → chat page
│
└── public/
    ├── css/
    │   └── style.css      → all styles
    └── js/
        └── client.js      → frontend socket code
```

---

## ▶️ How to Run

**Step 1 - Install packages**
```bash
npm install
```

**Step 2 - Start MongoDB**
- Open Services → Start MongoDB

**Step 3 - Run server**
```bash
node server.js
```

**Step 4 - Open browser**
```
Login     → http://localhost:5000/login
Register  → http://localhost:5000/register
Dashboard → http://localhost:5000/dashboard
```

---

## 🧪 How to Test Real Time Chat

1. Open `http://localhost:5000/register` in **Chrome**
2. Register as **User A** (e.g. Aditya)
3. Open another tab or browser
4. Register as **User B** (e.g. Rahul)
5. Login as User A → click on Rahul → send a message
6. Login as User B → see message appear instantly! ✅

---

## 💡 How Real Time Works

Normal website → send message → refresh page → see message

This app → send message → appears instantly for other user

This magic happens because of **Socket.IO WebSockets**!

```
User A types message
      ↓
Frontend sends to Socket Server
      ↓
Server finds User B's socket
      ↓
Server sends to User B instantly
      ↓
User B sees message without refresh! ✅
```

---

## 😅 Challenges I Faced

- Understanding how Socket.IO works was completely new
- Making the typing indicator work correctly took time
- Showing old messages when opening chat was tricky
- Online/offline status updating in real time was complex

---

## 🚀 What I Want to Add Later

- Group chat rooms
- Emoji reactions to messages
- Image and file sharing
- Voice messages
- Message seen/delivered ticks like WhatsApp
- Push notifications

---

## 📌 What I Learned

- How WebSockets work vs normal HTTP requests
- How Socket.IO connects frontend and backend in real time
- How to save and load chat history from MongoDB
- How to show online/offline status in real time
- Connecting multiple browser tabs to same socket server

---

## 👨‍💻 Made By

**Aditya Bahekar**
Internship Task 04 — April 2026
