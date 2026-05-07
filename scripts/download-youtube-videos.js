const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// JSON file for storing video metadata
const videosDataFile = path.join(__dirname, '..', 'data', 'videos.json');

// YouTube videos to download
const youtubeVideos = [
    {
        title: 'CISSP Certification Complete Course',
        description: 'Complete CISSP exam preparation covering all 8 domains. Learn security and risk management, asset security, and more.',
        youtube_id: '_nyZhYnCNLA',
        location: 'Certification Tutorial',
        tags: ['cissp', 'certification', 'cybersecurity', 'security'],
        is_featured: true
    },
    {
        title: 'AWS Security Best Practices',
        description: 'Hands-on AWS security best practices guide. Learn IAM, security groups, encryption, and compliance on AWS.',
        youtube_id: 'awdQ6GjfMEA',
        location: 'Cloud Security Tutorial',
        tags: ['aws', 'security', 'cloud', 'best practices']
    },
    {
        title: 'React TypeScript Tutorial',
        description: 'Learn React with TypeScript from scratch. Build type-safe React applications with modern development practices.',
        youtube_id: 's_o8dwzRlu4',
        location: 'Frontend Tutorial',
        tags: ['react', 'typescript', 'javascript', 'frontend']
    },
    {
        title: 'Linux System Administration',
        description: 'Complete Linux system administration guide. Learn user management, file systems, networking, and server maintenance.',
        youtube_id: 'd6WC5n9G_sM',
        location: 'Linux Tutorial',
        tags: ['linux', 'administration', 'server', 'systems']
    },
    {
        title: 'Network Security Fundamentals',
        description: 'Learn network security concepts including firewalls, VPNs, intrusion detection, and secure network design.',
        youtube_id: 'tyPPfS1lwFg',
        location: 'Network Security',
        tags: ['network security', 'firewall', 'vpn', 'monitoring']
    },
    {
        title: 'Python for Cybersecurity',
        description: 'Write Python scripts for cybersecurity automation. Covers penetration testing, vulnerability scanning, and security tools.',
        youtube_id: 'cjdIIwUZsAg',
        location: 'Security Programming',
        tags: ['python', 'cybersecurity', 'automation', 'scripting']
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

// Get video duration using yt-dlp
async function getVideoDuration(youtubeId) {
    return new Promise((resolve, reject) => {
        const command = `python -m yt_dlp --get-duration --no-download "https://www.youtube.com/watch?v=${youtubeId}"`;
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error getting duration for ${youtubeId}:`, error);
                resolve(0); // Default to 0 if error
            } else {
                // Parse duration from output
                const durationMatch = stdout.match(/Duration: (\d+):(\d+):(\d+)/);
                if (durationMatch) {
                    const hours = parseInt(durationMatch[1]);
                    const minutes = parseInt(durationMatch[2]);
                    const seconds = parseInt(durationMatch[3]);
                    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
                    resolve(totalSeconds);
                } else {
                    resolve(0);
                }
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

// Save video metadata to JSON file
async function saveVideoMetadata(videoData) {
    try {
        // Create data directory if it doesn't exist
        const dataDir = path.dirname(videosDataFile);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // Read existing videos or create empty array
        let videos = [];
        if (fs.existsSync(videosDataFile)) {
            const existingData = fs.readFileSync(videosDataFile, 'utf8');
            videos = JSON.parse(existingData);
        }
        
        // Check if video already exists and update or add
        const existingIndex = videos.findIndex(v => v.title === videoData.title);
        if (existingIndex >= 0) {
            videos[existingIndex] = videoData;
        } else {
            videos.push(videoData);
        }
        
        // Sort by created_at descending
        videos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        // Write back to file
        fs.writeFileSync(videosDataFile, JSON.stringify(videos, null, 2));
        console.log(`Saved video metadata: ${videoData.title}`);
    } catch (error) {
        console.error('Error saving video metadata:', error);
        throw error;
    }
}

// Main function to download all videos
async function downloadAllVideos() {
    console.log('Starting YouTube video download process...');
    
    for (const video of youtubeVideos) {
        try {
            // Download video
            const filePath = await downloadYouTubeVideo(video.youtube_id, video.title);
            
            // Get video duration
            const duration = await getVideoDuration(video.youtube_id);
            
            // Get file size
            const fileSize = getFileSize(filePath);
            
            // Prepare video record
            const videoData = {
                ...video,
                type: 'video',
                file_path: `/videos/${path.basename(filePath)}`,
                file_size: fileSize,
                duration: duration
            };
            
            // Save metadata to JSON file
            await saveVideoMetadata(videoData);
            
            // Wait a bit between downloads to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.error(`Failed to process video ${video.title}:`, error);
        }
    }
    
    console.log('Video download process completed!');
}

// Run the script
if (require.main === module) {
    downloadAllVideos().catch(console.error);
}

module.exports = { downloadAllVideos, downloadYouTubeVideo, saveVideoMetadata };
