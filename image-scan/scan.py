import cv2
import pytesseract
import os
import numpy as np
import math
from datetime import datetime

pytesseract.pytesseract.tesseract_cmd = 'C:\Program Files\Tesseract-OCR\\tesseract.exe'

# Resmi yükleme
image_path = "img/Upper.jpg"  # Resmin yolunu buraya yaz
output_folder = "extracted_letters"

# Configure pytesseract path (adjust as needed for your system)
pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'

def extract_letters(image_path, output_folder="extracted_letters"):
    """
    Extract individual handwritten letters from an image containing tables.
    Handles various exceptions like incorrect writing order, rotation, etc.
    
    Args:
        image_path: Path to the input image
        output_folder: Directory to save extracted letters
    """
    print(f"Processing image: {image_path}")
    
    # Create output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        print(f"Created output directory: {output_folder}")
    
    # Generate a timestamp for this extraction batch
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    batch_folder = os.path.join(output_folder, f"batch_{timestamp}")
    os.makedirs(batch_folder)
    
    # Load and preprocess the image
    try:
        original_image = cv2.imread(image_path)
        if original_image is None:
            raise Exception(f"Could not read image from {image_path}")
        
        # Create a copy for visualization
        visualization = original_image.copy()
        
        # Convert to grayscale
        gray = cv2.cvtColor(original_image, cv2.COLOR_BGR2GRAY)
        
        # Check for upside-down or rotated image by analyzing text orientation
        detected_orientation = detect_orientation(gray)
        if detected_orientation != 0:
            print(f"Detected rotation: {detected_orientation} degrees. Correcting...")
            gray = rotate_image(gray, detected_orientation)
            original_image = rotate_image(original_image, detected_orientation)
            visualization = rotate_image(visualization, detected_orientation)
        
        # Apply adaptive thresholding for better results with varying lighting
        binary = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY_INV, 11, 2
        )
        
        # Noise reduction
        kernel = np.ones((2, 2), np.uint8)
        binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)
        
        # Save the preprocessed image for debugging
        cv2.imwrite(os.path.join(batch_folder, "preprocessed.png"), binary)
        
        # Find contours of the letters
        contours, _ = cv2.findContours(
            binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )
        
        # Sort contours from left to right, top to bottom (reading order)
        sorted_contours = sort_contours_by_position(contours)
        
        # Extract and save individual letters
        letter_count = 0
        for i, contour in enumerate(sorted_contours):
            x, y, w, h = cv2.boundingRect(contour)
            
            # Filter out very small contours (noise)
            if w > 10 and h > 10:
                # Calculate aspect ratio to filter out non-letter shapes
                aspect_ratio = w / float(h)
                
                # Most letters have aspect ratios between 0.2 and 2.0
                if 0.2 <= aspect_ratio <= 2.0:
                    # Add small padding around the letter
                    padding = 5
                    x_start = max(0, x - padding)
                    y_start = max(0, y - padding)
                    x_end = min(original_image.shape[1], x + w + padding)
                    y_end = min(original_image.shape[0], y + h + padding)
                    
                    letter_image = original_image[y_start:y_end, x_start:x_end]
                    
                    # Save the letter
                    letter_path = os.path.join(batch_folder, f"letter_{letter_count}.png")
                    cv2.imwrite(letter_path, letter_image)
                    
                    # Draw bounding box for visualization
                    cv2.rectangle(visualization, (x, y), (x + w, y + h), (0, 255, 0), 2)
                    cv2.putText(visualization, str(letter_count), (x, y - 5),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)
                    
                    letter_count += 1
        
        # Save visualization image
        cv2.imwrite(os.path.join(batch_folder, "visualization.png"), visualization)
        
        print(f"Successfully extracted {letter_count} letters from {image_path}")
        print(f"Results saved in {batch_folder}")
        
        return letter_count, batch_folder
        
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return 0, batch_folder

def detect_orientation(gray_image):
    """
    Detect if the image is rotated or upside down.
    Returns estimated rotation angle in degrees.
    """
    try:
        # Use pytesseract's OSD (Orientation and Script Detection)
        osd = pytesseract.image_to_osd(gray_image)
        angle = int(osd.split("Rotate: ")[1].split("\n")[0])
        return angle
    except Exception as e:
        print(f"Orientation detection failed: {str(e)}")
        # Fall back to line detection method
        return detect_orientation_by_lines(gray_image)

def detect_orientation_by_lines(gray_image):
    """
    Backup method to detect orientation using Hough lines.
    """
    edges = cv2.Canny(gray_image, 50, 150, apertureSize=3)
    lines = cv2.HoughLines(edges, 1, np.pi/180, 200)
    
    if lines is None or len(lines) == 0:
        return 0
    
    angles = []
    for line in lines:
        rho, theta = line[0]
        # Convert theta to degrees
        angle_deg = theta * 180 / np.pi
        # Normalize angles
        if angle_deg > 45 and angle_deg < 135:
            angles.append(angle_deg - 90)
        elif angle_deg > 135:
            angles.append(angle_deg - 180)
        else:
            angles.append(angle_deg)
    
    # Get the median angle
    if angles:
        median_angle = np.median(angles)
        # Round to nearest multiple of 90 degrees if close
        if abs(median_angle) > 45:
            return round(median_angle / 90) * 90
        return round(median_angle)
    
    return 0

def rotate_image(image, angle):
    """
    Rotate an image by the specified angle.
    """
    # Get image dimensions
    height, width = image.shape[:2]
    # Calculate the center of the image
    center = (width // 2, height // 2)
    
    # Get the rotation matrix
    rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    
    # Calculate new image dimensions
    abs_cos = abs(rotation_matrix[0, 0])
    abs_sin = abs(rotation_matrix[0, 1])
    new_width = int(height * abs_sin + width * abs_cos)
    new_height = int(height * abs_cos + width * abs_sin)
    
    # Update the rotation matrix
    rotation_matrix[0, 2] += new_width / 2 - center[0]
    rotation_matrix[1, 2] += new_height / 2 - center[1]
    
    # Rotate the image
    rotated = cv2.warpAffine(image, rotation_matrix, (new_width, new_height), 
                             borderMode=cv2.BORDER_CONSTANT, borderValue=(255, 255, 255))
    
    return rotated

def sort_contours_by_position(contours):
    """
    Sort contours in reading order (top-to-bottom, left-to-right).
    Handles potential incorrect writing order.
    """
    # Get bounding boxes for all contours
    bounding_boxes = [cv2.boundingRect(contour) for contour in contours]
    
    # Pair contours with their bounding boxes
    contour_with_boxes = list(zip(contours, bounding_boxes))
    
    # Sort by Y first (top to bottom)
    # But group items that are approximately in the same row
    row_threshold = 20  # pixels
    sorted_rows = []
    current_row = [contour_with_boxes[0]]
    y_reference = contour_with_boxes[0][1][1]
    
    for pair in contour_with_boxes[1:]:
        _, (_, y, _, _) = pair
        if abs(y - y_reference) <= row_threshold:
            # Same row
            current_row.append(pair)
        else:
            # New row
            sorted_rows.append(current_row)
            current_row = [pair]
            y_reference = y
    
    # Add the last row if not empty
    if current_row:
        sorted_rows.append(current_row)
    
    # Sort each row by X (left to right)
    for i in range(len(sorted_rows)):
        sorted_rows[i] = sorted(sorted_rows[i], key=lambda pair: pair[1][0])
    
    # Flatten the list of rows
    flattened = [pair[0] for row in sorted_rows for pair in row]
    
    return flattened

def main():
    """
    Main function to process images from a folder.
    """
    # Target folder containing images to process
    images_folder = "img"
    output_folder = "extracted_letters"
    
    # Check if folder exists
    if not os.path.exists(images_folder):
        print(f"Error: Folder '{images_folder}' not found.")
        return
    
    # Process all images in the folder
    total_letters = 0
    processed_images = 0
    
    for filename in os.listdir(images_folder):
        # Filter for image files
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff')):
            image_path = os.path.join(images_folder, filename)
            letters, _ = extract_letters(image_path, output_folder)
            total_letters += letters
            processed_images += 1
    
    print(f"Processing complete. Processed {processed_images} images and extracted {total_letters} letters.")
    
    # Display visualization of the last processed image if any were processed
    if processed_images > 0:
        print("Press any key to exit...")
        cv2.waitKey(0)
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()