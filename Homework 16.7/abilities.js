// ==++ -- Abilities -- ++== \\

// Ability stuff 
var ability_Cooldown = 600;
var abilities = [];
var currentAbilityIndex = 0;
var abilityOnCooldown = false;
var abilityCooldownTimer = 0;

// Bomb
var bombExplosions = [];
var bombDuration = 40;
var bombMaxRadius = 260;
var bombDamage = 150;

// Barrage ability properties
var barrageShotsRemaining = 0;
var barrageTimer = 0;
var barrageActive = false;
const barrageRange = 800;

// Decimator Shot
var decimatorShotsRemaining = 0;
var decimatorTimer = 0;
var decimatorActive = false;

// Spiral Shot
var spiralShotsRemaining = 0;
var spiralTimer = 0;
var spiralAngle = 0;

const shipAbilities = {
  Shield: { cooldown: 800, timer: 0, onCooldown: false, effect: UseShieldAbility },
  Fox: { cooldown: 900, timer: 0, onCooldown: false, effect: () => UseShipAbility("Fox") },
  Cygnus: { cooldown: 900, timer: 0, onCooldown: false, effect: () => UseShipAbility("Cygnus") },
  Imperial: { cooldown: 1200, timer: 0, onCooldown: false, effect: () => UseShipAbility("Imperial") },
  Jackhammer: { cooldown: 1000, timer: 0, onCooldown: false, effect: () => UseShipAbility("Jackhammer") },
};

// Use to activate Shield ability
function UseShieldAbility() {
  const shield = shipAbilities.Shield;
  if (!shield) return console.error("Shield ability not found");

  if (shield.onCooldown) {
    console.log("Shield on cooldown!");
    return;
  }

  // Effect: for Shield, mark player immune and play sound
  immune = true;
  hit_Timer = 135;
  playSound('barrier');

  // Set cooldown
  shield.onCooldown = true;
  shield.timer = shield.cooldown * (1 - cooldown_Reduction / 100);

  console.log("Shield ability used! Cooldown:", shield.timer);
}

// Used to activate the inherent ship ability
function ActivateShipAbility(name) {
  const ability = shipAbilities[name];
  if (!ability) return console.error("Ability not found:", name);

  if (ability.onCooldown) {
    console.log(`${name} is on cooldown!`);
    return;
  }

  ability.effect(); // run the effect function
  ability.onCooldown = true;
  ability.timer = ability.cooldown * (1 - cooldown_Reduction / 100);
}

// Ability lookup for ship ability
const shipAbilityMap = {
  "Fox": "rapidfirebarrage",
  "Cygnus": "spiralshot",
  "Imperial": "decimator",
  "Jackhammer": "bomb"
};

function UpdateShipAbilityCooldowns() {
  for (let name in shipAbilities) {
    const ability = shipAbilities[name];
    if (ability.onCooldown) {
      ability.timer--;
      if (ability.timer <= 0) {
        ability.onCooldown = false;
        ability.timer = 0;
      }
    }
  }
}

// -- Ability functions 
// Used to draw out the boom boom
function DrawBombExplosions() {
  for (let i = bombExplosions.length - 1; i >= 0; i--) {
    let explosion = bombExplosions[i]; 
   
    explosion.age++;
    explosion.currentRadius = (explosion.age / explosion.duration) * explosion.maxRadius;
    let alpha = map(explosion.age, 0, explosion.duration, 255, 0);
    
    let ringCount = 8;
    for (let ring = 0; ring < ringCount; ring++) {
      let ringRadius = explosion.currentRadius - (ring * 80);
      if (ringRadius > 0) {
        strokeWeight(6);
        stroke(255, 100 + ring * 30, 0, alpha);
        noFill();
        circle(explosion.x, explosion.y, ringRadius * 2);
      }
    }
    
    if (explosion.age >= explosion.duration) {
      bombExplosions.splice(i, 1);
    }
  }
}

// Rapidfire barrage ability
function UpdateBarrage() {
  if (barrageShotsRemaining <= 0 || !game_State || game_Screen !== "playing") {
    return;
  }
  
  if (!barrageActive) {
    return;
  }   // double decker checker for less bugginess
  barrageTimer++; 
  
  if (barrageTimer >= 6) {
    let target = GetNearestEnemy(player_X, player_Y, enemies);
    let baseAngle;
    
    if (target) {
      let enemy = enemies[target.index];
      baseAngle = Math.atan2(enemy.y - player_Y, enemy.x - player_X);
    } else {
      let worldMouseX = GetWorldMouseX();
      let worldMouseY = GetWorldMouseY();
      baseAngle = Math.atan2(worldMouseY - player_Y, worldMouseX - player_X);
    }    
    let spread = (Math.random() * 8 - 4) * Math.PI / 180;
    
    AddShots(player_X, player_Y, [baseAngle + spread], [shot_Speed], [shot_Diameter], 0, shot_Penetration);
    playSound('shotfullauto');
    
    barrageShotsRemaining--;
    barrageTimer = 0;
  }
}

// Decimator ability 
function UpdateDecimator() {
  if (!game_State || game_Screen !== "playing") {
    return;
  }
  
  if (decimatorShotsRemaining > 0) {
    if (!decimatorActive) {
      shot_Penetration += 2;
      decimatorActive = true; 
    }
    decimatorTimer++;
    if (decimatorTimer >= 16) {
      playSound('abilitydecimator');
      let worldMouseX = GetWorldMouseX();
      let worldMouseY = GetWorldMouseY();
      let baseAngle = atan2(worldMouseY - player_Y, worldMouseX - player_X);
      let burstCount = 4 + shot_Count * 2;
      let angles = [];
      let diameters = Array(burstCount).fill(shot_Diameter * .75);
      let decimatorDamage = shot_Power * abilityStats.decimator.damageMultiplier;

      for (let s = 0; s < burstCount; s++) {
        let spread = (Math.floor(Math.random() * 2 + shot_Count) + 10);
        let angleOffset = burstCount > 1 ? map(s, 0, burstCount, -spread, spread) * PI / 180 : 0;
        angles.push(baseAngle + angleOffset);
      }
      AddShots(player_X, player_Y, angles, Array(burstCount).fill(shot_Speed), diameters, 0, shot_Penetration, Array(burstCount).fill(decimatorDamage));
      decimatorShotsRemaining--;
      decimatorTimer = 0;
    }
  }
  else if (decimatorActive) {
    shot_Penetration -= 2;
    decimatorActive = false;
  }
}

// Spiral shot ability
function UpdateSpiral() {
  if (!game_State || game_Screen !== "playing") {
    return;
  }
  
  if (spiralShotsRemaining > 0) {
    spiralTimer++;
    if (spiralTimer >= 4) {
      let angleIncrement = TWO_PI / (30 + shot_Count);
      let cwAngle = spiralAngle;
      AddShots(player_X, player_Y, [cwAngle], [shot_Speed], [shot_Diameter], 0, shot_Penetration);

      let ccwAngle = -spiralAngle + PI;
      AddShots(player_X, player_Y, [ccwAngle], [shot_Speed], [shot_Diameter], 0, shot_Penetration);

      playSound('shotfullauto');

      spiralAngle += angleIncrement;
      spiralShotsRemaining--;
      spiralTimer = 0;
    }
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

// Creates the visual of the black hole
function UpdateSingularity() {
  if (!singularityActive || !game_State || game_Screen !== "playing") {
    return;
  }
  
  singularityTimer++;

  if (singularityTimer >= singularityDuration) {
    DealSingularityDamage();
    singularityActive = false;
    singularityCaughtEnemies = [];
    return;
  }

  // Draw singularity visual with camera offset rather than according to mousex/y
  push();
  translate(-cameraX, -cameraY);
  
  let pulseAmount = sin(singularityTimer / 20) * 10;

  fill(20, 20, 30);
  stroke(100, 200, 255);
  strokeWeight(2);
  circle(singularityX, singularityY, singularityRadius * 2 - pulseAmount);

  noFill();
  stroke(0, 150, 255, 150);
  strokeWeight(3);
  circle(singularityX, singularityY, singularityRadius * 2 + pulseAmount);

  stroke(50, 200, 255, 100);
  strokeWeight(1);
  circle(singularityX, singularityY, singularityRadius * 2.2);

  DrawSingularityLightning(8);
  pop();  
  noStroke();

  // Pulls in enemies
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (enemy.type === "chip") continue; // obstacles not affected such as our boy chip or bosses

    let distToSingularity = dist(enemy.x, enemy.y, singularityX, singularityY);

    if (distToSingularity < singularityRadius * 1.4) {
      if (!singularityCaughtEnemies.includes(i)) singularityCaughtEnemies.push(i);

      let angle = atan2(singularityY - enemy.y, singularityX - enemy.x);
      let pullStrength = map(distToSingularity, singularityRadius * 4, 0, 0.5, 3);

      enemy.x += cos(angle) * pullStrength;
      enemy.y += sin(angle) * pullStrength;
    }
  }
}

// Ability Functions
function UnlockAbility(abilityName) {     // Call when unlocking ability
  if (abilities.length < 13 && !abilities.includes(abilityName)) { // DONT FORGET TO CHANGE <13 BACK TO <4 !!!!
    abilities.push(abilityName);
    console.log("Unlocked ability: " + abilityName);
  } else if (abilities.length >= 16) { // DONT FORGET TO PUT 16 BACK TO 4!! ( Spoiler: i will forget)
    console.log("Already have 4 abilities!");
  }
}

// deprecated need to remove this if all works out
function UpdateAbilityCooldowns() {
  if (shieldAbilityCooldownTimer > 0) {
    shieldAbilityCooldownTimer--;
  } else {
    shieldAbilityOnCooldown = false;
  }
  
  if (shipAbilityCooldownTimer > 0) {
    shipAbilityCooldownTimer--;
  } else {
    shipAbilityOnCooldown = false;
  }
}

function UpdateAbilityCooldown() {
  if (abilityOnCooldown) {
    abilityCooldownTimer--;
    if (abilityCooldownTimer <= 0) {
      abilityOnCooldown = false;
    }
  }
}

// resets ability stuff
function ResetAbilityCooldownSystem() {
  shieldAbilityCooldownTimer = 0;
  shieldAbilityOnCooldown = false;
  
  shipAbilityCooldownTimer = 0;
  shipAbilityOnCooldown = false;
  
  console.log("Ability cooldown system reset");
}

function ResetAllAbilities() {
  console.log("ResetAllAbilities called.");
  
  // Reset ability stats to base values
  InitializeAbilityStats();
  InitializePowerStats();
  
  // Barrage
  barrageActive = false;
  barrageShotsRemaining = 0;
  barrageTimer = 0;
  
  // Decimator
  decimatorActive = false;
  decimatorShotsRemaining = 0;
  decimatorTimer = 0;
  
  // Spiral
  spiralActive = false;
  spiralShotsRemaining = 0;
  spiralTimer = 0;
  spiralAngle = 0;  

  // Full auto
  fullAutoActive = false;
  fullAutoTimer = 0;
  fullAutoShotsFired = 0;
  burstCooldownTimer = 0;
  
  // Support unit states
  bit_CooldownTimer = [];
  bit_Angle = [];
  blaster_BurstActive = [];
  blaster_BurstTimer = [];
  blaster_ShotsFired = [];
  cannon_CooldownTimer = [];
  cannon_Side = [];
  
  // Reset ability cooldowns
  ResetAbilityCooldownSystem();
  
  // Reset powers
  activePowers = [];
  for (let powerName in powerCooldownTimer) {
    powerCooldownTimer[powerName] = 0;
    powerOnCooldown[powerName] = false;
  }
  
  console.log("ResetAllAbilities completed");
}

// sets stats to their base values
function InitializeAbilityStats() {
  for (let abilityName in abilityBaseStats) {
    abilityStats[abilityName] = { ...abilityBaseStats[abilityName] };
  }
  console.log("Ability stats initialized:", abilityStats);
}
// modifies the abilities
function ModifyAbilityStat(abilityName, statName, value, isMultiplier = false) {
  if (!abilityStats[abilityName]) {
    console.error("Ability not found:", abilityName);
    return;
  }
  
  if (!abilityStats[abilityName][statName]) {
    console.error("Stat not found:", statName, "for ability:", abilityName);
    return;
  }
  
  if (isMultiplier) {
    abilityStats[abilityName][statName] *= value;
  } else {
    abilityStats[abilityName][statName] += value;
  }
  
  console.log(`Modified ${abilityName}.${statName} to:`, abilityStats[abilityName][statName]);
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
    game_Paused = false;
    game_State = true;
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
  const dialogWidth = 900;
  const dialogHeight = 420;
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

  // --- TITLE ---
  push();
  fill(255, 200, 100);
  textSize(28);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("Choose Your Power", width / 2, dialogY + 15);
  pop();

  // --- CARD LAYOUT ---
  const cardWidth = 200;
  const cardHeight = 330;
  const cardSpacing = 20;
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
      // Use description from powerDescriptions object
      desc = powerDescriptions[choice.name] || "No description available.";
    } else {
      desc = powerModifierDefs[choice.name].description;
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

    // --- CLICK HANDLER ---
    if (!dialogClickProtection && hovered && mouseIsPressed) {
      UnlockPowerChoice(choice);
      activePowerChoiceDialog = null;
      ShowNextPowerChoiceDialog();
      powerChoiceHovered = null;
    }
  });

  // --- CLICK PROTECTION NOTICE ---
  if (dialogClickProtection) {
    push();
    fill(200, 200, 100, 180);
    textSize(18);
    textAlign(CENTER);
    text("Click to select…", width / 2, dialogY + dialogHeight - 20);
    pop();
  }
}