// ==++ -- Handles the ship and player stuff -- ++== \\

// Used to draw the new player/ship stuff isntead of just a little circle
function CreatePlayer() {
  UpdateShipRotation();
  UpdateCurrentRotation();

  push();
  translate(player_X, player_Y);
  rotate(player_Rotation);

  // Draw the big beautiful ship
  imageMode(CENTER);
  image(shipImages[selectedShip], 0, 0, diameter, diameter);

  // Draw bits (orbiting)
  if (bits > 0) {
    let bit1_x = cos(bit_Angle[0]) * 50;
    let bit1_y = sin(bit_Angle[0]) * 50;
    image(bitImage, bit1_x, bit1_y, 32, 32);

    if (bits > 1) {
      let bit2_x = cos(bit_Angle[1]) * 50;
      let bit2_y = sin(bit_Angle[1]) * 50;
      image(bitImage, bit2_x, bit2_y, 32, 32);
    }
  }
  // Draw cannons (fixed)
  if (cannons > 0) {
    image(cannonImage, 20, 20, 26, 26);
    if (cannons > 1) {
      image(cannonImage, 20, -20, 26, 26);
    }
  }
  // Draw blasters (also fixed)
  if (blasters > 0) {
    image(blasterImage, 0, 25, 24, 26);
    if (blasters > 1) {
      image(blasterImage, 0, -25, 24, 26);
    }
  }
  pop();
}

// Adds the bit
function AddBit() {
  if (bits < max_Bits) {
    bits++;
    bit_Angle.push((bits - 1) * (TWO_PI / max_Bits));
    bit_CooldownTimer.push(0);
  } else {
  }
}

// Adds the Cannon 
function AddCannon() {
  if (cannons < max_Cannons) {
    // Alternate: first cannon is left, second is right, will make 3rd be center but later for now do this
    let side = cannons % 2 === 0 ? "left" : "right";
    cannon_Side.push(side);
    cannon_CooldownTimer.push(0);
    cannons++;
  }
}

// Adds the Blaster
function AddBlaster() {
  if (blasters < max_Blasters) {
    blasters++;
    blaster_Angle.push((blasters - 1) * (TWO_PI / max_Blasters));

    blaster_CooldownTimer.push(0);
    blaster_BurstActive.push(false);
    blaster_BurstTimer.push(0);
    blaster_ShotsFired.push(0);
  } else {
  }
}

// initiazies ships stats at game start, applies bonuses, upgrades, attachments etc.
function ApplyShipStats() {
  const stats = shipStats[selectedShip];
  shot_FirePattern = stats.shot_FirePattern;
  shot_Type = stats.shot_Type;
  shot_Speed = stats.shot_Speed;
  shot_Power = stats.shot_Power;
  shot_Count = stats.shot_Count;
  shot_Diameter = stats.shot_Diameter;
  shot_Duration = stats.shot_Duration;
  shot_Delay = stats.shot_Delay;
  cooldown_Reduction = stats.cooldown_Reduction;
  player_Health = stats.player_Health;
  max_Health = stats.player_Health;
  shield_Value = stats.shield_Value;
  player_Speed = stats.player_Speed;
  burstCooldown = stats.burstCooldown;
  shield_Cooldown = stats.shield_Cooldown;
  shot_Penetration = stats.shot_Penetration;
  shipSelected = stats.name;

  health_Growth = stats.health_Growth;
  shield_Growth = stats.shield_Growth;
  bounce_Value = stats.bounce_Value;

  baseMaxHealth = stats.baseMaxHealth;
  baseShieldValue = stats.baseShieldValue;

  // Lock old ability and unlock new one
  const newAbility = shipAbilityMap[shipSelected];
  if (newAbility && !abilities.includes(newAbility)) {
    UnlockAbility(newAbility);
    currentShipAbility = newAbility;
  }

  if (shot_Type === 0) {
    weapon_Type = "Radial";
  } else if (shot_Type === 1) {
    weapon_Type = "Scatter";
  } else if (shot_Type === 2) {
    weapon_Type = "Auto";
  } else if (shot_Type === 3) {
    weapon_Type = "Array";
  }

  // apply all equipped attachment stats
  for (let attachmentId of equippedAttachments) {
    const attachmentData = GetCurrentAttachmentData(attachmentId);
    if (attachmentData && attachmentData.stats) {
      for (let statObj of attachmentData.stats) {
        ApplyStat(statObj.stat, statObj.value);
      }
    }
    if (attachmentData && attachmentData.conversion) {
      ApplyConversion(
        attachmentData.conversion.fromStat,
        attachmentData.conversion.toStat,
        attachmentData.conversion.percentage
      );
    }
  }

  ApplyAllUnlockedUpgrades();
  RecalculateConversions();
  ClampStats();
}

// Apply all unlocked upgrades to player stats
function ApplyAllUnlockedUpgrades() {
  for (let upgradeId in upgradeLevels_Current) {
    const level = upgradeLevels_Current[upgradeId] || 0;
    if (level >= 0) {
      const upgradeData = GetUpgradeLevelData(upgradeId, level);
      if (upgradeData && upgradeData.stats) {
        for (let statObj of upgradeData.stats) {
          ApplyStat(statObj.stat, statObj.value);
        }
      }
    }
  }
}

// Update to the ship selection screen
function HandleShipSelection() {
  if (keyIsDown(LEFT) && shipSelectionDelayCounter <= 0) {
    selectedShip--; playSound('select');
    if (selectedShip < 1) selectedShip = 4;
    shipSelectionDelayCounter = 10;
  }
  if (keyIsDown(RIGHT) && shipSelectionDelayCounter <= 0) {
    selectedShip++; playSound('select');
    if (selectedShip > 4) selectedShip = 1;
    shipSelectionDelayCounter = 10;
  }
  if (keyIsDown(81) && shipSelectionDelayCounter <= 0) {
    selectedShip--; playSound('select');
    if (selectedShip < 1) selectedShip = 4;
    shipSelectionDelayCounter = 10;
  }
  if (keyIsDown(69) && shipSelectionDelayCounter <= 0) {
    selectedShip++; playSound('select');
    if (selectedShip > 4) selectedShip = 1;
    shipSelectionDelayCounter = 10;
  }

  if (keyIsPressed) {
    if (key === '1') selectedShip = 1;
    if (key === '2') selectedShip = 2;
    if (key === '3') selectedShip = 3;
    if (key === '4') selectedShip = 4;
  }

  if (mouseIsPressed && shipSelectionDelayCounter <= 0) {
    const shipSpacing = width / 5;
    const startX = width / 10;
    const shipY = height / 2;
    const boxSize = 120;

    for (let i = 1; i <= 4; i++) {
      const x = startX + (i - 1) * shipSpacing;
      const clickArea = boxSize / 2 + 20;

      if (Math.abs(mouseX - x) < clickArea &&
        Math.abs(mouseY - shipY) < clickArea) {
        selectedShip = i;
        playSound('select');
        ApplyShipStats();
        DetermineFirePattern();
        shipSelectionDelayCounter = 20;
        break;
      }
    }
  }
  shipSelectionDelayCounter--;
}

// Gets the orientation of the ship
function UpdateShipRotation() {
  // Check which movement keys are pressed. Don't ask me how the math for this stuff works I have no idea.
  let moveX = 0;
  let moveY = 0;
  if (keyIsDown(w)) moveY -= 1;  // Moving up
  if (keyIsDown(s)) moveY += 1;  // Moving down
  if (keyIsDown(a)) moveX -= 1;  // Moving left
  if (keyIsDown(d)) moveX += 1;  // Moving right  

  if (moveX !== 0 || moveY !== 0) {
    player_TargetRotation = atan2(moveY, moveX);
  }
}

// compares and updates the ship orientation
function UpdateCurrentRotation() {
  let diff = player_TargetRotation - player_Rotation;

  while (diff > PI) diff -= TWO_PI;
  while (diff < -PI) diff += TWO_PI;

  if (Math.abs(diff) > 0.01) {
    player_Rotation += diff * player_RotationSpeed;
  } else {
    player_Rotation = player_TargetRotation;  // quick updater to finish the spinny
  }
}

// Rotation handler for ship and support units to "attempt" to keep them in sync.
function RotatePoint(x, y, angle) {
  let rotatedX = x * cos(angle) - y * sin(angle);
  let rotatedY = x * sin(angle) + y * cos(angle);
  return { x: rotatedX, y: rotatedY };
}

function MovePlayer() {
  if (game_State === true) { 
    if (keyIsDown(SHIFT)) { 
      currentSpeed = 5 * 1.5; 
      is_Boosting = true; 
    } else {
      currentSpeed = 5; 
      is_Boosting = false;
    }
    
    let bossAlive = bosses.length > 0 && bosses[0].isAlive;
    
    if (keyIsDown(s)) { player_Y += currentSpeed; } 
    else if (keyIsDown(w)) { player_Y -= currentSpeed; }
    
    if (keyIsDown(d)) { player_X += currentSpeed; } 
    else if (keyIsDown(a)) { player_X -= currentSpeed; }
    
    // Constrain player to screen if boss is alive
    if (bossAlive) {
      player_X = constrain(player_X, cameraX + 50, cameraX + width - 50);
      player_Y = constrain(player_Y, cameraY + 100, cameraY + height - 50);
    }
    
    frame_Time++;
    diameter += grow_Speed;
    if (diameter >= 58 || diameter <= 55) {
      grow_Speed *= -1;
    }
    
    // Only update camera if no boss is alive
    if (!bossAlive) {
      cameraX = player_X - width / 2;
      cameraY = player_Y - height / 2;
    }
  }
}

// Draws the magical energy shield bubble around the glorious ship sprite.
function DrawShield() {
  if (!shield_Active || shield_Hit) {
    return;
  }
  
  let pulseAmount = sin(frameCount * 0.05) * 3;
  fill(60, 60, 200, 40);
  stroke(0, 255, 100, 75);
  strokeWeight(2);
  circle(player_X, player_Y, player_Hitbox + pulseAmount);
  // creates a brighter outline
  stroke(100, 255, 150, 75);
  strokeWeight(1);
  circle(player_X, player_Y, player_Hitbox + pulseAmount);
}


// Shield updater for energy shield
function UpdateShield() {
  if (shield_Cooldown_Timer > 0) {
    shield_Cooldown_Timer--;
  } else {
    shield_Active = true;
    shield_Hit = false;
  }
  // Update damage display timer (for visual feedback)
  if (shield_Display_Timer > 0) {
    shield_Display_Timer--;
  } else {
    shield_Damage_Display = 0;
  }
}

// Checks to see how much damage the shield will prevent
function HitShield(damage) {
  if (!shield_Active || shield_Hit) {
    return damage;
  }
  shield_Hit = true;
  let remainingDamage = damage - shield_Value;
  if (remainingDamage < 0) {
    remainingDamage = 0;
  }
  // Once hit, triggers the cd
  shield_Cooldown_Timer = shield_Cooldown;
  shield_Active = false;
  shield_Damage_Display = shield_Value;  // Show how much was absorbed
  shield_Display_Timer = 90;  // Show for 30 frames (~0.5 seconds)  
  return remainingDamage;
}




