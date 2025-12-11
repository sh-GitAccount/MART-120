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
  console.log("=== HandleEnemyDrops ===");
  console.log("Enemy type:", enemy.type);
  console.log("Enemy died at world position: X=" + x + ", Y=" + y);
  
  const drops = dropTable[enemy.type];
  console.log("Drops available:", drops);
  
  if (!drops) {
    console.log("No drops defined for enemy type:", enemy.type);
    return;
  }

  for (let drop of drops) {
    let roll = random();
    console.log("Drop chance:", drop.chance, "Random roll:", roll, "Success:", roll < drop.chance);
    
    if (roll < drop.chance) {
      console.log(">>> DROP TRIGGERED! Item type:", drop.item);
      switch (drop.item) {
        case "exptoken":
          let amount = drop.amount ?? enemy.exp;
          SpawnExpToken(x, y, amount);
          console.log("Spawned exptoken at:", x, y, "Amount:", amount);
          break;
        case "midexptoken":
          let mamount = drop.amount ?? enemy.exp;
          SpawnMidExpToken(x, y, mamount);
          console.log("Spawned midexptoken at:", x, y, "Amount:", mamount);
          break; 
        case "bigexptoken":
          let bamount = drop.amount ?? enemy.exp;
          SpawnBigExpToken(x, y, bamount);
          console.log("Spawned bigexptoken at:", x, y, "Amount:", bamount);
          break;                   


        case "goldtoken":
          SpawnGoldToken(x, y);
          console.log("Spawned goldtoken at:", x, y);
          break;          
            
        case "powerup":
          SpawnPowerup(x, y);
          console.log("Spawned powerup at:", x, y);
          break;
        case "ability":
          SpawnAbility(x, y, drop.abilityName);
          console.log("Spawned ability at:", x, y);
          break;
        case "support":
          SpawnSupport(x, y);
          console.log("Spawned support at:", x, y);
          break;

        case "sucker":
          SpawnSucker(x, y);
          console.log("Spawned sucker at:", x, y);
          break;
        case "exploder":
          SpawnSupport(x, y);
          console.log("Spawned exploder at:", x, y);
          break;          

        default:
          SpawnItem(x, y, drop.amount);
          console.log("Spawned generic item at:", x, y);
          break;
      }
    }
  }
  console.log("Total items after drops:", items_X.length);
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
  console.log("SpawnExpToken - Adding item at world coordinates X=" + x + ", Y=" + y + ", Amount=" + amount);
  items_X.push(x);
  items_Y.push(y);
  items_Type.push("exptoken");
  items_Frame.push(0);
  items_Amount.push(amount);
}

function SpawnMidExpToken(x, y, amount) {
  console.log("SpawnMidExpToken - Adding item at world coordinates X=" + x + ", Y=" + y + ", Amount=" + amount);
  items_X.push(x);
  items_Y.push(y);
  items_Type.push("midexptoken");
  items_Frame.push(0);
  items_Amount.push(amount);
}

function SpawnBigExpToken(x, y, amount) {
  console.log("SpawnBigExpToken - Adding item at world coordinates X=" + x + ", Y=" + y + ", Amount=" + amount);
  items_X.push(x);
  items_Y.push(y);
  items_Type.push("bigexptoken");
  items_Frame.push(0);
  items_Amount.push(amount);
}

// Spawns support item
function SpawnSupport(x, y) {
  //  console.log("SpawnSupport called with:", x, y);  
  SpawnItem(x, y, "support");
}

// Goldtoken spawner
function SpawnGoldToken(x, y, amount) {
  const goldAmount = amount ?? 5; // Default to 5 gold if not specified
  items_X.push(x);
  items_Y.push(y);
  items_Type.push("goldtoken");
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
    
    // Collect item when it gets close enough
    if (distToPlayer < pickupRadius) {
      if (itemType === "powerup") {
        console.log("Collected powerup at world pos:", items_X[i], items_Y[i]);
        ShowPowerupChoices();
        playSound('getpowerup');

      } else if (itemType === "exptoken") {
        console.log("Collected exp token: +" + items_Amount[i], "at world pos:", items_X[i], items_Y[i]);
        Exp += items_Amount[i];
        playSound('getexptoken');

      }  else if (itemType === "midexptoken") {
        console.log("Collected midexp token: +" + items_Amount[i], "at world pos:", items_X[i], items_Y[i]);
        Exp += items_Amount[i];
        playSound('getexptoken');

      }  else if (itemType === "bigexptoken") {
        console.log("Collected big exp token: +" + items_Amount[i], "at world pos:", items_X[i], items_Y[i]);
        Exp += items_Amount[i];
        playSound('getexptoken');

      } else if (itemType === "ability") {
        console.log("ABILITY TOKEN NOT YET IMPLEMENTED +" + items_Amount[i]);
        playSound('getability');

      } else if (itemType === "support") {
        console.log("Collected support at world pos:", items_X[i], items_Y[i]);
        ShowSupportChoices();
        playSound('getsupport');

      } else if (itemType === "goldtoken") {
        console.log("Collected gold token: +" + items_Amount[i], "at world pos:", items_X[i], items_Y[i]);
        Gold += items_Amount[i];
        playSound('getgoldtoken'); 

      } else if (itemType === "sucker") {
        console.log("Collected sucker at world pos:", items_X[i], items_Y[i]);
        ActivateSuckerBoost();
        playSound('getsucker');

      }  else if (itemType === "exploder") {
        console.log("Collected exploder at world pos:", items_X[i], items_Y[i]);
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
    case "Power +2": return shot_Power;
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
    case "Power +2": return current + 2;
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

//Powerup options
function ShowPowerupChoices() {
  //  if (game_Screen === 'playing' || 'paused'){}
  game_State = false; 

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
    const projected = currentVal; 

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