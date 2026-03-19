// =========================
// ELEMENTOS DO DOM
// =========================

const grid = document.getElementById("grid");
const terrainSelect = document.getElementById("terrainSelect");
const moodSelect = document.getElementById("moodSelect");
const mapArea = document.querySelector(".map-area");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const volumeControl = document.getElementById("volumeControl");
const playerSelect = document.getElementById("playerSelect");
const toggleBtn = document.getElementById("toggleSidebar");
const showSidebarBtn = document.getElementById("showSidebarBtn");
const weatherSelect = document.getElementById("weatherSelect");

// =========================
// SISTEMA DE JOGADORES
// =========================

const players = {
  player1: { name: "P1", color: "#00ff95", position: null },
  player2: { name: "P2", color: "#ff4757", position: null },
  player3: { name: "P3", color: "#1e90ff", position: null },
  player4: { name: "P4", color: "#ffa502", position: null },
  player5: { name: "P5", color: "#a55eea", position: null },
  player6: { name: "P6", color: "#2ed573", position: null },
  player7: { name: "P7", color: "#ff6b81", position: null },
  player8: { name: "P8", color: "#70a1ff", position: null },
  player9: { name: "P9", color: "#ff9f43", position: null },
  player10: { name: "P10", color: "#5352ed", position: null },
};

// =========================
// SISTEMA DE DADOS
// =========================

const diceType = document.getElementById("diceType");
const diceBonus = document.getElementById("diceBonus");
const rollDiceBtn = document.getElementById("rollDiceBtn");
const diceResult = document.getElementById("diceResult");
const diceHistory = document.getElementById("diceHistory");

rollDiceBtn.addEventListener("click", () => {
  const sides = Number(diceType.value);
  const bonus = Number(diceBonus.value) || 0;

  const roll = Math.floor(Math.random() * sides) + 1;
  const total = roll + bonus;

  let resultText = `d${sides}: ${roll}`;

  if (bonus !== 0) {
    resultText += ` ${bonus > 0 ? "+" : "-"} ${Math.abs(bonus)}`;
  }

  resultText += ` = ${total}`;

  diceResult.textContent = `Resultado: ${resultText}`;

  const li = document.createElement("li");
  li.textContent = resultText;

  diceHistory.prepend(li);

  // limitar histórico a 10 itens
  while (diceHistory.children.length > 10) {
    diceHistory.removeChild(diceHistory.lastChild);
  }
});

// =========================
// CRIAR GRID
// =========================

for (let i = 0; i < 400; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.index = i;

  // permitir drop
  cell.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  cell.addEventListener("drop", (e) => {
    e.preventDefault();

    const playerKey = e.dataTransfer.getData("player");

    const player = players[playerKey];

    // remover posição antiga
    if (player.position !== null) {
      const oldCell = grid.children[player.position];
      oldCell.innerHTML = "";
    }

    player.position = i;

    const token = createToken(playerKey);

    cell.appendChild(token);
  });

  grid.appendChild(cell);
}

function createToken(playerKey) {
  const player = players[playerKey];

  const token = document.createElement("div");

  token.classList.add("token");

  token.textContent = player.name;

  token.style.backgroundColor = player.color;

  token.setAttribute("draggable", true);

  token.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("player", playerKey);
  });

  return token;
}

grid.addEventListener("click", (e) => {
  const cell = e.target.closest(".cell");

  if (!cell) return;

  const playerKey = playerSelect.value;

  const player = players[playerKey];

  const index = Number(cell.dataset.index);

  // remover posição antiga
  if (player.position !== null) {
    grid.children[player.position].innerHTML = "";
  }

  player.position = index;

  const token = createToken(playerKey);

  cell.innerHTML = "";
  cell.appendChild(token);
});

// =========================
// MAPAS
// =========================

const maps = {
  floresta: "assets/maps/floresta.jpg",
  dungeon: "assets/maps/dungeon.jpg",
  cidade: "assets/maps/cidade.jpg",
};

// =========================
// SONS
// =========================

const sounds = {
  floresta: {
    calmo: "assets/sounds/floresta-calmo.mp3",
    batalha: "assets/sounds/floresta-batalha.mp3",
    tenso: "assets/sounds/floresta-tenso.mp3",
  },

  dungeon: {
    calmo: "assets/sounds/dungeon-calmo.mp3",
    batalha: "assets/sounds/dungeon-batalha.mp3",
    tenso: "assets/sounds/dungeon-tenso.mp3",
  },

  cidade: {
    calmo: "assets/sounds/cidade-calmo.mp3",
    batalha: "assets/sounds/cidade-batalha.mp3",
    tenso: "assets/sounds/cidade-tenso.mp3",
  },
};

let currentAudio = null;
let currentSoundFile = null;

// =========================
// CLIMA
// =========================

const weatherSounds = {
  rain: "assets/sounds/weather/rain.mp3",
  storm: "assets/sounds/weather/storm.mp3",
  snow: "assets/sounds/weather/snow.mp3",
  sandstorm: "assets/sounds/weather/sandstorm.mp3",
  wind: "assets/sounds/weather/wind.mp3",
};

let currentWeatherAudio = null;

// =========================
// VOLUME
// =========================

volumeControl.addEventListener("input", () => {
  if (currentAudio) currentAudio.volume = volumeControl.value;
  if (currentWeatherAudio) currentWeatherAudio.volume = volumeControl.value;
});

// =========================
// ATUALIZAR AMBIENTE
// =========================

terrainSelect.addEventListener("change", updateEnvironment);
moodSelect.addEventListener("change", updateEnvironment);

function updateEnvironment() {
  const selectedTerrain = terrainSelect.value;
  const selectedMood = moodSelect.value;

  mapArea.style.backgroundImage = `url(${maps[selectedTerrain]})`;

  const soundFile = sounds[selectedTerrain][selectedMood];

  if (currentSoundFile !== soundFile) {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(soundFile);
    currentAudio.loop = true;
    currentAudio.volume = volumeControl.value;

    currentSoundFile = soundFile;
  }
}

// =========================
// CONTROLES DE AUDIO
// =========================

playBtn.addEventListener("click", () => {
  if (currentAudio) currentAudio.play();
  if (currentWeatherAudio) currentWeatherAudio.play();
});

pauseBtn.addEventListener("click", () => {
  if (currentAudio) currentAudio.pause();
  if (currentWeatherAudio) currentWeatherAudio.pause();
});

// =========================
// SIDEBAR
// =========================

toggleBtn.addEventListener("click", () => {
  document.body.classList.add("hidden-sidebar");
});

showSidebarBtn.addEventListener("click", () => {
  document.body.classList.remove("hidden-sidebar");
});

// =========================
// SISTEMA DE INICIATIVA
// =========================

const initiativeName = document.getElementById("initiativeName");
const initiativeValue = document.getElementById("initiativeValue");
const addInitiativeBtn = document.getElementById("addInitiative");
const initiativeList = document.getElementById("initiativeList");
const nextTurnBtn = document.getElementById("nextTurn");

let initiativeOrder = [];

addInitiativeBtn.addEventListener("click", () => {
  const name = initiativeName.value;
  const value = Number(initiativeValue.value);

  if (!name || !value) return;

  initiativeOrder.push({ name, value });

  initiativeOrder.sort((a, b) => b.value - a.value);

  renderInitiative();

  initiativeName.value = "";
  initiativeValue.value = "";
});

function renderInitiative() {
  initiativeList.innerHTML = "";

  initiativeOrder.forEach((char) => {
    const li = document.createElement("li");

    li.textContent = `${char.name} - ${char.value}`;

    initiativeList.appendChild(li);
  });

  enableDrag();
}

nextTurnBtn.addEventListener("click", () => {
  const confirmReset = confirm("Deseja iniciar nova rodada de iniciativa?");

  if (!confirmReset) return;

  initiativeOrder = [];
  initiativeList.innerHTML = "";

  initiativeName.value = "";
  initiativeValue.value = "";
});

// =========================
// DRAG AND DROP
// =========================

let sortableInstance = null;

function enableDrag() {
  if (sortableInstance) {
    sortableInstance.destroy();
  }

  sortableInstance = new Sortable(initiativeList, {
    animation: 150,
    ghostClass: "dragging",

    onEnd: function () {
      const newOrder = [];

      document.querySelectorAll("#initiativeList li").forEach((li) => {
        const text = li.textContent.split(" - ");

        newOrder.push({
          name: text[0],
          value: Number(text[1]),
        });
      });

      initiativeOrder = newOrder;
    },
  });
}

// =========================
// CLIMA
// =========================

weatherSelect.addEventListener("change", updateWeather);

function updateWeather() {
  const selectedWeather = weatherSelect.value;

  if (currentWeatherAudio) {
    currentWeatherAudio.pause();
    currentWeatherAudio.currentTime = 0;
  }

  if (selectedWeather === "none") {
    currentWeatherAudio = null;
    return;
  }

  currentWeatherAudio = new Audio(weatherSounds[selectedWeather]);

  currentWeatherAudio.loop = true;
  currentWeatherAudio.volume = volumeControl.value;

  currentWeatherAudio.play();
}

// =========================
// INICIALIZAÇÃO
// =========================

updateEnvironment();
