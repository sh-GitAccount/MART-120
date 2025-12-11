// ==++ -- Used for handling game state such as saves, loads, resets, etc -- ++== \\

function updateTime(){
  if (game_State)  time++;
  else return;
}

// Save Game
function saveGame() {
  localStorage.setItem('equippedAttachments', JSON.stringify(equippedAttachments));
  localStorage.setItem('attachmentLevels_Current', JSON.stringify(attachmentLevels_Current));  
  localStorage.setItem('upgradeLevels_Current', JSON.stringify(upgradeLevels_Current));
  localStorage.setItem('unlockedUpgrades', JSON.stringify(unlockedUpgrades));
  localStorage.setItem('stagesUnlocked', JSON.stringify(stagesUnlocked));
  localStorage.setItem('stagesCompleted', JSON.stringify(stagesCompleted));
  
  console.log("Game saved!");
  const saveData = {
    totalGold,
    attachments
  };
  localStorage.setItem("myGameSave", JSON.stringify(saveData));
}

// Ye Old Save Loader
function loadGame() {
  equippedAttachments = JSON.parse(localStorage.getItem('equippedAttachments')) || [];
  attachmentLevels_Current = JSON.parse(localStorage.getItem('attachmentLevels_Current')) || {};  
  upgradeLevels_Current = JSON.parse(localStorage.getItem('upgradeLevels_Current')) || {};
  unlockedUpgrades = JSON.parse(localStorage.getItem('unlockedUpgrades')) || [];
  stagesUnlocked = JSON.parse(localStorage.getItem('stagesUnlocked')) || {1: true, 2: false, 3: false, 4: false};
  stagesCompleted = JSON.parse(localStorage.getItem('stagesCompleted')) || {1: false, 2: false, 3: false, 4: false};
  
  const saved = localStorage.getItem("myGameSave");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      totalGold = data.totalGold ?? 0;
      attachments = data.attachments ?? [];
    } catch (e) {
      console.error("Save data corrupted, restoring defaults: ", e);
      resetSave();
      ResetAllArrays();
    }
  } else {
    resetSave();
    ResetAllArrays();
  }
}

// Used to reset save data
function resetSave() {
  console.log("Save file cleared! ")
  upgradeLevels_Current = {};
  unlockedUpgrades = [];
  abilities = [];
  localStorage.removeItem('upgradeLevels_Current');
  localStorage.removeItem('unlockedUpgrades');  
  ResetAllArrays();
  totalGold = 0;
  attachments = [];
  stagesCleared = 0;
  stagesUnlocked = 1;
  saveGame();
  playSound('flash');
}

// Removes all spawned enemies
function ClearAllEnemies() {
  enemies = [];
}

// Game Resetter - DEBUG VERSION
function RestartGame() {
    console.error("=== RESTART STARTED ===");    
    // Force clear everything
    ClearAllEnemies();
    ResetBossProjectiles();
    bossWarningTriggered = false;
    // Clear all shots/projectiles
    shot_X = [];
    shot_Y = [];
    shot_xDistance = [];
    shot_yDistance = [];
    shot_Timer = [];
    shot_Diameter_Array = [];
    shot_SourceType = [];
    shot_Penetration_Array = [];
    shot_Penetration_Remaining = [];
    shot_CollisionCooldown = [];
    shot_HitEnemies = [];
    shot_WavePattern = [];
    shot_WaveAmplitude = [];
    shot_WaveFrequency = [];
    shot_DistanceTraveled = [];
    shot_PowerArray = [];
    shot_RemovalDelay = [];

    Kills = 0;
    damage_Dealt = 0;
    
    // Clear items
    items_X = [];
    items_Y = [];
    items_Type = [];
    items_Frame = [];
    items_Amount = [];
    
    // Clear explosions
    bombExplosions = [];
    
    // Reset abilities
    ResetAllAbilities();
    ResetAbilityCooldownSystem();
    abilities = [];
    currentAbilityIndex = 0;
        
    // Resets sucker activity
    suckerBoostActive = false;
    suckerBoostTimer = 0;
    itemAbsorptionRadius = previousAbsorptionRadius;

    // Reset player stats
    Level = 1;
    Exp = 0;
    Gold = 0;
    exp_Next = 25;
    stage = 1;
    
    const currentShip = shipStats[selectedShip];
    max_Health = currentShip.baseMaxHealth;
    player_Health = max_Health;
    shield_Value = currentShip.baseShieldValue;
    shield_Active = false;
    shield_Hit = false;
    shield_Cooldown_Timer = 0;
    
    // Reset support units
    bits = 0;
    cannons = 0;
    blasters = 0;
    bit_Angle = [];
    bit_CooldownTimer = [];
    cannon_CooldownTimer = [];
    cannon_Side = [];
    blaster_CooldownTimer = [];
    blaster_Angle = [];
    blaster_BurstActive = [];
    blaster_BurstTimer = [];
    blaster_ShotsFired = [];
    
    // Reset position
    player_X = width / 2;
    player_Y = height / 2;
    player_Rotation = 0;
    player_TargetRotation = 0;
    cameraX = player_X - width / 2;
    cameraY = player_Y - height / 2;
    
    gameStartTime = millis();

    // Load stage
    try {
        LoadStage(stage);

    } catch(e) {
        console.error("LoadStage error:", e);
    }
    
    try {
        initWaves(activeWaves);
    } catch(e) {
    }
    
    // Resets waves and spawns and such
    for (let wave of activeWaves) {
      wave.started = false;
      wave.startMillis = 0;
      wave.pauseOffset = 0;
      
      for (let spawn of wave.spawns) {
          spawn.spawnIndex = 0;
          spawn.repeatIndex = 0;
          spawn.nextSpawnTime = spawn.delay || 0.5;
      }
    }

    // SET GAME STATE
    game_State = true;
    game_Screen = "playing";  
    justRestarted = true;    

    console.error("=== RESTART COMPLETE ===");
}

function StartGame() {
  playSound('confirm');
  InitializeAbilityStats();
  // unlocks some things to start with for testing
  //  attachments.push(1); 
  //  attachments.push(2); 
  //  attachments.push(3); 
  //  attachments.push(4); 
  //  attachments.push(5);
  //  attachments.push(6); 
  //  attachments.push(7); 
  //  attachments.push(8);
  //  attachments.push(9); 
  //  attachments.push(10); 
  //  attachments.push(11);
  //  attachments.push(12); 
  //  attachments.push(13);
  //  attachments.push(14); 
  //  attachments.push(15); 
  //  attachments.push(16); 
  //  attachments.push(17); 
  //  attachments.push(18);
  //  attachments.push(19); 
  //  attachments.push(20); 

  game_Screen = "shipSelection";
  selectedShip = 1;
  shipSelectionActive = true;
  game_State = true;
  stage = 1;
  LoadStage();
}

// actually start selected stage
function StartStage(stageNum) {
  gameStartTime = millis();
  stopMusicTrack();
  playMusicTrack('stageTheme');
  
  stage = stageNum;
  LoadStage(stage);
  
  Exp = 0;
  totalGold += Gold;
  Gold = 0;
  
  Level = 1;
  exp_Next = 25;
  time = 0;
  frame_Time = 0;

  player_X = width / 2;
  player_Y = height / 2;
  player_Rotation = 0;
  player_TargetRotation = 0;
  
  bossWarningTriggered = false;

  game_State = true;
  game_Screen = "playing";
}

// Makes the nice cursor reticle and arrow depending on which window is active
function CursorUpdate() {
  if (game_Screen === "menu") {
    if (mouseIsPressed === true) {
      cursor('../Images/Cursor_Pressed.png');
    } else {
      cursor('../Images/Cursor.png');
    }

  } else if (game_Screen === "playing") {
    if (mouseIsPressed === true) {
      cursor('../Images/ReticleClicked.png');
    } else {
      cursor('../Images/Reticle.png');
    }

  } else if (game_Screen === "shipSelection") {
    if (mouseIsPressed === true) {
      cursor('../Images/Cursor_Pressed.png');
    } else {
      cursor('../Images/Cursor.png');
    }

  } else if (game_Screen === "paused") {
    if (mouseIsPressed === true) {
      cursor('../Images/Cursor_Pressed.png');
    } else {
      cursor('../Images/Cursor.png');
    }
  } else if (game_Screen === "gameOver") {
    if (mouseIsPressed === true) {
      cursor('../Images/Cursor_Pressed.png');
    } else {
      cursor('../Images/Cursor.png');
    }
  }
}

function LoadStage(stageNumber = stage) {
    ApplyShipStats();
    console.log("LoadStage called: stage =", stageNumber);

    stage = stageNumber;
    abilities = [];
    
    // Unlock only Shield and the ship ability
    UnlockAbility("shield");
    
    const shipAbilityMap = {
      "Fox": "rapidfirebarrage",
      "Model xr-52": "spiralshot",
      "Imperial": "decimator",
      "Jackhammer": "bomb"
    };
    
    const newAbility = shipAbilityMap[selectedShip];
    if (newAbility) {
      UnlockAbility(newAbility);
      currentShipAbility = newAbility;
    }

    switch(stage) {
        case 1:
            activeWaves = stage1Waves;
            break;
        case 2:
            activeWaves = stage2Waves;
            break;
        case 3:
            activeWaves = stage3Waves;
            break;
        default:
            activeWaves = [];
            break;
    }
    // Start game time (millis counter) because why the fk can't u set this to 0??? like what are u doing javascript
    gameStartTime = millis();

    // Initalizates waves at millis time using offset
    initWaves(activeWaves);

    // Reset player position
    player_X = width / 2;
    player_Y = height / 2;
    player_Rotation = 0;
    player_TargetRotation = 0;

    // Reset player health
    player_Health = max_Health; 

    // Clear items for the new stage
    items_X = [];
    items_Y = [];
    items_Type = [];
    items_Frame = [];
    items_Amount = [];

    // Reset timers
    time = 0;
    frame_Time = 0;
}

// Boss Warning timer
var bossWarning = {
  active: false,
  startTime: 0,
  flashAlpha: 0,
  flashDir: 1,
  duration: 5000,      // total warning length before boss spawns
  fadeOut: false,
  fadeOutAlpha: 255
};

// This is called when you want to trigger the warning/announcer
function triggerBossWarning() {
  bossWarning.active = true;
  bossWarning.startTime = millis();

  stopMusicTrack(1500);
  playSound('enemyapproach2');

  game_State = false; // freeze gameplay
}


function updateBossWarning() {
  if (!bossWarning.active) return;
  let t = millis() - bossWarning.startTime;
  if (!bossWarning.fadeOut) {
    bossWarning.flashAlpha += bossWarning.flashDir * 6;
    if (bossWarning.flashAlpha >= 255) {
      bossWarning.flashAlpha = 255;
      bossWarning.flashDir = -1;
    } else if (bossWarning.flashAlpha <= 0) {
      bossWarning.flashAlpha = 0;
      bossWarning.flashDir = 1;
    }
  }
  push();
  textAlign(CENTER, CENTER);
  textSize(90);
  stroke(255, 200, 30);
  strokeWeight(6);
  fill(255, 0, 0, bossWarning.flashAlpha);
  text("WARNING!", width / 2, height / 2);
  textSize(36);
  stroke(200, 255, 30); 
  strokeWeight(6);
  fill(200, 50, 0, bossWarning.flashAlpha);
  text("A Challenger Approacheth...", width / 2, height / 2 + 80);
  pop();
  
  if (t >= bossWarning.duration && !bossWarning.fadeOut) {
    playSound('enemyapproach');
    playMusicTrack('bosstrack1');

    // Spawn the boss here
    SpawnBoss('boss1', player_X, player_Y);
    bossWarning.fadeOut = true;
  }
  
  if (bossWarning.fadeOut) {
    bossWarning.fadeOutAlpha -= 8;
    if (bossWarning.fadeOutAlpha <= 0) {
      bossWarning.active = false;
      bossWarning.fadeOut = false;
      bossWarning.fadeOutAlpha = 255;
      game_State = true; // resume gameplay
    } else {
      push();
      fill(0, 0, 0, 255 - bossWarning.fadeOutAlpha);
      rect(0, 0, width, height);
      pop();
    }
  }
}

// The "pause" screen with stats and attachments etc
function DrawPauseScreen() {
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);
  DrawStatsScreen(60, 80);
  // Pause Menu attachments
  DrawAttachmentsScreen(width / 2 + 50, 80, {
    showTooltip: true,
    tooltipX: width / 2 - 150,
    tooltipY: height - 180,
    tooltipWidth: 300,
    tooltipHeight: 150
  });
  const buttonY = height - 80;

  // OPTIONS button (leftmost)
  if (DrawButton(width / 2 - 320, buttonY, 90, 50, "OPTIONS")) {
    mostRecentScreen = "playing";
    game_Screen = "options";
    playSound("confirm");
  }
  
  // RESUME button
  if (DrawButton(width / 2 - 200, buttonY, 90, 50, "RESUME")) {
    game_Screen = "playing";
    game_State = true;
    playSound("confirm");
  }
  
  // TITLE SCREEN button (rightmost)
  if (DrawButton(width - 300 - 50, buttonY, 155, 50, "TITLE SCREEN")) {
  titleScreenConfirmOpen = true;
  }
  
  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);
  text("Press Z to resume", width / 2, height - 20);
  DrawTitleScreenConfirmation();
}

// When boss is kill, make do
function updateVictoryScreen() {
  if (!victoryScreen.active) return;

  let elapsed = millis() - victoryScreen.startTime;
  let countdownProgress = elapsed / victoryScreen.countdownDuration;
  victoryScreen.countdownValue = Math.max(0, 10 - Math.floor(countdownProgress * 10));

  push();
  textAlign(CENTER, CENTER);
  textSize(80);
  stroke(100, 255, 100);
  strokeWeight(6);
  fill(100, 255, 100, 200);
  text("VICTORY!", width / 2, height / 2 - 100);

  textSize(60);
  stroke(200, 255, 200);
  strokeWeight(4);
  fill(150, 255, 150, 200);
  text(victoryScreen.countdownValue, width / 2, height / 2 + 50);

  textSize(24);
  fill(200, 255, 200);
  text("Next stage in...", width / 2, height / 2 + 120);
  pop();

  // When countdown reaches 0, transition to victory details
  if (victoryScreen.countdownValue === 0 && !victoryScreen.transitionStarted) {
    victoryScreen.transitionStarted = true;
    game_Screen = "victory";
  }
}

function ResetAllArrays() { // and other stuff too hopefully I will remember to update this when I add/change stuff but probly won't it is waht it is
  // Clear all entities from the world
  enemies = [];
  ResetBossProjectiles();
  bossWarningTriggered = false;
  
  // Clear all items, drops, and pickups
  items_X = [];
  items_Y = [];
  items_Type = [];
  items_Frame = [];
  items_Amount = [];
  
  // Clear all projectiles
  shot_X = [];
  shot_Y = [];
  shot_xDistance = [];
  shot_yDistance = [];
  shot_Timer = [];
  shot_Diameter_Array = [];
  shot_SourceType = [];
  shot_Penetration_Array = [];
  shot_Penetration_Remaining = [];
  shot_CollisionCooldown = [];
  shot_HitEnemies = [];
  shot_WavePattern = [];
  shot_WaveAmplitude = [];
  shot_WaveFrequency = [];
  shot_DistanceTraveled = [];
  shot_PowerArray = [];
  shot_RemovalDelay = [];

  hit_Timer = 0;
  shot_BouncesRemaining = [];
  shot_LastBounceTime = [];

  // Reset shield
  shield_Active = false;
  shield_Hit = false;
  shield_Cooldown_Timer = 0;
  shield_Display_Timer = 0;
  shield_Damage_Display = 0;
  
  // Reset support unit cooldowns
  bit_CooldownTimer = [];
  bit_Angle = [];
  cannon_CooldownTimer = [];
  cannon_Side = [];
  blaster_CooldownTimer = [];
  blaster_Angle = [];
  blaster_BurstActive = [];
  blaster_BurstTimer = [];
  blaster_ShotsFired = [];
  
  // Reset firing/shooting state
  shotTimer = 0;
  burstCooldownTimer = 0;
  fullAutoActive = false;
  fullAutoTimer = 0;
  fullAutoShotsFired = 0;
  
  // Reset misc states
  time = 0;
  frame_Time = 0;

  // errant item sweeper
  items_X = [];
  items_Y = [];
  items_Type = [];
  items_Frame = [];
  items_Amount = [];

  currentWave = 0;
  waveStarted = false;
  time = 0;
  frame_Time = 0;
  bits = 0;
  blasters = 0;
  cannons = 0;
// Reset player position and rotation
  player_X = width / 2;
  player_Y = height / 2;
  player_Rotation = 0;
  player_TargetRotation = 0;
  cameraX = player_X - width / 2;
  cameraY = player_Y - height / 2;
    // Clear bomb explosions
  bombExplosions = [];
  
  // ===== STOP ALL ACTIVE ABILITIES =====
  // Barrage
  barrageShotsRemaining = 0;
  barrageActive = false;
  barrageTimer = 0;
  
  // Decimator - revert penetration boost
  if (decimatorActive && shot_Penetration > 2) {
    shot_Penetration -= 2;
  }
  decimatorShotsRemaining = 0;
  decimatorActive = false;
  decimatorTimer = 0;
  
  // Spiral
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
  
  // Force all ability variables to their reset state
  currentAbilityIndex = 0;
  abilityOnCooldown = false;
  abilityCooldownTimer = 0;


  saveGame();
}