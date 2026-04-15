// Made by: Aditya Bahekar
// Auth + Chat routes

const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Message = require('../models/Message');

// middleware - check if logged in
const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'Please login first.');
    return res.redirect('/login');
  }
  next();
};

// home redirect
router.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.redirect('/login');
});

// login page
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('login', { title: 'Login' });
});

// handle login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      req.flash('error', 'Please enter email and password.');
      return res.redirect('/login');
    }

    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    // set user online
    user.isOnline = true;
    await user.save();

    req.session.user = {
      id:    user._id.toString(),
      name:  user.name,
      email: user.email
    };

    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/dashboard');

  } catch (err) {
    console.error('Login Error:', err.message);
    req.flash('error', 'Something went wrong.');
    res.redirect('/login');
  }
});

// register page
router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('register', { title: 'Register' });
});

// handle register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      req.flash('error', 'Please fill in all fields.');
      return res.redirect('/register');
    }

    const existing = await User.findOne({ email });
    if (existing) {
      req.flash('error', 'Email already registered.');
      return res.redirect('/register');
    }

    await User.create({ name, email, password });
    req.flash('success', 'Account created! Please login.');
    res.redirect('/login');

  } catch (err) {
    console.error('Register Error:', err.message);
    req.flash('error', 'Something went wrong.');
    res.redirect('/register');
  }
});

// dashboard - show all users
router.get('/dashboard', isLoggedIn, async (req, res) => {
  try {
    // get all users except current user
    const users = await User.find({
      _id: { $ne: req.session.user.id }
    }).select('name email isOnline lastSeen');

    res.render('dashboard', {
      title: 'Dashboard',
      users
    });
  } catch (err) {
    res.render('dashboard', { title: 'Dashboard', users: [] });
  }
});

// API - get users list for sidebar in chat page
router.get('/api/users', isLoggedIn, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.session.user.id }
    }).select('name email isOnline');
    res.json({ users });
  } catch (err) {
    res.json({ users: [] });
  }
});

// chat page
router.get('/chat/:userId', isLoggedIn, async (req, res) => {
  try {
    const receiver = await User.findById(req.params.userId).select('name email isOnline');
    if (!receiver) {
      req.flash('error', 'User not found.');
      return res.redirect('/dashboard');
    }

    // load previous messages between these two users
    const messages = await Message.find({
      $or: [
        { senderId: req.session.user.id, receiverId: req.params.userId },
        { senderId: req.params.userId,   receiverId: req.session.user.id }
      ]
    }).sort({ timestamp: 1 });

    res.render('chat', {
      title: `Chat with ${receiver.name}`,
      receiver,
      messages,
      currentUser: req.session.user
    });

  } catch (err) {
    console.error('Chat Error:', err.message);
    req.flash('error', 'Could not load chat.');
    res.redirect('/dashboard');
  }
});

// logout
router.get('/logout', async (req, res) => {
  try {
    if (req.session.user) {
      // set user offline
      await User.findByIdAndUpdate(req.session.user.id, {
        isOnline: false,
        lastSeen: new Date()
      });
    }
    req.session.destroy();
    res.redirect('/login');
  } catch (err) {
    res.redirect('/login');
  }
});

module.exports = router;
