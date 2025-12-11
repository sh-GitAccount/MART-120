// ==++ -- POWER SYSTEM (AUTO-TRIGGER) -- ++== \\
// Powers automatically trigger when their cooldown expires
// Each power has its own independent cooldown
// Powers are separate from Ship Abilities and Shield Ability

// ===== POWER STATE =====
var powerStats = {};
var activePowers = {
  lightningbolt: { active: false, timer: 0, bolts: [], hitEnemies: [] },
  singularity: { active: false, timer: 0, caughtEnemies: [], x: 0, y: 0 }
};

var powerCooldownTimer = {};  // { lightningbolt: 0, singularity: 0, ... }
var powerOnCooldown = {};     // { lightningbolt: false, singularity: false, ... }

const powerDescriptions = {
  lightningbolt: "Automatically calls down sequential lightning strikes on random enemies.",
  singularity: "Creates a gravity well that pulls in enemies and deals increased damage based on enemies hit."
};

// ===== POWER LEVELS & MODIFIERS =====
const powerLevelDefs = {
  lightningbolt: {
    1: { cooldown: 8000, boltCount: 3, boltDamage: 60, boltFrames: 40, range: 800 },
    2: { cooldown: 7800, boltCount: 4, boltDamage: 80, boltFrames: 38, range: 820 },
    3: { cooldown: 7600, boltCount: 5, boltDamage: 120, boltFrames: 36, range: 840 },
    4: { cooldown: 7400, boltCount: 6, boltDamage: 160, boltFrames: 34, range: 880 },
    5: { cooldown: 7200, boltCount: 7, boltDamage: 200, boltFrames: 32, range: 940 }
  },
  singularity: {
    1: { cooldown: 10000, radius: 150, damage: 100, damagePerEnemy: 15, duration: 100 },
    2: { cooldown: 9700, radius: 175, damage: 140, damagePerEnemy: 20, duration: 110 },
    3: { cooldown: 9400, radius: 200, damage: 180, damagePerEnemy: 35, duration: 120 },
    4: { cooldown: 9100, radius: 230, damage: 230, damagePerEnemy: 50, duration: 130 },
    5: { cooldown: 8800, radius: 260, damage: 300, damagePerEnemy: 80, duration: 140 }
  }
};

const powerModifierDefs = {
  boltEcho: {
    name: "Echoing Thunder",
    appliesToPower: "lightningbolt",
    baseEffect: 0.04,
    maxRank: 10,
    applyModifier: (rank) => rank * 0.04
  },
  boltChain: {
    name: "Chain Lightning",
    appliesToPower: "lightningbolt",
    baseEffect: 0.06,
    maxRank: 10,
    applyModifier: (rank) => rank * 0.06
  },
  boltCount: {
    name: "Thundercloud",
    appliesToPower: "lightningbolt",
    baseEffect: 1,
    maxRank: 10,
    applyModifier: (rank) => rank
  },
  singularityPull: {
    name: "Supermassive",
    appliesToPower: "singularity",
    baseEffect: 25,
    maxRank: 10,
    applyModifier: (rank) => rank * 25
  },
  singularityDensity: {
    name: "Active Nuclei",
    appliesToPower: "singularity",
    baseEffect: 5,
    maxRank: 10,
    applyModifier: (rank) => rank * 8
  },
  singularitySize: {
    name: "Singularity Size",
    appliesToPower: "singularity",
    baseEffect: 25,
    maxRank: 10,
    applyModifier: (rank) => rank * 25
  }
};

// ===== TRACKERS =====
var unlockedPowers = [];
var powerLevels = {};
var powerModifiers = {};
var maxPowers = 6;
var maxModifiers = 10;

// ===== INITIALIZATION =====
function InitializePowerStats() {
  for (let powerName in powerLevelDefs) {
    powerStats[powerName] = { ...powerLevelDefs[powerName][1] };
    powerCooldownTimer[powerName] = 0;
    powerOnCooldown[powerName] = false;
  }
}

// ===== UNLOCK / TRIGGER POWERS =====
function UnlockPower(powerName) {
  if (!activePowers[powerName]) {
    activePowers[powerName] = { active: false, timer: 0 };
    if (powerName === "lightningbolt") {
      activePowers[powerName].bolts = [];
      activePowers[powerName].hitEnemies = [];
    }
    if (powerName === "singularity") {
      activePowers[powerName].caughtEnemies = [];
      activePowers[powerName].x = 0;
      activePowers[powerName].y = 0;
    }
  }
  if (powerOnCooldown[powerName] === undefined) powerOnCooldown[powerName] = false;
  if (powerCooldownTimer[powerName] === undefined) powerCooldownTimer[powerName] = 0;
}

function TriggerPower(powerName) {
  if (!unlockedPowers.includes(powerName)) return;
  const stats = powerStats[powerName];
  if (!stats) return;

  switch (powerName) {
    case "lightningbolt": TriggerLightningBolt(stats); break;
    case "singularity": TriggerSingularity(stats); break;
  }
}

// ===== UPDATE POWERS =====
function UpdatePowers() {
  if (!unlockedPowers) return;

  for (let powerName of unlockedPowers) {
    if (!powerStats[powerName]) continue;

    if (powerCooldownTimer[powerName] > 0) powerCooldownTimer[powerName]--;
    if (!powerOnCooldown[powerName] || powerCooldownTimer[powerName] <= 0) {
      TriggerPower(powerName);
    }
  }

  if (activePowers.lightningbolt?.active) UpdateLightningBolt();
  if (activePowers.singularity?.active) UpdateSingularity();
}

// ===== COOLDOWN MANAGEMENT =====
function ResetPowerCooldown(powerName) {
  if (!powerStats[powerName]) return;
  powerCooldownTimer[powerName] = powerStats[powerName].cooldown;
  powerOnCooldown[powerName] = true;
}

// ===== LIGHTNING BOLT =====
function TriggerLightningBolt(stats) {
  const state = activePowers.lightningbolt;
  state.active = true;
  state.timer = 0;
  state.hitEnemies = [];
  state.bolts = [];

  for (let b = 0; b < stats.boltCount; b++) {
    const boltArray = [];
    let screenX = map(b, 0, stats.boltCount - 1, 0, width);
    let worldX = screenX + cameraX;
    let worldY = cameraY - 100;
    let currentX = worldX;
    let currentY = worldY;
    const segmentLength = 30;
    let boltLength = random(height - 200, height - 30);

    while (currentY < worldY + boltLength) {
      boltArray.push({ x: currentX, y: currentY });
      currentX += random(-40, 40);
      currentY += segmentLength + random(-10, 10);
      currentX = constrain(currentX, worldX - 200, worldX + 200);
    }
    state.bolts.push(boltArray);
  }

  playSound('abilitylightningbolt');
}

function UpdateLightningBolt() {
  const state = activePowers.lightningbolt;
  if (!state || !state.active) return;

  state.timer++;
  stroke(0, 180, 255);
  strokeWeight(3);
  for (const bolt of state.bolts) {
    for (let i = 0; i < bolt.length - 1; i++) {
      line(bolt[i].x - cameraX, bolt[i].y - cameraY, bolt[i + 1].x - cameraX, bolt[i + 1].y - cameraY);
    }
  }

  for (let i = 0; i < enemies.length; i++) {
    if (state.hitEnemies.includes(i)) continue;
    const enemy = enemies[i];
    for (const bolt of state.bolts) {
      for (let j = 0; j < bolt.length - 1; j++) {
        const distToBolt = DistanceToLineSegment(enemy.x, enemy.y, bolt[j].x, bolt[j].y, bolt[j + 1].x, bolt[j + 1].y);
        if (distToBolt < 15) {
          enemy.hp -= powerStats.lightningbolt.boltDamage;
          state.hitEnemies.push(i);
          break;
        }
      }
    }
  }

  if (state.timer > powerStats.lightningbolt.boltFrames) {
    state.active = false;
    state.bolts = [];
    state.hitEnemies = [];
  }
}

// ===== SINGULARITY =====
function TriggerSingularity(stats) {
  const state = activePowers.singularity;
  state.active = true;
  state.timer = 0;
  state.caughtEnemies = [];
  state.x = mouseX + cameraX;
  state.y = mouseY + cameraY;
  playSound('singularity');
}

function UpdateSingularity() {
  const state = activePowers.singularity;
  if (!state || !state.active) return;

  state.timer++;

  push();
  translate(-cameraX, -cameraY);
  const pulse = sin(state.timer / 20) * 10;
  fill(20, 20, 30);
  stroke(100, 200, 255);
  strokeWeight(2);
  circle(state.x, state.y, powerStats.singularity.radius * 2 - pulse);
  noFill();
  stroke(0, 150, 255, 150);
  strokeWeight(3);
  circle(state.x, state.y, powerStats.singularity.radius * 2 + pulse);
  stroke(50, 200, 255, 100);
  strokeWeight(1);
  circle(state.x, state.y, powerStats.singularity.radius * 2.2);
  pop();
  noStroke();

  enemies.forEach((enemy, i) => {
    if (enemy.type === "chip") return;
    const d = dist(enemy.x, enemy.y, state.x, state.y);
    if (d < powerStats.singularity.radius * 1.4) {
      if (!state.caughtEnemies.includes(i)) state.caughtEnemies.push(i);
      const angle = atan2(state.y - enemy.y, state.x - enemy.x);
      const pullStrength = map(d, powerStats.singularity.radius * 4, 0, 0.5, 3);
      enemy.x += cos(angle) * pullStrength;
      enemy.y += sin(angle) * pullStrength;
    }
  });

  if (state.timer >= powerStats.singularity.duration) {
    state.caughtEnemies.forEach(i => {
      const enemy = enemies[i];
      if (!enemy) return;
      enemy.hp -= powerStats.singularity.damage + state.caughtEnemies.length * 15;
      if (enemy.hp <= 0) KillEnemy(i);
    });
    state.active = false;
    state.caughtEnemies = [];
  }
}

// ===== RESET POWERS =====
function ResetAllPowers() {
  for (let powerName in activePowers) {
    const state = activePowers[powerName];
    if (!state) continue;

    state.active = false;
    state.timer = 0;
    if (powerName === "lightningbolt") { state.bolts = []; state.hitEnemies = []; }
    if (powerName === "singularity") { state.caughtEnemies = []; }
    powerCooldownTimer[powerName] = 0;
    powerOnCooldown[powerName] = false;
  }

  for (let powerName in powerLevelDefs) ApplyPowerLevel(powerName, 1);

  unlockedPowers = [];
  powerLevels = {};
  powerModifiers = {};
}

function ResetStagePowers() {
  ResetAllPowers();
  console.log("Stage powers reset.");
}

// ===== HELPER =====
function Shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function GetAvailablePowerChoices() {
  const choices = [];
  
  // First level up: only offer powers
  if (Level === 1) {
    for (let powerName in powerLevelDefs) {
      if (!unlockedPowers.includes(powerName)) {
        choices.push({ type: 'power', name: powerName });
      }
    }
  } else {
    // After level 1: offer powers and modifiers
    
    // Add unlocked powers for leveling (up to level 5)
    for (let powerName of unlockedPowers) {
      if ((powerLevels[powerName] || 1) < 5) {
        choices.push({ type: 'power', name: powerName });
      }
    }
    
    // Add new powers (if slots available)
    if (unlockedPowers.length < maxPowers) {
      for (let powerName in powerLevelDefs) {
        if (!unlockedPowers.includes(powerName)) {
          choices.push({ type: 'power', name: powerName });
        }
      }
    }
    
    // Add modifiers (only for powers you have)
    for (let modifierName in powerModifierDefs) {
      const modDef = powerModifierDefs[modifierName];
      const hasRequiredPower = unlockedPowers.includes(modDef.appliesToPower);
      const canLevelUp = (powerModifiers[modifierName] || 0) < modDef.maxRank;
      
      if (hasRequiredPower && canLevelUp && Object.keys(powerModifiers).length < maxModifiers) {
        choices.push({ type: 'modifier', name: modifierName });
      }
    }
  }
  
  // Shuffle and return up to 4 choices
  return Shuffle(choices).slice(0, 4);
}

function UnlockPowerChoice(choice) {
  if (choice.type === 'power') {
    if (!unlockedPowers.includes(choice.name)) {
      // New power
      unlockedPowers.push(choice.name);
      powerLevels[choice.name] = 1;

      // Add to active powers so cooldown system tracks it
      UnlockPower(choice.name);

      // Apply starting level stats
      ApplyPowerLevel(choice.name, 1);

      // Trigger immediately
      TriggerPower(choice.name);

      console.log("Unlocked and activated power:", choice.name);
    } else {
      // Level up existing power
      const newLevel = Math.min(5, (powerLevels[choice.name] || 1) + 1);
      powerLevels[choice.name] = newLevel;

      ApplyPowerLevel(choice.name, newLevel);

      // Trigger immediately after leveling
      TriggerPower(choice.name);

      console.log("Leveled up power:", choice.name, "to level", newLevel);
    }
  } else if (choice.type === 'modifier') {
    // Increase modifier rank
    powerModifiers[choice.name] = (powerModifiers[choice.name] || 0) + 1;
    console.log("Leveled modifier:", choice.name, "to rank", powerModifiers[choice.name]);

    // Recalculate all active power stats including this modifier
    RecalculatePowerStats();
  }
}


// ===== POWER LEVEL APPLICATION =====

function ApplyPowerLevel(powerName, level) {
  if (!powerLevelDefs[powerName] || !powerLevelDefs[powerName][level]) {
    console.error("Power level definition not found:", powerName, level);
    return;
  }

  const levelData = powerLevelDefs[powerName][level];

  if (!powerStats[powerName]) powerStats[powerName] = {};
  for (let stat in levelData) {
    powerStats[powerName][stat] = levelData[stat];

    // ALSO apply to abilityStats so the effect sees it
    if (abilityStats[powerName]) {
      abilityStats[powerName][stat] = levelData[stat];
    }
  }

  console.log(`Applied ${powerName} level ${level}:`, levelData);
}

// ===== POWER STAT CALCULATION =====

function CalculatePowerDamage(powerName) {
  if (!powerStats[powerName]) return 0;
  
  let baseDamage = powerStats[powerName].damage || 0;
  let damageMultiplier = powerStats[powerName].damageMultiplier || 1;
  
  // Apply global multipliers
  let totalDamage = baseDamage * damageMultiplier * abilityDamage * powersDamage;
  
  // Apply area-specific multiplier for area powers
  if (powerName === 'bomb' || powerName === 'singularity') {
    totalDamage *= areaDamage;
  }
  
  return totalDamage;
}

function CalculatePowerArea(powerName) {
  if (!powerStats[powerName]) return 0;
  
  let baseArea = 0;
  if (powerStats[powerName].radius) baseArea = powerStats[powerName].radius;
  
  // Only area powers scale with powersDiameter
  if (powerName === 'singularity' || powerName === 'bomb') {
    return baseArea * powersDiameter;
  }
  
  return baseArea;
}

function CalculatePowerCooldown(powerName) {
  if (!powerStats[powerName]) return 0;
  
  let baseCooldown = powerStats[powerName].cooldown || 0;
  let cooleddown = baseCooldown - (baseCooldown * (powersCooldownReduction / 100));
  
  return cooleddown;
}

function GetModifierEffect(modifierName) {
  if (!powerModifierDefs[modifierName]) return 0;
  
  const rank = powerModifiers[modifierName] || 0;
  const modDef = powerModifierDefs[modifierName];
  
  return modDef.applyModifier(rank);
}

function RecalculatePowerStats() {
  // This gets called whenever modifiers change or powers level up
  // It recalculates all active power stats
  
  for (let powerName of unlockedPowers) {
    // Reapply the current level data
    const level = powerLevels[powerName] || 1;
    ApplyPowerLevel(powerName, level);
    
    // Apply modifier bonuses
    if (powerName === 'lightningbolt') {
      powerStats[powerName].boltEchoChance = GetModifierEffect('boltEcho');
      powerStats[powerName].boltChainChance = GetModifierEffect('boltChain');
      powerStats[powerName].boltCount += GetModifierEffect('boltCount');
    }
    
    if (powerName === 'singularity') {
      powerStats[powerName].damagePerEnemy += GetModifierEffect('singularityDensity');
      powerStats[powerName].radius += GetModifierEffect('singularityPull');
      powerStats[powerName].radius += GetModifierEffect('singularitySize');
    }
  }
  
  console.log("Power stats recalculated:", powerStats);
}

// ===== STAGE RESET =====
function ResetStagePowers() {
  console.log("Resetting stage powers and modifiers");
  unlockedPowers = [];
  powerLevels = {};
  powerModifiers = {};
  ResetAllPowers(); // From powers.js
}

// ===== HELPER FUNCTION =====
function Shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function GetPowerLevelStats(powerName, level) {
  const levels = powerLevelDefs[powerName];
  if (!levels) return null;

  // Clamp level to existing table range
  const safe = (lvl) => Math.max(1, Math.min(lvl, Object.keys(levels).length));

  return {
    current: levels[safe(level)],
    next: levels[safe(level + 1)]
  };
}
