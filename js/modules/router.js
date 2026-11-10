/**
 * Ari-Navidad SPA Router Module
 * Controls zero-scroll screen transitions with fade animations and robust event binding.
 */

import { audio } from './audio.js';

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

export const router = new ViewRouter();
