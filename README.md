# Music Genre Classifier Frontend

A modern web interface for classifying music genres using machine learning.

## Features

- Drag and drop audio file upload
- Automatic feature extraction
- Genre prediction with confidence levels
- Advanced mode for manual feature input
- Responsive design

## Getting Started

### Prerequisites

- Python 3.7+ with pip
- Node.js (optional, for running a local development server)
- Required Python packages:
  - Flask
  - Flask-CORS
  - joblib
  - numpy
  - librosa
  - pydub

### Installation

1. Clone this repository
```
git clone https://github.com/yourusername/music-genre-classifier.git
cd music-genre-classifier
```

2. Install the required Python packages
```
pip install flask flask-cors joblib numpy librosa pydub
```

3. Make sure you have your trained model and scaler in the correct location:
```
models/music_genre_classifier.pkl
models/scaler.pkl
```

### Running the Application

1. Start the Flask backend API:
```
python app.py
```
You should see output indicating that the Flask server is running on http://127.0.0.1:5000/

2. Open the frontend in your web browser:
   - Simply open the `index.html` file in your browser
   - Or use a local development server:
     ```
     npx http-server .
     ```
     And visit http://localhost:8080

3. Use the application:
   - Drag and drop an audio file (.mp3 or .wav) onto the upload area
   - Or click "Choose File" to select a file from your computer
   - Wait for the prediction results

4. Advanced usage:
   - Use the "Advanced: Manual Feature Input" section to directly input 57 audio features
   - Enter comma-separated feature values
   - Click "Predict from Features" to get a genre prediction

## Backend Requirements

This frontend requires a backend server that provides two endpoints:

1. `/predict` - Processes uploaded audio files and returns genre predictions
2. `/predict-features` - Classifies music genre based on manually entered features

### Backend API Specification

#### 1. Audio Prediction Endpoint

```
POST /predict
```

**Request:**
- Content-Type: multipart/form-data
- Body: audio file in the 'file' field

**Response:**
```json
{
  "predicted_genre": "Rock" // Predicted genre
}
```

#### 2. Feature-based Prediction Endpoint

```
POST /predict-features
```

**Request:**
- Content-Type: application/json
- Body:
```json
{
  "features": [0.1, 0.2, 0.3, ..., 0.57] // Array of 57 numerical features
}
```

**Response:**
```json
{
  "predicted_genre": "Rock" // Predicted genre
}
```

## Troubleshooting

- If you get CORS errors, ensure Flask-CORS is properly configured in app.py
- For audio file issues, check that your backend supports the uploaded file format
- If prediction fails, check the browser console for specific error messages

## Implementation Notes

The backend implementation uses:
1. Audio processing libraries (librosa)
2. Feature extraction from audio files (MFCCs, spectral features, etc.)
3. Machine learning model for genre prediction
4. Flask API endpoints to handle requests

## Local Development

The frontend is configured to use http://127.0.0.1:5000/ as the API endpoint.
To use a different backend API, modify the endpoint URLs in `script.js`. 

---

## Created By

Made with ♪♫ by **Mayank Bansal** 