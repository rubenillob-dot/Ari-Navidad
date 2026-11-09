/**
 * Ari-Navidad Twitch Chat WebSocket Client
 * Native WebSocket connection to wss://irc-ws.chat.twitch.tv:443
 * Anonymous auth via justinfan, IRC tag parsing for display-name,
 * Map-based unique participant tracking per round, zero latency validation,
 * and visual triggers (Caja Destacada estilo IlloJuan & Live Feed).
 */

import { audio } from './audio.js';

export class TwitchChatBridge {
  constructor(options = {}) {
    this.channel = (options.channel || 'imarixu').toLowerCase().replace('#', '');
    this.wsUrl = 'wss://irc-ws.chat.twitch.tv:443';
    this.ws = null;
    this.isConnected = false;
    this.reconnectTimer = null;
    this.reconnectAttempts = 0;

    // Participant control per round: Map<userKey, { displayName, text, timestamp }>
    this.participantesRonda = new Map();

    // Round state
    this.activeAnswer = '';
    this.isRoundActive = false;

    // Callbacks
    this.onValidAnswerCallbacks = [];
    this.onStatusChangeCallbacks = [];
    this.onMessageCallbacks = [];

    // UI elements (Caja Destacada & Live Feed)
    this.currentVoterBox = null;
    this.currentVoterName = null;
    this.voterBoxTimeout = null;
    this.liveFeedList = null;
    this.liveFeedCounter = null;
    this.statusDot = null;
    this.statusText = null;

    this.initDOM();
    this.connect();
  }

  initDOM() {
    this.currentVoterBox = document.getElementById('currentVoterBox');
    this.currentVoterName = document.getElementById('currentVoterName');
    this.liveFeedList = document.getElementById('live-feed-list');
    this.liveFeedCounter = document.getElementById('live-feed-counter');
    this.statusDot = document.getElementById('twitch-ws-dot');
    this.statusText = document.getElementById('twitch-channel-display');
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.updateStatus(false, 'Conectando...');
    const randomJustin = Math.floor(10000 + Math.random() * 90000);
    const nick = `justinfan${randomJustin}`;

    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        console.log(`🟣 Twitch WS: Conectado a ${this.wsUrl}. Autenticando como ${nick}...`);
        this.isConnected = true;
        this.reconnectAttempts = 0;

        // 1. Request IRC capabilities (crucial for display-name, color, badges)
        this.ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
        // 2. Anonymous authentication
        this.ws.send('PASS SCHMOOPIE');
        this.ws.send(`NICK ${nick}`);
        // 3. Join channel
        this.ws.send(`JOIN #${this.channel}`);

        this.updateStatus(true, `#${this.channel}`);
      };

      this.ws.onmessage = (event) => {
        this.handleRawMessage(event.data);
      };

      this.ws.onerror = (err) => {
        console.warn('⚠️ Twitch WS Error:', err);
      };

      this.ws.onclose = () => {
        console.warn('🔌 Twitch WS Desconectado. Reintentando...');
        this.isConnected = false;
        this.updateStatus(false, 'Desconectado');
        this.scheduleReconnect();
      };
    } catch (e) {
      console.error('Error al instanciar WebSocket de Twitch:', e);
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    clearTimeout(this.reconnectTimer);
    const delay = Math.min(10000, 1500 * Math.pow(1.5, this.reconnectAttempts++));
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  updateStatus(connected, label) {
    if (this.statusDot) {
      this.statusDot.className = `twitch-status-dot ${connected ? 'connected' : 'disconnected'}`;
    }
    if (this.statusText) {
      this.statusText.textContent = label;
    }
    this.onStatusChangeCallbacks.forEach(cb => cb(connected, label));
  }

  /**
   * IRC Message Parser: extracts PRIVMSG, tags, display-name, and handles PING/PONG
   */
  handleRawMessage(rawData) {
    if (!rawData) return;
    const lines = rawData.split('\r\n');

    for (const line of lines) {
      if (!line) continue;

      // Keep-alive PING / PONG
      if (line.startsWith('PING')) {
        const pingPayload = line.slice(5) || ':tmi.twitch.tv';
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(`PONG ${pingPayload}`);
        }
        continue;
      }

      // Parse IRC PRIVMSG
      if (line.includes('PRIVMSG')) {
        this.parsePrivmsg(line);
      }
    }
  }

  parsePrivmsg(rawLine) {
    let tags = {};
    let line = rawLine;

    // Extract tags
    if (line.startsWith('@')) {
      const spaceIdx = line.indexOf(' ');
      const rawTags = line.slice(1, spaceIdx);
      line = line.slice(spaceIdx + 1);

      rawTags.split(';').forEach(tag => {
        const eqIdx = tag.indexOf('=');
        if (eqIdx !== -1) {
          const key = tag.slice(0, eqIdx);
          const val = tag.slice(eqIdx + 1);
          tags[key] = val;
        }
      });
    }

    // Extract message body and author
    const privmsgIdx = line.indexOf(' PRIVMSG ');
    if (privmsgIdx === -1) return;

    const prefix = line.slice(0, privmsgIdx);
    const rest = line.slice(privmsgIdx + 9);
    const colonIdx = rest.indexOf(' :');
    if (colonIdx === -1) return;

    const messageText = rest.slice(colonIdx + 2).trim();

    // Fallback nick from prefix :nick!nick@...
    let nick = 'Espectador';
    if (prefix.startsWith(':')) {
      const excl = prefix.indexOf('!');
      nick = excl !== -1 ? prefix.slice(1, excl) : prefix.slice(1);
    }

    const displayName = tags['display-name'] || nick;
    const userColor = tags['color'] || '#00f0ff';

    // Broadcast raw chat
    this.onMessageCallbacks.forEach(cb => cb(displayName, messageText, userColor));

    // Evaluate answer in active round
    this.processChatAnswer(displayName, messageText, userColor);
  }

  /**
   * Normalizes text (removes accents, punctuation, extra spaces)
   */
  normalizeText(str) {
    if (!str) return '';
    return str
      .toString()
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // removes accents
      .replace(/[^a-z0-9]/g, "");     // removes punctuation & symbols
  }

  /**
   * Starts a new round: clears participant map and sets the target answer
   */
  startRound(targetAnswer) {
    this.participantesRonda.clear();
    this.activeAnswer = this.normalizeText(targetAnswer);
    this.isRoundActive = true;

    // Reset Live Feed list for the new round
    if (this.liveFeedList) {
      this.liveFeedList.innerHTML = '';
    }
    if (this.liveFeedCounter) {
      this.liveFeedCounter.textContent = '0';
    }
  }

  /**
   * Closes active round answering window
   */
  endRound() {
    this.isRoundActive = false;
  }

  /**
   * Validates chat response against active target answer
   */
  processChatAnswer(displayName, text, userColor) {
    if (!this.isRoundActive || !this.activeAnswer) return;

    const normalizedGuess = this.normalizeText(text);
    if (!normalizedGuess) return;

    // Exact word match
    if (normalizedGuess === this.activeAnswer) {
      const userKey = displayName.toLowerCase();

      // Rule: Map control prevents duplicate answers in the same round
      if (this.participantesRonda.has(userKey)) {
        return; // Already registered in this round
      }

      // Register first valid response
      const entry = {
        displayName,
        userColor,
        text,
        timestamp: Date.now()
      };
      this.participantesRonda.set(userKey, entry);

      // Trigger UI visual feedback
      this.triggerCajaDestacada(displayName, userColor);
      this.addToLiveFeed(displayName, userColor, text);

      // Sound chime
      audio.playTone(880, 'triangle', 0.09, 0, 0.45);

      // Notify Minigame / subscribers
      this.onValidAnswerCallbacks.forEach(cb => cb(displayName, text, userColor));
    }
  }

  /**
   * Caja Destacada (Estilo IlloJuan): Pops in prominently for 1.5s with scale animation
   */
  triggerCajaDestacada(displayName, userColor) {
    if (!this.currentVoterBox) {
      this.currentVoterBox = document.getElementById('currentVoterBox');
      this.currentVoterName = document.getElementById('currentVoterName');
    }
    if (!this.currentVoterBox || !this.currentVoterName) return;

    this.currentVoterName.textContent = displayName;
    if (userColor) {
      this.currentVoterName.style.color = userColor;
    }

    // Reset and trigger popIn animation
    this.currentVoterBox.classList.remove('voter-box-show', 'voter-box-popin');
    void this.currentVoterBox.offsetWidth; // Reflow
    this.currentVoterBox.classList.add('voter-box-show', 'voter-box-popin');

    clearTimeout(this.voterBoxTimeout);
    this.voterBoxTimeout = setTimeout(() => {
      this.currentVoterBox.classList.remove('voter-box-show', 'voter-box-popin');
    }, 1500);
  }

  /**
   * Feed en vivo ('live-votos-feed'): Stacks names in real-time with auto-scroll
   */
  addToLiveFeed(displayName, userColor, text) {
    if (!this.liveFeedList) {
      this.liveFeedList = document.getElementById('live-feed-list');
      this.liveFeedCounter = document.getElementById('live-feed-counter');
    }
    if (!this.liveFeedList) return;

    const item = document.createElement('div');
    item.className = 'live-voto-item';
    item.innerHTML = `
      <span class="voto-icon">🎮</span>
      <span class="voto-user" style="color: ${userColor || '#00f0ff'};">${displayName}</span>
      <span class="voto-badge">+1 pto</span>
    `;

    this.liveFeedList.appendChild(item);
    this.liveFeedList.scrollTop = this.liveFeedList.scrollHeight;

    if (this.liveFeedCounter) {
      this.liveFeedCounter.textContent = `${this.participantesRonda.size}`;
    }
  }

  onValidAnswer(cb) {
    this.onValidAnswerCallbacks.push(cb);
  }

  onMessage(cb) {
    this.onMessageCallbacks.push(cb);
  }

  onStatusChange(cb) {
    this.onStatusChangeCallbacks.push(cb);
  }
}

export const twitchChat = new TwitchChatBridge({ channel: 'imarixu' });
