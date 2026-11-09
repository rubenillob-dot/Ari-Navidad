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
    this.playerStatusText = document.getElementById('player-status-text');
    this.playerDeck = document.getElementById('quiz-player-deck');

    // Quiz Questions Database
    this.questions = [
      {
        melodyId: 'jingle_bells',
        title: 'Canción Navideña #1',
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
        title: 'Canción Navideña #2',
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
        title: 'Canción Navideña #3',
        options: [
          'Mi Burrito Sabanero',
          'Los Peces en el Río',
          'Feliz Navidad (José Feliciano)',
          'Rodolfo el Reno'
        ],
        correctIndex: 2
      }
    ];

    this.currentQuestionIdx = 0;
    this.score = 0;
    this.timeLeft = 15;
    this.timerInterval = null;
    this.isAnsweringLocked = false;

    this.init();
  }

  init() {
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
        if (this.isAnsweringLocked) return;
        const selectedIndex = parseInt(btn.getAttribute('data-index'), 10);
        this.handleAnswer(selectedIndex, btn);
      });
    });
  }

  startQuiz() {
    this.currentQuestionIdx = 0;
    this.score = 0;
    this.isAnsweringLocked = false;
    this.updateHUD();
    this.loadQuestion(0);
  }

  updateHUD() {
    if (this.roundDisplay) {
      this.roundDisplay.textContent = `${this.currentQuestionIdx + 1} / ${this.questions.length}`;
    }
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = `${this.score} / ${this.questions.length}`;
    }
  }

  loadQuestion(index) {
    this.currentQuestionIdx = index;
    const q = this.questions[index];
    this.updateHUD();

    // Reset Answer Button states
    const buttons = this.answersContainer.querySelectorAll('.answer-btn');
    buttons.forEach((btn, i) => {
      btn.classList.remove('btn-correct', 'btn-wrong');
      btn.disabled = false;
      const textSpan = btn.querySelector('.btn-answer-text');
      if (textSpan) textSpan.textContent = q.options[i];
    });

    this.isAnsweringLocked = false;

    // Start Timer
    this.startTimer(15);

    // Play Melody
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
      if (this.playerStatusText) this.playerStatusText.textContent = '¿Reconoces el villancico? ¡Selecciona abajo!';
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
  }

  handleAnswer(selectedIndex, clickedBtn) {
    this.isAnsweringLocked = true;
    this.stopTimer();
    audio.stopMelody();
    if (this.vinylDisc) this.vinylDisc.classList.remove('playing');
    if (this.playerDeck) this.playerDeck.classList.remove('playing');

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
      // Highlight correct answer
      buttons[q.correctIndex].classList.add('btn-correct');
      audio.playWrong();
      if (this.playerStatusText) this.playerStatusText.textContent = `❌ ¡FALLASTE! Era: "${q.options[q.correctIndex]}"`;
    }

    this.updateHUD();

    // Advance to next question after 1.8 seconds
    setTimeout(() => {
      if (this.currentQuestionIdx + 1 < this.questions.length) {
        this.loadQuestion(this.currentQuestionIdx + 1);
      } else {
        this.finishQuiz();
      }
    }, 1800);
  }

  handleTimeout() {
    this.isAnsweringLocked = true;
    audio.stopMelody();
    if (this.vinylDisc) this.vinylDisc.classList.remove('playing');
    if (this.playerDeck) this.playerDeck.classList.remove('playing');

    const q = this.questions[this.currentQuestionIdx];
    const buttons = this.answersContainer.querySelectorAll('.answer-btn');
    buttons[q.correctIndex].classList.add('btn-correct');
    audio.playWrong();
    if (this.playerStatusText) this.playerStatusText.textContent = `⏰ ¡TIEMPO AGOTADO! Era: "${q.options[q.correctIndex]}"`;

    this.updateHUD();

    setTimeout(() => {
      if (this.currentQuestionIdx + 1 < this.questions.length) {
        this.loadQuestion(this.currentQuestionIdx + 1);
      } else {
        this.finishQuiz();
      }
    }, 1800);
  }

  finishQuiz() {
    this.stopTimer();
    audio.stopMelody();

    // Passing condition: at least 2 correct answers (out of 3)
    const hasWon = this.score >= 2;

    if (hasWon) {
      // Victory!
      this.state.hasWonMinigame = true;
      this.state.spinsAvailable = 1;
      
      confetti.blast(160);
      audio.playWinFanfare();

      if (this.onVictoryCallback) {
        this.onVictoryCallback();
      }
    } else {
      // Defeat: allow retry
      if (this.playerStatusText) {
        this.playerStatusText.textContent = `⚠️ Has conseguido ${this.score}/3. ¡Necesitas al menos 2 para ganar la tirada!`;
      }
      setTimeout(() => {
        alert(`Has acertado ${this.score}/3 canciones navideñas. ¡Inténtalo de nuevo para desbloquear tu tirada en la ruleta!`);
        this.startQuiz();
      }, 500);
    }
  }
}
