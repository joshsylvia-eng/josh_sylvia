// modules =================================================
var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var compression     = require('compression');
var http            = require('http');
require('dotenv').config();

// configuration ===========================================

// PostgreSQL Database Configuration
// Database connection is handled in config/database.js
var port = process.env.PORT || 8080; // set our port



// Enable gzip compression
app.use(compression());

// Parse request bodies
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// Override HTTP methods
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

// Serve static files with caching headers
app.use(express.static(__dirname + '/public', {
    maxAge: '1d', // Cache for 1 day
    etag: true,
    lastModified: true
}));

// routes ==================================================
	// Basic API routes for AI functionality
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'AI Chatbot Server is running',
    timestamp: new Date().toISOString()
  });
});


// Videos API endpoint
app.get('/api/videos', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const videosDataFile = path.join(__dirname, 'public', 'data', 'videos.json');
    
    // Read videos from JSON file
    if (fs.existsSync(videosDataFile)) {
      const videosData = fs.readFileSync(videosDataFile, 'utf8');
      const videos = JSON.parse(videosData);
      res.json(videos);
    } else {
      // Return empty array if file doesn't exist
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch videos' 
    });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { subject, message } = req.body;
    
    // Validate input
    if (!subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Subject and message are required' 
      });
    }

    // Get email from environment variables
    const recipientEmail = process.env.CONTACT_EMAIL || 'joshsylvia@yahoo.com';
    
    // For now, we'll just log the message (in a real app, you'd use nodemailer or similar)
    console.log('Contact Form Submission:');
    console.log('To:', recipientEmail);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('Timestamp:', new Date().toISOString());
    
    // In a production environment, you would send an actual email here
    // For demonstration, we'll just return success
    
    res.json({ 
      success: true, 
      message: 'Message received successfully' 
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process contact form' 
    });
  }
});

app.use(function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});


/**
 * Create HTTP server.
 */

var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('AI Chatbot Server listening on ' + bind);
}

exports = module.exports = app;						// expose app
