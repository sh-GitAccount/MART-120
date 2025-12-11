// PRELOAD ASSETS
function preload() {
  console.log("Preloading assets, sounds, images, etc");
  //UI/Menu sfx
  sounds.error = [];
  sounds.equipattachment = [];
  sounds.removeattachment = [];
  sounds.confirm = [];
  sounds.select = [];
  sounds.gamestart = [];
  sounds.upgrade = [];
  sounds.cancel = [];

  sounds.getpowerup = [];
  sounds.getexptoken = [];
  sounds.getgoldtoken = [];
  sounds.getsucker = [];

//  sounds.getexploder = [];
  sounds.getability = [];
  sounds.getsupport = [];

  // Ability Sounds
  sounds.charging = [];
  sounds.barrier = [];
  sounds.bomb = [];
  sounds.flash = [];
  sounds.singularity = [];
  sounds.abilitydecimator = [];
  sounds.abilitylightningbolt = [];

  // All other sounds
  sounds.blast = [];
  sounds.bounce = [];
  sounds.death = [];
  sounds.deathchungusjr = [];
  sounds.deathchungus = [];
  sounds.deathchungussr = [];
  sounds.deathdiamond = [];
  sounds.deathdisc = [];
  sounds.deathgrower = [];
  sounds.deathminidiamond = [];
  sounds.deathlilfella = [];
  sounds.hitchungusjr = [];
  sounds.hitchungus = [];
  sounds.hitchungussr = [];
  sounds.hitdiamond = [];
  sounds.hitdisc = [];
  sounds.hitgrower = [];
  sounds.hitminidiamond = [];
  sounds.hitlilfella = [];
  sounds.levelup = [];
  sounds.playerhit = [];
  sounds.shotfullauto = [];
  sounds.shotshotgun = [];
  sounds.shotsingle = [];
  sounds.shotbit = [];
  sounds.shotblaster = [];
  sounds.shotcannon = [];

  // Boss Sounds
  sounds.boss1leftdeath = [];
  sounds.boss1lefthit = [];
  sounds.boss1centerdeath = [];
  sounds.boss1centerhit = [];
  sounds.boss1rightdeath = [];
  sounds.boss1righthit = [];
  sounds.boss1centerexplode = [];

  sounds.beamshot = [];
  sounds.charging = [];

  sounds.enemyapproach = [];
  sounds.enemyapproach2 = [];


  // Special Sounds for Special People
  sounds.pumpupthejam = [];
  sounds.unlimitedpower = [];
  sounds.ilikemoney = [];
  sounds.helpmetomcruise = [];

  // Load music
  musicTracks.menuTheme = loadSound('../Audio/MenuTheme.ogg');
  musicTracks.stageTheme = loadSound('../Audio/StageTheme.ogg');
  musicTracks.deathTheme = loadSound('../Audio/DeathTheme.ogg');

  // Preload for ship sprites
  shipImages[1] = loadImage('Images/ship_1.png');
  shipImages[2] = loadImage('Images/ship_2.png');
  shipImages[3] = loadImage('Images/ship_3.png');
  shipImages[4] = loadImage('Images/ship_4.png');

  // Support Object images
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
//  itemTable.exploder.spriteSheet = loadImage('Images/exploder_spritesheet.png');

  for (i = 0; i < SOUND_COUNT; i++) {
    // UI/Menu Sfx
    sounds.charging.push(loadSound('../Audio/Charging.ogg'));
    sounds.error.push(loadSound('../Audio/Error.ogg'));
    sounds.equipattachment.push(loadSound('../Audio/EquipAttachment.ogg'));
    sounds.removeattachment.push(loadSound('../Audio/RemoveAttachment.ogg'));
    sounds.confirm.push(loadSound('../Audio/Confirm.ogg'));
    sounds.select.push(loadSound('../Audio/Select.ogg'));
    sounds.gamestart.push(loadSound('../Audio/GameStart.ogg'));
    sounds.upgrade.push(loadSound('../Audio/Upgrade.ogg'));
    sounds.cancel.push(loadSound('../Audio/Cancel.ogg'));


    sounds.getpowerup.push(loadSound('../Audio/GetPowerUp.ogg'));
    sounds.getexptoken.push(loadSound('../Audio/GetExpToken.ogg'));
    sounds.getgoldtoken.push(loadSound('../Audio/GetGoldToken.ogg'));
    sounds.getsucker.push(loadSound('../Audio/GetSucker.ogg'));
    sounds.getability.push(loadSound('../Audio/GetAbility.ogg'));
    sounds.getsupport.push(loadSound('../Audio/GetSupport.ogg'));
    sounds.charging.push(loadSound('../Audio/Charging.ogg'));

    // Ability sounds
    sounds.barrier.push(loadSound('../Audio/Barrier.ogg'));
    sounds.bomb.push(loadSound('../Audio/Bomb.ogg'));
    sounds.flash.push(loadSound('../Audio/Flash.ogg'));
    sounds.singularity.push(loadSound('../Audio/Singularity.ogg'));
    sounds.abilitydecimator.push(loadSound('../Audio/AbilityDecimator.ogg'));
    sounds.abilitylightningbolt.push(loadSound('../Audio/AbilityLightningBolt.ogg'));

    // Other sounds
    sounds.blast.push(loadSound('../Audio/Blast.ogg'));
    sounds.bounce.push(loadSound('../Audio/Bounce.ogg'));
    sounds.death.push(loadSound('../Audio/Death.ogg'));
    sounds.deathchungusjr.push(loadSound('../Audio/DeathChungusJr.ogg'));
    sounds.deathchungus.push(loadSound('../Audio/DeathChungus.ogg'));
    sounds.deathchungussr.push(loadSound('../Audio/DeathChungusSr.ogg'));
    sounds.deathdiamond.push(loadSound('../Audio/DeathDiamond.ogg'));
    sounds.deathdisc.push(loadSound('../Audio/DeathDisc.ogg'));
    sounds.deathgrower.push(loadSound('../Audio/DeathGrower.ogg'));
    sounds.deathminidiamond.push(loadSound('../Audio/DeathMiniDiamond.ogg'));
    sounds.deathlilfella.push(loadSound('../Audio/DeathLilfella.ogg'));
    sounds.hitchungusjr.push(loadSound('../Audio/HitChungusJr.ogg'));
    sounds.hitchungus.push(loadSound('../Audio/HitChungus.ogg'));
    sounds.hitchungussr.push(loadSound('../Audio/HitChungusSr.ogg'));
    sounds.hitdiamond.push(loadSound('../Audio/HitDiamond.ogg'));
    sounds.hitdisc.push(loadSound('../Audio/HitDisc.ogg'));
    sounds.hitgrower.push(loadSound('../Audio/HitGrower.ogg'));
    sounds.hitminidiamond.push(loadSound('../Audio/HitMiniDiamond.ogg'));
    sounds.hitlilfella.push(loadSound('../Audio/HitLilfella.ogg'));
    sounds.levelup.push(loadSound('../Audio/LevelUp.ogg'));
    sounds.playerhit.push(loadSound('../Audio/PlayerHit.ogg'));
    sounds.shotfullauto.push(loadSound('../Audio/ShotFullAuto.ogg'));
    sounds.shotshotgun.push(loadSound('../Audio/ShotShotgun.ogg'));
    sounds.shotsingle.push(loadSound('../Audio/ShotSingle.ogg'));
    sounds.shotbit.push(loadSound('../Audio/ShotBit.ogg'));
    sounds.shotblaster.push(loadSound('../Audio/ShotBlaster.ogg'));
    sounds.shotcannon.push(loadSound('../Audio/ShotCannon.ogg'));

    // Boss sounds
    sounds.boss1leftdeath.push(loadSound('../Audio/Boss1LeftDeath.ogg'));
    sounds.boss1lefthit.push(loadSound('../Audio/Boss1LeftHit.ogg'));
    sounds.boss1centerdeath.push(loadSound('../Audio/Boss1CenterDeath.ogg'));
    sounds.boss1centerhit.push(loadSound('../Audio/Boss1CenterHit.ogg'));
    sounds.boss1rightdeath.push(loadSound('../Audio/Boss1RightDeath.ogg'));
    sounds.boss1righthit.push(loadSound('../Audio/Boss1RightHit.ogg'));
    sounds.boss1centerexplode.push(loadSound('../Audio/BOss1CenterExplode.ogg'));

    sounds.beamshot.push(loadSound('../Audio/BeamShot.ogg'));
    sounds.charging.push(loadSound('../Audio/Charging.ogg'));

    sounds.enemyapproach.push(loadSound('../Audio/EnemyApproach.ogg'));
    sounds.enemyapproach2.push(loadSound('../Audio/EnemyApproach2.ogg'));

    // Special sounds for special people
    sounds.pumpupthejam.push(loadSound('../Audio/PumpUpTheJam.ogg'));
    sounds.ilikemoney.push(loadSound('../Audio/ILikeMoney.ogg'));
    sounds.helpmetomcruise.push(loadSound('../Audio/HelpMeTomCruise.ogg'));
    sounds.unlimitedpower.push(loadSound('../Audio/UnlimitedPower.ogg'));
  }

  for (id in upgradeLevels) {
    let upgBase = upgradeLevels[id];
    if (upgBase.baseIcon) {
      console.log("Loading image: " + upgBase.baseIcon);
      upgradeImages[id] = loadImage(upgBase.baseIcon,
        () => console.log("Successfully loaded: " + upgBase.baseIcon),
        () => console.log("FAILED to load: " + upgBase.baseIcon)
      );
      grayscaleUpgradeImages[id] = loadImage(upgBase.baseIcon,
        function (img) {
          img.filter(GRAY);
          console.log("Grayscale created: " + upgBase.baseIcon);
        },
        () => console.log("FAILED to create grayscale: " + upgBase.baseIcon)
      );
    }
  }

  for (let id in attachmentLevels) {
    let attBase = attachmentLevels[id];
    if (attBase.baseIcon) {
      console.log("Loading image: " + attBase.baseIcon);
      attachmentImages[id] = loadImage(attBase.baseIcon,
        () => console.log("Successfully loaded: " + attBase.baseIcon),
        () => console.log("FAILED to load: " + attBase.baseIcon)
      );
      grayscaleAttachmentImages[id] = loadImage(attBase.baseIcon,
        function (img) {
          img.filter(GRAY);
          console.log("Grayscale created: " + attBase.baseIcon);
        },
        () => console.log("FAILED to create grayscale: " + attBase.baseIcon)
      );
    }
  }
}

// Setup Canvas
function setup() {
  loadGame();
  playMusicTrack('menuTheme');
  InitializeAttachmentLevels();
  InitializeUpgradeLevels();
  setInterval(saveGame, 6000); // 10s auto save timer
  createCanvas(1500, 1200); // 1500 1200 // will change to 1280 * 1024
  // UnlockAbility("flash"); // breaks things so disabling for now
  UnlockAbility("shield");
  UnlockAbility("bomb");
  UnlockAbility("autofirebarrage");
  UnlockAbility("spiralshot");
  UnlockAbility("lightningbolt");
  UnlockAbility("singularity");
  UnlockAbility("decimator");
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

// Debug frame/milli counters - will remove later
// DIsplay FPS
function DisplayFPS() {
  fill(200);
  textSize(14);
  textAlign(LEFT);
  text("FPS: " + frameRate().toFixed(1), 10, height - 40);
}

// Display millis
function DisplayMillis() {
  fill(0);
  textSize(14);
  textAlign(LEFT);
  text("Millis: " + millis().toFixed(1), 10, height - 70);
}

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
    ShowSupportChoices();
  }

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
      let healAmount = Math.round(shield_Value * (shift_Percentage / 100)); // rounds off those pesky non-whole numbaz
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

  // Check bosses - use SCREEN coordinates for collision
  for (let boss of bosses) {
    if (!boss.isAlive) continue;
    
    // Convert player to screen coordinates
    let playerScreenX = player_X - cameraX;
    let playerScreenY = player_Y - cameraY;
    
    // Center collision (on screen)
    if (CheckCollision(playerScreenX, playerScreenY, player_Hitbox, boss.screenX, boss.screenY, boss.center.diameter)) {
      DamageCheckByType(100); // Boss damage value
    }
    
    // Left collision (on screen)
    if (CheckCollision(playerScreenX, playerScreenY, player_Hitbox, boss.screenX + boss.left.offsetX, boss.screenY, boss.left.diameter)) {
      DamageCheckByType(100);
    }
    
    // Right collision (on screen)
    if (CheckCollision(playerScreenX, playerScreenY, player_Hitbox, boss.screenX + boss.right.offsetX, boss.screenY, boss.right.diameter)) {
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
  if (justRestarted) {
    ResetAbilityCooldownSystem();
    ResetAllAbilities();
    justRestarted = false;
    return;   
  }
    
  UpdateAbilityCooldown();
  UpdateBarrage();
  UpdateSpiral();
  UpdateDecimator();
  UpdateLightningBolt();
  UpdateSingularity();

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
  
  // ===== UI THAT STAYS FIXED ON SCREEN ===== \\

  DisplayFPS();
  CursorUpdate();
  CreateBorders();
  UpdateHud();        
  VictoryMessage();
  fill(100);
  textSize(14);
  textAlign(LEFT);
  DisplayMillis();
  text("Press Z to pause", 10, height - 20);  
  
}

// `` -- __ DRAW __ -- `` \\  What is my purpose? You call the real functions. Oh. My. God.
function draw() {
    if (game_Screen === "menu") {
    DrawMenuScreen();
    CursorUpdate();
  }
  else if (game_Screen === "shop") {
    DrawShopScreen();
  }
  else if (game_Screen === "shipSelection") {
    DrawShipSelectionScreen();
    HandleShipSelection();
    CursorUpdate();
  }       
  else if (game_Screen === "playing") {
    Drawgame_Screen();
    CursorUpdate();
    CheckShotCollisions();
  }
  else if (game_Screen === "paused") {
    DrawPauseScreen();
    CursorUpdate();
  }
  else if (game_Screen === "gameOver") {
    DrawGameOverScreen();
    CursorUpdate();
  }
  else if (game_Screen === "options") {
    DrawOptionsScreen();
    CursorUpdate();
  }
}
