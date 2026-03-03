const grid = document.getElementById("grid");
const terrainSelect = document.getElementById("terrainSelect");
const moodSelect = document.getElementById("moodSelect");
const mapArea = document.querySelector(".map-area");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const volumeControl = document.getElementById("volumeControl");

// Criar grid com clique
for (let i = 0; i < 400; i++) {
  const cell = document.createElement("div");

  cell.addEventListener("click", () => {
    cell.classList.toggle("active");
  });

  grid.appendChild(cell);
}

// Mapas
const maps = {
  floresta: "assets/maps/floresta.jpg",
  dungeon: "assets/maps/dungeon.jpg",
  cidade: "assets/maps/cidade.jpg"
};

// Sons
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

// Volume

volumeControl.addEventListener("input", () => {
  if (currentAudio) {
    currentAudio.volume = volumeControl.value;
  }
});

let currentAudio = null;
let currentSoundFile = null;

// Atualizar ambiente
terrainSelect.addEventListener("change", updateEnvironment);
moodSelect.addEventListener("change", updateEnvironment);

function updateEnvironment() {
  const selectedTerrain = terrainSelect.value;
  const selectedMood = moodSelect.value;

  // Atualizar mapa
  mapArea.style.backgroundImage = `url(${maps[selectedTerrain]})`;

  // Definir novo som
  const soundFile = sounds[selectedTerrain][selectedMood];

  // Só troca se for diferente
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

// Play
playBtn.addEventListener("click", () => {
  if (currentAudio) {
    currentAudio.play();
  }
});

// Pause
pauseBtn.addEventListener("click", () => {
  if (currentAudio) {
    currentAudio.pause();
  }
});

pauseBtn.addEventListener("click", () => {
  if (currentAudio) {
    currentAudio.pause();
  }
});

updateEnvironment();