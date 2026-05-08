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
    const videosDataFile = path.join(__dirname, 'data', 'videos.json');
    
    let content = [];
    let videos = [];
    
    // Read videos from JSON file
    if (fs.existsSync(videosDataFile)) {
      const videosData = fs.readFileSync(videosDataFile, 'utf8');
      videos = JSON.parse(videosData);
      content = content.concat(videos);
      console.log(`Loaded ${videos.length} videos from JSON file`);
    }
    
    // Add GitHub repositories
    const githubRepos = [
      {
        title: 'Metasploit Framework',
        description: 'The world\'s most used penetration testing framework. Advanced exploitation framework for security professionals and ethical hackers.',
        youtube_id: '',
        location: 'Cybersecurity Tools',
        tags: ['cybersecurity', 'penetration testing', 'security', 'metasploit'],
        is_featured: false,
        type: 'github',
        category: 'cybersecurity',
        file_path: 'https://github.com/rapid7/metasploit-framework',
        file_size: 0,
        duration: 0,
        created_at: '2024-01-15T00:00:00Z'
      },
      {
        title: 'OSQuery',
        description: 'SQL powered operating system instrumentation and monitoring. Query your devices like a database for security monitoring and compliance.',
        youtube_id: '',
        location: 'Security Monitoring',
        tags: ['security', 'monitoring', 'siem', 'osquery'],
        is_featured: false,
        type: 'github',
        category: 'cybersecurity',
        file_path: 'https://github.com/osquery/osquery',
        file_size: 0,
        duration: 0,
        created_at: '2024-01-20T00:00:00Z'
      },
      {
        title: 'Security Tools for Developers',
        description: 'Comprehensive collection of security tools and resources for developers. Essential security utilities for modern software development.',
        youtube_id: '',
        location: 'Developer Security',
        tags: ['security', 'development', 'tools', 'devsecops'],
        is_featured: false,
        type: 'github',
        category: 'cybersecurity',
        file_path: 'https://github.com/erev0s/Security-Tools-for-Developers',
        file_size: 0,
        duration: 0,
        created_at: '2024-01-25T00:00:00Z'
      },
      {
        title: 'Terraform Provider AWS',
        description: 'Official Terraform AWS provider for infrastructure as code. Manage AWS resources with declarative configuration files.',
        youtube_id: '',
        location: 'Cloud Infrastructure',
        tags: ['aws', 'terraform', 'infrastructure', 'devops'],
        is_featured: false,
        type: 'github',
        category: 'cloud-devops',
        file_path: 'https://github.com/hashicorp/terraform-provider-aws',
        file_size: 0,
        duration: 0,
        created_at: '2024-02-01T00:00:00Z'
      },
      {
        title: 'Kubernetes',
        description: 'Production-grade container orchestration platform. Automate deployment, scaling, and management of containerized applications.',
        youtube_id: '',
        location: 'Container Orchestration',
        tags: ['kubernetes', 'containers', 'orchestration', 'devops'],
        is_featured: false,
        type: 'github',
        category: 'cloud-devops',
        file_path: 'https://github.com/kubernetes/kubernetes',
        file_size: 0,
        duration: 0,
        created_at: '2024-02-05T00:00:00Z'
      },
      {
        title: 'Next.js',
        description: 'The React framework for production. Full-stack React framework with server-side rendering, routing, and more.',
        youtube_id: '',
        location: 'Frontend Framework',
        tags: ['react', 'nextjs', 'frontend', 'javascript'],
        is_featured: false,
        type: 'github',
        category: 'fullstack',
        file_path: 'https://github.com/vercel/next.js',
        file_size: 0,
        duration: 0,
        created_at: '2024-02-10T00:00:00Z'
      },
      {
        title: 'Express.js',
        description: 'Fast, unopinionated web framework for Node.js. Minimal and flexible Node.js web application framework.',
        youtube_id: '',
        location: 'Backend Framework',
        tags: ['nodejs', 'express', 'backend', 'api'],
        is_featured: false,
        type: 'github',
        category: 'fullstack',
        file_path: 'https://github.com/expressjs/express',
        file_size: 0,
        duration: 0,
        created_at: '2024-02-15T00:00:00Z'
      },
      {
        title: 'LangChain',
        description: 'Building applications with LLMs through composability. Framework for developing applications powered by large language models.',
        youtube_id: '',
        location: 'AI & LLM Framework',
        tags: ['ai', 'llm', 'langchain', 'machine learning'],
        is_featured: false,
        type: 'github',
        category: 'ai-rag',
        file_path: 'https://github.com/langchain-ai/langchain',
        file_size: 0,
        duration: 0,
        created_at: '2024-02-20T00:00:00Z'
      }
    ];
    
    content = content.concat(githubRepos);
    console.log(`Serving ${content.length} total items (${videos.length} videos + ${githubRepos.length} GitHub repos)`);
    res.json(content);
    
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch content' 
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
