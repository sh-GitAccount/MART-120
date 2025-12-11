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
  Shield: { 
    name: "Shield",
    cooldown: 800, 
    timer: 0, 
    onCooldown: false, 
    effect: UseShieldAbility 
  },
  rapidfirebarrage: { 
    name: "Barrage", 
    cooldown: 900, 
    timer: 0, 
    onCooldown: false, 
    effect: () => {
      barrageActive = true;
      barrageShotsRemaining = 30 + shot_Count * 5;
      barrageTimer = 0;
    }
  },
  spiralshot: { 
    name: "Spiral Shot", 
    cooldown: 900, 
    timer: 0, 
    onCooldown: false, 
    effect: () => {
      spiralShotsRemaining = 30 + shot_Count * 5;
      spiralTimer = 0;
      spiralAngle = 0;
    }
  },
  decimator: { 
    name: "Decimator", 
    cooldown: 1200, 
    timer: 0, 
    onCooldown: false, 
    effect: () => {
      decimatorShotsRemaining = 10 + shot_Count * 2;
      decimatorTimer = 0;
    }
  },
  bomb: { 
    name: "Bomb", 
    cooldown: 1000, 
    timer: 0, 
    onCooldown: false,     
    effect: () => {
      playSound('bomb');
      bombExplosions.push({
        x: player_X,
        y: player_Y,
        age: 0,
        duration: bombDuration,
        maxRadius: bombMaxRadius,
        currentRadius: 0
      }
     );
    }
  }
};

// Use to activate Shield ability
function UseShieldAbility() {
  const shield = shipAbilities.Shield;
  // Effect: for Shield, mark player immune
  immune = true;
  hit_Timer = 135;
  playSound('barrier');

  // Set cooldown
  shield.onCooldown = true;
  shield.timer = shield.cooldown * (1 - cooldown_Reduction / 100);

  console.log("Shield ability used! Cooldown:", shield.timer);
}

// Used to activate the ship ability
function ActivateShipAbility(name) {
  const ability = shipAbilities[name];
  if (!ability) return console.error("Ability not found:", name);

  if (ability.onCooldown) {
    console.log(`${ability.name} is on cooldown!`);
    return;
  }

  ability.effect();
  ability.onCooldown = true;
  ability.timer = ability.cooldown * (1 - cooldown_Reduction / 100);

  console.log(`${ability.name} ability used! Cooldown:`, ability.timer);
}

// Ship ability map
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
    barrageActive = false;
    return;
  }
  
  if (!barrageActive) {
    return;
  }
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
    if (decimatorActive) {
      shot_Penetration -= 2;
      decimatorActive = false;
    }
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

// Ability Functions
function UnlockAbility(abilityName) {
    abilities.push(abilityName);
    console.log("Unlocked ability: " + abilityName);  
}

function UpdateAbilityCooldown() {
  if (abilityOnCooldown) {
    abilityCooldownTimer--;
    if (abilityCooldownTimer <= 0) {
      abilityOnCooldown = false;
    }
  }
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
  spiralShotsRemaining = 0;
  spiralTimer = 0;
  spiralAngle = 0;  

  // Reset ship abilities cooldowns
  for (let name in shipAbilities) {
    shipAbilities[name].onCooldown = false;
    shipAbilities[name].timer = 0;
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
