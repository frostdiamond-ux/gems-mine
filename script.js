let coins = 0;
let diamonds = 0;
let coinsPerClick = 1;
let coinsPerIdle = 1;
let autoClickInterval = 1000;
let multiplier = 1;
let buffList = [];
let clickLevel = 1;
let idlingLevel = 1;
let superJackpotBuffActive = false;
let totalClicks = 0;
let buffActivations = 0;

const bgMusic = document.getElementById("bg-music");
const clickSound = document.getElementById("click-sound");
const clickEffect = document.getElementById("click-effect");
const buffListElement = document.getElementById("buff-list");
const clickLevelElement = document.getElementById("click-level");
const idlingLevelElement = document.getElementById("idling-level");
const gachaResultElement = document.getElementById("gacha-result");

// Fungsi untuk menyimpan progress
function saveProgress() {
  const progress = {
    coins,
    diamonds,
    coinsPerClick,
    coinsPerIdle,
    clickLevel,
    idlingLevel,
    buffList,
    superJackpotBuffActive,
    totalClicks,
    buffActivations,
  };
  localStorage.setItem("pixelMinerProgress", JSON.stringify(progress));
}

// Fungsi untuk memuat progress
function loadProgress() {
  const savedProgress = localStorage.getItem("pixelMinerProgress");
  if (savedProgress) {
    const progress = JSON.parse(savedProgress);
    coins = progress.coins;
    diamonds = progress.diamonds;
    coinsPerClick = progress.coinsPerClick;
    coinsPerIdle = progress.coinsPerIdle;
    clickLevel = progress.clickLevel;
    idlingLevel = progress.idlingLevel;
    buffList = progress.buffList;
    superJackpotBuffActive = progress.superJackpotBuffActive;
    totalClicks = progress.totalClicks;
    buffActivations = progress.buffActivations;

    // Update UI setelah memuat progress
    updateUI();
    updateBuffList();
  }
}

// Fungsi untuk mereset progress
function resetProgress() {
  localStorage.removeItem("pixelMinerProgress");
  restartGame(); // Memanggil fungsi restartGame untuk mengembalikan semua nilai ke default
}

// Panggil loadProgress saat game dimulai
window.addEventListener("load", () => {
  loadProgress();
});

// Update tampilan
function updateUI() {
  document.getElementById("coins").textContent = coins;
  document.getElementById("diamonds").textContent = diamonds;

  // Aktifkan tombol Clear Stage jika diamond mencapai 1 juta
  const clearStageBtn = document.getElementById("clear-stage-btn");
  if (diamonds >= 1000000) {
    clearStageBtn.disabled = false;
  } else {
    clearStageBtn.disabled = true;
  }

  // Cek achievement
  checkAchievements();

  // Simpan progress setiap kali UI diupdate
  saveProgress();
}

// Fungsi untuk mengarahkan ke halaman kemenangan
function redirectToVictoryPage() {
  window.location.href = "victory.html";
}

// Fungsi untuk merestart game
function restartGame() {
  coins = 0;
  diamonds = 0;
  coinsPerClick = 1;
  coinsPerIdle = 1;
  multiplier = 1;
  clickLevel = 1;
  idlingLevel = 1;
  buffList = [];
  superJackpotBuffActive = false;
  totalClicks = 0;
  buffActivations = 0;

  updateUI();
  updateBuffList();
}

// Animasi koin muncul
function showCoinPop(amount, x, y) {
  const coinPop = document.createElement("div");
  coinPop.className = "coin-pop";
  coinPop.textContent = `+${amount}`;
  coinPop.style.left = `${x}px`;
  coinPop.style.top = `${y}px`;
  clickEffect.appendChild(coinPop);
  setTimeout(() => coinPop.remove(), 1000);
}

// Mining
document.getElementById("mine-btn").addEventListener("click", (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  coins += coinsPerClick * multiplier;
  totalClicks++;
  clickSound.play();
  showCoinPop(coinsPerClick * multiplier, x, y);
  updateUI();

  // Efek percikan batu
  const effect = document.createElement("div");
  effect.className = "click-effect";
  effect.style.left = `${x}px`;
  effect.style.top = `${y}px`;
  clickEffect.appendChild(effect);
  setTimeout(() => effect.remove(), 500);
});

// Upgrade Click
document.getElementById("upgrade-click").addEventListener("click", () => {
  if (coins >= 10) {
    coins -= 10;
    coinsPerClick += 1;
    clickLevel++;
    clickLevelElement.textContent = clickLevel;
    updateUI();
  } else {
    alert("Not enough coins!");
  }
});

document.getElementById("upgrade-click-2x").addEventListener("click", () => {
  const cost = 20;
  if (coins >= cost) {
    coins -= cost;
    coinsPerClick += 2;
    clickLevel += 2;
    clickLevelElement.textContent = clickLevel;
    updateUI();
  } else {
    alert("Not enough coins!");
  }
});

document.getElementById("upgrade-click-5x").addEventListener("click", () => {
  const cost = 50;
  if (coins >= cost) {
    coins -= cost;
    coinsPerClick += 5;
    clickLevel += 5;
    clickLevelElement.textContent = clickLevel;
    updateUI();
  } else {
    alert("Not enough coins!");
  }
});

document.getElementById("upgrade-click-10x").addEventListener("click", () => {
  const cost = 100;
  if (coins >= cost) {
    coins -= cost;
    coinsPerClick += 10;
    clickLevel += 10;
    clickLevelElement.textContent = clickLevel;
    updateUI();
  } else {
    alert("Not enough coins!");
  }
});

// Upgrade Idling
document.getElementById("upgrade-idling").addEventListener("click", () => {
  if (coins >= 50) {
    coins -= 50;
    coinsPerIdle += 1;
    idlingLevel++;
    idlingLevelElement.textContent = idlingLevel;
    updateUI();
  } else {
    alert("Not enough coins!");
  }
});

document.getElementById("upgrade-idling-2x").addEventListener("click", () => {
  const cost = 100;
  if (coins >= cost) {
    coins -= cost;
    coinsPerIdle += 2;
    idlingLevel += 2;
    idlingLevelElement.textContent = idlingLevel;
    updateUI();
  } else {
    alert("Not enough coins!");
  }
});

document.getElementById("upgrade-idling-5x").addEventListener("click", () => {
  const cost = 250;
  if (coins >= cost) {
    coins -= cost;
    coinsPerIdle += 5;
    idlingLevel += 5;
    idlingLevelElement.textContent = idlingLevel;
    updateUI();
  } else {
    alert("Not enough coins!");
  }
});

document.getElementById("upgrade-idling-10x").addEventListener("click", () => {
  const cost = 500;
  if (coins >= cost) {
    coins -= cost;
    coinsPerIdle += 10;
    idlingLevel += 10;
    idlingLevelElement.textContent = idlingLevel;
    updateUI();
  } else {
    alert("Not enough coins!");
  }
});

// Auto Mining
function autoMine() {
  const idleCoins = coinsPerIdle * multiplier;
  coins += idleCoins;
  showIdleCoinPop(idleCoins);
  updateUI();
}

function showIdleCoinPop(amount) {
  const coinPop = document.createElement("div");
  coinPop.className = "coin-pop";
  coinPop.textContent = `+${amount} (Idle)`;
  coinPop.style.left = `${Math.random() * 80 + 10}%`;
  coinPop.style.top = `${Math.random() * 80 + 10}%`;
  clickEffect.appendChild(coinPop);
  setTimeout(() => coinPop.remove(), 1000);
}

let autoClicker = setInterval(autoMine, autoClickInterval);

// Redeem Koin ke Diamond
document.getElementById("redeem-amount").addEventListener("input", (e) => {
  const amount = parseInt(e.target.value);
  if (amount >= 1 && amount <= 99) {
    document.getElementById("redeem-value").textContent = amount * 1000;
    document.getElementById("redeem-diamonds").textContent = amount;
  }
});

document.getElementById("redeem-max").addEventListener("click", () => {
  document.getElementById("redeem-amount").value = 99;
  document.getElementById("redeem-value").textContent = 99000;
  document.getElementById("redeem-diamonds").textContent = 99;
});

document.getElementById("redeem-btn").addEventListener("click", () => {
  const amount = parseInt(document.getElementById("redeem-amount").value);
  const cost = amount * 1000;
  if (coins >= cost) {
    coins -= cost;
    diamonds += amount;
    updateUI();
  } else {
    alert("Not enough coins!");
  }
});

// Buff Luck
document.getElementById("buff-luck").addEventListener("click", () => {
  if (diamonds >= 25 && !buffList.some(buff => buff.name === "Buff Luck")) {
    diamonds -= 25;
    const buff = { name: "Buff Luck", duration: 30 };
    buffList.push(buff);
    activateBuffLuck(buff);
    buffActivations++;
    updateUI();
  } else {
    alert("Not enough diamonds or buff already active!");
  }
});

function activateBuffLuck(buff) {
  const originalCoinsPerClick = coinsPerClick;

  document.getElementById("mine-btn").addEventListener("click", applyLuckBonus);

  const timer = setInterval(() => {
    buff.duration--;
    if (buff.duration <= 0) {
      clearInterval(timer);
      buffList = buffList.filter((b) => b !== buff);
      document.getElementById("mine-btn").removeEventListener("click", applyLuckBonus);
    }
    updateBuffList();
  }, 1000);

  function applyLuckBonus() {
    const luck = Math.random();
    if (luck <= 0.02) {
      coinsPerClick = originalCoinsPerClick * 10;
    } else if (luck <= 0.12) {
      coinsPerClick = originalCoinsPerClick * 7;
    } else if (luck <= 0.3) {
      coinsPerClick = originalCoinsPerClick * 5;
    } else {
      coinsPerClick = originalCoinsPerClick * 2;
    }
    setTimeout(() => {
      coinsPerClick = originalCoinsPerClick;
    }, 100);
  }
}

// Buff Idling Super
document.getElementById("buff-idling-super").addEventListener("click", () => {
  if (diamonds >= 50 && !buffList.some(buff => buff.name === "Buff Idling Super")) {
    diamonds -= 50;
    const buff = { name: "Buff Idling Super", duration: 60 };
    buffList.push(buff);
    activateBuffIdlingSuper(buff);
    buffActivations++;
    updateUI();
  } else {
    alert("Not enough diamonds or buff already active!");
  }
});

function activateBuffIdlingSuper(buff) {
  const originalInterval = autoClickInterval;
  autoClickInterval = 250;
  clearInterval(autoClicker);
  autoClicker = setInterval(autoMine, autoClickInterval);

  const timer = setInterval(() => {
    buff.duration--;
    if (buff.duration <= 0) {
      clearInterval(timer);
      autoClickInterval = originalInterval;
      clearInterval(autoClicker);
      autoClicker = setInterval(autoMine, autoClickInterval);
      buffList = buffList.filter((b) => b !== buff);
    }
    updateBuffList();
  }, 1000);
}

// Buff Multiplier
document.getElementById("buff-multiplier").addEventListener("click", () => {
  if (diamonds >= 100 && !buffList.some(buff => buff.name.startsWith("Buff Multiplier"))) {
    diamonds -= 100;
    multiplier = Math.floor(Math.random() * 9) + 2;
    const buff = { name: `Buff Multiplier ${multiplier}x`, duration: 60 };
    buffList.push(buff);
    activateBuffMultiplier(buff);
    buffActivations++;
    alert(`You got a ${multiplier}x multiplier!`);
    updateUI();
  } else {
    alert("Not enough diamonds or buff already active!");
  }
});

function activateBuffMultiplier(buff) {
  const timer = setInterval(() => {
    buff.duration--;
    if (buff.duration <= 0) {
      clearInterval(timer);
      multiplier = 1;
      buffList = buffList.filter((b) => b !== buff);
    }
    updateBuffList();
  }, 1000);
}

// Buff Super Jackpot
document.getElementById("buff-super-jackpot").addEventListener("click", () => {
  if (diamonds >= 200 && !buffList.some(buff => buff.name === "Buff Super Jackpot")) {
    diamonds -= 200;
    const buff = { name: "Buff Super Jackpot", duration: 60 };
    buffList.push(buff);
    activateBuffSuperJackpot(buff);
    buffActivations++;
    updateUI();
  } else {
    alert("Not enough diamonds or buff already active!");
  }
});

function activateBuffSuperJackpot(buff) {
  superJackpotBuffActive = true;

  const timer = setInterval(() => {
    buff.duration--;
    if (buff.duration <= 0) {
      clearInterval(timer);
      superJackpotBuffActive = false;
      buffList = buffList.filter((b) => b !== buff);
    }
    updateBuffList();
  }, 1000);
}

// Update tampilan buff aktif
function updateBuffList() {
  buffListElement.innerHTML = buffList
    .map((buff) => `<div class="buff-item">${buff.name} - ${buff.duration}s</div>`)
    .join("");
}

// Gacha 1x
document.getElementById("gacha-btn-1x").addEventListener("click", () => {
  if (diamonds >= 100) {
    diamonds -= 100;
    spinGacha(1);
  } else {
    alert("Not enough diamonds!");
  }
});

// Gacha 10x
document.getElementById("gacha-btn-10x").addEventListener("click", () => {
  if (diamonds >= 10000) {
    diamonds -= 10000;
    spinGacha(10);
  } else {
    alert("Not enough diamonds!");
  }
});

// Gacha Animation
function spinGacha(spinCount) {
  if (diamonds < (spinCount === 1 ? 100 : 10000)) {
    alert("Not enough diamonds!");
    return;
  }

  diamonds -= spinCount === 1 ? 100 : 10000;
  updateUI();

  const boxes = document.querySelectorAll(".box");
  boxes.forEach(box => box.classList.add("highlight"));

  setTimeout(() => {
    boxes.forEach(box => box.classList.remove("highlight"));
    let resultText = "";

    for (let i = 0; i < spinCount; i++) {
      const gachaResult = Math.random();
      if (superJackpotBuffActive) {
        if (gachaResult <= 0.25) {
          coins += 1000000;
          resultText += "Jackpot 1 juta koin! 🎉\n";
        } else if (gachaResult <= 0.5) {
          diamonds += 1000000;
          resultText += "Super Jackpot 1 juta diamond! 🎉\n";
        } else {
          resultText += "Zonk! Tidak mendapatkan apa-apa.\n";
        }
      } else {
        if (gachaResult <= 0.3) {
          coins += 200;
          resultText += "Anda mendapatkan 200 koin!\n";
        } else if (gachaResult <= 0.1) {
          coins += 1000000;
          resultText += "Jackpot 1 juta koin! 🎉\n";
        } else if (gachaResult <= 0.05) {
          diamonds += 1000000;
          resultText += "Super Jackpot 1 juta diamond! 🎉\n";
        } else {
          resultText += "Zonk! Tidak mendapatkan apa-apa.\n";
        }
      }
    }

    gachaResultElement.textContent = resultText;
    updateUI();
  }, 2000); // Durasi animasi
}

// Achievement System
function checkAchievements() {
  const achievements = [
    { id: "klik-super", condition: totalClicks >= 1000, reward: { coins: 1000, diamonds: 10 } },
    { id: "klik-jackpot", condition: totalClicks >= 10000, reward: { coins: 10000, diamonds: 100 } },
    { id: "klik-dewa", condition: totalClicks >= 1000000, reward: { coins: 1000000, diamonds: 1000 } },
    { id: "gacor", condition: coins >= 1000000, reward: { coins: 5000, diamonds: 50 } },
    { id: "super-gacor", condition: diamonds >= 1000000, reward: { coins: 10000, diamonds: 100 } },
    { id: "miner-sejati", condition: coins >= 10000, reward: { coins: 1000, diamonds: 10 } },
    { id: "miner-super", condition: coins >= 100000, reward: { coins: 5000, diamonds: 50 } },
    { id: "miner-dewa", condition: coins >= 1000000, reward: { coins: 10000, diamonds: 100 } },
    { id: "tangan-pembantu", condition: buffActivations >= 100, reward: { coins: 1000, diamonds: 10 } },
    { id: "tangan-malaikat", condition: buffActivations >= 10000, reward: { coins: 5000, diamonds: 50 } },
    { id: "tangan-dewa", condition: buffActivations >= 1000000, reward: { coins: 10000, diamonds: 100 } },
    { id: "lebih-cepat", condition: clickLevel >= 500, reward: { coins: 1000, diamonds: 10 } },
    { id: "kecepatan-dewa", condition: clickLevel >= 1000, reward: { coins: 5000, diamonds: 50 } },
    { id: "mesin-bekerja", condition: idlingLevel >= 500, reward: { coins: 1000, diamonds: 10 } },
    { id: "robot-super", condition: idlingLevel >= 1000, reward: { coins: 5000, diamonds: 50 } },
  ];

  achievements.forEach(achievement => {
    const element = document.getElementById(`achievement-${achievement.id}`);
    const claimButton = document.getElementById(`claim-${achievement.id}`);
    if (achievement.condition && element.textContent === "🔒") {
      element.textContent = "✅";
      claimButton.disabled = false;
      alert(`Achievement "${achievement.id}" terbuka!`);
    }
  });
}

// Claim Achievement Reward
document.querySelectorAll(".claim-btn").forEach(button => {
  button.addEventListener("click", (e) => {
    const achievementId = e.target.id.replace("claim-", "");
    const reward = achievements.find(a => a.id === achievementId).reward;
    coins += reward.coins;
    diamonds += reward.diamonds;
    e.target.disabled = true;
    updateUI();
    alert(`Anda mendapatkan ${reward.coins} koin dan ${reward.diamonds} diamond!`);
  });
});

// Tombol View Achievements
document.getElementById("view-achievements").addEventListener("click", () => {
  const achievementsList = document.getElementById("achievements-list");
  achievementsList.style.display = achievementsList.style.display === "none" ? "block" : "none";
});

// Clear Stage
document.getElementById("clear-stage-btn").addEventListener("click", () => {
  if (diamonds >= 1000000) {
    diamonds -= 1000000;
    redirectToVictoryPage();
  } else {
    alert("Anda membutuhkan 1 juta diamond untuk menyelesaikan game!");
  }
});

// Tombol Main Lagi di halaman kemenangan
if (window.location.pathname.includes("victory.html")) {
  document.getElementById("play-again").addEventListener("click", () => {
    restartGame();
    window.location.href = "index.html";
  });
}

// Tambahkan event listener untuk tombol reset progress
document.getElementById("reset-progress-btn")?.addEventListener("click", () => {
  if (confirm("Apakah Anda yakin ingin mereset progress? Semua data akan hilang!")) {
    resetProgress();
  }
});