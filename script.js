let currentMode = 'set'; 
const MAX_CLICKS = 3;
let currentAttempt = [];
let storedPassword = []; 
const TOLERANCE = 5; 

const imageElement = document.getElementById('target-image');
const feedbackElement = document.getElementById('feedback');

document.addEventListener('DOMContentLoaded', () => {
    setMode('set');
});

function setMode(mode) {
    currentMode = mode;
    currentAttempt = []; 
    
 
    document.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`button[onclick="setMode('${mode}')"]`).classList.add('active');

    feedbackElement.textContent = 
        mode === 'set' 
        ? `MODE: Setting Password. Click ${MAX_CLICKS} unique points.` 
        : `MODE: Login. Click the original ${MAX_CLICKS} points.`;
}



imageElement.addEventListener('click', function(event) {
    if (currentAttempt.length >= MAX_CLICKS) return;

    const rect = this.getBoundingClientRect();
    const x = Math.round(event.clientX - rect.left); 
    const y = Math.round(event.clientY - rect.top);

    currentAttempt.push({ x: x, y: y });
    feedbackElement.textContent = `Clicks captured: ${currentAttempt.length} / ${MAX_CLICKS}`;

    if (currentAttempt.length === MAX_CLICKS) {
        processAttempt();
    }
});


function processAttempt() {
    if (currentMode === 'set') {
       
        storedPassword = [...currentAttempt]; 
        alert('Password Set Successfully! Now try logging in.');
        setMode('login'); 
    } else if (currentMode === 'login') {
        const isMatch = verifyPassword(currentAttempt, storedPassword);
        
        if (isMatch) {
            alert('Login Successful! Welcome.');
        } else {
            alert('Login Failed! Incorrect sequence or points (Tolerance: ' + TOLERANCE + 'px).');
        }
        
        currentAttempt = []; 
    }
}


function verifyPassword(attempt, stored) {

    if (attempt.length !== stored.length || stored.length === 0) return false;

    for (let i = 0; i < attempt.length; i++) {
        
        const xDiff = Math.abs(attempt[i].x - stored[i].x);
        const yDiff = Math.abs(attempt[i].y - stored[i].y);

        if (xDiff > TOLERANCE || yDiff > TOLERANCE) {
            return false;
        }
    }

    return true;

}
