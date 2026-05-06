const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

async function extractVideoThumbnail() {
    try {
        const videoPath = path.join(__dirname, '../public/images/Video.mov');
        const thumbnailPath = path.join(__dirname, '../public/images/video-frame-thumbnail.jpg');
        
        console.log('Extracting first frame from video...');
        
        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .screenshots({
                    timestamps: ['00:00:00.000'], // First frame
                    filename: path.basename(thumbnailPath),
                    folder: path.dirname(thumbnailPath),
                    size: '400x220'
                })
                .on('end', () => {
                    console.log('Thumbnail extracted successfully!');
                    resolve(thumbnailPath);
                })
                .on('error', (err) => {
                    console.error('Error extracting thumbnail:', err);
                    reject(err);
                });
        });
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

extractVideoThumbnail().then(() => {
    console.log('Thumbnail extraction completed');
    process.exit(0);
}).catch((error) => {
    console.error('Failed to extract thumbnail:', error);
    process.exit(1);
});
