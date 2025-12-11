// ==++ -- POWER SYSTEM (AUTO-TRIGGER) -- ++== \\
// Powers automatically trigger when their cooldown expires
// Each power has its own independent cooldown
// Powers are separate from Ship Abilities and Shield Ability

var powerStats = {};

let activePowers = {
  lightningbolt: { active: false, timer: 0, bolts: [], hitEnemies: [] },
  singularity: { active: false, timer: 0, caughtEnemies: [] }
};

var powerCooldownTimer = {}; // { lightningbolt: 0, singularity: 0, ... }
var powerOnCooldown = {}; // { lightningbolt: false, singularity: false, ... }

const powerDescriptions = {
  lightningbolt: "Automatically calls down sequential lightning strikes on random enemies.",
  singularity: "Creates a gravity well that pulls in enemies and deals increased damage based on enemies hit."
  
};

// ===== INITIALIZATION =====
function InitializePowerStats() {
  for (let powerName in powerBaseStats) {
    powerStats[powerName] = { ...powerBaseStats[powerName] };
    powerCooldownTimer[powerName] = 0;
    powerOnCooldown[powerName] = false;
  }
  console.log("Power stats initialized:", powerStats);
}

function UnlockPower(powerName) {
  // Ensure the power exists in activePowers as an object
  if (!activePowers[powerName]) {
    // Initialize the state depending on the power type
    if (powerName === "lightningbolt") {
      activePowers[powerName] = { active: false, timer: 0, bolts: [], hitEnemies: [] };
    } else if (powerName === "singularity") {
      activePowers[powerName] = { active: false, timer: 0, caughtEnemies: [] };
    } else {
      // Generic fallback for other powers
      activePowers[powerName] = { active: false, timer: 0 };
    }
  }

  // Ensure cooldown properties exist
  if (powerOnCooldown[powerName] === undefined) powerOnCooldown[powerName] = false;
  if (powerCooldownTimer[powerName] === undefined) powerCooldownTimer[powerName] = 0;
}

// ===== Trigger a power manually (or from cooldown system) ===== if (!game_State || game_Screen !== "playing") return;
function TriggerPower(powerName) {
  if (!game_State || game_Screen !== "playing") return;
    const stats = powerStats[powerName];
    if (!stats) {
        console.warn("Unknown power:", powerName);
        return;
    }

    switch (powerName) {
        case 'lightningbolt':
        TriggerLightningBolt(stats);
        break;
        case 'singularity':
        TriggerSingularity(stats);
        break;
    }
}

function UpdatePowers() {
  for (let powerName of unlockedPowers) {
    if (!powerStats[powerName]) continue;

    // Reduce cooldown if active
    if (powerCooldownTimer[powerName] > 0) {
      powerCooldownTimer[powerName]--;
    }

    // Trigger power if ready
    if (powerCooldownTimer[powerName] <= 0) {
      TriggerPower(powerName);
    }
  }

  // Update each active power
  if (activePowers.lightningbolt) UpdateLightningBolt();
  if (activePowers.singularity) UpdateSingularity();
}


// ===== COOLDOWN MANAGEMENT =====
function UpdatePowerCooldowns() {
  for (let powerName in activePowers) {
    if (!powerStats[powerName]) continue;

    if (powerOnCooldown[powerName]) {
      powerCooldownTimer[powerName]--;
      if (powerCooldownTimer[powerName] <= 0) {
        powerOnCooldown[powerName] = false;
      }
    }
  }
}


function ResetPowerCooldown(powerName) {
  if (!powerStats[powerName]) {
    console.error("Power not found:", powerName);
    return;
  }
  
  let baseCooldown = powerStats[powerName].cooldown;

  // Apply cooldown reduction with max limit of 75%
  let effectiveReduction = Math.min(cooldown_Reduction, 75); 
  let cooldownReduced = baseCooldown - (baseCooldown * (effectiveReduction / 100));

  powerCooldownTimer[powerName] = cooldownReduced;
  powerOnCooldown[powerName] = true;

  console.log(powerName, "cooldown reset to:", powerCooldownTimer[powerName]);
}


function GetPowerCooldownPercent(powerName) {
  if (!powerStats[powerName]) return 0;
  
  const baseCooldown = powerStats[powerName].cooldown;
  const timeRemaining = powerCooldownTimer[powerName];
  
  return Math.floor((timeRemaining / baseCooldown) * 100);
}

function ModifyPowerStat(powerName, statName, value, isMultiplier = false) {
  if (!powerStats[powerName]) {
    console.error("Power not found:", powerName);
    return;
  }
  
  if (!powerStats[powerName][statName]) {
    console.error("Stat not found:", statName, "for power:", powerName);
    return;
  }
  
  if (isMultiplier) {
    powerStats[powerName][statName] *= value;
  } else {
    powerStats[powerName][statName] += value;
  }
  
  console.log(`Modified ${powerName}.${statName} to:`, powerStats[powerName][statName]);
}

// ===== LIGHTNING BOLT POWER =====
// Spawns bolts sequentially, one every boltFrames
function TriggerLightningBolt(stats) {
  console.log("LIGHTNING BOLT TRIGGERED!", stats);

  const boltState = activePowers.lightningbolt;
  boltState.active = true;
  boltState.timer = 0;
  boltState.hitEnemies = [];
  boltState.bolts = [];

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

    boltState.bolts.push(boltArray);
  }

  playSound('abilitylightningbolt'); // optional sound
}

// Draw function called from draw()
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

  // Damage logic
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (state.hitEnemies.includes(i)) continue;

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


// ===== SINGULARITY MODULE =====

function TriggerSingularity(stats) {
  console.log("SINGULARITY TRIGGERED!", stats);
  const state = activePowers.singularity;
  state.active = true;
  state.timer = 0;
  state.caughtEnemies = [];
  singularityX = mouseX + cameraX;
  singularityY = mouseY + cameraY;
  singularityRadius = stats.radius;

  playSound('singularity');
}

function UpdateSingularity() {
  const state = activePowers.singularity;
  if (!state || !state.active || !game_State || game_Screen !== "playing") return;

  state.timer++;

  // Draw visuals
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

  // Pull enemies
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
    // Deal damage and reset
    state.caughtEnemies.forEach(i => {
      const enemy = enemies[i];
      if (!enemy) return;
      enemy.health -= powerStats.singularity.damage + state.caughtEnemies.length * 15;
      damage_Dealt += powerStats.singularity.damage;
      if (enemy.health <= 0) KillEnemy(i);
    });

    state.active = false;
    state.caughtEnemies = [];
  }
}


// ===== RESET FUNCTION =====
function ResetAllPowers() {
  console.log("Resetting all powers...");

  for (let powerName in activePowers) {
    const state = activePowers[powerName];
    if (!state) continue;

    state.active = false;
    state.timer = 0;

    if (powerName === "lightningbolt") {
      state.bolts = [];
      state.hitEnemies = [];
    }

    if (powerName === "singularity") {
      state.caughtEnemies = [];
    }

    powerCooldownTimer[powerName] = 0;
    powerOnCooldown[powerName] = false;
  }

  // Reset stats to base level 1
  for (let powerName in powerLevelDefs) {
    ApplyPowerLevel(powerName, 1);
  }

  unlockedPowers = [];
  powerLevels = {};
  powerModifiers = {};
}


// ===== POWER MODIFIER DEFINITIONS =====
// Framework for all modifiers - easily extensible
const powerModifierDefs = {
  // Lightning Bolt Modifiers
  boltEcho: {
    name: "Echoing Thunder",
    appliesToPower: "lightningbolt",
    description: "Bolts have a chance to strike again.",
    baseEffect: 0.04, // 4% per rank
    maxRank: 10,
    applyModifier: (rank) => {
      return rank * 0.04; // 4%, 8%, 12%... 40% at rank 10
    }
  },
  boltChain: {
    name: "Chain Lightning",
    appliesToPower: "lightningbolt",
    description: "Lightning Bolts can chain to an additional target.",
    baseEffect: 0.06, // 6% per rank
    maxRank: 10,
    applyModifier: (rank) => {
      return rank * 0.06; // 6%, 12%, 18%... 60% at rank 10
    }
  },
  boltCount: {
    name: "Thundercloud",
    appliesToPower: "lightningbolt",
    description: "Increases the number of Lightning Strikes.",
    baseEffect: 1,
    maxRank: 10,
    applyModifier: (rank) => {
      return rank; // +1, +2, +3... +10 bolts
    }
  },
  
  // Singularity Modifiers
  singularityPull: {
    name: "Supermassive",
    appliesToPower: "singularity",
    description: "Increases the radius of Singularity.",
    baseEffect: 25,
    maxRank: 10,
    applyModifier: (rank) => {
      return rank * 25; // +25, +50, +75... +250 radius
    }
  },
  singularityDensity: {
    name: "Active Nuclei",
    appliesToPower: "singularity",
    description: "For each enemy affected by Singularity, it deals 8 additional damage.",
    baseEffect: 5,
    maxRank: 10,
    applyModifier: (rank) => {
      return rank * 8; // +8, +16, +24... +80 damage per enemy
    }
  },
  singularitySize: {
    name: "Singularity Size",
    appliesToPower: "singularity",
    description: "Increased singularity radius",
    baseEffect: 25,
    maxRank: 10,
    applyModifier: (rank) => {
      return rank * 25; // +25, +50, +75... +250 radius
    }
  }
  
  // Template for adding new modifiers: /////////////////////
  // newModifier: {
  //   name: "Display Name",
  //   appliesToPower: "powerName",
  //   description: "What it does",
  //   baseEffect: 0.1,
  //   maxRank: 10,
  //   applyModifier: (rank) => {
  //     return rank * 0.1;
  //   }
  // }
};


// ===== POWER LEVEL DEFINITIONS =====
// Each power can be leveled 1-5, with different scaling per level
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
  
  // Template for adding new powers:
  // newpower: {
  //   1: { stat1: value, stat2: value },
  //   2: { stat1: value, stat2: value },
  //   3: { stat1: value, stat2: value },
  //   4: { stat1: value, stat2: value },
  //   5: { stat1: value, stat2: value }
  // }
};

// ===== STAGE PROGRESSION TRACKING =====
var unlockedPowers = [];        // Powers you currently have: ['lightningbolt', 'singularity']
var powerLevels = {};           // { lightningbolt: 3, singularity: 1 }
var powerModifiers = {};        // { boltEcho: 5, singularityDensity: 2 }
var maxPowers = 6;
var maxModifiers = 10;          // You can have up to this many different modifiers

// ===== POWER SELECTION & UNLOCK =====

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