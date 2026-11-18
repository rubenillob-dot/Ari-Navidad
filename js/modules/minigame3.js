/**
 * Ari-Navidad Minigame 3 (Día 3): Winterfest Emoji Enigma
 * 25 rondas de acertijos de emojis navideños con botón de inicio de ronda
 * y clasificación oficial por aciertos y velocidad de respuesta.
 */

import { audio } from './audio.js';
import { confetti } from './confetti.js';
import { twitchChat } from './twitch-chat.js';

export const EMOJI_QUESTIONS = [
  {
    ronda: 1,
    categoria: "Película Clásica",
    emojis: "🟢 🧌 🎄",
    pista: "Criatura verde y gruñona que roba los regalos en Villa Quién",
    blanks: "_ _   _ _ _ _ _ _",
    respuestas: ["el grinch", "grinch"]
  },
  {
    ronda: 2,
    categoria: "Película Navideña",
    emojis: "👦 🏠 😱",
    pista: "Niño olvidado por su familia que defiende su casa de dos ladrones",
    blanks: "_ _ _ _   _ _   _ _ _ _",
    respuestas: ["solo en casa", "mi pobre angelito", "home alone"]
  },
  {
    ronda: 3,
    categoria: "Personaje Mágico",
    emojis: "🦌 🔴 ❄️",
    pista: "Reno de brillante nariz roja que guía el trineo en la tormenta",
    blanks: "_ _ _ _ _ _ _   _ _   _ _ _ _",
    respuestas: ["rodolfo el reno", "rodolfo", "rudolph"]
  },
  {
    ronda: 4,
    categoria: "Película Animada",
    emojis: "🚂 🎟️ ❄️",
    pista: "Tren misterioso que viaja de noche rumbo al Polo Norte",
    blanks: "_ _ _ _ _   _ _ _ _ _ _ _",
    respuestas: ["polar express", "el expreso polar", "expreso polar"]
  },
  {
    ronda: 5,
    categoria: "Tradición del 6 de Enero",
    emojis: "👑 👑 👑 🐪",
    pista: "Melchor, Gaspar y Baltasar llegan montados en camellos",
    blanks: "_ _ _   _ _ _ _ _   _ _ _ _ _",
    respuestas: ["los reyes magos", "reyes magos", "reyes"]
  },
  {
    ronda: 6,
    categoria: "Película de Culto",
    emojis: "🎃 💀 🎅",
    pista: "Jack Skellington intenta celebrar la Navidad en Ciudad de Halloween",
    blanks: "_ _ _ _ _ _ _ _ _   _ _ _ _ _   _ _   _ _ _ _ _ _ _",
    respuestas: ["pesadilla antes de navidad", "the nightmare before christmas", "pesadilla antes de la navidad"]
  },
  {
    ronda: 7,
    categoria: "Símbolo Invernal",
    emojis: "❄️ ⛄ 🥕",
    pista: "Figura helada con tres bolas de nieve, chistera y nariz de zanahoria",
    blanks: "_ _ _ _ _ _   _ _   _ _ _ _ _",
    respuestas: ["muneco de nieve", "frosty", "snowman"]
  },
  {
    ronda: 8,
    categoria: "Costumbre Nocturna",
    emojis: "🍪 🥛 🎅",
    pista: "Aperitivo tradicional que se deja en la mesita para Papá Noel",
    blanks: "_ _ _ _ _ _ _ _   _   _ _ _ _ _",
    respuestas: ["galletas y leche", "galletas con leche", "leche y galletas", "galletas"]
  },
  {
    ronda: 9,
    categoria: "Villancico / Canción Pop",
    emojis: "🔔 🎶 🪨",
    pista: "Himno navideño bailable al ritmo del rock y los cascabeles",
    blanks: "_ _ _ _ _ _   _ _ _ _   _ _ _ _",
    respuestas: ["jingle bell rock", "jingle bells rock", "jingle bell"]
  },
  {
    ronda: 10,
    categoria: "Decoración Tradicional",
    emojis: "🌟 👶 ⛺",
    pista: "Maqueta con el establo, el niño Jesús, la Virgen y San José",
    blanks: "_ _ _ _ _ _   _ _   _ _ _ _ _",
    respuestas: ["el portal de belen", "portal de belen", "belen", "nacimiento", "pesebre"]
  },
  {
    ronda: 11,
    categoria: "Adorno de la Chimenea",
    emojis: "🧦 🍬 🍫",
    pista: "Prenda de lana colgada donde caen dulces y sorpresas",
    blanks: "_ _ _ _ _ _ _ _   _ _ _ _ _ _ _ _",
    respuestas: ["calcetin navideño", "calcetin de navidad", "calcetin", "bota navideña"]
  },
  {
    ronda: 12,
    categoria: "Gastronomía Festiva",
    emojis: "🍯 🌰 🍫",
    pista: "Dulce navideño de Jijona o Alicante hecho con almendras y miel",
    blanks: "_ _ _ _ _ _",
    respuestas: ["turron", "el turron"]
  },
  {
    ronda: 13,
    categoria: "Rito de Nochevieja",
    emojis: "🍇 🔔 🕛",
    pista: "Se comen doce al compás del reloj en la Puerta del Sol",
    blanks: "_ _ _   _ _   _ _ _ _",
    respuestas: ["las 12 uvas", "las doce uvas", "12 uvas", "uvas de la suerte", "uvas"]
  },
  {
    ronda: 14,
    categoria: "Planta Mágica",
    emojis: "🌿 💋 👩‍❤️‍👨",
    pista: "Costumbre romántica: darse un beso bajo sus ramitas y bayas",
    blanks: "_ _ _ _ _ _ _ _",
    respuestas: ["muerdago", "el muerdago"]
  },
  {
    ronda: 15,
    categoria: "Castigo Navideño",
    emojis: "🪨 😈 🎅",
    pista: "Mineral dulce y oscuro para quienes no se han portado bien",
    blanks: "_ _ _ _ _ _   _ _ _ _ _",
    respuestas: ["carbon dulce", "carbon", "trozo de carbon"]
  },
  {
    ronda: 16,
    categoria: "Personaje del Polo Norte",
    emojis: "🤶 🍪 👗",
    pista: "Amable señora que cuida del taller y hornea deliciosos pasteles",
    blanks: "_ _ _ _   _ _ _ _",
    respuestas: ["mama noel", "senora claus", "mrs claus"]
  },
  {
    ronda: 17,
    categoria: "Ayudantes del Taller",
    emojis: "🧝 🛠️ 🎁",
    pista: "Seres diminutos con gorros puntiagudos que montan los juguetes",
    blanks: "_ _ _   _ _ _ _ _",
    respuestas: ["los elfos", "elfos", "duendes", "los duendes"]
  },
  {
    ronda: 18,
    categoria: "Dulce Rayado",
    emojis: "🍭 🔴 ⚪",
    pista: "Caramelo curvo de menta con franjas espirales rojas y blancas",
    blanks: "_ _ _ _ _ _   _ _   _ _ _ _ _ _ _ _",
    respuestas: ["baston de caramelo", "baston caramelo", "bastoncillo"]
  },
  {
    ronda: 19,
    categoria: "Villancico Popular",
    emojis: "🐟 💧 🌊",
    pista: "Canto donde los animales acuáticos beben por ver a Dios nacer",
    blanks: "_ _ _   _ _ _ _ _   _ _   _ _   _ _ _",
    respuestas: ["los peces en el rio", "peces en el rio", "peces en el río"]
  },
  {
    ronda: 20,
    categoria: "Canción con Instrumento",
    emojis: "🥁 👶 🎶",
    pista: "El niño pobre que no tiene dones y ofrece su 'ropopompom'",
    blanks: "_ _   _ _ _ _ _ _ _ _ _ _ _",
    respuestas: ["el tamborilero", "tamborilero"]
  },
  {
    ronda: 21,
    categoria: "Paquete Sorpresa",
    emojis: "🎁 🏷️ 🎀",
    pista: "Caja envuelta con papel de colores y moño lista para abrir",
    blanks: "_ _ _ _ _ _   _ _   _ _ _ _ _ _ _",
    respuestas: ["regalo de navidad", "regalo", "los regalos"]
  },
  {
    ronda: 22,
    categoria: "Cúspide del Árbol",
    emojis: "🌟 🎄 🔝",
    pista: "Astro que guiaba a los pastores colocado en la copa del abeto",
    blanks: "_ _ _ _ _ _ _ _   _ _   _ _ _ _ _ _ _",
    respuestas: ["estrella de navidad", "la estrella", "estrella"]
  },
  {
    ronda: 23,
    categoria: "Prenda Abrigada",
    emojis: "🧣 🥶 ❄️",
    pista: "Tejido largo de lana para proteger el cuello de la ventisca",
    blanks: "_ _ _ _ _ _ _",
    respuestas: ["bufanda", "la bufanda", "bufanda navideña"]
  },
  {
    ronda: 24,
    categoria: "Postre de Reyes",
    emojis: "🍩 👑 🪙",
    pista: "Bollo circular adornado con frutas escarchadas, rey y haba oculta",
    blanks: "_ _ _ _ _ _   _ _   _ _ _ _ _",
    respuestas: ["roscon de reyes", "roscon", "rosca de reyes"]
  },
  {
    ronda: 25,
    categoria: "Celebración Final",
    emojis: "🎆 🎉 🥂",
    pista: "Fiesta y campanadas que despiden el año con alegría",
    blanks: "_ _ _ _ _ _ _ _ _ _",
    respuestas: ["nochevieja", "fin de ano", "ano nuevo", "año nuevo"]
  }
];

export class MinigameEmojiEnigma {
  constructor(state, onVictoryCallback) {
    this.state = state;
    this.onVictoryCallback = onVictoryCallback;

    this.questions = EMOJI_QUESTIONS;
    this.totalRounds = this.questions.length; // Exactly 25
    this.currentRoundIdx = 0;
    this.phase = 'idle'; // 'idle' | 'answering' | 'summary' | 'finished'

    // Scoring & speed metrics: username -> { score, times: [], totalTime, avgTime, fastestTime, speedBonusTotal, totalPoints }
    this.playerStats = {};
    this.roundAcertantes = new Set();

    // Timing
    this.roundTimer = null;
    this.timeLeft = 15;
    this.totalWindow = 15;
    this.roundStartTime = 0;

    // Simulated Bot Pool
    this.botNames = [
      'LeonidaPro', 'ViceCityElf', 'FortniteKing', 'NavidadGamer',
      'RudolphSpeed', 'TwitchChallenger', 'SantaSniper', 'GrinchHacker'
    ];

    this.cacheDOM();
  }

  cacheDOM() {
    this.roundBadge = document.getElementById('m3-round-badge');
    this.phaseBadge = document.getElementById('m3-phase-badge');
    this.categoryEl = document.getElementById('m3-category-pill');
    this.emojisEl = document.getElementById('m3-emojis-display');
    this.hintEl = document.getElementById('m3-hint-text');
    this.blanksEl = document.getElementById('m3-blanks-display');
    this.statusBannerEl = document.getElementById('m3-status-banner');
    this.btnStartRound = document.getElementById('m3-btn-start-round');

    // Circular Timer
    this.circleProgress = document.getElementById('m3-timer-circle');
    this.timerText = document.getElementById('m3-timer-text');
    this.circleCircumference = 2 * Math.PI * 48; // ~301.6

    // Leaderboard
    this.leaderboardList = document.getElementById('m3-leaderboard-list');
    this.totalPlayersPill = document.getElementById('m3-total-players');
    this.btnResetGame = document.getElementById('m3-btn-reset');

    // Chat / Input Dock
    this.chatFeed = document.getElementById('m3-chat-feed');
    this.inputUser = document.getElementById('m3-input-user');
    this.inputAnswer = document.getElementById('m3-input-answer');
    this.btnSend = document.getElementById('m3-btn-send');
    this.btnSimBots = document.getElementById('m3-btn-sim-bots');

    // Event Bindings
    if (this.btnSend && this.inputAnswer) {
      const submitAction = () => {
        const username = (this.inputUser && this.inputUser.value.trim()) || 'Tú (Streamer)';
        const text = this.inputAnswer.value.trim();
        if (text) {
          const elapsedSec = Math.max(0.1, parseFloat(((Date.now() - this.roundStartTime) / 1000).toFixed(2)));
          this.submitAnswer(username, text, elapsedSec);
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
      this.chatFeed.innerHTML = '<div class="chat-log-msg system">⭐ ¡Día 3 listo! 25 rondas de Emojis Navideños. Pulsa "▶ ¡EMPEZAR RONDA 1!" para iniciar.</div>';
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

    const q = this.questions[idx];

    if (this.roundBadge) {
      this.roundBadge.textContent = `RONDA ${idx + 1} / ${this.totalRounds}`;
    }
    if (this.phaseBadge) {
      this.phaseBadge.textContent = `⏸️ ESPERANDO INICIO (RONDA ${idx + 1})`;
      this.phaseBadge.className = 'karaoke-phase-tag phase-break';
    }
    if (this.categoryEl) {
      this.categoryEl.textContent = `🎯 ${q.categoria.toUpperCase()}`;
    }
    if (this.emojisEl) {
      this.emojisEl.textContent = q.emojis;
      this.emojisEl.classList.remove('reveal-correct');
    }
    if (this.hintEl) {
      this.hintEl.innerHTML = `💡 <em>Pista:</em> ${q.pista}`;
    }
    if (this.blanksEl) {
      this.blanksEl.textContent = q.blanks;
    }
    if (this.statusBannerEl) {
      this.statusBannerEl.innerHTML = `<span>👉</span> Pulsa "<strong>▶ ¡EMPEZAR RONDA ${idx + 1} / ${this.totalRounds}!</strong>" para iniciar la cuenta atrás de 15 segundos.`;
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

    const q = this.questions[this.currentRoundIdx];

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
      this.statusBannerEl.innerHTML = `<span>⏳</span> ¡15 segundos! Descifra los emojis. ¡El más rápido y con más aciertos lidera!`;
      this.statusBannerEl.className = 'karaoke-status-banner status-waiting';
    }

    // Sync Twitch Chat WebSocket with accepted answers array
    twitchChat.startRound(q.respuestas);

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

    const q = this.questions[this.currentRoundIdx];
    const normText = this.normalizeText(text);
    const isCorrect = q.respuestas.some(r => this.normalizeText(r) === normText);

    if (isCorrect) {
      if (this.roundAcertantes.has(username)) return; // First correct per round
      this.roundAcertantes.add(username);

      // Register or update player stats
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

      // Speed bonus: up to 150 bonus points depending on remaining seconds
      const bonus = Math.max(0, Math.round((15 - speed) * 10));
      p.speedBonusTotal += bonus;
      p.totalPoints = (p.score * 1000) + p.speedBonusTotal;

      this.appendChatLog(username, text, true, speed);
      this.renderLeaderboard();

      if (this.statusBannerEl) {
        const count = this.roundAcertantes.size;
        this.statusBannerEl.innerHTML = `<span>🎯</span> <strong>${count}</strong> ${count === 1 ? 'acierto' : 'aciertos'} en vivo. ¡${username} acertó en <strong>${speed}s</strong>!`;
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

    const q = this.questions[this.currentRoundIdx];

    if (this.inputAnswer) this.inputAnswer.disabled = true;
    if (this.btnSend) this.btnSend.disabled = true;
    if (this.btnSimBots) this.btnSimBots.disabled = true;

    // Reveal answer
    if (this.blanksEl) {
      this.blanksEl.innerHTML = `✨ <strong>${q.respuestas[0].toUpperCase()}</strong>`;
      this.blanksEl.style.color = 'var(--fn-yellow)';
    }

    if (this.phaseBadge) {
      this.phaseBadge.textContent = `🛑 RONDA FINALIZADA • RECUENTO`;
      this.phaseBadge.className = 'karaoke-phase-tag phase-break';
    }

    const winnerCount = this.roundAcertantes.size;
    if (winnerCount > 0) {
      audio.playCorrect();
      if (this.statusBannerEl) {
        this.statusBannerEl.innerHTML = `<span>🎉</span> ¡${winnerCount} acertaron "<strong>${q.respuestas[0].toUpperCase()}</strong>"! Puntuación y velocidad actualizadas.`;
        this.statusBannerEl.className = 'karaoke-status-banner status-won';
      }
    } else {
      audio.playWrong();
      if (this.statusBannerEl) {
        this.statusBannerEl.innerHTML = `<span>❌</span> Tiempo agotado. La respuesta correcta era: "<strong>${q.respuestas[0].toUpperCase()}</strong>".`;
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

    // Official Sorting: 1st by score (hits), 2nd by speed (lowest avgTime)
    players.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.avgTime !== b.avgTime) return a.avgTime - b.avgTime;
      return a.fastestTime - b.fastestTime;
    });

    if (this.totalPlayersPill) {
      this.totalPlayersPill.textContent = `${players.length} participantes`;
    }

    const top5 = players.slice(0, 5);

    if (top5.length === 0) {
      this.leaderboardList.innerHTML = `
        <div class="leaderboard-empty">
          <span>🔮</span>
          <p>Aún no hay aciertos. ¡Escribe en el chat para entrar en el Top 5!</p>
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
          <span class="lb-points" title="Aciertos">${p.score}/25</span>
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
    this.state.minigame3Winner = winner;

    confetti.blast(200);
    audio.playWinFanfare();

    if (this.onVictoryCallback) {
      this.onVictoryCallback({
        winner,
        score,
        avgSpeed,
        gameName: 'Winterfest Emoji'
      });
    }
  }

  triggerSimulatedChatAnswers() {
    if (this.phase !== 'answering') return;
    const q = this.questions[this.currentRoundIdx];

    const count = 2 + Math.floor(Math.random() * 3);
    const chosenBots = [...this.botNames].sort(() => 0.5 - Math.random()).slice(0, count);

    chosenBots.forEach((bot, index) => {
      const delayMs = (index + 1) * (1100 + Math.random() * 2200);
      setTimeout(() => {
        if (this.phase === 'answering') {
          const isCorrect = Math.random() > 0.15;
          const answerText = isCorrect ? q.respuestas[0] : 'navidad';
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
