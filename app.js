const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

// initializing
const app = express();

// Setting up for file upload
const upload = multer({ dest: 'uploads/' });

// For upload and process image
app.post('/extract-text', upload.single('image'), (req, res) => {
  const imagePath = path.join(__dirname, req.file.path);

  // Running Tesseract to extract text from the image
  Tesseract.recognize(imagePath, 'ben+eng', {
    logger: info => console.log(info),
    langPath: 'https://tessdata.projectnaptha.com/4.0.0'  // to load the bengali language data
  })
  .then(({ data: { text } }) => {
    
    const cleanedText = text.split(/\r?\n/).join(' ').trim();
    res.json({ extractedText: cleanedText });

    fs.unlinkSync(imagePath);
  })
  .catch(err => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to extract text' });
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
