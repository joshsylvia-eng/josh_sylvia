const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Videos to extract thumbnails from
const videos = [
    {
        name: 'python_tutorial',
        videoPath: path.join(__dirname, '..', 'public', 'videos', 'python_tutorial.mp4'),
        thumbnailPath: path.join(__dirname, '..', 'public', 'images', 'python_tutorial_thumb.jpg')
    },
    {
        name: 'javascript_tutorial',
        videoPath: path.join(__dirname, '..', 'public', 'videos', 'javascript_tutorial.mp4'),
        thumbnailPath: path.join(__dirname, '..', 'public', 'images', 'javascript_tutorial_thumb.jpg')
    }
];

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Extract thumbnail from video using ffmpeg
function extractThumbnail(videoPath, thumbnailPath, videoName) {
    return new Promise((resolve, reject) => {
        console.log(`Extracting thumbnail for: ${videoName}`);
        
        // Use ffmpeg to extract the first frame at 00:00:01
        const ffmpegCommand = `ffmpeg -i "${videoPath}" -ss 00:00:01 -vframes 1 -q:v 2 "${thumbnailPath}"`;
        
        exec(ffmpegCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error extracting thumbnail for ${videoName}:`, error);
                reject(error);
            } else {
                console.log(`Successfully extracted thumbnail for: ${videoName}`);
                resolve(thumbnailPath);
            }
        });
    });
}

// Main function to extract all thumbnails
async function extractAllThumbnails() {
    console.log('Starting thumbnail extraction process...');
    
    for (const video of videos) {
        try {
            // Check if video file exists
            if (!fs.existsSync(video.videoPath)) {
                console.error(`Video file not found: ${video.videoPath}`);
                continue;
            }
            
            // Extract thumbnail
            await extractThumbnail(video.videoPath, video.thumbnailPath, video.name);
            
            // Wait a bit between extractions
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.error(`Failed to extract thumbnail for ${video.name}:`, error);
        }
    }
    
    console.log('Thumbnail extraction process completed!');
}

// Run the script
if (require.main === module) {
    extractAllThumbnails().catch(console.error);
}

module.exports = { extractAllThumbnails, extractThumbnail };
