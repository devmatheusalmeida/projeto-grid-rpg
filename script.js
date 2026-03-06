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


// =========================
// SISTEMA DE JOGADORES
// =========================

const players = {
  player1: { name: "P1", color: "#00ff95", position: null },
  player2: { name: "P2", color: "#ff4757", position: null },
  player3: { name: "P3", color: "#1e90ff", position: null }
};


// =========================
// CRIAR GRID
// =========================

for (let i = 0; i < 400; i++) {

  const cell = document.createElement("div");
  cell.dataset.index = i;

  cell.addEventListener("click", () => {

    const currentPlayer = playerSelect.value;

    // Remove token antigo
    if (players[currentPlayer].position !== null) {
      const oldCell = grid.children[players[currentPlayer].position];
      oldCell.innerHTML = "";
    }

    // Atualiza posição
    players[currentPlayer].position = i;

    // Criar token
    const token = document.createElement("div");
    token.classList.add("token");
    token.textContent = players[currentPlayer].name;
    token.style.backgroundColor = players[currentPlayer].color;

    cell.innerHTML = "";
    cell.appendChild(token);

  });

  grid.appendChild(cell);

}


// =========================
// SISTEMA DE MAPAS
// =========================

const maps = {
  floresta: "assets/maps/floresta.jpg",
  dungeon: "assets/maps/dungeon.jpg",
  cidade: "assets/maps/cidade.jpg"
};


// =========================
// SISTEMA DE SOM
// =========================

const sounds = {

  floresta: {
    calmo: "assets/sounds/floresta-calmo.mp3",
    batalha: "assets/sounds/floresta-batalha.mp3",
    tenso: "assets/sounds/floresta-tenso.mp3"
  },

  dungeon: {
    calmo: "assets/sounds/dungeon-calmo.mp3",
    batalha: "assets/sounds/dungeon-batalha.mp3",
    tenso: "assets/sounds/dungeon-tenso.mp3"
  },

  cidade: {
    calmo: "assets/sounds/cidade-calmo.mp3",
    batalha: "assets/sounds/cidade-batalha.mp3",
    tenso: "assets/sounds/cidade-tenso.mp3"
  }

};

let currentAudio = null;
let currentSoundFile = null;


// =========================
// CONTROLE DE VOLUME
// =========================

volumeControl.addEventListener("input", () => {

  if (currentAudio) {
    currentAudio.volume = volumeControl.value;
  }

});


// =========================
// ATUALIZAR AMBIENTE
// =========================

terrainSelect.addEventListener("change", updateEnvironment);
moodSelect.addEventListener("change", updateEnvironment);

function updateEnvironment() {

  const selectedTerrain = terrainSelect.value;
  const selectedMood = moodSelect.value;

  // Atualizar mapa
  mapArea.style.backgroundImage = `url(${maps[selectedTerrain]})`;

  // Selecionar som
  const soundFile = sounds[selectedTerrain][selectedMood];

  // Evitar recriar o mesmo áudio
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

  if (currentAudio) {
    currentAudio.play();
  }

});

pauseBtn.addEventListener("click", () => {

  if (currentAudio) {
    currentAudio.pause();
  }

});


// =========================
// CONTROLE DO SIDEBAR
// =========================

toggleBtn.addEventListener("click", () => {

  document.body.classList.add("hidden-sidebar");

});

showSidebarBtn.addEventListener("click", () => {

  document.body.classList.remove("hidden-sidebar");

});


// =========================
// INICIALIZAÇÃO
// =========================

updateEnvironment();

const initiativeName = document.getElementById("initiativeName");
const initiativeValue = document.getElementById("initiativeValue");
const addInitiativeBtn = document.getElementById("addInitiative");
const initiativeList = document.getElementById("initiativeList");
const nextTurnBtn = document.getElementById("nextTurn");

let initiativeOrder = [];
let currentTurn = 0;

addInitiativeBtn.addEventListener("click", () => {

  const name = initiativeName.value;
  const value = Number(initiativeValue.value);

  if (!name || !value) return;

  initiativeOrder.push({ name, value });

  // ordenar iniciativa
  initiativeOrder.sort((a, b) => b.value - a.value);

  renderInitiative();

  initiativeName.value = "";
  initiativeValue.value = "";

});

function renderInitiative() {

  initiativeList.innerHTML = "";

  initiativeOrder.forEach((char, index) => {

    const li = document.createElement("li");

    if (index === currentTurn) {
      li.style.background = "#6b46c1";
    }

    li.textContent = `${char.name} - ${char.value}`;

    initiativeList.appendChild(li);

  });

}

nextTurnBtn.addEventListener("click", () => {

  if (initiativeOrder.length === 0) return;

  currentTurn++;

  if (currentTurn >= initiativeOrder.length) {
    currentTurn = 0;
  }

  renderInitiative();

});