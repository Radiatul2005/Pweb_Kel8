const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const moment = require('moment');
// Import routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const adminLoginRouter = require('./routes/adminLogin');
const dashboardRouter = require('./routes/dashboard');
const dashboardAdminRouter = require('./routes/dashboardAdmin');
const profileRouter = require('./routes/Profile');
const editRouter = require('./routes/edit');
const ubahpaswordRouter = require('./routes/ubah_pasword');
const formRouter = require('./routes/form');  // Import the new form route
const riwayatRouter = require('./routes/riwayat');
const laporananalisis = require('./routes/laporananalisis');
const manajemen_jadwal = require('./routes/manajemen_jadwal');
const evaluasi_nilai = require('./routes/evaluasi_nilai');
const menyetujui = require('./routes/menyetujui');
const detailRiwayatRouter = require('./routes/detailRiwayat');
const uploadRouter = require('./routes/upload');
const pembayaranRouter = require('./routes/pembayaran');
const hasilkelulusanRouter = require('./routes/hasilkelulusan_evaluasi');
const peringatanRouter = require('./routes/peringatan');
const forumdiskusiRouter = require('./routes/forumdiskusi');
const penilaianRouter = require('./routes/penilaian');


const inputnilaiRouter = require('./routes/inputnilai');
const dokumenRouter = require('./routes/dokumen');
const contohdokumenRouter = require('./routes/contohdokumen');
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

// Konfigurasi flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

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
app.use('/adminLogin', adminLoginRouter);
app.use('/dashboard', dashboardRouter);
app.use('/dashboardAdmin', dashboardAdminRouter);
app.use('/profile', profileRouter);
app.use('/editprofile', editRouter);
app.use('/ubah_pasword', ubahpaswordRouter);
app.use('/form', formRouter); // Use the new form route
app.use('/riwayat', riwayatRouter);
app.use('/laporananalisis', laporananalisis);
app.use('/manajemen_jadwal', manajemen_jadwal);
app.use('/evaluasi_nilai', evaluasi_nilai);
app.use('/menyetujui', menyetujui);
app.use('/detailRiwayat', detailRiwayatRouter);
app.use('/upload', uploadRouter);
app.use('/pembayaran', pembayaranRouter);
app.use('/hasilkelulusan_evaluasi', hasilkelulusanRouter);
app.use('/peringatan', peringatanRouter);
app.use('/forumdiskusi', forumdiskusiRouter);
app.use('/penilaian', penilaianRouter);

app.use('/inputnilai', inputnilaiRouter);
app.use('/dokumen', dokumenRouter);
app.use('/contohdokumen', contohdokumenRouter);

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
