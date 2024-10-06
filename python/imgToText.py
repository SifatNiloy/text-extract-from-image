# without api

import pytesseract
from PIL import Image

def extract_text_from_image(image_path):
    img = Image.open(image_path)
    
    # pytesseract to extract text
    extracted_text = pytesseract.image_to_string(img, lang='ben+eng')
    
    # removing newlines and extra spaces
    cleaned_text = " ".join(extracted_text.split()).strip()
    
    return cleaned_text

if __name__ == '__main__':
    image_path = 'C:\\Users\\SN\\Downloads\\textImg6.jpg'   # path here
    
    extracted_text = extract_text_from_image(image_path)
    print("Extracted Text: ", extracted_text)
