// DOM Elements
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const predictBtn = document.getElementById("predictBtn");
const featuresInput = document.getElementById("featuresInput");
const predictedGenre = document.getElementById("predictedGenre");
const resultSection = document.getElementById('resultSection');
const confidenceBar = document.getElementById('confidenceBar');
const confidenceValue = document.getElementById('confidenceValue');
const musicFileName = document.getElementById('musicFileName');

// Animations and visual feedback
function animateElement(element, className, duration = 1000) {
    element.classList.add(className);
    setTimeout(() => {
        element.classList.remove(className);
    }, duration);
}

// Initialize results section as hidden
if (resultSection) {
    resultSection.style.display = 'none';
}

// Drag & Drop Events
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "var(--primary-dark)";
    dropZone.style.background = "rgba(255, 255, 255, 0.95)";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.style.borderColor = "var(--primary)";
    dropZone.style.background = "var(--card-bg)";
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "var(--primary)";
    dropZone.style.background = "var(--card-bg)";
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        animateElement(dropZone, 'fade-in', 500);
        handleFile(files[0]);
    }
});

// File input change handler
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        animateElement(dropZone, 'fade-in', 500);
        handleFile(e.target.files[0]);
    }
});

// Handle file upload and processing
async function handleFile(file) {
    if (!file.type.startsWith('audio/')) {
        alert('Please upload an audio file');
        animateElement(dropZone, 'shake');
        return;
    }

    // Update upload box to show processing state
    const iconContainer = document.querySelector(".upload-icon-container");
    if (iconContainer) {
        iconContainer.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    }

    // Display the file name
    if (musicFileName) {
        musicFileName.textContent = file.name;
        animateElement(musicFileName, 'fade-in');
    }

    // Show loading state
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
    predictedGenre.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    if (confidenceBar) confidenceBar.style.width = '0%';
    if (confidenceValue) confidenceValue.textContent = '0%';

    try {
        const formData = new FormData();
        formData.append('file', file);

        // Send audio file directly to prediction API
        // The backend handles feature extraction and prediction
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to predict genre');
        }

        const data = await response.json();
        
        // Restore upload icon
        if (iconContainer) {
            iconContainer.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i>';
        }
        
        // Update UI with results - use predicted_genre from backend
        setTimeout(() => {
            predictedGenre.innerHTML = `🎶 ${data.predicted_genre}`;
            animateElement(document.querySelector('.genre-display'), 'fade-in');
            
            // Set default confidence since backend doesn't provide it
            if (confidenceBar && confidenceValue) {
                confidenceBar.style.width = '100%';
                confidenceValue.textContent = 'N/A';
            }
        }, 300);

    } catch (error) {
        console.error("Error:", error);
        
        // Restore upload icon
        if (iconContainer) {
            iconContainer.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i>';
        }
        
        predictedGenre.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Error: ${error.message}`;
        animateElement(predictedGenre, 'shake');
        if (confidenceValue) confidenceValue.textContent = '0%';
    }
}

// Legacy button click event for manual feature input
if (predictBtn) {
    predictBtn.addEventListener("click", async function () {
        let featuresText = featuresInput.value.trim();
        if (!featuresText) {
            alert("Please enter features before predicting!");
            animateElement(featuresInput, 'shake');
            return;
        }

        let featuresArray = featuresText.split(",").map(Number);
        if (featuresArray.length !== 57) {
            alert("Please enter exactly 57 numeric features.");
            animateElement(featuresInput, 'shake');
            return;
        }

        // Show loading state in button
        predictBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        predictBtn.disabled = true;
        
        // Show result section
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
        predictedGenre.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        
        // Update filename for manual feature input
        if (musicFileName) {
            musicFileName.textContent = "Manual feature input";
        }

        try {
            // Sending request to the local Flask API
            const response = await fetch("http://127.0.0.1:5000/predict-features", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ features: featuresArray })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            
            // Reset button
            predictBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Predict from Features';
            predictBtn.disabled = false;
            
            // Update result with animation
            setTimeout(() => {
                predictedGenre.innerHTML = `🎶 ${data.predicted_genre || "Unknown"}`;
                animateElement(document.querySelector('.genre-display'), 'fade-in');
                
                // Set default confidence
                if (confidenceBar && confidenceValue) {
                    confidenceBar.style.width = '100%';
                    confidenceValue.textContent = 'N/A';
                }
            }, 300);
            
        } catch (error) {
            console.error("Error:", error);
            
            // Reset button
            predictBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Predict from Features';
            predictBtn.disabled = false;
            
            predictedGenre.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Error predicting genre`;
            animateElement(predictedGenre, 'shake');
        }
    });
}

// Add event to play a sound effect when a file is added (optional)
function playUploadSound() {
    const audio = new Audio('assets/upload-sound.mp3');
    audio.volume = 0.2;
    audio.play().catch(e => console.log("Audio play failed:", e));
}

// Optional: Add sound effects if the audio files are available
fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        playUploadSound();
    }
});
