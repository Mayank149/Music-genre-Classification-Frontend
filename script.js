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
        
        // Update UI with results - use predicted_genre from backend
        predictedGenre.innerHTML = `🎶 ${data.predicted_genre}`;
        
        // Set default confidence since backend doesn't provide it
        if (confidenceBar && confidenceValue) {
            confidenceBar.style.width = '100%';
            confidenceValue.textContent = 'N/A';
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
            // Sending request to the local Flask API
            const response = await fetch("http://127.0.0.1:5000/predict-features", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ features: featuresArray })
            });

            const data = await response.json();
            predictedGenre.innerHTML = `🎶 ${data.predicted_genre || "Unknown"}`;
        } catch (error) {
            console.error("Error:", error);
            predictedGenre.innerHTML = "❌ Error predicting genre.";
        }
    });
}
