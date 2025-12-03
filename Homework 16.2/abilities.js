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
var bombDamage = 20;

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

// LIGHTNING BOLT LIGHTNING BOLT LIGHTNING BOLT 
var activeBolts = [];
var boltActive = false;
var boltTimer = 0;
var boltDuration = 40;
let boltHitEnemies = [];

var boltDamage = 14;
var boltCountModifier = 0;
var boltEchoChance = 0;

// Singularity
var singularityActive = false;
var singularityTimer;
var singularityDuration = 100;
var singularityX = 0;
var singularityY = 0;
var singularityRadius = 150;  // 150 radius
let singularityCaughtEnemies = [];

const abilityList = {
  bomb: {
    name: "Bomb",
    cooldown: 1000,  // frames of time
    effect: () => {
      damageCount = 0;
      console.log("BOMB ACTIVATED!");
      playSound('bomb');      
      const bombStats = abilityStats.bomb;
      
      bombExplosions.push({
        x: player_X,
        y: player_Y,
        maxRadius: bombStats.radius,
        currentRadius: 0,
        duration: bombStats.duration,
        age: 0
      });
      
      DamageEnemiesInRadius(bombStats.radius, bombStats.damage);
      console.log("Bomb dealt " + damageCount + " damage!");
    }
  },
  shield: {
    name: "Shield",
    cooldown: 800,
    effect: () => {
      console.log("SHIELD ACTIVATED!");
      playSound('barrier');
      immune = true;
      hit_Timer = 135;
    }
  },
  flash: {
    name: "Flash",  // currently disabled cuz it causes wack shti to happen and idk how to fix it
    cooldown: 400,
    effect: () => {
      console.log("AYAYA GO FAST");
      playSound('flash');

      let newX = GetWorldMouseX();
      let newY = GetWorldMouseY();
      let angle = atan2(newY - player_Y, newX - player_X);

      player_X += cos(angle) * 300;
      player_Y += sin(angle) * 300;

      cameraX = player_X - width / 2;
      cameraY = player_Y - height / 2;
    }
  },
  autofirebarrage: {  // Fires auto targeting barrage of projectiles at nearest enemy
    name: "AutoFire Barrage",
    cooldown: 900,
    effect: () => {
      console.log("AUTOFIRE BARRAGE ACTIVATED!");
      playSound('shotfullauto');
      barrageShotsRemaining = 16 + (shot_Count * 4);  // massive shot_Count scaling
      barrageActive = true;  // Marks the barrage as active
      barrageTimer = 0;  // duration
    }
  },
  decimator: {    // Fires a series of waves of projectiles which pierce and grants shotpen while active
    name: "Decimator",
    cooldown: 1200,
    effect: () => {
      console.log("DECIMATOR ACTIVATED!");
      playSound('charging');
      decimatorShotsRemaining = 6 + (shot_Count);
      decimatorTimer = 0;
    }
  },
  spiralshot: {   // Fires spiraling shouts out from caster
    name: "Spiral Shot",
    cooldown: 900,
    effect: () => {
      console.log("SPIRAL SHOT ACTIVATED!");
      playSound('shotfullauto');

      spiralShotsRemaining = 30 + shot_Count;
      spiralTimer = 0;
      spiralAngle = -PI / 2;  // Start at "12" (up)
    }
  },
  lightningbolt: {
    name: "Lightning Bolt",
    cooldown: 1600,
    effect: () => {
      console.log("LIGHTNING BOLT LIGHTNING BOLT LIGHTNING BOLT!");
      playSound('abilitylightningbolt');
      boltActive = true;
      boltTimer = 0;
      boltDamage = abilityStats.lightningbolt.damage;     // Have yet to implement modifiers for abilities, such as boltCountModifier
      boltDuration = abilityStats.lightningbolt.duration;
      boltHitEnemies = [];

      let boltCount = floor(random(6, 9) + boltCountModifier);
      activeBolts = [];

      for (let b = 0; b < boltCount; b++) {
        let boltArray = [];
        let screenX = map(b, 0, boltCount - 1, 0, width);
        let worldX = screenX + cameraX;
        let worldY = cameraY - 100;

        let currentX = worldX;
        let currentY = worldY;
        let segmentLength = 30;
        let boltLength = random(height - 200, height - 30);

        while (currentY < worldY + boltLength) {
          boltArray.push({ x: currentX, y: currentY });
          currentX += random(-40, 40);
          currentY += segmentLength + random(-10, 10);
          currentX = constrain(currentX, worldX - 200, worldX + 200);
        }
        activeBolts.push(boltArray);
      }
    }
  },
  singularity: {   // give'm the ol' ZUCC SUCC
    name: "Singularity",
    cooldown: 1320,
    effect: () => {
      console.log("SINGULARITY ACTIVATED!");
      playSound('singularity');
      singularityActive = true;
      singularityTimer = 0;
      singularityX = GetWorldMouseX();
      singularityY = GetWorldMouseY();
      singularityCaughtEnemies = [];
      singularityRadius = abilityStats.singularity.radius;
      singularityDuration = abilityStats.singularity.duration;
    }
  }
};

// Ability lookup for ship ability
const shipAbilities = {
  "Fox": "autofirebarrage",
  "Model xr-52": "spiralshot",
  "Imperial": "decimator",
  "Jackhammer": "bomb"
};

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
      shot_Penetration += 2;  // Grants +2 shot pen while active, and to all decimator shots
      decimatorActive = true; 
    }
    decimatorTimer++;
    if (decimatorTimer >= 16) {
      playSound('abilitydecimator');
      let worldMouseX = GetWorldMouseX();
      let worldMouseY = GetWorldMouseY();
      let baseAngle = atan2(worldMouseY - player_Y, worldMouseX - player_X);
      let burstCount = 4 + shot_Count * 2;  // scales 2x from shot count
      let angles = [];
      let diameters = Array(burstCount).fill(shot_Diameter * .75); // slightly smaller shots

      for (let s = 0; s < burstCount; s++) {
        let spread = (Math.floor(Math.random() * 2 + shot_Count) + 10);
        let angleOffset = burstCount > 1 ? map(s, 0, burstCount, -spread, spread) * PI / 180 : 0;
        angles.push(baseAngle + angleOffset);
      }
      AddShots(player_X, player_Y, angles, Array(burstCount).fill(shot_Speed), diameters, 0, shot_Penetration);
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

// LIGHTNING BOLT HANDLER 
function UpdateLightningBolt() {
  if (!game_State || game_Screen !== "playing") {
    return;
  }
  
  if (!boltActive) {
    return;
  }  
  boltTimer++;

  if (boltTimer >= boltDuration) {
    boltActive = false;
    activeBolts = [];
    boltHitEnemies = [];
    return;
  }

  for (let bolt of activeBolts) {
    push();
    translate(-cameraX, -cameraY);
    
    stroke(0, 200, 255);
    strokeWeight(3);
    for (let i = 0; i < bolt.length - 1; i++) {
      line(bolt[i].x, bolt[i].y, bolt[i + 1].x, bolt[i + 1].y);
    }

    stroke(75, 255, 240, 100);
    strokeWeight(8);
    for (let i = 0; i < bolt.length - 1; i++) {
      line(bolt[i].x, bolt[i].y, bolt[i + 1].x, bolt[i + 1].y);
    }    
    pop();
  }
  CheckBoltCollision();
}

// Bolt collision logic and damage
function CheckBoltCollision() {
  let enemiesToKill = [];

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (enemy.health <= 0) continue;

    for (let bolt of activeBolts) {
      for (let j = 0; j < bolt.length - 1; j++) {
        const seg1 = bolt[j];
        const seg2 = bolt[j + 1];
        const distToLine = DistanceToLineSegment(enemy.x, enemy.y, seg1.x, seg1.y, seg2.x, seg2.y);
        if (distToLine < 26 && !boltHitEnemies.includes(i)) {
          enemy.health -= boltDamage;
          playSound('hit');
          boltHitEnemies.push(i);
          if (enemy.health <= 0) {
            enemiesToKill.push(i);
          }
          break;
        }
      }
    }
  }
  // iterates backwards through array
  for (let i = enemiesToKill.length - 1; i >= 0; i--) {
    KillEnemy(enemiesToKill[i]);
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
    if (enemy.type === "chip") continue; // obstacles not affected such as our boy chip

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

// Generates a "staticy" lightning effect around the singularity
function DrawSingularityLightning(arcCount) {
  if (game_State && game_Screen === "playing"){
    for (let a = 0; a < arcCount; a++) {
      let startAngle = random(TWO_PI);
      let startX = singularityX + cos(startAngle) * singularityRadius * 0.8;
      let startY = singularityY + sin(startAngle) * singularityRadius * 0.8;
      let endX = singularityX;
      let endY = singularityY;

      stroke(150, 200, 255);
      strokeWeight(2);

      let segmentCount = 8;
      for (let s = 0; s < segmentCount; s++) {
        let t = s / segmentCount;
        let nextT = (s + 1) / segmentCount;

        let currentX = lerp(startX, endX, t) + random(-8, 8);
        let currentY = lerp(startY, endY, t) + random(-8, 8);
        let nextX = lerp(startX, endX, nextT) + random(-8, 8);
        let nextY = lerp(startY, endY, nextT) + random(-8, 8);

        line(currentX, currentY, nextX, nextY);
      }

      stroke(100, 180, 255, 150);
      strokeWeight(4);
      line(startX, startY, endX, endY);
    }
  }
}

// Deal damage to all caught enemies
function DealSingularityDamage() {
  const damageAmount = 10 + singularityCaughtEnemies.length * 5; // deals increased damage based on number of enemies it affects

  for (let i = singularityCaughtEnemies.length - 1; i >= 0; i--) {
    const enemyIndex = singularityCaughtEnemies[i];
    const enemy = enemies[enemyIndex];
    if (!enemy) continue;

    enemy.health -= damageAmount;
    playSound("hit");

    if (enemy.health <= 0) {
      KillEnemy(enemyIndex);
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

// Use the chosen ability
function UseAbility() {
  if (!abilityOnCooldown && abilities.length > 0) {
    let abilityName = abilities[currentAbilityIndex];
    let currentAbility = abilityList[abilityName];
    
    if (!currentAbility) {
      console.error("Ability not found:", abilityName);
      return;
    }
    
    // Execute the ability effect
    currentAbility.effect();
    abilityOnCooldown = true;
    
    // Get base cooldown (which can be modified)
    let baseCooldown = abilityStats[abilityName].cooldown;
    
    // Apply cdr
    let cooldownReduced = baseCooldown - (baseCooldown * (cooldown_Reduction / 100));
    
    abilityCooldownTimer = cooldownReduced;
  }
}

// go to next/last ability in queue
function CycleAbility(direction) {
  if (abilities.length === 0) return;

  currentAbilityIndex += direction;

  if (currentAbilityIndex >= abilities.length) {
    currentAbilityIndex = 0;
  } else if (currentAbilityIndex < 0) {
    currentAbilityIndex = abilities.length - 1;
  }

  console.log("Switched to: " + abilityList[abilities[currentAbilityIndex]].name);
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
  abilityOnCooldown = false;
  abilityCooldownTimer = 0;
  currentAbilityIndex = 0;
  console.log("Ability cooldown system reset");
  
}

function ResetAllAbilities() {
    console.log("ResetAllAbilities called.");
    
    // Reset ability stats to base values
    InitializeAbilityStats();
    
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
    
    // Lightning Bolt
    boltActive = false;
    boltTimer = 0;
    activeBolts = [];
    boltHitEnemies = [];
    
    // Singularity
    singularityActive = false;
    singularityTimer = 0;
    singularityCaughtEnemies = [];
    
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
    
    // Reset ability selection & cooldown
    currentAbilityIndex = 0;
    abilityOnCooldown = false;
    abilityCooldownTimer = 0;
    
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