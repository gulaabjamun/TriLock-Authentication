let currentMode = 'set'; // 'set' or 'login'
const MAX_CLICKS = 3;
let currentAttempt = [];
let storedPassword = []; // Array of {x, y} coordinates
const TOLERANCE = 5; // Pixels of allowed error when verifying

const imageElement = document.getElementById('target-image');
const feedbackElement = document.getElementById('feedback');

// --- Initialization and Mode Switching ---

// Set initial feedback and expose the setMode function globally (via the HTML buttons)
document.addEventListener('DOMContentLoaded', () => {
    setMode('set');
});

// Function to switch between setting and logging in
function setMode(mode) {
    currentMode = mode;
    currentAttempt = []; // Clear the current attempt
    
    // Update button visual state (optional, but good UX)
    document.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`button[onclick="setMode('${mode}')"]`).classList.add('active');

    feedbackElement.textContent = 
        mode === 'set' 
        ? `MODE: Setting Password. Click ${MAX_CLICKS} unique points.` 
        : `MODE: Login. Click the original ${MAX_CLICKS} points.`;
}

// --- Coordinate Capture ---

imageElement.addEventListener('click', function(event) {
    if (currentAttempt.length >= MAX_CLICKS) return;

    // Calculate coordinates relative to the top-left of the image
    const rect = this.getBoundingClientRect();
    const x = Math.round(event.clientX - rect.left); // Rounding for cleaner numbers
    const y = Math.round(event.clientY - rect.top);

    currentAttempt.push({ x: x, y: y });
    feedbackElement.textContent = `Clicks captured: ${currentAttempt.length} / ${MAX_CLICKS}`;

    if (currentAttempt.length === MAX_CLICKS) {
        processAttempt();
    }
});

// --- Processing and Verification ---

function processAttempt() {
    if (currentMode === 'set') {
        // Store the sequence and switch to login mode
        storedPassword = [...currentAttempt]; 
        alert('✅ Password Set Successfully! Now try logging in.');
        setMode('login'); 
    } else if (currentMode === 'login') {
        const isMatch = verifyPassword(currentAttempt, storedPassword);
        
        if (isMatch) {
            alert('🎉 Login Successful! Welcome.');
        } else {
            alert('❌ Login Failed! Incorrect sequence or points (Tolerance: ' + TOLERANCE + 'px).');
        }
        
        currentAttempt = []; // Clear attempt after verification
    }
}

// Core Verification Logic
function verifyPassword(attempt, stored) {
    // 1. Check length
    if (attempt.length !== stored.length || stored.length === 0) return false;

    // 2. Check sequence and tolerance
    for (let i = 0; i < attempt.length; i++) {
        // Calculate the difference between the attempted click and the stored click
        const xDiff = Math.abs(attempt[i].x - stored[i].x);
        const yDiff = Math.abs(attempt[i].y - stored[i].y);

        // If either difference exceeds the allowed tolerance, the sequence is wrong
        if (xDiff > TOLERANCE || yDiff > TOLERANCE) {
            return false;
        }
    }

    return true;
}