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
    if (currentPage === 'index.html' || currentPage === '') {
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

// Load navigation when page loads
document.addEventListener('DOMContentLoaded', loadNavigation);

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (window.innerWidth <= 768 && 
        !sidebar.contains(event.target) && 
        !navToggle.contains(event.target) && 
        sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});

function openAboutModal(type, title, description, filePath, location, date, tags) {
    const modal = document.getElementById('contentModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalLocation = document.getElementById('modalLocation');
    const modalDate = document.getElementById('modalDate');
    const modalTags = document.getElementById('modalTags');
    const modalMedia = document.getElementById('modalMedia');
    const modalExternalLink = document.getElementById('modalExternalLink');
    
    // Set modal content
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${location}`;
    modalDate.innerHTML = `<i class="fas fa-calendar"></i> ${date}`;
    
    // Set tags
    modalTags.innerHTML = '';
    if (tags && tags.length > 0) {
        tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tile-tag';
            tagElement.textContent = tag;
            modalTags.appendChild(tagElement);
        });
    }
    
    // Set media content
    modalMedia.innerHTML = '';
    if (type === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.muted = false;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '500px';
        
        const source = document.createElement('source');
        source.src = filePath;
        source.type = 'video/mp4';
        
        video.appendChild(source);
        modalMedia.appendChild(video);
        
        // Show external link for videos
        modalExternalLink.style.display = 'flex';
        modalExternalLink.onclick = () => {
            window.open(filePath, '_blank');
        };
    } else {
        const img = document.createElement('img');
        img.src = filePath;
        img.alt = title;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '500px';
        modalMedia.appendChild(img);
        
        // Show external link for images
        modalExternalLink.style.display = 'flex';
        modalExternalLink.onclick = () => {
            window.open(filePath, '_blank');
        };
    }
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeAboutModal() {
    const modal = document.getElementById('contentModal');
    const modalMedia = document.getElementById('modalMedia');
    
    // Stop video if playing
    const video = modalMedia.querySelector('video');
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
    
    // Hide modal
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('contentModal');
    if (event.target === modal) {
        closeAboutModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAboutModal();
    }
});
