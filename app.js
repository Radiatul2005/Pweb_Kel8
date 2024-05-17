const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');

// Import routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const editRouter = require('./routes/edit');
const loginRouter = require('./routes/login');
const dashboardRouter = require('./routes/dashboard'); // Import route dashboard

const app = express();

// Session setup
app.use(session({
  secret: 'secret', // Gunakan secret yang lebih kompleks untuk aplikasi produksi
  resave: true,
  saveUninitialized: true
}));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Use routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/editprofile', editRouter);
app.use('/login', loginRouter);
app.use('/dashboard', dashboardRouter); // Gunakan route dashboardRouter untuk /dashboard

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.get('/dashboard', (req, res) => {
  if (req.session.loggedin) {
    res.render('dashboard', { username: req.session.username });
  } else {
    res.redirect('/login'); // Arahkan pengguna ke halaman login jika belum login
  }
});

// Set port and start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error(`Server failed to start due to error: ${err.message}`);
});

module.exports = app;
