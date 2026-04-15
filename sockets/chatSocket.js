// Made by: Aditya Bahekar
// This is the main real time chat logic using Socket.IO
// This is what makes messages appear instantly without refresh!
// TODO: add typing indicators later
// TODO: add read receipts someday

const Message = require('../models/Message');
const User    = require('../models/User');

module.exports = (io) => {

  // store online users - userId: socketId
  const onlineUsers = {};

  io.on('connection', (socket) => {
    console.log('🟢 User connected:', socket.id);

    // user joins with their userId
    socket.on('userOnline', async (userId) => {
      onlineUsers[userId] = socket.id;
      socket.userId = userId;

      // mark user as online in database
      await User.findByIdAndUpdate(userId, { isOnline: true });

      // tell everyone who is online
      io.emit('onlineUsers', Object.keys(onlineUsers));
      console.log('Online users:', Object.keys(onlineUsers).length);
    });

    // handle sending message
    socket.on('sendMessage', async (data) => {
      const { senderId, receiverId, message } = data;

      try {
        // save message to database
        const newMessage = await Message.create({
          senderId,
          receiverId,
          message,
          timestamp: new Date()
        });

        // create message object to send back
        const messageData = {
          _id:        newMessage._id,
          senderId,
          receiverId,
          message,
          timestamp:  newMessage.timestamp
        };

        // send to receiver if online
        const receiverSocketId = onlineUsers[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', messageData);
        }

        // also send back to sender to confirm
        socket.emit('receiveMessage', messageData);

      } catch (err) {
        console.error('Message Error:', err.message);
        socket.emit('messageError', 'Could not send message.');
      }
    });

    // handle typing indicator
    socket.on('typing', (data) => {
      const receiverSocketId = onlineUsers[data.receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('userTyping', {
          senderId: data.senderId,
          senderName: data.senderName
        });
      }
    });

    // handle stop typing
    socket.on('stopTyping', (data) => {
      const receiverSocketId = onlineUsers[data.receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('userStoppedTyping', {
          senderId: data.senderId
        });
      }
    });

    // handle disconnect
    socket.on('disconnect', async () => {
      console.log('🔴 User disconnected:', socket.id);

      if (socket.userId) {
        // remove from online users
        delete onlineUsers[socket.userId];

        // mark as offline in database
        await User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
          lastSeen: new Date()
        });

        // update everyone with new online list
        io.emit('onlineUsers', Object.keys(onlineUsers));
      }
    });
  });
};
