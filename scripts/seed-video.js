const Video = require('../models/Video');
const db = require('../config/database');

async function seedVideo() {
  try {
    // First, create the videos table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_path VARCHAR(500) NOT NULL,
        file_size BIGINT,
        duration INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        location VARCHAR(255),
        tags TEXT[],
        is_featured BOOLEAN DEFAULT FALSE
      )
    `);

    // Create indexes
    await db.query('CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(is_featured)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at)');

    // Check if video already exists
    const existingVideo = await Video.findAll(1, 0);
    if (existingVideo.length > 0) {
      console.log('Video already exists in database');
      return;
    }

    // Insert the video data
    const videoData = {
      title: 'Home Built Basement',
      description: 'Had a wonderful basement that has beautiful flooring and lighting. Complete with kitchen and bathroom.',
      file_path: '/images/Video.mov',
      file_size: null, // We'll update this later if needed
      duration: null, // We'll update this later if needed
      location: 'Home',
      tags: ['basement', 'renovation', 'home', 'kitchen', 'bathroom'],
      is_featured: true
    };

    const video = await Video.create(videoData);
    console.log('Video created successfully:', video);
    
  } catch (error) {
    console.error('Error seeding video:', error);
  } finally {
    process.exit(0);
  }
}

seedVideo();
