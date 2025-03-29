// DOM Elements
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const predictBtn = document.getElementById("predictBtn");
const featuresInput = document.getElementById("featuresInput");
const predictedGenre = document.getElementById("predictedGenre");
const resultSection = document.getElementById('resultSection');
const confidenceBar = document.getElementById('confidenceBar');
const confidenceValue = document.getElementById('confidenceValue');

// Drag & Drop Events
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "#2980b9";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.style.borderColor = "#3498db";
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "#3498db";
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

// File input change handler
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// Handle file upload and processing
async function handleFile(file) {
    if (!file.type.startsWith('audio/')) {
        alert('Please upload an audio file');
        return;
    }

    // Show loading state
    if (resultSection) {
        resultSection.style.display = 'block';
        predictedGenre.textContent = 'Processing...';
        if (confidenceBar) confidenceBar.style.width = '0%';
        if (confidenceValue) confidenceValue.textContent = '0%';
    } else {
        predictedGenre.innerHTML = "⏳ Processing...";
    }

    try {
        const formData = new FormData();
        formData.append('file', file);

        // Extract features from the audio file
        // This requires a backend endpoint that can analyze the audio and extract features
        const featuresResponse = await fetch("https://music-genre-classification-6zrx.onrender.com/extract-features", {
            method: "POST",
            body: formData
        });

        if (!featuresResponse.ok) {
            throw new Error('Failed to extract features from audio');
        }

        const featuresData = await featuresResponse.json();
        const features = featuresData.features;

        // Validate features
        if (!features || features.length !== 57) {
            throw new Error(`Invalid features: expected 57, got ${features ? features.length : 0}`);
        }

        // Send features to prediction API
        const predictionResponse = await fetch("https://music-genre-classification-6zrx.onrender.com/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ features: features })
        });

        if (!predictionResponse.ok) {
            throw new Error('Failed to predict genre');
        }

        const data = await predictionResponse.json();
        
        // Update UI with results
        predictedGenre.innerHTML = `🎶 ${data.genre}`;
        
        // Update confidence if available
        if (data.confidence && confidenceBar && confidenceValue) {
            const confidence = Math.round(data.confidence * 100);
            confidenceBar.style.width = `${confidence}%`;
            confidenceValue.textContent = `${confidence}%`;
        }

    } catch (error) {
        console.error("Error:", error);
        predictedGenre.innerHTML = "❌ Error: " + error.message;
        if (confidenceValue) confidenceValue.textContent = '0%';
    }
}

// Legacy button click event for manual feature input
if (predictBtn) {
    predictBtn.addEventListener("click", async function () {
        let featuresText = featuresInput.value.trim();
        if (!featuresText) {
            alert("Please enter features before predicting!");
            return;
        }

        let featuresArray = featuresText.split(",").map(Number);
        if (featuresArray.length !== 57) {
            alert("Please enter exactly 57 numeric features.");
            return;
        }

        try {
            // Sending request to the deployed Flask API
            const response = await fetch("https://music-genre-classification-6zrx.onrender.com/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ features: featuresArray })
            });

            const data = await response.json();
            predictedGenre.innerHTML = `🎶 ${data.genre}`;
        } catch (error) {
            console.error("Error:", error);
            predictedGenre.innerHTML = "❌ Error predicting genre.";
        }
    });
}
