/**
 * Ari-Navidad Minigame 2: Karaoke Navideño de Vice City
 * 20-round lyric completion game with Anti-Delay / Zero Latency scoring for Twitch chat,
 * 15s answer window + 3s transition, live Top 5 Leaderboard, random tie-breaker,
 * and Roulette spin unlocking!
 */

import { audio } from './audio.js';
import { confetti } from './confetti.js';
import { twitchChat } from './twitch-chat.js';

// 20-Round Christmas Carols Database (Public domain / festive classics)
export const KARAOKE_SONGS = [
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

export class MinigameKaraoke {
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
      this.chatFeed.innerHTML = '<div class="chat-log-msg system">⭐ ¡Partida iniciada! Tienes 15 segundos por ronda. Escribe la palabra que falta.</div>';
    }

    this.renderLeaderboard();
    this.startRound(0);
  }

  startRound(idx) {
    this.currentRoundIdx = idx;
    this.phase = 'answering';
    this.roundWinners.clear();
    this.timeLeft = 15;
    this.totalWindow = 15;

    const currentSong = this.songs[idx];

    // Update HUD
    if (this.roundBadge) {
      this.roundBadge.textContent = `RONDA ${idx + 1} / ${this.totalRounds}`;
    }
    if (this.phaseBadge) {
      this.phaseBadge.textContent = `⚡ TIEMPO PARA RESPONDER (15s)`;
      this.phaseBadge.className = 'karaoke-phase-tag phase-active';
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
      this.statusBannerEl.innerHTML = `<span>⏳</span> ¡El chat tiene 15 segundos! Todos los que acierten se llevan +1 punto.`;
      this.statusBannerEl.className = 'karaoke-status-banner status-waiting';
    }

    // Sync with native Twitch WebSocket round
    twitchChat.startRound(currentSong.respuesta_correcta);

    // Run circular timer
    this.runAnswerTimer();
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
   * reveals answer and holds a 3s break.
   */
  finishAnswerWindow() {
    this.phase = 'break';
    twitchChat.endRound();
    const currentSong = this.songs[this.currentRoundIdx];

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
      this.phaseBadge.textContent = `🛑 DESCANSO & RECUENTO (3s)`;
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

    // 3 seconds break before next round
    this.breakLeft = 3;
    this.updateCircleProgress(this.breakLeft, 3);

    this.roundTimer = setInterval(() => {
      this.breakLeft -= 0.1;
      if (this.breakLeft <= 0) {
        this.clearTimers();
        this.proceedToNextRound();
      } else {
        this.updateCircleProgress(this.breakLeft, 3);
      }
    }, 100);
  }

  proceedToNextRound() {
    if (this.currentRoundIdx + 1 < this.totalRounds) {
      this.startRound(this.currentRoundIdx + 1);
    } else {
      this.finishGame();
    }
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
