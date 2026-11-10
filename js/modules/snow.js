/**
 * Ari-Navidad Snow Particles System
 * Interactive multi-layered canvas snowfall with wind drift and twinkling snowflakes.
 */

export class SnowSystem {
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
