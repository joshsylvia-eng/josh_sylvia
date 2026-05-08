const Video = require('../models/Video');
const fs = require('fs');
const path = require('path');

async function populateVideos() {
    try {
        console.log('Starting to populate videos database...');
        
        // Read videos from JSON file
        const videosDataFile = path.join(__dirname, '..', 'data', 'videos.json');
        
        if (!fs.existsSync(videosDataFile)) {
            console.error('Videos JSON file not found:', videosDataFile);
            return;
        }
        
        const videosData = fs.readFileSync(videosDataFile, 'utf8');
        const videos = JSON.parse(videosData);
        
        console.log(`Found ${videos.length} videos to populate`);
        
        // Insert each video into the database
        for (const video of videos) {
            try {
                const createdVideo = await Video.create({
                    title: video.title,
                    description: video.description,
                    file_path: video.file_path,
                    file_size: video.file_size || 0,
                    duration: video.duration || 0,
                    location: video.location,
                    tags: video.tags || [],
                    is_featured: video.is_featured || false
                });
                
                console.log(`✓ Created video: ${createdVideo.title}`);
            } catch (error) {
                console.error(`✗ Failed to create video "${video.title}":`, error.message);
            }
        }
        
        console.log('Video population completed!');
        
    } catch (error) {
        console.error('Error populating videos:', error);
    }
}

// Run the population script
populateVideos().then(() => {
    console.log('Script finished');
    process.exit(0);
}).catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
});
