const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Import routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const editRouter = require('./routes/edit');
const loginRouter = require('./routes/loginRouter'); // Menambahkan import untuk loginRouter

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/editprofile', editRouter);
app.use('/login', loginRouter); // Menambahkan rute untuk halaman login

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 3000; // Menentukan port aplikasi (default: 3000)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
