// Made by: Aditya Bahekar
// Internship Task 04 - April 2026
// This is the frontend socket code that connects to the server
// This is what makes the chat work in real time!
// TODO: add emoji picker later
// TODO: add message reactions someday
// TODO: maybe add voice messages in future

const socket = io();

// get current user and receiver info from page
const currentUserId  = document.getElementById('currentUserId')?.value;
const receiverId     = document.getElementById('receiverId')?.value;
const currentUserName = document.getElementById('currentUserName')?.value;

// tell server this user is online
if (currentUserId) {
  socket.emit('userOnline', currentUserId);
}

// ── SEND MESSAGE ──────────────────────────────
const messageInput = document.getElementById('messageInput');
const sendBtn      = document.getElementById('sendBtn');
const messagesWrap = document.getElementById('messagesWrap');

// send message on button click
if (sendBtn) {
  sendBtn.addEventListener('click', sendMessage);
}

// send message on Enter key (Shift+Enter for new line)
if (messageInput) {
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // typing indicator
  let typingTimer;
  messageInput.addEventListener('input', () => {
    if (receiverId) {
      socket.emit('typing', {
        senderId:   currentUserId,
        receiverId: receiverId,
        senderName: currentUserName
      });

      // stop typing after 1.5 seconds of no input
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        socket.emit('stopTyping', {
          senderId:   currentUserId,
          receiverId: receiverId
        });
      }, 1500);
    }
  });
}

function sendMessage() {
  const message = messageInput?.value.trim();
  if (!message || !receiverId) return;

  // send to server
  socket.emit('sendMessage', {
    senderId:   currentUserId,
    receiverId: receiverId,
    message:    message
  });

  // clear input
  messageInput.value = '';

  // stop typing indicator
  socket.emit('stopTyping', {
    senderId:   currentUserId,
    receiverId: receiverId
  });
}

// ── RECEIVE MESSAGE ───────────────────────────
socket.on('receiveMessage', (data) => {
  // only show if message belongs to this chat
  if (
    (data.senderId === currentUserId   && data.receiverId === receiverId) ||
    (data.senderId === receiverId && data.receiverId === currentUserId)
  ) {
    appendMessage(data);
    scrollToBottom();
  }
});

function appendMessage(data) {
  if (!messagesWrap) return;

  const isMine = data.senderId === currentUserId;
  const time   = new Date(data.timestamp).toLocaleTimeString('en-IN', {
    hour:   '2-digit',
    minute: '2-digit'
  });

  const div = document.createElement('div');
  div.className = `message ${isMine ? 'mine' : 'theirs'}`;
  div.innerHTML = `
    <div class="message-bubble">${escapeHtml(data.message)}</div>
    <div class="message-time">${time}</div>
  `;

  messagesWrap.appendChild(div);
}

// escape html to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

function scrollToBottom() {
  if (messagesWrap) {
    messagesWrap.scrollTop = messagesWrap.scrollHeight;
  }
}

// scroll to bottom on load
scrollToBottom();

// ── TYPING INDICATOR ──────────────────────────
const typingEl = document.getElementById('typingIndicator');

socket.on('userTyping', (data) => {
  if (data.senderId === receiverId && typingEl) {
    typingEl.style.display = 'flex';
  }
});

socket.on('userStoppedTyping', (data) => {
  if (data.senderId === receiverId && typingEl) {
    typingEl.style.display = 'none';
  }
});

// ── ONLINE STATUS ─────────────────────────────
socket.on('onlineUsers', (onlineUserIds) => {
  // update online dots on user list
  document.querySelectorAll('.user-dot').forEach(dot => {
    const userId = dot.dataset.userId;
    if (onlineUserIds.includes(userId)) {
      dot.className = 'online-dot user-dot';
      dot.dataset.userId = userId;
      const statusEl = document.querySelector(`.user-status-text[data-user="${userId}"]`);
      if (statusEl) {
        statusEl.textContent = 'Online';
        statusEl.className = 'user-status online user-status-text';
        statusEl.dataset.user = userId;
      }
    } else {
      dot.className = 'offline-dot user-dot';
      dot.dataset.userId = userId;
      const statusEl = document.querySelector(`.user-status-text[data-user="${userId}"]`);
      if (statusEl) {
        statusEl.textContent = 'Offline';
        statusEl.className = 'user-status user-status-text';
        statusEl.dataset.user = userId;
      }
    }
  });

  // update chat header status
  const headerStatus = document.getElementById('headerStatus');
  if (headerStatus && receiverId) {
    if (onlineUserIds.includes(receiverId)) {
      headerStatus.textContent = 'Online';
      headerStatus.className = 'chat-header-status online';
    } else {
      headerStatus.textContent = 'Offline';
      headerStatus.className = 'chat-header-status';
    }
  }
});

// ── SEARCH USERS ──────────────────────────────
const searchInput = document.getElementById('searchUsers');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll('.user-item').forEach(item => {
      const name = item.querySelector('.user-name')?.textContent.toLowerCase();
      item.style.display = name?.includes(query) ? 'flex' : 'none';
    });
  });
}
