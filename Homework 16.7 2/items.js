// ==++ -- item database, drops, spawns. -- ++== \\

// The item spawner handler
function SpawnItem(x, y, itemType) {
  //  console.log("SpawnItem called - Type:", itemType, "Position:", x, y); 
  items_X.push(x);
  items_Y.push(y);
  items_Type.push(itemType);
  items_Frame.push(0);
  items_Amount.push(0);
}

// Enemy drops handler
function HandleEnemyDrops(x, y, enemy) {
  const drops = dropTable[enemy.type];

  if (!drops) {
    return;
  }

  for (let drop of drops) {
    let roll = random();

    if (roll < drop.chance) {
      switch (drop.item) {
        case "exptoken":
          let amount = drop.amount ?? enemy.exp;
          SpawnExpToken(x, y, amount);
          break;
        case "midexptoken":
          let mamount = drop.amount ?? enemy.exp;
          SpawnMidExpToken(x, y, mamount);
          break;
        case "bigexptoken":
          let bamount = drop.amount ?? enemy.exp;
          SpawnBigExpToken(x, y, bamount);
          break;


        case "goldtoken":
          SpawnGoldToken(x, y);
          break;

        case "biggoldtoken":
          SpawnBigGoldToken(x, y);
          break;

        case "powerup":
          SpawnPowerup(x, y);
          break;
        case "ability":
          SpawnAbility(x, y, drop.abilityName);
          break;
        case "support":
          SpawnSupport(x, y);
          break;

        case "sucker":
          SpawnSucker(x, y);
          break;
        case "exploder":
          SpawnSupport(x, y);
          break;

        default:
          SpawnItem(x, y, drop.amount);
          break;
      }
    }
  }
}

function HandleBossDrops(x, y, bossType) {
  const drops = bossDropTable[bossType];

  if (!drops) {
    console.log("No drops defined for boss type:", bossType);
    return;
  }

  for (let drop of drops) {
    let roll = random();

    if (roll < drop.chance) {
      switch (drop.item) {
        case "bigexptoken":
          let amount = drop.amount ?? 50;
          SpawnBigExpToken(x, y, amount);
          break;
        case "goldtoken":
          SpawnGoldToken(x, y, drop.amount ?? 25);
          break;
        case "ability":
          SpawnAbility(x, y, drop.abilityName);
          break;
        case "sucker":
          SpawnSucker(x, y);
          break;
        case "biggoldtoken":
          SpawnBigGoldToken(x, y, drop.amount ?? 500);
          break;
      }
    }
  }
}

// Spawns the powerup
function SpawnPowerup(x, y) {
  SpawnItem(x, y, "powerup");
}

// Spawns the Ability
function SpawnAbility(x, y, abilityType) {
  items_X.push(x);
  items_Y.push(y);
  items_Type.push("ability");
  items_Frame.push(0);
  items_Amount.push(abilityType);  // Store the ability type
}

// spawns the exp token
function SpawnExpToken(x, y, amount) {
  items_X.push(x);
  items_Y.push(y);
  items_Type.push("exptoken");
  items_Frame.push(0);
  items_Amount.push(amount);
}

function SpawnMidExpToken(x, y, amount) {
  items_X.push(x);
  items_Y.push(y);
  items_Type.push("midexptoken");
  items_Frame.push(0);
  items_Amount.push(amount);
}

function SpawnBigExpToken(x, y, amount) {
  items_X.push(x);
  items_Y.push(y);
  items_Type.push("bigexptoken");
  items_Frame.push(0);
  items_Amount.push(amount);
}

// Spawns support item
function SpawnSupport(x, y) {
  SpawnItem(x, y, "support");
}

// Goldtoken spawner
function SpawnGoldToken(x, y, amount) {
  const goldAmount = amount ?? 10; // Default to 10 gold if not specified
  items_X.push(x);
  items_Y.push(y);
  items_Type.push("goldtoken");
  items_Frame.push(0);
  items_Amount.push(goldAmount);
}

// Big Goldtoken spawner
function SpawnBigGoldToken(x, y, amount) {
  const goldAmount = amount ?? 500; // Default to 500 gold if not specified
  items_X.push(x);
  items_Y.push(y);
  items_Type.push("biggoldtoken");
  items_Frame.push(0);
  items_Amount.push(goldAmount);
}

// Exploder spawner
function SpawnExploder(x, y) {
  items_X.push(x);
  items_Y.push(y);
  items_Type.push("exploder");
  items_Frame.push(0);
  items_Amount.push(0); // Explosders don't need an amount, they're just spawned
}

// Sucker spawner
function SpawnSucker(x, y) {
  items_X.push(x);
  items_Y.push(y);
  items_Type.push("sucker");
  items_Frame.push(0);
  items_Amount.push(0); // Suckers don't need an amount, they just suck
}

function UpdateItems() {
  for (let i = items_X.length - 1; i >= 0; i--) {
    let itemType = items_Type[i];
    let itemData = itemTable[itemType];

    // Calculate distance to player
    let distToPlayer = dist(items_X[i], items_Y[i], player_X, player_Y);

    // If item is within absorption radius, pull it toward player
    if (distToPlayer < itemAbsorptionRadius && distToPlayer > 0) {
      let angle = atan2(player_Y - items_Y[i], player_X - items_X[i]);
      items_X[i] += cos(angle) * itemAbsorptionSpeed;
      items_Y[i] += sin(angle) * itemAbsorptionSpeed;
    }

    // Draw at world coords
    if (itemData && itemData.spriteSheet) {
      let frameIndex = floor((frameCount + items_Frame[i]) / itemData.frameSpeed) % itemData.frames;
      let frameWidth = itemData.spriteSheet.width / itemData.frames;
      let frameHeight = itemData.spriteSheet.height;
      let sx = frameIndex * frameWidth;
      let sy = 0;

      copy(
        itemData.spriteSheet,
        sx, sy,
        frameWidth, frameHeight,
        items_X[i] - 16, items_Y[i] - 16,
        32, 32
      );
    }
    // Recalculate distance after moving item (for final pickup check)
    distToPlayer = dist(items_X[i], items_Y[i], player_X, player_Y);

    // loots item when it gets close enough
    if (distToPlayer < pickupRadius) {
      if (itemType === "powerup") {
        QueuePowerupChoices();
        playSound('getpowerup');

      } else if (itemType === "exptoken") {
        Exp += items_Amount[i];
        playSound('getexptoken');

      } else if (itemType === "midexptoken") {
        Exp += items_Amount[i];
        playSound('getexptoken');

      } else if (itemType === "bigexptoken") {
        Exp += items_Amount[i];
        playSound('getexptoken');

      } else if (itemType === "ability") {
        playSound('getability');

      } else if (itemType === "support") {
        ShowSupportChoices();
        playSound('getsupport');

      } else if (itemType === "goldtoken") {
        Gold += items_Amount[i];
        playSound('getgoldtoken');

      } else if (itemType === "biggoldtoken") {
        Gold += items_Amount[i];
        playSound('getgoldtoken');

      } else if (itemType === "sucker") {
        ActivateSuckerBoost();
        playSound('getsucker');

      } else if (itemType === "exploder") {  // 'sploder not in yet
        // 
        playSound('getexploder');

      }

      // Remove the item
      items_X.splice(i, 1);
      items_Y.splice(i, 1);
      items_Type.splice(i, 1);
      items_Frame.splice(i, 1);
      items_Amount.splice(i, 1);
      continue;
    }

    // Remove if too far from player
    if (distToPlayer > 2000) {
      items_X.splice(i, 1);
      items_Y.splice(i, 1);
      items_Type.splice(i, 1);
      items_Frame.splice(i, 1);
      items_Amount.splice(i, 1);
    }
  }
}

// Will need to retune these later but yolo for now
function getCurrentValue(name) {
  switch (name) {
    case "Power +3": return shot_Power;
    case "Count +1": return shot_Count;
    case "Speed +1": return shot_Speed;
    case "Speed +1": return shot_Speed;
    case "Delay -1": return shot_Delay;
    case "Penetration +1": return shot_Penetration;
    case "Diameter +1": return shot_Diameter;
    case "Duration +2": return shot_Duration;
    case "Duration +5": return shot_Duration;
    default: return 0;
  }
}

// Gets the "new" outcome of that stat if applied
function getProjectedValue(powerup) {
  const current = getCurrentValue(powerup.name);
  switch (powerup.name) {
    case "Power +3": return current + 3;
    case "Count +1": return current + 1;
    case "Speed +1": return current + 1;
    case "Speed +1": return current + 1;
    case "Delay -1": return Math.max(shot_Delay_MIN, current - 1);
    case "Diameter +1": return current + 1;
    case "Duration +2": return current + 3;
    case "Duration +5": return current + 5;
    case "Penetration +1": return current + 1;

    case "Bit": return bits + 1;
    case "Cannon": return cannons + 1;
    case "Blaster": return blasters + 1;
    default: return current;
  }
}

// Called when powerup drops, can be found through unlocks and other means
function UnlockBit() {
  if (supports >= max_Supports) {
    console.log("You cannot handle any more power!");
    return;
  }
  if (bits < max_Bits) {
    AddBit();
    console.log("Aww yeeaahhh!");
  } else {
    console.log("Already have max Bits!");
  }
}

function UnlockCannon() {
  if (supports >= max_Supports) {
    console.log("You cannot handle any more power!");
    return;
  }
  if (cannons < max_Cannons) {
    AddCannon();
    console.log("Yo ho me hartey!");
  } else {
    console.log("Already have max cannons!");
  }
}

function UnlockBlaster() {
  if (supports >= max_Supports) {
    console.log("You cannot handle any more power!");
    return;
  }
  if (blasters < max_Blasters) {
    AddBlaster();
    console.log("Say hello to my little friend!");
  } else {
    console.log("Already have max Blasters!");
  }
}

// used for power ups
function QueuePowerupChoices() {
  QueuePowerChoices();  // Call the new power choice system
}

// Shows specific Support Options
function QueueSupportChoices() {
  const choices = [...supportOptions];
  supportQueue.push(choices);

  if (!activeSupportDialog) {
    ShowNextSupportDialog();
  }
}

// Modify ShowNextSupportDialog function
function ShowNextSupportDialog() {
  if (supportQueue.length === 0) {
    TryResumeGame();
    activeSupportDialog = null;
    return;
  }

  const choices = supportQueue.shift();
  activeSupportDialog = {
    choices: choices
  };

  game_Paused = true;
  game_State = false;

  // Enable click protection when dialog opens
  dialogClickProtection = true;
  dialogClickProtectionTimer = DIALOG_CLICK_PROTECTION_DELAY;
}

// DrawSupportDialog function
function DrawSupportDialog() {
  if (!activeSupportDialog) return;

  // Update click protection timer
  if (dialogClickProtection && dialogClickProtectionTimer > 0) {
    dialogClickProtectionTimer--;
    if (dialogClickProtectionTimer <= 0) {
      dialogClickProtection = false;
    }
  }

  const dialogWidth = 500;
  const dialogHeight = 300;
  const dialogX = width / 2 - dialogWidth / 2;
  const dialogY = height / 2 - dialogHeight / 2;

  // Semi-transparent overlay 
  push();
  resetMatrix();
  fill(0, 0, 0, 150);
  noStroke();
  rect(0, 0, width, height);
  pop();

  // Dialog box
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
  text("Choose Support Unit", width / 2, dialogY + 20);
  pop();

  // Buttons for each support option
  const buttonWidth = 180;
  const buttonHeight = 50;
  const spacing = 20;
  const startY = dialogY + 80;

  activeSupportDialog.choices.forEach((opt, idx) => {
    const btnX = width / 2 - buttonWidth / 2;
    const btnY = startY + idx * (buttonHeight + spacing);
    const currentVal = opt.display();
    const projected = currentVal;
    const label = `${opt.name} (${currentVal} → ${projected})`;

    if (!dialogClickConsumed && !dialogClickProtection) {
      if (DrawButton(btnX, btnY, buttonWidth, buttonHeight, label)) {
        opt.apply();
        ClampStats();
        activeSupportDialog = null;
        ShowNextSupportDialog();
        dialogClickConsumed = true;
      }
    } else {
      push();
      resetMatrix();
      fill(80, 80, 120);
      stroke(150, 150, 150);
      strokeWeight(2);
      rect(btnX, btnY, buttonWidth, buttonHeight, 5);

      fill(200, 200, 200);
      noStroke();
      textSize(18);
      textAlign(CENTER, CENTER);
      textStyle(NORMAL);
      text(label, btnX + buttonWidth / 2, btnY + buttonHeight / 2);
      pop();
    }
  });
  // Shows "wait" message 
  if (dialogClickProtection) {
    push();
    fill(200, 200, 100, 150);
    textSize(16);
    textAlign(CENTER);
    text("Click to select...", width / 2, dialogY + dialogHeight - 30);
    pop();
  }
}

// 
function QueuePowerupChoices() {
  // Pick 3 random upgrades
  const shuffled = [...powerupOptions].sort(() => 0.5 - Math.random());
  const choices = shuffled.slice(0, 3);

  powerupQueue.push(choices);

  // If no dialog is currently open, show the first
  if (!activePowerupDialog) {
    ShowNextPowerupDialog();
  }
}

function ShowNextPowerupDialog() {
  if (powerupQueue.length === 0) {
    // No more dialogs, resume game
    TryResumeGame();
    activePowerupDialog = null;
    return;
  }

  const choices = powerupQueue.shift();
  activePowerupDialog = {
    choices: choices,
    selected: false
  };

  game_Paused = true;
  game_State = false;

  // Enable click protection when dialog opens
  dialogClickProtection = true;
  dialogClickProtectionTimer = DIALOG_CLICK_PROTECTION_DELAY;
}

// creates dialog box for power ups
function DrawPowerupDialog() {
  if (!activePowerupDialog) return;

  // Update click protection timer
  if (dialogClickProtection && dialogClickProtectionTimer > 0) {
    dialogClickProtectionTimer--;
    if (dialogClickProtectionTimer <= 0) {
      dialogClickProtection = false;
    }
  }

  const dialogWidth = 500;
  const dialogHeight = 300;
  const dialogX = width / 2 - dialogWidth / 2;
  const dialogY = height / 2 - dialogHeight / 2;

  // Semi-transparent overlay
  push();
  resetMatrix();
  fill(0, 0, 0, 150);
  noStroke();
  rect(0, 0, width, height);
  pop();

  // Dialog box
  push();
  fill(40, 40, 80);
  stroke(150, 150, 200);
  strokeWeight(2);
  rect(dialogX, dialogY, dialogWidth, dialogHeight, 10);
  fill(255, 200, 100);
  textSize(24);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("Gained Powerup!", width / 2, dialogY + 20);
  pop();

  // Powerup buttons
  const buttonWidth = 180;
  const buttonHeight = 50;
  const spacing = 20;
  const startY = dialogY + 80;

  activePowerupDialog.choices.forEach((powerup, idx) => {
    const btnX = width / 2 - buttonWidth / 2;
    const btnY = startY + idx * (buttonHeight + spacing);
    const currentVal = getCurrentValue(powerup.name);
    const newVal = getProjectedValue(powerup);
    const label = `${powerup.name} (${currentVal} → ${newVal})`;

    // Only process clicks if click not consumed and Support dialog is NOT open
    if (!dialogClickConsumed && !dialogClickProtection && !activeSupportDialog) {
      // Buttons are clickable
      if (DrawButton(btnX, btnY, buttonWidth, buttonHeight, label)) {
        powerup.apply();
        ClampStats();
        activePowerupDialog = null;
        ShowNextPowerupDialog();
        dialogClickConsumed = true;
      }
    } else {
      push();
      resetMatrix();
      fill(80, 80, 120);
      stroke(150, 150, 150);
      strokeWeight(2);
      rect(btnX, btnY, buttonWidth, buttonHeight, 5);
      fill(200, 200, 200);
      noStroke();
      textSize(18);
      textAlign(CENTER, CENTER);
      textStyle(NORMAL);
      text(label, btnX + buttonWidth / 2, btnY + buttonHeight / 2);
      pop();
    }
  });

  if (dialogClickProtection) {
    push();
    fill(200, 200, 100, 150);
    textSize(16);
    textAlign(CENTER);
    text("Click to select...", width / 2, dialogY + dialogHeight - 30);
    pop();
  }
}

// Sucker item drop
function ActivateSuckerBoost() {
  if (!suckerBoostActive) {
    previousAbsorptionRadius = itemAbsorptionRadius;

    itemAbsorptionRadius = 3000;
    suckerBoostActive = true;
    suckerBoostTimer = suckerBoostDuration;

  } else {
    // If already active, reset the timer allows for INFINITE SUCC 
    suckerBoostTimer = suckerBoostDuration;
  }
}

function UpdateSuckerBoost() {
  if (suckerBoostActive) {
    suckerBoostTimer--;

    // Display feedback to player
    if (suckerBoostTimer % 60 === 0) { // Log every second
      console.log("Sucker boost active for " + Math.ceil(suckerBoostTimer / 60) + " more seconds");
    }

    if (suckerBoostTimer <= 0) {
      // Revert to previous absorption radius
      itemAbsorptionRadius = previousAbsorptionRadius;
      suckerBoostActive = false;
      console.log("Sucker boost expired. Absorption radius reverted to: " + itemAbsorptionRadius);
    }
  }
} // End sucker