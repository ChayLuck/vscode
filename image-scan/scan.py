import cv2
import pytesseract
import os
import numpy as np

pytesseract.pytesseract.tesseract_cmd = 'C:\Program Files\Tesseract-OCR\\tesseract.exe'

# Resmi yükleme
image_path = "img/stop.jpg"  # Resmin yolunu buraya yaz
output_folder = "extracted_letters"

# Klasör kontrolü
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# OpenCV ile resmi oku
image = cv2.imread(image_path)
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Gürültü azaltma ve eşikleme
blurred = cv2.GaussianBlur(gray, (5, 5), 0)
_, thresh = cv2.threshold(blurred, 150, 255, cv2.THRESH_BINARY_INV)

# Harf konturlarını bulma
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Harfleri tek tek kesip kaydetme
for i, contour in enumerate(contours):
    x, y, w, h = cv2.boundingRect(contour)
    
    # Boyut filtresi (çok küçük nesneleri hariç tut)
    if w > 10 and h > 10:
        letter = image[y:y+h, x:x+w]
        letter_path = os.path.join(output_folder, f"letter_{i}.png")
        cv2.imwrite(letter_path, letter)

print(f"Extracted {len(contours)} letters and saved them in {output_folder}")

hImg, wImg,_ = image.shape
boxes = pytesseract.image_to_boxes(image)
for b in boxes.splitlines():
    print(b)
    b = b.split(' ')
    x, y, w, h = int(b[1]), int(b[2]), int(b[3]), int(b[4])
    cv2.rectangle(image, (x, hImg - y), (w, hImg - h), (50, 50, 255), 2)
    cv2.putText(image, b[0], (x, hImg - y + 25), cv2.FONT_HERSHEY_SIMPLEX, 1, (50, 50, 255), 2)

cv2.imshow('Result', image)
cv2.waitKey(0)

