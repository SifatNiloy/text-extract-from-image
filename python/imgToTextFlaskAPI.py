from flask import Flask, request, jsonify
from PIL import Image
import pytesseract
import os

# Initializing Flask 
app = Flask(__name__)

# Route for handling file upload and text extraction
@app.route('/extract-text', methods=['POST'])
def extract_text():
    # Checking if the file is in the request
    if 'image' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['image']

    # Checking if the user uploaded a file
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        file_path = os.path.join('uploads', file.filename)
        file.save(file_path)

        # image file opening using PIL
        img = Image.open(file_path)

        # pytesseract to extract text from the image in both Bengali and English
        extracted_text = pytesseract.image_to_string(img, lang='ben+eng')

        # removing newlines and extra spaces
        cleaned_text = " ".join(extracted_text.split()).strip()

        # removing the uploaded file after processing
        os.remove(file_path)

        # Returning the extracted text as a JSON response
        return jsonify({"extractedText": cleaned_text})


if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)
