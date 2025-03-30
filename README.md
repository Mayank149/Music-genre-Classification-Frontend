# Music Genre Classifier Frontend

A modern web interface for classifying music genres using machine learning.

## Features

- Drag and drop audio file upload
- Automatic feature extraction
- Genre prediction with confidence levels
- Advanced mode for manual feature input
- Responsive design

## Backend Requirements

This frontend requires a backend server that provides two endpoints:

1. `/extract-features` - Extracts 57 audio features from uploaded audio files
2. `/predict` - Classifies music genre based on the extracted features

### Backend API Specification

#### 1. Feature Extraction Endpoint

```
POST /extract-features
```

**Request:**
- Content-Type: multipart/form-data
- Body: audio file in the 'file' field

**Response:**
```json
{
  "features": [0.1, 0.2, 0.3, ..., 0.57] // Array of 57 numerical features
}
```

#### 2. Prediction Endpoint

```
POST /predict
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
  "genre": "Rock", // Predicted genre
  "confidence": 0.95 // Confidence score (0.0 to 1.0)
}
```

## Implementation Notes

To implement the backend, you'll need to:

1. Set up audio processing libraries (e.g., librosa for Python)
2. Implement feature extraction from audio files (MFCCs, spectral features, etc.)
3. Load your trained machine learning model
4. Create endpoints to handle the API requests

## Current API Endpoint

The frontend is currently configured to use:
```
https://music-genre-classification-6zrx.onrender.com/
```

To use a different backend API, modify the endpoint URLs in `script.js`.

## Local Development

To run the frontend locally, simply open `index.html` in a web browser or use a local development server. 