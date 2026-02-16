/* ==========================================
   RETRO TV PORTFOLIO - JAVASCRIPT
   Power ON/OFF Toggle & Effects
   ========================================== */

// ==========================================
// AUDIO SYSTEM
// ==========================================

let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function playStaticSound(duration = 0.5, volume = 0.25) {
    const ctx = initAudio();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * volume;
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start();
}

function playTurnOnSound() {
    const ctx = initAudio();
    
    // Power pop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
    
    // Hum
    setTimeout(() => {
        const hum = ctx.createOscillator();
        const humGain = ctx.createGain();
        hum.type = 'sine';
        hum.frequency.value = 60;
        humGain.gain.setValueAtTime(0.02, ctx.currentTime);
        humGain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 2);
        hum.connect(humGain);
        humGain.connect(ctx.destination);
        hum.start();
        hum.stop(ctx.currentTime + 2);
    }, 100);
}

function playTurnOffSound() {
    const ctx = initAudio();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
}

function playClickSound() {
    const ctx = initAudio();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
}

function playBeep(freq = 440, dur = 0.1) {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
}

// ==========================================
// TV POWER SYSTEM
// ==========================================

let tvIsOn = false;
let isTransitioning = false;
let hintTimeout = null;

function togglePower() {
    if (isTransitioning) return;
    
    // Hide hint when power button is clicked
    hideHint();
    
    if (tvIsOn) {
        turnOffTV();
    } else {
        turnOnTV();
    }
}

function showHint() {
    const hint = document.getElementById('powerHint');
    if (hint && !tvIsOn) {
        hint.classList.add('visible');
    }
}

function hideHint() {
    const hint = document.getElementById('powerHint');
    if (hint) {
        hint.classList.remove('visible');
    }
    if (hintTimeout) {
        clearTimeout(hintTimeout);
        hintTimeout = null;
    }
}

function turnOnTV() {
    if (tvIsOn || isTransitioning) return;
    isTransitioning = true;
    
    const powerButton = document.getElementById('powerButton');
    const powerLed = document.getElementById('powerLed');
    const offScreen = document.getElementById('offScreen');
    const staticOverlay = document.getElementById('staticOverlay');
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');
    const loadingProgress = document.getElementById('loadingProgress');
    const loadingStatus = document.getElementById('loadingStatus');
    
    // Activate power button
    powerButton.classList.add('on');
    powerLed.classList.add('on');
    
    // Play sounds
    playTurnOnSound();
    playStaticSound(1.5, 0.3);
    
    // Hide off screen
    offScreen.classList.add('hidden');
    
    // Show heavy static
    staticOverlay.classList.add('heavy');
    
    // Show loading
    loadingScreen.classList.add('active');
    
    // Loading sequence
    const messages = ['INITIALIZING...', 'LOADING BIOS...', 'CHECKING MEMORY...', 'LOADING SYSTEM...', 'READY!'];
    let progress = 0;
    let msgIndex = 0;
    
    loadingProgress.style.width = '0%';
    
    const loadInterval = setInterval(() => {
        progress += Math.random() * 18 + 8;
        if (progress > 100) progress = 100;
        
        loadingProgress.style.width = progress + '%';
        
        const newIndex = Math.floor((progress / 100) * (messages.length - 1));
        if (newIndex !== msgIndex) {
            msgIndex = newIndex;
            loadingStatus.textContent = messages[msgIndex];
            playBeep(250 + msgIndex * 80, 0.06);
        }
        
        if (progress >= 100) {
            clearInterval(loadInterval);
            
            setTimeout(() => {
                staticOverlay.classList.remove('heavy');
                staticOverlay.classList.add('active');
                loadingScreen.classList.remove('active');
                mainContent.classList.add('visible');
                
                // Ready chime
                playBeep(600, 0.08);
                setTimeout(() => playBeep(800, 0.08), 80);
                setTimeout(() => playBeep(1000, 0.12), 160);
                
                tvIsOn = true;
                isTransitioning = false;
            }, 400);
        }
    }, 140);
}

function turnOffTV() {
    if (!tvIsOn || isTransitioning) return;
    isTransitioning = true;
    
    const powerButton = document.getElementById('powerButton');
    const powerLed = document.getElementById('powerLed');
    const offScreen = document.getElementById('offScreen');
    const staticOverlay = document.getElementById('staticOverlay');
    const mainContent = document.getElementById('mainContent');
    const screenContainer = document.getElementById('screenContainer');
    
    // Play turn off sound
    playTurnOffSound();
    playStaticSound(0.3, 0.2);
    
    // Deactivate power button
    powerButton.classList.remove('on');
    powerLed.classList.remove('on');
    
    // Turn off animation
    mainContent.style.transition = 'all 0.4s ease';
    mainContent.style.transform = 'scaleY(0.01)';
    mainContent.style.filter = 'brightness(5)';
    
    setTimeout(() => {
        mainContent.classList.remove('visible');
        mainContent.style.transform = '';
        mainContent.style.filter = '';
        mainContent.style.transition = '';
        
        staticOverlay.classList.remove('active');
        offScreen.classList.remove('hidden');
        
        tvIsOn = false;
        isTransitioning = false;
        
        // Show hint again after 3 seconds if TV stays off
        hintTimeout = setTimeout(() => {
            if (!tvIsOn) {
                showHint();
            }
        }, 3000);
    }, 400);
}

// ==========================================
// PROJECT CARDS
// ==========================================

function toggleProject(projectId) {
    const details = document.getElementById(`details-${projectId}`);
    const icon = document.getElementById(`expand-${projectId}`);
    
    playClickSound();
    
    const isExpanded = details.classList.contains('expanded');
    
    // Close all
    document.querySelectorAll('.project-details').forEach(el => el.classList.remove('expanded'));
    document.querySelectorAll('.expand-icon').forEach(el => {
        el.classList.remove('expanded');
        el.textContent = '+';
    });
    
    // Toggle current
    if (!isExpanded) {
        details.classList.add('expanded');
        icon.classList.add('expanded');
        icon.textContent = 'x';
        
        setTimeout(() => {
            details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// ==========================================
// SCREENSHOTS
// ==========================================

function openScreenshot(id, caption) {
    playClickSound();
    
    const modal = document.getElementById('screenshotModal');
    const img = document.getElementById('modalImage');
    const cap = document.getElementById('modalCaption');
    
    img.src = `screenshots/${id}.png`;
    img.onerror = function() {
        this.src = 'data:image/svg+xml,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">
                <rect fill="#0a0a0a" width="400" height="250"/>
                <text fill="#00ff41" font-family="monospace" font-size="14" x="200" y="125" text-anchor="middle">[IMAGE NOT FOUND]</text>
            </svg>
        `);
    };
    
    cap.textContent = caption || id;
    modal.classList.add('active');
}

function closeModal() {
    playClickSound();
    document.getElementById('screenshotModal').classList.remove('active');
}

// ==========================================
// TV EFFECTS CONTROLS
// ==========================================

let scanlinesOn = true;
let staticOn = true;

function toggleScanlines() {
    playClickSound();
    scanlinesOn = !scanlinesOn;
    document.querySelector('.scanlines').style.opacity = scanlinesOn ? '1' : '0';
}

function toggleStatic() {
    playClickSound();
    playStaticSound(0.15, 0.1);
    const overlay = document.getElementById('staticOverlay');
    staticOn = !staticOn;
    
    if (staticOn) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

// ==========================================
// KEYBOARD & INIT
// ==========================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === ' ' || e.key === 'Enter') {
        if (!document.getElementById('screenshotModal').classList.contains('active')) {
            e.preventDefault();
            togglePower();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', () => initAudio(), { once: true });
    
    // Show hint after 3 seconds if TV is still off
    hintTimeout = setTimeout(() => {
        if (!tvIsOn) {
            showHint();
        }
    }, 3000);
    
    console.log('%c>>> EDWARD\'S DEN PORTFOLIO', 'color: #00ff41; font-size: 16px; font-family: monospace; font-weight: bold;');
    console.log('%c>>> Press POWER to start', 'color: #ffb000; font-family: monospace;');
});
