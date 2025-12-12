
// PRELOAD ASSETS 
function preload() {
  // Initialize sound arrays 
  const soundCategories = [
    'error', 'equipattachment', 'removeattachment', 'confirm', 'select', 
    'gamestart', 'upgrade', 'cancel', 'getpowerup', 'getexptoken', 
    'getgoldtoken', 'getsucker', 'getability', 'getsupport', 'charging', 
    'barrier', 'bomb', 'flash', 'singularity', 'abilitydecimator', 
    'abilitylightningbolt', 'lightningchain', 'lightningecho', 'ice', 
    'icecrash', 'iceshard', 'fireball', 'fireballhit', 'diamondburst', 
    'diamondbursthit', 'diamondburstfork', 'diamondburstchain', 'cyclone', 
    'cyclonehit', 'blast', 'bounce', 'death', 'deathchungusjr', 
    'deathchungus', 'deathchungussr', 'deathdiamond', 'deathdisc', 
    'deathgrower', 'deathminidiamond', 'deathlilfella', 'hitchungusjr', 
    'hitchungus', 'hitchungussr', 'hitdiamond', 'hitdisc', 'hitgrower', 
    'hitminidiamond', 'hitlilfella', 'levelup', 'playerhit', 'shotfullauto', 
    'shotshotgun', 'shotsingle', 'shotbit', 'shotblaster', 'shotcannon', 
    'boss1leftdeath', 'boss1lefthit', 'boss1centerdeath', 'boss1centerhit', 
    'boss1rightdeath', 'boss1righthit', 'boss1centerexplode', 'beamshot', 
    'enemyapproach', 'enemyapproach2', 'pumpupthejam', 'unlimitedpower', 
    'ilikemoney', 'helpmetomcruise'
  ];
  
  soundCategories.forEach(cat => sounds[cat] = []);

  // LOAD ONLY ESSENTIAL ASSETS IN PRELOAD
  // Power images 
  powerImages.cyclone = loadImage('Images/power_cyclone.gif');
  powerImages.diamondburst = loadImage('Images/power_diamondburst.gif');
  powerImages.energydisc = loadImage('Images/power_energydisc.gif');
  powerImages.fireball = loadImage('Images/power_fireball.gif');
  powerImages.freeze = loadImage('Images/power_freeze.gif');
  powerImages.laserbeam = loadImage('Images/power_laserbeam.gif');
  powerImages.lightningbolt = loadImage('Images/power_lightningbolt.gif');
  powerImages.pulsewave = loadImage('Images/power_pulsewave.gif');
  powerImages.singularity = loadImage('Images/power_singularity.gif');

  // Power spritesheets (needed during gameplay)
  powerSpritesheets = {};
  powerSpritesheets.fireball = loadImage('Images/power_fireball_spritesheet.png');
  powerSpritesheets.freeze = loadImage('Images/power_freeze_spritesheet.png');
  powerSpritesheets.diamondburst = loadImage('Images/power_diamondburst_spritesheet.png');
  powerSpritesheets.cyclone = loadImage('Images/power_cyclone_spritesheet.png');

  // Ship sprites (needed for gameplay)
  shipImages[1] = loadImage('Images/ship_1.png');
  shipImages[2] = loadImage('Images/ship_2.png');
  shipImages[3] = loadImage('Images/ship_3.png');
  shipImages[4] = loadImage('Images/ship_4.png');

  // Support Object images (needed during gameplay)
  bitImage = loadImage('Images/bit.png');
  cannonImage = loadImage('Images/cannon.png');
  blasterImage = loadImage('Images/blaster.png');
  itemTable.powerup.spriteSheet = loadImage('Images/powerup_spritesheet.png');
  itemTable.exptoken.spriteSheet = loadImage('Images/exptoken_spritesheet.png');
  itemTable.midexptoken.spriteSheet = loadImage('Images/midexptoken_spritesheet.png');
  itemTable.bigexptoken.spriteSheet = loadImage('Images/bigexptoken_spritesheet.png');
  itemTable.goldtoken.spriteSheet = loadImage('Images/goldtoken_spritesheet.png');
  itemTable.ability.spriteSheet = loadImage('Images/ability_spritesheet.png');
  itemTable.support.spriteSheet = loadImage('Images/ability_spritesheet.png');
  itemTable.sucker.spriteSheet = loadImage('Images/sucker_spritesheet.png');
  itemTable.biggoldtoken.spriteSheet = loadImage('Images/biggoldtoken_spritesheet.png');

  // Load menu theme only (other music will lazy-load)
  musicTracks.menuTheme = loadSound('../Audio/MenuTheme.ogg');

  // Initialize sound loading queue for background loading
  soundLoadQueue = [];
  isLoadingSounds = false;
}

// Setup Canvas
function setup() {
  loadGame();
  InitializePowerStats()
  bossProjectiles = [];
  playMusicTrack('menuTheme');
  InitializeAttachmentLevels();
  InitializeUpgradeLevels();
  setInterval(saveGame, 10000); // 10s auto save timer
  createCanvas(1500, 1200); // 1500 1200 // will change to 1280 * 1024
  
  // Start lazy-loading non-essential sounds and images in background
  QueueAllSoundsForLazyLoad();
  QueueAllImagesForLazyLoad();
}

function QueueAllSoundsForLazyLoad() {
  const soundMappings = [
    { name: 'error', path: '../Audio/Error.ogg' },
    { name: 'equipattachment', path: '../Audio/EquipAttachment.ogg' },
    { name: 'removeattachment', path: '../Audio/RemoveAttachment.ogg' },
    { name: 'confirm', path: '../Audio/Confirm.ogg' },
    { name: 'select', path: '../Audio/Select.ogg' },
    { name: 'gamestart', path: '../Audio/GameStart.ogg' },
    { name: 'upgrade', path: '../Audio/Upgrade.ogg' },
    { name: 'cancel', path: '../Audio/Cancel.ogg' },
    { name: 'getpowerup', path: '../Audio/GetPowerUp.ogg' },
    { name: 'getexptoken', path: '../Audio/GetExpToken.ogg' },
    { name: 'getgoldtoken', path: '../Audio/GetGoldToken.ogg' },
    { name: 'getsucker', path: '../Audio/GetSucker.ogg' },
    { name: 'getability', path: '../Audio/GetAbility.ogg' },
    { name: 'getsupport', path: '../Audio/GetSupport.ogg' },
    { name: 'barrier', path: '../Audio/Barrier.ogg' },
    { name: 'bomb', path: '../Audio/Bomb.ogg' },
    { name: 'flash', path: '../Audio/Flash.ogg' },
    { name: 'singularity', path: '../Audio/Singularity.ogg' },
    { name: 'abilitydecimator', path: '../Audio/AbilityDecimator.ogg' },
    { name: 'abilitylightningbolt', path: '../Audio/AbilityLightningBolt.ogg' },
    { name: 'lightningchain', path: '../Audio/LightningChain.ogg' },
    { name: 'lightningecho', path: '../Audio/LightningEcho.ogg' },
    { name: 'ice', path: '../Audio/Ice.ogg' },
    { name: 'icecrash', path: '../Audio/IceCrash.ogg' },
    { name: 'iceshard', path: '../Audio/IceShard.ogg' },
    { name: 'fireball', path: '../Audio/Fireball.ogg' },
    { name: 'fireballhit', path: '../Audio/FireballHit.ogg' },
    { name: 'diamondburst', path: '../Audio/DiamondBurst.ogg' },
    { name: 'diamondbursthit', path: '../Audio/DiamondBurstHit.ogg' },
    { name: 'diamondburstchain', path: '../Audio/DiamondBurstChain.ogg' },
    { name: 'diamondburstfork', path: '../Audio/DiamondBurstFork.ogg' },
    { name: 'cyclone', path: '../Audio/Cyclone.ogg' },
    { name: 'cyclonehit', path: '../Audio/CycloneHit.ogg' },
    { name: 'blast', path: '../Audio/Blast.ogg' },
    { name: 'bounce', path: '../Audio/Bounce.ogg' },
    { name: 'death', path: '../Audio/Death.ogg' },
    { name: 'deathchungusjr', path: '../Audio/DeathChungusJr.ogg' },
    { name: 'deathchungus', path: '../Audio/DeathChungus.ogg' },
    { name: 'deathchungussr', path: '../Audio/DeathChungusSr.ogg' },
    { name: 'deathdiamond', path: '../Audio/DeathDiamond.ogg' },
    { name: 'deathdisc', path: '../Audio/DeathDisc.ogg' },
    { name: 'deathgrower', path: '../Audio/DeathGrower.ogg' },
    { name: 'deathminidiamond', path: '../Audio/DeathMiniDiamond.ogg' },
    { name: 'deathlilfella', path: '../Audio/DeathLilfella.ogg' },
    { name: 'hitchungusjr', path: '../Audio/HitChungusJr.ogg' },
    { name: 'hitchungus', path: '../Audio/HitChungus.ogg' },
    { name: 'hitchungussr', path: '../Audio/HitChungusSr.ogg' },
    { name: 'hitdiamond', path: '../Audio/HitDiamond.ogg' },
    { name: 'hitdisc', path: '../Audio/HitDisc.ogg' },
    { name: 'hitgrower', path: '../Audio/HitGrower.ogg' },
    { name: 'hitminidiamond', path: '../Audio/HitMiniDiamond.ogg' },
    { name: 'hitlilfella', path: '../Audio/HitLilfella.ogg' },
    { name: 'levelup', path: '../Audio/LevelUp.ogg' },
    { name: 'playerhit', path: '../Audio/PlayerHit.ogg' },
    { name: 'shotfullauto', path: '../Audio/ShotFullAuto.ogg' },
    { name: 'shotshotgun', path: '../Audio/ShotShotgun.ogg' },
    { name: 'shotsingle', path: '../Audio/ShotSingle.ogg' },
    { name: 'shotbit', path: '../Audio/ShotBit.ogg' },
    { name: 'shotblaster', path: '../Audio/ShotBlaster.ogg' },
    { name: 'shotcannon', path: '../Audio/ShotCannon.ogg' },
    { name: 'boss1leftdeath', path: '../Audio/Boss1LeftDeath.ogg' },
    { name: 'boss1lefthit', path: '../Audio/Boss1LeftHit.ogg' },
    { name: 'boss1centerdeath', path: '../Audio/Boss1CenterDeath.ogg' },
    { name: 'boss1centerhit', path: '../Audio/Boss1CenterHit.ogg' },
    { name: 'boss1rightdeath', path: '../Audio/Boss1RightDeath.ogg' },
    { name: 'boss1righthit', path: '../Audio/Boss1RightHit.ogg' },
    { name: 'boss1centerexplode', path: '../Audio/BOss1CenterExplode.ogg' },
    { name: 'beamshot', path: '../Audio/BeamShot.ogg' },
    { name: 'charging', path: '../Audio/Charging.ogg' },
    { name: 'enemyapproach', path: '../Audio/EnemyApproach.ogg' },
    { name: 'enemyapproach2', path: '../Audio/EnemyApproach2.ogg' },
    { name: 'pumpupthejam', path: '../Audio/PumpUpTheJam.ogg' },
    { name: 'ilikemoney', path: '../Audio/ILikeMoney.ogg' },
    { name: 'helpmetomcruise', path: '../Audio/HelpMeTomCruise.ogg' },
    { name: 'unlimitedpower', path: '../Audio/UnlimitedPower.ogg' }
  ];

  // Load each sound SOUND_COUNT times and queue them
  for (let i = 0; i < SOUND_COUNT; i++) {
    soundMappings.forEach(mapping => {
      soundLoadQueue.push({ soundName: mapping.name, path: mapping.path });
    });
  }

  // Start processing queue
  ProcessNextQueuedSound();
}

// Process sounds one at a time to avoid resource exhaustion
function ProcessNextQueuedSound() {
  if (soundLoadQueue.length === 0) {
    isLoadingSounds = false;
    return;
  }

  isLoadingSounds = true;
  let next = soundLoadQueue.shift();
  sounds[next.soundName].push(
    loadSound(next.path, () => {
      // Load complete, schedule next one with delay
      setTimeout(ProcessNextQueuedSound, 50);
    }, () => {
      // Error, still process next
      setTimeout(ProcessNextQueuedSound, 50);
    })
  );
}

// Queue all images for background loading
function QueueAllImagesForLazyLoad() {
  imageLoadQueue = [];

  // Music tracks
  const musicMappings = [
    { name: 'victoryTheme', path: '../Audio/VictoryTheme.ogg' },
    { name: 'stageTheme', path: '../Audio/StageTheme.ogg' },
    { name: 'stage2Theme', path: '../Audio/Stage2Theme.ogg' },
    { name: 'stage3Theme', path: '../Audio/Stage3Theme.ogg' },
    { name: 'stage4Theme', path: '../Audio/Stage4Theme.ogg' },
    { name: 'deathTheme', path: '../Audio/DeathTheme.ogg' },
    { name: 'bosstrack1', path: '../Audio/BossTrack1.ogg' },
    { name: 'bosstrack2', path: '../Audio/BossTrack2.ogg' }
  ];

  musicMappings.forEach(m => {
    imageLoadQueue.push({ type: 'music', name: m.name, path: m.path });
  });

  // Queue upgrade and attachment images
  for (id in upgradeLevels) {
    let upgBase = upgradeLevels[id];
    if (upgBase.baseIcon) {
      imageLoadQueue.push({ type: 'upgrade', id: id, path: upgBase.baseIcon });
    }
  }

  for (id in attachmentLevels) {
    let attBase = attachmentLevels[id];
    if (attBase.baseIcon) {
      imageLoadQueue.push({ type: 'attachment', id: id, path: attBase.baseIcon });
    }
  }

  ProcessNextQueuedImage();
}

// Process images one at a time
function ProcessNextQueuedImage() {
  if (imageLoadQueue.length === 0) {
    return;
  }

  let next = imageLoadQueue.shift();

  if (next.type === 'music') {
    musicTracks[next.name] = loadSound(next.path, () => {
      setTimeout(ProcessNextQueuedImage, 75);
    }, () => {
      setTimeout(ProcessNextQueuedImage, 75);
    });
  } else if (next.type === 'upgrade') {
    upgradeImages[next.id] = loadImage(next.path, () => {
      setTimeout(ProcessNextQueuedImage, 75);
    }, () => {
      setTimeout(ProcessNextQueuedImage, 75);
    });
    
    // Also queue grayscale version
    grayscaleUpgradeImages[next.id] = loadImage(next.path, 
      function(img) {
        img.filter(GRAY);
        setTimeout(ProcessNextQueuedImage, 75);
      }, () => {
        setTimeout(ProcessNextQueuedImage, 75);
      }
    );
  } else if (next.type === 'attachment') {
    attachmentImages[next.id] = loadImage(next.path, () => {
      setTimeout(ProcessNextQueuedImage, 75);
    }, () => {
      setTimeout(ProcessNextQueuedImage, 75);
    });
    
    // Also queue grayscale version
    grayscaleAttachmentImages[next.id] = loadImage(next.path,
      function(img) {
        img.filter(GRAY);
        setTimeout(ProcessNextQueuedImage, 75);
      }, () => {
        setTimeout(ProcessNextQueuedImage, 75);
      }
    );
  }
}

function distSquared(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

// =================== \\
// Misc helper functions

// Cheat Codes 
function ILikeMoney(){ // Adds 10000 gold
  console.log("Behold, fortune and glory!");
  console.log("Added 10,000 Gold.");
  playSound('ilikemoney');
  Gold += 10000;
}

function PumpUpTheJam(){  // Unlocks all Level 0 Attachments
  console.log("Pump it up, get the party goin' on tha dance floor!");
  playSound('pumpupthejam');
  attachments.push(1);
  attachments.push(2);
  attachments.push(3);
  attachments.push(4);
  attachments.push(5);
  attachments.push(6);
  attachments.push(7);
  attachments.push(8);
  attachments.push(9);
  attachments.push(10);
  attachments.push(11);
  attachments.push(12);
  attachments.push(13);
  attachments.push(14);
  attachments.push(15);
  attachments.push(16);
  attachments.push(17);
  attachments.push(18);
  attachments.push(19);
  attachments.push(20);
}

function HelpMeTomCruise(){ // Heals and increase health
  console.log("Tom Cruise has blessed you, granting you increased health.");
  playSound('helpmetomcruise');
  player_Health += 500;
  max_Health += 500;
  baseMaxHealth += 500;
  ClampStats();
}

function UnlimitedPower(){  // make big strong
  console.log("Now witness the fire power of this fully armed and operational battle station!");
  console.log("-- Weapons juiced out the wazoo!-- ");
  playSound('unlimitedpower');
  shot_Count += 4;
  shot_Power += 40;
  shot_Penetration += 2;
  shot_Diameter += 10;
  shot_Speed += 10;
  burstCooldown -= 10;
  ClampStats();
}

// Converts mouseX to cameraX 
function GetWorldMouseX() {
  return mouseX + cameraX;
}
function GetWorldMouseY() {
  return mouseY + cameraY;
}

// Math function to get distance 
function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// DIsplay FPS
function DisplayFPS() {
  if (showFPS){
  push();
  fill(200);
  textSize(14);
  textAlign(LEFT);
  text("FPS: " + frameRate().toFixed(1), 10, height - 40);
  pop();
  }
}

// Display millis
/*  function DisplayMillis() {
  push();
  fill(0);
  textSize(14);
  textAlign(LEFT);
  strokeWeight(1);
  text("Millis: " + millis().toFixed(1), 10, height - 70);
  text("game_State: " + game_State, 10, height - 90);
  text("game_Paused: " + game_Paused, 10, height - 110);
  pop();
} */

// Sets Min/Max values for stats so you can't get -1 Shot Delay and fire infinity shots per second for example
function ClampStats() {
  shot_Penetration = Math.max(0, Math.min(shot_Penetration, shot_Penetration_MAX));
  shot_Power = Math.max(1, Math.min(shot_Power, shot_Power_MAX));
  shot_Count = Math.max(1, Math.min(shot_Count, shot_Count_MAX));
  cooldown_Reduction = Math.max(0, Math.min(cooldown_Reduction, cdr_MAX));
  shot_Speed = Math.max(1, Math.min(shot_Speed, shot_Speed_MAX));
  shot_Diameter = Math.max(1, Math.min(shot_Diameter, shot_Diameter_MAX));
  shot_Duration = Math.max(1, Math.min(shot_Duration, shot_Duration_MAX));
  shot_Delay = Math.max(shot_Delay_MIN, shot_Delay);
}

// Handles cooldown reduction math
function GetCooldownReduction() {
  // Capped at 80% max
  let reductionPercent = cooldown_Reduction / (cooldown_Reduction + 100);
  reductionPercent = min(reductionPercent, 0.8);  // Cap at 80%
  return reductionPercent;
}

function drawPolygon(sides, x, y, radius, rotation = 0) {
  beginShape();
  for (let i = 0; i < sides; i++) {
    const angle = TWO_PI / sides * i + rotation;
    const px = x + cos(angle) * radius;
    const py = y + sin(angle) * radius;
    vertex(px, py);
  }
  endShape(CLOSE);
}

// Level up handler
function LevelUp() {
  playSound('levelup');
  Level += 1;
  if (Level === 10 || Level === 20 || Level === 30) {
    QueueSupportChoices();
  }

  QueuePowerChoices();
  max_Health += health_Growth; // Base max health increase
  player_Health += health_Growth;
  shield_Value += shield_Growth;

  let L = Level;
  exp_Next = 25 + (L * 55) + (L ** 2) * 6;
  
  RecalculateConversions();
  ClampStats();
}

// Gets nearest enemy so we can shoot it in the face and/or ass
function GetNearestEnemy(x, y, enemyArray) {
  let nearest = null;
  let bestDist = Infinity;

  for (let i = 0; i < enemyArray.length; i++) {
    const enemy = enemyArray[i];
    if (enemy.health <= 0) continue;

    const dx = enemy.x - x;
    const dy = enemy.y - y;
    const distSq = dx * dx + dy * dy;

    if (distSq < bestDist) {
      bestDist = distSq;
      nearest = { index: i, distSq };
    }
  }

  return nearest;
}


// RNG 
function getRandomNumber(number) {
  return Math.floor(Math.random() * 55) + 35;
}
// =================== \\

// creates some random shit 
// WAY TOO LAGGY - Not going to use this for now
/*
function GenerateWorldObstacles(count = 20) {
  worldObstacles = [];
  
  for (let i = 0; i < count; i++) {
    let x = random(-2000, 2000);
    let y = random(-2000, 2000);
    let size = random(40, 100);
    
    worldObstacles.push({
      x: x,
      y: y,
      size: size,
      type: random(["rock", "tree", "debris"])
    });
  }
}

//  DRAW OBSTACLES - 
function DrawWorldObstacles() {
  push();
  noStroke();
  
  for (let obstacle of worldObstacles) {
    // Only draw if visible on screen (add buffer for safety)
    let screenX = obstacle.x - cameraX;
    let screenY = obstacle.y - cameraY;
    let buffer = obstacle.size + 50;
    
    if (screenX < -buffer || screenX > width + buffer ||
        screenY < -buffer || screenY > height + buffer) {
      continue; // Skip drawing this obstacle
    }
    
    switch (obstacle.type) {
      case "rock":
        fill(120, 100, 80);
        ellipse(obstacle.x, obstacle.y, obstacle.size);
        break;
      case "tree":
        fill(80, 140, 60);
        rect(obstacle.x - obstacle.size/3, obstacle.y - obstacle.size/2, 
             obstacle.size/1.5, obstacle.size);
        break;
      case "debris":
        fill(100, 100, 100);
        rect(obstacle.x - obstacle.size/2, obstacle.y - obstacle.size/2, 
             obstacle.size, obstacle.size);
        break;
    }
  }
  pop();
}

// prevents player movement 
function CheckObstacleCollision() {
  const playerRadius = player_Hitbox / 2;
  const checkRadius = 300; // Only check obstacles within 300px of player
  
  for (let obstacle of worldObstacles) {
    // Quick distance check first
    let distToObstacle = dist(player_X, player_Y, obstacle.x, obstacle.y);
    if (distToObstacle > checkRadius) continue; // Skip far obstacles
    
    let dx = player_X - obstacle.x;
    let dy = player_Y - obstacle.y;
    let minDistance = playerRadius + obstacle.size / 2;
    
    if (distToObstacle < minDistance) {
      let angle = atan2(dy, dx);
      let pushDistance = minDistance - distToObstacle + 2;
      
      player_X += cos(angle) * pushDistance;
      player_Y += sin(angle) * pushDistance;
    }
  }
}
      */ // ---======================================================== obstacles

function DamageEnemiesInRadius(radius, damageAmount) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    
    // Use your custom distance function
    if (distance(player_X, player_Y, enemy.x, enemy.y) < radius) {
      enemy.health -= damageAmount;
      damageCount++;
      
      playSound('hit');
      
      if (enemy.health <= 0) {
        // KillEnemy only takes index parameter
        KillEnemy(i);
      }
    }
  }
}

// used to check for boss damage
function DamageBossesInRadius(radius, damageAmount) {
  for (let b = bosses.length - 1; b >= 0; b--) {
    const boss = bosses[b];
    if (!boss.isAlive) continue;
    
    let distToCenter = dist(player_X, player_Y, boss.worldX, boss.worldY);
    let distToLeft = dist(player_X, player_Y, boss.worldX + boss.left.offsetX, boss.worldY);
    let distToRight = dist(player_X, player_Y, boss.worldX + boss.right.offsetX, boss.worldY);
    
    // Damage center
    if (distToCenter < radius) {
      boss.center.health -= damageAmount;
      damage_Dealt += damageAmount;
      playSound('hit');
      
      if (boss.center.health <= 0 && boss.left.health <= 0 && boss.right.health <= 0) {
        KillBoss(b);
      }
    }
    
    // Damage left
    if (distToLeft < radius) {
      boss.left.health -= damageAmount;
      damage_Dealt += damageAmount;
      playSound('hit');
      
      if (boss.center.health <= 0 && boss.left.health <= 0 && boss.right.health <= 0) {
        KillBoss(b);
      }
    }
    
    // Damage right
    if (distToRight < radius) {
      boss.right.health -= damageAmount;
      damage_Dealt += damageAmount;
      playSound('hit');
      
      if (boss.center.health <= 0 && boss.left.health <= 0 && boss.right.health <= 0) {
        KillBoss(b);
      }
    }
  }
}

// Rudimentary collision checker used in the check collisionS
function CheckCollision(x1, y1, d1, x2, y2, d2) {
  const r1 = d1 / 2;
  const r2 = d2 / 2;
  return dist(x1, y1, x2, y2) < r1 + r2;
}

// used to create "window" around player 
function DrawBossBoundary() {
  let bossAlive = bosses.length > 0 && bosses[0].isAlive;
  if (!bossAlive) return;
  
  push();
  stroke(255, 0, 0, 100);
  strokeWeight(5);
  noFill();
  
  // Draw arena boundary
  rect(0, 0, width, height);
  
  pop();
}

// Function for checking if immune and doing damage/collision 
function DamageCheckByType(damage) {
  if (!immune) {
    if(frequencyShifter && shield_Active && !shield_Hit) {
      let healAmount = Math.round(shield_Value * (shift_Percentage / 100)); // rounds off 
      player_Health += healAmount;
      if (player_Health > max_Health){
        player_Health = max_Health;
      }
    }
    
    let actualDamage = HitShield(damage);
    playSound('playerhit');
    immune = true;
    hit_Timer = 60 + hit_Timer_Bonus;    
   
    player_Health -= actualDamage;
  }
}

function CheckCollisions() {
  // Check enemies
  for (let enemy of enemies) {
    if (CheckCollision(player_X, player_Y, player_Hitbox, enemy.x, enemy.y, enemy.diameter)) {
      DamageCheckByType(ENEMY_TYPES[enemy.type.toUpperCase()]);
    }
  }

  // Check bosses 
  for (let boss of bosses) {
    if (!boss.isAlive) continue;
    
    // Convert player to screen coordinates
  //  let playerScreenX = player_X - cameraX;
  //  let playerScreenY = player_Y - cameraY;
    
    // Center collision (on screen)
    if (CheckCollision(player_X, player_Y, player_Hitbox, boss.worldX, boss.worldY, boss.center.diameter)) {
      DamageCheckByType(100);
    }

    // Left collision
    if (CheckCollision(player_X, player_Y, player_Hitbox, boss.worldX + boss.left.offsetX, boss.worldY, boss.left.diameter)) {
      DamageCheckByType(100);
    }

    // Right collision
    if (CheckCollision(player_X, player_Y, player_Hitbox, boss.worldX + boss.right.offsetX, boss.worldY, boss.right.diameter)) {
      DamageCheckByType(100);
    }
  }

  // Check obstacles 
  for (let chip of chips) {
    if (CheckCollision(player_X, player_Y, player_Hitbox, chip.x, chip.y, chip.diameter)) {
      DamageCheckByType(ENEMY_TYPES.CHIP);
    }
  }
}

// Handles player collision
function handleCollision(targetX, targetY, targetDiameter, targetHealth, targetXSpeed, targetYSpeed, expReward, goldReward, hitSound, deathSound, i, enemyType) {
  for (let t = targetX.length - 1; t >= 0; t--) {
    if (CheckCollision(shot_X[i], shot_Y[i], shot_Diameter_Array[i], targetX[t], targetY[t], targetDiameter[t])) {
      if (shot_HitEnemies[i].includes(t)) continue;
      shot_HitEnemies[i].push(t);
      targetHealth[t] -= shot_PowerArray[i];
      playSound(hitSound);
      if (enemyType === "disc") {
        targetXSpeed[t] = Math.floor(Math.random() * 8) - 4;
        targetYSpeed[t] = Math.floor(Math.random() * 8) - 4;
      }
      if (targetHealth[t] <= 0) {
        KillEnemy(
          enemyType,
          targetX[t],
          targetY[t],
          targetDiameter[t],
          expReward,
          goldReward,
          deathSound,
          t,
          targetXSpeed,
          targetYSpeed,
          targetHealth
        );

        targetX.splice(t, 1);
        targetY.splice(t, 1);
        targetDiameter.splice(t, 1);
        if (targetXSpeed) targetXSpeed.splice(t, 1);
        if (targetYSpeed) targetYSpeed.splice(t, 1);
        targetHealth.splice(t, 1);
      }
      SpliceShot(i);
      break;
    }
  }
}

// Helps to adjust spacing 
function drawTextColumns(x, y, lineHeight, size, ...columns) {
  const columnWidth = 200;
  textSize(size);

  for (let col = 0; col < columns.length; col++) {
    textAlign(LEFT);
    text(columns[col], x + (col * columnWidth), y);
  }
}

function Drawgame_Screen() {
  DrawBackgroundLayers();  
  CursorUpdate();

  if (justRestarted) {
    ResetAllAbilities();
    justRestarted = false;
    return;   
  }
  UpdateShipAbilityCooldowns();
  
  //UpdateAbilityCooldowns();
  UpdateBarrage();
  UpdateSpiral();
  UpdateDecimator();
  UpdateLightningBolt()
      
  UpdatePowers();    
  UpdateSingularity();   
  UpdateBossFiring();
  UpdateBossProjectiles();
  updateBossWarning();
  updateVictoryScreen();
  
  
  if (stage ===1 && time >= 7200 && !bossWarningTriggered) {
    bossWarningTriggered = true;
    triggerBossWarning();
  }  // add more boss later


  updateTime();
  MovePlayer();
  
  // ===== Game space stuff that gets drawn on screen ===== \\
  push();

  translate(-cameraX, -cameraY);  
  UpdateSuckerBoost();
  CreatePlayer();
  DrawShield();        
  UpdateSupports();
  UpdateShield();
  Shot();
  MoveShot();
  UpdateWaves(activeWaves);
  MoveEnemies();
  DrawEnemies();
  UpdateItems();  
  CheckCollisions();
  CheckShotCollisions();
  DrawBombExplosions();
  Immune();    
  pop();

  // Draws boss outside of pop
  DrawBossBoundary();
  DrawBosses();
  DrawBossProjectiles();
  
  // ===== UI THAT STAYS FIXED ON SCREEN ===== \\

  DisplayFPS();  
  CreateBorders();
  UpdateHud();        
 
  fill(100);
  textSize(14);
  textAlign(LEFT);
  // DisplayMillis();
  UpdateGameTime()
  DrawPowerChoiceDialog();
  DrawPowerupDialog();
  DrawSupportDialog();
  text("Press Z to pause", 10, height - 20);    
    if (!mouseIsPressed) {
      dialogClickConsumed = false;
  }
}

// `` -- __ DRAW __ -- `` \\  What is my purpose? You call the real functions. Oh. My. God.
function draw() {
  if (game_Screen === "menu") {
    DrawMenuScreen();
    CursorUpdate();
  } else if (game_Screen === "shop") {
    DrawShopScreen();
  } else if (game_Screen === "shipSelection") {
    DrawShipSelectionScreen();
    HandleShipSelection();
    CursorUpdate();
  } else if (game_Screen === "stageSelection") {
    DrawStageSelectionScreen();
    CursorUpdate();
  } else if (game_Screen === "playing") {
    Drawgame_Screen();
    CursorUpdate();
    CheckShotCollisions();
  } else if (game_Screen === "victory") {
    DrawVictoryScreen();
    CursorUpdate();
  } else if (game_Screen === "paused") {
    DrawPauseScreen();
    CursorUpdate();
  } else if (game_Screen === "gameOver") {
    DrawGameOverScreen();
    CursorUpdate();
  } else if (game_Screen === "options") {
    DrawOptionsScreen();
    CursorUpdate();
  }
}
