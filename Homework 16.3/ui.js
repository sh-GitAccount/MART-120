// ==++ -- User interface, menus, etc -- ++== \\

// Button Helperouter
function DrawButton(x, y, w, h, label) {
  // Button background
  fill(100, 150, 255);
  stroke(200);
  strokeWeight(2);
  rect(x, y, w, h);

  // Button text
  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);

  // Check if mouse is over button
  if (mouseIsPressed &&
    mouseX > x && mouseX < x + w &&
    mouseY > y && mouseY < y + h) {
    return true;
  }
  return false;
}

// Creates the main menu screen when the game is first loaded
function DrawMenuScreen() {
  enemies = [];
  background(20, 20, 40);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(80);
  textStyle(BOLD);
  text("SHOOT THE THINGS!", width / 2, height / 3);

  textSize(24);
  textStyle(NORMAL);
  text("Click START to begin, or press SPACE", width / 2, height / 2 - 50);

  // Draw START and SHOP buttons visually 
  DrawButton(width / 2 - 75, height / 2 + 50, 150, 60, "START");
  DrawButton(width / 2 - 75, height / 2 + 120, 150, 60, "SHOP");

  textSize(24);
  fill(150);
  stroke(20, 200, 175);
  strokeWeight(2)
  text("Shoot the bad guys, don't get hit!", width / 2, height - 100);
  
  text("Use WASD to move, Click to Shoot, Shift to Crawl. Q and E to cycle between abilities, F to use ability, Z to open Menu.", width / 2, height - 60);

  fill(225);
  stroke(120, 200, 105);
  textSize(12);
  strokeWeight(0);
  textAlign(CENTER);
  text("Music by Josh Lim", width / 2, height - 20);
}

// creates the shop screen from menu
function DrawShopScreen() {
  background(20);

  textAlign(CENTER);
  textSize(48);
  fill(255);
  text("SHOP", width / 2, 60);

  textSize(22);
  text("Total Gold: " + totalGold, width / 2, 110);

  const rows = attachmentGrid.length;
  const cols = attachmentGrid[0].length;
  const cellSize = 120;
  const gap = 10;
  const gridWidth = cols * cellSize + (cols - 1) * gap;
  const startX = width / 2 - gridWidth / 2;
  const startY = 150;

  let hoveredAttachment = null;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = attachmentGrid[r][c];
      const attBase = GetAttachmentData(id);
      const attCurrent = GetCurrentAttachmentData(id);
      const x = startX + c * (cellSize + gap);
      const y = startY + r * (cellSize + gap);

      const isHovered = mouseX > x && mouseX < x + cellSize &&
        mouseY > y && mouseY < y + cellSize;
      if (isHovered && !shopConfirmOpen) hoveredAttachment = id; // Don't update hover while confirmation is open otherwise bad things happen

      // Background
      fill(50);
      stroke(100);
      strokeWeight(2);
      rect(x, y, cellSize, cellSize, 10);

      // Icon drawer
      if (!attachments.includes(id)) {
        tint(150);
        if (grayscaleAttachmentImages[id]) image(grayscaleAttachmentImages[id], x + 10, y + 10, cellSize - 20, cellSize - 20);
      } else {
        noTint();
        if (attachmentImages[id]) image(attachmentImages[id], x + 10, y + 10, cellSize - 20, cellSize - 20);
      }
      noTint();

      if (!attachments.includes(id) && attCurrent.cost) {
        fill(255, 200, 50);
        textSize(16);
        textAlign(CENTER, BOTTOM);
        text(attCurrent.cost + "g", x + cellSize / 2, y + cellSize - 8);
      } else if (attachments.includes(id)) {
        const currentLevel = attachmentLevels_Current[id] || 0;
        const isMaxLevel = IsAttachmentMaxLevel(id);
        fill(isMaxLevel ? 100 : 50, 200, 100);
        textSize(16);
        textAlign(CENTER, BOTTOM);
        text("LV " + currentLevel, x + cellSize / 2, y + cellSize - 8);
      }
    }
  }

  if (!shopConfirmOpen && hoveredAttachment !== null && mouseIsPressed && shopMouseReleased) {
    const attCurrent = GetCurrentAttachmentData(hoveredAttachment);
    const isMaxLevel = IsAttachmentMaxLevel(hoveredAttachment);
    
    if (!attachments.includes(hoveredAttachment) && totalGold < attCurrent.cost) {
      playSound("error");
    }
    else if (attachments.includes(hoveredAttachment) && !isMaxLevel) {
      const nextCost = GetNextUpgradeCost(hoveredAttachment);
      if (totalGold < nextCost) {
        playSound("error");
      } else {
        shopSelectedAttachment = hoveredAttachment;
        shopConfirmOpen = true;
        playSound("equipattachment");
      }
    }
    else {
      shopSelectedAttachment = hoveredAttachment;
      shopConfirmOpen = true;
      playSound("equipattachment");
    }
    
    shopMouseReleased = false;
  }
  if (!mouseIsPressed) shopMouseReleased = true;

  // Draw tooltip OR confirmation box case dependent
  if (shopConfirmOpen && shopSelectedAttachment !== null) {
    // Draw confirmation box in tooltip style
    drawShopConfirmationTooltip(shopSelectedAttachment, startX, startY, rows, cols, cellSize, gap, gridWidth);
  } else if (hoveredAttachment !== null) {
    // Draw regular tooltip
    const tooltipX = startX;
    const tooltipY = startY + rows * (cellSize + gap) + 20;
    const tooltipWidth = gridWidth;
    drawStaticShopTooltip(hoveredAttachment, tooltipX + tooltipWidth / 2, tooltipY);
  }

  if (!shopConfirmOpen && DrawButton(width / 2 - 150, height - 80, 300, 50, "BACK")) {
    game_Screen = "menu";
    playSound("removeattachment");
  }
}

// TOoltip for shop screen
function drawStaticShopTooltip(attachmentId, gridCenterX, y) {
  if (!attachmentId) return;
  const attBase = GetAttachmentData(attachmentId);
  const attCurrent = GetCurrentAttachmentData(attachmentId);
  const isOwned = attachments.includes(attachmentId);
  const currentLevel = attachmentLevels_Current[attachmentId] || 0;
  const isMaxLevel = IsAttachmentMaxLevel(attachmentId);

  const boxWidth = 450;
  const boxHeight = isOwned ? 150 : 120;
  const padding = 15;

  const boxX = gridCenterX - boxWidth / 2;
  const boxY = y;

  fill(40, 40, 80, 220);
  stroke(150, 150, 200);
  strokeWeight(1);
  rect(boxX, boxY, boxWidth, boxHeight, 10);

  // Name and level
  fill(150, 225, 220);
  textSize(20);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(attBase.name + (isOwned ? " [LV " + currentLevel + "]" : ""), boxX + padding, boxY + padding);

  fill(200);
  textSize(16);
  textAlign(RIGHT, TOP);
  const statusText = isOwned ? (isMaxLevel ? "MAX LEVEL" : "OWNED") : "LOCKED";
  text(statusText, boxX + boxWidth - padding, boxY + padding);

  if (!isOwned && attCurrent.cost) {
    const canAfford = totalGold >= attCurrent.cost;
    fill(canAfford ? 150 : 200, canAfford ? 255 : 100, canAfford ? 100 : 100);
    textSize(16);
    textAlign(LEFT, TOP);
    text("Cost: " + attCurrent.cost + "g", boxX + padding, boxY + padding + 28);
    

  } else if (isOwned && !isMaxLevel) {
    const nextCost = GetNextUpgradeCost(attachmentId);
    const canAfford = totalGold >= nextCost;
    fill(canAfford ? 150 : 200, canAfford ? 255 : 100, canAfford ? 100 : 100);
    textSize(14);
    textAlign(LEFT, TOP);
    text("Upgrade Cost: " + nextCost + "g", boxX + padding, boxY + padding + 28);

  }

  fill(255);
  noStroke();
  textSize(14);
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
  text(attCurrent.itemInfo, boxX + padding, boxY + padding + 50, boxWidth - padding * 2, boxHeight - padding * 2);
}

// Shop confimration box
function drawShopConfirmationTooltip(id, gridStartX, gridStartY, rows, cols, cellSize, gap, gridWidth) {
  const attBase = GetAttachmentData(id);
  const attCurrent = GetCurrentAttachmentData(id);
  const isOwned = attachments.includes(id);
  const isMaxLevel = IsAttachmentMaxLevel(id);

  // Draws confimartion boxin the tooltip window, rather than on top of grid
  const tooltipX = gridStartX;
  const tooltipY = gridStartY + rows * (cellSize + gap) + 20;
  const tooltipWidth = gridWidth;
  const padding = 15;

  // Calculate height needed based on content
  let tooltipHeight = 180; // Base height for buttons and text

  // Draw darker background to distinguish from regular tooltip
  fill(20, 20, 50, 240);
  stroke(150, 200, 255);
  strokeWeight(1);
  rect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 10);

  // Title
  fill(255, 200, 100);
  textSize(20);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("CONFIRM PURCHASE", tooltipX + padding, tooltipY + padding);

  // Item name and info
  fill(150, 225, 220);
  textSize(16);
  textStyle(BOLD);
  text(attBase.name, tooltipX + padding, tooltipY + padding + 28);

  fill(200);
  textSize(14);
  textStyle(NORMAL);

  if (!isOwned) {
    text("Buy for: " + attCurrent.cost + "g", tooltipX + padding, tooltipY + padding + 50);
  } else if (isMaxLevel) {
    fill(150);
    text("Already at MAX LEVEL", tooltipX + padding, tooltipY + padding + 50);
  } else {
    const currentLevel = attachmentLevels_Current[id] || 0;
    const nextCost = GetNextUpgradeCost(id);
    text("Upgrade to Level " + (currentLevel + 1) + " for: " + nextCost + "g", tooltipX + padding, tooltipY + padding + 50);
  }

  // Buttons
  const buttonY = tooltipY + tooltipHeight - 50;
  const buttonWidth = 120;
  const buttonHeight = 40;
  const yesButtonX = tooltipX + padding;
  const noButtonX = tooltipX + tooltipWidth - padding - buttonWidth;

  // YES BUTTON - Only if not maxed
  if (!isMaxLevel) {
    if (DrawButton(yesButtonX, buttonY, buttonWidth, buttonHeight, "YES")) {
      if (!isOwned) {
        if (totalGold >= attCurrent.cost) {
          totalGold -= attCurrent.cost;
          attachments.push(id);
          attachmentLevels_Current[id] = 0;
          playSound("equipattachment");
          saveGame();
        } else {
          playSound("error");
        }
      } else {
        UpgradeAttachment(id);
      }
      shopConfirmOpen = false;
      shopSelectedAttachment = null;
    }
  }

  // NO BUTTON - Always available
  if (DrawButton(noButtonX, buttonY, buttonWidth, buttonHeight, "NO")) {
    shopConfirmOpen = false;
    shopSelectedAttachment = null;
    playSound("error");
  }
}

function TryUnlock(itemKey, cost) {
  if (totalGold >= cost && !attachmentsUnlocked[itemKey]) {
    totalGold -= cost;
    attachmentsUnlocked[itemKey] = true;
    saveGame();
    playSound("equipattachment");
  } else {
    playSound("error");
  }
}

function TryUpgrade(itemKey, cost) {
  if (totalGold >= cost) {
    totalGold -= cost;
    itemLevels[itemKey] = (itemLevels[itemKey] || 0) + 1;
    saveGame();
    playSound("upgrade");
  } else {
    playSound("error");
  }
}

function DrawShipSelectionScreen() {
  background(20, 20, 40);

  // Title
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  textStyle(BOLD);
  text("SELECT YOUR TOTALLY BOSS SHIP", width / 2, 100);

  // Subtitle
  textSize(18);
  fill(150);
  text("Use Q or E or Left-Click to select", width / 2, 160);

  // Ship display parameters
  const shipSpacing = width / 5;  
  const startX = width / 10;      
  const shipY = height / 2;
  const shipPreviewSize = 80;
  const boxSize = 120;

  // Ship selector
  for (let i = 1; i <= 4; i++) {
    push();
    const x = startX + (i - 1) * shipSpacing;
    const ship_Names = {
      1: "Fox",
      2: "Model xr-52",
      3: "Imperial",
      4: "Jackhammer"
    };
    if (selectedShip === i) {
      fill(100, 200, 255, 100);
      stroke(200, 255, 100);
      strokeWeight(4);
    } else {
      fill(50, 50, 100, 80);
      stroke(100, 100, 150);
      strokeWeight(2);
    }
    rect(x - boxSize / 2, shipY - boxSize / 2, boxSize, boxSize, 10);
    let shipImage = shipImages[i];
    if (shipImage) {
      imageMode(CENTER);
      image(shipImage, x, shipY, shipPreviewSize, shipPreviewSize);
    } else {
      fill(200, 100, 100);
      circle(x, shipY, shipPreviewSize);
    }
    pop();
    fill(255);
    textSize(16);
    textAlign(CENTER);
    text(ship_Names[i], x, shipY + 90);
  }

  // Stat box for ship info there has got to be a more efficient way to do these things
  const infoBoxY = shipY + 150;
  const infoBoxHeight = 200;
  fill(40, 40, 80);
  stroke(150, 150, 200);
  strokeWeight(2);
  rect(width / 4 - 120, infoBoxY, 700, infoBoxHeight);

  let infoY = infoBoxY + 15;
  const lineHeight = 18;
  const boxX = width / 4 - 110;
  const stats = shipStats[selectedShip];
  const weaponType = stats.shot_Type === 0 ? "Radial" : stats.shot_Type === 1 ? "Scatter" : "Auto";
  const cooldown = stats.shot_Type === 1 ? stats.shot_Delay * 2.5 : stats.shot_Delay;

  // Title
  fill(150, 225, 220);
  stroke(20, 40, 20);
  strokeWeight(2);
  textSize(24);
  textStyle(BOLD);
  textAlign(LEFT);
  text("Weapon Type: " + weaponType, boxX, infoY);
  infoY += lineHeight + 8;

  // Three columns
  fill(175, 177, 179);
  stroke(65, 75, 100);
  strokeWeight(2);
  textSize(20);
  textStyle(NORMAL);
  drawTextColumns(boxX, infoY, lineHeight, 20,
    "Health: " + stats.player_Health,
    "Shot Power: " + stats.shot_Power,
    "Shot Count: " + stats.shot_Count
  );
  infoY += lineHeight + 4;

  drawTextColumns(boxX, infoY, lineHeight, 20,
    "Shield: " + stats.shield_Value,
    "Shot Speed: " + stats.shot_Speed,
    "Shot Diameter: " + stats.shot_Diameter

  );
  infoY += lineHeight + 4;
  drawTextColumns(boxX, infoY, lineHeight, 20,
    "Speed: " + stats.player_Speed,
    "Shot Duration: " + shot_Duration,
    "Penetration: " + shot_Penetration

  );
  infoY += lineHeight + 12;

  // Ship info
  fill(175, 177, 179);
  stroke(65, 75, 100);
  strokeWeight(2);
  textSize(20);
  textStyle(NORMAL);
  text(stats.ship_Info, boxX, infoY);
  text(stats.ship_Info2, boxX, infoY + lineHeight);
  text(stats.ship_Info3, boxX, infoY + lineHeight * 2);
  fill(250, 190, 200);
  text(stats.ship_Info4, boxX, infoY + lineHeight * 3);

  // Draws instructions at bottom fo screen for ship selection
  fill(100, 200, 100);
  textSize(20);
  textStyle(BOLD);
  textAlign(CENTER);
  text("Press SPACE to start", width / 2, height - 80);

  fill(150, 150, 150);
  textSize(14);
  textStyle(NORMAL);
  text("(Or press Q/E to cycle, 1/2/3 to select, or CLICK)", width / 2, height - 50);
}

// The screen for displaying stats on menu/pause screen
function DrawStatsScreen(startX, startY) {
  fill(150, 225, 220);
  stroke(20, 40, 20,);
  strokeWeight(4);
  textSize(35);
  textStyle(BOLD);
  textAlign(LEFT);
  text("PARAMETERS", startX, startY);

  fill(140, 145, 145);
  stroke(65, 75, 100,);
  strokeWeight(2);
  textSize(32);

  textStyle(NORMAL);
  let statsY = startY + 40;
  let statsSpacing = 40;
  let statsY2 = 120;

  fill(200, 200, 255);
  text(shipSelected + ":", startX, statsY);
  statsY += statsSpacing;

  fill(255);
  text("Level: " + Level, startX + 10, statsY); statsY += statsSpacing;
  text("Health: " + Math.trunc(player_Health) + " / " + Math.trunc(max_Health), startX + 10, statsY); statsY += statsSpacing;
  text("Shield: " + Math.trunc(shield_Value), startX + 10, statsY); statsY += statsSpacing;
  text("Recharge: " + shield_Cooldown, startX + 10, statsY); statsY += statsSpacing + 10;

  fill(200, 200, 255);
  text("WEAPON:", startX, statsY);
  statsY += statsSpacing;

  fill(255);
  text("Type: " + GetWeaponType(), startX + 10, statsY); statsY += statsSpacing;
  text("Power: " + shot_Power, startX + 10, statsY); statsY += statsSpacing - 8;
  textSize(14);
  text("    The amount of damage inflicted by your shots.", startX + 10, statsY); statsY += statsSpacing;
  textSize(32);
  text("Count: " + shot_Count, startX + 10, statsY); statsY += statsSpacing - 8;
  textSize(14);
  text("    The number of shots to be fired.", startX + 10, statsY); statsY += statsSpacing;
  textSize(32);
  text("Speed: " + shot_Speed, startX + 10, statsY); statsY += statsSpacing - 8;
  textSize(14);
  text("    The speed at which your shots travel over their duration.", startX + 10, statsY); statsY += statsSpacing;
  textSize(32);
  text("Shot Delay: " + shot_Delay, startX + 10, statsY); statsY += statsSpacing - 8;
  textSize(14);
  text("    The time between each shot cycle.", startX + 10, statsY); statsY += statsSpacing;
  textSize(32);
  text("Duration: " + shot_Duration, startX + 10, statsY); statsY += statsSpacing - 8;
  textSize(14);
  text("    The amount of time your shots persist.", startX + 10, statsY); statsY += statsSpacing;
  textSize(32);
  text("Penetration: " + shot_Penetration, startX + 10, statsY); statsY += statsSpacing - 8;
  textSize(14);
  text("    Amount of targets your shots can pierce.", startX + 10, statsY); statsY += statsSpacing;
  textSize(32);
  text("Diameter: " + shot_Diameter, startX + 10, statsY); statsY += statsSpacing - 8;
  textSize(14);
  text("    The size of your projectiles.", startX + 10, statsY); statsY += statsSpacing;
  textSize(32);
  text("Cooldown: " + cooldown_Reduction, startX + 10, statsY); statsY += statsSpacing - 8;
  textSize(14);
  text("    The modifier to ability recharge speed. Maximum of 80%.", startX + 10, statsY); statsY += statsSpacing;

  fill(200, 200, 255);
  textSize(32);
  text("Supports:", startX + 350, statsY2);
  statsY2 += statsSpacing;
  fill(255);
  if (bits === max_Bits) { text("MAX BITS!", startX + 360, statsY2); statsY2 += statsSpacing; } else {
    text("Bits: " + bits + " / " + max_Bits, startX + 360, statsY2); statsY2 += statsSpacing;
  }
  if (cannons === max_Cannons) { text("MAX CANNONS!", startX + 360, statsY2); statsY2 += statsSpacing; } else {
    text("Cannons: " + cannons + " / " + max_Cannons, startX + 360, statsY2); statsY2 += statsSpacing;
  }
  if (blasters === max_Blasters) { text("MAX BLASTERS!", startX + 360, statsY2); statsY2 += statsSpacing; } else {
    text("Blasters: " + blasters + " / " + max_Blasters, startX + 360, statsY2);
  }
}


// Creates the pause menu stat/attachment screen
function DrawAttachmentsScreen(startX, startY) {
  fill(255);
  textAlign(LEFT);
  textSize(24);
  textStyle(BOLD);
  strokeWeight(2);
  text("ATTACHMENTS", startX, startY);
  textSize(16);
  textStyle(NORMAL);
  fill(150);
  strokeWeight(1);
  text("(Max: " + maxEquipped + "/" + MAX_EQUIPPED_LIMIT + ")", startX, startY + 28);
  
  // Grid setup
  const gridStartX = startX;
  const gridStartY = startY + 50;
  const cellSize = 120;
  const cellSpacing = 5;
  const rows = attachmentGrid.length;
  const cols = attachmentGrid[0].length;
  const rowLabels = ['A', 'B', 'C', 'D'];
  
  // Reset hover
  hoveredAttachment = null;
  
  // Draw grid
  for (let row = 0; row < rows; row++) {
    fill(200, 200, 255);
    textAlign(RIGHT, CENTER);
    textSize(10);
    text(rowLabels[row], gridStartX - 15, gridStartY + row * (cellSize + cellSpacing) + cellSize / 2);
    
    for (let col = 0; col < cols; col++) {
      const attachmentId = attachmentGrid[row][col];
      const x = gridStartX + col * (cellSize + cellSpacing);
      const y = gridStartY + row * (cellSize + cellSpacing);
      
      // Hover detection ONLY  for tooltip and such
      if (mouseX > x && mouseX < x + cellSize &&
        mouseY > y && mouseY < y + cellSize) {
        hoveredAttachment = attachmentId;
      }
      
      DrawAttachmentCell(x, y, cellSize, attachmentId);
    }
  }
  fill(255, 255, 255);
  noStroke();
  // Column labels
  textAlign(CENTER, TOP);
  for (let col = 0; col < cols; col++) {
    fill(200, 200, 255);
    textSize(10);
    text(col + 1, gridStartX + col * (cellSize + cellSpacing) + cellSize / 2, gridStartY - 15);
  }
  
  // Equipped list below grid
  const listY = gridStartY + rows * (cellSize + cellSpacing) + 20;
  fill(200, 200, 255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("EQUIPPED:", startX, listY);
  
  textSize(18);
  fill(255);
  for (let i = 0; i < maxEquipped; i++) {
    if (equippedAttachments[i]) {
      const id = equippedAttachments[i];
      text((i + 1) + ". " + GetAttachmentForDisplay(id).name, startX + 10, listY + 40 + i * 18);
    } else {
      fill(100);
      text((i + 1) + ". [Empty]", startX + 10, listY + 40 + i * 18);
      fill(255);
    }
  }
  
  // Tooltip anchored below the grid (static position)
  if (hoveredAttachment !== null) {
    drawPauseAttachmentTooltip(
      hoveredAttachment,
      gridStartX,
      gridStartY,
      rows,
      cols,
      cellSize,
      cellSpacing,
      maxEquipped
    );
  }
}

// --- PAUSE MENU ATTACHMENT TOOLTIP ---
function drawPauseAttachmentTooltip(attachmentId, gridStartX, gridStartY, rows, cols, cellSize, cellSpacing, maxEquipped) {
  if (!attachmentId) return;

  const att = GetAttachmentForDisplay(attachmentId);

  // Tooltip position below grid + equipped list
  const listY = gridStartY + rows * (cellSize + cellSpacing) + 60;
  const tooltipX = gridStartX;
  const tooltipY = listY + maxEquipped * 18 + 20; // padding below equipped list
  const tooltipWidth = cols * (cellSize + cellSpacing);
  const tooltipHeight = 100; // fixed height
  const padding = 15;

  fill(40, 40, 80, 220);
  stroke(150, 150, 200);
  strokeWeight(1);
  rect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8);

  // Name
  fill(150, 225, 220);
  textSize(18);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(att.name, tooltipX + padding, tooltipY + padding);

  // itemInfo
  textStyle(NORMAL);
  textSize(14);
  fill(230);
  text(att.itemInfo, tooltipX + padding, tooltipY + padding + 30, tooltipWidth - padding * 2, tooltipHeight - padding * 2);
}

function DrawGameOverScreen() {
  background(40, 10, 10);

  fill(255, 100, 100);
  textAlign(CENTER, CENTER);
  textSize(80);
  textStyle(BOLD);
  text("WHY IS DEAD?", width / 2, height / 3);

  fill(255);
  textSize(32);
  text("Level: " + Level, width / 2, height / 2 - 80);
  text("Experience: " + Exp, width / 2, height / 2 - 30);

  textSize(20);
  text("Click RESTART or press SPACE", width / 2, height / 2 + 60);

  // Draw pesky RESTART button
  if (DrawButton(width / 2 - 80, height / 2 + 120, 160, 50, "RESTART")) {
    RestartGame();
  }

}

function DrawBackgroundLayers() {

  if (!nebulaOff) {
  DrawGridLayer();  
  DrawStarLayer();    
  DrawNebulaLayer();
  } else 
  background(0,0,0);
  DrawGridLayer();  
  DrawStarLayer();    
}

function DrawGridLayer() {
  let camX = cameraX * gridParallax;
  let camY = cameraY * gridParallax;

  stroke(80, 40);     
  strokeWeight(1);
  noFill();

  let gridSize = 90; // 45 
  let startX = floor(camX / gridSize) * gridSize;
  let startY = floor(camY / gridSize) * gridSize;

  for (let x = startX; x < camX + width + gridSize; x += gridSize) {
    for (let y = startY; y < camY + height + gridSize; y += gridSize) {
      let screenX = x - camX;
      let screenY = y - camY;
      rect(screenX, screenY, gridSize, gridSize);
    }
  }
}

// Adds randomized jitter and visuals to background, adds some nice flavor to marinate in
function DrawNebulaLayer() {
  let camX = cameraX * nebulaParallax;
  let camY = cameraY * nebulaParallax;

  let cellSize = 50; // 50
  let startX = floor(camX / cellSize) * cellSize;
  let startY = floor(camY / cellSize) * cellSize;

  noStroke();

  let endX = camX + width + cellSize;
  let endY = camY + height + cellSize;

  for (let x = startX; x < endX; x += cellSize) {
    for (let y = startY; y < endY; y += cellSize) {
      // Cache the noise value so it doesn't change every frame
      // Use a seeded approach based on tile position
      let noiseVal = noise(x * 0.003, y * 0.003); // REDUCED frequency from 0.006
      
      colorMode(HSB);
      let hueVal = map(noiseVal, 0, 1, 180, 260);
      let saturation = map(noiseVal, 0, 1, 25, 60);
      let brightness = map(noiseVal, 0, 1, 10, 65);
      fill(hueVal, saturation, brightness);
      colorMode(RGB);

      let screenX = x - camX;
      let screenY = y - camY;
      rect(screenX, screenY, cellSize, cellSize);
    }
  }
}

// Adds little random shape/colors so it's not a static
function DrawStarLayer() {
  let camX = cameraX * starParallax;
  let camY = cameraY * starParallax;

  let starCell = 18; // how often starws be drawn
  let startX = floor(camX / starCell) * starCell;
  let startY = floor(camY / starCell) * starCell;

  noStroke();

  for (let x = startX; x < camX + width + starCell; x += starCell) {
    for (let y = startY; y < camY + height + starCell; y += starCell) {

      let noiseVal = noise(x * 0.012, y * 0.012);

      // small stars
      if (noiseVal > 0.66) { // how often small star appear - smaller = more
        let opacity = map(noiseVal, 0.80, 1, 100, 255);
        fill(255, 255, 255, opacity);

        let screenX = x - camX + starCell / 2;
        let screenY = y - camY + starCell / 2;

        ellipse(screenX, screenY, random(2, 4));
      }

      // occasional brighter stars
      if (noiseVal > 0.79) {
        fill(255, 255, 255, 255);

        let screenX = x - camX + starCell / 2;
        let screenY = y - camY + starCell / 2;

        ellipse(screenX, screenY, random(3, 6));
      }
    }
  }
}

function CreateBorders() {
  // HUD bar at top - stays fixed on screen
  strokeWeight(1);
  stroke(45, 20, 20);
  fill(100, 55, 150);
  rect(0, 0, width, 50);
  
  //  Draw edge indicators 
  stroke(100, 100, 100);
  strokeWeight(2);
  noFill();
  push();
  translate(-cameraX, -cameraY);
  
  // Draw a large rectangle showing "world boundaries"
  let worldBoundary = 5000;
  rect(-worldBoundary, -worldBoundary, worldBoundary * 2, worldBoundary * 2);
  
  pop();
}

function DrawObstacleZone() {  // think this is pretty much deprecated by now
  push();
  translate(-cameraX, -cameraY);
  
  if (stage === 1) {
    fill(50, 20, 250);
    stroke(220, 20, 20);
    strokeWeight(2);
    rect(width / 4, height / 4, 100, height / 2);
    rect(width / 4, height / 4, width / 2, 100);
    rect(width * .75, height / 4, 100, height / 2);
    rect(width / 4, height / 4 + height / 2 - 100, width / 2, 100);
  }
  
  pop();
}

function UpdateHud() { // will need to adjust this 
  supports = bits + cannons + blasters;
  
  // Set default text properties
  fill(200, 75, 75);
  stroke(225, 225, 120);
  strokeWeight(4);
  textStyle(BOLD);
  textAlign(LEFT);
  
  // Health
  textSize(35);
  text("Health: " + player_Health, 400, 34);
  
  if (player_Health <= 0) {
    playSound('death');
    stopMusicTrack();
    playMusicTrack('deathTheme');
    game_Screen = "gameOver";
    game_State = false;
  }
  
  // Level info
  textSize(34);
  text("Level: " + Level, 220, 34);
  
  textSize(22);
  text("Exp: " + Exp, 5, 15);
  text("Next: " + (exp_Next - Exp), 5, 39);
  
  if (Exp >= exp_Next) {
    LevelUp();
  }
  
  // Supports
  strokeWeight(3);
  textSize(22);
  if (supports === max_Supports) {
    text("MAX SUPPORTS", 600, 34);
  } else if (supports < max_Supports) {
    text("Active Supports: " + supports, 600, 34);
  }
  
  // Weapon and Gold
  textSize(22);
  text("Gold: " + Gold, 1350, 14);
  
  // Ability
  if (abilities.length > 0) {
    let currentAbility = abilityList[abilities[currentAbilityIndex]];
    let cdPercent = abilityOnCooldown ? Math.floor((abilityCooldownTimer / currentAbility.cooldown) * 100) : 0;
    text("Ability: " + currentAbility.name, 1100, 15);
    text("CD: " + cdPercent + "%", 1100, 39);
  } else {
    text("Ability: None", 1100, 40);
  }
  
  // ===== Shield Status in HUD =====
  textSize(20);
  strokeWeight(3);
  textAlign(RIGHT);
  
  if (shield_Active && !shield_Hit) {
    fill(100, 255, 100);
    text("SHIELD: ACTIVE", width - 20, 34);
  } else if (shield_Hit) {
    fill(255, 100, 100);
    let percentLeft = (shield_Cooldown_Timer / shield_Cooldown) * 100;
    text("RECHARGING " + Math.floor(percentLeft) + "%", width - 20, 34);
  } else {
    fill(150, 150, 0);
    let percentLeft = (shield_Cooldown_Timer / shield_Cooldown) * 100;
    text("COOLDOWN " + Math.floor(percentLeft) + "%", width - 20, 34);
  }
  
  // Show damage absorbed in HUD
  if (shield_Display_Timer > 0) {
    fill(100, 255, 100);
    textSize(16);
    textStyle(BOLD);
    text("Absorbed: " + shield_Damage_Display, width - 20, 55);
  }
}

function VictoryMessage() {
  if (exp >= 5000) {
    game_State = false;
    fill(200, 200, 200);
    stroke(5);
    textSize(26);
    text("Victory!!", width / 2 - 50, height / 2 - 50);
  }
}

// Paints bg based on level ( also deprecated methinks)
function PaintBackground() {
  if (stage === 1) {
    background(15, 10, 5);
  }
  else if (stage === 2) {
    background(25, 20, 15);
  }
  else if (stage === 3) {
    background(30, 40, 30);
  }
}

// Hit cooldown timer so you don't die instantly the moment something touches you.
function Immune() {
  if (immune && game_State) {
    fill(200, 75, 75);
    stroke(225, 225, 120,);
    strokeWeight(2);
    textSize(16);
    textStyle(BOLD);
    text("IMMUNE: " + hit_Timer, player_X - 36, player_Y - 18);
    hit_Timer--;
    if (hit_Timer === 0) {
      immune = false;
    }
  }
}

// Determines  equipped weapon type.
function GetWeaponType() {
  if (shot_Type === undefined) return "Unknown";
  if (shot_Type === 0) return "Radial";
  if (shot_Type === 1) return "Shotgun";
  if (shot_Type === 2) return "Auto";
  if (shot_Type === 3) return "Array";

  return "Unknown";
}

// Creates the visual display for the shield being active or not.
function DrawShieldHUD() {
  fill(100, 200, 100);
  textAlign(CENTER);
  textSize(14);
  
  // Position text above the player in world space
  push();
  translate(-cameraX, -cameraY);
  
  let textX = player_X;
  let textY = player_Y - player_Hitbox - 40;
  
  // Shield status
  if (shield_Active && !shield_Hit) {
    fill(100, 255, 100);
    text("SHIELD: ACTIVE", textX, textY);
  } else if (shield_Hit) {
    fill(255, 100, 100);
    let percentLeft = (shield_Cooldown_Timer / shield_Cooldown) * 100;
    text("RECHARGING " + Math.floor(percentLeft) + "%", textX, textY);
  } else {
    fill(150, 150, 0);
    let percentLeft = (shield_Cooldown_Timer / shield_Cooldown) * 100;
    text("COOLDOWN " + Math.floor(percentLeft) + "%", textX, textY);
  }
  
  // Show damage absorbed (also in world space above shield)
  if (shield_Display_Timer > 0) {
    fill(100, 255, 100);
    textSize(16);
    textStyle(BOLD);
    text("Shield Absorbed: " + shield_Damage_Display, textX, textY - 25);
  }
  
  pop();
}
