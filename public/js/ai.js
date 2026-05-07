// Handle Enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// RAG Knowledge Base for Josh Sylvia's Expertise
const knowledgeBase = {
    cybersecurity: [
        {
            title: "Network Security Fundamentals",
            content: "Josh Sylvia specializes in network security architecture, including firewall configuration, intrusion detection systems, and zero-trust security models. Expert in implementing comprehensive security frameworks for enterprise environments.",
            keywords: ["network", "security", "firewall", "intrusion", "zero-trust"]
        },
        {
            title: "Cloud Security Best Practices",
            content: "Extensive experience in securing cloud infrastructure across AWS, Azure, and GCP. Implements cloud-native security solutions, identity and access management, and compliance frameworks like SOC 2 and ISO 27001.",
            keywords: ["cloud", "aws", "azure", "gcp", "compliance", "soc2", "iso27001"]
        },
        {
            title: "Penetration Testing",
            content: "Certified penetration tester with expertise in identifying vulnerabilities in web applications, mobile apps, and network infrastructure. Proficient in using tools like Burp Suite, Metasploit, and custom security assessment methodologies.",
            keywords: ["penetration", "testing", "vulnerability", "burp", "metasploit"]
        }
    ],
    cloud: [
        {
            title: "Cloud Architecture Design",
            content: "Designs scalable, resilient cloud architectures using microservices, containerization, and serverless computing. Expert in AWS services including EC2, Lambda, RDS, and infrastructure as code with Terraform.",
            keywords: ["architecture", "microservices", "containers", "serverless", "aws", "terraform"]
        },
        {
            title: "DevOps Pipeline Implementation",
            content: "Builds comprehensive CI/CD pipelines using Jenkins, GitLab CI, and GitHub Actions. Implements automated testing, deployment strategies, and monitoring solutions for cloud-native applications.",
            keywords: ["devops", "cicd", "jenkins", "gitlab", "automation", "monitoring"]
        },
        {
            title: "Kubernetes and Container Orchestration",
            content: "Expert in Kubernetes deployment, management, and optimization. Designs container orchestration strategies for high-availability applications and implements service mesh architectures.",
            keywords: ["kubernetes", "containers", "orchestration", "docker", "service-mesh"]
        }
    ],
    devops: [
        {
            title: "Infrastructure as Code",
            content: "Specializes in IaC using Terraform, CloudFormation, and Ansible. Creates reusable infrastructure templates and implements GitOps workflows for infrastructure management.",
            keywords: ["iac", "terraform", "cloudformation", "ansible", "gitops"]
        },
        {
            title: "Monitoring and Observability",
            content: "Implements comprehensive monitoring solutions using Prometheus, Grafana, and ELK stack. Designs alerting strategies and creates dashboards for system health and performance metrics.",
            keywords: ["monitoring", "observability", "prometheus", "grafana", "elk", "metrics"]
        },
        {
            title: "Automation Scripting",
            content: "Proficient in Python, Bash, and PowerShell for automation tasks. Creates custom scripts for deployment, monitoring, and maintenance of complex infrastructure.",
            keywords: ["automation", "python", "bash", "powershell", "scripting"]
        }
    ],
    ai: [
        {
            title: "Machine Learning Engineering",
            content: "Builds and deploys machine learning models using TensorFlow, PyTorch, and scikit-learn. Expert in model optimization, deployment pipelines, and MLOps practices for production ML systems.",
            keywords: ["machine learning", "tensorflow", "pytorch", "mlops", "deployment"]
        },
        {
            title: "Natural Language Processing",
            content: "Develops NLP solutions using transformers, BERT, and GPT models. Implements text classification, sentiment analysis, and custom language models for business applications.",
            keywords: ["nlp", "transformers", "bert", "gpt", "text", "classification"]
        },
        {
            title: "AI System Architecture",
            content: "Designs scalable AI systems with focus on performance, reliability, and cost optimization. Expert in distributed computing, model serving, and AI infrastructure management.",
            keywords: ["ai architecture", "distributed", "serving", "infrastructure", "optimization"]
        }
    ]
};

// Document Retrieval Function
function retrieveRelevantDocs(userQuery) {
    const query = userQuery.toLowerCase();
    const relevantDocs = [];
    
    // Search through all categories
    Object.values(knowledgeBase).forEach(category => {
        category.forEach(doc => {
            let relevanceScore = 0;
            
            // Calculate relevance based on keyword matches
            doc.keywords.forEach(keyword => {
                if (query.includes(keyword.toLowerCase())) {
                    relevanceScore += 2;
                }
            });
            
            // Check content matches
            doc.content.toLowerCase().split(' ').forEach(word => {
                if (query.includes(word) && word.length > 3) {
                    relevanceScore += 1;
                }
            });
            
            if (relevanceScore > 0) {
                relevantDocs.push({
                    ...doc,
                    relevanceScore
                });
            }
        });
    });
    
    // Sort by relevance and return top 2-3 documents
    return relevantDocs
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 3);
}

// Connect to Groq LLM using OpenAI client approach
async function getLLMResponse(userMessage) {
    try {
        // Check if OpenAI library is loaded
        if (typeof OpenAI === 'undefined') {
            return "I'm experiencing technical difficulties with the AI library, but I'm here to help with your technology questions! As Josh Sylvia's AI assistant, I bring expertise in cybersecurity, cloud architecture, and AI development to solve your technical challenges.";
        }

        // RAG: Retrieve relevant documents
        const relevantDocs = retrieveRelevantDocs(userMessage);
        
        // Build context-aware system prompt
        let contextInfo = '';
        if (relevantDocs.length > 0) {
            contextInfo = '\n\nRELEVANT EXPERTISE CONTEXT:\n';
            relevantDocs.forEach((doc, index) => {
                contextInfo += `\n${index + 1}. ${doc.title}: ${doc.content}\n`;
            });
            contextInfo += '\nUse this context to provide specific, detailed responses about Josh Sylvia\'s expertise.';
        }
        
        // Check for API key in environment variables or prompt user
        const apiKey = process.env.GROQ_API_KEY || 
                       prompt('Please enter your Groq API key:', '') ||
                       'demo-key';
        
        if (!apiKey || apiKey === 'demo-key') {
            return "I'm currently in demo mode. To use the full AI capabilities, please configure your Groq API key. As Josh Sylvia's AI assistant, I bring expertise in cybersecurity, cloud architecture, and AI development to solve your technical challenges.";
        }
        
        const client = new OpenAI({
            apiKey: apiKey,
            baseURL: 'https://api.groq.com/openai/v1',
            dangerouslyAllowBrowser: true
        });

        const response = await client.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                {
                    role: 'system',
                    content: `You are Josh Sylvia, an expert AI assistant specializing in cybersecurity, cloud architecture, DevOps automation, and AI development. You have extensive experience in machine learning, natural language processing, and building intelligent systems that solve complex technical problems.${contextInfo}

Provide helpful, accurate responses about technology questions, emphasizing your expertise in these areas. When relevant, reference specific projects, technologies, or methodologies from your experience. Be detailed and practical in your responses.`
                },
                {
                    role: 'user',
                    content: userMessage
                }
            ],
            max_tokens: 1000,
            temperature: 0.7
        });

        return response.choices[0].message.content;

    } catch (error) {
        console.error('Error calling Groq API:', error);
        return "I apologize, but I'm experiencing technical difficulties with the AI service. As Josh Sylvia's AI assistant, I can still help with general questions about cybersecurity, cloud architecture, and AI development based on my training. Please try again later for more specific assistance.";
    }
}

// Chat functionality
function sendMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    console.log('Sending message:', input.value);
    if (input.value.trim() === '') return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.style.cssText = 'margin-bottom: 15px; padding: 12px; background: #4A90E2; border-radius: 10px; color: #ffffff;';
    userMessage.innerHTML = `<strong>You:</strong> ${input.value}`;
    messages.appendChild(userMessage);
    
    // Get AI response from LLM
    setTimeout(async () => {
        // Show thinking indicator
        const aiMessage = document.createElement('div');
        aiMessage.style.cssText = 'margin-bottom: 15px; padding: 12px; background: #87CEEB; border-radius: 10px; color: #ffffff;';
        aiMessage.innerHTML = '<strong>AI Assistant:</strong> <em>(thinking...)</em>';
        messages.appendChild(aiMessage);
        messages.scrollTop = messages.scrollHeight;
        
        console.log('Waiting for LLM response...');
        const llmResponse = await getLLMResponse(input.value);
        console.log('LLM response received:', llmResponse);
        
        // Update with actual response
        setTimeout(() => {
            aiMessage.innerHTML = `<strong>AI Assistant:</strong> ${llmResponse}`;
            messages.scrollTop = messages.scrollHeight;
        }, 1500); // Show thinking for 1.5 seconds
    }, 1000);
    
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
}

// Load shared navigation component
async function loadNavigation() {
    try {
        const response = await fetch('components/navigation.html');
        const navigationHTML = await response.text();
        document.getElementById('navigation-container').innerHTML = navigationHTML;
        
        // Set active page based on current URL
        setActiveNavigation();
    } catch (error) {
        console.error('Error loading navigation:', error);
    }
}

// Initialize OpenAI library when page loads
document.addEventListener('DOMContentLoaded', async function() {
    console.log('OpenAI library loading...');
    if (typeof OpenAI !== 'undefined') {
        console.log('OpenAI library loaded successfully');
    } else {
        console.error('OpenAI library not loaded - waiting for library...');
        // Retry after delay
        setTimeout(() => {
            if (typeof OpenAI !== 'undefined') {
                console.log('OpenAI library loaded after retry');
            } else {
                console.error('OpenAI library still not available');
            }
        }, 2000);
    }
});

// Set active navigation link based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    // Remove active classes
    navLinks.forEach(link => link.classList.remove('active'));
    sidebarLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to current page links
    if (currentPage === 'ai.html' || currentPage === '') {
        document.querySelector('.nav-link[href="ai.html"]')?.classList.add('active');
        document.querySelector('.sidebar-link[href="ai.html"]')?.classList.add('active');
    } else if (currentPage === 'about.html') {
        document.querySelector('.nav-link[href="about.html"]')?.classList.add('active');
        document.querySelector('.sidebar-link[href="about.html"]')?.classList.add('active');
    } else if (currentPage === 'tutorials.html') {
        document.querySelector('.nav-link[href="tutorials.html"]')?.classList.add('active');
        document.querySelector('.sidebar-link[href="tutorials.html"]')?.classList.add('active');
    } else if (currentPage === 'contact.html') {
        document.querySelector('.nav-link[href="contact.html"]')?.classList.add('active');
        document.querySelector('.sidebar-link[href="contact.html"]')?.classList.add('active');
    }
}

// Add toggleSidebar function for mobile menu
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (window.innerWidth <= 768 && 
        sidebar && 
        !sidebar.contains(event.target) && 
        !navToggle.contains(event.target) && 
        sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});

// Load navigation when page loads
document.addEventListener('DOMContentLoaded', loadNavigation);
