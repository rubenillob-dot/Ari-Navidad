/**
 * Ari-Navidad Confetti Celebration FX
 * High-performance particle celebration for Victory Royale and Roulette Drops.
 */

export class ConfettiCannon {
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

export const confetti = new ConfettiCannon();
