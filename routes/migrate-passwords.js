const mysql = require('mysql');
const bcrypt = require('bcryptjs');

// Konfigurasi koneksi ke MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'login'
});

// Menghubungkan ke database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');

  // Migrasi password
  db.query('SELECT * FROM users', async (err, results) => {
    if (err) {
      console.error('Error in database query:', err);
      return;
    }

    for (let user of results) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id], (err, result) => {
        if (err) {
          console.error('Error updating password:', err);
        } else {
          console.log(`Password for user ${user.username} updated successfully.`);
        }
      });
    }
  });
});
