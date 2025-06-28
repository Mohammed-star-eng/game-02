const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// --- ENERGETIC SOUND SYSTEM ---
class EnergeticSoundSystem {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.4; // Perfect energy level
    this.enabled = true;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API not supported');
      this.enabled = false;
    }
  }

  // Enhanced tone creation with more dynamic range
  createTone(frequency, duration, type = 'sine', volume = 0.15, attack = 0.01, decay = 0.1) {
    if (!this.enabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;
    
    // Add filter for more character
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(frequency * 3, this.audioContext.currentTime);
    filter.Q.setValueAtTime(1, this.audioContext.currentTime);
    
    // More dynamic envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume, this.audioContext.currentTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(volume * this.masterVolume * 0.7, this.audioContext.currentTime + attack + decay);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Enhanced noise with filtering
  createEnergeticNoise(duration, volume = 0.08, filterFreq = 1200) {
    if (!this.enabled || !this.audioContext) return;
    
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.2;
    }
    
    const noise = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    noise.buffer = buffer;
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(filterFreq, this.audioContext.currentTime);
    filter.Q.setValueAtTime(2, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(volume * this.masterVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
    
    noise.start(this.audioContext.currentTime);
    noise.stop(this.audioContext.currentTime + duration);
  }

  // ENERGETIC JUMP - Powerful whoosh with rising pitch
  playJump() {
    // Main jump sound - rising whoosh
    this.createTone(150, 0.2, 'sawtooth', 0.18, 0.005, 0.05);
    setTimeout(() => this.createTone(250, 0.15, 'sine', 0.12, 0.005, 0.05), 30);
    setTimeout(() => this.createTone(350, 0.1, 'triangle', 0.08, 0.005, 0.05), 80);
    // Add some energy noise
    this.createEnergeticNoise(0.12, 0.06, 800);
  }

  // DYNAMIC LANDING - Impactful thud with reverb-like effect
  playLanding() {
    // Deep impact
    this.createTone(60, 0.25, 'square', 0.15, 0.001, 0.08);
    this.createTone(80, 0.2, 'sine', 0.12, 0.005, 0.06);
    // Impact noise
    this.createEnergeticNoise(0.15, 0.08, 600);
    // Echo effect
    setTimeout(() => this.createTone(70, 0.15, 'sine', 0.08), 100);
  }

  // EXCITING DROP COLLECTION - Bright, crystalline sound
  playDropCollect() {
    // Bright main tone
    this.createTone(1000, 0.3, 'sine', 0.18, 0.005, 0.1);
    setTimeout(() => this.createTone(1400, 0.25, 'triangle', 0.15, 0.005, 0.08), 50);
    setTimeout(() => this.createTone(1800, 0.2, 'sine', 0.12, 0.005, 0.06), 100);
    // Sparkle effect
    setTimeout(() => this.createTone(2400, 0.15, 'square', 0.08, 0.005, 0.04), 150);
    // Add shimmer
    this.createEnergeticNoise(0.2, 0.04, 2000);
  }

  // POWERFUL ROCK HIT - Dramatic crash
  playRockHit() {
    // Main impact
    this.createTone(100, 0.4, 'square', 0.25, 0.001, 0.15);
    this.createTone(150, 0.35, 'sawtooth', 0.2, 0.005, 0.12);
    // Crash noise
    this.createEnergeticNoise(0.3, 0.15, 400);
    // Reverb tail
    setTimeout(() => this.createTone(80, 0.25, 'sine', 0.12), 100);
    setTimeout(() => this.createEnergeticNoise(0.2, 0.08, 300), 150);
  }

  // DRAMATIC LIFE LOST - Descending tragic sequence
  playLifeLost() {
    this.createTone(400, 0.4, 'sine', 0.15, 0.02, 0.15);
    setTimeout(() => this.createTone(320, 0.4, 'triangle', 0.12, 0.02, 0.15), 200);
    setTimeout(() => this.createTone(240, 0.5, 'sine', 0.1, 0.02, 0.2), 400);
    // Add dramatic reverb
    setTimeout(() => this.createTone(180, 0.6, 'sine', 0.08), 600);
  }

  // SHARP HEART BREAK - Quick dramatic crack
  playHeartBreak() {
    this.createEnergeticNoise(0.08, 0.06, 1500);
    this.createTone(800, 0.12, 'square', 0.08, 0.001, 0.04);
    setTimeout(() => this.createTone(400, 0.1, 'sawtooth', 0.06), 50);
  }

  // TRIUMPHANT LEVEL COMPLETE - Grand celebration
  playLevelComplete() {
    const notes = [523, 659, 784, 1047, 1319]; // C, E, G, C, E
    notes.forEach((note, i) => {
      setTimeout(() => {
        this.createTone(note, 0.4, 'sine', 0.18, 0.01, 0.15);
        this.createTone(note * 1.5, 0.3, 'triangle', 0.12, 0.02, 0.1);
      }, i * 120);
    });
    // Add celebration sparkle
    setTimeout(() => this.createEnergeticNoise(0.5, 0.08, 3000), 200);
  }

  // ENERGETIC LEVEL UP - Victory fanfare with harmonics
  playLevelUp() {
    const notes = [440, 554, 659, 880]; // A, C#, E, A
    notes.forEach((note, i) => {
      setTimeout(() => {
        this.createTone(note, 0.3, 'sine', 0.15, 0.005, 0.1);
        this.createTone(note * 1.5, 0.25, 'triangle', 0.1, 0.01, 0.08);
        this.createTone(note * 2, 0.2, 'square', 0.06, 0.015, 0.06);
      }, i * 100);
    });
  }

  // MAGICAL STAR COLLECTION - Twinkling cascade
  playStarCollect() {
    this.createTone(1600, 0.15, 'sine', 0.12, 0.002, 0.05);
    setTimeout(() => this.createTone(2000, 0.15, 'triangle', 0.1, 0.002, 0.05), 40);
    setTimeout(() => this.createTone(2400, 0.2, 'sine', 0.12, 0.002, 0.06), 80);
    setTimeout(() => this.createTone(3200, 0.15, 'square', 0.08, 0.002, 0.04), 140);
    // Sparkle trail
    this.createEnergeticNoise(0.25, 0.05, 2800);
  }

  // EPIC GAME START - Rising heroic theme
  playGameStart() {
    this.createTone(330, 0.2, 'sine', 0.12, 0.01, 0.08);
    setTimeout(() => this.createTone(440, 0.2, 'triangle', 0.14, 0.01, 0.08), 150);
    setTimeout(() => this.createTone(554, 0.25, 'sine', 0.16, 0.01, 0.1), 300);
    setTimeout(() => this.createTone(659, 0.3, 'triangle', 0.18, 0.01, 0.12), 450);
    // Add energy buildup
    setTimeout(() => this.createEnergeticNoise(0.4, 0.06, 1500), 200);
  }

  // DRAMATIC GAME OVER - Emotional descent
  playGameOver() {
    this.createTone(523, 0.6, 'sine', 0.15, 0.03, 0.2);
    setTimeout(() => this.createTone(440, 0.6, 'triangle', 0.12, 0.03, 0.2), 300);
    setTimeout(() => this.createTone(349, 0.8, 'sine', 0.1, 0.03, 0.25), 600);
    setTimeout(() => this.createTone(262, 1.0, 'sine', 0.08, 0.03, 0.3), 900);
    // Dramatic reverb
    setTimeout(() => this.createEnergeticNoise(0.6, 0.06, 500), 400);
  }

  // ATTENTION-GRABBING FACT CARD - Notification chime
  playFactCard() {
    this.createTone(800, 0.2, 'sine', 0.1, 0.01, 0.08);
    setTimeout(() => this.createTone(1200, 0.25, 'triangle', 0.12, 0.01, 0.1), 120);
    setTimeout(() => this.createTone(1000, 0.3, 'sine', 0.08, 0.01, 0.12), 250);
  }

  // SATISFYING BUTTON CLICK - Sharp, responsive
  playButtonClick() {
    this.createTone(600, 0.1, 'square', 0.08, 0.001, 0.03);
    this.createEnergeticNoise(0.06, 0.04, 1200);
    setTimeout(() => this.createTone(450, 0.08, 'sine', 0.06), 30);
  }

  // SUBTLE BUTTON HOVER - Quick highlight
  playButtonHover() {
    this.createTone(800, 0.08, 'triangle', 0.05, 0.002, 0.02);
  }

  // EXPLOSIVE COMBO SYSTEM - Escalating excitement
  playCombo(comboCount) {
    const baseFreq = 1000 + (comboCount * 200);
    const volume = Math.min(0.25, 0.12 + comboCount * 0.03);
    
    // Main combo tone
    this.createTone(baseFreq, 0.2, 'sine', volume, 0.005, 0.08);
    this.createTone(baseFreq * 1.5, 0.15, 'triangle', volume * 0.7, 0.008, 0.06);
    
    // Add excitement for higher combos
    if (comboCount >= 3) {
      setTimeout(() => this.createTone(baseFreq * 2, 0.12, 'square', volume * 0.5), 40);
      this.createEnergeticNoise(0.15, 0.06, 2000 + comboCount * 200);
    }
    
    // Explosive effect for mega combos
    if (comboCount >= 5) {
      setTimeout(() => this.createTone(baseFreq * 3, 0.1, 'sine', volume * 0.4), 80);
      setTimeout(() => this.createEnergeticNoise(0.2, 0.08, 3000), 60);
    }
  }
}

// Initialize energetic sound system
const soundSystem = new EnergeticSoundSystem();

// Track combo system for drop collection
let dropCombo = 0;
let lastDropTime = 0;

// Load the SVG mountain images
const mountainImg = new Image();
mountainImg.src = 'img/mountain.svg';
const mountain2Img = new Image();
mountain2Img.src = 'img/mountain2.svg';
// Load the correct rectangle SVG image
const rectImg = new Image();
rectImg.src = 'img/Rectangle (3).svg';
// Load the new yellow rectangle SVG image
const rect2Img = new Image();
rect2Img.src = 'img/Rectangle 2.svg';
// Load the wave SVG image
const waveImg = new Image();
waveImg.src = 'img/Wave.svg';
// Load the new bottom rectangle SVG image
const rectBottomImg = new Image();
rectBottomImg.src = 'img/Rectangle-bottom.svg';
// Load the brown rectangle SVG image
const rect3Img = new Image();
rect3Img.src = 'img/Rectangle 3.svg';
// Load the dark cloud SVG image
const cloudDarkImg = new Image();
cloudDarkImg.src = 'img/cloud dark.svg';
// Load the light cloud SVG image
const cloudLightImg = new Image();
cloudLightImg.src = 'img/cloud light.svg';
// Load the sun and cloud SVG image
const sunCloudImg = new Image();
sunCloudImg.src = 'img/sun and cloud.svg';
// Load the extra right cloud SVG image
const cloudRightImg = new Image();
cloudRightImg.src = 'img/cloud right.svg';
// Load the plane SVG image
const planeImg = new Image();
planeImg.src = 'img/plane.svg';
// Load the rock SVG image
const rockImg = new Image();
rockImg.src = 'img/rock.svg';
// Load the droplet SVG image
const dropImg = new Image();
dropImg.src = 'img/drop.svg';
// Load the ball SVG image
const ballImg = new Image();
ballImg.src = 'img/ball.svg';
// Load the bone SVG image
const boneImg = new Image();
boneImg.src = 'img/bone.svg';

// Create buried bones positions (scattered across entire brown rectangle)
const buriedBones = [
  { x: 0.15, y: 0.2, rotation: 45, scale: 0.5 },
  { x: 0.35, y: 0.4, rotation: -60, scale: 0.45 },
  { x: 0.65, y: 0.25, rotation: 120, scale: 0.55 },
  { x: 0.85, y: 0.5, rotation: -30, scale: 0.48 },
  { x: 0.25, y: 0.7, rotation: 90, scale: 0.52 },
  { x: 0.75, y: 0.8, rotation: -150, scale: 0.47 }
]; // x and y are percentages across entire brown rectangle, rotation in degrees, scale as multiplier

function drawOnlyMountains() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Rectangle (3).svg first (farthest back)
  if (rectImg.complete && rectImg.naturalWidth) {
    const svgWRect = 853, svgHRect = 244;
    const drawWRect = canvas.width;
    const drawHRect = svgHRect * (drawWRect / svgWRect);
    const baseYRect = 244;
    ctx.drawImage(rectImg, 0, baseYRect - drawHRect, drawWRect, drawHRect);
  } else {
    rectImg.onload = () => { drawOnlyMountains(); };
  }

  // Draw mountain2.svg (middle)
  if (mountain2Img.complete && mountain2Img.naturalWidth) {
    const svgW2 = 853, svgH2 = 99;
    const drawW2 = canvas.width;
    const drawH2 = svgH2 * (drawW2 / svgW2);
    const baseY2 = 244;
    ctx.save();
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 2 * (canvas.width / 805); // extremely slight glow
    ctx.drawImage(mountain2Img, 0, baseY2 - drawH2, drawW2, drawH2);
    ctx.restore();
  } else {
    mountain2Img.onload = () => { drawOnlyMountains(); };
  }

  // Draw mountain.svg (front)
  if (mountainImg.complete && mountainImg.naturalWidth) {
    const svgW = 853, svgH = 50;
    const drawW = canvas.width;
    const drawH = svgH * (drawW / svgW);
    const baseY = 244;
    ctx.save();
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 2 * (canvas.width / 805); // extremely slight glow
    ctx.drawImage(mountainImg, 0, baseY - drawH, drawW, drawH);
    ctx.restore();
  } else {
    mountainImg.onload = () => { drawOnlyMountains(); };
  }

  // Draw Rectangle 2.svg (yellow) right below the mountains
  let yellowRectBottom = 244;
  let drawHRect2 = 0;
  if (rect2Img.complete && rect2Img.naturalWidth) {
    const svgWRect2 = 853, svgHRect2 = 32;
    const drawWRect2 = canvas.width;
    drawHRect2 = svgHRect2 * (drawWRect2 / svgWRect2);
    // Place the top of the yellow rectangle at y = 244
    const topYRect2 = 244;
    ctx.drawImage(rect2Img, 0, topYRect2, drawWRect2, drawHRect2);
    yellowRectBottom = topYRect2 + drawHRect2;
  } else {
    rect2Img.onload = () => { drawOnlyMountains(); };
  }

  // Draw Rectangle-bottom.svg at the bottom end of the yellow rectangle
  if (rectBottomImg.complete && rectBottomImg.naturalWidth) {
    const svgWRectB = 853, svgHRectB = 48;
    const drawWRectB = canvas.width;
    const drawHRectB = svgHRectB * (drawWRectB / svgWRectB);
    ctx.drawImage(rectBottomImg, 0, yellowRectBottom, drawWRectB, drawHRectB);
  } else {
    rectBottomImg.onload = () => { drawOnlyMountains(); };
  }

  // Draw Rectangle 3.svg (brown) from just below the yellow rectangle to the bottom,
  // but do NOT cover the wave: draw it *behind* the wave, so the wave is always on top.
  if (rect3Img.complete && rect3Img.naturalWidth) {
    const svgWRect3 = 853, svgHRect3 = 118;
    const drawWRect3 = canvas.width;
    const topYRect3 = yellowRectBottom;
    const drawHRect3 = canvas.height - topYRect3;
    ctx.drawImage(rect3Img, 0, 0, svgWRect3, svgHRect3, 0, topYRect3, drawWRect3, drawHRect3);
    
    // Draw buried bones scattered across the entire brown rectangle
    if (boneImg.complete && boneImg.naturalWidth) {
      buriedBones.forEach(bone => {
        const boneX = bone.x * canvas.width;
        const boneY = topYRect3 + (bone.y * drawHRect3);
        const boneW = 76 * bone.scale * (canvas.width / 805);
        const boneH = 76 * bone.scale * (canvas.width / 805);
        
        ctx.save();
        ctx.translate(boneX + boneW/2, boneY + boneH/2);
        ctx.rotate((bone.rotation * Math.PI) / 180);
        ctx.globalAlpha = 0.35; // Semi-transparent for buried effect
        ctx.drawImage(boneImg, -boneW/2, -boneH/2, boneW, boneH);
        ctx.restore();
      });
    }
  } else {
    rect3Img.onload = () => { drawOnlyMountains(); };
  }

  // Draw Wave.svg OVER the yellow and brown rectangles so it is always visible
  let waveTop = yellowRectBottom;
  if (waveImg.complete && waveImg.naturalWidth) {
    const svgWWave = 853, svgHWave = 24;
    const drawWWave = canvas.width;
    const drawHWave = svgHWave * (drawWWave / svgWWave);
    ctx.save();
    ctx.shadowColor = "#4EC1F5";
    ctx.shadowBlur = 2 * (canvas.width / 805); // extremely slight glow
    ctx.drawImage(waveImg, 0, waveTop, drawWWave, drawHWave);
    ctx.restore();
  } else {
    waveImg.onload = () => { drawOnlyMountains(); };
  }

  // Draw the dark cloud above the mountains
  if (cloudDarkImg.complete && cloudDarkImg.naturalWidth) {
    const cloudW = 110 * (canvas.width / 805);
    const cloudH = 110 * (canvas.width / 805);
    ctx.save();
    ctx.shadowColor = "#90caf9";
    ctx.shadowBlur = 10 * (canvas.width / 805); // decreased glow
    ctx.drawImage(cloudDarkImg, 350, 0, cloudW, cloudH);
    ctx.restore();
  } else {
    cloudDarkImg.onload = () => { drawOnlyMountains(); };
  }

  // Draw the light cloud slightly to the left and below the dark cloud, slightly covering it
  if (cloudLightImg.complete && cloudLightImg.naturalWidth) {
    const cloudW = 114 * (canvas.width / 805);
    const cloudH = 114 * (canvas.width / 805);
    ctx.save();
    ctx.shadowColor = "#e3f6ff";
    ctx.shadowBlur = 12 * (canvas.width / 805); // decreased glow
    ctx.drawImage(cloudLightImg, 200 + 70, 0 + 22, cloudW, cloudH);
    ctx.restore();
  } else {
    cloudLightImg.onload = () => { drawOnlyMountains(); };
  }

  // Draw the sun and cloud to the right of the previous two clouds
  if (sunCloudImg.complete && sunCloudImg.naturalWidth) {
    const sunCloudW = 111 * (canvas.width / 805);
    const sunCloudH = 111 * (canvas.width / 805);
    const x = 200 + 110 * (canvas.width / 805) + 300;
    const y = 0;
    ctx.save();
    ctx.shadowColor = "#fffde7";
    ctx.shadowBlur = 12 * (canvas.width / 805); // decreased glow
    ctx.drawImage(sunCloudImg, x, y, sunCloudW, sunCloudH);
    ctx.restore();

    // Draw the rightmost cloud to the right of the sun and cloud
    if (cloudRightImg.complete && cloudRightImg.naturalWidth) {
      const cloudRightW = 110 * (canvas.width / 805);
      const cloudRightH = 110 * (canvas.width / 805);
      const rightX = x + sunCloudW + 30;
      const rightY = 0;
      ctx.save();
      ctx.shadowColor = "#b3e5fc";
      ctx.shadowBlur = 10 * (canvas.width / 805); // decreased glow
      ctx.drawImage(cloudRightImg, rightX, rightY, cloudRightW, cloudRightH);
      ctx.restore();
    } else {
      cloudRightImg.onload = () => { drawOnlyMountains(); };
    }
  } else {
    sunCloudImg.onload = () => { drawOnlyMountains(); };
  }

  // Draw the plane on the left above the mountains
  if (planeImg.complete && planeImg.naturalWidth) {
    const planeW = 100 * (canvas.width / 805);
    const planeH = 90 * 1.5 * (canvas.width / 805);
    const planeX = 80;
    const planeY = 10;
    ctx.save();
    ctx.shadowColor = "#90caf9";
    ctx.shadowBlur = 10 * (canvas.width / 805);
    ctx.drawImage(planeImg, planeX, planeY, planeW, planeH);
    ctx.restore();
  } else {
    planeImg.onload = () => { drawOnlyMountains(); };
  }

  // --- Draw moving obstacles (rocks), droplets, and ball in their correct places ---

  // Draw obstacles (rocks)
  for (let obs of obstacles) {
    ctx.drawImage(rockImg, obs.x, obs.y, obs.w, obs.h);
  }

  // Draw droplets
  for (let drop of droplets) {
    if (!drop.collected) {
      ctx.save();
      ctx.shadowColor = "#4EC1F5";
      ctx.shadowBlur = 10 * (canvas.width / 805);
      ctx.drawImage(dropImg, drop.x, drop.y, drop.w, drop.h);
      ctx.restore();
    }
  }

  // Draw ball
  if (typeof ballY !== "undefined") {
    const ballW = 45 * (canvas.width / 805);
    const ballH = 45 * (canvas.width / 805);
    const ballX = 80 * (canvas.width / 805);
    ctx.save();
    ctx.shadowColor = "#EB4141";
    ctx.shadowBlur = 10 * (canvas.width / 805);
    ctx.drawImage(ballImg, ballX, ballY, ballW, ballH);
    ctx.restore();
  }
}

// --- GAME LOGIC VARIABLES ---
let gameRunning = false;
let score = 0;
let level = 1;
let speed = 5.5;
let ballY = 0, ballVY = 0, isJumping = false;
let ballFallingIn = false; // NEW: true when animating initial fall
let obstacles = [];
let droplets = [];
let facts = [
  "785 million people lack access to clean water worldwide.",
  "Every 2 minutes a child dies from water-related diseases.",
  "By 2025, half of the world’s population may live in water-stressed areas.",
  "Women and children walk an average of 6 km daily to collect water."
];
let usedFacts = [];
let showFactCard = false;
let showCtaCard = false;
let letsGoTimeout = null;
let pendingLevelUp = false; // <-- add this
// NEW: Lives system variables
let lives = 5;
let showGameOverCard = false;

// --- DOM ELEMENTS ---
const startBtn = document.getElementById('start-btn');
const infoCard = document.getElementById('info-card');
const factText = document.getElementById('fact-text');
const closeFactBtn = document.getElementById('close-fact-btn');
const callToAction = document.getElementById('call-to-action');
const learnMoreBtn = document.getElementById('learn-more-btn');
const donateBtn = document.getElementById('donate-btn');
const replayBtn = document.getElementById('replay-btn');
const scoreBox = document.getElementById('score');
const levelNum = document.getElementById('level-num');
const star1 = document.getElementById('star1');
const star2 = document.getElementById('star2');
const star3 = document.getElementById('star3');
const progressFill = document.getElementById('progress-fill');
// NEW: Lives system DOM elements
const heart1 = document.getElementById('heart1');
const heart2 = document.getElementById('heart2');
const heart3 = document.getElementById('heart3');
const heart4 = document.getElementById('heart4');
const heart5 = document.getElementById('heart5');
const gameOverCard = document.getElementById('game-over-card');
const restartGameBtn = document.getElementById('restart-game-btn');
const letsGo = (() => {
  let el = document.getElementById('lets-go');
  if (!el) {
    el = document.createElement('div');
    el.id = 'lets-go';
    el.textContent = "Let's go!";
    document.body.appendChild(el);
  }
  return el;
})();

// --- GAME CONSTANTS ---
const BALL_RADIUS = 22;
// Fixed jump velocity and gravity for consistent, natural physics
const JUMP_VELOCITY = -15.0; // Adjusted for better jump feel
const GRAVITY = 0.5; // Adjusted for more natural fall speed
// Use a fixed ground Y position to prevent glitches
let GROUND_Y = 228;

// --- GAME OBJECTS ---
function resetLevel() {
  // Update ground position based on canvas size
  GROUND_Y = 244 + 30 - 60 * (canvas.width / 805);
  
  // Ball position
  ballY = GROUND_Y;
  ballVY = 0;
  isJumping = false;

  // Minimum distances for clean, winnable layout
  const minRockGap = 220 * (canvas.width / 805);    // between rocks
  const minDropGap = 140 * (canvas.width / 805);    // between droplets
  const minRockDropGap = 180 * (canvas.width / 805); // between rock and droplet

  // Obstacles (rocks)
  obstacles = [];
  let baseY = GROUND_Y;
  let rockW = 52 * (canvas.width / 805);
  let lastRockX = canvas.width + 100;
  for (let i = 0; i < 2; i++) {
    let tryCount = 0;
    let x, valid;
    do {
      // Restore to less frequent, more regular intervals
      x = lastRockX + minRockGap + Math.random() * (canvas.width * 0.5);
      valid = true;
      // Ensure rocks are not too close to each other
      for (let j = 0; j < obstacles.length; j++) {
        let other = obstacles[j];
        if (
          x < other.x + rockW + minRockGap &&
          x + rockW > other.x - minRockGap
        ) {
          valid = false;
          break;
        }
      }
      tryCount++;
    } while (!valid && tryCount < 30);
    obstacles.push({
      x,
      y: baseY,
      w: rockW,
      h: 54 * (canvas.width / 805)
    });
    lastRockX = x;
  }

  // Droplets
  droplets = [];
  let dropW = 22 * (canvas.width / 805);
  let dropH = 35 * (canvas.width / 805);
  const minDropBuffer = 60 * (canvas.width / 805); // increased buffer for droplets

  for (let i = 0; i < 5; i++) {
    let tryCount = 0;
    let x, y;
    let valid;
    do {
      x = canvas.width + 100 + Math.random() * (canvas.width * 0.7);
      y = GROUND_Y + (BALL_RADIUS * (canvas.width / 805) / 2) - dropH / 2;
      valid = true;
      // Check bounding box overlap with rocks
      for (let obs of obstacles) {
        if (boxesOverlap(x, dropW, obs.x, obs.w)) {
          valid = false;
          break;
        }
      }
      // Check bounding box overlap with other droplets, with buffer
      if (valid) {
        for (let j = 0; j < droplets.length; j++) {
          let other = droplets[j];
          if (boxesOverlapWithBuffer(x, dropW, other.x, other.w, minDropBuffer)) {
            valid = false;
            break;
          }
        }
      }
      tryCount++;
    } while (!valid && tryCount < 40);
    droplets.push({
      x,
      y,
      w: dropW,
      h: dropH,
      collected: false
    });
  }
}

function randomFact() {
  if (usedFacts.length === facts.length) usedFacts = [];
  let available = facts.filter(f => !usedFacts.includes(f));
  let fact = available[Math.floor(Math.random() * available.length)];
  usedFacts.push(fact);
  return fact;
}

function showFact() {
  factText.textContent = randomFact();
  infoCard.classList.remove('hidden');
  showFactCard = true;
  gameRunning = false;
  // Remove auto-close: do not set a timeout
}

function hideFact() {
  infoCard.classList.add('hidden');
  showFactCard = false;
  // If a level-up was pending, do it now
  if (pendingLevelUp) {
    pendingLevelUp = false;
    level++;
    speed += 1.5; // Faster speed increase per level
    updateLevelDisplay();
    showLetsGo();
    resetLevel();
  }
  // Always resume the game after closing the fact card
  gameRunning = true;
  requestAnimationFrame(gameLoop);
}

function showCTA() {
  callToAction.classList.remove('hidden');
  showCtaCard = true;
  gameRunning = false;
  triggerConfetti(); // Start confetti animation
}

// Dramatic Confetti animation that covers the entire game area with typical confetti streamers
function triggerConfetti() {
  // Create a full-screen confetti overlay
  let confettiCanvas = document.getElementById('confetti-overlay');
  if (!confettiCanvas) {
    confettiCanvas = document.createElement('canvas');
    confettiCanvas.id = 'confetti-overlay';
    confettiCanvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1000;
    `;
    document.body.appendChild(confettiCanvas);
  }
  
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  
  let confettiPieces = [];
  const colors = [
    '#FFD700', '#FFA500', '#FF6347', '#FF1493', '#00BFFF', '#00FFFF', 
    '#ADFF2F', '#FF69B4', '#FF4500', '#32CD32', '#FF00FF', '#00FF00',
    '#FFFF00', '#FF0000', '#0000FF', '#FFC0CB', '#87CEEB', '#98FB98'
  ];
  
  // Create confetti shooting from all four sides
  const sides = ['top', 'bottom', 'left', 'right'];
  const particlesPerSide = 50;
  
  for (let side of sides) {
    for (let i = 0; i < particlesPerSide; i++) {
      let particle = {
        r: 4 + Math.random() * 8, // Size for streamer width
        d: Math.random() * 120,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 20 - 10,
        tiltAngle: 0,
        tiltAngleIncremental: (Math.random() * 0.15) + 0.08,
        opacity: 0.8 + Math.random() * 0.2,
        life: 400 + Math.random() * 200, // Longer lifespan
        maxLife: 400 + Math.random() * 200
      };
      
      // Set starting position and velocity based on side
      switch(side) {
        case 'top':
          particle.x = Math.random() * confettiCanvas.width;
          particle.y = -30;
          particle.velocityX = (Math.random() - 0.5) * 6;
          particle.velocityY = Math.random() * 4 + 2;
          break;
        case 'bottom':
          particle.x = Math.random() * confettiCanvas.width;
          particle.y = confettiCanvas.height + 30;
          particle.velocityX = (Math.random() - 0.5) * 6;
          particle.velocityY = -(Math.random() * 4 + 2);
          break;
        case 'left':
          particle.x = -30;
          particle.y = Math.random() * confettiCanvas.height;
          particle.velocityX = Math.random() * 4 + 2;
          particle.velocityY = (Math.random() - 0.5) * 6;
          break;
        case 'right':
          particle.x = confettiCanvas.width + 30;
          particle.y = Math.random() * confettiCanvas.height;
          particle.velocityX = -(Math.random() * 4 + 2);
          particle.velocityY = (Math.random() - 0.5) * 6;
          break;
      }
      
      particle.gravity = 0.12;
      particle.friction = 0.98;
      confettiPieces.push(particle);
    }
  }
  
  let angle = 0;
  let time = 0;
  
  function drawConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    angle += 0.02;
    time += 0.1;
    
    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      let p = confettiPieces[i];
      
      // Update physics
      p.velocityY += p.gravity;
      p.velocityX *= p.friction;
      p.velocityY *= p.friction;
      p.x += p.velocityX;
      p.y += p.velocityY;
      
      // Add wind/wave effect
      p.x += Math.sin(angle + p.d * 0.01) * 1.2;
      
      // Update rotation
      p.tiltAngle += p.tiltAngleIncremental;
      p.tilt = Math.sin(p.tiltAngle) * 18;
      
      // Update life and opacity
      p.life--;
      p.opacity = (p.life / p.maxLife) * 0.9;
      
      // Remove dead particles
      if (p.life <= 0 || p.opacity <= 0) {
        confettiPieces.splice(i, 1);
        continue;
      }
      
      // Draw typical confetti streamer
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r/2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + 12);
      ctx.stroke();
      ctx.restore();
    }
    
    if (confettiPieces.length > 0) {
      requestAnimationFrame(drawConfetti);
    } else {
      // Clean up the overlay when animation is done
      setTimeout(() => {
        if (confettiCanvas && confettiCanvas.parentNode) {
          confettiCanvas.parentNode.removeChild(confettiCanvas);
        }
      }, 1000);
    }
  }
  
  drawConfetti();
}

function hideCTA() {
  callToAction.classList.add('hidden');
  showCtaCard = false;
}

function updateScoreDisplay() {
  scoreBox.textContent = score;
  updateProgressBar();
}

function updateProgressBar() {
  // Calculate progress based on current level (3 levels total)
  // Level 1 = 0-33%, Level 2 = 33-66%, Level 3 = 66-100%
  const progressPercent = ((level - 1) / 3) * 100 + ((score % 60) / 60) * (100 / 3);
  progressFill.style.width = Math.min(progressPercent, 100) + '%';
}

function updateLevelDisplay() {
  levelNum.textContent = level;
  
  // Light up stars based on progress through the game (3 levels total)
  const totalProgress = ((level - 1) / 3) + ((score % 60) / 60) * (1 / 3);
  
  [star1, star2, star3].forEach((star, idx) => {
    // Each star represents 1/3 of total progress
    const starThreshold = (idx + 1) / 3;
    const wasActive = star.classList.contains('active');
    const shouldBeActive = totalProgress >= starThreshold;
    
    if (shouldBeActive && !wasActive) {
      star.classList.add('active');
      soundSystem.playStarCollect(); // MAGICAL STAR COLLECTION SOUND!
    } else if (!shouldBeActive && wasActive) {
      star.classList.remove('active');
    }
  });
  
  updateProgressBar();
}

function showLetsGo() {
  letsGo.classList.add('visible');
  clearTimeout(letsGoTimeout);
  letsGoTimeout = setTimeout(() => {
    letsGo.classList.remove('visible');
  }, 1500);
}

// --- LIVES SYSTEM FUNCTIONS ---
function updateLivesDisplay() {
  const hearts = [heart1, heart2, heart3, heart4, heart5];
  hearts.forEach((heart, index) => {
    if (index < lives) {
      heart.classList.remove('lost');
    } else {
      heart.classList.add('lost');
    }
  });
}

function loseLife() {
  lives--;
  soundSystem.playLifeLost(); // DRAMATIC LIFE LOST SOUND!
  soundSystem.playHeartBreak(); // SHARP HEART BREAK SOUND!
  updateLivesDisplay();
  
  if (lives <= 0) {
    soundSystem.playGameOver(); // DRAMATIC GAME OVER SOUND!
    showGameOver();
    return true; // Game over
  }
  return false; // Continue game
}

function showGameOver() {
  gameRunning = false;
  showGameOverCard = true;
  gameOverCard.classList.remove('hidden');
}

function hideGameOver() {
  showGameOverCard = false;
  gameOverCard.classList.add('hidden');
}

function resetGame() {
  hideGameOver();
  lives = 5;
  score = 0;
  level = 1;
  speed = 5.5;
  updateLivesDisplay();
  updateScoreDisplay();
  updateLevelDisplay();
  resetLevel();
}

// --- BUTTON HOVER SOUND EFFECTS ---
// Add hover sounds to all buttons
function addButtonHoverSounds() {
  const buttons = [
    startBtn, 
    closeFactBtn, 
    learnMoreBtn, 
    donateBtn, 
    replayBtn, 
    restartGameBtn
  ];
  
  buttons.forEach(button => {
    if (button) {
      button.addEventListener('mouseenter', () => {
        soundSystem.playButtonHover(); // SUBTLE BUTTON HOVER SOUND!
      });
    }
  });
}

// Initialize button hover sounds
addButtonHoverSounds();

// --- COLLISION DETECTION ---
function collides(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function dropletsOverlap(x1, w1, x2, w2) {
  return x1 < x2 + w2 && x1 + w1 > x2;
}

function boxesOverlap(x1, w1, x2, w2) {
  return x1 < x2 + w2 && x1 + w1 > x2;
}

function boxesOverlapWithBuffer(x1, w1, x2, w2, buffer) {
  return x1 < x2 + w2 + buffer && x1 + w1 + buffer > x2;
}

// --- GAME LOOP ---
function gameLoop() {
  if (!gameRunning || ballFallingIn) return;

  // Minimum distances for respawn logic
  const minRockGap = 220 * (canvas.width / 805);
  const minDropGap = 140 * (canvas.width / 805);
  const minRockDropGap = 60 * (canvas.width / 805); // small minimum distance between rock and droplet
  const minDropBuffer = 60 * (canvas.width / 805); // increased buffer for droplets

  // Move obstacles and droplets
  for (let obsIdx = 0; obsIdx < obstacles.length; obsIdx++) {
    let obs = obstacles[obsIdx];
    obs.x -= speed;
    if (obs.x + obs.w < 0) {
      // Respawn rock at a new, surprising position, not overlapping any droplet or other rock
      let newX, valid, tryCount = 0;
      do {
        // Restore to less frequent, more regular intervals
        let maxX = canvas.width;
        for (let j = 0; j < obstacles.length; j++) {
          if (j !== obsIdx) {
            maxX = Math.max(maxX, obstacles[j].x);
          }
        }
        for (let drop of droplets) {
          if (!drop.collected) {
            maxX = Math.max(maxX, drop.x);
          }
        }
        newX = maxX + minRockGap + Math.random() * (canvas.width * 0.5);
        valid = true;
        // Not too close to any droplet
        for (let drop of droplets) {
          if (
            !drop.collected &&
            newX < drop.x + drop.w + minRockDropGap &&
            newX + obs.w > drop.x - minRockDropGap
          ) {
            valid = false;
            break;
          }
        }
        // Not too close to any other rock
        if (valid) {
          for (let j = 0; j < obstacles.length; j++) {
            if (j === obsIdx) continue;
            let other = obstacles[j];
            if (
              newX < other.x + obs.w + minRockGap &&
              newX + obs.w > other.x - minRockGap
            ) {
              valid = false;
              break;
            }
          }
        }
        tryCount++;
      } while (!valid && tryCount < 30);
      obs.x = newX;
    }
  }

  // --- Make droplets never stop coming: respawn only if off-screen ---
  for (let dropIdx = 0; dropIdx < droplets.length; dropIdx++) {
    let drop = droplets[dropIdx];
    drop.x -= speed;
    // Only respawn if droplet is off-screen (not just collected)
    if (drop.x + drop.w < 0) {
      let newX, valid, tryCount = 0;
      const maxTries = 10;
      do {
        newX = canvas.width + Math.random() * (canvas.width / 2);
        valid = true;
        // Not overlapping with any rock
        for (let obs of obstacles) {
          if (boxesOverlap(newX, drop.w, obs.x, obs.w)) {
            valid = false;
            break;
          }
        }
        // Not overlapping with other droplets, with buffer
        if (valid) {
          for (let j = 0; j < droplets.length; j++) {
            if (j === dropIdx) continue;
            let other = droplets[j];
            if (!other.collected && boxesOverlapWithBuffer(newX, drop.w, other.x, other.w, minDropBuffer)) {
              valid = false;
              break;
            }
          }
        }
        tryCount++;
      } while (!valid && tryCount < maxTries);
      if (valid) {
        drop.x = newX;
        drop.collected = false;
      } else {
        // Could not find a valid spot, skip respawn for now
        continue;
      }
    }
  }

  // Ball physics
  if (isJumping) {
    ballVY += GRAVITY;
    ballY += ballVY;
    if (ballY >= GROUND_Y) {
      ballY = GROUND_Y;
      isJumping = false;
      ballVY = 0;
      soundSystem.playLanding(); // ENERGETIC LANDING SOUND!
    }
  }

  // Collision: Ball with obstacles
  let ballX = 80 * (canvas.width / 805);
  let ballW = 45 * (canvas.width / 805);
  let ballH = 45 * (canvas.width / 805);
  for (let obs of obstacles) {
    if (
      collides(ballX, ballY, ballW, ballH, obs.x, obs.y, obs.w, obs.h)
    ) {
      soundSystem.playRockHit(); // ENERGETIC ROCK HIT SOUND!
      // Lose a life instead of restarting level immediately
      if (loseLife()) {
        // Game over - all lives lost
        return;
      } else {
        // Still have lives, restart level
        resetLevel();
        return requestAnimationFrame(gameLoop);
      }
    }
  }

  // Collision: Ball with droplets
  for (let drop of droplets) {
    if (
      !drop.collected &&
      collides(ballX, ballY, ballW, ballH, drop.x, drop.y, drop.w, drop.h)
    ) {
      drop.collected = true;
      score += 3;
      
      // ENERGETIC DROP COLLECTION SOUND with COMBO SYSTEM!
      const currentTime = Date.now();
      if (currentTime - lastDropTime < 1000) { // Within 1 second
        dropCombo++;
      } else {
        dropCombo = 1; // Reset combo
      }
      lastDropTime = currentTime;
      
      if (dropCombo > 1) {
        soundSystem.playCombo(dropCombo); // Escalating combo sound!
      } else {
        soundSystem.playDropCollect(); // Standard collection sound
      }
      
      updateScoreDisplay();

      // Win condition at 180 points (level 3 complete)
      if (score === 180) {
        soundSystem.playLevelComplete(); // TRIUMPHANT LEVEL COMPLETE SOUND!
        showCTA();
        return;
      }
      // Show fact card on every multiple of 45 points, but not at 180
      if (score > 0 && score % 45 === 0 && score !== 180 && !showFactCard) {
        // If level-up is also due, queue it
        if (score % 60 === 0 && level < 3) {
          pendingLevelUp = true;
        }
        soundSystem.playFactCard(); // ATTENTION-GRABBING FACT CARD SOUND!
        showFact();
        return;
      }
      // Level up every 60 points
      if (score > 0 && score % 60 === 0 && level < 3) {
        level++;
        speed += 1.7; // Faster speed increase per level
        soundSystem.playLevelUp(); // ENERGETIC LEVEL UP SOUND!
        updateLevelDisplay();
        showLetsGo();
        resetLevel();
        // Continue game after level up without returning
      }
    }
  }

  // Redraw background and objects
  drawOnlyMountains();

  requestAnimationFrame(gameLoop);
}

// Ball falling animation
function startBallFallIn() {
  // Start the ball above the canvas, drop it in with gravity
  ballY = -60 * (canvas.height / 393); // start well above
  ballVY = 0;
  ballFallingIn = true;
  isJumping = false;
  requestAnimationFrame(ballFallInLoop);
}

function ballFallInLoop() {
  if (!ballFallingIn) return;
  ballVY += GRAVITY;
  ballY += ballVY;
  if (ballY >= GROUND_Y) {
    ballY = GROUND_Y;
    ballVY = 0;
    ballFallingIn = false;
    // Now start the game for real
    gameRunning = true;
    requestAnimationFrame(gameLoop);
    return;
  }
  drawOnlyMountains();
  requestAnimationFrame(ballFallInLoop);
}

// --- EVENT HANDLERS ---
startBtn.addEventListener('click', () => {
  soundSystem.playButtonClick(); // SATISFYING BUTTON CLICK SOUND!
  soundSystem.playGameStart(); // EPIC GAME START SOUND!
  startBtn.classList.add('hidden');
  hideCTA();
  hideGameOver(); // NEW: Hide game over card if visible
  infoCard.classList.add('hidden');
  score = 0;
  level = 1;
  speed = 5.0; // Starting speed when game begins
  lives = 5; // NEW: Reset lives
  usedFacts = [];
  updateScoreDisplay();
  updateLevelDisplay();
  updateLivesDisplay(); // NEW: Update lives display
  resetLevel();
  showFactCard = false;
  showCtaCard = false;
  showGameOverCard = false; // NEW: Reset game over state
  // Animate ball falling in
  ballFallingIn = true;
  startBallFallIn();
});

canvas.addEventListener('pointerdown', () => {
  if (gameRunning && !isJumping && !ballFallingIn) {
    ballVY = JUMP_VELOCITY;
    isJumping = true;
    soundSystem.playJump(); // ENERGETIC JUMP SOUND!
  }
});

closeFactBtn.addEventListener('click', () => {
  soundSystem.playButtonClick(); // SATISFYING BUTTON CLICK SOUND!
  hideFact();
});

learnMoreBtn && learnMoreBtn.addEventListener('click', () => {
  soundSystem.playButtonClick(); // SATISFYING BUTTON CLICK SOUND!
  window.open('https://www.charitywater.org/about', '_blank');
});
donateBtn && donateBtn.addEventListener('click', () => {
  soundSystem.playButtonClick(); // SATISFYING BUTTON CLICK SOUND!
  window.open('https://www.charitywater.org/donate', '_blank');
});
replayBtn && replayBtn.addEventListener('click', () => {
  soundSystem.playButtonClick(); // SATISFYING BUTTON CLICK SOUND!
  hideCTA();
  startBtn.classList.remove('hidden');
});

// NEW: Restart game button event listener
restartGameBtn && restartGameBtn.addEventListener('click', () => {
  soundSystem.playButtonClick(); // SATISFYING BUTTON CLICK SOUND!
  resetGame();
  startBtn.classList.remove('hidden');
});

// --- INITIALIZE LEVEL BAR AND LET'S GO ---
(function setupLetsGo() {
  if (!document.getElementById('lets-go')) {
    const letsGoDiv = document.createElement('div');
    letsGoDiv.id = 'lets-go';
    letsGoDiv.textContent = "Let's go!";
    document.body.appendChild(letsGoDiv);
  }
})();

// Redraw on resize
function resizeCanvas() {
  const container = document.getElementById('canvas-container');
  let width = container.offsetWidth;
  let maxWidth = 852;
  if (window.innerWidth >= 900) {
    width = Math.min(window.innerWidth * 0.75, maxWidth);
  } else {
    width = window.innerWidth;
  }
  let height = Math.round(width * (393 / 852));
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  drawOnlyMountains();
}
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);
window.addEventListener('DOMContentLoaded', () => {
  resizeCanvas();
});

// --- Animated background elements ---
let sunAngle = 0;
const animatedClouds = [
  { x: 100, y: 60, w: 120, h: 60, speed: 0.12, img: cloudLightImg, offset: 0 },
  { x: 400, y: 40, w: 140, h: 70, speed: 0.08, img: cloudDarkImg, offset: 200 },
  { x: 650, y: 90, w: 110, h: 55, speed: 0.10, img: cloudRightImg, offset: 400 }
];

// --- ANIMATED BACKGROUND LOOP ---
function animateBackground() {
  sunAngle += 0.2; // Adjust sun movement speed

  // Move clouds
  for (let cloud of animatedClouds) {
    cloud.x -= cloud.speed * speed;
    // Respawn cloud to the right with a slight vertical offset
    if (cloud.x + cloud.w < 0) {
      cloud.x = canvas.width + Math.random() * 100;
      cloud.y = 60 + Math.sin(sunAngle + cloud.offset) * 10; // Wave motion
    }
  }

  requestAnimationFrame(animateBackground);
}

// --- START ANIMATION ON DOM CONTENT LOADED ---
window.addEventListener('DOMContentLoaded', () => {
  animateBackground();
  updateLivesDisplay(); // NEW: Initialize lives display
});