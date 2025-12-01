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
  if (!drops) return;

  for (let drop of drops) {
    if (random() < drop.chance) {
      switch (drop.item) {
        case "exptoken":
          // Use enemy.exp if drop.amount === null or undefined
          SpawnExpToken(x, y, drop.amount ?? enemy.exp);
          break;
        case "powerup":
          SpawnPowerup(x, y);
          break;
        case "ability":
          SpawnAbility(x, y, drop.abilityName);
          break;
        case "goldtoken":
          SpawnGoldToken(x, y);
          break;
        case "support":
          SpawnSupport(x, y);
          break;
        default:
          SpawnItem(x, y, drop.amount);
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

// Spawns support item
function SpawnSupport(x, y) {
  //  console.log("SpawnSupport called with:", x, y);  
  SpawnItem(x, y, "support");
}

function UpdateItems() {
  for (let i = items_X.length - 1; i >= 0; i--) {
    let itemType = items_Type[i];
    let itemData = itemTable[itemType];
    
    // Convert world coordinates to screen coordinates
    let screenX = items_X[i] - cameraX;
    let screenY = items_Y[i] - cameraY;
    
    // Draw animated item at screen position
    if (itemData && itemData.spriteSheet) {
      let frameIndex = floor((frameCount + items_Frame[i]) / itemData.frameSpeed) % itemData.frames;
      let frameWidth = itemData.spriteSheet.width / itemData.frames;
      let frameHeight = itemData.spriteSheet.height;
      let sx = frameIndex * frameWidth;
      let sy = 0;
      
      // Draw at screen coordinates
      copy(itemData.spriteSheet, sx, sy, frameWidth, frameHeight,
        screenX - 16, screenY - 16, 32, 32);
    }
    
    // Check collision with player (using world coordinates)
    if (dist(items_X[i], items_Y[i], player_X, player_Y) < 40) {
      if (itemType === "powerup") {
        console.log("Infinite cosmic power...");
        ShowPowerupChoices();
        playSound('getpowerup');
      }
      else if (itemType === "exptoken") {
        Exp += items_Amount[i];
        console.log("Collected exp token: +" + items_Amount[i]);
        playSound('getexptoken');
      }
      else if (itemType === "ability") {
        console.log("ABILITY TOKEN NOT YET IMPLEMENTED +" + items_Amount[i]);
        playSound('getability');
      } else if (itemType === "support") {
        ShowSupportChoices();
        console.log("Support get+" + items_Amount[i]);
        playSound('getsupport');
      }
      items_X.splice(i, 1);
      items_Y.splice(i, 1);
      items_Type.splice(i, 1);
      items_Frame.splice(i, 1);
      items_Amount.splice(i, 1);
      continue;
    }
    
    // Remove if too far from player (world space check)
    let distToPlayer = dist(items_X[i], items_Y[i], player_X, player_Y);
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
    case "Power +1": return shot_Power;
    case "Count +1": return shot_Count;
    case "Speed +1": return shot_Speed;
    case "Speed +2": return shot_Speed;
    case "Delay -2": return shot_Delay;
    case "Diameter +2": return shot_Diameter;
    case "Duration +3": return shot_Duration;
    case "Duration +5": return shot_Duration;
    default: return 0;
  }
}

// Gets the "new" outcome of that stat if applied
function getProjectedValue(powerup) {
  const current = getCurrentValue(powerup.name);

  switch (powerup.name) {
    case "Power +1": return current + 1;
    case "Count +1": return current + 1;
    case "Speed +1": return current + 1;
    case "Speed +2": return current + 2;
    case "Delay -2": return Math.max(shot_Delay_MIN, current - 2);
    case "Diameter +2": return current + 2;
    case "Duration +3": return current + 3;
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

//Powerup options
function ShowPowerupChoices() {
  //  if (game_Screen === 'playing' || 'paused'){}

  game_State = false; // pauses game

  // Pick 3 random upgrades from the list
  const shuffled = [...powerupOptions].sort(() => 0.5 - Math.random());
  activePowerupChoices = shuffled.slice(0, 3);

  // Display dialog 
  const dialog = createDiv('');
  dialog.id('powerupDialog');
  dialog.style('position', 'absolute');
  dialog.style('top', '50%');
  dialog.style('left', '50%');
  dialog.style('transform', 'translate(-50%, -50%)');
  dialog.style('background', 'rgba(0,0,0,0.8)');
  dialog.style('padding', '30px');
  dialog.style('color', '#fff');
  dialog.style('font-size', '18px');
  dialog.style('text-align', 'center');
  dialog.style('border-radius', '15px');

  dialog.html('<h2>Gained Powerup!</h2>');

  activePowerupChoices.forEach((powerup, idx) => {
    const currentVal = getCurrentValue(powerup.name);
    const newVal = getProjectedValue(powerup);

    const btn = createButton(`
    ${powerup.name} 
    (${currentVal} → ${newVal})
    `);

    btn.parent(dialog);
    btn.style('margin', '10px');
    btn.mousePressed(() => {
      powerup.apply();
      dialog.remove();
      game_State = true;
      ClampStats();
    });
  });
}

// Shows specific Support Options
function ShowSupportChoices() {
  game_State = false;

  const dialog = createDiv('');
  dialog.id('supportDialog');
  dialog.style('position', 'absolute');
  dialog.style('top', '50%');
  dialog.style('left', '50%');
  dialog.style('transform', 'translate(-50%, -50%)');
  dialog.style('background', 'rgba(0,0,0,0.8)');
  dialog.style('padding', '30px');
  dialog.style('color', '#fff');
  dialog.style('font-size', '18px');
  dialog.style('text-align', 'center');
  dialog.style('border-radius', '15px');

  dialog.html('<h2>Choose Support Unit</h2>');

  supportOptions.forEach((opt) => {
    const currentVal = opt.display();
    const projected = currentVal; // no scaling, unlocked = +1

    const btn = createButton(`
      ${opt.name} 
      (${currentVal} → ${projected})
    `);

    btn.parent(dialog);
    btn.style('margin', '10px');
    btn.mousePressed(() => {
      opt.apply();
      dialog.remove();
      game_State = true;
      ClampStats();
    });
  });
}
