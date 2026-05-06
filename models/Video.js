const db = require('../config/database');

class Video {
  static async create(videoData) {
    const {
      title,
      description,
      file_path,
      file_size,
      duration,
      location,
      tags,
      is_featured = false
    } = videoData;

    const query = `
      INSERT INTO videos (title, description, file_path, file_size, duration, location, tags, is_featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      title,
      description,
      file_path,
      file_size,
      duration,
      location,
      tags,
      is_featured
    ];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create video: ${error.message}`);
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM videos WHERE id = $1';
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to find video: ${error.message}`);
    }
  }

  static async findAll(limit = 10, offset = 0) {
    const query = `
      SELECT * FROM videos 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    
    try {
      const result = await db.query(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get videos: ${error.message}`);
    }
  }

  static async findFeatured() {
    const query = `
      SELECT * FROM videos 
      WHERE is_featured = true 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    try {
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to get featured video: ${error.message}`);
    }
  }

  static async update(id, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `
      UPDATE videos 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;

    try {
      const result = await db.query(query, [id, ...values]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update video: ${error.message}`);
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM videos WHERE id = $1 RETURNING *';
    
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to delete video: ${error.message}`);
    }
  }
}

module.exports = Video;
