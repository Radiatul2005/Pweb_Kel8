const express = require('express');
const router = express.Router();

router.get('/form', (req, res) => {
  res.render('form'); // Render the form.ejs view
});

router.post('/submit-form', (req, res) => {
  const { name, email } = req.body;
  // Process the form data here
  console.log(`Name: ${name}, Email: ${email}`);
  res.send('Form submitted successfully');
});

module.exports = router;
