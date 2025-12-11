// ==++ -- POWER SYSTEM (AUTO-TRIGGER) -- ++== \\
// Powers automatically trigger when their cooldown expires
// Each power has its own independent cooldown
// Powers are separate from Ship Abilities and Shield Ability

// ===== POWER STATE =====
var powerStats = {};
var activePowers = {
  lightningbolt: { active: false, timer: 0, bolts: [], hitEnemies: [] },
  singularity: { active: false, timer: 0, caughtEnemies: [], x: 0, y: 0 },
  fireball: { active: false, timer: 0, projectiles: [], boltQueue: [] },
  freeze: { active: false, timer: 0, icebergs: [], boltQueue: [] },
  diamondburst: { active: false, timer: 0, projectiles: [] },
  cyclone: { active: false, timer: 0, projectiles: [] } 
};

var powerCooldownTimer = {};  // { lightningbolt: 0, singularity: 0, ... }
var powerOnCooldown = {};     // { lightningbolt: false, singularity: false, ... }

const powerDescriptions = {
  lightningbolt: "Automatically calls down sequential lightning strikes on random enemies.",
  singularity: "Creates a gravity well that pulls in enemies and deals increased damage based on enemies hit.",
  fireball: "Periodically fires fireballs in a spread toward the cursor.",
  freeze: "Drops frozen icebergs on enemies that shatter into ice shards on impact.",
  diamondburst: "Fires a burst of diamond shards that radiate from the player.",
  cyclone: "Launches spiraling cyclone projectiles that penetrate all enemies."
};

// ===== POWER LEVELS & MODIFIERS =====
const powerLevelDefs = {
  lightningbolt: {
    1: { cooldown: 420, boltCount: 3, boltDamage: 40, boltFrames: 22, range: 600 },
    2: { cooldown: 400, boltCount: 4, boltDamage: 65, boltFrames: 22, range: 625 },
    3: { cooldown: 380, boltCount: 5, boltDamage: 100, boltFrames: 22, range: 650 },
    4: { cooldown: 360, boltCount: 6, boltDamage: 140, boltFrames: 22, range: 680 },
    5: { cooldown: 340, boltCount: 7, boltDamage: 200, boltFrames: 22, range: 720 }
  },
  singularity: {
    1: { cooldown: 600, radius: 100, sngularityDamage: 30, damagePerEnemy: 15, duration: 150, range: 550 },
    2: { cooldown: 582, radius: 110, sngularityDamage: 40, damagePerEnemy: 20, duration: 170, range: 550 },
    3: { cooldown: 564, radius: 120, sngularityDamage: 60, damagePerEnemy: 35, duration: 190, range: 550 },
    4: { cooldown: 546, radius: 130, sngularityDamage: 100, damagePerEnemy: 50, duration: 210, range: 550 },
    5: { cooldown: 528, radius: 140, sngularityDamage: 135, damagePerEnemy: 80, duration: 230, range: 550 }
  },
  fireball: {
    1: { cooldown: 480, radius: 40, fireballCount: 2, fireballDamage: 70, fireballFrames: 40, fireballPenetration: 0, range: 550 },
    2: { cooldown: 468, radius: 40, fireballCount: 2, fireballDamage: 100, fireballFrames: 38, fireballPenetration: 0, range: 580 },
    3: { cooldown: 456, radius: 40, fireballCount: 3, fireballDamage: 140, fireballFrames: 36, fireballPenetration: 1, range: 620 },
    4: { cooldown: 444, radius: 40, fireballCount: 3, fireballDamage: 190, fireballFrames: 34, fireballPenetration: 1, range: 650 },
    5: { cooldown: 432, radius: 40, fireballCount: 4, fireballDamage: 240, fireballFrames: 32, fireballPenetration: 2, range: 700 }
  },
  freeze: {
    1: { cooldown: 550, freezeCount: 2, freezeDamage: 120, freezeFrames: 50, radius: 200, shardCount: 3, range: 375 },
    2: { cooldown: 535, freezeCount: 2, freezeDamage: 160, freezeFrames: 48, radius: 210, shardCount: 3, range: 400 },
    3: { cooldown: 520, freezeCount: 3, freezeDamage: 210, freezeFrames: 46, radius: 220, shardCount: 4, range: 435 },
    4: { cooldown: 505, freezeCount: 3, freezeDamage: 270, freezeFrames: 44, radius: 230, shardCount: 4, range: 470 },
    5: { cooldown: 490, freezeCount: 4, freezeDamage: 340, freezeFrames: 42, radius: 240, shardCount: 5, range: 520 }
  },
  diamondburst: {
    1: { cooldown: 420, burstCount: 8, diamondDamage: 70, diamondFrames: 30, range: 300 },
    2: { cooldown: 408, burstCount: 10, diamondDamage: 95, diamondFrames: 28, range: 350 },
    3: { cooldown: 396, burstCount: 12, diamondDamage: 130, diamondFrames: 26, range: 400 },
    4: { cooldown: 384, burstCount: 14, diamondDamage: 170, diamondFrames: 24, range: 450 },
    5: { cooldown: 372, burstCount: 16, diamondDamage: 215, diamondFrames: 22, range: 300 }
  },
  cyclone: {
      1: { cooldown: 540, cycloneCount: 3, cycloneDamage: 30, cycloneFrames: 35, duration: 120, range: 800, radius: 20 },
      2: { cooldown: 528, cycloneCount: 3, cycloneDamage: 50, cycloneFrames: 33, duration: 130, range: 800, radius: 20 },
      3: { cooldown: 516, cycloneCount: 4, cycloneDamage: 80, cycloneFrames: 31, duration: 140, range: 800, radius: 20 },
      4: { cooldown: 504, cycloneCount: 4, cycloneDamage: 110, cycloneFrames: 29, duration: 150, range: 800, radius: 20 },
      5: { cooldown: 492, cycloneCount: 5, cycloneDamage: 190, cycloneFrames: 27, duration: 160, range: 800, radius: 20 }
    }
};

const powerModifierDefs = {
    // Lightning Bolt mods
  boltEcho: {
    name: "Echoing Thunder",
    appliesToPower: "lightningbolt",
    baseEffect: 0.06,
    maxRank: 10,
    description: "Lightning bolts automatically trigger a secondary bolt after a delay.",
    applyModifier: (rank) => rank * 0.06
  },
  boltChain: {
    name: "Chain Lightning",
    appliesToPower: "lightningbolt",
    baseEffect: 0.08,
    maxRank: 10,
    description: "Lightning bolts have a chance to chain to nearby enemies.",
    applyModifier: (rank) => rank * 0.08
  },
  boltCount: {
    name: "Thundercloud",
    appliesToPower: "lightningbolt",
    baseEffect: 1,
    maxRank: 10,
    description: "Increases the number of lightning bolts.",
    applyModifier: (rank) => rank
  },

    // Singularity mods
  singularityPull: {
    name: "Supermassive",
    appliesToPower: "singularity",
    baseEffect: 25,
    maxRank: 10,
    description: "Increases the pull radius of the singularity.",
    applyModifier: (rank) => rank * 25
  },
  singularityDensity: {
    name: "Active Nuclei",
    appliesToPower: "singularity",
    baseEffect: 5,
    maxRank: 10,
    description: "Increases damage based on the number of enemies caught in the singularity.",
    applyModifier: (rank) => rank * 5
  },
  singularitySize: {
    name: "Singularity Size",
    appliesToPower: "singularity",
    baseEffect: 15,
    maxRank: 10,
    description: "Increases the size and effect radius of the singularity.",
    applyModifier: (rank) => rank * 15
  },

    // Fireball mods
   fireballCount: {
    name: "Inferno Cascade",
    appliesToPower: "fireball",
    baseEffect: 1,
    maxRank: 10,
    description: "Increases the number of fireballs fired in sequence.",
    applyModifier: (rank) => rank
  },
  fireballPenetration: {
    name: "Burning Path",
    appliesToPower: "fireball",
    baseEffect: 1,
    maxRank: 10,
    description: "Fireballs penetrate through additional enemies before dissipating.",
    applyModifier: (rank) => rank
  },

    // Freeze mods
  freezeCount: {
    name: "Blizzard",
    appliesToPower: "freeze",
    baseEffect: 1,
    maxRank: 10,
    description: "Increases the number of icebergs dropped in sequence.",
    applyModifier: (rank) => rank
  },
  freezeShards: {
    name: "Permafrost",
    appliesToPower: "freeze",
    baseEffect: 0.1,
    maxRank: 10,
    description: "Increases the range Shards will travel before melting by 10% per rank.",
    applyModifier: (rank) => rank * 0.1
  },

    // Diamond Burst mods
  diamondFork: {
    name: "Splinter Shards",
    appliesToPower: "diamondburst",
    baseEffect: 0.04,
    maxRank: 10,
    description: "Diamond Burst projectiles have a chance to split into smaller projectiles on hit.",
    applyModifier: (rank) => rank * 0.04
  },
  diamondChain: {
    name: "Glimmer",
    appliesToPower: "diamondburst",
    baseEffect: 0.06,
    maxRank: 10,
    description: "Diamond Burst projectiles have a chance to chain to nearby enemies.",
    applyModifier: (rank) => rank * 0.06
  },  

  // Cyclone mods
  cycloneVolley: {
    name: "Superstorm",
    appliesToPower: "cyclone",
    baseEffect: 1,
    maxRank: 10,
    description: "Chance to fire a second volley of cyclone projectiles in opposite direction.",
    applyModifier: (rank) => rank * 0.25
  },
  cycloneDouble: {
    name: "Twin Cyclones",
    appliesToPower: "cyclone",
    baseEffect: 15,
    maxRank: 10,
    description: "Chance to fire double projectiles.",
    applyModifier: (rank) => rank * 0.15
  },    

    // Generic modifiers
  powersDamage: {
    name: "Focused Power",
    appliesToPower: ["lightningbolt", "singularity", "fireball", "freeze", "diamondburst", "cyclone"],
    baseEffect: 0.10,
    maxRank: 10,
    description: "Increases damage of all powers by 10% per rank.",
    applyModifier: (rank) => rank * 0.10
  },
  powersDiameter: {
    name: "Expansion",
    appliesToPower: ["singularity", "freeze", "cyclone", "fireball"],
    baseEffect: 0.07,
    maxRank: 10,
    description: "Increases area size of powers by 7% per rank.",
    applyModifier: (rank) => rank * 0.07
  },
  powersCooldown: {
    name: "Quick Cast",
    appliesToPower: ["lightningbolt", "singularity", "fireball", "freeze", "diamondburst", "cyclone"],
    baseEffect: 0.05,
    maxRank: 10,
    description: "Reduces cooldown of all powers by 5% per rank.",
    applyModifier: (rank) => rank * 0.05
  },
  powersCount: {
    name: "Multiple Projectiles",
    appliesToPower: ["lightningbolt", "fireball", "freeze", "diamondburst", "cyclone"],
    baseEffect: 1,
    maxRank: 10,
    description: "Powers fire 1 additional projectile per rank.",
    applyModifier: (rank) => rank * 1
  },
  powersDuration: {
    name: "Extended Duration",
    appliesToPower: ["fireball", "cyclone"],
    baseEffect: 0.10,
    maxRank: 10,
    description: "Increases the duration of powers by 10% per rank.",
    applyModifier: (rank) => rank * 0.10
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
    case "freeze": TriggerFreeze(stats); break;
    case "fireball": TriggerFireball(stats); break;
    case "diamondburst": TriggerDiamondBurst(stats); break;
    case "cyclone": TriggerCyclone(stats); break;
  }
  
  ResetPowerCooldown(powerName);
}

// ===== UPDATE POWERS =====
function UpdatePowers() {
  if (!game_State || game_Paused) return;
  if (!unlockedPowers) return;

  for (let powerName of unlockedPowers) {
    if (!powerStats[powerName]) continue;

    // Decrement cooldown
    if (powerCooldownTimer[powerName] > 0) {
      powerCooldownTimer[powerName]--;
    } 
    // Trigger when cooldown reaches 0
    if (powerCooldownTimer[powerName] <= 0) {
      TriggerPower(powerName);
      powerCooldownTimer[powerName] = powerStats[powerName].cooldown;
    }
  }

  if (activePowers.lightningbolt?.active) UpdateLightningBolt();
  if (activePowers.singularity?.active) UpdateSingularity();
  if (activePowers.fireball?.active) UpdateFireball();
  if (activePowers.freeze?.active) {
    UpdateFreeze();
    UpdateFreezeShards(activePowers.freeze);
  }
  if (activePowers.diamondburst?.active) UpdateDiamondBurst();
  if (activePowers.cyclone?.active) UpdateCyclone();
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
  RecalculatePowerStats();
  state.timer++;
  state.active = true;
  state.timer = 0;
  state.bolts = [];
  state.boltQueue = [];
  state.echoBoltQueue = [];
  state.chainBoltQueue = [];

  // Find nearby enemies within range
  let validTargets = [];
  
  // Check regular enemies
  for (let enemy of enemies) {
    if (enemy.health > 0) {
      const distToEnemy = dist(player_X, player_Y, enemy.x, enemy.y);
      if (distToEnemy < stats.range) {
        validTargets.push({ obj: enemy, type: 'enemy', index: enemies.indexOf(enemy) });
      }
    }
  }
  
  // Check bosses
    if (bosses.length > 0) {
      for (let boss of bosses) {
        if (boss.isAlive) {
          const distToBoss = dist(player_X, player_Y, boss.worldX, boss.worldY);
          if (distToBoss < stats.range) {
            // Center
            validTargets.push({ obj: boss, type: 'boss_center', index: bosses.indexOf(boss) });
            
            // Left
            if (boss.left.health > 0) {
              validTargets.push({ obj: boss, type: 'boss_left', index: bosses.indexOf(boss) });
            }
            
            // Right
            if (boss.right.health > 0) {
              validTargets.push({ obj: boss, type: 'boss_right', index: bosses.indexOf(boss) });
            }
          }
        }
      }
    }

  // Queue bolts to spawn sequentially at random valid targets
  const boltDelay = powerStats.lightningbolt.boltFrames;
  
  for (let b = 0; b < stats.boltCount; b++) {
    const targetData = validTargets.length > 0 ? validTargets[Math.floor(Math.random() * validTargets.length)] : null;
    state.boltQueue.push({
      spawnTime: b * boltDelay,
      targetData: targetData,
      type: "normal"
    });
  }

  playSound('abilitylightningbolt');
}

function UpdateLightningBolt() {
  const state = activePowers.lightningbolt;
  if (!state || !state.active) return;
  if (!game_State || game_Paused) return;
  if (!state || !state.active) return;

  state.timer++;

  // Spawn queued initial bolts
 if (state.boltQueue && state.boltQueue.length > 0) {
    const nextBolt = state.boltQueue[0];
    
    if (state.timer >= nextBolt.spawnTime) {
      state.boltQueue.shift();
      
      let worldX, worldY;
      let targetObj = null;
      
      if (nextBolt.targetData && nextBolt.targetData.obj) {
        targetObj = nextBolt.targetData.obj;
        if (nextBolt.targetData.type === 'boss') {
          worldX = targetObj.worldX;
          worldY = targetObj.worldY - 300;
        } else {
          worldX = targetObj.x;
          worldY = targetObj.y - 300;
        }
      } else {
        worldX = player_X + random(-powerStats.lightningbolt.range, powerStats.lightningbolt.range);
        worldY = player_Y - 300;
      }
      
      const boltData = {
        segments: [],
        targetData: nextBolt.targetData,
        type: nextBolt.type || "normal",
        sourceEnemy: nextBolt.sourceEnemy || null,
        growthProgress: 0,
        growthSpeed: 12,
        growthStartX: worldX,
        growthStartY: worldY,
        growthEndY: worldY + 300,
        isGrowing: true,
        damageProcessed: false
      };
      
      state.bolts.push(boltData);
    }
  }

  // Spawn queued echo bolts
// Spawn queued echo bolts
  if (state.echoBoltQueue && state.echoBoltQueue.length > 0) {
    for (let e = state.echoBoltQueue.length - 1; e >= 0; e--) {
      const echoBolt = state.echoBoltQueue[e];
      
      if (state.timer >= echoBolt.spawnTime) {
        // Get the target from stored targetData
        let targetObj = echoBolt.targetData && echoBolt.targetData.obj;
        
        // If target is gone, skip this echo bolt rip stat
        if (!targetObj) {
          state.echoBoltQueue.splice(e, 1);
          continue;
        }
        
        state.echoBoltQueue.splice(e, 1);
        
        let echoWorldX, echoWorldY;
        if (echoBolt.targetData.type === 'boss') {
          echoWorldX = targetObj.worldX;
          echoWorldY = targetObj.worldY - 300;
        } else {
          echoWorldX = targetObj.x;
          echoWorldY = targetObj.y - 300;
        }
        
        state.bolts.push({
          segments: [],
          targetEnemy: targetObj,
          type: "echo",
          sourceEnemy: echoBolt.sourceEnemy,
          growthProgress: 0,
          growthSpeed: 12,
          growthStartX: echoWorldX,
          growthStartY: echoWorldY,
          growthEndY: echoWorldY + 300,
          isGrowing: true,
        });
      }
    }
  }

  // Spawn queued chain bolts
  if (state.chainBoltQueue && state.chainBoltQueue.length > 0) {
    for (let c = state.chainBoltQueue.length - 1; c >= 0; c--) {
      const chainBolt = state.chainBoltQueue[c];
      
      if (state.timer >= chainBolt.spawnTime) {
        state.chainBoltQueue.splice(c, 1);
        
        const targetEnemy = chainBolt.targetEnemy;
        if (!targetEnemy || targetEnemy.health <= 0) continue;
        
        const worldX = chainBolt.sourcePos.x;
        const worldY = chainBolt.sourcePos.y;
        const targetX = targetEnemy.x;
        const targetY = targetEnemy.y;
        
        state.bolts.push({
          segments: [],
          targetEnemy: targetEnemy,
          type: "chain",
          sourceEnemy: chainBolt.sourceEnemy,
          growthProgress: 0,
          growthSpeed: 12,
          growthStartX: worldX,
          growthStartY: worldY,
          growthTargetX: targetX,
          growthTargetY: targetY,
          isGrowing: true,
          damageProcessed: false
        });
      }
    }
  }

  // Draw bolts and manage lifespan/growth
  for (let b = state.bolts.length - 1; b >= 0; b--) {
    const boltData = state.bolts[b];
    
    // Handle bolt growth
    if (boltData.isGrowing) {
      boltData.growthProgress++;
      
      if (boltData.growthProgress >= boltData.growthSpeed) {
        boltData.isGrowing = false;
      }
      
      boltData.segments = [];
      const progress = boltData.growthProgress / boltData.growthSpeed;
      
      if (boltData.type === "chain") {
        const dist_length = dist(boltData.growthStartX, boltData.growthStartY, boltData.growthTargetX, boltData.growthTargetY);
        const steps = Math.ceil(dist_length / 30);
        for (let s = 0; s < steps * progress; s++) {
          const t = s / steps;
          const cx = boltData.growthStartX + (boltData.growthTargetX - boltData.growthStartX) * t + random(-15, 15);
          const cy = boltData.growthStartY + (boltData.growthTargetY - boltData.growthStartY) * t + random(-15, 15);
          boltData.segments.push({ x: cx, y: cy });
        }
      } else {
        const currentEndY = boltData.growthStartY + (boltData.growthEndY - boltData.growthStartY) * progress;
        
        let currentX = boltData.growthStartX;
        let currentY = boltData.growthStartY;
        const segmentLength = 30;
        
        while (currentY < currentEndY) {
          boltData.segments.push({ x: currentX, y: currentY });
          currentX += random(-20, 20);
          currentY += segmentLength + random(-10, 10);
          currentX = constrain(currentX, boltData.growthStartX - 100, boltData.growthStartX + 100);
        }
      }
    }
    
    // Initialize lifespan if not set
    if (boltData.lifespan === undefined) {
      boltData.lifespan = 32;
    }
    
    boltData.lifespan--;
    
    // Only draw if still alive
    if (boltData.lifespan > 0) {
      const bolt = boltData.segments;
      if (boltData.type === "chain") {
        stroke(100, 255, 100);
        strokeWeight(4);
      } else if (boltData.type === "echo") {
        stroke(200, 180, 255);
        strokeWeight(2);
      } else {
        stroke(0, 180, 255);
        strokeWeight(3);
      }
      
      for (let i = 0; i < bolt.length - 1; i++) {
        line(bolt[i].x - cameraX, bolt[i].y - cameraY, bolt[i + 1].x - cameraX, bolt[i + 1].y - cameraY);
      }
    } else {
      state.bolts.splice(b, 1);
    }
  }


// Damage logic - process hits based on bolt target
  for (let b = state.bolts.length - 1; b >= 0; b--) {
    const boltData = state.bolts[b];
    
    // Skip if already processed damage for this bolt
    if (boltData.damageProcessed) continue;
    boltData.damageProcessed = true;
    
    // Handle boss targets
    if (boltData.targetData && boltData.targetData.type === 'boss') {
      const boss = bosses[boltData.targetData.index];
      if (!boss || !boss.isAlive) continue;
      
      boss.center.health -= powerStats.lightningbolt.boltDamage;
      damage_Dealt += powerStats.lightningbolt.boltDamage;
      
      // Play sound based on bolt type
      if (boltData.type === "normal") {
        playSound('abilitylightningbolt');
      } else if (boltData.type === "chain") {
        playSound('lightningchain');
      } else if (boltData.type === "echo") {
        playSound('lightningecho');
      }
      
      // Only normal bolts trigger chain and echo for bosses
      if (boltData.type === "normal") {
        // For now, just echo. Chain to other bosses is complex
        if (Math.random() < powerStats.lightningbolt.boltEchoChance) {
          state.echoBoltQueue.push({
            spawnTime: state.timer + powerStats.lightningbolt.boltFrames,
            targetData: boltData.targetData,
            type: "echo",
            sourceEnemy: boltData.targetData.index
          });
        }
      }
      continue;
    }
    
    // Handle regular enemy targets
    if (!boltData.targetData || !boltData.targetData.obj) continue;
    
    let targetEnemy = boltData.targetData.obj;
    if (!targetEnemy || !targetEnemy.health || targetEnemy.health <= 0) continue;
    
    let targetIndex = boltData.targetData.index;
    
    // Deal damage to target
    targetEnemy.health -= powerStats.lightningbolt.boltDamage;
    damage_Dealt += powerStats.lightningbolt.boltDamage;

    // Play sound based on bolt type
    if (boltData.type === "normal") {
      playSound('abilitylightningbolt');
    } else if (boltData.type === "chain") {
      playSound('lightningchain');
    } else if (boltData.type === "echo") {
      playSound('lightningecho');
    }
    
    // Only normal bolts trigger chain and echo
    if (boltData.type === "normal") {
      // Handle chain effect
      if (Math.random() < (powerStats.lightningbolt.boltChainChance)) {
        let validChainTargets = [];
        for (let k = 0; k < enemies.length; k++) {
          if (k === targetIndex) continue;
          if (!enemies[k] || enemies[k].health <= 0) continue;
          const chainDist = dist(targetEnemy.x, targetEnemy.y, enemies[k].x, enemies[k].y);
          if (chainDist < 200) {
            validChainTargets.push(k);
          }
        }
        
        if (validChainTargets.length > 0) {
          const chainTargetIdx = validChainTargets[Math.floor(Math.random() * validChainTargets.length)];
          
          state.chainBoltQueue.push({
            spawnTime: state.timer,
            sourcePos: { x: targetEnemy.x, y: targetEnemy.y },
            targetEnemy: enemies[chainTargetIdx],  
            type: "chain",
            sourceEnemy: targetIndex
          });
        }
      }
      
      // Handle echo effect
      if (Math.random() < powerStats.lightningbolt.boltEchoChance) {
        state.echoBoltQueue.push({
          spawnTime: state.timer + powerStats.lightningbolt.boltFrames,
          targetData: boltData.targetData,
          type: "echo",
          sourceEnemy: targetIndex
        });
      }
    }
    
  if (targetEnemy && targetEnemy.health <= 0) {
        KillEnemy(targetIndex);
      }
  }

  const totalDuration = (powerStats.lightningbolt.boltCount - 1) * powerStats.lightningbolt.boltFrames + 200;
  if (state.timer > totalDuration) {
    state.active = false;
    state.bolts = [];
    state.boltQueue = [];
    state.echoBoltQueue = [];
    state.chainBoltQueue = [];
  }
}

// Helper function used to create THE LIGHTNING 
function DistanceToLineSegment(px, py, x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let t = max(0, min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));

  let closestX = x1 + t * dx;
  let closestY = y1 + t * dy;

  return dist(px, py, closestX, closestY);
}

// ===== SINGULARITY =====
function TriggerSingularity(stats) {
  const state = activePowers.singularity;
  RecalculatePowerStats();
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
  if (!game_State || game_Paused) return;  
  if (!state || !state.active) return;

  state.timer++;

  push();
  translate(-cameraX, -cameraY);
  // Center glow
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

  // Draw electricity arcs
  stroke(100, 200, 255, 200);
  strokeWeight(2);
  for (let i = 0; i < 8; i++) {
    const angle = TWO_PI / 8 * i + state.timer * 0.05;
    const x1 = state.x + cos(angle) * powerStats.singularity.radius;
    const y1 = state.y + sin(angle) * powerStats.singularity.radius;
    const x2 = state.x + cos(angle + 0.3) * (powerStats.singularity.radius * 0.7);
    const y2 = state.y + sin(angle + 0.3) * (powerStats.singularity.radius * 0.7);
    line(x1, y1, x2, y2);
  }

  pop();
  noStroke();

    // pull logic -- not supposed to work on bosses or chip because chip is chip 
  enemies.forEach((enemy, i) => {
    if (enemy.type === "chip") return;
    const d = dist(enemy.x, enemy.y, state.x, state.y);
    if (d < powerStats.singularity.radius * 1.4) {
      if (!state.caughtEnemies.includes(enemy)) state.caughtEnemies.push(enemy);  // Store object reference
      const angle = atan2(state.y - enemy.y, state.x - enemy.x);
      const pullStrength = map(d, powerStats.singularity.radius * 4, 0, 0.5, 3);
      enemy.x += cos(angle) * pullStrength;
      enemy.y += sin(angle) * pullStrength;
    }
  });


  // Damage logic
  if (state.timer >= powerStats.singularity.duration) {
    state.caughtEnemies.forEach(enemyObj => {
      if (enemyObj && enemyObj.health > 0) {
        const damageAmount = powerStats.singularity.damage + state.caughtEnemies.length * powerStats.singularity.damagePerEnemy;
        enemyObj.health -= damageAmount;
        damage_Dealt += damageAmount;
        if (enemyObj.health <= 0) {
          const index = enemies.indexOf(enemyObj);
          if (index !== -1) KillEnemy(index);
        }
      }
    });
    
    // Damage bosses
    if (state.caughtBosses) {
      state.caughtBosses.forEach(b => {
        if (b >= 0 && b < bosses.length) {
          const boss = bosses[b];
          if (boss && boss.isAlive) {
            const damageAmount = powerStats.singularity.singularityDamage + state.caughtEnemies.length * powerStats.singularity.damagePerEnemy;
            
            // Damage all parts that are alive
            if (boss.center.health > 0) {
              boss.center.health -= damageAmount;
              damage_Dealt += damageAmount;
            }
            if (boss.left.health > 0) {
              boss.left.health -= damageAmount;
              damage_Dealt += damageAmount;
            }
            if (boss.right.health > 0) {
              boss.right.health -= damageAmount;
              damage_Dealt += damageAmount;
            }
          }
        }
      });
    }
    
    state.active = false;
    state.caughtEnemies = [];
    state.caughtBosses = [];
  }
}

// Fireball power!!!!!!!!!!!!!!!!!!
function TriggerFireball(stats) {
  if (!activePowers.fireball) {
  activePowers.fireball = { active: false, timer: 0, projectiles: [], boltQueue: [] };
    }
  const state = activePowers.fireball;
  RecalculatePowerStats();
  state.active = true;
  state.timer = 0;
  state.projectiles = [];
  state.boltQueue = [];

  state.boltQueue.push({
    spawnTime: 0,
    type: "normal"
  });

  playSound('fireball');
}

function UpdateFireball() {
  if (!game_State || game_Paused) return;
  const state = activePowers.fireball;
  if (!state || !state.active) return;

  state.timer++;

  // Spawn queued fireballs
  if (state.boltQueue && state.boltQueue.length > 0) {
    const nextBolt = state.boltQueue[0];
    
    if (state.timer >= nextBolt.spawnTime) {
      state.boltQueue.shift();
      // Get direction toward cursor
      let worldMouseX = GetWorldMouseX();
      let worldMouseY = GetWorldMouseY();
      const baseAngle = atan2(worldMouseY - player_Y, worldMouseX - player_X);
      
      // Create spread of fireballs
      const spreadCount = powerStats.fireball.fireballCount;
      const spreadWidth = 0.22; // Spread angle in radians
      
    for (let s = 0; s < spreadCount; s++) {
            const spreadProgress = spreadCount > 1 ? s / (spreadCount - 1) : 0.5;
            const angleOffset = (spreadProgress - 0.5) * spreadWidth;
            const randomVariation = random(-0.06, 0.06); 
            const angle = baseAngle + angleOffset + randomVariation;
            
            state.projectiles.push({
              x: player_X,
              y: player_Y,
              vx: cos(angle) * 8,
              vy: sin(angle) * 8,
              angle: angle,
              age: 0,
              maxLifespan: 300, 
              currentFrame: 0,
              frameTimer: 0,
              maxFrames: 2, 
              frameDelay: 8,
              damage: powerStats.fireball.fireballDamage,
              penetrationRemaining: powerStats.fireball.fireballPenetration,
              hitEnemies: [],
              impactSound: 'fireballhit'
            });
          }
        }
      }

  // Update and draw fireballs
  for (let i = state.projectiles.length - 1; i >= 0; i--) {
    const fireball = state.projectiles[i];
    
    // Update animation frame
    fireball.frameTimer++;
    if (fireball.frameTimer >= fireball.frameDelay) {
      fireball.currentFrame = (fireball.currentFrame + 1) % fireball.maxFrames;
      fireball.frameTimer = 0;
    }
    
    // Move fireball
    fireball.age++;
    fireball.x += fireball.vx;
    fireball.y += fireball.vy;
    
    // Draw fireball from spritesheet
    if (powerSpritesheets.fireball) {
      const spriteSheet = powerSpritesheets.fireball;
      const spriteWidth = spriteSheet.width / fireball.maxFrames;
      const spriteHeight = spriteSheet.height;
      
      // Scale the fireball sprite 
      const radiusScale = (powerStats.fireball.radius || 40) / 40; 
      const displaySize = 30 * radiusScale;
      
      push();
      translate(fireball.x - cameraX, fireball.y - cameraY);
      rotate(fireball.angle);
      imageMode(CENTER);
      image(spriteSheet,
            0, 0,
            displaySize, displaySize,
            fireball.currentFrame * spriteWidth, 0,
            spriteWidth, spriteHeight);
      pop();
    } /*else {
      // Fallback to p5js drawing if spritesheet fails
      push();
      translate(fireball.x - cameraX, fireball.y - cameraY);
      rotate(fireball.angle);
      
      fill(200, 50, 0);
      circle(0, 0, 20);
      fill(255, 150, 0);
      circle(0, 0, 14);
      fill(255, 200, 50);
      circle(0, 0, 8);
      fill(255, 100, 0, 150);
      circle(-8, 0, 6);
      circle(-14, 2, 4);
      circle(-18, -1, 3);
      
      pop();      // Hopefulyl issue is fixed..
    }*/
    
    // Check collision with enemies
    for (let j = 0; j < enemies.length; j++) {
      const enemy = enemies[j];
      if (!enemy || enemy.health <= 0) continue;
      if (fireball.hitEnemies.includes(enemy)) continue; 
      
      const distToFireball = dist(fireball.x, fireball.y, enemy.x, enemy.y);
      if (distToFireball < 20) {
        // Hit enemy
        enemy.health -= fireball.damage;
        damage_Dealt += fireball.damage;
        fireball.hitEnemies.push(enemy);  // Store object reference instead of index
        
        playSound(fireball.impactSound);        
        if (enemy.health <= 0) {
          KillEnemy(j);
        }
        
        // Reduce penetration
        fireball.penetrationRemaining--;
        if (fireball.penetrationRemaining <= 0) {
          // Fireball dissipates
          state.projectiles.splice(i, 1);
          break;
        }
      }
    }
    
    // Check collision with bosses
    for (let b = 0; b < bosses.length; b++) {
      const boss = bosses[b];
      if (!boss.isAlive) continue;
      
      let hitPart = null;
      let closestDist = 20;
      
      // Check center
      const distToCenter = dist(fireball.x, fireball.y, boss.worldX, boss.worldY);
      if (distToCenter < closestDist && boss.center.health > 0) {
        closestDist = distToCenter;
        hitPart = 'center';
      }
      
      // Check left
      const distToLeft = dist(fireball.x, fireball.y, boss.worldX + boss.left.offsetX, boss.worldY);
      if (distToLeft < closestDist && boss.left.health > 0) {
        closestDist = distToLeft;
        hitPart = 'left';
      }
      
      // Check right
      const distToRight = dist(fireball.x, fireball.y, boss.worldX + boss.right.offsetX, boss.worldY);
      if (distToRight < closestDist && boss.right.health > 0) {
        closestDist = distToRight;
        hitPart = 'right';
      }
      
      if (hitPart) {
        boss[hitPart].health -= fireball.damage;
        damage_Dealt += fireball.damage;
        playSound(fireball.impactSound);
        
        fireball.penetrationRemaining--;
        if (fireball.penetrationRemaining <= 0) {
          state.projectiles.splice(i, 1);
          break;
        }
      }
    }
    
    // Remove expired fireballs
    if (fireball.age > fireball.maxLifespan) {
      state.projectiles.splice(i, 1);
    }
  }

  const totalDuration = (powerStats.fireball.fireballCount - 1) * powerStats.fireball.fireballFrames + 100;
  if (state.timer > totalDuration) {
    state.active = false;
    state.projectiles = [];
    state.boltQueue = [];
  }
}

// Power of being really cold suddenly
function TriggerFreeze(stats) {
  if (!activePowers.freeze) {
    activePowers.freeze = { active: false, timer: 0, icebergs: [], boltQueue: [] };
  }
  const state = activePowers.freeze;
  RecalculatePowerStats();
  state.active = true;
  state.timer = 0;
  state.icebergs = [];
  state.boltQueue = [];

  // Queue icebergs to spawn sequentially
  const boltDelay = Math.floor(powerStats.freeze.freezeFrames / stats.freezeCount);
  for (let b = 0; b < stats.freezeCount; b++) {
    let targetX, targetY;
    let validTargets = [];
    
    // Check regular enemies
    if (enemies.length > 0) {
      for (let enemy of enemies) {
        if (enemy.health > 0) {
          const distToEnemy = dist(player_X, player_Y, enemy.x, enemy.y);
          if (distToEnemy < powerStats.freeze.range) {
            validTargets.push({ x: enemy.x, y: enemy.y, type: 'enemy' });
          }
        }
      }
    }
    
    // Check bosses
    if (bosses.length > 0) {
      for (let boss of bosses) {
        if (boss.isAlive) {
          const distToBoss = dist(player_X, player_Y, boss.worldX, boss.worldY);
          if (distToBoss < powerStats.freeze.range) {
            // Center
            validTargets.push({ x: boss.worldX, y: boss.worldY, type: 'boss_center' });
            
            // Left
            if (boss.left.health > 0) {
              validTargets.push({ x: boss.worldX + boss.left.offsetX, y: boss.worldY, type: 'boss_left' });
            }
            
            // Right
            if (boss.right.health > 0) {
              validTargets.push({ x: boss.worldX + boss.right.offsetX, y: boss.worldY, type: 'boss_right' });
            }
          }
        }
      }
    }
    
    if (validTargets.length > 0) {
      const randomTarget = validTargets[Math.floor(Math.random() * validTargets.length)];
      targetX = randomTarget.x;
      targetY = randomTarget.y;
    } else {
      // Fallback
      targetX = player_X + random(-300, 300);
      targetY = player_Y + random(-300, 300);
    }
    
    state.boltQueue.push({
      spawnTime: b * boltDelay,
      spawnX: targetX,
      spawnY: targetY
    });
  }

  playSound('ice');
}

function UpdateFreeze() {
  if (!game_State || game_Paused) return;
  const state = activePowers.freeze;
  if (!state || !state.active) return;

  state.timer++;

  // Spawn queued icebergs
  if (state.boltQueue && state.boltQueue.length > 0) {
    const nextBolt = state.boltQueue[0];
    
    if (state.timer >= nextBolt.spawnTime) {
      state.boltQueue.shift();
      
      // Create iceberg falling from above (similar distance to lightning bolts)
      state.icebergs.push({
        x: nextBolt.spawnX,
        y: nextBolt.spawnY - 300, // Changed from 400 to 300
        targetY: nextBolt.spawnY,
        age: 0,
        fallDuration: 25, // Reduced from 35 to 25 for quicker fall
        maxFrames: 2,
        currentFrame: 0,
        frameTimer: 0,
        frameDelay: 25 / 2,
        hasHit: false,
        damageProcessed: false
      });
    }
  }

  // Update and draw icebergs
  for (let i = state.icebergs.length - 1; i >= 0; i--) {
    const iceberg = state.icebergs[i];
    
    // Update frame animation
    iceberg.frameTimer++;
    if (iceberg.frameTimer >= iceberg.frameDelay) {
      iceberg.currentFrame = (iceberg.currentFrame + 1) % iceberg.maxFrames;
      iceberg.frameTimer = 0;
    }
    
    // Fall animation
    iceberg.age++;
    if (iceberg.age < iceberg.fallDuration) {
      const fallProgress = iceberg.age / iceberg.fallDuration;
      iceberg.y = (iceberg.y - 300) + (iceberg.targetY - (iceberg.y - 300)) * fallProgress;
    } else if (!iceberg.hasHit) {
      iceberg.y = iceberg.targetY;
      iceberg.hasHit = true;
    }
    
    // Draw iceberg from spritesheet
    if (powerSpritesheets.freeze) {
      const spriteSheet = powerSpritesheets.freeze;
      const spriteWidth = spriteSheet.width / iceberg.maxFrames;
      const spriteHeight = spriteSheet.height;
      
      // Scale the iceberg sprite based on the radius modifier
      const radiusScale = (powerStats.freeze.radius || 200) / 200; // 200 is the base radius
      const displaySize = 40 * radiusScale;
      
      push();
      translate(iceberg.x - cameraX, iceberg.y - cameraY);
      imageMode(CENTER);
      image(spriteSheet,
            0, 0,
            displaySize, displaySize,
            iceberg.currentFrame * spriteWidth, 0,
            spriteWidth, spriteHeight);
      pop();
    } else {
      // Fallback for if image doesn't load for whateve reason
      push();
      translate(iceberg.x - cameraX, iceberg.y - cameraY);
      fill(100, 150, 255);
      stroke(150, 200, 255);
      strokeWeight(2);
      circle(0, 0, powerStats.freeze.radius);
      pop();
    }
    
    // Check if iceberg has landed
    if (iceberg.hasHit && !iceberg.damageProcessed) {
      iceberg.damageProcessed = true;
      const radius = powerStats.freeze.radius;
      
      // Play impact sound
      playSound('icecrash');
      
      // Deal damage to enemies in radius
      for (let j = 0; j < enemies.length; j++) {
        const enemy = enemies[j];
        if (!enemy || enemy.health <= 0) continue;
        
        const distToIceberg = dist(enemy.x, enemy.y, iceberg.x, iceberg.y);
        if (distToIceberg < radius) {
          enemy.health -= powerStats.freeze.freezeDamage;
          damage_Dealt += powerStats.freeze.freezeDamage;
          
          if (enemy.health <= 0) {
            KillEnemy(j);
          }
        }
      }

      // Deal damage to bosses in radius
      for (let b = 0; b < bosses.length; b++) {
        const boss = bosses[b];
        if (!boss.isAlive) continue;
        
        const distToBoss = dist(boss.worldX, boss.worldY, iceberg.x, iceberg.y);
        if (distToBoss < radius) {
          boss.center.health -= powerStats.freeze.freezeDamage;
          damage_Dealt += powerStats.freeze.freezeDamage;
        }
      }      
      
      // Spawn ice shards ONLY when damage is first processed
      SpawnFreezeShards(iceberg.x, iceberg.y, powerStats.freeze.shardCount);

      // Create impact ring
      iceberg.impactRing = {
        age: 0,
        maxAge: 15, // 15 frames to expand
        startRadius: 20,
        endRadius: radius
      };      
    }
     // Draw impact ring
    if (iceberg.impactRing && iceberg.impactRing.age < iceberg.impactRing.maxAge) {
      const ring = iceberg.impactRing;
      const progress = ring.age / ring.maxAge;
      const currentRadius = ring.startRadius + (ring.endRadius - ring.startRadius) * progress;
      const alpha = map(progress, 0, 1, 150, 0); // Fade out
      
      push();
      stroke(100, 180, 255, alpha);
      strokeWeight(2);
      noFill();
      circle(iceberg.x - cameraX, iceberg.y - cameraY, currentRadius * 2);
      pop();
      
      ring.age++;
    }
    // Remove iceberg after it's done
    if (iceberg.hasHit && iceberg.age > iceberg.fallDuration + 20) {
      state.icebergs.splice(i, 1);
    }
  }

  const totalDuration = (powerStats.freeze.freezeCount - 1) * powerStats.freeze.freezeFrames + 300;
  if (state.timer > totalDuration) {
    state.active = false;
    state.icebergs = [];
    state.boltQueue = [];
  }
}

function SpawnFreezeShards(x, y, shardCount = 3) {
  const state = activePowers.freeze;
  
  // Initialize shards array if it doesn't exist
  if (!state.shards) {
    state.shards = [];
  }
  
  for (let s = 0; s < shardCount; s++) {
    const angle = random(TWO_PI);
    const speed = 6;
    
    state.shards.push({
      x: x,
      y: y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      age: 0,
      maxLifespan: 250,
      shardSize: 8,
      damageApplied: []
    });
  }
}

// Update ice shards in UpdateFreeze (add this inside the iceberg loop)
// This handles moving and drawing ice shards
function UpdateFreezeShards(state) {
  if (!state.shards) return;
  
  for (let i = state.shards.length - 1; i >= 0; i--) {
    const shard = state.shards[i];
    
    if (shard.age === 0) {
      playSound('iceshard');
      // Store initial position for distance tracking
      shard.startX = shard.x;
      shard.startY = shard.y;
    }
    
    shard.age++;
    
    const rangeBonus = 1 + (powerStats.freeze.shardRange || 0);
    const maxRange = 250 * rangeBonus;
    
    shard.x += shard.vx * rangeBonus;
    shard.y += shard.vy * rangeBonus;
    
    // Draw shard
    push();
    fill(100, 200, 255);
    stroke(150, 220, 255);
    strokeWeight(2);
    
    const size = shard.shardSize;
    const screenX = shard.x - cameraX;
    const screenY = shard.y - cameraY;
    
    beginShape();
    vertex(screenX, screenY - size);
    vertex(screenX + size, screenY);
    vertex(screenX, screenY + size);
    vertex(screenX - size, screenY);
    endShape(CLOSE);
    pop();
    
    // Check damage to enemies
    for (let j = 0; j < enemies.length; j++) {
      const enemy = enemies[j];
      if (!enemy || enemy.health <= 0) continue;
      if (shard.damageApplied.includes(j)) continue;
      
      const distToShard = dist(shard.x, shard.y, enemy.x, enemy.y);
      if (distToShard < 20) {
        enemy.health -= powerStats.freeze.freezeDamage * 0.3;
        damage_Dealt += powerStats.freeze.freezeDamage * 0.3;
        shard.damageApplied.push(j);
        
        if (enemy.health <= 0) {
          KillEnemy(j);
        }
      }
    }
    
    // Check damage to bosses
    for (let b = 0; b < bosses.length; b++) {
      const boss = bosses[b];
      if (!boss || !boss.isAlive) continue;
      
      let hitPart = null;
      let closestDist = 20;
      
      // Check center
      const distToCenter = dist(shard.x, shard.y, boss.worldX, boss.worldY);
      if (distToCenter < closestDist && boss.center.health > 0) {
        closestDist = distToCenter;
        hitPart = 'center';
      }
      
      // Check left
      const distToLeft = dist(shard.x, shard.y, boss.worldX + boss.left.offsetX, boss.worldY);
      if (distToLeft < closestDist && boss.left.health > 0) {
        closestDist = distToLeft;
        hitPart = 'left';
      }
      
      // Check right
      const distToRight = dist(shard.x, shard.y, boss.worldX + boss.right.offsetX, boss.worldY);
      if (distToRight < closestDist && boss.right.health > 0) {
        closestDist = distToRight;
        hitPart = 'right';
      }
      
      if (hitPart) {
        boss[hitPart].health -= powerStats.freeze.freezeDamage * 0.3;
        damage_Dealt += powerStats.freeze.freezeDamage * 0.3;
        shard.damageApplied.push(b);
      }
    }

    // Remove if traveled too far or expired
    const distTraveled = dist(shard.x, shard.y, shard.startX, shard.startY);
    if (distTraveled > maxRange || shard.age > 500) {
      state.shards.splice(i, 1);
    }
  }
}

// Diamond burst power
function TriggerDiamondBurst(stats) {
  if (!activePowers.diamondburst) {
    activePowers.diamondburst = { active: false, timer: 0, projectiles: [] };
  }
  const state = activePowers.diamondburst;
  RecalculatePowerStats();
  state.active = true;
  state.timer = 0;
  state.projectiles = [];

  // Create burst of diamond projectiles radiating from player
  const burstCount = stats.burstCount;
  const angleStep = TWO_PI / burstCount;
  
  for (let i = 0; i < burstCount; i++) {
    const angle = i * angleStep;
    const speed = 8;
    
    state.projectiles.push({
      x: player_X,
      y: player_Y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      angle: angle,
      age: 0,
      maxLifespan: 300,
      currentFrame: 0,
      frameTimer: 0,
      maxFrames: 2,
      frameDelay: 8,
      damage: powerStats.diamondburst.diamondDamage,
      canFork: true,
      canChain: true,
      forkChainCount: 0, 
      maxForkChains: 1,
      hitEnemies: [],
      impactSound: 'diamondbursthit'
    });
  }

  playSound('diamondburst');
}

function UpdateDiamondBurst() {
  if (!game_State || game_Paused) return;
  const state = activePowers.diamondburst;
  if (!state || !state.active) return;

  state.timer++;

  // Update and draw diamond projectiles
  for (let i = state.projectiles.length - 1; i >= 0; i--) {
    const diamond = state.projectiles[i];
    
    // Update animation frame
    diamond.frameTimer++;
    if (diamond.frameTimer >= diamond.frameDelay) {
      diamond.currentFrame = (diamond.currentFrame + 1) % diamond.maxFrames;
      diamond.frameTimer = 0;
    }
    
    // Move projectile
    diamond.age++;
    diamond.x += diamond.vx;
    diamond.y += diamond.vy;
    
    // Draw diamond from spritesheet with rotation
    if (powerSpritesheets.diamondburst) {
      const spriteSheet = powerSpritesheets.diamondburst;
      const spriteWidth = spriteSheet.width / diamond.maxFrames;
      const spriteHeight = spriteSheet.height;
      
      push();
      translate(diamond.x - cameraX, diamond.y - cameraY);
      rotate(diamond.angle);
      imageMode(CENTER);
      image(spriteSheet,
            0, 0,
            30, 30,
            diamond.currentFrame * spriteWidth, 0,
            spriteWidth, spriteHeight);
      pop();
    } else {
      // Fallback to p5js diamond shape
      push();
      translate(diamond.x - cameraX, diamond.y - cameraY);
      rotate(diamond.angle);
      fill(100, 200, 255);
      stroke(150, 220, 255);
      strokeWeight(2);
      
      const size = 8;
      beginShape();
      vertex(0, -size);
      vertex(size, 0);
      vertex(0, size);
      vertex(-size, 0);
      endShape(CLOSE);
      pop();
    }
    
    // Check collision with enemies
    for (let j = 0; j < enemies.length; j++) {
      const enemy = enemies[j];
      if (!enemy || enemy.health <= 0) continue;
      if (diamond.hitEnemies.includes(enemy)) continue;  // Check by object reference
      
      const distToDiamond = dist(diamond.x, diamond.y, enemy.x, enemy.y);
      if (distToDiamond < 20) {
        // Hit enemy
        enemy.health -= diamond.damage;
        damage_Dealt += diamond.damage;
        diamond.hitEnemies.push(enemy);  // Store object reference instead of index
        
        playSound(diamond.impactSound);
        
        if (enemy.health <= 0) {
          KillEnemy(j);
        }
        if (diamond.forkChainCount < diamond.maxForkChains) {
          diamond.forkChainCount++;
          
          // Handle fork effect
          if (diamond.canFork && Math.random() < (powerStats.diamondburst.forkChance || 0)) {
            SpawnForkedDiamonds(diamond, enemy);
          }
          
          // Handle chain effect
          if (diamond.canChain && Math.random() < (powerStats.diamondburst.chainChance || 0)) {
            SpawnChainedDiamond(diamond, enemy, j);
          }
        }
      }
    }
    
    // Check collision with bosses
    for (let b = 0; b < bosses.length; b++) {
      const boss = bosses[b];
      if (!boss || !boss.isAlive) continue;
      
      let hitPart = null;
      let closestDist = 20;
      
      // Check center
      const distToCenter = dist(diamond.x, diamond.y, boss.worldX, boss.worldY);
      if (distToCenter < closestDist && boss.center.health > 0) {
        closestDist = distToCenter;
        hitPart = 'center';
      }
      
      // Check left
      const distToLeft = dist(diamond.x, diamond.y, boss.worldX + boss.left.offsetX, boss.worldY);
      if (distToLeft < closestDist && boss.left.health > 0) {
        closestDist = distToLeft;
        hitPart = 'left';
      }
      
      // Check right
      const distToRight = dist(diamond.x, diamond.y, boss.worldX + boss.right.offsetX, boss.worldY);
      if (distToRight < closestDist && boss.right.health > 0) {
        closestDist = distToRight;
        hitPart = 'right';
      }
      
      if (hitPart) {
        boss[hitPart].health -= diamond.damage;
        damage_Dealt += diamond.damage;
        diamond.hitEnemies.push(boss); 
        
        playSound(diamond.impactSound);         
        if (diamond.forkChainCount < diamond.maxForkChains) {
          diamond.forkChainCount++;
          
          // Handle fork effect
          if (diamond.canFork && Math.random() < (powerStats.diamondburst.forkChance || 0)) {
            SpawnForkedDiamonds(diamond, boss);
          }
          
          // Handle chain effect
          if (diamond.canChain && Math.random() < (powerStats.diamondburst.chainChance || 0)) {
            SpawnChainedDiamond(diamond, boss, boss);  // Pass boss object instead of negative index
          }
        }
      }
    }
    
    // Remove expired diamonds
    if (diamond.age > diamond.maxLifespan) {
      state.projectiles.splice(i, 1);
    }
  }

  const totalDuration = powerStats.diamondburst.diamondFrames + 100;
  if (state.timer > totalDuration) {
    state.active = false;
    state.projectiles = [];
  }
}

  // Lil sporkies
function SpawnForkedDiamonds(sourceDiamond, targetEnemy) {
  const state = activePowers.diamondburst;
  
  // Spawn 2 weaker diamonds in slightly different directions
  for (let f = 0; f < 2; f++) {
    const angleOffset = (f === 0 ? -0.3 : 0.3);
    const newAngle = sourceDiamond.angle + angleOffset;
    const speed = 6; // Slower than original
    
    state.projectiles.push({
      x: targetEnemy.x || targetEnemy.worldX,
      y: targetEnemy.y || targetEnemy.worldY,
      vx: cos(newAngle) * speed,
      vy: sin(newAngle) * speed,
      angle: newAngle,
      age: 0,
      maxLifespan: 250,
      currentFrame: 0,
      frameTimer: 0,
      maxFrames: 2,
      frameDelay: 8,
      damage: sourceDiamond.damage * 0.6, // Weaker forked diamonds
      canFork: false, // Cannot fork again
      canChain: false,
      forkChainCount: 0,
      maxForkChains: 1,
      hitEnemies: [],
      impactSound: 'diamondburstfork'
    });
  }
}  

// 2chainz up'in' hyeurr
function SpawnChainedDiamond(sourceDiamond, sourceEnemy, sourceIndex) {
  const state = activePowers.diamondburst;
  const chainRange = 200;  
  // Find nearby target to chain to
  let validTargets = [];
  
    // Check regular enemies
  for (let k = 0; k < enemies.length; k++) {
    // Skip source enemy if it's a regular enemy
    if (typeof sourceIndex === 'number' && k === sourceIndex) continue;
    if (!enemies[k] || enemies[k].health <= 0) continue;
    const chainDist = dist(sourceEnemy.x || sourceEnemy.worldX, sourceEnemy.y || sourceEnemy.worldY, enemies[k].x, enemies[k].y);
    if (chainDist < chainRange) {
      validTargets.push({ obj: enemies[k], type: 'enemy', index: k });
    }
  }
  
  // Check bosses
  for (let b = 0; b < bosses.length; b++) {
    if (bosses[b] === sourceIndex) continue; // Skip source boss
    
    const boss = bosses[b];
    let hasValidPart = false;
    let closestDist = chainRange;
    let targetX = boss.worldX;
    let targetY = boss.worldY;
    
    // Check center
    const distToCenter = dist(sourceDiamond.x, sourceDiamond.y, boss.worldX, boss.worldY);
    if (distToCenter < closestDist && boss.center.health > 0) {
      closestDist = distToCenter;
      hasValidPart = true;
      targetX = boss.worldX;
      targetY = boss.worldY;
    }
    
    // Check left
    const distToLeft = dist(sourceDiamond.x, sourceDiamond.y, boss.worldX + boss.left.offsetX, boss.worldY);
    if (distToLeft < closestDist && boss.left.health > 0) {
      closestDist = distToLeft;
      hasValidPart = true;
      targetX = boss.worldX + boss.left.offsetX;
      targetY = boss.worldY;
    }
    
    // Check right
    const distToRight = dist(sourceDiamond.x, sourceDiamond.y, boss.worldX + boss.right.offsetX, boss.worldY);
    if (distToRight < closestDist && boss.right.health > 0) {
      closestDist = distToRight;
      hasValidPart = true;
      targetX = boss.worldX + boss.right.offsetX;
      targetY = boss.worldY;
    }
    
    if (hasValidPart) {
      validTargets.push({ obj: boss, type: 'boss', index: b, targetX: targetX, targetY: targetY });
    }
  }

  if (validTargets.length > 0) {
    const target = validTargets[Math.floor(Math.random() * validTargets.length)];
    const targetX = target.targetX || (target.type === 'boss' ? target.obj.worldX : target.obj.x);
    const targetY = target.targetY || (target.type === 'boss' ? target.obj.worldY : target.obj.y);
    
    const chainAngle = atan2(targetY - sourceDiamond.y, targetX - sourceDiamond.x);
    const speed = 8;
    
    state.projectiles.push({
      x: sourceDiamond.x,
      y: sourceDiamond.y,
      vx: cos(chainAngle) * speed,
      vy: sin(chainAngle) * speed,
      angle: chainAngle,
      age: 0,
      maxLifespan: 300,
      currentFrame: 0,
      frameTimer: 0,
      maxFrames: 2,
      frameDelay: 8,
      damage: sourceDiamond.damage,
      canFork: true,
      canChain: false, // Cannot chain again
      forkChainCount: 0,
      maxForkChains: 1,      
      hitEnemies: [],
      impactSound: 'diamondburstchain'
    });
  }
}

// Cyclone power
function TriggerCyclone(stats) {
  if (!activePowers.cyclone) {
    activePowers.cyclone = { active: false, timer: 0, projectiles: [], volleyQueue: [] };
  }
  const state = activePowers.cyclone;
  RecalculatePowerStats();
  state.active = true;
  state.timer = 0;
  state.projectiles = [];
  state.volleyQueue = [];

  // Get direction toward cursor
  let worldMouseX = GetWorldMouseX();
  let worldMouseY = GetWorldMouseY();
  const baseAngle = atan2(worldMouseY - player_Y, worldMouseX - player_X);
  
  const cycloneCount = Math.max(3, powerStats.cyclone.cycloneCount || 3);
  const angleSpacing = TWO_PI / cycloneCount;
  
  // Queue main volley (spawn immediately)
  state.volleyQueue.push({
    spawnTime: 0,
    baseAngle: baseAngle,
    cycloneCount: cycloneCount,
    angleSpacing: angleSpacing,
    opposite: false
  });
  
  // Queue additional volleys from modifier with 30 frame delay between each
  let volleyCount = (powerStats.cyclone.volleyChance || 0);
  for (let volley = 0; volley < Math.floor(volleyCount); volley++) {
    state.volleyQueue.push({
      spawnTime: (volley + 1) * 30,
      baseAngle: baseAngle,
      cycloneCount: cycloneCount,
      angleSpacing: angleSpacing,
      opposite: true
    });
  }
  
  // Chance for an extra partial volley
  if (Math.random() < (volleyCount % 1)) {
    const extraVolley = Math.floor(volleyCount) + 1;
    state.volleyQueue.push({
      spawnTime: extraVolley * 30,
      baseAngle: baseAngle,
      cycloneCount: cycloneCount,
      angleSpacing: angleSpacing,
      opposite: true
    });
  }

  playSound('cyclone');
}


function UpdateCyclone() {
  if (!game_State || game_Paused) return;
    const state = activePowers.cyclone;
    if (!state || !state.active) return;
    state.timer++;

// Process volley queue
  if (state.volleyQueue && state.volleyQueue.length > 0) {
    for (let v = state.volleyQueue.length - 1; v >= 0; v--) {
      const volley = state.volleyQueue[v];
      if (state.timer >= volley.spawnTime) {
        state.volleyQueue.splice(v, 1);
        
        for (let i = 0; i < volley.cycloneCount; i++) {
          const angle = volley.opposite ? 
            volley.baseAngle + PI + (i * volley.angleSpacing) : 
            volley.baseAngle + (i * volley.angleSpacing);
          const speed = 7;
          
          state.projectiles.push({
            x: player_X,
            y: player_Y,
            vx: cos(angle) * speed,
            vy: sin(angle) * speed,
            angle: angle,
            age: 0,
            maxLifespan: 120,
            currentFrame: 0,
            frameTimer: 0,
            maxFrames: 3,
            frameDelay: 12,
            damage: powerStats.cyclone.cycloneDamage,
            penetratesAll: true,
            hitCooldowns: {},
            hitBosses: [],
            impactSound: 'cyclonehit',
            spiralDirection: i % 2 === 0 ? (volley.opposite ? -1 : 1) : (volley.opposite ? 1 : -1)
          });
        }
      }
    }
  }

  // Update and draw cyclone projectiles
  for (let i = state.projectiles.length - 1; i >= 0; i--) {
    const cyclone = state.projectiles[i];
    
    // Update animation frame
    cyclone.frameTimer++;
    if (cyclone.frameTimer >= cyclone.frameDelay) {
      cyclone.currentFrame = (cyclone.currentFrame + 1) % cyclone.maxFrames;
      cyclone.frameTimer = 0;
    }
    
    // Move projectile
    cyclone.age++;
    // Calculate spiral expansion - moves outward over time
    const spiralRadius = (cyclone.age / cyclone.maxLifespan) * 400; // Expands to 400 pixels
    const spiralAngle = cyclone.angle + (cyclone.age * 0.05 * cyclone.spiralDirection);
    
    cyclone.x = player_X + cos(spiralAngle) * spiralRadius;
    cyclone.y = player_Y + sin(spiralAngle) * spiralRadius;
    
     // Draw cyclone from spritesheet with rotation and radius scaling
    if (powerSpritesheets.cyclone) {
      const spriteSheet = powerSpritesheets.cyclone;
      const spriteWidth = spriteSheet.width / cyclone.maxFrames;
      const spriteHeight = spriteSheet.height;
      
      // Scale the cyclone sprite based on the radius modifier
      const radiusScale = (powerStats.cyclone.radius || 20) / 20; // 20 is the base radius
      const displaySize = 35 * radiusScale;
      
      push();
      translate(cyclone.x - cameraX, cyclone.y - cameraY);
      rotate(cyclone.angle);
      imageMode(CENTER);
      image(spriteSheet,
            0, 0,
            displaySize, displaySize,
            cyclone.currentFrame * spriteWidth, 0,
            spriteWidth, spriteHeight);
      pop();
    } else {
      // Fallback to p5js spiral/wind shape
      push();
      translate(cyclone.x - cameraX, cyclone.y - cameraY);
      rotate(cyclone.angle);
      
      stroke(100, 220, 200);
      strokeWeight(2);
      noFill();
      
      // Draw spiral arc
      arc(0, 0, 20, 20, 0, PI, OPEN);
      arc(0, 0, 30, 30, PI, TWO_PI, OPEN);
      
      pop();
    }
    
    // Update cooldowns for this projectile
    for (let enemyObj in cyclone.hitCooldowns) {
      cyclone.hitCooldowns[enemyObj]--;
      if (cyclone.hitCooldowns[enemyObj] <= 0) {
        delete cyclone.hitCooldowns[enemyObj];
      }
    }
    
    // Check collision with enemies (penetrates all, with per-target cooldown)
    for (let j = 0; j < enemies.length; j++) {
      const enemy = enemies[j];
      if (!enemy || enemy.health <= 0) continue;
      
      const distToCyclone = dist(cyclone.x, cyclone.y, enemy.x, enemy.y);
      if (distToCyclone < 20) {
        // Check if cooldown is active for this enemy
        const enemyId = enemies.indexOf(enemy);
        if (cyclone.hitCooldowns[enemyId] && cyclone.hitCooldowns[enemyId] > 0) continue;
        
        // Hit enemy
        enemy.health -= cyclone.damage;
        damage_Dealt += cyclone.damage;
        cyclone.hitCooldowns[enemyId] = 20;  // 20 frame cooldown before hitting again
        
        playSound(cyclone.impactSound);
        
        if (enemy.health <= 0) {
          KillEnemy(j);
        }
      }
    }
    
    // Check collision with bosses (penetrates all)
    for (let b = 0; b < bosses.length; b++) {
      const boss = bosses[b];
      if (!boss.isAlive) continue;
      
      let hitPart = null;
      let closestDist = 20;
      
      // Check center
      const distToCenter = dist(cyclone.x, cyclone.y, boss.worldX, boss.worldY);
      if (distToCenter < closestDist && boss.center.health > 0) {
        closestDist = distToCenter;
        hitPart = 'center';
      }
      
      // Check left
      const distToLeft = dist(cyclone.x, cyclone.y, boss.worldX + boss.left.offsetX, boss.worldY);
      if (distToLeft < closestDist && boss.left.health > 0) {
        closestDist = distToLeft;
        hitPart = 'left';
      }
      
      // Check right
      const distToRight = dist(cyclone.x, cyclone.y, boss.worldX + boss.right.offsetX, boss.worldY);
      if (distToRight < closestDist && boss.right.health > 0) {
        closestDist = distToRight;
        hitPart = 'right';
      }
      
      if (hitPart) {
        boss[hitPart].health -= cyclone.damage;
        damage_Dealt += cyclone.damage;
        
        playSound(cyclone.impactSound);
      }
    }
        
    // Remove expired cyclones
    if (cyclone.age > cyclone.maxLifespan) {
      state.projectiles.splice(i, 1);
    }
  }

  const totalDuration = powerStats.cyclone.cycloneFrames + 100;
  if (state.timer > totalDuration) {
    state.active = false;
    state.projectiles = [];
  }
}
// more power go here






// more power go here

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
  
  if (Level === 1) {
    for (let powerName in powerLevelDefs) {
      if (!unlockedPowers.includes(powerName)) {
        choices.push({ type: 'power', name: powerName });
      }
    }
  } else {
    for (let powerName of unlockedPowers) {
      if ((powerLevels[powerName] || 1) < 5) {
        choices.push({ type: 'power', name: powerName });
      }
    }
    
    if (unlockedPowers.length < maxPowers) {
      for (let powerName in powerLevelDefs) {
        if (!unlockedPowers.includes(powerName)) {
          choices.push({ type: 'power', name: powerName });
        }
      }
    }
    
    for (let modifierName in powerModifierDefs) {
      const modDef = powerModifierDefs[modifierName];
      const hasRequiredPower = unlockedPowers.includes(modDef.appliesToPower);
      const canLevelUp = (powerModifiers[modifierName] || 0) < modDef.maxRank;
      
      if (hasRequiredPower && canLevelUp && Object.keys(powerModifiers).length < maxModifiers) {
        choices.push({ type: 'modifier', name: modifierName });
      }
    }
  }
  
  return Shuffle(choices).slice(0, 4);
}

function UnlockPowerChoice(choice) {
  if (choice.type === 'power') {
    if (!unlockedPowers.includes(choice.name)) {
      unlockedPowers.push(choice.name);
      powerLevels[choice.name] = 1;
      UnlockPower(choice.name);
      ApplyPowerLevel(choice.name, 1);
      TriggerPower(choice.name);
      console.log("Unlocked and activated power:", choice.name);
    } else {
      const newLevel = Math.min(5, (powerLevels[choice.name] || 1) + 1);
      powerLevels[choice.name] = newLevel;
      ApplyPowerLevel(choice.name, newLevel);
      TriggerPower(choice.name);
      console.log("Leveled up power:", choice.name, "to level", newLevel);
    }
    } else if (choice.type === 'modifier') {
      powerModifiers[choice.name] = (powerModifiers[choice.name] || 0) + 1;
      console.log("Leveled modifier:", choice.name, "to rank", powerModifiers[choice.name]);
      console.log("Modifier effect value:", GetModifierEffect(choice.name));
      RecalculatePowerStats();
      console.log("Updated power stats:", powerStats);
    }
}


// ===== POWER LEVEL APPLICATION =====

function ApplyPowerLevel(powerName, level) {
  if (!powerLevelDefs[powerName] || !powerLevelDefs[powerName][level]) {
    return;
  }

  const levelData = powerLevelDefs[powerName][level];

  if (!powerStats[powerName]) powerStats[powerName] = {};
  for (let stat in levelData) {
    powerStats[powerName][stat] = levelData[stat];
    if (abilityStats[powerName]) {
      abilityStats[powerName][stat] = levelData[stat];
    }
  }
  console.log("Applied ${powerName} level ${level}:", levelData);
}

// ===== POWER STAT CALCULATION =====

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
  for (let powerName of unlockedPowers) {
    const level = powerLevels[powerName] || 1;
    ApplyPowerLevel(powerName, level);
    
    // Apply generic modifiers
    let damageMult = 1 + (GetModifierEffect('powersDamage') || 0);
    let diameterMult = 1 + (GetModifierEffect('powersDiameter') || 0);
    let cooldownReduction = GetModifierEffect('powersCooldown') || 0;
    let projectileBonus = GetModifierEffect('powersCount') || 0;
    let durationMult = 1 + (GetModifierEffect('powersDuration') || 0);
    
    // Apply damage multiplier to all damage types
    if (powerStats[powerName].boltDamage) {
      powerStats[powerName].boltDamage *= damageMult;
    }
    if (powerStats[powerName].sngularityDamage) {
      powerStats[powerName].sngularityDamage *= damageMult;
    }
    if (powerStats[powerName].fireballDamage) {
      powerStats[powerName].fireballDamage *= damageMult;
    }
    if (powerStats[powerName].freezeDamage) {
      powerStats[powerName].freezeDamage *= damageMult;
    }
    if (powerStats[powerName].diamondDamage) {
      powerStats[powerName].diamondDamage *= damageMult;
    }
    if (powerStats[powerName].cycloneDamage) {
      powerStats[powerName].cycloneDamage *= damageMult;
    }
    if (powerStats[powerName].damagePerEnemy) {
      powerStats[powerName].damagePerEnemy *= damageMult;
    }   
    
    // Apply diameter/radius multiplier
    if (powerStats[powerName].radius) {
      powerStats[powerName].radius *= diameterMult;
    }
    
    // Apply cooldown reduction
    if (powerStats[powerName].cooldown) {
      powerStats[powerName].cooldown *= (1 - cooldownReduction);
    }
    
    // Apply projectile count bonus
    if (powerStats[powerName].boltCount) {
      powerStats[powerName].boltCount += projectileBonus;
    }
    if (powerStats[powerName].fireballCount) {
      powerStats[powerName].fireballCount += projectileBonus;
    }
    if (powerStats[powerName].freezeCount) {
      powerStats[powerName].freezeCount += projectileBonus;
    }
    if (powerStats[powerName].burstCount) {
      powerStats[powerName].burstCount += projectileBonus;
    }
    if (powerStats[powerName].cycloneCount) {
      powerStats[powerName].cycloneCount += projectileBonus;
    }
    
    // Apply duration multiplier to all frame-based durations
    if (powerStats[powerName].duration) {
      powerStats[powerName].duration *= durationMult;
    }
   // if (powerStats[powerName].boltFrames) {
   //   powerStats[powerName].boltFrames *= durationMult;
   // }
    if (powerStats[powerName].fireballFrames) {
      powerStats[powerName].fireballFrames *= durationMult;
    }
   // if (powerStats[powerName].freezeFrames) {
   //   powerStats[powerName].freezeFrames *= durationMult;
   // }
    if (powerStats[powerName].cycloneFrames) {
      powerStats[powerName].cycloneFrames *= durationMult;
    }
    if (powerStats[powerName].diamondFrames) {
      powerStats[powerName].diamondFrames *= durationMult;
    }
    
    // Power-specific modifiers
    if (powerName === 'lightningbolt') {
      powerStats[powerName].boltEchoChance = GetModifierEffect('boltEcho') || 0;
      powerStats[powerName].boltChainChance = GetModifierEffect('boltChain') || 0;
      powerStats[powerName].boltCount += GetModifierEffect('boltCount') || 0;
    }
    
    if (powerName === 'singularity') {
      let pullBonus = GetModifierEffect('singularityPull') || 0;
      let densityBonus = GetModifierEffect('singularityDensity') || 0;
      let sizeBonus = GetModifierEffect('singularitySize') || 0;
      
      powerStats[powerName].radius += pullBonus; // radii increaser
      powerStats[powerName].damagePerEnemy += densityBonus;
      powerStats[powerName].radius += sizeBonus; // also increases the rady eye
    }
    
    if (powerName === 'fireball') {
      powerStats[powerName].fireballPenetration = (powerStats[powerName].fireballPenetration || 0) + (GetModifierEffect('fireballPenetration') || 0);
      powerStats[powerName].fireballCount += (GetModifierEffect('fireballCount') || 0);  
    }
    
    if (powerName === 'freeze') {
      powerStats[powerName].shardRange = GetModifierEffect('freezeShards') || 0;
      powerStats[powerName].freezeCount += GetModifierEffect('freezeCount') || 0;
    }
    
    if (powerName === 'diamondburst') {
      powerStats[powerName].forkChance = GetModifierEffect('diamondFork') || 0;
      powerStats[powerName].chainChance = GetModifierEffect('diamondChain') || 0;
    }
    
    if (powerName === 'cyclone') {
      powerStats[powerName].volleyChance = GetModifierEffect('cycloneVolley') || 0;
      powerStats[powerName].cycloneDouble = GetModifierEffect('cycloneDouble') || 0;
    }
  }  
  console.log("Power stats recalculated:", powerStats);
}

function GetPowerLevelStats(powerName, level) {
  const levels = powerLevelDefs[powerName];
  if (!levels) return null;

  const safe = (lvl) => Math.max(1, Math.min(lvl, Object.keys(levels).length));

  return {
    current: levels[safe(level)],
    next: levels[safe(level + 1)]
  };
}

// ==++ -- POWER CHOICE DIALOG SYSTEM -- ++== \\
// Separate from powerups - displays when you level up and get to choose a power or modifier

var powerChoiceQueue = [];
var activePowerChoiceDialog = null;
var powerChoiceHovered = null;

var powerImages = {};  // { lightningbolt: imageObject, singularity: imageObject, ... }

// ===== LOAD POWER IMAGES ON DEMAND =====
function GetPowerImage(powerName) {
  if (!powerImages[powerName]) {
    try {
      powerImages[powerName] = loadImage(`../Images/power_${powerName}.gif`);
    } catch (e) {
      console.warn("Failed to load power image:", powerName);
      return null;
    }
  }
  return powerImages[powerName];
}

// ===== QUEUE POWER CHOICES =====

function QueuePowerChoices() {
  const choices = GetAvailablePowerChoices();
  powerChoiceQueue.push(choices);
  
  if (!activePowerChoiceDialog) {
    ShowNextPowerChoiceDialog();
  }
}

function ShowNextPowerChoiceDialog() {
  if (powerChoiceQueue.length === 0) {
    TryResumeGame();
    activePowerChoiceDialog = null;
    return;
  }
  
  const choices = powerChoiceQueue.shift();
  activePowerChoiceDialog = {
    choices: choices,
    selected: false
  };
  
  game_Paused = true;
  game_State = false;
  
  // Enable click protection when dialog opens
  dialogClickProtection = true;
  dialogClickProtectionTimer = DIALOG_CLICK_PROTECTION_DELAY;
}

// ===== DRAW POWER CHOICE DIALOG =====
function DrawPowerChoiceDialog() {
  if (!activePowerChoiceDialog) return;

  // --- CLICK PROTECTION ---
  if (dialogClickProtection && dialogClickProtectionTimer > 0) {
    dialogClickProtectionTimer--;
    if (dialogClickProtectionTimer <= 0) dialogClickProtection = false;
  }

  // --- DIALOG DIMENSIONS ---
  const dialogWidth = 1000;
  const dialogHeight = 450;
  const dialogX = width / 2 - dialogWidth / 2;
  const dialogY = height / 2 - dialogHeight / 2;

  // --- BACKGROUND FADE ---
  push();
  resetMatrix();
  fill(0, 0, 0, 150);
  noStroke();
  rect(0, 0, width, height);
  pop();

  // --- DIALOG FRAME ---
  push();
  fill(40, 40, 80);
  stroke(150, 150, 200);
  strokeWeight(2);
  rect(dialogX, dialogY, dialogWidth, dialogHeight, 10);
  pop();

  // --- TITLE WITH PULSE ---
  powerChoicePulseAlpha += powerChoicePulseDir * 3;
  if (powerChoicePulseAlpha >= 255) {
    powerChoicePulseAlpha = 255;
    powerChoicePulseDir = -1;
  } else if (powerChoicePulseAlpha <= 0) {
    powerChoicePulseAlpha = 0;
    powerChoicePulseDir = 1;
  }
  
  push();
  textAlign(CENTER, TOP);
  textSize(36);
  stroke(255, 200, 100);
  strokeWeight(3);
  fill(0, 200, 100, powerChoicePulseAlpha);
  text("Choose Your Power", width / 2, dialogY + 15);
  pop();

  // --- CARD LAYOUT ---
  const cardWidth = 240;
  const cardHeight = 350;
  const cardSpacing = 18;
  const totalWidth = cardWidth * 4 + cardSpacing * 3;
  const startX = width / 2 - totalWidth / 2;
  const startY = dialogY + 60;

  // --- DRAW CARDS ---
  activePowerChoiceDialog.choices.forEach((choice, i) => {
    const cardX = startX + i * (cardWidth + cardSpacing);
    const cardY = startY;

    // --- HOVER CHECK ---
    const hovered = (mouseX > cardX && mouseX < cardX + cardWidth &&
                     mouseY > cardY && mouseY < cardY + cardHeight);
    if (hovered) powerChoiceHovered = i;

    // --- CARD BACKGROUND ---
    push();
    if (hovered) {
      fill(85, 105, 155);
      stroke(210, 210, 255);
      strokeWeight(3);
    } else {
      fill(60, 70, 120);
      stroke(150, 150, 180);
      strokeWeight(2);
    }
    rect(cardX, cardY, cardWidth, cardHeight, 10);
    pop();

    // --- TOP IMAGE ---
    const imgSize = 40;
    const imgX = cardX + cardWidth / 2 - imgSize / 2;
    const imgY = cardY + 12;
    let img = null;
    if (choice.type === "power") img = GetPowerImage(choice.name);

    if (img) {
      image(img, imgX, imgY, imgSize, imgSize);
    } else {
      push();
      fill(180);
      rect(imgX, imgY, imgSize, imgSize, 6);
      pop();
    }

    // --- TEXT BLOCK ---
    const padX = cardX + 12;
    let y = imgY + imgSize + 10;
    push();
    resetMatrix();
    noStroke();
    textAlign(LEFT, TOP);

    // --- POWER / MODIFIER NAME ---
    fill(255);
    textSize(20);
    textStyle(BOLD);
    let displayName = choice.type === "power" ?
      choice.name.charAt(0).toUpperCase() + choice.name.slice(1) :
      powerModifierDefs[choice.name].name;
    text(displayName, padX, y);
    y += 24;

    // --- LEVEL LINE ---
    textSize(16);
    textStyle(NORMAL);
    const level = choice.type === "power" ? (powerLevels[choice.name] || 0) : (powerModifiers[choice.name] || 0);
    if (choice.type === "power") {
      text(level > 0 ? "Level: " + level : "Level: Not yet unlocked", padX, y);
    } else {
      text("Rank: " + level, padX, y);
    }
    y += 22;

    // --- DESCRIPTION ---
    fill(220);
    textSize(16);
    textStyle(NORMAL);
    let desc = "";
    if (choice.type === "power") {
      desc = powerDescriptions[choice.name] || "No description available.";
    } else {
      desc = powerModifierDefs[choice.name].description || "No description available.";
    }

    const maxW = cardWidth - 24;
    const words = desc.split(" ");
    let line = "";
    const lh = 20;

    for (let w of words) {
      const test = line + (line ? " " : "") + w;
      if (textWidth(test) > maxW) {
        text(line, padX, y);
        y += lh;
        line = w;
      } else {
        line = test;
      }
    }
    if (line) {
      text(line, padX, y);
      y += lh;
    }

    // --- POWER STATS ---
    if (choice.type === "power") {
      const unlocked = powerLevels[choice.name] > 0;
      const stats = GetPowerLevelStats(choice.name, Math.max(1, powerLevels[choice.name] || 1));

      if (stats) {
        y += 6;
        fill(120, 200, 255);
        textSize(18);
        textStyle(BOLD);
        text(unlocked ? "Stats (Next Level):" : "Base Stats:", padX, y);
        y += 22;

        fill(220);
        textSize(16);
        textStyle(NORMAL);
        for (let [key, value] of Object.entries(stats.current)) {
          const nextValue = unlocked ? stats.next[key] : undefined;
          const label = key.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());
          let line = `${label}: ${value}`;
          if (nextValue !== undefined && nextValue !== value) line += ` → ${nextValue}`;
          text(line, padX, y);
          y += 18;
        }
      }
    }

    // --- MODIFIER EFFECTS ---
    if (choice.type === "modifier") {
      const mod = powerModifierDefs[choice.name];
      const rank = powerModifiers[choice.name] || 0;
      const curr = mod.applyModifier(rank);
      const next = mod.applyModifier(rank + 1);
      const effectY = cardY + cardHeight - 65;

      fill(120, 200, 255);
      textSize(18);
      textStyle(BOLD);
      text("Effect:", padX, effectY);

      fill(200);
      textSize(16);
      textStyle(NORMAL);
      text(`Current: ${curr.toFixed(2)}`, padX, effectY + 20);

      fill(170, 250, 140);
      text(`Next: ${next.toFixed(2)}`, padX, effectY + 38);
    }

    pop();

    // --- Click handler
    if (!dialogClickProtection && hovered && mouseIsPressed && 
        !activePowerupDialog && !activeSupportDialog) {
      UnlockPowerChoice(choice);
      activePowerChoiceDialog = null;
      ShowNextPowerChoiceDialog();
      powerChoiceHovered = null;
      dialogClickConsumed = true;
    }

  });  

  // - 
  if (dialogClickProtection) {
    push();
    fill(200, 200, 100, 180);
    textSize(18);
    textAlign(CENTER);
    text("Wait to select...", width / 2, dialogY + dialogHeight - 20);
    pop();
  }
}

// ===== STAGE RESET =====
function ResetStagePowers() {
  console.log("Resetting stage powers and modifiers");
  unlockedPowers = [];
  powerLevels = {};
  powerModifiers = {};
  ResetAllPowers(); // From powers.js
}
