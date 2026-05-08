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

// Set active navigation link based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    // Remove active classes
    navLinks.forEach(link => link.classList.remove('active'));
    sidebarLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to current page links
    if (currentPage === 'tutorials.html') {
        document.querySelector('.nav-link[href="tutorials.html"]')?.classList.add('active');
        document.querySelector('.sidebar-link[href="tutorials.html"]')?.classList.add('active');
    } else if (currentPage === 'index.html' || currentPage === '') {
        document.querySelector('.nav-link[href="index.html"]')?.classList.add('active');
        document.querySelector('.sidebar-link[href="index.html"]')?.classList.add('active');
    } else if (currentPage === 'about.html') {
        document.querySelector('.nav-link[href="about.html"]')?.classList.add('active');
        document.querySelector('.sidebar-link[href="about.html"]')?.classList.add('active');
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
document.addEventListener('DOMContentLoaded', function() {
    console.log('DEBUG: DOM Content Loaded');
    loadNavigation();
    loadContent();
});

// Modal functions - defined globally for accessibility
function openModal(type, title, description, filePath, location, date, tags) {
    console.log('=== DEBUG: openModal called ===');
    console.log('Type:', type);
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('File Path:', filePath);
    console.log('Location:', location);
    console.log('Date:', date);
    console.log('Tags:', tags);
    
    const modal = document.getElementById('contentModal');
    if (!modal) {
        console.error('Modal element not found');
        return;
    }
    
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalLocation = document.getElementById('modalLocation');
    const modalDate = document.getElementById('modalDate');
    const modalTags = document.getElementById('modalTags');
    const modalMedia = document.getElementById('modalMedia');
    const modalExternalLink = document.getElementById('modalExternalLink');
    
    // Set modal content
    console.log('DEBUG: Setting modal content');
    console.log('modalTitle element:', modalTitle);
    console.log('modalLocation element:', modalLocation);
    console.log('modalDate element:', modalDate);
    console.log('modalTags element:', modalTags);
    console.log('modalMedia element:', modalMedia);
    console.log('modalExternalLink element:', modalExternalLink);
    
    try {
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalLocation.textContent = location;
        modalTags.innerHTML = '';
        
        // Add tags
        if (tags && tags.length > 0) {
            tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'modal-tag';
                tagElement.textContent = tag;
                modalTags.appendChild(tagElement);
            });
        }
    } catch (error) {
        console.error('DEBUG: Error setting modal content:', error);
    }
    
    // Set media content
    modalMedia.innerHTML = '';
    if (type === 'video') {
        console.log('DEBUG: Creating video modal');
        // Create webcard container for better mobile viewing
        const webcardContainer = document.createElement('div');
        webcardContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-width: 100%;
        `;
        
        // Create video element
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.muted = false;
        video.style.cssText = `
            width: 100%;
            max-height: 400px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        
        const source = document.createElement('source');
        source.src = filePath;
        source.type = 'video/mp4';
        
        console.log('DEBUG: Video source src:', source.src);
        console.log('DEBUG: Appending source to video');
        
        video.appendChild(source);
        webcardContainer.appendChild(video);
        modalMedia.appendChild(webcardContainer);
        
        console.log('DEBUG: Video webcard appended to modalMedia');
        
        // Show external link for videos
        modalExternalLink.style.display = 'flex';
        modalExternalLink.onclick = () => {
            console.log('DEBUG: Opening external video link:', filePath);
            window.open(filePath, '_blank');
        };
    } else if (type === 'github') {
        console.log('DEBUG: Creating GitHub modal');
        // Create iframe for GitHub repository
        const iframe = document.createElement('iframe');
        iframe.src = filePath;
        iframe.style.cssText = `
            width: 100%;
            height: 600px;
            border-radius: 8px;
            border: none;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        
        console.log('DEBUG: GitHub iframe src:', iframe.src);
        
        modalMedia.appendChild(iframe);
        
        console.log('DEBUG: GitHub iframe appended to modalMedia');
        
        // Show external link for GitHub repos
        modalExternalLink.style.display = 'flex';
        modalExternalLink.onclick = () => {
            console.log('DEBUG: Opening GitHub link:', filePath);
            window.open(filePath, '_blank');
        };
    } else {
        console.log('DEBUG: Creating image modal');
        // Create webcard container for images
        const webcardContainer = document.createElement('div');
        webcardContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-width: 100%;
        `;
        
        const img = document.createElement('img');
        img.src = filePath;
        img.alt = title;
        img.style.cssText = `
            width: 100%;
            max-height: 400px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            object-fit: cover;
        `;
        
        console.log('DEBUG: Image src:', img.src);
        
        webcardContainer.appendChild(img);
        modalMedia.appendChild(webcardContainer);
        
        console.log('DEBUG: Image webcard appended to modalMedia');
        
        // Show external link for images
        modalExternalLink.style.display = 'flex';
        modalExternalLink.onclick = () => {
            console.log('DEBUG: Opening external image link:', filePath);
            window.open(filePath, '_blank');
        };
    }
    
    // Show modal
    modal.style.display = 'block';
    modal.style.zIndex = '9999'; // Ensure modal is on top
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    console.log('Modal displayed with content for:', title);
}

function closeModal() {
    console.log('=== DEBUG: closeModal called ===');
    const modal = document.getElementById('contentModal');
    const modalMedia = document.getElementById('modalMedia');
    
    console.log('DEBUG: modal element:', modal);
    console.log('DEBUG: modalMedia element:', modalMedia);
    
    // Stop video if playing
    const video = modalMedia.querySelector('video');
    if (video) {
        console.log('DEBUG: Found video element, pausing');
        video.pause();
        video.currentTime = 0;
    }
    
    // Hide modal
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
    console.log('DEBUG: Modal hidden');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('contentModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Tab functionality
async function openTab(event, tabName) {
    // Remove active class from all tabs
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked tab
    event.currentTarget.classList.add('active');
    
    try {
        // Fetch videos from API
        const response = await fetch('/api/videos');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const videos = await response.json();
        
        // Convert videos to the expected format
        const content = videos.map(video => ({
            type: 'video',
            title: video.title,
            description: video.description,
            file_path: video.file_path,
            location: video.location,
            tags: video.tags || [],
            created_at: video.created_at || new Date().toISOString()
        }));
        
        let filteredContent = content;
        
        if (tabName === 'videos') {
            filteredContent = content.filter(item => item.type === 'video');
        } else if (tabName === 'github') {
            filteredContent = content.filter(item => item.type === 'github');
        } else if (tabName === 'playground') {
            filteredContent = content.filter(item => item.type === 'playground');
        }
        // 'all' shows everything
        
        renderContentGrid(filteredContent);
        
        // Add hover video effects after content is rendered
        setTimeout(() => addVideoHoverEffects(), 100);
    } catch (error) {
        console.error('DEBUG: Error fetching videos for tab:', error);
        // Fallback to sample content if API fails
        const content = getSampleContent();
        let filteredContent = content;
        
        if (tabName === 'videos') {
            filteredContent = content.filter(item => item.type === 'video');
        } else if (tabName === 'github') {
            filteredContent = content.filter(item => item.type === 'github');
        } else if (tabName === 'playground') {
            filteredContent = content.filter(item => item.type === 'playground');
        }
        
        renderContentGrid(filteredContent);
        setTimeout(() => addVideoHoverEffects(), 100);
    }
}

async function loadContent() {
    console.log('=== DEBUG: loadContent called ===');
    const contentGrid = document.getElementById('content-grid');
    
    try {
        // Fetch videos from API
        const response = await fetch('/api/videos');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const videos = await response.json();
        console.log('DEBUG: Fetched videos from API:', videos);
        
        // Convert videos to the expected format and show all content by default
        const content = videos.map(video => ({
            type: 'video',
            title: video.title,
            description: video.description,
            file_path: video.file_path,
            location: video.location,
            tags: video.tags || [],
            created_at: video.created_at || new Date().toISOString()
        }));
        
        renderContentGrid(content);
        
        // Add hover video effects after content is rendered
        setTimeout(() => addVideoHoverEffects(), 100);
    } catch (error) {
        console.error('DEBUG: Error fetching videos from API:', error);
        // Fallback to sample content if API fails
        const content = getSampleContent();
        console.log('DEBUG: Using fallback sample content:', content);
        renderContentGrid(content);
        setTimeout(() => addVideoHoverEffects(), 100);
    }
}

function getSampleContent() {
    return [
        {
            type: 'video',
            title: 'Python Tutorial',
            description: 'Learn Python programming from basics to advanced concepts with hands-on examples.',
            file_path: '/videos/python_tutorial.mp4',
            location: 'Programming Tutorial',
            tags: ['python', 'programming', 'development'],
            created_at: new Date().toISOString()
        },
        {
            type: 'video',
            title: 'JavaScript Tutorial',
            description: 'Complete JavaScript tutorial covering ES6+ features and modern development practices.',
            file_path: '/videos/javascript_tutorial.mp4',
            location: 'Web Development Tutorial',
            tags: ['javascript', 'web development', 'es6'],
            created_at: new Date(Date.now() - 86400000).toISOString()
        }
    ];
}

function renderContentGrid(content) {
    console.log('DEBUG: Rendering content grid with content:', content);
    const contentGrid = document.getElementById('content-grid');
    
    if (!contentGrid) {
        console.error('DEBUG: content-grid element not found');
        return;
    }
    
    if (content.length === 0) {
        console.log('DEBUG: No content to display');
        contentGrid.innerHTML = `
            <div class="error-grid">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>No content available</h3>
                <p>Please check back later for new tutorials.</p>
            </div>
        `;
        return;
    }
    
    console.log('DEBUG: Creating', content.length, 'tiles');
    const tilesHTML = content.map(item => createTile(item)).join('');
    contentGrid.innerHTML = tilesHTML;
    console.log('DEBUG: Tiles rendered, adding hover functionality');
    
    // Add hover-to-play functionality after rendering
    addVideoHoverEffects();
    
    // Add click event listener to content grid
    if (contentGrid) {
        contentGrid.addEventListener('click', function(event) {
            const tile = event.target.closest('.tile');
            if (tile) {
                console.log('DEBUG: Tile clicked via event delegation');
                const dataVideoUrl = tile.getAttribute('data-video-url');
                const dataTitle = tile.querySelector('.tile-title')?.textContent;
                const dataDescription = tile.querySelector('.tile-description')?.textContent;
                const dataLocation = tile.querySelector('.tile-meta span:first-child')?.textContent;
                const dataDate = tile.querySelector('.tile-meta span:last-child')?.textContent;
                const dataTags = Array.from(tile.querySelectorAll('.tile-tag')).map(tag => tag.textContent);
                
                if (dataVideoUrl && dataTitle && dataDescription && dataLocation && dataDate) {
                    openModal('video', dataTitle, dataDescription, dataVideoUrl, dataLocation, dataDate, dataTags);
                }
            }
        });
    }
}

function createTile(item) {
    return `
        <div class="tile" 
             onclick="openModal('${item.type}', '${item.title}', '${item.description}', '${item.file_path}', '${item.location}', '${item.created_at}', ${JSON.stringify(item.tags || [])})"
             data-video-url="${item.file_path}">
            <div class="tile-video">
                <video src="${item.file_path}" alt="${item.title}" class="video-thumbnail" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    pointer-events: none;
                "></video>
            </div>
            <div class="tile-content">
                <h3 class="tile-title">${item.title}</h3>
                <p class="tile-description">${item.description}</p>
                <div class="tile-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${item.location}</span>
                    <span><i class="fas fa-calendar"></i> ${item.created_at}</span>
                </div>
                ${item.tags && item.tags.length > 0 ? `
                    <div class="tile-tags">
                        ${item.tags.map(tag => `<span class="tile-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Add hover video functionality to tiles
function addVideoHoverEffects() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        const videoElement = tile.querySelector('.tile-video');
        const imgElement = tile.querySelector('.video-thumbnail');
        
        if (videoElement && imgElement) {
            // Create video element for hover preview
            const video = document.createElement('video');
            video.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: none;
                z-index: 10;
            `;
            video.muted = true;
            video.loop = true;
            
            // Add video to tile
            videoElement.appendChild(video);
            
            // Get video URL from data attribute
            const videoUrl = tile.getAttribute('data-video-url');
            
            if (videoUrl) {
                if (videoUrl.includes('youtube.com/embed/')) {
                    // Extract YouTube video ID and create direct video URL
                    const youtubeId = videoUrl.split('/embed/')[1].split('?')[0];
                    video.src = `https://www.youtube.com/watch?v=${youtubeId}`;
                } else if (videoUrl.startsWith('/videos/')) {
                    // Use local video file
                    video.src = videoUrl;
                }
            }
            
            // Hover events
            tile.addEventListener('mouseenter', () => {
                if (video.src) {
                    imgElement.style.display = 'none';
                    video.style.display = 'block';
                    video.play().catch(e => console.log('Autoplay prevented:', e));
                }
            });
            
            tile.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
                video.style.display = 'none';
                imgElement.style.display = 'block';
            });
        }
    });
}

// Load content when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DEBUG: DOM Content Loaded');
    loadNavigation();
    loadContent();
});
