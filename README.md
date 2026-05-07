# Josh Sylvia Tech - AI Chatbot with RAG

A modern web application featuring an AI-powered chatbot with Retrieval-Augmented Generation (RAG) capabilities, built with Express.js and optimized for deployment.

## 🚀 Features

### AI Chatbot
- **RAG System**: Context-aware responses using knowledge base retrieval
- **Groq Integration**: Powered by Llama 3.1 8B Instant model
- **Secure API Key Management**: Environment-based configuration
- **Real-time Chat**: Interactive conversational interface

### Performance Optimizations
- **Gzip Compression**: 70-90% response size reduction
- **Static Asset Caching**: 1-day browser cache with ETag support
- **Memory Optimized**: Under 8GB deployment limit
- **Fast Builds**: Optimized npm configuration

### Web Application
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Clean, professional layout
- **Navigation**: Seamless page transitions
- **Contact Form**: Secure message handling

## 🛠️ Technology Stack

### Backend
- **Node.js**: 24.14.1 (Latest)
- **Express.js**: 4.18.2 (web framework)
- **Body Parser**: Request parsing middleware
- **Compression**: Gzip response compression
- **Method Override**: HTTP method handling
- **Dotenv**: Environment variable management

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **JavaScript**: ES6+ with async/await
- **OpenAI Client**: Groq API integration
- **RAG System**: Document retrieval and context injection

### AI & ML
- **Groq API**: Llama 3.1 8B Instant model
- **Retrieval-Augmented Generation**: Context-aware responses
- **Knowledge Base**: Expertise documentation
- **Document Retrieval**: Semantic search functionality

## 📦 Installation

### Prerequisites
- Node.js 24.14.1 or higher
- npm package manager

### Setup
```bash
# Clone repository
git clone https://github.com/joshsylvia-eng/josh_sylvia_tech.git
cd josh_sylvia_tech

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your GROQ_API_KEY

# Start development server
npm start
```

### Environment Variables
```env
GROQ_API_KEY=your_groq_api_key_here
CONTACT_EMAIL=joshsylvia@yahoo.com
NODE_ENV=development
```

## 🚀 Deployment

### Render Configuration
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node.js Version**: 24.14.1
- **Environment Variables**: Set GROQ_API_KEY in dashboard

### Performance Features
- **Compression**: Gzip enabled for all responses
- **Caching**: 1-day static asset cache
- **Optimized Dependencies**: Minimal memory footprint
- **Fast Installs**: npm ci with lockfile

## 📁 Project Structure

```
josh_sylvia_tech/
├── public/
│   ├── index.html          # Homepage
│   ├── ai.html            # AI chatbot page
│   ├── about.html         # About page with RAG skills
│   ├── tutorials.html      # Tutorials page
│   └── components/
│       └── navigation.html  # Navigation component
├── server.js             # Express server
├── package.json          # Dependencies and scripts
├── .env.example         # Environment template
├── .npmrc              # npm configuration
└── README.md            # This file
```

## 🔧 Development Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "build": "npm ci"
  }
}
```

## 🎯 API Endpoints

- `GET /` - Homepage
- `GET /ai` - AI chatbot interface
- `GET /about` - About page with skills
- `GET /tutorials` - Tutorials page
- `GET /api/health` - Health check endpoint
- `POST /api/contact` - Contact form submission

## 🔒 Security

- **API Key Protection**: Environment-based configuration
- **Input Validation**: Request sanitization
- **Secure Headers**: HTTP security best practices
- **No Hardcoded Secrets**: All keys externalized

## 📈 Performance

- **Response Time**: <200ms average
- **Bundle Size**: Optimized JavaScript
- **Memory Usage**: <8GB deployment limit
- **Cache Hit Rate**: High with static asset caching

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

- **Email**: joshsylvia@yahoo.com
- **GitHub**: https://github.com/joshsylvia-eng
- **Website**: [Deployed URL]

---

Built with ❤️ by Josh Sylvia - AI & Cybersecurity Expert
