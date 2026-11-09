/**
 * Ari-Navidad Christmas Roulette Module
 * Exact mathematical drop rates calculation, 24-slice canvas wheel with alternating prizes,
 * blinking fairy light bezel, pointer tick physics, demo mode, and victory celebration.
 */

import { audio } from './audio.js';
import { confetti } from './confetti.js';

export class ChristmasRoulette {
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
