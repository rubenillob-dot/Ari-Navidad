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
    this.flakeCount = 85;
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

    // Create initial flakes
    this.flakes = [];
    for (let i = 0; i < this.flakeCount; i++) {
      this.flakes.push(this.createFlake(true));
    }

    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createFlake(randomY = false) {
    const depth = Math.random(); // 0 is far/small, 1 is close/large
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -10,
      radius: 1 + depth * 3.5,
      speedY: 0.8 + depth * 2.2,
      speedX: (Math.random() - 0.5) * 0.8,
      opacity: 0.25 + depth * 0.65,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.03,
      sparkle: Math.random() > 0.8,
      sparklePhase: Math.random() * Math.PI * 2
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Subtle wind oscillation
    this.windAngle += 0.008;
    this.wind = Math.sin(this.windAngle) * 0.6 + 0.2;

    this.flakes.forEach((flake) => {
      flake.sway += flake.swaySpeed;
      flake.y += flake.speedY;
      flake.x += flake.speedX + this.wind + Math.sin(flake.sway) * 0.6;

      // Sparkle pulse
      let alpha = flake.opacity;
      if (flake.sparkle) {
        flake.sparklePhase += 0.05;
        alpha = Math.max(0.1, flake.opacity * (0.6 + 0.4 * Math.sin(flake.sparklePhase)));
      }

      // Draw snowflake
      this.ctx.beginPath();
      this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      this.ctx.shadowBlur = flake.radius > 2.5 ? 6 : 2;
      this.ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
      this.ctx.fill();

      // Recycle flakes when out of bounds
      if (flake.y > this.height + 10 || flake.x < -20 || flake.x > this.width + 20) {
        Object.assign(flake, this.createFlake(false));
      }
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
