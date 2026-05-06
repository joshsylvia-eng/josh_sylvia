const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static(path.join(__dirname, '../public')));

app.get('/extract-frame', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Extract Video Frame</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        video, canvas { display: none; }
        .status { margin: 20px 0; padding: 10px; background: #f0f0f0; border-radius: 5px; }
        .extracted { max-width: 400px; border: 2px solid #ccc; margin: 10px 0; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <h2>Extract First Frame from Video</h2>
    <div class="status" id="status">Loading video...</div>
    
    <video id="video" crossorigin="anonymous">
        <source src="/images/Video.mov" type="video/mp4">
        Your browser does not support the video tag.
    </video>
    
    <canvas id="canvas"></canvas>
    
    <button onclick="extractFrame()">Extract First Frame</button>
    <button onclick="saveFrame()" id="saveBtn" style="display:none;">Save as Thumbnail</button>
    
    <div id="result"></div>
    
    <script>
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const status = document.getElementById('status');
        const result = document.getElementById('result');
        const saveBtn = document.getElementById('saveBtn');
        let extractedDataURL = null;
        
        video.addEventListener('loadedmetadata', function() {
            status.textContent = 'Video loaded successfully! Ready to extract frame.';
            canvas.width = 400;
            canvas.height = 220;
        });
        
        video.addEventListener('error', function(e) {
            status.textContent = 'Error loading video: ' + e.message;
            status.innerHTML += '<br>Make sure Video.mov exists in public/images/';
        });
        
        function extractFrame() {
            if (video.readyState < 2) {
                status.textContent = 'Please wait for video to load...';
                return;
            }
            
            // Seek to beginning
            video.currentTime = 0;
        }
        
        video.addEventListener('seeked', function() {
            if (video.currentTime === 0) {
                // Draw frame to canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Get the image data
                extractedDataURL = canvas.toDataURL('image/jpeg', 0.9);
                
                // Show the extracted frame
                result.innerHTML = '<h3>Extracted Frame:</h3><img src="' + extractedDataURL + '" class="extracted">';
                status.textContent = 'First frame extracted successfully!';
                saveBtn.style.display = 'inline-block';
            }
        });
        
        function saveFrame() {
            if (!extractedDataURL) {
                status.textContent = 'Please extract a frame first!';
                return;
            }
            
            // Create download link
            const link = document.createElement('a');
            link.download = 'video-frame-thumbnail.jpg';
            link.href = extractedDataURL;
            link.click();
            
            status.textContent = 'Frame downloaded! Save it as: public/images/video-frame-thumbnail.jpg';
        }
        
        // Load video
        video.load();
    </script>
</body>
</html>
    `);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Frame extractor running at http://localhost:${PORT}/extract-frame`);
    console.log('Open this URL in your browser to extract the first frame from your video.');
});
