// ==++ -- Used for handling game state such as saves, loads, resets, etc -- ++== \\

function updateTime(){
  if (game_State)  time++;
  else return;
}

// Save Game
function saveGame() {
  localStorage.setItem('equippedAttachments', JSON.stringify(equippedAttachments));
  localStorage.setItem('attachmentLevels_Current', JSON.stringify(attachmentLevels_Current));  
  console.log("Game saved!");
  const saveData = {
    totalGold,
    attachments,
    stagesCleared,
    stagesUnlocked
    
  };
  localStorage.setItem("myGameSave", JSON.stringify(saveData));
}

// Ye Old Save Loader
function loadGame() {
  equippedAttachments = JSON.parse(localStorage.getItem('equippedAttachments')) || [];
  attachmentLevels_Current = JSON.parse(localStorage.getItem('attachmentLevels_Current')) || {};  
  const saved = localStorage.getItem("myGameSave");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      // restore values
      totalGold = data.totalGold ?? 0;
      attachments = data.attachments ?? [];
      stagesCleared = data.stagesCleared ?? 0;
      stagesUnlocked = data.stagesUnlocked ?? 1;
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
        console.error("Stage loaded");
    } catch(e) {
        console.error("LoadStage error:", e);
    }
    
    try {
        initWaves(activeWaves);
        console.error("Waves initialized");
    } catch(e) {
        console.error("initWaves error:", e);
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
  if (DrawButton(width / 2 - 200, buttonY, 90, 50, "RESUME")) {
    game_Screen = "playing";
    game_State = true;
    playSound("confirm");
  }
  if (DrawButton(width - 300 - 50, buttonY, 155, 50, "TITLE SCREEN")) {
    totalGold += Gold;
    Gold = 0;
    console.log("Current Gold added to Total Gold value and reset to 0!");
    playSound("confirm");
    game_Screen = "menu";
  }

  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);
  text("Press Z to resume", width / 2, height - 20);
}

function ResetAllArrays() { // and other stuff too hopefully I will remember to update this when I add/change stuff but probly won't it is waht it is
  // Clear all entities from the world
  enemies = [];
  
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