// ==++ -- Used for them there atacchy's n whatn't -- ++== \\

// Begin attachmenet helpers
function InitializeAttachmentLevels() {
  BuildAttachmentListFromLevels();
  
  for (let id in attachmentLevels) {
    attachmentLevels_Current[id] = 0; // Start at level 0
  }
}

//attachment functins for unlocks/levels
function GetAttachmentData(id) {
  return attachmentLevels[id];
}

function GetAttachmentLevelData(id, level) {
  const att = attachmentLevels[id];
  return att ? att.levels[level] : null;
}

function GetCurrentAttachmentData(id) {
  const level = attachmentLevels_Current[id] || 0;
  return GetAttachmentLevelData(id, level);
}

function GetNextUpgradeCost(id) {
  const currentLevel = attachmentLevels_Current[id] || 0;
  const nextLevel = currentLevel + 1;
  const nextData = GetAttachmentLevelData(id, nextLevel);  
  return nextData ? nextData.cost : null;
}

function CanUpgradeAttachment(id) {
  const nextCost = GetNextUpgradeCost(id);
  return nextCost !== null && totalGold >= nextCost;
}

function IsAttachmentMaxLevel(id) {
  const maxLevel = 3;
  return (attachmentLevels_Current[id] || 0) >= maxLevel;
}

function UpgradeAttachment(id) {
  if (!attachments.includes(id)) {
    playSound("error");
    return;
  }
  if (IsAttachmentMaxLevel(id)) {
    playSound("error");
    return;
  }
  const nextCost = GetNextUpgradeCost(id); 
  if (totalGold >= nextCost) {
    totalGold -= nextCost;
    goldSpent += nextCost;
    attachmentLevels_Current[id] = (attachmentLevels_Current[id] || 0) + 1;
    playSound("upgrade");  
    saveGame();
    console.log("Upgrade successful!");
  } else {
    playSound("error");
    console.log("Not enough moneyz for buy.");
  }
}

// used to maintain backwards compatability with previous attachmentlist
function BuildAttachmentListFromLevels() {
  attachmentList = {};
  for (let id in attachmentLevels) {
    const attBase = attachmentLevels[id];
    const level0Data = attBase.levels[0];
    
    // Create a simplified entry with base icon and level 0 stats
    attachmentList[id] = {
      name: attBase.name,
      cost: level0Data.cost,
      icon: attBase.baseIcon,
      itemInfo: level0Data.itemInfo,
      stats: level0Data.stats || [],
      conversion: level0Data.conversion || null
    };
  }
}

function GetAttachmentForDisplay(id) {
  if (!attachmentList[id]) {
    BuildAttachmentListFromLevels();
  }
  return attachmentList[id];
}
// END 

// draws main attachment cell grid in equip screen
function DrawAttachmentCell(x, y, size, attachmentId) {
  const attachment = GetAttachmentForDisplay(attachmentId);
  const isEquipped = equippedAttachments.includes(attachmentId);
  const isOwned = attachments.includes(attachmentId);

  if (mouseX > x && mouseX < x + size && mouseY > y && mouseY < y + size && isOwned) {
    hoveredAttachmentId = attachmentId;
    mouseOverAttachmentX = x;
    mouseOverAttachmentY = y;
  }
  if (isEquipped) {
    fill(255, 0, 0);
    strokeWeight(3);
    stroke(255, 100, 100);
  } else if (isOwned) {
    fill(100, 100, 150);
    strokeWeight(1);
    stroke(150, 150, 200);
  } else {
    fill(50, 50, 50);
    strokeWeight(1);
    stroke(80, 80, 80);
  }
  rect(x, y, size, size);

  if (attachment.icon && attachmentImages[attachmentId]) {
    if (isOwned) {
      image(attachmentImages[attachmentId], x + 5, y + 5, size - 10, size - 10);
    } else {
      image(grayscaleAttachmentImages[attachmentId], x + 5, y + 5, size - 10, size - 10);
    }
  }
}

// gets mouse info and click info for determine what do
function HandleAttachmentClick(mouseX, mouseY) {
  const startX = width / 2 + 50;
  const startY = 80;
  const gridStartX = startX;
  const gridStartY = startY + 50;
  const cellSize = 120;
  const cellSpacing = 5;
  const rows = attachmentGrid.length;
  const cols = attachmentGrid[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {

      const x = gridStartX + col * (cellSize + cellSpacing);
      const y = gridStartY + row * (cellSize + cellSpacing);

      if (mouseX > x && mouseX < x + cellSize &&
        mouseY > y && mouseY < y + cellSize) {

        const attachmentId = attachmentGrid[row][col];

        ToggleAttachment(attachmentId);
        return;
      }
    }
  }
}

// try unlock function for attachment shop/upgrades
function TryUnlockAttachment(attachmentId) {
  const att = attachmentList[attachmentId];

  if (totalGold >= att.cost) {
    totalGold -= att.cost;
    goldSpent += att.cost;
    attachments.push(attachmentId);
    playSound("confirm");
    console.log("Unlocked: " + att.name);
  } else {
    playSound("error");
    console.log("GET MORE MONEY!!");
  }
}

// Lets you equip/unequip the attachments
function ToggleAttachment(attachmentId) {
  const attachment = attachmentList[attachmentId];
  if (!attachments.includes(attachmentId)) {
    console.log("Must unlock first!");
    playSound("error");
    return;
  }
  const equippedIndex = equippedAttachments.indexOf(attachmentId);

  if (equippedIndex > -1) {
    UnequipAttachment(equippedIndex);
    playSound("removeattachment");

  } else {
    if (equippedAttachments.length < maxEquipped) {
      EquipAttachment(attachmentId);
      playSound("equipattachment");

    } else {
      console.log("Equipment slots full!");
      playSound("error");
      DetermineFirePattern();
    }
  }
}

function EquipAttachment(attachmentId) {
  equippedAttachments.push(attachmentId);
  const attachmentData = GetCurrentAttachmentData(attachmentId); 

  // Mirror Shots enables bouncing
  if (attachmentId === 12) {
    // shot_Penetration = 0;       Not sure if I like this? It's kind of insane to have both. por que no los dos? si bueno
    // console.log("Mirror Shots equipped - Penetration disabled, Bounces enabled");
  }

  // Apply all stat bonuses from the CURRENT LEVEL data
  if (attachmentData && attachmentData.stats) {
    for (let statObj of attachmentData.stats) {
      ApplyStat(statObj.stat, statObj.value);
    }
  }
  
  // Apply conversions
  if (attachmentData && attachmentData.conversion) {
    ApplyConversion(
      attachmentData.conversion.fromStat,
      attachmentData.conversion.toStat,
      attachmentData.conversion.percentage
    );
  }

  console.log("Equipped: " + GetAttachmentForDisplay(attachmentId).name);
  RecalculateConversions();
  DetermineFirePattern();
  saveGame();
}

// Attachment handling 
function UnequipAttachment(slotIndex) {
  const attachmentId = equippedAttachments[slotIndex];
  const attachmentData = GetCurrentAttachmentData(attachmentId); // Get current level data

  // Special case: Re-enable penetration when Mirror Shots is unequipped
  if (attachmentId === 12) {
    const currentShip = shipStats[selectedShip];
    shot_Penetration = currentShip.shot_Penetration;
   // bounce_Value = 0;
  }

  // Remove all stat bonuses from the CURRENT LEVEL data
  if (attachmentData && attachmentData.stats) {
    for (let statObj of attachmentData.stats) {
      RemoveStat(statObj.stat, statObj.value);
    }
  }
  
  // Remove conversions
  if (attachmentData && attachmentData.conversion) {
    RemoveConversion(
      attachmentData.conversion.fromStat,
      attachmentData.conversion.toStat
    );
  }

  equippedAttachments.splice(slotIndex, 1);
  console.log("Unequipped: " + GetAttachmentForDisplay(attachmentId).name);
  RecalculateConversions();
  DetermineFirePattern();
  saveGame(); 
}

// Apply the stat when attachments change
function ApplyStat(statName, value) {
  if (statName === "shot_Speed_multiply") {
    shot_Speed *= (1 + value);
  } else if (statName === "shot_Delay") {
    shot_Delay += value;
  } else if (statName === "cooldown_Reduction") {
    cooldown_Reduction += value;
  } else if (statName === "ability_Cooldown") {
    ability_Cooldown += value;
  } else if (statName === "shot_Diameter") {
    shot_Diameter += value;
  } else if (statName === "shot_Speed") {
    shot_Speed += value;
  } else if (statName === "shot_Penetration") {
    shot_Penetration += value;
  } else if (statName === "shot_Count") {
    shot_Count += value;
  } else if (statName === "shot_Duration") {
    shot_Duration += value;
  } else if (statName === "shot_Power") {
    shot_Power += value;
  } else if (statName === "player_Health") {
    max_Health += value;
    player_Health += value;
  } else if (statName === "hit_Timer") {
    hit_Timer += value;
  } else if (statName === "burstCooldown") {
    burstCooldown += value;
  } else if (statName === "shield_Cooldown") {
    shield_Cooldown += value;
  } else if (statName === "shield_Value") {
    shield_Value += value;
  } else if (statName === "reflect") {
    reflect = value;
  } else if (statName === "convert_EnergyShield") {
    convert_EnergyShield = value;
  } else if (statName === "alternatingEnabled") {
    alternatingEnabled = value;
  } else if (statName === "waveEnabled") {
    waveEnabled = value;
  } else if (statName === "pickupRadius") {
    itemAbsorptionRadius += value;
  } else if (statName === "pickupRadius_multiply") {
    itemAbsorptionRadius *= (1 + value);
  } else if (statName === "bounce_Value") { 
    bounce_Value += value;
  } else if (statName === "max_Health") {
    max_Health += value;
  } else if (statName === "baseMaxHealth") {
    baseMaxHealth += value;
  } else if (statName === "frequencyShifter") {
    frequencyShifter = value;
  } else if (statName === "shift_Percentage") {
    shift_Percentage += value;
  } else if (statName === "player_Hitbox") {
    player_Hitbox += value;
  } else if (statName === "maxEquipped") {
    maxEquipped += value;
  }
  RecalculateConversions();
  ClampStats();
}

// Remove the stats when attachments change
function RemoveStat(statName, value) {
  if (statName === "shot_Speed_multiply") {
    shot_Speed /= (1 + value);
  } if (statName === "shot_Delay") {
    shot_Delay -= value;
  } else if (statName === "cooldown_Reduction") {
    cooldown_Reduction -= value;
  } else if (statName === "ability_Cooldown") {
    ability_Cooldown -= value;
  } else if (statName === "shot_Diameter") {
    shot_Diameter -= value;
  } else if (statName === "shot_Speed") {
    shot_Speed -= value;
  } else if (statName === "shot_Penetration") {
    shot_Penetration -= value;
  } else if (statName === "shot_Count") {
    shot_Count -= value;
  } else if (statName === "shot_Duration") {
    shot_Duration -= value;
  } else if (statName === "shot_Power") {
    shot_Power -= value;
  } else if (statName === "player_Health") {
    max_Health -= value;
    player_Health -= value;
  } else if (statName === "hit_Timer") {
    hit_Timer -= value;
  } else if (statName === "burstCooldown") {
    burstCooldown -= value;
  } else if (statName === "shield_Cooldown") {
    shield_Cooldown -= value;
  } else if (statName === "shield_Value") {
    shield_Value -= value;
  } else if (statName === "reflect") {
    reflect = false;
  } else if (statName === "convert_EnergyShield") {
    convert_EnergyShield = false;
  } else if (statName === "alternatingEnabled") {
    alternatingEnabled = false;
  } else if (statName === "waveEnabled") {
    waveEnabled = false;
  } else if (statName === "pickupRadius") {
    itemAbsorptionRadius -= value;
  } else if (statName === "pickupRadius_multiply") {
    itemAbsorptionRadius *= (1 + value);
  } else if (statName === "bounce_Value") { 
    bounce_Value -= value;
  } else if (statName === "max_Health") {
    max_Health -= value;
  } else if (statName === "baseMaxHealth") {
    baseMaxHealth -= value;
  } else if (statName === "frequencyShifter") {
    frequencyShifter = false;
  } else if (statName === "shift_Percentage") {
    shift_Percentage -= value;
  } else if (statName === "player_Hitbox") {
    player_Hitbox -= value;
  } else if (statName === "maxEquipped") {
    maxEquipped -= value;
  }
  RecalculateConversions();
  ClampStats();
}

// Used to keep track of stat conversions, such as turning shot_Speed into shot_Duration
// Applies the conversion if active
function ApplyConversion(fromStat, toStat, percentage) {
  const key = fromStat + "_to_" + toStat;
  statConversions[key] = percentage;
  RecalculateConversions();
}

// Removes conversion it no longer active
function RemoveConversion(fromStat, toStat) {
  const key = fromStat + "_to_" + toStat;
  delete statConversions[key];
  RecalculateConversions();
}

// Calculates the conversions
function RecalculateConversions() {
  // Reset to base values
  max_Health = baseMaxHealth;
  shield_Value = baseShieldValue;

  // Apply all non-conversion stats from equipped attachments
  for (let attachmentId of equippedAttachments) {
    const attachment = attachmentList[attachmentId];
    for (let statObj of attachment.stats) {
      if (statObj.stat === "player_Health") {
        max_Health += statObj.value;

      }
      if (statObj.stat === "shield_Value") {
        shield_Value += statObj.value;
      }
    }
  }

  // === apply conversions ===
  for (let key in statConversions) {
    if (key === "max_Health_to_shield_Value") {
      let convertedAmount = max_Health * statConversions[key];
      shield_Value += convertedAmount;
      max_Health -= convertedAmount;
      if (player_Health >= max_Health) { player_Health = max_Health; }
    }
  /*  if (key === "shot_Delay_to_cooldown_Reduction") {
      let convertedAmount = bonus_Shot_Delay * statConversions[key];
      cooldown_Reduction += convertedAmount * 2;
      bonus_Shot_Delay-= convertedAmount;
   }
 */ }
}

// global upgrades non-attachments system
function InitializeUpgradeLevels() {
  for (let id in upgradeLevels) {
    upgradeLevels_Current[id] = 0; // Start at level 0
  }
}

function GetUpgradeData(id) {
  return upgradeLevels[id];
}

function GetUpgradeLevelData(id, level) {
  const upg = upgradeLevels[id];
  return upg ? upg.levels[level] : null;
}

function GetCurrentUpgradeData(id) {
  const level = upgradeLevels_Current[id] || 0;
  return GetUpgradeLevelData(id, level);
}

function IsUpgradeMaxLevel(id) {
  const maxLevel = 3;
  return (upgradeLevels_Current[id] || 0) >= maxLevel;
}

function UpgradeUpgrade(id) {
  if (!unlockedUpgrades.includes(id)) {
    playSound("error");
    return;
  }

  if (IsUpgradeMaxLevel(id)) {
    playSound("error");
    return;
  }

  const nextCost = GetNextUpgradeCost(id);
  if (totalGold >= nextCost) {
    totalGold -= nextCost;
    goldSpent += nextCost;
    upgradeLevels_Current[id] = (upgradeLevels_Current[id] || 0) + 1;
    playSound("upgrade");
    ApplyShipStats(); // Reapply stats to get the new upgrade benefit
    saveGame();
  } else {
    playSound("error");
  }
}

