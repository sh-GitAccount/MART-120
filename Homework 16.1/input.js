// ==++ -- Used for trackin them clickin n button pressin' -- ++== \\

// Gets key inputs for abilities 

function keyPressed() {
  // Pause toggle
  if (game_Screen === "playing" && (key === 'z' || key === 'Z') && !pauseKeyPressed) {
    game_Screen = "paused";
    game_State = false;
    pauseKeyPressed = true;
  }
  // Resume from pause
  if (game_Screen === "paused" && (key === 'z' || key === 'Z') && !pauseKeyPressed) {
    game_Screen = "playing";
    game_State = true;
    pauseKeyPressed = true;
  }

  // Handle ship selection screen
  if (game_Screen === "shipSelection" && (key === ' ' || key === 'Enter')) {
    // Start the actual game
    playSound('gamestart');
    ApplyShipStats();

    game_Screen = "playing";

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
    if (key === 'f' || key === 'F') {
      UseAbility();
    }
    if (key === 'q' || key === 'Q') {
      CycleAbility(1);
    }
    if (key === 'e' || key === 'E') {
      CycleAbility(-1);
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
      return; // EXIT early to prevent other menu clicks
    }
    if (DrawButton(width / 2 - 75, height / 2 + 120, 150, 60, "SHOP")) {
      playSound("confirm");
      game_Screen = "shop";
      return; // EXIT early
    }
  }

  // Pause RESUME button
  if (game_Screen === "paused") {
    // 
    HandleAttachmentClick(mouseX, mouseY);
    // RESUME button
    if (mouseX > width / 2 - 200 && mouseX < width / 2 - 110 &&
      mouseY > height - 80 && mouseY < height - 30) {
      game_Screen = "playing";
      game_State = true;
      saveGame();
      return;
    }

    // MENU button
    if (mouseX > width - 350 && mouseX < width - 350 + 155 && mouseY > buttonY && mouseY < buttonY + 50) {
      game_Screen = "menu";
      Level = 1;
      Exp = 0;
      totalGold += Gold;
      Gold = 0;
      console.log("Current Gold added to Total Gold value and reset to 0!");
      exp_Next = 25;
      max_Health = baseMaxHealth;
      player_Health = max_Health;
      stage = 1;
      bits = 0;
      blasters = 0;
      cannons = 0;

      saveGame();
      return;
    }
  }
  // Game Over RESTART button
  if (game_Screen === "gameOver") {
    if (DrawButton(width / 2 - 80, height / 2 + 120, 160, 50, "RESTART")) {
        console.log(">>> RESTART BUTTON CLICKED (DrawGameOverScreen)");
        RestartGame();
        return;
    }
  }
  if (game_Screen === "shop") {
    HandleShopClick(mouseX, mouseY);
    return;
  }
}

// shop click
function HandleShopClick(mx, my) {
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
          playSound("error");
          return; // Don't open confirmation, just play error sound
        }
        // Check if trying to upgrade but can't afford it
        const isMaxLevel = IsAttachmentMaxLevel(id);
        if (attachments.includes(id) && !isMaxLevel) {
          const nextCost = GetNextUpgradeCost(id);
          if (totalGold < nextCost) {
            playSound("error");
            return; // Don't open confirmation
          }
        }
        // All checks passed, open confirmation
        shopSelectedAttachment = id;
        shopConfirmOpen = true;
        playSound("confirm");
        saveGame();
        return;
      }
    }
  }
}


