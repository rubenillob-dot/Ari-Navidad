/**
 * Ari-Navidad Minigame 1: Adivina la Canción Navideña
 * Neon progress timer bar, 4 Fortnite comic response buttons, synth audio playback,
 * score validation, and unlocking the unique spin for the Christmas Roulette!
 */

import { audio } from './audio.js';
import { confetti } from './confetti.js';

export class MinigameSongGuesser {
  constructor(state, onVictoryCallback) {
    this.state = state;
    this.onVictoryCallback = onVictoryCallback;

    // DOM Elements
    this.roundDisplay = document.getElementById('quiz-round-display');
    this.scoreDisplay = document.getElementById('quiz-score-display');
    this.timerDisplay = document.getElementById('quiz-timer-display');
    this.timerFill = document.getElementById('quiz-timer-fill');
    this.timerBarText = document.getElementById('timer-bar-text');
    this.vinylDisc = document.getElementById('quiz-vinyl');
    this.answersContainer = document.getElementById('quiz-answers-container');
    this.btnReplay = document.getElementById('btn-replay-song');
    this.btnStartRound = document.getElementById('btn-start-round-m1');
    this.playerStatusText = document.getElementById('player-status-text');
    this.playerDeck = document.getElementById('quiz-player-deck');

    // Quiz Questions Database - 20 Rondas Festivas
    this.questions = [
      {
        melodyId: 'jingle_bells',
        title: 'Ronda 1: Villancico Universal',
        options: [
          'Jingle Bells',
          'Campana sobre Campana',
          'Noche de Paz',
          'El Tamborilero'
        ],
        correctIndex: 0
      },
      {
        melodyId: 'all_i_want',
        title: 'Ronda 2: Himno Pop de Navidad',
        options: [
          'Santa Tell Me',
          'All I Want for Christmas Is You',
          'Let It Snow! Let It Snow!',
          'Blanca Navidad'
        ],
        correctIndex: 1
      },
      {
        melodyId: 'feliz_navidad',
        title: 'Ronda 3: Clásico Latino Bilingüe',
        options: [
          'Mi Burrito Sabanero',
          'Los Peces en el Río',
          'Feliz Navidad (José Feliciano)',
          'Rodolfo el Reno'
        ],
        correctIndex: 2
      },
      {
        melodyId: 'campana',
        title: 'Ronda 4: Tradición Española',
        options: [
          'Campana sobre Campana',
          'La Marimorena',
          'Ay del Chiquirritín',
          'El Tamborilero'
        ],
        correctIndex: 0
      },
      {
        melodyId: 'noche_de_paz',
        title: 'Ronda 5: La Balada Más Serena',
        options: [
          'Blanca Navidad',
          'Noche de Paz (Silent Night)',
          'Santa Claus Llegó a la Ciudad',
          'Hacia Belén va una Burra'
        ],
        correctIndex: 1
      },
      {
        melodyId: 'peces_rio',
        title: 'Ronda 6: Río de Ilusión',
        options: [
          'El Tamborilero',
          'Los Peces en el Río',
          'Mi Burrito Sabanero',
          'Jingle Bell Rock'
        ],
        correctIndex: 1
      },
      {
        melodyId: 'merry_christmas',
        title: 'Ronda 7: Saludo Festivo',
        options: [
          'Deck the Halls',
          'Rudolph the Red-Nosed Reindeer',
          'We Wish You a Merry Christmas',
          'Last Christmas'
        ],
        correctIndex: 2
      },
      {
        melodyId: 'burrito',
        title: 'Ronda 8: Camino de Belén',
        options: [
          'Mi Burrito Sabanero',
          'Campana sobre Campana',
          'La Marimorena',
          'Feliz Navidad'
        ],
        correctIndex: 0
      },
      {
        melodyId: 'rudolph',
        title: 'Ronda 9: La Nariz Brillante',
        options: [
          'Frosty the Snowman',
          'Rodolfo el Reno (Rudolph)',
          'Santa Claus Llegó a la Ciudad',
          'Jingle Bells'
        ],
        correctIndex: 1
      },
      {
        melodyId: 'tamborilero',
        title: 'Ronda 10: Rom Pom Pom Pom',
        options: [
          'Los Peces en el Río',
          'Noche de Paz',
          'El Tamborilero',
          'Ay del Chiquirritín'
        ],
        correctIndex: 2
      },
      {
        melodyId: 'blanca_navidad',
        title: 'Ronda 11: Paisaje Nevado',
        options: [
          'Blanca Navidad (White Christmas)',
          'Let It Snow!',
          'Winter Wonderland',
          'Last Christmas'
        ],
        correctIndex: 0
      },
      {
        melodyId: 'last_christmas',
        title: 'Ronda 12: Desamor en Nochebuena',
        options: [
          'All I Want for Christmas Is You',
          'Santa Tell Me',
          'Last Christmas (Wham!)',
          'Rockin\' Around the Christmas Tree'
        ],
        correctIndex: 2
      },
      {
        melodyId: 'santa_claus',
        title: 'Ronda 13: El Trineo se Acerca',
        options: [
          'Jingle Bell Rock',
          'Santa Claus Llegó a la Ciudad',
          'Frosty the Snowman',
          'Deck the Halls'
        ],
        correctIndex: 1
      },
      {
        melodyId: 'let_it_snow',
        title: 'Ronda 14: Tormenta en Leonida',
        options: [
          'Let It Snow! Let It Snow!',
          'White Christmas',
          'Winter Wonderland',
          'Sleigh Ride'
        ],
        correctIndex: 0
      },
      {
        melodyId: 'frosty',
        title: 'Ronda 15: Muñeco de Nieve',
        options: [
          'Rodolfo el Reno',
          'Frosty the Snowman',
          'El Grinch',
          'Jack Frost'
        ],
        correctIndex: 1
      },
      {
        melodyId: 'burra_belen',
        title: 'Ronda 16: Rin Rin Remendaba',
        options: [
          'Mi Burrito Sabanero',
          'Campana sobre Campana',
          'Hacia Belén va una Burra',
          'Los Peces en el Río'
        ],
        correctIndex: 2
      },
      {
        melodyId: 'chiquirritin',
        title: 'Ronda 17: Metidito entre Pajas',
        options: [
          'Ay del Chiquirritín',
          'La Marimorena',
          'El Tamborilero',
          'Noche de Paz'
        ],
        correctIndex: 0
      },
      {
        melodyId: 'marimorena',
        title: 'Ronda 18: Noche de Fiesta',
        options: [
          'Los Peces en el Río',
          'Campana sobre Campana',
          'La Marimorena (Ande, Ande)',
          'Hacia Belén va una Burra'
        ],
        correctIndex: 2
      },
      {
        melodyId: 'rockin_tree',
        title: 'Ronda 19: Bailando alrededor del Árbol',
        options: [
          'Jingle Bell Rock',
          'Rockin\' Around the Christmas Tree',
          'Run Rudolph Run',
          'Last Christmas'
        ],
        correctIndex: 1
      },
      {
        melodyId: 'jingle_bell_rock',
        title: 'Ronda 20: Gran Final Rockero',
        options: [
          'Jingle Bells',
          'Rockin\' Around the Christmas Tree',
          'Jingle Bell Rock',
          'Santa Claus Llegó a la Ciudad'
        ],
        correctIndex: 2
      }
    ];

    this.currentQuestionIdx = 0;
    this.score = 0;
    this.timeLeft = 15;
    this.timerInterval = null;
    this.isAnsweringLocked = true;
    this.isRoundRunning = false;
    this.quizFinished = false;

    this.init();
  }

  init() {
    if (this.btnStartRound) {
      this.btnStartRound.addEventListener('click', () => {
        audio.playClick();
        this.onStartRoundBtnClicked();
      });
    }

    if (this.btnReplay) {
      this.btnReplay.addEventListener('click', () => {
        audio.playClick();
        this.playCurrentMelody();
      });
    }

    // Bind Answer Buttons
    const buttons = this.answersContainer.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (this.isAnsweringLocked || !this.isRoundRunning) return;
        const selectedIndex = parseInt(btn.getAttribute('data-index'), 10);
        this.handleAnswer(selectedIndex, btn);
      });
    });
  }

  startQuiz() {
    this.currentQuestionIdx = 0;
    this.score = 0;
    this.quizFinished = false;
    this.isAnsweringLocked = true;
    this.isRoundRunning = false;
    this.stopTimer();
    audio.stopMelody();
    this.updateHUD();
    this.setupQuestion(0);
  }

  updateHUD() {
    if (this.roundDisplay) {
      this.roundDisplay.textContent = `${this.currentQuestionIdx + 1} / ${this.questions.length}`;
    }
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = `${this.score} / ${this.questions.length} (Meta: 10)`;
    }
  }

  setupQuestion(index) {
    this.currentQuestionIdx = index;
    this.isRoundRunning = false;
    this.isAnsweringLocked = true;
    this.stopTimer();
    audio.stopMelody();
    this.updateHUD();

    const q = this.questions[index];

    // Reset Answer Buttons in waiting state
    const buttons = this.answersContainer.querySelectorAll('.answer-btn');
    buttons.forEach((btn, i) => {
      btn.classList.remove('btn-correct', 'btn-wrong');
      btn.disabled = true; // Disabled until round starts
      const textSpan = btn.querySelector('.btn-answer-text');
      if (textSpan) textSpan.textContent = q.options[i];
    });

    // Reset Timer Display to 15s (stopped)
    this.timeLeft = 15;
    if (this.timerDisplay) this.timerDisplay.textContent = '15s';
    if (this.timerFill) {
      this.timerFill.style.width = '100%';
      this.timerFill.classList.remove('urgent');
    }
    if (this.timerBarText) this.timerBarText.textContent = '100%';

    // Vinyl and Deck stopped
    if (this.vinylDisc) this.vinylDisc.classList.remove('playing');
    if (this.playerDeck) this.playerDeck.classList.remove('playing');

    // Show Start Round Button & Hide Replay Button
    if (this.btnStartRound) {
      this.btnStartRound.style.display = 'inline-flex';
      this.btnStartRound.innerHTML = `<span>▶</span> ¡EMPEZAR RONDA ${index + 1} / ${this.questions.length}!`;
    }
    if (this.btnReplay) {
      this.btnReplay.style.display = 'none';
    }

    if (this.playerStatusText) {
      this.playerStatusText.textContent = `👉 Pulsa "▶ ¡EMPEZAR RONDA ${index + 1}!" para escuchar la melodía navideña.`;
    }
  }

  onStartRoundBtnClicked() {
    if (this.quizFinished) {
      this.startQuiz();
      return;
    }

    if (!this.isRoundRunning) {
      this.startCurrentRound();
    }
  }

  startCurrentRound() {
    this.isRoundRunning = true;
    this.isAnsweringLocked = false;

    // Enable answer buttons
    const buttons = this.answersContainer.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
      btn.disabled = false;
    });

    // Hide Start Button, Show Replay Button
    if (this.btnStartRound) {
      this.btnStartRound.style.display = 'none';
    }
    if (this.btnReplay) {
      this.btnReplay.style.display = 'inline-flex';
    }

    // Start 15s countdown
    this.startTimer(15);

    // Play synthesized melody
    this.playCurrentMelody();
  }

  playCurrentMelody() {
    const q = this.questions[this.currentQuestionIdx];
    if (!q) return;

    if (this.vinylDisc) this.vinylDisc.classList.add('playing');
    if (this.playerDeck) this.playerDeck.classList.add('playing');
    if (this.playerStatusText) this.playerStatusText.textContent = '🎶 Reproduciendo melodía navideña...';

    audio.playCarolMelody(q.melodyId, null, () => {
      if (this.vinylDisc) this.vinylDisc.classList.remove('playing');
      if (this.playerDeck) this.playerDeck.classList.remove('playing');
      if (this.playerStatusText && this.isRoundRunning) {
        this.playerStatusText.textContent = '¿Reconoces el villancico? ¡Selecciona tu respuesta!';
      }
    });
  }

  startTimer(seconds) {
    clearInterval(this.timerInterval);
    this.timeLeft = seconds;
    const totalTime = seconds;

    const updateTimerBar = () => {
      const percentage = Math.max(0, (this.timeLeft / totalTime) * 100);
      if (this.timerDisplay) this.timerDisplay.textContent = `${Math.ceil(this.timeLeft)}s`;
      if (this.timerFill) {
        this.timerFill.style.width = `${percentage}%`;
        if (percentage <= 30) {
          this.timerFill.classList.add('urgent');
        } else {
          this.timerFill.classList.remove('urgent');
        }
      }
      if (this.timerBarText) {
        this.timerBarText.textContent = `${Math.round(percentage)}%`;
      }
    };

    updateTimerBar();

    this.timerInterval = setInterval(() => {
      this.timeLeft -= 0.1;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        updateTimerBar();
        clearInterval(this.timerInterval);
        this.handleTimeout();
      } else {
        updateTimerBar();
      }
    }, 100);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.isRoundRunning = false;
    if (this.vinylDisc) this.vinylDisc.classList.remove('playing');
    if (this.playerDeck) this.playerDeck.classList.remove('playing');
  }

  handleAnswer(selectedIndex, clickedBtn) {
    this.isAnsweringLocked = true;
    this.isRoundRunning = false;
    this.stopTimer();
    audio.stopMelody();

    const q = this.questions[this.currentQuestionIdx];
    const isCorrect = selectedIndex === q.correctIndex;
    const buttons = this.answersContainer.querySelectorAll('.answer-btn');

    if (isCorrect) {
      this.score++;
      clickedBtn.classList.add('btn-correct');
      audio.playCorrect();
      if (this.playerStatusText) this.playerStatusText.textContent = '✨ ¡EXCELENTE! ¡ACERTASTE!';
    } else {
      clickedBtn.classList.add('btn-wrong');
      buttons[q.correctIndex].classList.add('btn-correct');
      audio.playWrong();
      if (this.playerStatusText) this.playerStatusText.textContent = `❌ ¡FALLASTE! Era: "${q.options[q.correctIndex]}"`;
    }

    this.updateHUD();
    this.showNextRoundControls();
  }

  handleTimeout() {
    this.isAnsweringLocked = true;
    this.isRoundRunning = false;
    audio.stopMelody();

    const q = this.questions[this.currentQuestionIdx];
    const buttons = this.answersContainer.querySelectorAll('.answer-btn');
    buttons[q.correctIndex].classList.add('btn-correct');
    audio.playWrong();
    if (this.playerStatusText) this.playerStatusText.textContent = `⏰ ¡TIEMPO AGOTADO! Era: "${q.options[q.correctIndex]}"`;

    this.updateHUD();
    this.showNextRoundControls();
  }

  showNextRoundControls() {
    // Lock buttons
    const buttons = this.answersContainer.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.disabled = true);

    if (this.btnReplay) this.btnReplay.style.display = 'none';

    if (this.currentQuestionIdx + 1 < this.questions.length) {
      const nextIdx = this.currentQuestionIdx + 1;
      if (this.btnStartRound) {
        this.btnStartRound.style.display = 'inline-flex';
        this.btnStartRound.innerHTML = `<span>▶</span> ¡EMPEZAR RONDA ${nextIdx + 1} / ${this.questions.length}!`;
      }
      setTimeout(() => {
        if (this.playerStatusText && !this.isRoundRunning) {
          this.playerStatusText.textContent = `¡Ronda finalizada! Pulsa "▶ ¡EMPEZAR RONDA ${nextIdx + 1}!" cuando estés listo.`;
        }
      }, 1000);
      
      // Update click handler to prepare and start next question
      this.btnStartRound.onclick = () => {
        audio.playClick();
        this.setupQuestion(nextIdx);
        this.startCurrentRound();
      };
    } else {
      // 20 rounds done
      setTimeout(() => {
        this.finishQuiz();
      }, 1200);
    }
  }

  finishQuiz() {
    this.stopTimer();
    audio.stopMelody();
    this.quizFinished = true;

    const REQUIRED_CORRECT = 10;
    const hasWon = this.score >= REQUIRED_CORRECT;

    if (hasWon) {
      // Victory!
      this.state.hasWonMinigame = true;
      this.state.spinsAvailable = 1;
      
      confetti.blast(160);
      audio.playWinFanfare();

      if (this.playerStatusText) {
        this.playerStatusText.textContent = `🎉 ¡VICTORIA ROYALE! Has acertado ${this.score}/20 canciones. ¡1 tirada en la ruleta desbloqueada!`;
      }

      if (this.btnStartRound) {
        this.btnStartRound.style.display = 'inline-flex';
        this.btnStartRound.innerHTML = `<span>🎰</span> ¡IR A LA RULETA NAVIDEÑA!`;
        this.btnStartRound.onclick = () => {
          if (window.ariNavigate) window.ariNavigate('roulette');
        };
      }

      if (this.onVictoryCallback) {
        this.onVictoryCallback();
      }
    } else {
      // Defeat: allow retry without annoying popup alert
      if (this.playerStatusText) {
        this.playerStatusText.textContent = `⚠️ Fin de la partida: ${this.score}/20 aciertos. ¡Necesitas al menos ${REQUIRED_CORRECT} para ganar la tirada! Pulsa para reiniciar.`;
      }
      if (this.btnStartRound) {
        this.btnStartRound.style.display = 'inline-flex';
        this.btnStartRound.innerHTML = `<span>🔄</span> REINTENTAR MINIJUEGO (Ronda 1)`;
        this.btnStartRound.onclick = () => {
          audio.playClick();
          this.startQuiz();
        };
      }
    }
  }
}
