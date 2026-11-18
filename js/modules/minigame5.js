/**
 * Ari-Navidad Minigame 5 (Día 5): Twitch Showdown - Anagrama de Vice City
 * 25 rondas de anagramas navideños en cubos de neón animados,
 * botón para comenzar cada ronda, soporte para chat de Twitch con WebSockets,
 * y clasificación oficial según el más rápido y el que más acierte.
 */

import { audio } from './audio.js';
import { confetti } from './confetti.js';
import { twitchChat } from './twitch-chat.js';

export const ANAGRAM_WORDS = [
  {
    ronda: 1,
    letrasDesordenadas: ["R", "E", "O", "N"],
    solucion: "RENO",
    longitud: "4 Letras",
    pista: "Cuadrúpedo volador con astas mágicas del Polo Norte",
    alias: ["el reno", "renos"]
  },
  {
    ronda: 2,
    letrasDesordenadas: ["N", "E", "I", "V", "E"],
    solucion: "NIEVE",
    longitud: "5 Letras",
    pista: "Manto helado blanco que cae sobre los rascacielos",
    alias: ["la nieve"]
  },
  {
    ronda: 3,
    letrasDesordenadas: ["T", "R", "N", "I", "O", "E"],
    solucion: "TRINEO",
    longitud: "6 Letras",
    pista: "Vehículo rojo volador que surca las nubes en Nochebuena",
    alias: ["el trineo"]
  },
  {
    ronda: 4,
    letrasDesordenadas: ["T", "U", "O", "R", "N", "R"],
    solucion: "TURRON",
    longitud: "6 Letras",
    pista: "Dulce navideño de almendra, miel y clara de huevo",
    alias: ["el turron", "turrón"]
  },
  {
    ronda: 5,
    letrasDesordenadas: ["R", "E", "G", "L", "A", "O"],
    solucion: "REGALO",
    longitud: "6 Letras",
    pista: "Paquete envuelto con cinta y lazo bajo el árbol",
    alias: ["el regalo", "regalos"]
  },
  {
    ronda: 6,
    letrasDesordenadas: ["C", "A", "N", "P", "M", "A", "A", "S"],
    solucion: "CAMPANAS",
    longitud: "8 Letras",
    pista: "Instrumentos de bronce que repican con júbilo navideño",
    alias: ["campana", "las campanas"]
  },
  {
    ronda: 7,
    letrasDesordenadas: ["E", "T", "L", "L", "R", "E", "S", "A"],
    solucion: "ESTRELLA",
    longitud: "8 Letras",
    pista: "Guía brillante de Belén colocada en la copa del abeto",
    alias: ["la estrella"]
  },
  {
    ronda: 8,
    letrasDesordenadas: ["M", "D", "A", "O", "G", "E", "R", "U"],
    solucion: "MUERDAGO",
    longitud: "8 Letras",
    pista: "Planta con bayas bajo la que manda la tradición besarse",
    alias: ["el muerdago", "muérdago"]
  },
  {
    ronda: 9,
    letrasDesordenadas: ["B", "A", "T", "O", "N", "S"],
    solucion: "BASTON",
    longitud: "6 Letras",
    pista: "Caramelo de menta rayado con curva de bastoncillo",
    alias: ["el baston", "bastón", "baston de caramelo"]
  },
  {
    ronda: 10,
    letrasDesordenadas: ["P", "O", "V", "O", "R", "O", "N", "L"],
    solucion: "POLVORON",
    longitud: "8 Letras",
    pista: "Dulce tradicional de canela que se deshace en la boca",
    alias: ["el polvoron", "polvorón"]
  },
  {
    ronda: 11,
    letrasDesordenadas: ["C", "I", "E", "A", "M", "N", "H", "E"],
    solucion: "CHIMENEA",
    longitud: "8 Letras",
    pista: "Conducto por donde descienden los regalos al calor del hogar",
    alias: ["la chimenea"]
  },
  {
    ronda: 12,
    letrasDesordenadas: ["B", "M", "Z", "A", "M", "O", "B", "A"],
    solucion: "ZAMBOMBA",
    longitud: "8 Letras",
    pista: "Instrumento típico que se frota con caña en villancicos",
    alias: ["la zambomba"]
  },
  {
    ronda: 13,
    letrasDesordenadas: ["B", "L", "E", "E", "N"],
    solucion: "BELEN",
    longitud: "5 Letras",
    pista: "Maqueta con el establo, pastorcillos y el pesebre",
    alias: ["el belen", "belén", "portal de belen"]
  },
  {
    ronda: 14,
    letrasDesordenadas: ["G", "I", "U", "N", "R", "A", "L", "D", "A"],
    solucion: "GUIRNALDA",
    longitud: "9 Letras",
    pista: "Corona o cinta festiva llena de luces y hojas verdes",
    alias: ["la guirnalda", "guirnaldas"]
  },
  {
    ronda: 15,
    letrasDesordenadas: ["A", "U", "I", "D", "A", "G", "L", "N", "O"],
    solucion: "AGUINALDO",
    longitud: "9 Letras",
    pista: "Regalo monetario que se pide cantando de puerta en puerta",
    alias: ["el aguinaldo"]
  },
  {
    ronda: 16,
    letrasDesordenadas: ["R", "S", "C", "O", "O", "N"],
    solucion: "ROSCON",
    longitud: "6 Letras",
    pista: "Bollo redondo de Reyes relleno de nata con rey o haba",
    alias: ["el roscon", "roscón", "roscon de reyes"]
  },
  {
    ronda: 17,
    letrasDesordenadas: ["P", "A", "P", "A", "N", "O", "E", "L"],
    solucion: "PAPANOEL",
    longitud: "8 Letras",
    pista: "El señor bondadoso de barba blanca y traje rojo",
    alias: ["papa noel", "santa claus", "santa"]
  },
  {
    ronda: 18,
    letrasDesordenadas: ["F", "O", "R", "T", "N", "I", "T", "E"],
    solucion: "FORTNITE",
    longitud: "8 Letras",
    pista: "El famoso Battle Royale donde se celebra el Winterfest",
    alias: ["juego fortnite"]
  },
  {
    ronda: 19,
    letrasDesordenadas: ["G", "A", "S", "P", "A", "R"],
    solucion: "GASPAR",
    longitud: "6 Letras",
    pista: "Rey mago de cabellos castaños que ofrece incienso",
    alias: ["rey gaspar", "el rey gaspar"]
  },
  {
    ronda: 20,
    letrasDesordenadas: ["B", "A", "L", "T", "A", "S", "A", "R"],
    solucion: "BALTASAR",
    longitud: "8 Letras",
    pista: "Rey mago sabio que entrega la preciada mirra aromática",
    alias: ["rey baltasar", "el rey baltasar"]
  },
  {
    ronda: 21,
    letrasDesordenadas: ["P", "A", "N", "D", "E", "R", "E", "T", "A"],
    solucion: "PANDERETA",
    longitud: "9 Letras",
    pista: "Aro con sonajas metálicas que se golpea al ritmo de villancicos",
    alias: ["la pandereta"]
  },
  {
    ronda: 22,
    letrasDesordenadas: ["N", "O", "C", "H", "E", "B", "U", "E", "N", "A"],
    solucion: "NOCHEBUENA",
    longitud: "10 Letras",
    pista: "Mágica cena del 24 de diciembre en familia",
    alias: ["la nochebuena"]
  },
  {
    ronda: 23,
    letrasDesordenadas: ["N", "O", "C", "H", "E", "V", "I", "E", "J", "A"],
    solucion: "NOCHEVIEJA",
    longitud: "10 Letras",
    pista: "Cena y fiesta del 31 de diciembre con las 12 uvas",
    alias: ["la nochevieja", "fin de año", "fin de ano"]
  },
  {
    ronda: 24,
    letrasDesordenadas: ["M", "A", "Z", "A", "P", "A", "N"],
    solucion: "MAZAPAN",
    longitud: "7 Letras",
    pista: "Delicada figurita horneada de almendra molida y azúcar",
    alias: ["el mazapan", "mazapán"]
  },
  {
    ronda: 25,
    letrasDesordenadas: ["V", "I", "C", "E", "C", "I", "T", "Y"],
    solucion: "VICECITY",
    longitud: "8 Letras",
    pista: "La metrópolis iluminada por neones y palmeras de Leonida",
    alias: ["vice city", "gta vice city", "leonida"]
  }
];

export class MinigameTwitchShowdown {
  constructor(state, onVictoryCallback) {
    this.state = state;
    this.onVictoryCallback = onVictoryCallback;

    this.words = ANAGRAM_WORDS;
    this.totalRounds = this.words.length; // 25
    this.currentRoundIdx = 0;
    this.phase = 'idle';

    // Player stats: username -> { score, times: [], totalTime, avgTime, fastestTime, speedBonusTotal, totalPoints }
    this.playerStats = {};
    this.roundAcertantes = new Set();

    // Timing
    this.roundTimer = null;
    this.timeLeft = 15;
    this.totalWindow = 15;
    this.roundStartTime = 0;

    // Simulated Chat Bots
    this.botNames = [
      'LeonidaPro', 'ViceCityElf', 'FortniteKing', 'NavidadGamer',
      'RudolphSpeed', 'TwitchChallenger', 'SantaSniper', 'GrinchHacker'
    ];

    this.cacheDOM();
  }

  cacheDOM() {
    this.roundBadge = document.getElementById('m5-round-badge');
    this.phaseBadge = document.getElementById('m5-phase-badge');
    this.lengthPill = document.getElementById('m5-length-pill');
    this.tilesContainer = document.getElementById('m5-tiles-container');
    this.hintEl = document.getElementById('m5-hint-text');
    this.statusBannerEl = document.getElementById('m5-status-banner');
    this.btnStartRound = document.getElementById('m5-btn-start-round');

    // Circular Timer
    this.circleProgress = document.getElementById('m5-timer-circle');
    this.timerText = document.getElementById('m5-timer-text');
    this.circleCircumference = 2 * Math.PI * 48;

    // Leaderboard
    this.leaderboardList = document.getElementById('m5-leaderboard-list');
    this.totalPlayersPill = document.getElementById('m5-total-players');
    this.btnResetGame = document.getElementById('m5-btn-reset');

    // Chat / Input Dock
    this.chatFeed = document.getElementById('m5-chat-feed');
    this.inputUser = document.getElementById('m5-input-user');
    this.inputAnswer = document.getElementById('m5-input-answer');
    this.btnSend = document.getElementById('m5-btn-send');
    this.btnSimBots = document.getElementById('m5-btn-sim-bots');

    if (this.btnSend && this.inputAnswer) {
      const submitAction = () => {
        const username = (this.inputUser && this.inputUser.value.trim()) || 'Tú (Streamer)';
        const text = this.inputAnswer.value.trim();
        if (text) {
          const speed = Math.max(0.1, parseFloat(((Date.now() - this.roundStartTime) / 1000).toFixed(2)));
          this.submitAnswer(username, text, speed);
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

    if (this.btnResetGame) {
      this.btnResetGame.onclick = (e) => {
        e.preventDefault();
        audio.playClick();
        this.startNewGame();
      };
    }

    if (this.btnSimBots) {
      this.btnSimBots.onclick = (e) => {
        e.preventDefault();
        audio.playClick();
        this.triggerSimulatedChatAnswers();
      };
    }

    // Connect to global Twitch Chat Bridge
    twitchChat.initDOM();
    twitchChat.onValidAnswer((displayName, text, userColor, elapsedSec) => {
      if (this.phase === 'answering') {
        const speed = elapsedSec || Math.max(0.1, parseFloat(((Date.now() - this.roundStartTime) / 1000).toFixed(2)));
        this.submitAnswer(displayName, text, speed);
      }
    });
  }

  normalizeText(str) {
    if (!str) return '';
    return str
      .toString()
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  startNewGame() {
    this.currentRoundIdx = 0;
    this.playerStats = {};
    this.roundAcertantes.clear();
    this.clearTimers();

    if (this.chatFeed) {
      this.chatFeed.innerHTML = '<div class="chat-log-msg system">⭐ ¡Día 5 Showdown! 25 rondas de Anagramas de Neón. Pulsa "▶ ¡EMPEZAR RONDA 1!" para desordenar las letras.</div>';
    }

    this.renderLeaderboard();
    this.prepareRound(0);
  }

  prepareRound(idx) {
    this.currentRoundIdx = idx;
    this.phase = 'waiting';
    this.roundAcertantes.clear();
    this.timeLeft = 15;
    this.totalWindow = 15;
    this.clearTimers();

    const item = this.words[idx];

    if (this.roundBadge) {
      this.roundBadge.textContent = `RONDA ${idx + 1} / ${this.totalRounds}`;
    }
    if (this.phaseBadge) {
      this.phaseBadge.textContent = `⏸️ ESPERANDO INICIO (ANAGRAMA ${idx + 1})`;
      this.phaseBadge.className = 'karaoke-phase-tag phase-break';
    }
    if (this.lengthPill) {
      this.lengthPill.textContent = `🔤 ${item.longitud.toUpperCase()}`;
    }

    // Render scrambled tiles
    if (this.tilesContainer) {
      this.tilesContainer.innerHTML = '';
      item.letrasDesordenadas.forEach((letra) => {
        const tile = document.createElement('div');
        tile.className = 'anagram-neon-tile';
        tile.textContent = letra;
        this.tilesContainer.appendChild(tile);
      });
    }

    if (this.hintEl) {
      this.hintEl.innerHTML = `💡 <em>Pista:</em> ${item.pista}`;
    }

    if (this.statusBannerEl) {
      this.statusBannerEl.innerHTML = `<span>👉</span> Pulsa "<strong>▶ ¡EMPEZAR RONDA ${idx + 1} / ${this.totalRounds}!</strong>" para iniciar los 15s del Anagrama de Neón.`;
      this.statusBannerEl.className = 'karaoke-status-banner status-waiting';
    }

    this.updateCircleProgress(15, 15);

    if (this.btnStartRound) {
      this.btnStartRound.style.display = 'inline-flex';
      this.btnStartRound.innerHTML = `<span>▶</span> ¡EMPEZAR RONDA ${idx + 1} / ${this.totalRounds} (15s)!`;
      this.btnStartRound.onclick = (e) => {
        if (e) e.preventDefault();
        audio.playClick();
        this.startCurrentRound();
      };
    }

    if (this.inputAnswer) this.inputAnswer.disabled = true;
    if (this.btnSend) this.btnSend.disabled = true;
    if (this.btnSimBots) this.btnSimBots.disabled = true;
  }

  startCurrentRound() {
    this.phase = 'answering';
    this.roundAcertantes.clear();
    this.timeLeft = 15;
    this.totalWindow = 15;
    this.roundStartTime = Date.now();

    const item = this.words[this.currentRoundIdx];

    if (this.btnStartRound) {
      this.btnStartRound.style.display = 'none';
    }

    if (this.inputAnswer) {
      this.inputAnswer.disabled = false;
      this.inputAnswer.value = '';
      this.inputAnswer.focus();
    }
    if (this.btnSend) this.btnSend.disabled = false;
    if (this.btnSimBots) this.btnSimBots.disabled = false;

    if (this.phaseBadge) {
      this.phaseBadge.textContent = `⚡ TIEMPO PARA RESPONDER (15s)`;
      this.phaseBadge.className = 'karaoke-phase-tag phase-active';
    }
    if (this.statusBannerEl) {
      this.statusBannerEl.innerHTML = `<span>⏳</span> ¡15 segundos! Ordena mentalmente las letras y escribe la palabra en el chat.`;
      this.statusBannerEl.className = 'karaoke-status-banner status-waiting';
    }

    // Sync Twitch Chat WebSocket with solution and aliases
    const validTargets = [item.solucion, ...(item.alias || [])];
    twitchChat.startRound(validTargets);

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

  submitAnswer(username, text, elapsedSec = null) {
    if (this.phase !== 'answering') return;
    if (!username || !text) return;

    const speed = elapsedSec !== null
      ? elapsedSec
      : Math.max(0.1, parseFloat(((Date.now() - this.roundStartTime) / 1000).toFixed(2)));

    const item = this.words[this.currentRoundIdx];
    const normText = this.normalizeText(text);

    const isMatch = normText === this.normalizeText(item.solucion) ||
      (item.alias && item.alias.some(a => this.normalizeText(a) === normText));

    if (isMatch) {
      if (this.roundAcertantes.has(username)) return;
      this.roundAcertantes.add(username);

      if (!this.playerStats[username]) {
        this.playerStats[username] = {
          username,
          score: 0,
          times: [],
          totalTime: 0,
          avgTime: 0,
          fastestTime: 99,
          speedBonusTotal: 0,
          totalPoints: 0
        };
      }

      const p = this.playerStats[username];
      p.score += 1;
      p.times.push(speed);
      p.totalTime += speed;
      p.avgTime = parseFloat((p.totalTime / p.score).toFixed(2));
      p.fastestTime = Math.min(p.fastestTime, speed);

      // Speed bonus: up to 150 points for fastest responses
      const bonus = Math.max(0, Math.round((15 - speed) * 10));
      p.speedBonusTotal += bonus;
      p.totalPoints = (p.score * 1000) + p.speedBonusTotal;

      this.appendChatLog(username, text, true, speed);
      this.renderLeaderboard();

      if (this.statusBannerEl) {
        const count = this.roundAcertantes.size;
        this.statusBannerEl.innerHTML = `<span>🎯</span> ¡${count} acertantes! <strong>${username}</strong> descifró el anagrama en <strong>${speed}s</strong>.`;
      }
    } else {
      this.appendChatLog(username, text, false, speed);
    }
  }

  appendChatLog(username, text, isCorrect, speed) {
    if (!this.chatFeed) return;
    const msg = document.createElement('div');
    msg.className = `chat-log-msg ${isCorrect ? 'correct' : 'wrong'}`;
    msg.innerHTML = `
      <span class="user-badge">${username}:</span>
      <span class="text-body">${text}</span>
      ${isCorrect ? `<span class="score-tag">+1 pto ⚡ ${speed}s</span>` : ''}
    `;
    this.chatFeed.appendChild(msg);
    this.chatFeed.scrollTop = this.chatFeed.scrollHeight;
  }

  finishAnswerWindow() {
    this.phase = 'summary';
    this.clearTimers();
    twitchChat.endRound();

    const item = this.words[this.currentRoundIdx];

    if (this.inputAnswer) this.inputAnswer.disabled = true;
    if (this.btnSend) this.btnSend.disabled = true;
    if (this.btnSimBots) this.btnSimBots.disabled = true;

    // Rearrange tiles in correct order with victory glow
    if (this.tilesContainer) {
      this.tilesContainer.innerHTML = '';
      const letters = item.solucion.split('');
      letters.forEach(l => {
        const tile = document.createElement('div');
        tile.className = 'anagram-neon-tile tile-solved';
        tile.textContent = l;
        this.tilesContainer.appendChild(tile);
      });
    }

    if (this.phaseBadge) {
      this.phaseBadge.textContent = `🛑 RONDA FINALIZADA • RECUENTO`;
      this.phaseBadge.className = 'karaoke-phase-tag phase-break';
    }

    const winnerCount = this.roundAcertantes.size;
    if (winnerCount > 0) {
      audio.playCorrect();
      if (this.statusBannerEl) {
        this.statusBannerEl.innerHTML = `<span>🎉</span> ¡${winnerCount} descubrieron "<strong>${item.solucion}</strong>"! Puntuación y velocidad actualizadas.`;
        this.statusBannerEl.className = 'karaoke-status-banner status-won';
      }
    } else {
      audio.playWrong();
      if (this.statusBannerEl) {
        this.statusBannerEl.innerHTML = `<span>❌</span> Se acabó el tiempo. La palabra oculta era: "<strong>${item.solucion}</strong>".`;
        this.statusBannerEl.className = 'karaoke-status-banner status-none';
      }
    }

    this.renderLeaderboard();

    // Prepare next round or finish 25 rounds
    if (this.currentRoundIdx + 1 < this.totalRounds) {
      const nextIdx = this.currentRoundIdx + 1;
      if (this.btnStartRound) {
        this.btnStartRound.style.display = 'inline-flex';
        this.btnStartRound.innerHTML = `<span>▶</span> ¡EMPEZAR RONDA ${nextIdx + 1} / ${this.totalRounds} (15s)!`;
        this.btnStartRound.onclick = (e) => {
          if (e) e.preventDefault();
          audio.playClick();
          this.prepareRound(nextIdx);
          this.startCurrentRound();
        };
      }
    } else {
      setTimeout(() => {
        this.finishGame();
      }, 1600);
    }
  }

  renderLeaderboard() {
    if (!this.leaderboardList) return;
    this.leaderboardList.innerHTML = '';

    const players = Object.values(this.playerStats);

    // Official Sorting: 1st by hits, 2nd by speed (lowest avgTime)
    players.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.avgTime !== b.avgTime) return a.avgTime - b.avgTime;
      return a.fastestTime - b.fastestTime;
    });

    if (this.totalPlayersPill) {
      this.totalPlayersPill.textContent = `${players.length} concursantes`;
    }

    const top5 = players.slice(0, 5);

    if (top5.length === 0) {
      this.leaderboardList.innerHTML = `
        <div class="leaderboard-empty">
          <span>🔤</span>
          <p>Aún no hay anagramas resueltos. ¡Escribe la palabra para entrar en el Top 5!</p>
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
        <div class="lb-right" style="display: flex; gap: 8px; align-items: center;">
          <span class="lb-points" title="Palabras Descifradas">${p.score}/25</span>
          <span class="lb-speed" style="font-size: 0.78rem; color: var(--gta-cyan); font-weight: 700;">⚡ ${p.avgTime}s</span>
          <span class="lb-badge" style="font-size: 0.72rem; background: rgba(255,230,0,0.2); padding: 2px 6px; border-radius: 4px; color: var(--fn-yellow);">${p.totalPoints} pts</span>
        </div>
      `;
      this.leaderboardList.appendChild(item);
    });
  }

  finishGame() {
    this.phase = 'finished';
    this.clearTimers();
    twitchChat.endRound();

    const players = Object.values(this.playerStats).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.avgTime - b.avgTime;
    });

    let winner = 'Tú (Streamer)';
    let score = 0;
    let avgSpeed = 0;

    if (players.length > 0) {
      winner = players[0].username;
      score = players[0].score;
      avgSpeed = players[0].avgTime;
    }

    this.state.hasWonMinigame = true;
    this.state.spinsAvailable = 1;
    this.state.minigame5Winner = winner;

    confetti.blast(200);
    audio.playWinFanfare();

    if (this.onVictoryCallback) {
      this.onVictoryCallback({
        winner,
        score,
        avgSpeed,
        gameName: 'Twitch Anagrama'
      });
    }
  }

  triggerSimulatedChatAnswers() {
    if (this.phase !== 'answering') return;
    const item = this.words[this.currentRoundIdx];

    const count = 2 + Math.floor(Math.random() * 3);
    const chosenBots = [...this.botNames].sort(() => 0.5 - Math.random()).slice(0, count);

    chosenBots.forEach((bot, index) => {
      const delayMs = (index + 1) * (1100 + Math.random() * 2200);
      setTimeout(() => {
        if (this.phase === 'answering') {
          const isCorrect = Math.random() > 0.15;
          const answerText = isCorrect ? item.solucion : 'PalabraErronea';
          const speed = parseFloat((delayMs / 1000).toFixed(2));
          this.submitAnswer(bot, answerText, speed);
        }
      }, delayMs);
    });
  }

  stopTimer() {
    this.clearTimers();
    twitchChat.endRound();
    if (this.inputAnswer) this.inputAnswer.disabled = true;
    if (this.btnSend) this.btnSend.disabled = true;
    if (this.btnSimBots) this.btnSimBots.disabled = true;
  }

  clearTimers() {
    if (this.roundTimer) {
      clearInterval(this.roundTimer);
      this.roundTimer = null;
    }
  }
}
