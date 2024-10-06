const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

// Initialize the app
const app = express();

// Set up multer for file upload
const upload = multer({ dest: 'uploads/' });

// Endpoint to upload and process image
app.post('/extract-text', upload.single('image'), (req, res) => {
  const imagePath = path.join(__dirname, req.file.path);

  // Run Tesseract to extract text from the image
  Tesseract.recognize(imagePath, 'eng', {
    logger: info => console.log(info) // Log progress (optional)
  })
  .then(({ data: { text } }) => {
    // Split the text into lines and join them without newlines
    const cleanedText = text.split(/\r?\n/).join(' ').trim();

    // Send the cleaned extracted text as the response
    res.json({ extractedText: cleanedText });

    // Clean up the uploaded file after processing
    fs.unlinkSync(imagePath);
  })
  .catch(err => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to extract text' });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
