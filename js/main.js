/**
 * Ari-Navidad Application Entry Point
 * Coordinates global state, SPA views, Web Audio synthesizer, falling snow,
 * Minigames 1, 2, 3, 4 & 5 validation and Christmas Roulette mechanics.
 */

import { router } from './modules/router.js';
import { audio } from './modules/audio.js';
import { SnowSystem } from './modules/snow.js';
import { MinigameSongGuesser } from './modules/minigame1.js';
import { MinigameKaraoke } from './modules/minigame2.js';
import { MinigameEmojiEnigma } from './modules/minigame3.js';
import { MinigameGrinchHeist } from './modules/minigame4.js';
import { MinigameTwitchShowdown } from './modules/minigame5.js';
import { ChristmasRoulette } from './modules/roulette.js';
import { twitchChat } from './modules/twitch-chat.js';

// Central Application State
const appState = {
  spinsAvailable: 0,
  hasWonMinigame: false,
  minigame2Winner: null,
  minigame3Winner: null,
  minigame4Winner: null,
  minigame5Winner: null,
  prizesWon: []
};

// UI Elements
let audioToggleBtn, audioIcon, audioText, toastNotice, toastMessage, toastIcon;
let modalVictory, btnModalGoRoulette, btnModalVictoryLobby;
let modalKaraokeVictory, karaokeWinnerName, karaokeWinnerDetails, karaokeVictorySub, btnKaraokeGoRoulette, btnKaraokeVictoryLobby;
let modalMinigameVictory, minigameWinnerName, minigameWinnerDetails, minigameVictorySub, minigameWinnerIcon, btnMinigameGoRoulette, btnMinigameVictoryLobby;
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

  // Minigames 3, 4 & 5 Victory Modal
  modalMinigameVictory = document.getElementById('modal-minigame-victory');
  minigameWinnerName = document.getElementById('minigame-winner-name');
  minigameWinnerDetails = document.getElementById('minigame-winner-details');
  minigameVictorySub = document.getElementById('minigame-victory-sub');
  minigameWinnerIcon = document.getElementById('minigame-winner-icon');
  btnMinigameGoRoulette = document.getElementById('btn-minigame-go-roulette');
  btnMinigameVictoryLobby = document.getElementById('btn-minigame-victory-lobby');

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

  // Helper for Minigames 3, 4, 5 victory modal
  const showMinigameVictoryModal = (winData) => {
    roulette.updateControlsState();
    if (minigameWinnerName) {
      minigameWinnerName.textContent = winData.winner.toUpperCase();
    }
    if (minigameVictorySub) {
      minigameVictorySub.textContent = `FIN DE LAS 25 RONDAS • ¡CAMPEÓN ${winData.gameName.toUpperCase()}!`;
    }
    if (minigameWinnerDetails) {
      minigameWinnerDetails.textContent = `¡${winData.winner} fue el más rápido y certero con ${winData.score} aciertos en 25 rondas (velocidad media: ${winData.avgSpeed}s)! Se desbloquea 1 tirada oficial en la Ruleta Navideña VIP.`;
    }
    if (modalMinigameVictory) {
      modalMinigameVictory.classList.add('modal-show');
    }
  };

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

  // 5. Initialize Minigame 3 (Winterfest Emoji Enigma - 25 Rondas)
  const minigame3 = new MinigameEmojiEnigma(appState, (winData) => {
    showMinigameVictoryModal(winData);
  });

  // 6. Initialize Minigame 4 (El Gran Atraco del Grinch - 25 Rondas)
  const minigame4 = new MinigameGrinchHeist(appState, (winData) => {
    showMinigameVictoryModal(winData);
  });

  // 7. Initialize Minigame 5 (Twitch Showdown: Anagrama - 25 Rondas)
  const minigame5 = new MinigameTwitchShowdown(appState, (winData) => {
    showMinigameVictoryModal(winData);
  });

  // Expose minigame instances and global bridges
  window.ariKaraokeInstance = minigame2;
  window.ariRouter = router;
  window.ariMinigame1 = minigame1;
  window.ariMinigame2 = minigame2;
  window.ariMinigame3 = minigame3;
  window.ariMinigame4 = minigame4;
  window.ariMinigame5 = minigame5;
  window.ariRoulette = roulette;

  // Always redraw wheel when switching to roulette view
  router.onViewChange((viewKey) => {
    if (viewKey === 'roulette') {
      roulette.drawWheel(roulette.currentRotation);
      roulette.updateControlsState();
    }
  });

  // Audio Control Button Setup
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

  // Lobby Card 1: Adivina la Canción Navideña (Play Now)
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

  // Lobby Card 2: Karaoke Navideño Vice City (Play Now)
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

  // Lobby Card 3: Winterfest Emoji Enigma (Día 3)
  const card3 = document.getElementById('card-minigame-3');
  const btnPlayMinigame3 = document.getElementById('btn-play-minigame3');

  const startMinigame3Action = (e) => {
    if (e) e.preventDefault();
    audio.playClick();
    router.navigateTo('minigame3');
    minigame3.startNewGame();
  };

  if (card3) card3.onclick = startMinigame3Action;
  if (btnPlayMinigame3) {
    btnPlayMinigame3.onclick = (e) => {
      e.stopPropagation();
      startMinigame3Action(e);
    };
  }

  // Lobby Card 4: El Gran Atraco del Grinch (Día 4)
  const card4 = document.getElementById('card-minigame-4');
  const btnPlayMinigame4 = document.getElementById('btn-play-minigame4');

  const startMinigame4Action = (e) => {
    if (e) e.preventDefault();
    audio.playClick();
    router.navigateTo('minigame4');
    minigame4.startNewGame();
  };

  if (card4) card4.onclick = startMinigame4Action;
  if (btnPlayMinigame4) {
    btnPlayMinigame4.onclick = (e) => {
      e.stopPropagation();
      startMinigame4Action(e);
    };
  }

  // Lobby Card 5: Twitch Showdown - Anagrama de Vice City (Día 5)
  const card5 = document.getElementById('card-minigame-5');
  const btnPlayMinigame5 = document.getElementById('btn-play-minigame5');

  const startMinigame5Action = (e) => {
    if (e) e.preventDefault();
    audio.playClick();
    router.navigateTo('minigame5');
    minigame5.startNewGame();
  };

  if (card5) card5.onclick = startMinigame5Action;
  if (btnPlayMinigame5) {
    btnPlayMinigame5.onclick = (e) => {
      e.stopPropagation();
      startMinigame5Action(e);
    };
  }

  // Global direct access bridge
  window.ariPlayMinigame = (num) => {
    if (num === 1) startMinigameAction();
    else if (num === 2) startMinigame2Action();
    else if (num === 3) startMinigame3Action();
    else if (num === 4) startMinigame4Action();
    else if (num === 5) startMinigame5Action();
  };

  // View change safety hook: cancel any active timers and music when leaving minigames
  router.onViewChange((newViewKey) => {
    if (newViewKey !== 'minigame1' && minigame1) {
      minigame1.stopTimer();
      audio.stopMelody();
    }
    if (newViewKey !== 'minigame2' && minigame2) {
      minigame2.stopTimer();
    }
    if (newViewKey !== 'minigame3' && minigame3) {
      minigame3.stopTimer();
    }
    if (newViewKey !== 'minigame4' && minigame4) {
      minigame4.stopTimer();
    }
    if (newViewKey !== 'minigame5' && minigame5) {
      minigame5.stopTimer();
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
    if (viewKey !== 'minigame3' && window.ariMinigame3) {
      window.ariMinigame3.stopTimer();
    }
    if (viewKey !== 'minigame4' && window.ariMinigame4) {
      window.ariMinigame4.stopTimer();
    }
    if (viewKey !== 'minigame5' && window.ariMinigame5) {
      window.ariMinigame5.stopTimer();
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

  // Instructions Accordion Controls (Minigames 1 to 5)
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
  setupInstructionsToggle('btn-toggle-instructions-m3', 'instructions-card-m3', 'instructions-pill-m3');
  setupInstructionsToggle('btn-toggle-instructions-m4', 'instructions-card-m4', 'instructions-pill-m4');
  setupInstructionsToggle('btn-toggle-instructions-m5', 'instructions-card-m5', 'instructions-pill-m5');

  // Lobby CTA: Ver Ruleta
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

  // Victory Modal 1 Buttons (Adivina la Canción)
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

  // Victory Modal 2 Buttons (Karaoke Navideño)
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

  // Victory Modal 3, 4, 5 Buttons
  if (btnMinigameGoRoulette) {
    btnMinigameGoRoulette.onclick = (e) => {
      e.preventDefault();
      audio.playClick();
      if (modalMinigameVictory) modalMinigameVictory.classList.remove('modal-show');
      router.navigateTo('roulette');
      roulette.drawWheel(roulette.currentRotation);
      roulette.updateControlsState();
    };
  }

  if (btnMinigameVictoryLobby) {
    btnMinigameVictoryLobby.onclick = (e) => {
      e.preventDefault();
      audio.playClick();
      if (modalMinigameVictory) modalMinigameVictory.classList.remove('modal-show');
      router.navigateTo('lobby');
      roulette.updateControlsState();
    };
  }

  // Prize Won Modal Buttons
  if (btnClaimChat) {
    btnClaimChat.onclick = (e) => {
      e.preventDefault();
      audio.playClick();
      const lastPrize = appState.prizesWon[appState.prizesWon.length - 1];
      const claimText = `!reclamar ${lastPrize ? lastPrize.prize.name : 'Premio'} - Ari Navidad Leonida`;
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(claimText).then(() => {
          showToast(`📋 Comando copiado: "${claimText}" ¡Pégalo en el chat de Twitch!`, '💬');
        }).catch(() => {
          showToast(`💬 Escribe en el chat: "${claimText}"`, '🎁');
        });
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

  console.log('✨ Ari Navidad: Ready with all 5 Minigames (Días 1, 2, 3, 4 y 5)!');
}

// Robust execution: handles both early and late script loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
