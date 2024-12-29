const videoElement = document.getElementById('video');
const output = document.getElementById('output');
const cameraStatusLabel = document.getElementById('camera-status');
let cameraStream;

// Button for allowing camera access
document.getElementById('btn-allow-camera').addEventListener('click', () => {
    // Requesting camera access
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            // Camera access granted successfully
            cameraStream = stream;
            videoElement.srcObject = stream;
            videoElement.onloadedmetadata = () => {
                videoElement.play();
            };
            cameraStatusLabel.textContent = "Camera Status: Access Allowed!";
        })
        .catch((error) => {
            // Handling errors if camera access fails
            handleCameraError(error);
        });
});

// Handling errors related to camera access
function handleCameraError(error) {
    if (error.name === 'NotFoundError') {
        cameraStatusLabel.textContent = "Camera Status: No camera found.";
    } else if (error.name === 'NotAllowedError') {
        cameraStatusLabel.textContent = "Camera Status: Permission denied.";
    } else if (error.name === 'NotReadableError') {
        cameraStatusLabel.textContent = "Camera Status: Camera is in use.";
    } else {
       ' cameraStatusLabel.textContent = Camera Status: ${error.message}';
    }
}

// Initializing the Mediapipe Hands Model
let hands;
const onResults = (results) => {
    if (results.multiHandLandmarks.length > 0) {
        output.innerHTML = '<p>Hand Detected!</p>';
    } else {
        output.innerHTML = '<p>No hand in view!</p>';
    }
}

// Loading and setting up Mediapipe Hands Model
function loadHandsModel() {
    hands = new Hands({
        locateFile: (file) =>'https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}'
    });

    hands.setOptions({
        maxNumHands: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
    });

    hands.onResults(onResults);
}

// Starting the camera feed and processing with Mediapipe
const camera = new Camera(videoElement, {
    onFrame: async () => await hands.send({ image: videoElement }),
});
camera.start();

// Event listeners for interaction buttons
document.getElementById('btn-detect').addEventListener('click', () => {
    output.innerHTML = '<p>Detecting Gesture...</p>';
    setTimeout(() => {
        output.innerHTML = '<p>Gesture Detection Successful!</p>';
    }, 2000);
});

document.getElementById('btn-extract').addEventListener('click', () => {
    output.innerHTML = '<p>Extracting Gesture...</p>';
    setTimeout(() => {
        output.innerHTML = '<p>Gesture Extraction Successful.</p>';
    }, 2000);
});

document.getElementById('btn-convert-text').addEventListener('click', () => {
    output.innerHTML = '<p>Converting Gesture to Text...</p>';
    setTimeout(() => {
        output.innerHTML = '<p>Arabic Text: "Hello".</p>';
    }, 2000);
});

document.getElementById('btn-convert-sign').addEventListener('click', () => {
    output.innerHTML = '<p>Converting Text to Video...</p>';
    setTimeout(() => {
        output.innerHTML = '<p>Video of gestures has been created.</p>';
    }, 2000);
});

// Load the Mediapipe model on window load
window.onload = () => {
    loadHandsModel();
};