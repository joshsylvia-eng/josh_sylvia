const fs = require('fs');
const path = require('path');

// For now, let's create a more appropriate thumbnail by using an existing image
// that could represent a basement/renovation scene

function createVideoThumbnail() {
    try {
        // Use the existing 56115140.jfif image which might be more suitable as a video thumbnail
        const sourceImage = path.join(__dirname, '../public/images/56115140.jfif');
        const targetThumbnail = path.join(__dirname, '../public/images/video-frame-thumbnail.jpg');
        
        // Check if source image exists
        if (fs.existsSync(sourceImage)) {
            // Copy the image as our video frame thumbnail
            fs.copyFileSync(sourceImage, targetThumbnail);
            console.log('Video thumbnail created successfully!');
            console.log('File saved as: public/images/video-frame-thumbnail.jpg');
            return true;
        } else {
            console.log('Source image not found. Please ensure you have an appropriate image for the thumbnail.');
            return false;
        }
        
    } catch (error) {
        console.error('Error creating video thumbnail:', error);
        return false;
    }
}

// Alternative: create a simple placeholder that looks like a video frame
function createPlaceholderThumbnail() {
    const svgContent = `
<svg width="400" height="220" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="220" fill="#2c3e50"/>
    <text x="200" y="110" font-family="Arial" font-size="18" fill="white" text-anchor="middle">
        Home Built Basement
    </text>
    <text x="200" y="135" font-family="Arial" font-size="14" fill="#ecf0f1" text-anchor="middle">
        Video Frame
    </text>
    <circle cx="200" cy="110" r="25" fill="none" stroke="white" stroke-width="3"/>
    <polygon points="190,100 190,120 210,110" fill="white"/>
</svg>`;
    
    const targetPath = path.join(__dirname, '../public/images/video-frame-thumbnail.jpg');
    
    // For now, let's just copy the existing image as a placeholder
    const sourceImage = path.join(__dirname, '../public/images/56115140.jfif');
    if (fs.existsSync(sourceImage)) {
        fs.copyFileSync(sourceImage, targetPath);
        console.log('Placeholder video thumbnail created from existing image.');
        return true;
    }
    
    return false;
}

// Try to create the thumbnail
if (createVideoThumbnail()) {
    console.log('Success! The video thumbnail has been created.');
    console.log('Now you can update the code to use video-frame-thumbnail.jpg');
} else {
    console.log('Trying placeholder method...');
    if (createPlaceholderThumbnail()) {
        console.log('Placeholder thumbnail created.');
    } else {
        console.log('Could not create thumbnail. Please add an appropriate image manually.');
    }
}
