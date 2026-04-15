// Made by: Aditya Bahekar
// Internship Task 04 - April 2026
// Real Time Chat Application

const express  = require('express');
const session  = require('express-session');
const flash    = require('connect-flash');
const path     = require('path');

const authRoutes = require('./routes/authRoutes');

const app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// session - reused from task 01
app.use(session({
  secret: 'chatAppSecret2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.use(flash());

// make user available in all views
app.use((req, res, next) => {
  res.locals.user    = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error   = req.flash('error');
  next();
});

// routes
app.use('/', authRoutes);

module.exports = app;
