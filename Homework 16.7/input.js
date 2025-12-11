// ==++ -- Used for trackin them clickin n button pressin' -- ++== \\

// Gets key inputs for abilities 
function keyPressed() {
  // Pause toggle
  if (game_Screen === "playing" && (key === 'z' || key === 'Z') && !pauseKeyPressed && !warningActive && !activeSupportDialog && !activePowerupDialog) {
    game_Screen = "paused";
    game_Paused = true;
    game_State = false;
    pauseKeyPressed = true;
  }

  // Resume from pause
  if (game_Screen === "paused" && (key === 'z' || key === 'Z') && !pauseKeyPressed) {
    game_Screen = "playing";
    game_State = true;
    game_Paused = false;
    pauseKeyPressed = true;
  }

  // Handle ship selection screen
  if (game_Screen === "shipSelection" && (key === ' ' || key === 'Enter')) {
    // Start the actual game
    gameStartTime = millis();
    playSound('gamestart');
    stopMusicTrack();
    ApplyShipStats();

    game_Screen = "stageSelection";

    // Reset game state
    Exp = 0;
    totalGold += Gold;
    Gold = 0;
    console.log("Current Gold added to Total Gold value and reset to 0!");

    Level = 1;
    exp_Next = 25;
    time = 0;
    frame_Time = 0;
    currentWave = 0;
    waveStarted = false;

    // Initialize player
    player_X = width / 2;
    player_Y = height / 2;
    player_Rotation = 0;
    player_TargetRotation = 0;
  }

  // Ability key binds, Q, E, F (ONLY during playing)
  if (game_Screen === "playing") {
    if (key === 'q' || key === 'Q') {
      UseShieldAbility();
    }
    if (key === 'e' || key === 'E') {
      ActivateShipAbility();
    }
  }
}

// Checks to see if z has been released to prevent menu opening/closing 299 times in a row
function keyReleased() {
  if (key === 'z' || key === 'Z') {
    pauseKeyPressed = false;
  }
}

// Gets mouse inputs
function mousePressed() {

  // Menu START button very beginning first game screen
  buttonY = height - 80;
  if (game_Screen === "menu") {
    if (DrawButton(width / 2 - 75, height / 2 + 50, 150, 60, "START")) {
      StartGame();
      playSound('confirm');
      return; 
    }
    if (DrawButton(width / 2 - 75, height / 2 + 120, 150, 60, "SHOP")) {
      playSound("confirm");
      game_Screen = "shop";
      return; 
    }
    if (DrawButton(width / 2 - 75, height / 2 + 190, 150, 60, "OPTIONS")) {
      mostRecentScreen = "menu";
      playSound("confirm");
      game_Screen = "options";
      return; 
  }    
  }

  // Pause RESUME button
  if (game_Screen === "paused") {
    HandleAttachmentClick(mouseX, mouseY);
    // RESUME button
    if (mouseX > width / 2 - 200 && mouseX < width / 2 - 110 &&
      mouseY > height - 80 && mouseY < height - 30) {
      game_Screen = "playing";
      game_State = true;
      saveGame();
      return;
    }
     // TITLE SCREEN button - now opens confirmation
    if (mouseX > width - 350 && mouseX < width - 350 + 155 && 
        mouseY > buttonY && mouseY < buttonY + 50) {
      titleScreenConfirmOpen = true;
      playSound("select");
      return;
    }

    // TITLE SCREEN button
    if (mouseX > width - 350 && mouseX < width - 350 + 155 && 
        mouseY > buttonY && mouseY < buttonY + 50) {
      
      if (confirm("Return to Title Screen? Your progress will be saved.")) {
        stopMusicTrack();
        totalGold += Gold;
        Gold = 0;
        console.log("Current Gold added to Total Gold value and reset to 0!");
        playMusicTrack('menuTheme');
        playSound("confirm");
        
        Level = 1;
        Exp = 0;
        exp_Next = 25;
        max_Health = baseMaxHealth;
        player_Health = max_Health;
        stage = 1;
        bits = 0;
        blasters = 0;
        cannons = 0;
        
        game_Screen = "menu";
        saveGame();
      }
      return;
    }
  }
  // Game Over RESTART button
  if (game_Screen === "gameOver") {
    if (DrawButton(width / 2 - 80, height / 2 + 120, 160, 50, "RESTART")) {
        totalGold += Gold;
        Gold = 0;

        total_Kills += Kills;
        Kills = 0;

        damage_Dealt_Total += damage_Dealt;
        damage_Dealt = 0;

        console.log(">>> RESTART BUTTON CLICKED (DrawGameOverScreen)");
        RestartGame();
        stopMusicTrack();
        playMusicTrack('stageTheme');        
        return;
    }
  }
  if (game_Screen === "shop") {
    HandleShopClick(mouseX, mouseY);
    return;
  }
    if (game_Screen === "stageSelection") {
    const stageSpacing = width / 5;
    const startX = width / 10;
    const stageY = height / 2;
    const boxSize = 120;

    for (let i = 1; i <= 4; i++) {
      const x = startX + (i - 1) * stageSpacing;
      const clickArea = boxSize / 2 + 20;

      if (Math.abs(mouseX - x) < clickArea && Math.abs(mouseY - stageY) < clickArea) {
        if (stagesUnlocked[i]) {
          StartStage(i);
          playSound('gamestart');
        } else {
          playSound('error');
        }
        return;
      }
    }

    // Back button
    if (DrawButton(width / 2 - 75, height - 80, 150, 50, "BACK")) {
      game_Screen = "shipSelection";
      playSound("confirm");
    }
  }
}
// confirmation box to return to title
function DrawTitleScreenConfirmation() {
  if (!titleScreenConfirmOpen) return;

  const dialogWidth = 400;
  const dialogHeight = 200;
  const dialogX = width / 2 - dialogWidth / 2;
  const dialogY = height / 2 - dialogHeight / 2;

  // Semi-transparent overlay - RESET COLORS FIRST
  push();
  fill(0, 0, 0, 100);
  noStroke();
  rect(0, 0, width, height);
  pop();

  // Dialog box - RESET COLORS AND SET THEM EXPLICITLY
  push();
  fill(40, 40, 80);
  stroke(150, 150, 200);
  strokeWeight(2);
  rect(dialogX, dialogY, dialogWidth, dialogHeight, 10);

  // Title
  fill(255, 200, 100);
  textSize(24);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("Return to Title Screen?", width / 2, dialogY + 20);
  pop();

  // Message
  push();
  fill(200);
  textSize(16);
  textStyle(NORMAL);
  textAlign(CENTER, TOP);
  text("Your progress will be saved.", width / 2, dialogY + 60);
  text("Continue?", width / 2, dialogY + 85);
  pop();

  // Buttons
  const buttonWidth = 100;
  const buttonHeight = 50;
  const yesButtonX = dialogX + 50;
  const noButtonX = dialogX + dialogWidth - buttonWidth - 50;
  const buttonsY = dialogY + dialogHeight - 80;

  // YES button
  if (DrawButton(yesButtonX, buttonsY, buttonWidth, buttonHeight, "YES")) {
    HandleTitleScreenConfirmation(yesButtonX + buttonWidth / 2, buttonsY + buttonHeight / 2);
  }

  // NO button
  if (DrawButton(noButtonX, buttonsY, buttonWidth, buttonHeight, "NO")) {
    HandleTitleScreenConfirmation(noButtonX + buttonWidth / 2, buttonsY + buttonHeight / 2);
  }
}
function HandleTitleScreenConfirmation(mx, my) {
  const dialogWidth = 400;
  const dialogHeight = 200;
  const dialogX = width / 2 - dialogWidth / 2;
  const dialogY = height / 2 - dialogHeight / 2;
  
  const buttonWidth = 100;
  const buttonHeight = 50;
  const yesButtonX = dialogX + 50;
  const noButtonX = dialogX + dialogWidth - buttonWidth - 50;
  const buttonsY = dialogY + dialogHeight - 80;

  // YES button
  if (mx > yesButtonX && mx < yesButtonX + buttonWidth &&
      my > buttonsY && my < buttonsY + buttonHeight) {
    // Confirmed - go to title screen
    stopMusicTrack();
    totalGold += Gold;
    Gold = 0;
    console.log("Current Gold added to Total Gold value and reset to 0!");
    playMusicTrack('menuTheme');
    playSound("confirm");
    
    Level = 1;
    Exp = 0;
    exp_Next = 25;
    max_Health = baseMaxHealth;
    player_Health = max_Health;
    stage = 1;
    bits = 0;
    blasters = 0;
    cannons = 0;

    game_Screen = "menu";
    titleScreenConfirmOpen = false;
    saveGame();
    return;
  }

  // NO button
  if (mx > noButtonX && mx < noButtonX + buttonWidth &&
      my > buttonsY && my < buttonsY + buttonHeight) {
    // Cancelled - stay in pause menu
    titleScreenConfirmOpen = false;
    playSound("cancel");
    return;
  }
}

// shop click
function HandleShopClick(mx, my) {
  // If confirmation box is open stop
  if (shopConfirmOpen) {
    return; // 
  }

  const cols = attachmentGrid[0].length;
  const cellSize = 120;
  const gap = 10;
  const gridWidth = cols * cellSize + (cols - 1) * gap;
  const startX = width / 2 - gridWidth / 2;
  const startY = 150;
  const rows = attachmentGrid.length;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = attachmentGrid[r][c];
      const attCurrent = GetCurrentAttachmentData(id);
      const x = startX + c * (cellSize + gap);
      const y = startY + r * (cellSize + gap);
      
      if (mx > x && mx < x + cellSize && my > y && my < y + cellSize) {
        // Check if trying to buy unowned item without enough gold
        if (!attachments.includes(id) && totalGold < attCurrent.cost) {
          playSound("cancel");
          return; 
        }
        // Check if trying to upgrade but can't afford it
        const isMaxLevel = IsAttachmentMaxLevel(id);
        if (attachments.includes(id) && !isMaxLevel) {
          const nextCost = GetNextUpgradeCost(id);
          if (totalGold < nextCost) {
            playSound("cancel");
            return; 
          }
        }
        // All checks passed, open confirmation
        shopSelectedAttachment = id;
        shopConfirmOpen = true;
        playSound("select");
        saveGame();
        return; 
      }
    }
  }
}


