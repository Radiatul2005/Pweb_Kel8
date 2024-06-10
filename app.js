const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');

// Import routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const dashboardRouter = require('./routes/dashboard');
const profileRouter = require('./routes/Profile');
const editRouter = require('./routes/edit');
const ubahpaswordRouter = require('./routes/ubah_pasword');
const formRouter = require('./routes/form');  // Import the new form route
const riwayatRouter = require('./routes/riwayat');
const detailRiwayatRouter = require('./routes/detailRiwayat');

const app = express();

// Setup session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Setup view engine
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
app.use('/login', loginRouter);
app.use('/dashboard', dashboardRouter);
app.use('/profile', profileRouter);
app.use('/editprofile', editRouter);
app.use('/ubah_pasword', ubahpaswordRouter);
app.use('/form', formRouter); // Use the new form route
app.use('/riwayat', riwayatRouter);
app.use('/detailRiwayat', detailRiwayatRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Set port and start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error(`Failed to start server: ${err.message}`);
});

module.exports = app;
