const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database as id ' + connection.threadId);
});

router.get('/', (req, res) => {
    const paymentQuery = 'SELECT * FROM payments';
    const studentQuery = 'SELECT * FROM students WHERE nim = "2211522005"'; 

    connection.query(paymentQuery, (err, paymentResults) => {
        if (err) {
            console.error('Error fetching payments from MySQL: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(studentQuery, (err, studentResults) => {
            if (err) {
                console.error('Error fetching student data from MySQL: ' + err.stack);
                res.status(500).send('Internal Server Error');
                return;
            }

            console.log('Data payments from MySQL:', paymentResults);
            console.log('Data student from MySQL:', studentResults);

            res.render('pembayaran', { 
                payments: paymentResults,
                student: studentResults[0] 
            });
        });
    });
});

process.on('SIGINT', () => {
    connection.end();
    console.log('MySQL connection closed');
});

module.exports = router;
