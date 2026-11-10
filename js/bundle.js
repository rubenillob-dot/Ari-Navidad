/**
 * Ari-Navidad Unified Production Bundle
 * Zero-dependency, file:// and http/https compatible.
 */
(function() {


// ==========================================
// MODULE: js/modules/snow.js
// ==========================================
/**
 * Ari-Navidad Snow Particles System
 * Interactive multi-layered canvas snowfall with wind drift and twinkling snowflakes.
 */

class SnowSystem {
  constructor(canvasId = 'snow-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.flakes = [];
    this.flakeCount = 140;
    this.animationFrameId = null;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.wind = 0.3;
    this.windAngle = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Create initial flakes distributed randomly across screen
    this.flakes = [];
    for (let i = 0; i < this.flakeCount; i++) {
      this.flakes.push(this.createFlake(true));
    }

    this.animate();
  }

  resize() {
    this.width = window.innerWidth || document.documentElement.clientWidth || 1280;
    this.height = window.innerHeight || document.documentElement.clientHeight || 800;
    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
  }

  createFlake(randomY = false) {
    const depth = Math.random(); // 0 is far/micro, 1 is close/large fluffy flake
    const isCyanTinted = Math.random() > 0.65;
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -15,
      radius: 1.2 + depth * 3.6,
      speedY: 0.7 + depth * 2.2,
      speedX: (Math.random() - 0.5) * 0.9,
      opacity: 0.35 + depth * 0.6,
      isCyanTinted,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.015 + Math.random() * 0.03,
      sparkle: Math.random() > 0.7,
      sparklePhase: Math.random() * Math.PI * 2
    };
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Subtle wind oscillation
    this.windAngle += 0.006;
    this.wind = Math.sin(this.windAngle) * 0.7 + 0.25;

    for (let i = 0; i < this.flakes.length; i++) {
      const flake = this.flakes[i];
      flake.sway += flake.swaySpeed;
      flake.y += flake.speedY;
      flake.x += flake.speedX + this.wind + Math.sin(flake.sway) * 0.7;

      // Sparkle pulse
      let alpha = flake.opacity;
      if (flake.sparkle) {
        flake.sparklePhase += 0.06;
        alpha = Math.max(0.15, flake.opacity * (0.6 + 0.4 * Math.sin(flake.sparklePhase)));
      }

      // Draw snowflake
      this.ctx.beginPath();
      this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);

      if (flake.isCyanTinted) {
        this.ctx.fillStyle = `rgba(210, 248, 255, ${alpha})`;
        this.ctx.shadowBlur = flake.radius > 2.8 ? 8 : 3;
        this.ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
      } else {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.shadowBlur = flake.radius > 2.8 ? 7 : 2;
        this.ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
      }

      this.ctx.fill();

      // Recycle flakes when out of bounds
      if (flake.y > this.height + 15 || flake.x < -25 || flake.x > this.width + 25) {
        Object.assign(flake, this.createFlake(false));
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}


// ==========================================
// MODULE: js/modules/confetti.js
// ==========================================
/**
 * Ari-Navidad Confetti Celebration FX
 * High-performance particle celebration for Victory Royale and Roulette Drops.
 */

class ConfettiCannon {
  constructor(canvasId = 'confetti-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  blast(count = 120) {
    const colors = [
      '#ff007f', // GTA Pink
      '#00f0ff', // GTA Cyan
      '#ffe600', // Fortnite Yellow
      '#00e676', // Xmas Green
      '#ff1744', // Xmas Red
      '#ffd700', // Gold
      '#ffffff'  // Pure White
    ];

    const originX = this.width / 2;
    const originY = this.height * 0.45;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 8 + Math.random() * 18;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 6,
        size: 6 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 14,
        gravity: 0.35,
        drag: 0.96,
        life: 1.0,
        decay: 0.008 + Math.random() * 0.012,
        isStar: Math.random() > 0.7
      });
    }

    if (!this.animationId) {
      this.animate();
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;

      if (p.life <= 0 || p.y > this.height) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.fillStyle = p.color;

      if (p.isStar) {
        // Draw 4-point sparkle star
        const s = p.size;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -s);
        this.ctx.quadraticCurveTo(0, 0, s, 0);
        this.ctx.quadraticCurveTo(0, 0, 0, s);
        this.ctx.quadraticCurveTo(0, 0, -s, 0);
        this.ctx.quadraticCurveTo(0, 0, 0, -s);
        this.ctx.fill();
      } else {
        // Draw confetti rectangle ribbon
        this.ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.animationId = null;
    }
  }
}

const confetti = new ConfettiCannon();


// ==========================================
// MODULE: js/modules/audio.js
// ==========================================
/**
 * Ari-Navidad Audio Module
 * Pure Web Audio API Synthesizer (Zero External MP3 Dependencies)
 * Provides background synthwave holiday music, sound effects and Christmas carol melodies.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.bgmGain = null;
    this.sfxGain = null;
    this.bgmInterval = null;
    this.activeMelodyTimeout = null;
    this.isPlayingMelody = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      console.warn('Web Audio API is not supported in this browser.');
      return;
    }
    this.ctx = new AudioContext();

    // Master SFX Gain
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.45;
    this.sfxGain.connect(this.ctx.destination);

    // Master BGM Gain
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = 0.22;
    this.bgmGain.connect(this.ctx.destination);
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.bgmGain) this.bgmGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      if (this.sfxGain) this.sfxGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      this.stopBGM();
      this.stopMelody();
    } else {
      if (this.bgmGain) this.bgmGain.gain.setTargetAtTime(0.22, this.ctx.currentTime, 0.05);
      if (this.sfxGain) this.sfxGain.gain.setTargetAtTime(0.45, this.ctx.currentTime, 0.05);
      this.startBGM();
    }
    return !this.isMuted;
  }

  // --- SHORT SOUND EFFECTS ---

  playTone(freq, type = 'sine', duration = 0.1, startTime = 0, gainLevel = 0.4) {
    if (this.isMuted || !this.ctx) return;
    const t0 = (startTime > 0 ? startTime : this.ctx.currentTime);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);

    gain.gain.setValueAtTime(gainLevel, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t0);
    osc.stop(t0 + duration);
  }

  playClick() {
    if (this.isMuted) return;
    this.ensureContext();
    this.playTone(600, 'triangle', 0.06, 0, 0.4);
    this.playTone(300, 'sine', 0.08, this.ctx.currentTime + 0.02, 0.3);
  }

  playHover() {
    if (this.isMuted) return;
    this.ensureContext();
    this.playTone(880, 'sine', 0.04, 0, 0.15);
  }

  playWheelTick(rateFraction = 1) {
    if (this.isMuted) return;
    this.ensureContext();
    const baseFreq = 750 + Math.random() * 80;
    // Mechanical click + bell chime
    this.playTone(baseFreq, 'triangle', 0.04, 0, 0.5);
    this.playTone(baseFreq * 2, 'sine', 0.03, 0, 0.25);
  }

  playCorrect() {
    if (this.isMuted) return;
    this.ensureContext();
    const t = this.ctx.currentTime;
    // Pleasant 3-note ascending chord
    this.playTone(523.25, 'triangle', 0.15, t, 0.4);        // C5
    this.playTone(659.25, 'triangle', 0.18, t + 0.1, 0.4);  // E5
    this.playTone(783.99, 'triangle', 0.35, t + 0.2, 0.5);  // G5
    this.playTone(1046.50, 'sine', 0.45, t + 0.3, 0.4);     // C6
  }

  playWrong() {
    if (this.isMuted) return;
    this.ensureContext();
    const t = this.ctx.currentTime;
    this.playTone(220, 'sawtooth', 0.2, t, 0.4);
    this.playTone(196, 'sawtooth', 0.35, t + 0.15, 0.45);
  }

  playWinFanfare() {
    if (this.isMuted) return;
    this.ensureContext();
    const t = this.ctx.currentTime;
    // GTA VI / Fortnite Victory Chime
    const notes = [
      { f: 523.25, d: 0.12, w: 0 },
      { f: 659.25, d: 0.12, w: 0.12 },
      { f: 783.99, d: 0.15, w: 0.24 },
      { f: 1046.5, d: 0.5, w: 0.38 },
      { f: 880.0, d: 0.18, w: 0.7 },
      { f: 1046.5, d: 0.7, w: 0.9 }
    ];
    notes.forEach(n => {
      this.playTone(n.f, 'triangle', n.d, t + n.w, 0.5);
      this.playTone(n.f * 1.5, 'sine', n.d * 0.8, t + n.w, 0.2);
    });
  }

  playLockShake() {
    if (this.isMuted) return;
    this.ensureContext();
    const t = this.ctx.currentTime;
    this.playTone(140, 'square', 0.12, t, 0.4);
    this.playTone(110, 'square', 0.15, t + 0.08, 0.45);
  }

  // --- BACKGROUND HOLIDAY SYNTHWAVE BGM ---
  startBGM() {
    if (this.isMuted || this.bgmInterval) return;
    this.ensureContext();

    // 8-bar holiday synthwave motif (Bassline + Glockenspiel bell arpeggios)
    const chords = [
      { bass: 130.81, bell: [523.25, 659.25, 783.99, 1046.5] }, // C
      { bass: 174.61, bell: [587.33, 698.46, 880.00, 1174.6] }, // F
      { bass: 146.83, bell: [587.33, 739.99, 880.00, 1174.6] }, // D
      { bass: 196.00, bell: [587.33, 783.99, 987.77, 1318.5] }  // G
    ];

    let chordIdx = 0;
    const playBar = () => {
      if (this.isMuted || !this.ctx) return;
      const t = this.ctx.currentTime;
      const c = chords[chordIdx % chords.length];
      chordIdx++;

      // Synth Bass
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(c.bass, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start(t);
      osc.stop(t + 1.8);

      // Festive Chimes
      c.bell.forEach((freq, idx) => {
        const bt = t + (idx * 0.45);
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(freq, bt);
        bGain.gain.setValueAtTime(0.04, bt);
        bGain.gain.exponentialRampToValueAtTime(0.0001, bt + 0.4);
        bOsc.connect(bGain);
        bGain.connect(this.bgmGain);
        bOsc.start(bt);
        bOsc.stop(bt + 0.4);
      });
    };

    playBar();
    this.bgmInterval = setInterval(playBar, 1900);
  }

  stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  // --- MINIGAME CHRISTMAS CAROL SYNTH MELODIES ---
  stopMelody() {
    this.isPlayingMelody = false;
    if (this.activeMelodyTimeout) {
      clearTimeout(this.activeMelodyTimeout);
      this.activeMelodyTimeout = null;
    }
  }

  playCarolMelody(carolId, onNoteCallback = null, onFinishCallback = null) {
    this.stopMelody();
    this.ensureContext();
    if (this.isMuted) {
      if (onFinishCallback) onFinishCallback();
      return;
    }

    const noteFrequencies = {
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
      'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      'C6': 1046.50, 'REST': 0
    };

    const songs = {
      // 1. Jingle Bells
      'jingle_bells': [
        ['E5', 0.22], ['E5', 0.22], ['E5', 0.45],
        ['E5', 0.22], ['E5', 0.22], ['E5', 0.45],
        ['E5', 0.22], ['G5', 0.22], ['C5', 0.3], ['D5', 0.15], ['E5', 0.6],
        ['F5', 0.22], ['F5', 0.22], ['F5', 0.3], ['F5', 0.15],
        ['F5', 0.22], ['E5', 0.22], ['E5', 0.22], ['E5', 0.22],
        ['G5', 0.22], ['G5', 0.22], ['F5', 0.22], ['D5', 0.22], ['C5', 0.6]
      ],
      // 2. All I Want for Christmas Is You
      'all_i_want': [
        ['G4', 0.3], ['B4', 0.3], ['D5', 0.3], ['G5', 0.35],
        ['B5', 0.45], ['A5', 0.3], ['G5', 0.35], ['E5', 0.35],
        ['G5', 0.25], ['G5', 0.25], ['G5', 0.25], ['A5', 0.35],
        ['B5', 0.35], ['G5', 0.35], ['E5', 0.45], ['D5', 0.6]
      ],
      // 3. Feliz Navidad
      'feliz_navidad': [
        ['E4', 0.2], ['A4', 0.35], ['C5', 0.25], ['B4', 0.25], ['A4', 0.35],
        ['F4', 0.2], ['D5', 0.45], ['C5', 0.25], ['B4', 0.25], ['A4', 0.2], ['G4', 0.45],
        ['E4', 0.2], ['E5', 0.45], ['D5', 0.25], ['C5', 0.25], ['B4', 0.2], ['A4', 0.6]
      ],
      // 4. Campana sobre Campana
      'campana': [
        ['G4', 0.3], ['G4', 0.3], ['A4', 0.3], ['G4', 0.3], ['C5', 0.4], ['B4', 0.6],
        ['G4', 0.3], ['A4', 0.3], ['G4', 0.3], ['F4', 0.3], ['E4', 0.6]
      ],
      // 5. Noche de Paz (Silent Night)
      'noche_de_paz': [
        ['G4', 0.4], ['A4', 0.25], ['G4', 0.35], ['E4', 0.6],
        ['G4', 0.4], ['A4', 0.25], ['G4', 0.35], ['E4', 0.6],
        ['D5', 0.4], ['D5', 0.3], ['B4', 0.6],
        ['C5', 0.4], ['C5', 0.3], ['G4', 0.6]
      ],
      // 6. Los Peces en el Río
      'peces_rio': [
        ['A4', 0.25], ['A4', 0.25], ['A4', 0.25], ['B4', 0.25], ['C5', 0.3], ['B4', 0.25], ['A4', 0.3],
        ['G4', 0.25], ['G4', 0.25], ['G4', 0.25], ['A4', 0.25], ['B4', 0.3], ['A4', 0.25], ['G4', 0.5]
      ],
      // 7. We Wish You A Merry Christmas
      'merry_christmas': [
        ['D4', 0.28], ['G4', 0.28], ['G4', 0.15], ['A4', 0.15], ['G4', 0.15], ['F#4', 0.15],
        ['E4', 0.28], ['C4', 0.28], ['E4', 0.28],
        ['A4', 0.28], ['A4', 0.15], ['B4', 0.15], ['A4', 0.15], ['G4', 0.15],
        ['F#4', 0.28], ['D4', 0.28], ['B4', 0.45], ['G4', 0.5]
      ],
      // 8. Mi Burrito Sabanero
      'burrito': [
        ['C5', 0.2], ['C5', 0.2], ['C5', 0.2], ['C5', 0.2], ['D5', 0.3], ['C5', 0.25], ['B4', 0.25], ['A4', 0.4],
        ['B4', 0.2], ['B4', 0.2], ['B4', 0.2], ['C5', 0.3], ['B4', 0.25], ['A4', 0.25], ['G4', 0.5]
      ],
      // 9. Rudolph the Red-Nosed Reindeer
      'rudolph': [
        ['G4', 0.25], ['A4', 0.25], ['G4', 0.25], ['E4', 0.45], ['C5', 0.25], ['A4', 0.25], ['G4', 0.6],
        ['G4', 0.25], ['A4', 0.25], ['G4', 0.25], ['A4', 0.25], ['G4', 0.4], ['C5', 0.7]
      ],
      // 10. El Tamborilero
      'tamborilero': [
        ['D4', 0.25], ['E4', 0.25], ['F4', 0.35], ['F4', 0.3], ['F4', 0.3], ['G4', 0.25], ['F4', 0.25], ['E4', 0.25], ['D4', 0.6],
        ['D4', 0.25], ['E4', 0.25], ['F4', 0.3], ['G4', 0.3], ['A4', 0.5], ['G4', 0.6]
      ],
      // 11. Blanca Navidad
      'blanca_navidad': [
        ['E4', 0.35], ['F4', 0.25], ['E4', 0.25], ['D#4', 0.25], ['E4', 0.35], ['F4', 0.35], ['F#4', 0.35], ['G4', 0.7],
        ['A4', 0.35], ['B4', 0.35], ['C5', 0.5], ['A4', 0.35], ['F4', 0.7]
      ],
      // 12. Last Christmas
      'last_christmas': [
        ['C5', 0.3], ['C5', 0.3], ['D5', 0.3], ['B4', 0.3],
        ['A4', 0.4], ['A4', 0.25], ['C5', 0.25], ['D5', 0.25],
        ['B4', 0.4], ['G4', 0.4], ['A4', 0.6]
      ],
      // 13. Santa Claus Llegó a la Ciudad
      'santa_claus': [
        ['G4', 0.25], ['E4', 0.25], ['F4', 0.25], ['G4', 0.3], ['G4', 0.3], ['G4', 0.4],
        ['A4', 0.25], ['F4', 0.25], ['G4', 0.25], ['A4', 0.3], ['A4', 0.3], ['A4', 0.4],
        ['B4', 0.25], ['G4', 0.25], ['A4', 0.25], ['B4', 0.3], ['C5', 0.6]
      ],
      // 14. Let It Snow
      'let_it_snow': [
        ['B4', 0.3], ['A4', 0.2], ['G4', 0.3], ['F#4', 0.2], ['G4', 0.3], ['E4', 0.5],
        ['A4', 0.3], ['G4', 0.2], ['F#4', 0.3], ['E4', 0.2], ['F#4', 0.3], ['D4', 0.5]
      ],
      // 15. Frosty the Snowman
      'frosty': [
        ['G4', 0.35], ['E4', 0.25], ['F4', 0.2], ['G4', 0.35], ['C5', 0.6],
        ['B4', 0.25], ['C5', 0.25], ['D5', 0.25], ['C5', 0.25], ['B4', 0.25], ['A4', 0.25], ['G4', 0.5]
      ],
      // 16. Hacia Belén va una Burra
      'burra_belen': [
        ['C5', 0.25], ['C5', 0.25], ['B4', 0.25], ['A4', 0.25], ['G4', 0.4],
        ['E4', 0.25], ['G4', 0.25], ['C5', 0.35], ['D5', 0.2], ['C5', 0.5]
      ],
      // 17. Ay del Chiquirritín
      'chiquirritin': [
        ['E4', 0.25], ['G4', 0.25], ['G4', 0.25], ['G4', 0.25], ['A4', 0.25], ['G4', 0.35], ['E4', 0.45],
        ['D4', 0.25], ['F4', 0.25], ['F4', 0.25], ['E4', 0.25], ['D4', 0.25], ['C4', 0.5]
      ],
      // 18. La Marimorena
      'marimorena': [
        ['G4', 0.25], ['G4', 0.25], ['G4', 0.25], ['A4', 0.25], ['B4', 0.3], ['C5', 0.5],
        ['C5', 0.25], ['B4', 0.25], ['A4', 0.25], ['G4', 0.25], ['F4', 0.25], ['E4', 0.5]
      ],
      // 19. Rockin' Around the Christmas Tree
      'rockin_tree': [
        ['G4', 0.25], ['E4', 0.25], ['G4', 0.25], ['E4', 0.25], ['C5', 0.4], ['B4', 0.25], ['A4', 0.4],
        ['F4', 0.25], ['D4', 0.25], ['F4', 0.25], ['D4', 0.25], ['B4', 0.4], ['A4', 0.25], ['G4', 0.5]
      ],
      // 20. Jingle Bell Rock
      'jingle_bell_rock': [
        ['D5', 0.25], ['D5', 0.25], ['D5', 0.3], ['B4', 0.25], ['B4', 0.25], ['B4', 0.3],
        ['A4', 0.25], ['B4', 0.25], ['A4', 0.25], ['F#4', 0.3], ['D4', 0.5]
      ]
    };

    const notes = songs[carolId] || songs['jingle_bells'];
    this.isPlayingMelody = true;
    let accumulatedTime = 0;

    notes.forEach(([note, duration], index) => {
      const noteDelay = accumulatedTime * 1000;
      accumulatedTime += duration + 0.08;

      const timerId = setTimeout(() => {
        if (!this.isPlayingMelody || this.isMuted) return;

        const freq = noteFrequencies[note];
        if (freq && freq > 0) {
          const t = this.ctx.currentTime;
          // Dual bell chime synth for Christmas feel
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc1.type = 'triangle';
          osc1.frequency.setValueAtTime(freq, t);

          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(freq * 2, t);

          gain.gain.setValueAtTime(0.35, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(this.sfxGain);

          osc1.start(t);
          osc2.start(t);
          osc1.stop(t + duration);
          osc2.stop(t + duration);

          if (onNoteCallback) onNoteCallback(note, index);
        }
      }, noteDelay);

      this.activeMelodyTimeout = timerId;
    });

    // Schedule finish callback
    setTimeout(() => {
      this.isPlayingMelody = false;
      if (onFinishCallback) onFinishCallback();
    }, accumulatedTime * 1000);
  }
}

const audio = new SoundEngine();


// ==========================================
// MODULE: js/modules/router.js
// ==========================================
/**
 * Ari-Navidad SPA Router Module
 * Controls zero-scroll screen transitions with fade animations and robust event binding.
 */


class ViewRouter {
  constructor() {
    this.currentViewId = 'view-lobby';
    this.viewChangeListeners = [];
    this.views = {};
  }

  init() {
    this.views = {
      'lobby': document.getElementById('view-lobby'),
      'minigame1': document.getElementById('view-minigame1'),
      'minigame2': document.getElementById('view-minigame2'),
      'roulette': document.getElementById('view-roulette')
    };

    const navBtnLobby = document.getElementById('nav-btn-lobby');
    const navBtnRoulette = document.getElementById('nav-btn-roulette');

    if (navBtnLobby) {
      navBtnLobby.onclick = (e) => {
        e.preventDefault();
        audio.playClick();
        this.navigateTo('lobby');
      };
    }

    if (navBtnRoulette) {
      navBtnRoulette.onclick = (e) => {
        e.preventDefault();
        audio.playClick();
        this.navigateTo('roulette');
      };
    }

    // Bind all ".btn-back-lobby" elements
    document.querySelectorAll('.btn-back-lobby').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        audio.playClick();
        this.navigateTo('lobby');
      };
    });
  }

  onViewChange(callback) {
    this.viewChangeListeners.push(callback);
  }

  navigateTo(viewKey) {
    if (!this.views || !this.views[viewKey]) {
      this.init();
    }

    const targetView = this.views[viewKey] || document.getElementById(`view-${viewKey}`);
    if (!targetView) {
      console.warn(`View "${viewKey}" not found.`);
      return;
    }

    // Hide all views
    document.querySelectorAll('.spa-view').forEach(v => {
      v.classList.remove('active-view');
      v.style.display = 'none';
      v.style.opacity = '0';
    });

    // Activate target
    targetView.classList.add('active-view');
    targetView.style.display = 'flex';
    targetView.style.opacity = '1';
    targetView.style.zIndex = '10';
    this.currentViewId = targetView.id;
    targetView.scrollTop = 0;

    // Notify listeners
    this.viewChangeListeners.forEach(fn => fn(viewKey));
  }
}

const router = new ViewRouter();


// ==========================================
// MODULE: js/modules/twitch-chat.js
// ==========================================
/**
 * Ari-Navidad Twitch Chat WebSocket Client
 * Native WebSocket connection to wss://irc-ws.chat.twitch.tv:443
 * Anonymous auth via justinfan, IRC tag parsing for display-name,
 * Map-based unique participant tracking per round, zero latency validation,
 * and visual triggers (Caja Destacada estilo IlloJuan & Live Feed).
 */


class TwitchChatBridge {
  constructor(options = {}) {
    this.channel = (options.channel || 'imarixu').toLowerCase().replace('#', '');
    this.wsUrl = 'wss://irc-ws.chat.twitch.tv:443';
    this.ws = null;
    this.isConnected = false;
    this.reconnectTimer = null;
    this.reconnectAttempts = 0;

    // Participant control per round: Map<userKey, { displayName, text, timestamp }>
    this.participantesRonda = new Map();

    // Round state
    this.activeAnswer = '';
    this.isRoundActive = false;

    // Callbacks
    this.onValidAnswerCallbacks = [];
    this.onStatusChangeCallbacks = [];
    this.onMessageCallbacks = [];

    // UI elements (Caja Destacada & Live Feed)
    this.currentVoterBox = null;
    this.currentVoterName = null;
    this.voterBoxTimeout = null;
    this.liveFeedList = null;
    this.liveFeedCounter = null;
    this.statusDot = null;
    this.statusText = null;

    this.initDOM();
    this.connect();
  }

  initDOM() {
    this.currentVoterBox = document.getElementById('currentVoterBox');
    this.currentVoterName = document.getElementById('currentVoterName');
    this.liveFeedList = document.getElementById('live-feed-list');
    this.liveFeedCounter = document.getElementById('live-feed-counter');
    this.statusDot = document.getElementById('twitch-ws-dot');
    this.statusText = document.getElementById('twitch-channel-display');
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.updateStatus(false, 'Conectando...');
    const randomJustin = Math.floor(10000 + Math.random() * 90000);
    const nick = `justinfan${randomJustin}`;

    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        console.log(`🟣 Twitch WS: Conectado a ${this.wsUrl}. Autenticando como ${nick}...`);
        this.isConnected = true;
        this.reconnectAttempts = 0;

        // 1. Request IRC capabilities (crucial for display-name, color, badges)
        this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
        // 2. Anonymous authentication
        this.ws.send('PASS SCHMOOPIE');
        this.ws.send(`NICK ${nick}`);
        // 3. Join channel
        this.ws.send(`JOIN #${this.channel}`);

        this.updateStatus(true, `#${this.channel}`);
      };

      this.ws.onmessage = (event) => {
        this.handleRawMessage(event.data);
      };

      this.ws.onerror = (err) => {
        console.warn('⚠️ Twitch WS Error:', err);
      };

      this.ws.onclose = () => {
        console.warn('🔌 Twitch WS Desconectado. Reintentando...');
        this.isConnected = false;
        this.updateStatus(false, 'Desconectado');
        this.scheduleReconnect();
      };
    } catch (e) {
      console.error('Error al instanciar WebSocket de Twitch:', e);
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    clearTimeout(this.reconnectTimer);
    const delay = Math.min(10000, 1500 * Math.pow(1.5, this.reconnectAttempts++));
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  updateStatus(connected, label) {
    if (this.statusDot) {
      this.statusDot.className = `twitch-status-dot ${connected ? 'connected' : 'disconnected'}`;
    }
    if (this.statusText) {
      this.statusText.textContent = label;
    }
    this.onStatusChangeCallbacks.forEach(cb => cb(connected, label));
  }

  /**
   * IRC Message Parser: extracts PRIVMSG, tags, display-name, and handles PING/PONG
   */
  handleRawMessage(rawData) {
    if (!rawData) return;
    const lines = rawData.split('\r\n');

    for (const line of lines) {
      if (!line) continue;

      // Keep-alive PING / PONG
      if (line.startsWith('PING')) {
        const pingPayload = line.slice(5) || ':tmi.twitch.tv';
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(`PONG ${pingPayload}`);
        }
        continue;
      }

      // Parse IRC PRIVMSG
      if (line.includes('PRIVMSG')) {
        this.parsePrivmsg(line);
      }
    }
  }

  parsePrivmsg(rawLine) {
    let tags = {};
    let line = rawLine;

    // Extract tags
    if (line.startsWith('@')) {
      const spaceIdx = line.indexOf(' ');
      const rawTags = line.slice(1, spaceIdx);
      line = line.slice(spaceIdx + 1);

      rawTags.split(';').forEach(tag => {
        const eqIdx = tag.indexOf('=');
        if (eqIdx !== -1) {
          const key = tag.slice(0, eqIdx);
          const val = tag.slice(eqIdx + 1);
          tags[key] = val;
        }
      });
    }

    // Extract message body and author
    const privmsgIdx = line.indexOf(' PRIVMSG ');
    if (privmsgIdx === -1) return;

    const prefix = line.slice(0, privmsgIdx);
    const rest = line.slice(privmsgIdx + 9);
    const colonIdx = rest.indexOf(' :');
    if (colonIdx === -1) return;

    const messageText = rest.slice(colonIdx + 2).trim();

    // Fallback nick from prefix :nick!nick@...
    let nick = 'Espectador';
    if (prefix.startsWith(':')) {
      const excl = prefix.indexOf('!');
      nick = excl !== -1 ? prefix.slice(1, excl) : prefix.slice(1);
    }

    const displayName = tags['display-name'] || nick;
    const userColor = tags['color'] || '#00f0ff';

    // Broadcast raw chat
    this.onMessageCallbacks.forEach(cb => cb(displayName, messageText, userColor));

    // Evaluate answer in active round
    this.processChatAnswer(displayName, messageText, userColor);
  }

  /**
   * Normalizes text (removes accents, punctuation, extra spaces)
   */
  normalizeText(str) {
    if (!str) return '';
    return str
      .toString()
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // removes accents
      .replace(/[^a-z0-9]/g, "");     // removes punctuation & symbols
  }

  /**
   * Starts a new round: clears participant map and sets the target answer
   */
  startRound(targetAnswer) {
    this.participantesRonda.clear();
    this.activeAnswer = this.normalizeText(targetAnswer);
    this.isRoundActive = true;

    // Reset Live Feed list for the new round
    if (this.liveFeedList) {
      this.liveFeedList.innerHTML = '';
    }
    if (this.liveFeedCounter) {
      this.liveFeedCounter.textContent = '0';
    }
  }

  /**
   * Closes active round answering window
   */
  endRound() {
    this.isRoundActive = false;
  }

  /**
   * Validates chat response against active target answer
   */
  processChatAnswer(displayName, text, userColor) {
    if (!this.isRoundActive || !this.activeAnswer) return;

    const normalizedGuess = this.normalizeText(text);
    if (!normalizedGuess) return;

    // Exact word match
    if (normalizedGuess === this.activeAnswer) {
      const userKey = displayName.toLowerCase();

      // Rule: Map control prevents duplicate answers in the same round
      if (this.participantesRonda.has(userKey)) {
        return; // Already registered in this round
      }

      // Register first valid response
      const entry = {
        displayName,
        userColor,
        text,
        timestamp: Date.now()
      };
      this.participantesRonda.set(userKey, entry);

      // Trigger UI visual feedback
      this.triggerCajaDestacada(displayName, userColor);
      this.addToLiveFeed(displayName, userColor, text);

      // Sound chime
      audio.playTone(880, 'triangle', 0.09, 0, 0.45);

      // Notify Minigame / subscribers
      this.onValidAnswerCallbacks.forEach(cb => cb(displayName, text, userColor));
    }
  }

  /**
   * Caja Destacada (Estilo IlloJuan): Pops in prominently for 1.5s with scale animation
   */
  triggerCajaDestacada(displayName, userColor) {
    if (!this.currentVoterBox) {
      this.currentVoterBox = document.getElementById('currentVoterBox');
      this.currentVoterName = document.getElementById('currentVoterName');
    }
    if (!this.currentVoterBox || !this.currentVoterName) return;

    this.currentVoterName.textContent = displayName;
    if (userColor) {
      this.currentVoterName.style.color = userColor;
    }

    // Reset and trigger popIn animation
    this.currentVoterBox.classList.remove('voter-box-show', 'voter-box-popin');
    void this.currentVoterBox.offsetWidth; // Reflow
    this.currentVoterBox.classList.add('voter-box-show', 'voter-box-popin');

    clearTimeout(this.voterBoxTimeout);
    this.voterBoxTimeout = setTimeout(() => {
      this.currentVoterBox.classList.remove('voter-box-show', 'voter-box-popin');
    }, 1500);
  }

  /**
   * Feed en vivo ('live-votos-feed'): Stacks names in real-time with auto-scroll
   */
  addToLiveFeed(displayName, userColor, text) {
    if (!this.liveFeedList) {
      this.liveFeedList = document.getElementById('live-feed-list');
      this.liveFeedCounter = document.getElementById('live-feed-counter');
    }
    if (!this.liveFeedList) return;

    const item = document.createElement('div');
    item.className = 'live-voto-item';
    item.innerHTML = `
      <span class="voto-icon">🎮</span>
      <span class="voto-user" style="color: ${userColor || '#00f0ff'};">${displayName}</span>
      <span class="voto-badge">+1 pto</span>
    `;

    this.liveFeedList.appendChild(item);
    this.liveFeedList.scrollTop = this.liveFeedList.scrollHeight;

    if (this.liveFeedCounter) {
      this.liveFeedCounter.textContent = `${this.participantesRonda.size}`;
    }
  }

  onValidAnswer(cb) {
    this.onValidAnswerCallbacks.push(cb);
  }

  onMessage(cb) {
    this.onMessageCallbacks.push(cb);
  }

  onStatusChange(cb) {
    this.onStatusChangeCallbacks.push(cb);
  }
}

const twitchChat = new TwitchChatBridge({ channel: 'imarixu' });


// ==========================================
// MODULE: js/modules/roulette.js
// ==========================================
/**
 * Ari-Navidad Christmas Roulette Module
 * Exact mathematical drop rates calculation, 24-slice canvas wheel with alternating prizes,
 * blinking fairy light bezel, pointer tick physics, demo mode, and victory celebration.
 */



class ChristmasRoulette {
  constructor(state, onPrizeWonCallback) {
    this.state = state;
    this.onPrizeWonCallback = onPrizeWonCallback;

    // DOM Elements
    this.canvas = document.getElementById('wheel-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.bezel = document.getElementById('wheel-bezel');
    this.lightsRing = document.getElementById('wheel-lights-ring');
    this.pointerEl = document.querySelector('.wheel-pointer-triangle');
    this.spinBtn = document.getElementById('btn-spin-wheel');
    this.demoBtn = document.getElementById('btn-demo-spin');
    this.feedbackEl = document.getElementById('spin-status-feedback');
    this.oddsContainer = document.getElementById('odds-list-container');
    this.headerSpinCount = document.getElementById('header-spin-count');

    // EXACT PROBABILITY TABLE (DROP RATES) - Sum = 100%
    this.prizes = [
      { id: 'vip', name: 'VIP del canal', rate: 1.0, icon: '👑', rarity: 'MÍTICO', color: '#ffd700', textColor: '#1a1000' },
      { id: 'sub', name: 'Te regalo sub del canal', rate: 1.0, icon: '🎁', rarity: 'MÍTICO', color: '#ff007f', textColor: '#ffffff' },
      { id: 'skin', name: 'Skin tienda Fortnite', rate: 3.0, icon: '👕', rarity: 'LEGENDARIO', color: '#00f0ff', textColor: '#041726' },
      { id: 'pico', name: 'Pico de la tienda', rate: 10.0, icon: '⛏️', rarity: 'ÉPICO', color: '#aa22ff', textColor: '#ffffff' },
      { id: 'mochila', name: 'Mochila de la tienda', rate: 10.0, icon: '🎒', rarity: 'ÉPICO', color: '#ff6600', textColor: '#ffffff' },
      { id: 'baile', name: 'Baile de la tienda', rate: 10.0, icon: '💃', rarity: 'ÉPICO', color: '#00e676', textColor: '#032612' },
      { id: 'ticket2', name: '+2 Tickets Dorados', rate: 30.0, icon: '🎟️', rarity: 'COMÚN', color: '#ffaa00', textColor: '#ffffff' },
      { id: 'ticket1', name: '+1 Ticket Dorado', rate: 35.0, icon: '🎫', rarity: 'COMÚN', color: '#ff2e93', textColor: '#ffffff' }
    ];

    // 24 Wheel Slices Mapping: Distributed so identical items are never adjacent
    this.slices = [
      this.prizes.find(p => p.id === 'vip'),     // 0: VIP 👑 (1%)
      this.prizes.find(p => p.id === 'ticket1'), // 1: +1 Ticket 🎫 (35%)
      this.prizes.find(p => p.id === 'pico'),    // 2: Pico ⛏️
      this.prizes.find(p => p.id === 'ticket2'), // 3: +2 Tickets 🎟️ (30%)
      this.prizes.find(p => p.id === 'mochila'), // 4: Mochila 🎒
      this.prizes.find(p => p.id === 'ticket1'), // 5: +1 Ticket 🎫
      this.prizes.find(p => p.id === 'skin'),    // 6: Skin Fortnite 👕 (3%)
      this.prizes.find(p => p.id === 'ticket2'), // 7: +2 Tickets 🎟️
      this.prizes.find(p => p.id === 'baile'),   // 8: Baile 💃
      this.prizes.find(p => p.id === 'ticket1'), // 9: +1 Ticket 🎫
      this.prizes.find(p => p.id === 'sub'),     // 10: Sub Regalo 🎁 (1%)
      this.prizes.find(p => p.id === 'ticket2'), // 11: +2 Tickets 🎟️
      this.prizes.find(p => p.id === 'pico'),    // 12: Pico ⛏️
      this.prizes.find(p => p.id === 'ticket1'), // 13: +1 Ticket 🎫
      this.prizes.find(p => p.id === 'mochila'), // 14: Mochila 🎒
      this.prizes.find(p => p.id === 'ticket2'), // 15: +2 Tickets 🎟️
      this.prizes.find(p => p.id === 'skin'),    // 16: Skin Fortnite 👕
      this.prizes.find(p => p.id === 'ticket1'), // 17: +1 Ticket 🎫
      this.prizes.find(p => p.id === 'baile'),   // 18: Baile 💃
      this.prizes.find(p => p.id === 'ticket2'), // 19: +2 Tickets 🎟️
      this.prizes.find(p => p.id === 'pico'),    // 20: Pico ⛏️
      this.prizes.find(p => p.id === 'ticket1'), // 21: +1 Ticket 🎫
      this.prizes.find(p => p.id === 'mochila'), // 22: Mochila 🎒
      this.prizes.find(p => p.id === 'baile')    // 23: Baile 💃
    ];

    this.numSlices = this.slices.length; // 24
    this.sliceAngle = (Math.PI * 2) / this.numSlices;

    // Wheel animation state
    this.currentRotation = 0; // In radians
    this.isSpinning = false;
    this.lastTickSlice = -1;

    this.init();
  }

  init() {
    this.setupBezelLights();
    this.populateOddsPanel();
    this.drawWheel(0);
    this.updateControlsState();

    if (this.spinBtn) {
      this.spinBtn.onclick = (e) => {
        e.preventDefault();
        this.handleSpinClick(false);
      };
    }

    if (this.demoBtn) {
      this.demoBtn.onclick = (e) => {
        e.preventDefault();
        this.handleSpinClick(true);
      };
    }
  }

  /**
   * Generates circular ring of 18 fairy LED lights around the bezel
   */
  setupBezelLights() {
    if (!this.lightsRing) return;
    this.lightsRing.innerHTML = '';
    const lightCount = 18;
    const radius = 185;
    const centerX = 200;
    const centerY = 200;
    const bulbClasses = ['bulb-red', 'bulb-gold', 'bulb-green', 'bulb-cyan', 'bulb-pink'];

    for (let i = 0; i < lightCount; i++) {
      const angle = (i / lightCount) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      const dot = document.createElement('div');
      dot.className = `wheel-light-dot ${bulbClasses[i % bulbClasses.length]}`;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      this.lightsRing.appendChild(dot);
    }
  }

  /**
   * Populates the Right-side Drop Rates & Odds Legend Panel
   */
  populateOddsPanel() {
    if (!this.oddsContainer) return;
    this.oddsContainer.innerHTML = '';

    const rarityClassMap = {
      'MÍTICO': 'rarity-mythic',
      'LEGENDARIO': 'rarity-legendary',
      'ÉPICO': 'rarity-epic',
      'COMÚN': 'rarity-common'
    };

    const badgeClassMap = {
      'MÍTICO': 'rate-badge-mythic',
      'LEGENDARIO': 'rate-badge-legendary',
      'ÉPICO': 'rate-badge-epic',
      'COMÚN': 'rate-badge-common'
    };

    this.prizes.forEach(prize => {
      const row = document.createElement('div');
      row.className = 'odd-item-row';

      let rarityClass = rarityClassMap[prize.rarity] || 'rarity-common';
      let badgeClass = badgeClassMap[prize.rarity] || 'rate-badge-common';

      if (prize.id === 'ticket2') {
        rarityClass = 'rarity-ticket-gold';
        badgeClass = 'rate-badge-ticket-gold';
      }

      row.innerHTML = `
        <div class="odd-left">
          <div class="odd-icon" style="border-left: 3px solid ${prize.color};">
            ${prize.icon}
          </div>
          <div class="odd-info">
            <span class="odd-name">${prize.name}</span>
            <span class="odd-rarity-pill ${rarityClass}">★ ${prize.rarity}</span>
          </div>
        </div>
        <div class="odd-right">
          <span class="odd-rate-badge ${badgeClass}">${prize.rate}%</span>
        </div>
      `;
      this.oddsContainer.appendChild(row);
    });
  }

  /**
   * Updates Spin button and feedback note based on state
   */
  updateControlsState() {
    if (this.headerSpinCount) {
      this.headerSpinCount.textContent = this.state.spinsAvailable;
    }

    if (!this.spinBtn || !this.feedbackEl) return;

    if (this.isSpinning) {
      this.spinBtn.disabled = true;
      if (this.demoBtn) this.demoBtn.disabled = true;
      this.feedbackEl.textContent = '🎰 ¡GIRANDO RULETA NAVIDEÑA...! ¡MUCHA SUERTE!';
      this.feedbackEl.style.color = 'var(--fn-yellow)';
      return;
    }

    if (this.demoBtn) this.demoBtn.disabled = false;

    if (this.state.spinsAvailable > 0) {
      this.spinBtn.disabled = false;
      this.feedbackEl.textContent = `⭐ ¡TIENES ${this.state.spinsAvailable} TIRADA OFICIAL LISTA! ¡HAZ CLICK PARA GIRAR!`;
      this.feedbackEl.style.color = 'var(--xmas-green)';
    } else if (this.state.hasWonMinigame) {
      this.spinBtn.disabled = true;
      this.feedbackEl.textContent = '✅ Ya has reclamado tu tirada oficial. ¡Juega otra ronda en el Minijuego 1 o prueba el modo Demo!';
      this.feedbackEl.style.color = 'var(--gta-cyan)';
    } else {
      this.spinBtn.disabled = true;
      this.feedbackEl.textContent = '🔒 Tirada oficial bloqueada: Gana el Minijuego 1 (o pulsa abajo para probar en Modo Demo)';
      this.feedbackEl.style.color = '#ff99aa';
    }
  }

  /**
   * Renders the 24-slice wheel onto the canvas
   */
  drawWheel(rotation = 0) {
    if (!this.canvas) {
      this.canvas = document.getElementById('wheel-canvas');
      if (this.canvas) this.ctx = this.canvas.getContext('2d');
    }
    if (!this.ctx) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2;

    this.ctx.clearRect(0, 0, width, height);
    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(rotation);

    for (let i = 0; i < this.numSlices; i++) {
      const startAngle = i * this.sliceAngle;
      const endAngle = startAngle + this.sliceAngle;
      const prize = this.slices[i];

      // Draw Slice Sector
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.arc(0, 0, radius, startAngle, endAngle);
      this.ctx.closePath();

      // Alternate dark tone overlay on even slices for extra contrast
      this.ctx.fillStyle = prize.color;
      this.ctx.fill();

      if (i % 2 === 0) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        this.ctx.fill();
      }

      // Slice Borders
      this.ctx.strokeStyle = '#05020c';
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();

      // Draw Outer Rim Pegs / Bulbs
      const pegAngle = startAngle;
      const pegX = Math.cos(pegAngle) * (radius - 8);
      const pegY = Math.sin(pegAngle) * (radius - 8);
      this.ctx.beginPath();
      this.ctx.arc(pegX, pegY, 3.5, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffd700';
      this.ctx.fill();
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      // Text and Icon along slice radius
      this.ctx.save();
      this.ctx.rotate(startAngle + this.sliceAngle / 2);
      this.ctx.textAlign = 'right';
      this.ctx.textBaseline = 'middle';

      // Icon
      this.ctx.font = '20px sans-serif';
      this.ctx.fillText(prize.icon, radius - 16, 0);

      // Label (abbreviated if long)
      this.ctx.font = 'bold 11px "Montserrat", sans-serif';
      this.ctx.fillStyle = prize.textColor;
      this.ctx.shadowColor = 'rgba(0,0,0,0.7)';
      this.ctx.shadowBlur = 3;

      let label = prize.name;
      if (label.length > 15) {
        label = label.substring(0, 14) + '..';
      }
      this.ctx.fillText(label, radius - 44, 0);

      this.ctx.restore();
    }

    this.ctx.restore();
  }

  /**
   * EXACT MATHEMATICAL DROP RATE LOGIC
   * Returns a prize chosen strictly according to the defined percentages:
   * 1% VIP, 1% Sub, 3% Skin, 10% Pico, 10% Mochila, 10% Baile, 35% Ticket+1, 30% Ticket+2
   */
  pickWeightedPrize() {
    const roll = Math.random() * 100; // [0, 100)
    let cumulative = 0;

    for (const prize of this.prizes) {
      cumulative += prize.rate;
      if (roll < cumulative) {
        return prize;
      }
    }
    return this.prizes[this.prizes.length - 1];
  }

  /**
   * Spin Handler: Enforces 1 spin per victory and triggers deceleration
   * @param {boolean} isDemo - Whether this is a test spin
   */
  handleSpinClick(isDemo = false) {
    if (this.isSpinning) return;

    if (!isDemo && this.state.spinsAvailable <= 0) {
      audio.playLockShake();
      alert('¡Para la tirada oficial necesitas superar el Minijuego 1! Puedes usar el botón "Modo Prueba" para probar el giro ahora mismo.');
      return;
    }

    if (!isDemo) {
      // Deduct spin token
      this.state.spinsAvailable = Math.max(0, this.state.spinsAvailable - 1);
    }

    this.updateControlsState();

    // 1. Math selection: choose winning prize with EXACT drop rates
    const wonPrize = this.pickWeightedPrize();

    // 2. Find all slices on the wheel that match this won prize
    const matchingSliceIndices = [];
    this.slices.forEach((slice, idx) => {
      if (slice.id === wonPrize.id) {
        matchingSliceIndices.push(idx);
      }
    });

    // Randomly pick one of the matching slices on the wheel to land on
    const targetSliceIndex = matchingSliceIndices[
      Math.floor(Math.random() * matchingSliceIndices.length)
    ];

    // 3. Calculate target stopping rotation:
    // Top pointer is at -90° (or 270° = 1.5 * PI).
    const sliceCenterAngle = (targetSliceIndex + 0.5) * this.sliceAngle;
    const pointerAngle = 1.5 * Math.PI;

    // Small random jitter within ±30% of half-slice width
    const jitter = (Math.random() - 0.5) * (this.sliceAngle * 0.6);

    let targetAngleMod = (pointerAngle - sliceCenterAngle + jitter) % (Math.PI * 2);
    if (targetAngleMod < 0) targetAngleMod += Math.PI * 2;

    // Number of full revolutions (6 to 8 full spins for excitement)
    const fullRevolutions = 6 + Math.floor(Math.random() * 2);
    const startAngle = this.currentRotation;
    const currentAngleMod = startAngle % (Math.PI * 2);

    let deltaAngle = targetAngleMod - currentAngleMod;
    if (deltaAngle <= 0) deltaAngle += Math.PI * 2;

    const totalRotationDelta = fullRevolutions * Math.PI * 2 + deltaAngle;
    const targetTotalAngle = startAngle + totalRotationDelta;

    // 4. Animate with cubic deceleration physics
    this.spinToAngle(startAngle, targetTotalAngle, 5200, () => {
      this.onSpinComplete(wonPrize, isDemo);
    });
  }

  spinToAngle(startAngle, targetAngle, durationMs, onFinished) {
    this.isSpinning = true;
    this.updateControlsState();
    const startTime = performance.now();

    const animateFrame = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Quartic ease-out for realistic friction deceleration
      const ease = 1 - Math.pow(1 - progress, 4);
      const angle = startAngle + (targetAngle - startAngle) * ease;
      this.currentRotation = angle;
      this.drawWheel(angle);

      // Check slice tick for sound & pointer wobble
      const pointerAngle = 1.5 * Math.PI;
      const currentWheelSlice = Math.floor(
        ((pointerAngle - angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) / this.sliceAngle
      );

      if (currentWheelSlice !== this.lastTickSlice) {
        this.lastTickSlice = currentWheelSlice;
        audio.playWheelTick();
        if (this.pointerEl) {
          this.pointerEl.classList.remove('flapper-tick-active');
          void this.pointerEl.offsetWidth; // Trigger reflow
          this.pointerEl.classList.add('flapper-tick-active');
        }
      }

      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      } else {
        this.isSpinning = false;
        this.updateControlsState();
        if (onFinished) onFinished();
      }
    };

    requestAnimationFrame(animateFrame);
  }

  onSpinComplete(wonPrize, isDemo) {
    audio.playWinFanfare();
    confetti.blast(180);

    // Save prize in state
    this.state.prizesWon.push({
      prize: wonPrize,
      isDemo: isDemo,
      date: new Date().toLocaleTimeString()
    });

    if (this.onPrizeWonCallback) {
      this.onPrizeWonCallback(wonPrize, isDemo);
    }
  }
}


// ==========================================
// MODULE: js/modules/minigame1.js
// ==========================================
/**
 * Ari-Navidad Minigame 1: Adivina la Canción Navideña
 * Neon progress timer bar, 4 Fortnite comic response buttons, synth audio playback,
 * score validation, and unlocking the unique spin for the Christmas Roulette!
 */



class MinigameSongGuesser {
  constructor(state, onVictoryCallback) {
    this.state = state;
    this.onVictoryCallback = onVictoryCallback;

    // DOM Elements
    this.roundDisplay = document.getElementById('quiz-round-display');
    this.scoreDisplay = document.getElementById('quiz-score-display');
    this.timerDisplay = document.getElementById('quiz-timer-display');
    this.timerFill = document.getElementById('quiz-timer-fill');
    this.timerBarText = document.getElementById('timer-bar-text');
    this.vinylDisc = document.getElementById('quiz-vinyl');
    this.answersContainer = document.getElementById('quiz-answers-container');
    this.btnReplay = document.getElementById('btn-replay-song');
    this.btnStartRound = document.getElementById('btn-start-round-m1');
    this.playerStatusText = document.getElementById('player-status-text');
    this.playerDeck = document.getElementById('quiz-player-deck');

    // Quiz Questions Database - 20 Rondas Festivas
    this.questions = [
      {
        melodyId: 'jingle_bells',
        title: 'Ronda 1: Villancico Universal',
        options: [
          'Jingle Bells',
          'Campana sobre Campana',
          'Noche de Paz',
          'El Tamborilero'
        ],
        correctIndex: 0
      },
      {
        melodyId: 'all_i_want',
        title: 'Ronda 2: Himno Pop de Navidad',
        options: [
          'Santa Tell Me',
          'All I Want for Christmas Is You',
          'Let It Snow! Let It Snow!',
          'Blanca Navidad'
        ],
        correctIndex: 1
      },
      {
        melodyId: 'feliz_navidad',
        title: 'Ronda 3: Clásico Latino Bilingüe',
        options: [
          'Mi Burrito Sabanero',
          'Los Peces en el Río',
          'Feliz Navidad (José Feliciano)',
          'Rodolfo el Reno'
        ],
        correctIndex: 2
      },
      {
        melodyId: 'campana',
        title: 'Ronda 4: Tradición Española',
        options: [
          'Campana sobre Campana',
          'La Marimorena',
          'Ay del Chiquirritín',
          'El Tamborilero'
        ],
        correctIndex: 0
      },
      {
        melodyId: 'noche_de_paz',
        title: 'Ronda 5: La Balada Más Serena',
        options: [
          'Blanca Navidad',
          'Noche de Paz (Silent Night)',
          'Santa Claus Llegó a la Ciudad',
          'Hacia Belén va una Burra'
        ],
        correctIndex: 1
      },
      {
        melodyId: 'peces_rio',
        title: 'Ronda 6: Río de Ilusión',
        options: [
          'El Tamborilero',
          'Los Peces en el Río',
          'Mi Burrito Sabanero',
          'Jingle Bell Rock'
        ],
        correctIndex: 1
      },
      {
        melodyId: 'merry_christmas',
        title: 'Ronda 7: Saludo Festivo',
        options: [
          'Deck the Halls',
          'Rudolph the Red-Nosed Reindeer',
          'We Wish You a Merry Christmas',
          'Last Christmas'
        ],
        correctIndex: 2
      },
      {
        melodyId: 'burrito',
        title: 'Ronda 8: Camino de Belén',
        options: [
          'Mi Burrito Sabanero',
          'Campana sobre Campana',
          'La Marimorena',
          'Feliz Navidad'
        ],
        correctIndex: 0
      },
      {
        melodyId: 'rudolph',
        title: 'Ronda 9: La Nariz Brillante',
        options: [
          'Frosty the Snowman',
          'Rodolfo el Reno (Rudolph)',
          'Santa Claus Llegó a la Ciudad',
          'Jingle Bells'
        ],
        correctIndex: 1
      },
      {
        melodyId: 'tamborilero',
        title: 'Ronda 10: Rom Pom Pom Pom',
        options: [
          'Los Peces en el Río',
          'Noche de Paz',
          'El Tamborilero',
          'Ay del Chiquirritín'
        ],
        correctIndex: 2
      },
      {
        melodyId: 'blanca_navidad',
        title: 'Ronda 11: Paisaje Nevado',
        options: [
          'Blanca Navidad (White Christmas)',
          'Let It Snow!',
          'Winter Wonderland',
          'Last Christmas'
        ],
        correctIndex: 0
      },
      {
        melodyId: 'last_christmas',
        title: 'Ronda 12: Desamor en Nochebuena',
        options: [
          'All I Want for Christmas Is You',
          'Santa Tell Me',
          'Last Christmas (Wham!)',
          'Rockin\' Around the Christmas Tree'
        ],
        correctIndex: 2
      },
      {
        melodyId: 'santa_claus',
        title: 'Ronda 13: El Trineo se Acerca',
        options: [
          'Jingle Bell Rock',
          'Santa Claus Llegó a la Ciudad',
          'Frosty the Snowman',
          'Deck the Halls'
        ],
        correctIndex: 1
      },
      {
        melodyId: 'let_it_snow',
        title: 'Ronda 14: Tormenta en Leonida',
        options: [
          'Let It Snow! Let It Snow!',
          'White Christmas',
          'Winter Wonderland',
          'Sleigh Ride'
        ],
        correctIndex: 0
      },
      {
        melodyId: 'frosty',
        title: 'Ronda 15: Muñeco de Nieve',
        options: [
          'Rodolfo el Reno',
          'Frosty the Snowman',
          'El Grinch',
          'Jack Frost'
        ],
        correctIndex: 1
      },
      {
        melodyId: 'burra_belen',
        title: 'Ronda 16: Rin Rin Remendaba',
        options: [
          'Mi Burrito Sabanero',
          'Campana sobre Campana',
          'Hacia Belén va una Burra',
          'Los Peces en el Río'
        ],
        correctIndex: 2
      },
      {
        melodyId: 'chiquirritin',
        title: 'Ronda 17: Metidito entre Pajas',
        options: [
          'Ay del Chiquirritín',
          'La Marimorena',
          'El Tamborilero',
          'Noche de Paz'
        ],
        correctIndex: 0
      },
      {
        melodyId: 'marimorena',
        title: 'Ronda 18: Noche de Fiesta',
        options: [
          'Los Peces en el Río',
          'Campana sobre Campana',
          'La Marimorena (Ande, Ande)',
          'Hacia Belén va una Burra'
        ],
        correctIndex: 2
      },
      {
        melodyId: 'rockin_tree',
        title: 'Ronda 19: Bailando alrededor del Árbol',
        options: [
          'Jingle Bell Rock',
          'Rockin\' Around the Christmas Tree',
          'Run Rudolph Run',
          'Last Christmas'
        ],
        correctIndex: 1
      },
      {
        melodyId: 'jingle_bell_rock',
        title: 'Ronda 20: Gran Final Rockero',
        options: [
          'Jingle Bells',
          'Rockin\' Around the Christmas Tree',
          'Jingle Bell Rock',
          'Santa Claus Llegó a la Ciudad'
        ],
        correctIndex: 2
      }
    ];

    this.currentQuestionIdx = 0;
    this.score = 0;
    this.timeLeft = 15;
    this.timerInterval = null;
    this.isAnsweringLocked = true;
    this.isRoundRunning = false;
    this.quizFinished = false;

    this.init();
  }

  init() {
    if (this.btnStartRound) {
      this.btnStartRound.addEventListener('click', () => {
        audio.playClick();
        this.onStartRoundBtnClicked();
      });
    }

    if (this.btnReplay) {
      this.btnReplay.addEventListener('click', () => {
        audio.playClick();
        this.playCurrentMelody();
      });
    }

    // Bind Answer Buttons
    const buttons = this.answersContainer.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (this.isAnsweringLocked || !this.isRoundRunning) return;
        const selectedIndex = parseInt(btn.getAttribute('data-index'), 10);
        this.handleAnswer(selectedIndex, btn);
      });
    });
  }

  startQuiz() {
    this.currentQuestionIdx = 0;
    this.score = 0;
    this.quizFinished = false;
    this.isAnsweringLocked = true;
    this.isRoundRunning = false;
    this.stopTimer();
    audio.stopMelody();
    this.updateHUD();
    this.setupQuestion(0);
  }

  updateHUD() {
    if (this.roundDisplay) {
      this.roundDisplay.textContent = `${this.currentQuestionIdx + 1} / ${this.questions.length}`;
    }
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = `${this.score} / ${this.questions.length} (Meta: 10)`;
    }
  }

  setupQuestion(index) {
    this.currentQuestionIdx = index;
    this.isRoundRunning = false;
    this.isAnsweringLocked = true;
    this.stopTimer();
    audio.stopMelody();
    this.updateHUD();

    const q = this.questions[index];

    // Reset Answer Buttons in waiting state
    const buttons = this.answersContainer.querySelectorAll('.answer-btn');
    buttons.forEach((btn, i) => {
      btn.classList.remove('btn-correct', 'btn-wrong');
      btn.disabled = true; // Disabled until round starts
      const textSpan = btn.querySelector('.btn-answer-text');
      if (textSpan) textSpan.textContent = q.options[i];
    });

    // Reset Timer Display to 15s (stopped)
    this.timeLeft = 15;
    if (this.timerDisplay) this.timerDisplay.textContent = '15s';
    if (this.timerFill) {
      this.timerFill.style.width = '100%';
      this.timerFill.classList.remove('urgent');
    }
    if (this.timerBarText) this.timerBarText.textContent = '100%';

    // Vinyl and Deck stopped
    if (this.vinylDisc) this.vinylDisc.classList.remove('playing');
    if (this.playerDeck) this.playerDeck.classList.remove('playing');

    // Show Start Round Button & Hide Replay Button
    if (this.btnStartRound) {
      this.btnStartRound.style.display = 'inline-flex';
      this.btnStartRound.innerHTML = `<span>▶</span> ¡EMPEZAR RONDA ${index + 1} / ${this.questions.length}!`;
    }
    if (this.btnReplay) {
      this.btnReplay.style.display = 'none';
    }

    if (this.playerStatusText) {
      this.playerStatusText.textContent = `👉 Pulsa "▶ ¡EMPEZAR RONDA ${index + 1}!" para escuchar la melodía navideña.`;
    }
  }

  onStartRoundBtnClicked() {
    if (this.quizFinished) {
      this.startQuiz();
      return;
    }

    if (!this.isRoundRunning) {
      this.startCurrentRound();
    }
  }

  startCurrentRound() {
    this.isRoundRunning = true;
    this.isAnsweringLocked = false;

    // Enable answer buttons
    const buttons = this.answersContainer.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
      btn.disabled = false;
    });

    // Hide Start Button, Show Replay Button
    if (this.btnStartRound) {
      this.btnStartRound.style.display = 'none';
    }
    if (this.btnReplay) {
      this.btnReplay.style.display = 'inline-flex';
    }

    // Start 15s countdown
    this.startTimer(15);

    // Play synthesized melody
    this.playCurrentMelody();
  }

  playCurrentMelody() {
    const q = this.questions[this.currentQuestionIdx];
    if (!q) return;

    if (this.vinylDisc) this.vinylDisc.classList.add('playing');
    if (this.playerDeck) this.playerDeck.classList.add('playing');
    if (this.playerStatusText) this.playerStatusText.textContent = '🎶 Reproduciendo melodía navideña...';

    audio.playCarolMelody(q.melodyId, null, () => {
      if (this.vinylDisc) this.vinylDisc.classList.remove('playing');
      if (this.playerDeck) this.playerDeck.classList.remove('playing');
      if (this.playerStatusText && this.isRoundRunning) {
        this.playerStatusText.textContent = '¿Reconoces el villancico? ¡Selecciona tu respuesta!';
      }
    });
  }

  startTimer(seconds) {
    clearInterval(this.timerInterval);
    this.timeLeft = seconds;
    const totalTime = seconds;

    const updateTimerBar = () => {
      const percentage = Math.max(0, (this.timeLeft / totalTime) * 100);
      if (this.timerDisplay) this.timerDisplay.textContent = `${Math.ceil(this.timeLeft)}s`;
      if (this.timerFill) {
        this.timerFill.style.width = `${percentage}%`;
        if (percentage <= 30) {
          this.timerFill.classList.add('urgent');
        } else {
          this.timerFill.classList.remove('urgent');
        }
      }
      if (this.timerBarText) {
        this.timerBarText.textContent = `${Math.round(percentage)}%`;
      }
    };

    updateTimerBar();

    this.timerInterval = setInterval(() => {
      this.timeLeft -= 0.1;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        updateTimerBar();
        clearInterval(this.timerInterval);
        this.handleTimeout();
      } else {
        updateTimerBar();
      }
    }, 100);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.isRoundRunning = false;
    if (this.vinylDisc) this.vinylDisc.classList.remove('playing');
    if (this.playerDeck) this.playerDeck.classList.remove('playing');
  }

  handleAnswer(selectedIndex, clickedBtn) {
    this.isAnsweringLocked = true;
    this.isRoundRunning = false;
    this.stopTimer();
    audio.stopMelody();

    const q = this.questions[this.currentQuestionIdx];
    const isCorrect = selectedIndex === q.correctIndex;
    const buttons = this.answersContainer.querySelectorAll('.answer-btn');

    if (isCorrect) {
      this.score++;
      clickedBtn.classList.add('btn-correct');
      audio.playCorrect();
      if (this.playerStatusText) this.playerStatusText.textContent = '✨ ¡EXCELENTE! ¡ACERTASTE!';
    } else {
      clickedBtn.classList.add('btn-wrong');
      buttons[q.correctIndex].classList.add('btn-correct');
      audio.playWrong();
      if (this.playerStatusText) this.playerStatusText.textContent = `❌ ¡FALLASTE! Era: "${q.options[q.correctIndex]}"`;
    }

    this.updateHUD();
    this.showNextRoundControls();
  }

  handleTimeout() {
    this.isAnsweringLocked = true;
    this.isRoundRunning = false;
    audio.stopMelody();

    const q = this.questions[this.currentQuestionIdx];
    const buttons = this.answersContainer.querySelectorAll('.answer-btn');
    buttons[q.correctIndex].classList.add('btn-correct');
    audio.playWrong();
    if (this.playerStatusText) this.playerStatusText.textContent = `⏰ ¡TIEMPO AGOTADO! Era: "${q.options[q.correctIndex]}"`;

    this.updateHUD();
    this.showNextRoundControls();
  }

  showNextRoundControls() {
    // Lock buttons
    const buttons = this.answersContainer.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.disabled = true);

    if (this.btnReplay) this.btnReplay.style.display = 'none';

    if (this.currentQuestionIdx + 1 < this.questions.length) {
      const nextIdx = this.currentQuestionIdx + 1;
      if (this.btnStartRound) {
        this.btnStartRound.style.display = 'inline-flex';
        this.btnStartRound.innerHTML = `<span>▶</span> ¡EMPEZAR RONDA ${nextIdx + 1} / ${this.questions.length}!`;
      }
      setTimeout(() => {
        if (this.playerStatusText && !this.isRoundRunning) {
          this.playerStatusText.textContent = `¡Ronda finalizada! Pulsa "▶ ¡EMPEZAR RONDA ${nextIdx + 1}!" cuando estés listo.`;
        }
      }, 1000);
      
      // Update click handler to prepare and start next question
      this.btnStartRound.onclick = () => {
        audio.playClick();
        this.setupQuestion(nextIdx);
        this.startCurrentRound();
      };
    } else {
      // 20 rounds done
      setTimeout(() => {
        this.finishQuiz();
      }, 1200);
    }
  }

  finishQuiz() {
    this.stopTimer();
    audio.stopMelody();
    this.quizFinished = true;

    const REQUIRED_CORRECT = 10;
    const hasWon = this.score >= REQUIRED_CORRECT;

    if (hasWon) {
      // Victory!
      this.state.hasWonMinigame = true;
      this.state.spinsAvailable = 1;
      
      confetti.blast(160);
      audio.playWinFanfare();

      if (this.playerStatusText) {
        this.playerStatusText.textContent = `🎉 ¡VICTORIA ROYALE! Has acertado ${this.score}/20 canciones. ¡1 tirada en la ruleta desbloqueada!`;
      }

      if (this.btnStartRound) {
        this.btnStartRound.style.display = 'inline-flex';
        this.btnStartRound.innerHTML = `<span>🎰</span> ¡IR A LA RULETA NAVIDEÑA!`;
        this.btnStartRound.onclick = () => {
          if (window.ariNavigate) window.ariNavigate('roulette');
        };
      }

      if (this.onVictoryCallback) {
        this.onVictoryCallback();
      }
    } else {
      // Defeat: allow retry without annoying popup alert
      if (this.playerStatusText) {
        this.playerStatusText.textContent = `⚠️ Fin de la partida: ${this.score}/20 aciertos. ¡Necesitas al menos ${REQUIRED_CORRECT} para ganar la tirada! Pulsa para reiniciar.`;
      }
      if (this.btnStartRound) {
        this.btnStartRound.style.display = 'inline-flex';
        this.btnStartRound.innerHTML = `<span>🔄</span> REINTENTAR MINIJUEGO (Ronda 1)`;
        this.btnStartRound.onclick = () => {
          audio.playClick();
          this.startQuiz();
        };
      }
    }
  }
}


// ==========================================
// MODULE: js/modules/minigame2.js
// ==========================================
/**
 * Ari-Navidad Minigame 2: Karaoke Navideño de Vice City
 * 20-round lyric completion game with Anti-Delay / Zero Latency scoring for Twitch chat,
 * 15s answer window + 3s transition, live Top 5 Leaderboard, random tie-breaker,
 * and Roulette spin unlocking!
 */




// 20-Round Christmas Carols Database (Public domain / festive classics)
const KARAOKE_SONGS = [
  {
    cancion: "Jingle Bells",
    letra: "Jingle bells, jingle bells, jingle all the ____",
    respuesta_correcta: "way"
  },
  {
    cancion: "Campana sobre Campana",
    letra: "Campana sobre campana, y sobre campana ____",
    respuesta_correcta: "una"
  },
  {
    cancion: "Feliz Navidad",
    letra: "Feliz Navidad, próspero año y ____",
    respuesta_correcta: "felicidad"
  },
  {
    cancion: "Noche de Paz",
    letra: "Noche de paz, noche de amor, todo duerme en ____",
    respuesta_correcta: "derredor"
  },
  {
    cancion: "Los Peces en el Río",
    letra: "Pero mira cómo beben los peces en el ____",
    respuesta_correcta: "río"
  },
  {
    cancion: "We Wish You a Merry Christmas",
    letra: "We wish you a merry Christmas and a happy new ____",
    respuesta_correcta: "year"
  },
  {
    cancion: "Mi Burrito Sabanero",
    letra: "Con mi burrito sabanero voy camino de ____",
    respuesta_correcta: "belén"
  },
  {
    cancion: "Rudolph the Red-Nosed Reindeer",
    letra: "Rudolph the red-nosed reindeer had a very shiny ____",
    respuesta_correcta: "nose"
  },
  {
    cancion: "El Tamborilero",
    letra: "El camino que lleva a Belén, baja hasta el valle que la nieve ____",
    respuesta_correcta: "cubrió"
  },
  {
    cancion: "Blanca Navidad",
    letra: "Oh, blanca Navidad, sueño y con la nieve alrededor, blanca es mi ____",
    respuesta_correcta: "ilusión"
  },
  {
    cancion: "Silent Night",
    letra: "Silent night, holy night, all is calm, all is ____",
    respuesta_correcta: "bright"
  },
  {
    cancion: "Santa Claus Is Coming to Town",
    letra: "You better watch out, you better not cry, you better not pout, I'm telling you ____",
    respuesta_correcta: "why"
  },
  {
    cancion: "Ay del Chiquirritín",
    letra: "Ay del chiquirritín, chiquirriquitín, metidito entre pajas, queridito del ____",
    respuesta_correcta: "alma"
  },
  {
    cancion: "All I Want for Christmas Is You",
    letra: "I don't want a lot for Christmas, there is just one thing I ____",
    respuesta_correcta: "need"
  },
  {
    cancion: "Deck the Halls",
    letra: "Deck the halls with boughs of holly, fa la la la la, la la la ____",
    respuesta_correcta: "la"
  },
  {
    cancion: "Hacia Belén va una Burra",
    letra: "Hacia Belén va una burra, rin, rin, yo me remendaba, yo me ____",
    respuesta_correcta: "remendé"
  },
  {
    cancion: "Let It Snow",
    letra: "Oh, the weather outside is frightful, but the fire is so ____",
    respuesta_correcta: "delightful"
  },
  {
    cancion: "Frosty the Snowman",
    letra: "Frosty the Snowman was a jolly happy soul, with a corncob pipe and a button ____",
    respuesta_correcta: "nose"
  },
  {
    cancion: "La Marimorena",
    letra: "Ande, ande, ande la Marimorena, ande, ande, ande que es la ____",
    respuesta_correcta: "Nochebuena"
  },
  {
    cancion: "Last Christmas",
    letra: "Last Christmas I gave you my heart, but the very next day you gave it ____",
    respuesta_correcta: "away"
  }
];

class MinigameKaraoke {
  constructor(state, onVictoryCallback) {
    this.state = state;
    this.onVictoryCallback = onVictoryCallback;

    // Game Progression
    this.songs = KARAOKE_SONGS;
    this.totalRounds = this.songs.length; // Exactly 20
    this.currentRoundIdx = 0;
    this.phase = 'idle'; // 'idle' | 'answering' | 'break' | 'finished'

    // Anti-Delay / Zero-latency State
    // Stores username -> total score
    this.scores = {};
    // Stores Set of usernames who answered correctly in the active 15s window
    this.roundWinners = new Set();

    // Timing
    this.roundTimer = null;
    this.timeLeft = 15;
    this.breakLeft = 3;
    this.totalWindow = 15;

    // Simulated Chat Users for testing / demo
    this.botNames = [
      'LeonidaPro', 'ViceCityElf', 'FortniteKing', 'NavidadGamer',
      'RudolphSpeed', 'TwitchChallenger', 'SantaSniper', 'GrinchHacker'
    ];
    this.simBotInterval = null;

    // Cache DOM Elements
    this.cacheDOM();
  }

  cacheDOM() {
    this.roundBadge = document.getElementById('karaoke-round-badge');
    this.phaseBadge = document.getElementById('karaoke-phase-badge');
    this.songTitleEl = document.getElementById('karaoke-song-title');
    this.lyricsTextEl = document.getElementById('karaoke-lyrics-text');
    this.statusBannerEl = document.getElementById('karaoke-status-banner');
    
    // Circular Timer
    this.circleProgress = document.getElementById('timer-svg-circle');
    this.timerText = document.getElementById('timer-svg-text');
    this.circleCircumference = 2 * Math.PI * 48; // r = 48 -> ~301.6

    // Leaderboard
    this.leaderboardList = document.getElementById('karaoke-leaderboard-list');
    this.totalPlayersPill = document.getElementById('karaoke-total-players');

    // Chat Feed & Input
    this.chatFeed = document.getElementById('karaoke-chat-feed');
    this.inputUser = document.getElementById('karaoke-input-user');
    this.inputAnswer = document.getElementById('karaoke-input-answer');
    this.btnSend = document.getElementById('karaoke-btn-send');
    this.btnSimBots = document.getElementById('karaoke-btn-sim-bots');
    this.btnStart = document.getElementById('karaoke-btn-start');
    this.btnStartRound = document.getElementById('karaoke-btn-start-round');

    // Bind User Input
    if (this.btnSend && this.inputAnswer) {
      const submitAction = () => {
        const username = (this.inputUser && this.inputUser.value.trim()) || 'Tú (Streamer)';
        const text = this.inputAnswer.value.trim();
        if (text) {
          this.submitAnswer(username, text);
          this.inputAnswer.value = '';
          this.inputAnswer.focus();
        }
      };

      this.btnSend.onclick = (e) => {
        e.preventDefault();
        submitAction();
      };

      this.inputAnswer.onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitAction();
        }
      };
    }

    // Bind Start Button
    if (this.btnStart) {
      this.btnStart.onclick = (e) => {
        e.preventDefault();
        audio.playClick();
        this.startNewGame();
      };
    }

    // Bind Bot Simulator Button
    if (this.btnSimBots) {
      this.btnSimBots.onclick = (e) => {
        e.preventDefault();
        audio.playClick();
        this.triggerSimulatedChatAnswers();
      };
    }

    // Wire native Twitch WebSocket hits
    twitchChat.initDOM();
    twitchChat.onValidAnswer((displayName, text, userColor) => {
      if (this.phase === 'answering') {
        if (!this.roundWinners.has(displayName)) {
          this.roundWinners.add(displayName);
          this.appendChatLog(displayName, text, true);

          if (this.statusBannerEl) {
            const count = this.roundWinners.size;
            this.statusBannerEl.innerHTML = `<span>🎯</span> <strong>${count}</strong> ${count === 1 ? 'jugador ha acertado' : 'jugadores han acertado'} hasta ahora.`;
          }
        }
      }
    });

    // Expose global hook for Twitch IRC / tmi.js
    window.ariKaraokeSubmitAnswer = (username, text) => {
      this.submitAnswer(username, text);
    };
  }

  /**
   * Normalizes text removing accents, punctuation and case differences
   */
  normalizeText(str) {
    if (!str) return '';
    return str
      .toString()
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // removes accents (é -> e, ñ remains n)
      .replace(/[^a-z0-9]/g, "");     // removes punctuation and spaces
  }

  startNewGame() {
    this.currentRoundIdx = 0;
    this.scores = {};
    this.roundWinners.clear();
    this.clearTimers();

    // Reset Chat Feed
    if (this.chatFeed) {
      this.chatFeed.innerHTML = '<div class="chat-log-msg system">⭐ ¡Partida lista! Pulsa "▶ EMPEZAR RONDA 1" para activar el tiempo de respuestas para el chat.</div>';
    }

    this.renderLeaderboard();
    this.prepareRound(0);
  }

  prepareRound(idx) {
    this.currentRoundIdx = idx;
    this.phase = 'waiting';
    this.roundWinners.clear();
    this.timeLeft = 15;
    this.totalWindow = 15;
    this.clearTimers();

    const currentSong = this.songs[idx];

    // Update HUD
    if (this.roundBadge) {
      this.roundBadge.textContent = `RONDA ${idx + 1} / ${this.totalRounds}`;
    }
    if (this.phaseBadge) {
      this.phaseBadge.textContent = `⏸️ ESPERANDO INICIO (RONDA ${idx + 1})`;
      this.phaseBadge.className = 'karaoke-phase-tag phase-break';
    }
    if (this.songTitleEl) {
      this.songTitleEl.innerHTML = `🎵 ${currentSong.cancion}`;
    }

    // Format lyrics with bold glowing blank placeholder
    if (this.lyricsTextEl) {
      const formatted = currentSong.letra.replace(
        /_{2,}/g,
        '<span class="censored-highlight">___________</span>'
      );
      this.lyricsTextEl.innerHTML = `"${formatted}"`;
      this.lyricsTextEl.classList.remove('reveal-correct');
    }

    if (this.statusBannerEl) {
      this.statusBannerEl.innerHTML = `<span>👉</span> Pulsa "<strong>▶ ¡EMPEZAR RONDA ${idx + 1}!</strong>" cuando el chat esté listo para iniciar los 15s de respuestas.`;
      this.statusBannerEl.className = 'karaoke-status-banner status-waiting';
    }

    // Reset circular timer to 15s (stopped)
    this.updateCircleProgress(15, 15);

    // Show Start Round button
    if (this.btnStartRound) {
      this.btnStartRound.style.display = 'inline-flex';
      this.btnStartRound.innerHTML = `<span>▶</span> ¡EMPEZAR RONDA ${idx + 1} / ${this.totalRounds} (15s)!`;
      this.btnStartRound.onclick = (e) => {
        if (e) e.preventDefault();
        audio.playClick();
        this.startCurrentRound();
      };
    }

    // Disable inputs while waiting
    if (this.inputAnswer) this.inputAnswer.disabled = true;
    if (this.btnSend) this.btnSend.disabled = true;
    if (this.btnSimBots) this.btnSimBots.disabled = true;
  }

  startCurrentRound() {
    this.phase = 'answering';
    this.roundWinners.clear();
    this.timeLeft = 15;
    this.totalWindow = 15;

    const currentSong = this.songs[this.currentRoundIdx];

    // Hide Start Button during active answering
    if (this.btnStartRound) {
      this.btnStartRound.style.display = 'none';
    }

    // Enable inputs
    if (this.inputAnswer) {
      this.inputAnswer.disabled = false;
      this.inputAnswer.focus();
    }
    if (this.btnSend) this.btnSend.disabled = false;
    if (this.btnSimBots) this.btnSimBots.disabled = false;

    // Update HUD
    if (this.phaseBadge) {
      this.phaseBadge.textContent = `⚡ TIEMPO PARA RESPONDER (15s)`;
      this.phaseBadge.className = 'karaoke-phase-tag phase-active';
    }

    if (this.statusBannerEl) {
      this.statusBannerEl.innerHTML = `<span>⏳</span> ¡El chat tiene 15 segundos! Todos los que acierten se llevan +1 punto.`;
      this.statusBannerEl.className = 'karaoke-status-banner status-waiting';
    }

    // Sync with native Twitch WebSocket round
    twitchChat.startRound(currentSong.respuesta_correcta);

    // Run circular timer
    this.runAnswerTimer();
  }

  startRound(idx) {
    this.prepareRound(idx);
    this.startCurrentRound();
  }

  runAnswerTimer() {
    this.clearTimers();
    this.updateCircleProgress(this.timeLeft, this.totalWindow);

    this.roundTimer = setInterval(() => {
      this.timeLeft -= 0.1;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.updateCircleProgress(0, this.totalWindow);
        this.clearTimers();
        this.finishAnswerWindow();
      } else {
        this.updateCircleProgress(this.timeLeft, this.totalWindow);
      }
    }, 100);
  }

  updateCircleProgress(current, total) {
    const fraction = Math.max(0, current / total);
    const offset = this.circleCircumference * (1 - fraction);

    if (this.circleProgress) {
      this.circleProgress.style.strokeDasharray = `${this.circleCircumference}`;
      this.circleProgress.style.strokeDashoffset = `${offset}`;

      // Color shift
      if (fraction > 0.4) {
        this.circleProgress.style.stroke = 'var(--gta-cyan)';
      } else if (fraction > 0.2) {
        this.circleProgress.style.stroke = 'var(--fn-yellow)';
      } else {
        this.circleProgress.style.stroke = 'var(--xmas-red)';
      }
    }

    if (this.timerText) {
      this.timerText.textContent = `${Math.ceil(current)}s`;
    }
  }

  /**
   * ANTI-DELAY CORE: Evaluates answer. Does NOT reward the fastest person;
   * registers EVERY user who answered correctly within the 15s window.
   */
  submitAnswer(username, text) {
    if (this.phase !== 'answering') return;
    if (!username || !text) return;

    // Process through Twitch chat parser (checks Map & triggers Caja Destacada)
    twitchChat.processChatAnswer(username, text, '#00f0ff');

    const currentSong = this.songs[this.currentRoundIdx];
    const isCorrect = this.normalizeText(text) === this.normalizeText(currentSong.respuesta_correcta);
    if (!isCorrect) {
      this.appendChatLog(username, text, false);
    }
  }

  appendChatLog(username, text, isCorrect) {
    if (!this.chatFeed) return;
    const msg = document.createElement('div');
    msg.className = `chat-log-msg ${isCorrect ? 'correct' : 'wrong'}`;
    msg.innerHTML = `
      <span class="user-badge">${username}:</span>
      <span class="text-body">${text}</span>
      ${isCorrect ? '<span class="score-tag">+1 pto</span>' : ''}
    `;
    this.chatFeed.appendChild(msg);
    this.chatFeed.scrollTop = this.chatFeed.scrollHeight;
  }

  /**
   * Ends 15s window, awards +1 to all winners, updates Leaderboard,
   * reveals answer and presents manual button for next round.
   */
  finishAnswerWindow() {
    this.phase = 'round_summary';
    this.clearTimers();
    twitchChat.endRound();
    const currentSong = this.songs[this.currentRoundIdx];

    // Disable inputs
    if (this.inputAnswer) this.inputAnswer.disabled = true;
    if (this.btnSend) this.btnSend.disabled = true;
    if (this.btnSimBots) this.btnSimBots.disabled = true;

    // Award +1 point to ALL round winners (Zero Latency Anti-Delay)
    this.roundWinners.forEach(username => {
      this.scores[username] = (this.scores[username] || 0) + 1;
    });

    // Update & sort Leaderboard
    this.renderLeaderboard();

    // Reveal answer in the lyrics container
    if (this.lyricsTextEl) {
      const revealed = currentSong.letra.replace(
        /_{2,}/g,
        `<span class="censored-highlight correct-revealed">${currentSong.respuesta_correcta.toUpperCase()}</span>`
      );
      this.lyricsTextEl.innerHTML = `"${revealed}"`;
      this.lyricsTextEl.classList.add('reveal-correct');
    }

    if (this.phaseBadge) {
      this.phaseBadge.textContent = `🛑 RONDA FINALIZADA • RECUENTO`;
      this.phaseBadge.className = 'karaoke-phase-tag phase-break';
    }

    const winnerCount = this.roundWinners.size;
    if (winnerCount > 0) {
      audio.playCorrect();
      if (this.statusBannerEl) {
        this.statusBannerEl.innerHTML = `<span>🎉</span> ¡${winnerCount} ${winnerCount === 1 ? 'usuario acertó' : 'usuarios acertaron'} "<strong>${currentSong.respuesta_correcta.toUpperCase()}</strong>"! Clasificación actualizada.`;
        this.statusBannerEl.className = 'karaoke-status-banner status-won';
      }
    } else {
      audio.playWrong();
      if (this.statusBannerEl) {
        this.statusBannerEl.innerHTML = `<span>❌</span> Nadie acertó. La palabra correcta era: "<strong>${currentSong.respuesta_correcta.toUpperCase()}</strong>".`;
        this.statusBannerEl.className = 'karaoke-status-banner status-none';
      }
    }

    // Present button to start next round when streamer is ready!
    if (this.currentRoundIdx + 1 < this.totalRounds) {
      const nextIdx = this.currentRoundIdx + 1;
      if (this.btnStartRound) {
        this.btnStartRound.style.display = 'inline-flex';
        this.btnStartRound.innerHTML = `<span>▶</span> ¡EMPEZAR RONDA ${nextIdx + 1} / ${this.totalRounds} (15s)!`;
        this.btnStartRound.onclick = (e) => {
          if (e) e.preventDefault();
          audio.playClick();
          this.prepareRound(nextIdx);
          this.startCurrentRound();
        };
      }
    } else {
      // 20 rounds completed
      setTimeout(() => {
        this.finishGame();
      }, 1500);
    }
  }

  stopTimer() {
    this.clearTimers();
    twitchChat.endRound();
    if (this.inputAnswer) this.inputAnswer.disabled = true;
    if (this.btnSend) this.btnSend.disabled = true;
    if (this.btnSimBots) this.btnSimBots.disabled = true;
  }

  renderLeaderboard() {
    if (!this.leaderboardList) return;
    this.leaderboardList.innerHTML = '';

    // Sort users descending by points
    const players = Object.keys(this.scores).map(u => ({
      username: u,
      score: this.scores[u]
    })).sort((a, b) => b.score - a.score);

    if (this.totalPlayersPill) {
      this.totalPlayersPill.textContent = `${players.length} participantes`;
    }

    // Top 5 only
    const top5 = players.slice(0, 5);

    if (top5.length === 0) {
      this.leaderboardList.innerHTML = `
        <div class="leaderboard-empty">
          <span>🎮</span>
          <p>Aún no hay puntos. ¡Escribe en el chat para entrar en el Top 5!</p>
        </div>
      `;
      return;
    }

    const medals = ['👑', '🥈', '🥉', '4º', '5º'];
    const rankClasses = ['rank-first', 'rank-second', 'rank-third', 'rank-other', 'rank-other'];

    top5.forEach((p, idx) => {
      const item = document.createElement('div');
      item.className = `leaderboard-item ${rankClasses[idx]}`;
      item.innerHTML = `
        <div class="lb-left">
          <span class="lb-medal">${medals[idx]}</span>
          <span class="lb-username">${p.username}</span>
        </div>
        <div class="lb-right">
          <span class="lb-points">${p.score} ${p.score === 1 ? 'pto' : 'ptos'}</span>
        </div>
      `;
      this.leaderboardList.appendChild(item);
    });
  }

  finishGame() {
    this.phase = 'finished';
    this.clearTimers();
    twitchChat.endRound();

    const players = Object.keys(this.scores).map(u => ({
      username: u,
      score: this.scores[u]
    })).sort((a, b) => b.score - a.score);

    let winnerUsername = 'Tú (Streamer)';
    let winnerScore = 0;
    let isTied = false;

    if (players.length > 0) {
      const maxScore = players[0].score;
      const tiedLeaders = players.filter(p => p.score === maxScore);

      if (tiedLeaders.length > 1) {
        // Tie-breaker: pick one at random among the tied leaders to avoid conflict
        const randomIndex = Math.floor(Math.random() * tiedLeaders.length);
        winnerUsername = tiedLeaders[randomIndex].username;
        winnerScore = maxScore;
        isTied = true;
      } else {
        winnerUsername = tiedLeaders[0].username;
        winnerScore = maxScore;
      }
    }

    // Unlocking Victory Condition:
    this.state.hasWonMinigame = true;
    this.state.spinsAvailable = 1;
    this.state.minigame2Winner = winnerUsername;

    confetti.blast(200);
    audio.playWinFanfare();

    if (this.onVictoryCallback) {
      this.onVictoryCallback({
        winner: winnerUsername,
        score: winnerScore,
        isTied: isTied
      });
    }
  }

  /**
   * Helper: Simulates 2-4 chat users typing answers (for testing/stream demos)
   */
  triggerSimulatedChatAnswers() {
    if (this.phase !== 'answering') return;
    const currentSong = this.songs[this.currentRoundIdx];

    const count = 2 + Math.floor(Math.random() * 3);
    const chosenBots = [...this.botNames].sort(() => 0.5 - Math.random()).slice(0, count);

    chosenBots.forEach((bot, index) => {
      const delayMs = (index + 1) * (1200 + Math.random() * 2000);
      setTimeout(() => {
        if (this.phase === 'answering') {
          // 80% chance of correct answer, 20% random typo
          const isCorrect = Math.random() > 0.2;
          const answerText = isCorrect ? currentSong.respuesta_correcta : 'navidad';
          this.submitAnswer(bot, answerText);
        }
      }, delayMs);
    });
  }

  clearTimers() {
    if (this.roundTimer) {
      clearInterval(this.roundTimer);
      this.roundTimer = null;
    }
  }
}


// ==========================================
// MODULE: js/main.js
// ==========================================
/**
 * Ari-Navidad Application Entry Point
 * Coordinates global state, SPA views, Web Audio synthesizer, falling snow,
 * Minigames 1 & 2 validation and Christmas Roulette mechanics.
 */








// Central Application State
const appState = {
  spinsAvailable: 0,
  hasWonMinigame: false,
  minigame2Winner: null,
  prizesWon: []
};

// UI Elements
let audioToggleBtn, audioIcon, audioText, toastNotice, toastMessage, toastIcon;
let modalVictory, btnModalGoRoulette, btnModalVictoryLobby;
let modalKaraokeVictory, karaokeWinnerName, karaokeWinnerDetails, karaokeVictorySub, btnKaraokeGoRoulette, btnKaraokeVictoryLobby;
let modalPrizeWon, wonPrizeIcon, wonPrizeName, wonPrizeDesc, btnClaimChat, btnPrizeDone;
let modalPassedSubtitle;
let toastTimeout = null;

function showToast(message, icon = '🔒') {
  if (toastNotice && toastMessage) {
    toastMessage.textContent = message;
    if (toastIcon) toastIcon.textContent = icon;
    toastNotice.classList.add('toast-show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotice.classList.remove('toast-show');
    }, 2800);
  }
}

function initApp() {
  console.log('🎄 Ari-Navidad: Initializing App & Minigames...');

  // Initialize router
  router.init();

  // Initialize Twitch Chat Bridge
  twitchChat.initDOM();
  window.ariTwitchChat = twitchChat;

  // Cache DOM elements
  audioToggleBtn = document.getElementById('audio-toggle');
  audioIcon = document.getElementById('audio-icon');
  audioText = document.getElementById('audio-text');
  toastNotice = document.getElementById('toast-notice');
  toastMessage = document.getElementById('toast-message');
  toastIcon = document.getElementById('toast-icon');

  // Minigame 1 Modal
  modalVictory = document.getElementById('modal-victory');
  btnModalGoRoulette = document.getElementById('btn-modal-go-roulette');
  btnModalVictoryLobby = document.getElementById('btn-modal-victory-lobby');

  // Minigame 2 Modal
  modalKaraokeVictory = document.getElementById('modal-karaoke-victory');
  karaokeWinnerName = document.getElementById('karaoke-winner-name');
  karaokeWinnerDetails = document.getElementById('karaoke-winner-details');
  karaokeVictorySub = document.getElementById('karaoke-victory-sub');
  btnKaraokeGoRoulette = document.getElementById('btn-karaoke-go-roulette');
  btnKaraokeVictoryLobby = document.getElementById('btn-karaoke-victory-lobby');

  // Roulette Prize Modal
  modalPrizeWon = document.getElementById('modal-prize-won');
  wonPrizeIcon = document.getElementById('won-prize-icon');
  wonPrizeName = document.getElementById('won-prize-name');
  wonPrizeDesc = document.getElementById('won-prize-desc');
  modalPassedSubtitle = document.getElementById('modal-passed-subtitle');
  btnClaimChat = document.getElementById('btn-claim-chat');
  btnPrizeDone = document.getElementById('btn-prize-done');

  // 1. Initialize Snow particles on canvas
  new SnowSystem('snow-canvas');

  // 2. Initialize Roulette with App State
  const roulette = new ChristmasRoulette(appState, (prize, isDemo) => {
    // Show Prize Won Modal (GTA Mission Passed Style)
    if (wonPrizeIcon) wonPrizeIcon.textContent = prize.icon;
    if (wonPrizeName) wonPrizeName.textContent = prize.name.toUpperCase();
    if (modalPassedSubtitle) {
      modalPassedSubtitle.textContent = isDemo ? 'MODO DEMOSTRACIÓN • TIRO DE PRUEBA' : 'MISSION PASSED • RECOMPENSA DE LEONIDA';
    }
    if (wonPrizeDesc) {
      wonPrizeDesc.textContent = `¡Felicidades! Has conseguido "${prize.name}" (Rareza: ${prize.rarity}) con una probabilidad exacta del ${prize.rate}%.`;
    }
    if (modalPrizeWon) modalPrizeWon.classList.add('modal-show');
  });

  // 3. Initialize Minigame 1 (Adivina la Canción)
  const minigame1 = new MinigameSongGuesser(appState, () => {
    roulette.updateControlsState();
    if (modalVictory) modalVictory.classList.add('modal-show');
  });

  // 4. Initialize Minigame 2 (Karaoke Navideño Vice City - 20 Rondas Anti-Delay)
  const minigame2 = new MinigameKaraoke(appState, (winData) => {
    roulette.updateControlsState();
    if (karaokeWinnerName) {
      karaokeWinnerName.textContent = winData.winner.toUpperCase();
    }
    if (karaokeVictorySub) {
      karaokeVictorySub.textContent = winData.isTied
        ? 'FIN DE LAS 20 RONDAS • ¡DESEMPATE AL AZAR!'
        : 'FIN DE LAS 20 RONDAS • ¡CAMPEÓN GENERAL!';
    }
    if (karaokeWinnerDetails) {
      karaokeWinnerDetails.textContent = winData.isTied
        ? `¡Hubo un empate en la cima y la ruleta del destino ha elegido a ${winData.winner}! Con ${winData.score} aciertos en 20 rondas. ¡1 tirada exclusiva lista en la Ruleta!`
        : `¡Líder indiscutible con ${winData.score} aciertos en 20 rondas! Ha ganado 1 tirada exclusiva en la Ruleta Navideña.`;
    }
    if (modalKaraokeVictory) {
      modalKaraokeVictory.classList.add('modal-show');
    }
  });

  // Expose minigame2 instance and global bridges
  window.ariKaraokeInstance = minigame2;
  window.ariRouter = router;
  window.ariMinigame1 = minigame1;
  window.ariMinigame2 = minigame2;

  // Always redraw wheel when switching to roulette view
  router.onViewChange((viewKey) => {
    if (viewKey === 'roulette') {
      roulette.drawWheel(roulette.currentRotation);
      roulette.updateControlsState();
    }
  });

  // 5. Audio Control Button Setup
  if (audioToggleBtn) {
    audioToggleBtn.onclick = (e) => {
      e.preventDefault();
      const isUnmuted = audio.toggleMute();
      if (isUnmuted) {
        audioIcon.textContent = '🔊';
        audioText.textContent = 'Sonido On';
        audioToggleBtn.classList.add('audio-active');
        showToast('Música navideña y efectos activados 🎵', '🔊');
      } else {
        audioIcon.textContent = '🔇';
        audioText.textContent = 'Audio Off';
        audioToggleBtn.classList.remove('audio-active');
        showToast('Audio desactivado', '🔇');
      }
    };
  }

  // 6. Lobby Card 1: Adivina la Canción Navideña (Play Now)
  const card1 = document.getElementById('card-minigame-1');
  const btnPlayMinigame1 = document.getElementById('btn-play-minigame1');
  
  const startMinigameAction = (e) => {
    if (e) e.preventDefault();
    audio.playClick();
    router.navigateTo('minigame1');
    minigame1.startQuiz();
  };

  if (card1) card1.onclick = startMinigameAction;
  if (btnPlayMinigame1) {
    btnPlayMinigame1.onclick = (e) => {
      e.stopPropagation();
      startMinigameAction(e);
    };
  }

  // 7. Lobby Card 2: Karaoke Navideño Vice City (Play Now)
  const card2 = document.getElementById('card-minigame-2');
  const btnPlayMinigame2 = document.getElementById('btn-play-minigame2');

  const startMinigame2Action = (e) => {
    if (e) e.preventDefault();
    audio.playClick();
    router.navigateTo('minigame2');
    minigame2.startNewGame();
  };

  if (card2) card2.onclick = startMinigame2Action;
  if (btnPlayMinigame2) {
    btnPlayMinigame2.onclick = (e) => {
      e.stopPropagation();
      startMinigame2Action(e);
    };
  }

  // Global direct access bridge
  window.ariPlayMinigame = (num) => {
    if (num === 1) startMinigameAction();
    else if (num === 2) startMinigame2Action();
  };

  window.ariMinigame1 = minigame1;
  window.ariMinigame2 = minigame2;
  window.ariRoulette = roulette;

  // View change safety hook: cancel any active timers and music when leaving minigames
  router.onViewChange((newViewKey) => {
    if (newViewKey !== 'minigame1' && minigame1) {
      minigame1.stopTimer();
      audio.stopMelody();
    }
    if (newViewKey !== 'minigame2' && minigame2) {
      minigame2.stopTimer();
    }
  });

  window.ariNavigate = (viewKey) => {
    if (audio && audio.playClick) audio.playClick();
    if (viewKey !== 'minigame1' && window.ariMinigame1) {
      window.ariMinigame1.stopTimer();
      audio.stopMelody();
    }
    if (viewKey !== 'minigame2' && window.ariMinigame2) {
      window.ariMinigame2.stopTimer();
    }
    if (router) {
      router.navigateTo(viewKey);
    }
    if (viewKey === 'roulette' && window.ariRoulette) {
      window.ariRoulette.drawWheel(window.ariRoulette.currentRotation || 0);
      window.ariRoulette.updateControlsState();
    }
    if (viewKey === 'lobby') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('modal-show'));
    }
  };

  // Creator Code Copy Bridge (Arixu)
  window.ariCopyCreatorCode = () => {
    if (audio && audio.playClick) audio.playClick();
    const code = 'ARIXU';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        showToast('📋 ¡Código "ARIXU" copiado! Úsalo en la tienda y sálvate del carbón de Mamá Noel 🤶🪨', '🎁');
      }).catch(() => {
        showToast('🛒 Código en tienda: "ARIXU" ¡Líbrate del carbón de Mamá Noel! 🤶', '🎁');
      });
    } else {
      showToast('🛒 Código en tienda: "ARIXU" ¡Líbrate del carbón de Mamá Noel! 🤶', '🎁');
    }
  };

  // 7b. Instructions Accordion Controls (Minigames 1 & 2)
  const setupInstructionsToggle = (btnId, cardId, pillId) => {
    const btn = document.getElementById(btnId);
    const card = document.getElementById(cardId);
    const pill = document.getElementById(pillId);
    if (!card) return;
    const toggle = (e) => {
      if (e) e.preventDefault();
      audio.playClick();
      const body = card.querySelector('.instructions-body');
      if (!body) return;
      const isCollapsed = body.classList.toggle('collapsed');
      if (pill) pill.textContent = isCollapsed ? 'Ver Instrucciones ▼' : 'Ocultar ▲';
    };
    if (btn) btn.onclick = toggle;
    const header = card.querySelector('.instructions-header');
    if (header) header.onclick = toggle;
  };

  setupInstructionsToggle('btn-toggle-instructions-m1', 'instructions-card-m1', 'instructions-pill-m1');
  setupInstructionsToggle('btn-toggle-instructions-m2', 'instructions-card-m2', 'instructions-pill-m2');

  // 8. Lobby Cards 3 to 5: Locked Vault Interaction
  const lockedCards = document.querySelectorAll('.game-card.card-locked');
  lockedCards.forEach(card => {
    card.onclick = (e) => {
      e.preventDefault();
      audio.playLockShake();
      const vaultName = card.getAttribute('data-locked-name') || 'Esta bóveda';
      
      card.classList.remove('vault-shake-anim');
      void card.offsetWidth; // Trigger reflow
      card.classList.add('vault-shake-anim');

      showToast(`🔒 ${vaultName} está sellada. ¡Próximamente en el stream!`, '🚫');
    };
  });

  // 9. Lobby CTA: Ver Ruleta
  const lobbyCtaWheel = document.getElementById('lobby-cta-wheel');
  if (lobbyCtaWheel) {
    lobbyCtaWheel.onclick = (e) => {
      e.preventDefault();
      audio.playClick();
      router.navigateTo('roulette');
      roulette.drawWheel(roulette.currentRotation);
      roulette.updateControlsState();
    };
  }

  // 10. Victory Modal 1 Buttons (Adivina la Canción)
  if (btnModalGoRoulette) {
    btnModalGoRoulette.onclick = (e) => {
      e.preventDefault();
      audio.playClick();
      if (modalVictory) modalVictory.classList.remove('modal-show');
      router.navigateTo('roulette');
      roulette.drawWheel(roulette.currentRotation);
      roulette.updateControlsState();
    };
  }

  if (btnModalVictoryLobby) {
    btnModalVictoryLobby.onclick = (e) => {
      e.preventDefault();
      audio.playClick();
      if (modalVictory) modalVictory.classList.remove('modal-show');
      router.navigateTo('lobby');
      roulette.updateControlsState();
    };
  }

  // 11. Victory Modal 2 Buttons (Karaoke Navideño)
  if (btnKaraokeGoRoulette) {
    btnKaraokeGoRoulette.onclick = (e) => {
      e.preventDefault();
      audio.playClick();
      if (modalKaraokeVictory) modalKaraokeVictory.classList.remove('modal-show');
      router.navigateTo('roulette');
      roulette.drawWheel(roulette.currentRotation);
      roulette.updateControlsState();
    };
  }

  if (btnKaraokeVictoryLobby) {
    btnKaraokeVictoryLobby.onclick = (e) => {
      e.preventDefault();
      audio.playClick();
      if (modalKaraokeVictory) modalKaraokeVictory.classList.remove('modal-show');
      router.navigateTo('lobby');
      roulette.updateControlsState();
    };
  }

  // 12. Prize Won Modal Buttons
  if (btnClaimChat) {
    btnClaimChat.onclick = (e) => {
      e.preventDefault();
      audio.playClick();
      const lastPrize = appState.prizesWon[appState.prizesWon.length - 1];
      const claimText = `!reclamar ${lastPrize ? lastPrize.prize.name : 'Premio'} - Ari Navidad Leonida`;
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(claimText);
        showToast(`📋 Comando copiado: "${claimText}" ¡Pégalo en el chat de Twitch!`, '💬');
      } else {
        showToast(`💬 Escribe en el chat: "${claimText}"`, '🎁');
      }
    };
  }

  if (btnPrizeDone) {
    btnPrizeDone.onclick = (e) => {
      e.preventDefault();
      audio.playClick();
      if (modalPrizeWon) modalPrizeWon.classList.remove('modal-show');
      router.navigateTo('lobby');
    };
  }

  console.log('✨ Ari Navidad: Ready with Minigames 1 & 2!');
}

// Robust execution: handles both early and late script loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}


})();
