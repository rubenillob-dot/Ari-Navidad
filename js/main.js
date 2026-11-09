/**
 * Ari-Navidad Application Entry Point
 * Coordinates global state, SPA views, Web Audio synthesizer, falling snow,
 * Minigame 1 validation and Christmas Roulette single-spin mechanics.
 */

import { router } from './modules/router.js';
import { audio } from './modules/audio.js';
import { SnowSystem } from './modules/snow.js';
import { MinigameSongGuesser } from './modules/minigame1.js';
import { ChristmasRoulette } from './modules/roulette.js';

// Central Application State
const appState = {
  spinsAvailable: 0,
  hasWonMinigame: false,
  prizesWon: []
};

// UI Elements
let audioToggleBtn, audioIcon, audioText, toastNotice, toastMessage, toastIcon;
let modalVictory, btnModalGoRoulette, btnModalVictoryLobby;
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
  console.log('🎄 Ari-Navidad: Initializing App...');

  // Initialize router
  router.init();

  // Cache DOM elements
  audioToggleBtn = document.getElementById('audio-toggle');
  audioIcon = document.getElementById('audio-icon');
  audioText = document.getElementById('audio-text');
  toastNotice = document.getElementById('toast-notice');
  toastMessage = document.getElementById('toast-message');
  toastIcon = document.getElementById('toast-icon');

  modalVictory = document.getElementById('modal-victory');
  btnModalGoRoulette = document.getElementById('btn-modal-go-roulette');
  btnModalVictoryLobby = document.getElementById('btn-modal-victory-lobby');

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

  // 3. Initialize Minigame 1 with App State & Victory Handler
  const minigame1 = new MinigameSongGuesser(appState, () => {
    // When Minigame is won:
    roulette.updateControlsState();
    // Open Victory Royale Modal
    if (modalVictory) {
      modalVictory.classList.add('modal-show');
    }
  });

  // Always redraw wheel when switching to roulette view
  router.onViewChange((viewKey) => {
    if (viewKey === 'roulette') {
      roulette.drawWheel(roulette.currentRotation);
      roulette.updateControlsState();
    }
  });

  // 4. Audio Control Button Setup
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

  // 5. Lobby Card 1: Adivina la Canción Navideña (Play Now)
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

  // 6. Lobby Cards 2 to 5: Locked Vault Interaction
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

  // 7. Lobby CTA: Ver Ruleta
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

  // 8. Victory Modal Buttons
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

  // 9. Prize Won Modal Buttons
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

  console.log('✨ Ari Navidad: Ready!');
}

// Robust execution: handles both early and late script loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
