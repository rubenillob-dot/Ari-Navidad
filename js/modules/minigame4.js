/**
 * Ari-Navidad Minigame 4 (Día 4): El Gran Atraco del Grinch - Pistas de Ocean Drive
 * 25 rondas de investigación policial contrarreloj con pistas progresivas,
 * 4 botones cómic de sospechosos, soporte para chat de Twitch,
 * botón para comenzar cada ronda y clasificación por aciertos y rapidez.
 */

import { audio } from './audio.js';
import { confetti } from './confetti.js';
import { twitchChat } from './twitch-chat.js';

export const GRINCH_CASES = [
  {
    ronda: 1,
    caso: "Sospechoso de Rojo",
    pistas: [
      "Viste traje rojo aterciopelado y gorro con pompón blanco.",
      "Se cuela por chimeneas estrechas sin dejar huellas en la alfombra.",
      "Se ríe fuertemente exclamando ¡JO, JO, JO! en Nochebuena."
    ],
    opciones: ["Papá Noel", "El Grinch", "Duende Verde", "Tommy Vercetti"],
    correctIndex: 0,
    respuestasValidas: ["papa noel", "santa claus", "santa", "san nicolas"]
  },
  {
    ronda: 2,
    caso: "Fugitivo Peludo Verde",
    pistas: [
      "Pelaje verde lima despeinado y sonrisa maliciosa.",
      "Habita en una fría cueva en lo alto del Monte Crumpit con su perro Max.",
      "Confesó odiar los villancicos y planea robar los regalos del pueblo."
    ],
    opciones: ["El Grinch", "Shrek", "Yeti de Leonida", "El Caco Jones"],
    correctIndex: 0,
    respuestasValidas: ["el grinch", "grinch"]
  },
  {
    ronda: 3,
    caso: "Vehículo Aéreo Sin Motor",
    pistas: [
      "No consume gasolina ni emite humo de escape.",
      "Aterriza a gran velocidad sobre tejados nevados e inclinados.",
      "Es propulsado por un equipo de 8 renos con arneses mágicos."
    ],
    opciones: ["El Trineo Mágico", "Furgoneta Lunar", "Helicóptero Vice", "Choppa Navideño"],
    correctIndex: 0,
    respuestasValidas: ["el trineo magico", "el trineo", "trineo magico", "trineo"]
  },
  {
    ronda: 4,
    caso: "Líder de la Manada",
    pistas: [
      "Sufrió burlas de joven por una peculiaridad en su rostro.",
      "Su hocico desprende un resplandor escarlata que atraviesa la niebla.",
      "Fue reclutado personalmente para liderar el vuelo en la peor ventisca."
    ],
    opciones: ["Rodolfo el Reno", "Bambi", "Cometa", "Trueno"],
    correctIndex: 0,
    respuestasValidas: ["rodolfo el reno", "rodolfo", "rudolph"]
  },
  {
    ronda: 5,
    caso: "Sospechoso Helado",
    pistas: [
      "Su cuerpo está formado por tres enormes esferas congeladas.",
      "Lleva una chistera rota, bufanda de lana y dos ramas por brazos.",
      "Su olfato proviene de una zanahoria fresca colocada como nariz."
    ],
    opciones: ["Muñeco de Nieve", "Olaf", "Espantapájaros", "Glaciar Andante"],
    correctIndex: 0,
    respuestasValidas: ["muneco de nieve", "frosty", "snowman", "el muneco de nieve"]
  },
  {
    ronda: 6,
    caso: "Adorno Circular en Fuga",
    pistas: [
      "Estructura tejida con ramas de pino, acebo y piñas silvestres.",
      "Tiene forma de aro perfecto y suele llevar un gran lazo rojo.",
      "Se cuelga en el exterior de las puertas principales de bienvenida."
    ],
    opciones: ["Corona Navideña", "Guirnalda Festiva", "Lazo Gigante", "Aro Hula Hula"],
    correctIndex: 0,
    respuestasValidas: ["corona navideña", "corona de navidad", "la corona", "corona"]
  },
  {
    ronda: 7,
    caso: "Fugitivo Galleta Veloz",
    pistas: [
      "Horneado con harina dulce, canela y una pizca picante de jengibre.",
      "Lleva ojos de chocolate blanco y botones de caramelo de colores.",
      "Grita a las patrullas: ¡Corred todo lo que queráis, no podéis alcanzarme!"
    ],
    opciones: ["Hombre de Jengibre", "Galleta María", "Muffin de Nieve", "Donut Glaseado"],
    correctIndex: 0,
    respuestasValidas: ["hombre de jengibre", "galleta de jengibre", "gingerbread man", "jengibre"]
  },
  {
    ronda: 8,
    caso: "Instrumento Metálico",
    pistas: [
      "Pieza de bronce o latón en forma de copa invertida.",
      "Posee un badajo interno que golpea al balancearse rítmicamente.",
      "En el villancico suena 'campana sobre campana, y sobre campana una'."
    ],
    opciones: ["Campana Navideña", "Triángulo Musical", "Pandereta", "Cencerro"],
    correctIndex: 0,
    respuestasValidas: ["campana navideña", "campana", "las campanas", "campanas"]
  },
  {
    ronda: 9,
    caso: "Árbol Decorado Desaparecido",
    pistas: [
      "Especie perenne de hojas aciculares y perfume a resina de montaña.",
      "Soporta cientos de luces LED titilantes y bolas de cristal.",
      "Bajo sus ramas bajas suelen amontonarse los paquetes de regalos."
    ],
    opciones: ["Árbol de Navidad", "Palmera de Vice City", "Roble Milenario", "Cactus Festivo"],
    correctIndex: 0,
    respuestasValidas: ["arbol de navidad", "el arbol", "pino navideño", "arbol"]
  },
  {
    ronda: 10,
    caso: "Mineral Falso Sospechoso",
    pistas: [
      "Tiene textura rugosa y apariencia de roca negra procedente de una mina.",
      "En realidad está compuesto de azúcar endurecido y tinte comestible.",
      "Se entrega en un saco a los niños traviesos para darles un escarmiento."
    ],
    opciones: ["Carbón Dulce", "Regaliz Negro", "Piedra Pómez", "Turrón Quemado"],
    correctIndex: 0,
    respuestasValidas: ["carbon dulce", "carbon", "el carbon"]
  },
  {
    ronda: 11,
    caso: "Operario de Taller Diminuto",
    pistas: [
      "Estatura baja, orejas puntiagudas y botines con cascabel en la punta.",
      "Viste chaleco verde y delantal de cuero para trabajar la madera.",
      "Pasa el año entero martilleando juguetes en la fábrica del Ártico."
    ],
    opciones: ["Elfo de Navidad", "Gnomo de Jardín", "Pitufo Festivo", "Duende Travieso"],
    correctIndex: 0,
    respuestasValidas: ["elfo de navidad", "elfo", "los elfos", "duende navideño"]
  },
  {
    ronda: 12,
    caso: "Esfera de Vidrio Mágica",
    pistas: [
      "Domo transparente sellado montado sobre una peana de madera noble.",
      "En su interior alberga un pueblecito en miniatura sumido en calma.",
      "Basta con agitarla boca abajo para provocar una tempestad de copos blancos."
    ],
    opciones: ["Bola de Nieve", "Globo de Fiesta", "Canica Gigante", "Reloj de Cristal"],
    correctIndex: 0,
    respuestasValidas: ["bola de nieve", "esfera de nieve", "la bola de nieve"]
  },
  {
    ronda: 13,
    caso: "Tronco Mágico Sospechoso",
    pistas: [
      "Tronco de leña con barretina roja catalana y dos patas de madera.",
      "Los niños lo tapan con una manta y lo alimentan con cáscaras de naranja.",
      "Se le golpea con un bastón mientras se canta para que defeque golosinas."
    ],
    opciones: ["Tió de Nadal", "Piñata Mexicana", "Tronco de Chimenea", "Muñeco de Madera"],
    correctIndex: 0,
    respuestasValidas: ["tio de nadal", "caga tio", "el tio de nadal", "tio nadal"]
  },
  {
    ronda: 14,
    caso: "Crimen del 28 de Diciembre",
    pistas: [
      "Fecha marcada por bromas telefónicas y noticias insólitas en prensa.",
      "El arma del delito es un monigote de papel blanco recortado.",
      "Se pega sigilosamente en la espalda de la víctima sin que se dé cuenta."
    ],
    opciones: ["Día de los Inocentes", "Noche de Brujas", "Carnaval de Leonida", "April Fools"],
    correctIndex: 0,
    respuestasValidas: ["dia de los inocentes", "los inocentes", "santos inocentes"]
  },
  {
    ronda: 15,
    caso: "Prenda Estrambótica Textil",
    pistas: [
      "Prenda de punto grueso tejida con lana excesivamente calurosa.",
      "Estampados chillones con renos bordados, cascabeles o luces intermitentes.",
      "En todo el mundo se celebran concursos para coronar al modelo más feo."
    ],
    opciones: ["Jersey Navideño Feo", "Chaleco de Lana", "Poncho de Neón", "Bufanda Gigante"],
    correctIndex: 0,
    respuestasValidas: ["jersey navideño feo", "jersey navideño", "ugly sweater", "sueter navideño"]
  },
  {
    ronda: 16,
    caso: "Dulce de Harina y Manteca",
    pistas: [
      "Especialidad andaluza nacida en Estepa a base de harina tostada y almendra.",
      "Se presenta envuelto herméticamente en un fino papel de seda blanco.",
      "Los veteranos recomiendan apretarlo con el puño antes de abrir para no romperlo."
    ],
    opciones: ["El Polvorón", "El Mazapán", "La Rosquilla", "El Mantecado"],
    correctIndex: 0,
    respuestasValidas: ["el polvoron", "polvoron", "mantecado"]
  },
  {
    ronda: 17,
    caso: "Contenedor de Botín Legendario",
    pistas: [
      "Animal andino de papel maché con tonos púrpuras, azules y celestes.",
      "Cae en paracaídas sobre los tejados de la isla de Battle Royale.",
      "Al abrirla estalla en botiquines, pociones de escudo y munición dorada."
    ],
    opciones: ["Llama de Fortnite", "Caja Fuerte Vice", "Cofre del Tesoro", "Drop Militar"],
    correctIndex: 0,
    respuestasValidas: ["llama de fortnite", "llama de suministro", "la llama", "llama"]
  },
  {
    ronda: 18,
    caso: "Demonio Alpino Cornudo",
    pistas: [
      "Criatura legendaria de los bosques alpinos con pelaje oscuro y pezuñas hendidas.",
      "Hace sonar pesadas cadenas de hierro y porta un fajo de varas de abedul.",
      "Persigue a los niños desobedientes en la noche del 5 de diciembre."
    ],
    opciones: ["Krampus", "El Grinch", "Hombre del Saco", "Gárgola Nocturna"],
    correctIndex: 0,
    respuestasValidas: ["krampus", "el krampus"]
  },
  {
    ronda: 19,
    caso: "Artificio Festivo Británico",
    pistas: [
      "Cilindro de cartón envuelto en papel de regalo con forma de caramelo gigante.",
      "Dos personas agarran de cada extremo y tiran con fuerza hasta que parte.",
      "Produce un chasquido detonante y libera una corona de papel, un chiste y un regalo."
    ],
    opciones: ["Christmas Cracker", "Bengala de Fiesta", "Petardo de Feria", "Tubo de Humo"],
    correctIndex: 0,
    respuestasValidas: ["christmas cracker", "cracker", "el cracker"]
  },
  {
    ronda: 20,
    caso: "Bebida Espesa con Nuez Moscada",
    pistas: [
      "Pócima láctea cremosa servida en tazas de cristal esmerilado.",
      "Preparada con leche fresca, yemas batidas, canela y ralladura aromática.",
      "Conocida popularmente en Norteamérica como 'Eggnog' durante las fiestas."
    ],
    opciones: ["Ponche de Huevo", "Chocolate Caliente", "Batido de Menta", "Café Irlandés"],
    correctIndex: 0,
    respuestasValidas: ["ponche de huevo", "eggnog", "el ponche de huevo"]
  },
  {
    ronda: 21,
    caso: "Instrumento Rústico de Barro",
    pistas: [
      "Cuerpo de cerámica esmaltada con una membrana de piel tirante.",
      "Lleva una caña fina en el centro que se frota rítmicamente con la mano húmeda.",
      "Genera un sonido ronco y vibrante imprescindible en villancicos flamencos."
    ],
    opciones: ["La Zambomba", "La Pandereta", "El Almirez", "El Triángulo"],
    correctIndex: 0,
    respuestasValidas: ["la zambomba", "zambomba", "zambombas"]
  },
  {
    ronda: 22,
    caso: "Figura Traviesa del Pesebre",
    pistas: [
      "Personaje tradicional del Belén con barretina catalana y faja roja.",
      "Se oculta intencionadamente detrás de pajares o matas lejos del portal.",
      "Aparece agachado realizando sus necesidades fisiológicas para abonar la tierra."
    ],
    opciones: ["El Caganer", "El Pastorcillo", "El Posadero", "El Paje Real"],
    correctIndex: 0,
    respuestasValidas: ["el caganer", "caganer"]
  },
  {
    ronda: 23,
    caso: "Sorteo Millonario de San Ildefonso",
    pistas: [
      "Acontecimiento multitudinario que paraliza España la mañana del 22 de diciembre.",
      "Dos grandes bombos dorados extraen bolas de madera con números y premios.",
      "Todo el país espera ansioso escuchar el cántico de 'Cuatrocientos mil euros'."
    ],
    opciones: ["Lotería de Navidad", "Sorteo del Niño", "Euromillones", "La Primitiva"],
    correctIndex: 0,
    respuestasValidas: ["loteria de navidad", "la loteria", "el gordo", "loteria"]
  },
  {
    ronda: 24,
    caso: "Cuartel General del Hielo",
    pistas: [
      "Punto más septentrional de la superficie terrestre en medio del océano helado.",
      "Aquí la noche dura seis meses y las auroras boreales iluminan los cielos.",
      "Alberga las pistas de aterrizaje y hangares secretos donde se carga el trineo."
    ],
    opciones: ["El Polo Norte", "La Antártida", "Groenlandia", "Siberia"],
    correctIndex: 0,
    respuestasValidas: ["el polo norte", "polo norte", "north pole"]
  },
  {
    ronda: 25,
    caso: "Monarca de Barba Blanca y Oro",
    pistas: [
      "El más veterano de los tres sabios de oriente que siguieron la estrella.",
      "Viste capa con ribetes de armiño y corona de oro labrado.",
      "Presentó al infante una urna de oro fino en homenaje a su linaje real."
    ],
    opciones: ["Rey Melchor", "Rey Gaspar", "Rey Baltasar", "Emperador César"],
    correctIndex: 0,
    respuestasValidas: ["rey melchor", "melchor", "el rey melchor"]
  }
];

export class MinigameGrinchHeist {
  constructor(state, onVictoryCallback) {
    this.state = state;
    this.onVictoryCallback = onVictoryCallback;

    this.cases = GRINCH_CASES;
    this.totalRounds = this.cases.length; // 25
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

    // Progressive Clue Timers
    this.clueTimers = [];

    // Bot Pool
    this.botNames = [
      'LeonidaPro', 'ViceCityElf', 'FortniteKing', 'NavidadGamer',
      'RudolphSpeed', 'TwitchChallenger', 'SantaSniper', 'GrinchHacker'
    ];

    this.cacheDOM();
  }

  cacheDOM() {
    this.roundBadge = document.getElementById('m4-round-badge');
    this.phaseBadge = document.getElementById('m4-phase-badge');
    this.caseTitleEl = document.getElementById('m4-case-title');
    this.clue1El = document.getElementById('m4-clue-1');
    this.clue2El = document.getElementById('m4-clue-2');
    this.clue3El = document.getElementById('m4-clue-3');
    this.statusBannerEl = document.getElementById('m4-status-banner');
    this.btnStartRound = document.getElementById('m4-btn-start-round');

    // Circular Timer
    this.circleProgress = document.getElementById('m4-timer-circle');
    this.timerText = document.getElementById('m4-timer-text');
    this.circleCircumference = 2 * Math.PI * 48;

    // 4 Comic Option Buttons
    this.optionBtns = [
      document.getElementById('m4-opt-0'),
      document.getElementById('m4-opt-1'),
      document.getElementById('m4-opt-2'),
      document.getElementById('m4-opt-3')
    ];

    // Leaderboard
    this.leaderboardList = document.getElementById('m4-leaderboard-list');
    this.totalPlayersPill = document.getElementById('m4-total-players');
    this.btnResetGame = document.getElementById('m4-btn-reset');

    // Chat / Input Dock
    this.chatFeed = document.getElementById('m4-chat-feed');
    this.inputUser = document.getElementById('m4-input-user');
    this.inputAnswer = document.getElementById('m4-input-answer');
    this.btnSend = document.getElementById('m4-btn-send');
    this.btnSimBots = document.getElementById('m4-btn-sim-bots');

    // Bind Option Clicks
    this.optionBtns.forEach((btn, idx) => {
      if (btn) {
        btn.onclick = (e) => {
          e.preventDefault();
          if (this.phase !== 'answering') return;
          const currentCase = this.cases[this.currentRoundIdx];
          const choiceText = currentCase.opciones[idx];
          const username = (this.inputUser && this.inputUser.value.trim()) || 'Tú (Streamer)';
          const speed = Math.max(0.1, parseFloat(((Date.now() - this.roundStartTime) / 1000).toFixed(2)));
          this.submitAnswer(username, choiceText, speed);
        };
      }
    });

    // Bind Chat Input
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
      this.chatFeed.innerHTML = '<div class="chat-log-msg system">⭐ ¡Día 4 en marcha! 25 casos del Atraco del Grinch. Pulsa "▶ ¡EMPEZAR RONDA 1!" para iniciar la radio policial.</div>';
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

    const c = this.cases[idx];

    if (this.roundBadge) {
      this.roundBadge.textContent = `RONDA ${idx + 1} / ${this.totalRounds}`;
    }
    if (this.phaseBadge) {
      this.phaseBadge.textContent = `⏸️ ESPERANDO INICIO (CASO ${idx + 1})`;
      this.phaseBadge.className = 'karaoke-phase-tag phase-break';
    }
    if (this.caseTitleEl) {
      this.caseTitleEl.innerHTML = `🚨 CASO #${idx + 1}: <span style="color: var(--fn-yellow);">${c.caso.toUpperCase()}</span>`;
    }

    // Reset Clue Boxes
    if (this.clue1El) {
      this.clue1El.innerHTML = `<strong>Pista 1:</strong> <em>"Transmisión lista. Esperando inicio de ronda..."</em>`;
      this.clue1El.className = 'police-clue-item clue-pending';
    }
    if (this.clue2El) {
      this.clue2El.innerHTML = `<strong>Pista 2:</strong> <em>[Bloqueada hasta los 4s]</em>`;
      this.clue2El.className = 'police-clue-item clue-locked';
    }
    if (this.clue3El) {
      this.clue3El.innerHTML = `<strong>Pista 3:</strong> <em>[Bloqueada hasta los 8s]</em>`;
      this.clue3El.className = 'police-clue-item clue-locked';
    }

    // Render Option Buttons
    this.optionBtns.forEach((btn, i) => {
      if (btn) {
        btn.disabled = true;
        btn.className = `fn-btn answer-btn opt-style-${i}`;
        const label = btn.querySelector('.btn-answer-text');
        if (label) label.textContent = c.opciones[i];
      }
    });

    if (this.statusBannerEl) {
      this.statusBannerEl.innerHTML = `<span>👉</span> Pulsa "<strong>▶ ¡EMPEZAR RONDA ${idx + 1} / ${this.totalRounds}!</strong>" para activar el escáner de radio y los botones de sospechosos.`;
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

    const c = this.cases[this.currentRoundIdx];

    if (this.btnStartRound) {
      this.btnStartRound.style.display = 'none';
    }

    // Enable option buttons
    this.optionBtns.forEach(btn => {
      if (btn) btn.disabled = false;
    });

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
      this.statusBannerEl.innerHTML = `<span>📡</span> ¡Transmisión en directo! Escucha las pistas y pulsa la opción correcta o escríbela en el chat.`;
      this.statusBannerEl.className = 'karaoke-status-banner status-waiting';
    }

    // Trigger Clue 1 immediately
    if (this.clue1El) {
      this.clue1El.innerHTML = `<strong>Pista 1:</strong> "${c.pistas[0]}"`;
      this.clue1El.className = 'police-clue-item clue-revealed';
      audio.playTone(440, 'triangle', 0.08, 0, 0.3);
    }

    // Schedule Progressive Clue 2 at 4 seconds
    const t2 = setTimeout(() => {
      if (this.phase === 'answering' && this.clue2El) {
        this.clue2El.innerHTML = `<strong>Pista 2:</strong> "${c.pistas[1]}"`;
        this.clue2El.className = 'police-clue-item clue-revealed';
        audio.playTone(550, 'triangle', 0.08, 0, 0.35);
      }
    }, 4000);

    // Schedule Progressive Clue 3 at 8 seconds
    const t3 = setTimeout(() => {
      if (this.phase === 'answering' && this.clue3El) {
        this.clue3El.innerHTML = `<strong>Pista 3:</strong> "${c.pistas[2]}"`;
        this.clue3El.className = 'police-clue-item clue-revealed';
        audio.playTone(660, 'triangle', 0.1, 0, 0.4);
      }
    }, 8000);

    this.clueTimers.push(t2, t3);

    // Sync Twitch Chat WebSocket with both exact option name and valid aliases
    const allValidAnswers = [
      c.opciones[c.correctIndex],
      ...c.respuestasValidas
    ];
    twitchChat.startRound(allValidAnswers);

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

    const c = this.cases[this.currentRoundIdx];
    const normText = this.normalizeText(text);

    const isCorrectOption = normText === this.normalizeText(c.opciones[c.correctIndex]);
    const isCorrectAlias = c.respuestasValidas.some(r => this.normalizeText(r) === normText);
    const isCorrect = isCorrectOption || isCorrectAlias;

    if (isCorrect) {
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

      // Speed bonus: up to 150 points for lightning-fast reactions
      const bonus = Math.max(0, Math.round((15 - speed) * 10));
      p.speedBonusTotal += bonus;
      p.totalPoints = (p.score * 1000) + p.speedBonusTotal;

      this.appendChatLog(username, text, true, speed);
      this.renderLeaderboard();

      if (this.statusBannerEl) {
        const count = this.roundAcertantes.size;
        this.statusBannerEl.innerHTML = `<span>🎯</span> ¡${count} acertantes! <strong>${username}</strong> identificó al sospechoso en <strong>${speed}s</strong>.`;
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

    const c = this.cases[this.currentRoundIdx];

    // Disable buttons
    this.optionBtns.forEach((btn, idx) => {
      if (btn) {
        btn.disabled = true;
        if (idx === c.correctIndex) {
          btn.classList.add('correct-choice-highlight');
        } else {
          btn.classList.add('wrong-choice-faded');
        }
      }
    });

    if (this.inputAnswer) this.inputAnswer.disabled = true;
    if (this.btnSend) this.btnSend.disabled = true;
    if (this.btnSimBots) this.btnSimBots.disabled = true;

    // Reveal full clues
    if (this.clue2El && !this.clue2El.classList.contains('clue-revealed')) {
      this.clue2El.innerHTML = `<strong>Pista 2:</strong> "${c.pistas[1]}"`;
      this.clue2El.className = 'police-clue-item clue-revealed';
    }
    if (this.clue3El && !this.clue3El.classList.contains('clue-revealed')) {
      this.clue3El.innerHTML = `<strong>Pista 3:</strong> "${c.pistas[2]}"`;
      this.clue3El.className = 'police-clue-item clue-revealed';
    }

    if (this.phaseBadge) {
      this.phaseBadge.textContent = `🛑 CASO CERRADO • RECUENTO`;
      this.phaseBadge.className = 'karaoke-phase-tag phase-break';
    }

    const winnerCount = this.roundAcertantes.size;
    const answerName = c.opciones[c.correctIndex];

    if (winnerCount > 0) {
      audio.playCorrect();
      if (this.statusBannerEl) {
        this.statusBannerEl.innerHTML = `<span>🎉</span> ¡${winnerCount} descubrieron a "<strong>${answerName.toUpperCase()}</strong>"! Puntos y velocidad sumados.`;
        this.statusBannerEl.className = 'karaoke-status-banner status-won';
      }
    } else {
      audio.playWrong();
      if (this.statusBannerEl) {
        this.statusBannerEl.innerHTML = `<span>❌</span> El sospechoso huyó. Era: "<strong>${answerName.toUpperCase()}</strong>".`;
        this.statusBannerEl.className = 'karaoke-status-banner status-none';
      }
    }

    this.renderLeaderboard();

    // Prepare next case or finish 25 rounds
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
      this.totalPlayersPill.textContent = `${players.length} agentes`;
    }

    const top5 = players.slice(0, 5);

    if (top5.length === 0) {
      this.leaderboardList.innerHTML = `
        <div class="leaderboard-empty">
          <span>🚨</span>
          <p>Aún no hay sospechosos capturados. ¡Responde rápido para liderar el Top 5!</p>
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
          <span class="lb-points" title="Casos Resueltos">${p.score}/25</span>
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
    this.state.minigame4Winner = winner;

    confetti.blast(200);
    audio.playWinFanfare();

    if (this.onVictoryCallback) {
      this.onVictoryCallback({
        winner,
        score,
        avgSpeed,
        gameName: 'Atraco del Grinch'
      });
    }
  }

  triggerSimulatedChatAnswers() {
    if (this.phase !== 'answering') return;
    const c = this.cases[this.currentRoundIdx];

    const count = 2 + Math.floor(Math.random() * 3);
    const chosenBots = [...this.botNames].sort(() => 0.5 - Math.random()).slice(0, count);

    chosenBots.forEach((bot, index) => {
      const delayMs = (index + 1) * (1100 + Math.random() * 2200);
      setTimeout(() => {
        if (this.phase === 'answering') {
          const isCorrect = Math.random() > 0.18;
          const answerText = isCorrect ? c.opciones[c.correctIndex] : 'Sospechoso X';
          const speed = parseFloat((delayMs / 1000).toFixed(2));
          this.submitAnswer(bot, answerText, speed);
        }
      }, delayMs);
    });
  }

  stopTimer() {
    this.clearTimers();
    twitchChat.endRound();
    this.clueTimers.forEach(t => clearTimeout(t));
    this.clueTimers = [];
    if (this.inputAnswer) this.inputAnswer.disabled = true;
    if (this.btnSend) this.btnSend.disabled = true;
    if (this.btnSimBots) this.btnSimBots.disabled = true;
    this.optionBtns.forEach(btn => {
      if (btn) btn.disabled = true;
    });
  }

  clearTimers() {
    if (this.roundTimer) {
      clearInterval(this.roundTimer);
      this.roundTimer = null;
    }
    this.clueTimers.forEach(t => clearTimeout(t));
    this.clueTimers = [];
  }
}
