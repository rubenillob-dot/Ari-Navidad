# 🎄 Ari Navidad - Especial Comunidad Twitch (GTA VI x Fortnite x Navidad)

Una aplicación web interactiva de alto impacto visual orientada a transmisiones en directo en **Twitch**, que fusiona la estética vibrante de **Navidad festiva** (nieve animada, luces de feria parpadeantes, bastones de caramelo), los tonos neón y atardeceres de **GTA VI (Leonida / Vice City)** y la interfaz de botones cómic y tipografía de **Fortnite**.

---

## 🎮 Características Principales

1. **Estructura SPA (Single Page Application) sin scroll vertical**:
   - Navegación fluida y reactiva diseñada para adaptarse exactamente a la ventana del navegador (`100vh` / sin scroll vertical).
   - Transiciones animadas tipo fade-in / slide entre pantallas.
   - HUD superior integrado estilo stream con contador de tiradas, estado "EN DIRECTO" e indicador de ecualizador de audio.

2. **Lobby Principal con 5 Minijuegos**:
   - **Minijuego 1 (Adivina la Canción Navideña)**: Totalmente funcional, interactivo, con reproductor sintetizado, barra de progreso con cuenta regresiva y 4 botones cómic de respuesta.
   - **Minijuegos 2 al 5 (Placeholders de Bóveda)**:
     - *Bóveda Vice City* (Estilo caja fuerte GTA).
     - *Fortnite Winterfest Drop* (Estilo suministro Llama).
     - *Atraco del Grinch*.
     - *Twitch Karaoke Showdown*.
     - Con animación de sacudida metálica al hacer clic, aviso en toast interactivo y sonido de bloqueo.

3. **Condición de Victoria & Control de Tirada Única**:
   - Cada jugador que supera el Minijuego 1 desbloquea **exactamente 1 tirada única** en la Ruleta Navideña.
   - El botón para reclamar la tirada y acceder a la ruleta solo se habilita tras alcanzar la victoria.
   - La ruleta bloquea cualquier intento de giro no autorizado o doble tirada.

4. **Ruleta Navideña VIP & Drop Rates Matemáticos Exactos**:
   - **Decoración Navideña x Neón**: Borde exterior con franjas de bastón de caramelo, 18 bombillas LED navideñas con animación cíclica multicolor, gorro de Papá Noel, estrella dorada central y aguja superior con rebote mecánico (*tick flapper*).
   - **Visualización en 24 gajos**: Premios y colores alternados para que nunca haya dos elementos idénticos contiguos.
   - **Panel Lateral de Probabilidades**: Leyenda completa a la derecha que muestra los porcentajes exactos, iconos y badges de rareza (Mítico, Legendario, Épico, Poco Común, Común).
   - **Lógica Matemática Ponderada (Exactamente 100%)**:
     * **1%** - VIP del canal 👑 *(Mítico)*
     * **1%** - Te regalo sub del canal 🎁 *(Mítico)*
     * **3%** - Skin de la tienda de Fortnite 👕 *(Legendario)*
     * **10%** - Pico de la tienda ⛏️ *(Épico)*
     * **10%** - Mochila de la tienda 🎒 *(Épico)*
     * **10%** - Baile de la tienda 💃 *(Épico)*
     * **35%** - +1 participación en el ticket dorado 🎫 *(Común)*
     * **30%** - +2 participaciones en el ticket dorado 🎟️ *(Poco Común)*
   - **Física de desaceleración**: Deceleración progresiva realista (*quartic ease-out*) calculada para detenerse con absoluta precisión en el gajo del premio obtenido matemáticamente, con efectos sonoros de clic por cada división y celebración final (confeti + fanfarria + modal GTA *Mission Passed*).

5. **Sintetizador de Audio Web Audio API (Cero dependencias externas)**:
   - No requiere descargar archivos MP3 externos (no sufre enlaces rotos o errores 404).
   - Genera en tiempo real melodías navideñas (*Jingle Bells*, *All I Want for Christmas Is You*, *Feliz Navidad*), música de fondo holiday synthwave, clics cartoon, sonidos de ruleta y fanfarrias.
   - Botón de control de audio en el HUD con ecualizador animado.

---

## 📁 Estructura del Proyecto

```text
Ari-Navidad/
├── index.html                   # Documento principal SPA con las 3 vistas y modales
├── css/
│   ├── main.css                 # Variables temáticas, reset, layout SPA sin scroll
│   ├── animations.css           # Luces de navidad, sacudida de bóvedas, neón, confeti
│   └── components.css           # Tarjetas Fortnite, ruleta decorada, HUD y panel de drop rates
├── js/
│   ├── main.js                  # Orquestador principal de estado y eventos
│   └── modules/
│       ├── audio.js             # Motor de sonido Web Audio API (música + SFX + villancicos)
│       ├── snow.js              # Sistema de partículas de nieve en canvas
│       ├── confetti.js          # Cañón de confeti para celebraciones
│       ├── router.js            # Router de vistas SPA sin recarga
│       ├── minigame1.js         # Lógica del Quiz musical, temporizador y victoria
│       └── roulette.js          # Ruleta canvas 24 gajos y cálculo matemático exacto
└── README.md
```

---

## 🚀 Cómo Ejecutar la Aplicación

Al tratarse de una aplicación web modular con módulos ES6 (`import`/`export`), se recomienda servir los archivos mediante un servidor web local estático:

### Opción 1: Con Python (muy rápido)
```bash
python3 -m http.server 8080
```
Luego abre tu navegador en: [http://localhost:8080](http://localhost:8080)

### Opción 2: Con Node.js (npx serve)
```bash
npx serve .
```

### Opción 3: Extensión "Live Server" de VS Code
Haz clic derecho en `index.html` y selecciona **"Open with Live Server"**.

---

## 🎯 Demostración del Flujo de Usuario

1. **Llegada al Lobby**:
   - Se muestra el atardecer estilo Vice City cubierto de nieve con luces navideñas parpadeantes.
   - El Minijuego 1 está disponible; los demás tienen el candado de bóveda. Al hacer clic en un minijuego bloqueado, la tarjeta vibra con un sonido metálico y un aviso.
2. **Jugar al Minijuego 1**:
   - Se reproduce la melodía sintetizada de un villancico en el tocadiscos de neón.
   - La barra de tiempo avanza de verde/cian a rojo urgente.
   - El jugador responde en los 4 botones cómic de Fortnite.
3. **Victoria Royale**:
   - Al completar la prueba con éxito, se dispara la fanfarria y el confeti, otorgando **1 tirada**.
   - Se presenta el botón para ir a la Ruleta Navideña.
4. **Giro en la Ruleta**:
   - El jugador pulsa **"¡GIRAR RULETA!"**.
   - El algoritmo extrae un valor aleatorio ponderado con las probabilidades exactas (1%, 1%, 3%, 10%, 10%, 10%, 35%, 30%).
   - La ruleta gira entre 6 y 8 vueltas y frena suavemente en el gajo correspondiente.
   - Aparece el banner estilo *Mission Passed* con opción de copiar el comando de chat para canjear en Twitch.
