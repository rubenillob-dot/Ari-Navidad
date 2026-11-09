/**
 * Ari-Navidad SPA Router Module
 * Controls zero-scroll screen transitions with fade & slide animations.
 */

import { audio } from './audio.js';

class ViewRouter {
  constructor() {
    this.currentViewId = 'view-lobby';
    this.views = {
      'lobby': document.getElementById('view-lobby'),
      'minigame1': document.getElementById('view-minigame1'),
      'roulette': document.getElementById('view-roulette')
    };

    this.navBtnLobby = document.getElementById('nav-btn-lobby');
    this.navBtnRoulette = document.getElementById('nav-btn-roulette');
    this.viewChangeListeners = [];

    this.bindGlobalNav();
  }

  bindGlobalNav() {
    if (this.navBtnLobby) {
      this.navBtnLobby.addEventListener('click', () => {
        audio.playClick();
        this.navigateTo('lobby');
      });
    }

    if (this.navBtnRoulette) {
      this.navBtnRoulette.addEventListener('click', () => {
        audio.playClick();
        this.navigateTo('roulette');
      });
    }

    // Bind all ".btn-back-lobby" elements
    document.querySelectorAll('.btn-back-lobby').forEach(btn => {
      btn.addEventListener('click', () => {
        audio.playClick();
        this.navigateTo('lobby');
      });
    });
  }

  onViewChange(callback) {
    this.viewChangeListeners.push(callback);
  }

  navigateTo(viewKey) {
    const targetView = this.views[viewKey];
    if (!targetView) {
      console.warn(`View "${viewKey}" not found.`);
      return;
    }

    // Hide all views
    Object.values(this.views).forEach(v => {
      if (v) v.classList.remove('active-view');
    });

    // Activate target
    targetView.classList.add('active-view');
    this.currentViewId = targetView.id;

    // Scroll to top of view just in case
    targetView.scrollTop = 0;

    // Notify listeners
    this.viewChangeListeners.forEach(fn => fn(viewKey));
  }
}

export const router = new ViewRouter();
