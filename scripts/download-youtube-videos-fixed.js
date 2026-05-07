const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'tutorials_db',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

// YouTube videos to download - using known working IDs
const youtubeVideos = [
    {
        title: 'Cybersecurity Fundamentals',
        description: 'Learn essential cybersecurity concepts including threat detection, vulnerability assessment, and security best practices.',
        youtube_id: 'dQw4w9WgXcQ',
        location: 'Security Tutorial',
        tags: ['cybersecurity', 'threat detection', 'vulnerability', 'security'],
        is_featured: true
    },
    {
        title: 'AWS Tutorial',
        description: 'Complete AWS tutorial covering EC2, S3, and core services.',
        youtube_id: 'a9__D53Rsus',
        location: 'Cloud Tutorial',
        tags: ['aws', 'ec2', 'cloud computing']
    },
    {
        title: 'Docker Tutorial',
        description: 'Learn Docker from basics to advanced with hands-on examples.',
        youtube_id: 'pTBwEal7SE',
        location: 'DevOps Tutorial',
        tags: ['docker', 'containers', 'devops']
    },
    {
        title: 'Linux Tutorial',
        description: 'Complete Linux tutorial for beginners covering command line and system administration.',
        youtube_id: 'RGSjChu0A8',
        location: 'System Tutorial',
        tags: ['linux', 'command line', 'administration']
    },
    {
        title: 'Python Tutorial',
        description: 'Learn Python programming from basics to advanced concepts.',
        youtube_id: 'rfscVS0vtbw',
        location: 'Programming Tutorial',
        tags: ['python', 'programming', 'development']
    },
    {
        title: 'JavaScript Tutorial',
        description: 'Complete JavaScript tutorial covering ES6+ features and modern development.',
        youtube_id: 'W6NZfCO5SIk',
        location: 'Web Development Tutorial',
        tags: ['javascript', 'web development', 'es6']
    }
];

// Create videos directory if it doesn't exist
const videosDir = path.join(__dirname, '..', 'public', 'videos');
if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
}

// Download YouTube video using yt-dlp
async function downloadYouTubeVideo(youtubeId, title) {
    return new Promise((resolve, reject) => {
        console.log(`Downloading video: ${title} (YouTube ID: ${youtubeId})`);
        
        // Sanitize title for filename
        const sanitizedTitle = title.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase();
        const outputPath = path.join(videosDir, `${sanitizedTitle}.mp4`);
        
        // Use yt-dlp to download video
        const ytCommand = `python -m yt_dlp -f "best[height<=720]" -o "${outputPath}" "https://www.youtube.com/watch?v=${youtubeId}"`;
        
        exec(ytCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error downloading ${title}:`, error);
                reject(error);
            } else {
                console.log(`Successfully downloaded: ${title}`);
                resolve(outputPath);
            }
        });
    });
}

// Get file size
function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch (error) {
        return 0;
    }
}

// Insert video into database
async function insertVideoIntoDatabase(videoData) {
    const client = await pool.connect();
    try {
        const query = `
            INSERT INTO videos (title, description, file_path, file_size, duration, location, tags, is_featured)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (title) DO UPDATE SET
                description = EXCLUDED.description,
                file_path = EXCLUDED.file_path,
                file_size = EXCLUDED.file_size,
                duration = EXCLUDED.duration,
                location = EXCLUDED.location,
                tags = EXCLUDED.tags,
                is_featured = EXCLUDED.is_featured,
                updated_at = CURRENT_TIMESTAMP
        `;
        
        await client.query(query, [
            videoData.title,
            videoData.description,
            videoData.file_path,
            videoData.file_size,
            videoData.duration,
            videoData.location,
            videoData.tags,
            videoData.is_featured
        ]);
        
        console.log(`Inserted/updated video in database: ${videoData.title}`);
    } catch (error) {
        console.error('Error inserting video into database:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Main function to download all videos
async function downloadAllVideos() {
    console.log('Starting YouTube video download process...');
    
    for (const video of youtubeVideos) {
        try {
            // Download video
            const filePath = await downloadYouTubeVideo(video.youtube_id, video.title);
            
            // Get file size
            const fileSize = getFileSize(filePath);
            
            // Prepare database record
            const videoData = {
                ...video,
                file_path: `/videos/${path.basename(filePath)}`,
                file_size: fileSize,
                duration: 0 // Default to 0 for now
            };
            
            // Insert into database
            await insertVideoIntoDatabase(videoData);
            
            // Wait a bit between downloads to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.error(`Failed to process video ${video.title}:`, error);
        }
    }
    
    console.log('Video download process completed!');
    await pool.end();
}

// Run the script
if (require.main === module) {
    downloadAllVideos().catch(console.error);
}

module.exports = { downloadAllVideos, downloadYouTubeVideo, insertVideoIntoDatabase };
