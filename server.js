// modules =================================================
var express         = require('express');
var app             = express();
var debug           = require('debug');
var http            = require('http');
const db            = require('./config/database');
// bodyParser is now built into Express 5.x
var methodOverride  = require('method-override');
var busboy          = require('connect-busboy');

// configuration ===========================================

// PostgreSQL Database Configuration
// Database connection is handled in config/database.js
var port = process.env.PORT || 8080; // set our port



app.use(busboy());
app.use(express.json()); // parse application/json
app.use(express.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
	// server routes ===========================================================
	// handle things like api calls
	// authentication routes
//app.use('/api', require('./app/ApiController'));

// Test database endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ 
      success: true, 
      message: 'Database connected successfully',
      timestamp: result.rows[0].now
    });
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: err.message 
    });
  }
});

// Video API endpoints
const Video = require('./models/Video');

// Get all videos
app.get('/api/videos', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const videos = await Video.findAll(limit, offset);
    res.json({ success: true, data: videos });
  } catch (err) {
    console.error('Get videos error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get featured video
app.get('/api/videos/featured', async (req, res) => {
  try {
    const video = await Video.findFeatured();
    if (!video) {
      return res.json({ success: true, data: null });
    }
    res.json({ success: true, data: video });
  } catch (err) {
    console.error('Get featured video error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get video by ID
app.get('/api/videos/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }
    res.json({ success: true, data: video });
  } catch (err) {
    console.error('Get video error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create new video
app.post('/api/videos', async (req, res) => {
  try {
    const videoData = req.body;
    const video = await Video.create(videoData);
    res.status(201).json({ success: true, data: video });
  } catch (err) {
    console.error('Create video error:', err);
    res.status(500).json({ success: false, error: err.message });
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
var io = require('socket.io')(server);
/**
 * Listen on provided port, on all network interfaces.
 */

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
  debug('Listening on ' + bind);
}

var publicMessageSocket = require('./app/socket/PublicMessageSocket');


io.on('connection', function(socket) {
   console.log("websocket connection build");
   publicMessageSocket.publicMessage(socket);
});

exports = module.exports = app; 						// expose app
