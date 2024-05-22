const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');

// Impor rute
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const dashboardRouter = require('./routes/dashboard');
const profileRouter = require('./routes/profile');
const editRouter = require('./routes/edit');
const ubahpaswordRouter = require('./routes/ubah_pasword');
// const db = require('./routes/createtable');

const app = express();

// Setup sesi
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

// Gunakan rute
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/dashboard', dashboardRouter);
app.use('/profile', profileRouter);
app.use('/editprofile', editRouter)
app.use('/ubah_pasword', ubahpaswordRouter)

// Tangkap 404 dan teruskan ke penangan kesalahan
app.use(function(req, res, next) {
  next(createError(404));
});

// Penangan kesalahan
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Tetapkan port dan jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error(`Server gagal dimulai karena kesalahan: ${err.message}`);
});

module.exports = app;
