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
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      'C6': 1046.50, 'REST': 0
    };

    const songs = {
      // 1. Jingle Bells
      'jingle_bells': [
        ['E5', 0.25], ['E5', 0.25], ['E5', 0.5],
        ['E5', 0.25], ['E5', 0.25], ['E5', 0.5],
        ['E5', 0.25], ['G5', 0.25], ['C5', 0.35], ['D5', 0.15], ['E5', 0.7],
        ['F5', 0.25], ['F5', 0.25], ['F5', 0.35], ['F5', 0.15],
        ['F5', 0.25], ['E5', 0.25], ['E5', 0.25], ['E5', 0.25],
        ['G5', 0.25], ['G5', 0.25], ['F5', 0.25], ['D5', 0.25], ['C5', 0.6]
      ],
      // 2. All I Want for Christmas Is You (Intro & motif)
      'all_i_want': [
        ['G4', 0.3], ['B4', 0.3], ['D5', 0.3], ['G5', 0.4],
        ['B5', 0.5], ['A5', 0.3], ['G5', 0.4], ['E5', 0.4],
        ['G5', 0.3], ['G5', 0.3], ['G5', 0.3], ['A5', 0.4],
        ['B5', 0.4], ['G5', 0.4], ['E5', 0.5], ['D5', 0.7]
      ],
      // 3. Feliz Navidad
      'feliz_navidad': [
        ['E4', 0.2], ['A4', 0.4], ['C5', 0.3], ['B4', 0.3], ['A4', 0.4],
        ['F4', 0.2], ['D5', 0.5], ['C5', 0.3], ['B4', 0.3], ['A4', 0.2], ['G4', 0.5],
        ['E4', 0.2], ['E5', 0.5], ['D5', 0.3], ['C5', 0.3], ['B4', 0.2], ['A4', 0.7]
      ],
      // 4. We Wish You A Merry Christmas
      'merry_christmas': [
        ['D4', 0.3], ['G4', 0.3], ['G4', 0.15], ['A4', 0.15], ['G4', 0.15], ['F4', 0.15],
        ['E4', 0.3], ['C4', 0.3], ['E4', 0.3],
        ['A4', 0.3], ['A4', 0.15], ['B4', 0.15], ['A4', 0.15], ['G4', 0.15],
        ['F4', 0.3], ['D4', 0.3], ['B4', 0.5], ['G4', 0.5]
      ],
      // 5. Last Christmas
      'last_christmas': [
        ['C5', 0.35], ['C5', 0.35], ['D5', 0.35], ['B4', 0.35],
        ['A4', 0.45], ['A4', 0.3], ['C5', 0.3], ['D5', 0.3],
        ['B4', 0.45], ['G4', 0.45], ['A4', 0.7]
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

export const audio = new SoundEngine();
