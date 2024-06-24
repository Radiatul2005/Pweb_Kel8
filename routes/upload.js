const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.get('/', (req, res) => {
    res.render('upload'); 
});


router.post('/', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully!');
});

router.get('/view-file', (req, res) => {
    const fileName = req.query.fileName;
    const filePath = path.join(__dirname, '../public/uploads', fileName);
    res.sendFile(filePath);
});

module.exports = router;
