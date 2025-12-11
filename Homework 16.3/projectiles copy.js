// Used for the shots and projectiles etc

//

// Splice function for shots 
function SpliceShot(index) {
  shot_Penetration_Array[index]--;
  shot_CollisionCooldown[index] = COLLISION_COOLDOWN;
  
  if (shot_Penetration_Array[index] < 0) {  // only if shot is less than 0 so that it's not insta removed
    // Mark for removal, but with a 1-frame delay
    if (!shot_RemovalDelay) shot_RemovalDelay = [];
    shot_RemovalDelay[index] = 1;
  }
}

// Determines how to shoot the things outta that there gun  -- not all weapons have this implemented yet
function DetermineFirePattern() {
  if (waveEnabled && alternatingEnabled) {
    shot_FirePattern = 5;  // Wave + Alternating
  } else if (waveEnabled) {
    shot_FirePattern = 3;  // Wave only
  } else if (alternatingEnabled) {
    shot_FirePattern = 4;  // Alternating only
  } else {
    shot_FirePattern = 0;  // Single shot default
  }
  console.log("Fire pattern updated to: " + shot_FirePattern);
}

// Makin dem dere shootin' n'stuff ya 'earin' me now?
function Shot() {
  if (shotTimer > 0) shotTimer--;

  if (game_State && mouseIsPressed && mouseButton === LEFT) {
    if (shot_Type === 0 && shotTimer <= 0) {
      FireSingleShot();
      shotTimer = shot_Delay;
      if (shotTimer < 1) shotTimer = 1;
    }
    else if (shot_Type === 1 && shotTimer <= 0) {
      FireBurst();
      shotTimer = shot_Delay;
      if (shotTimer < 1) shotTimer = 1;
    }
    else if (shot_Type === 2) {
      FullAuto();
    }
    else if (shot_Type === 3 && shotTimer <= 0) {
      FirePyramidShot();
      shotTimer = shot_Delay;
      if (shotTimer < 1) shotTimer = 1;
    }
  }
}

// Core shootin' mechanic
function AddShots(x, y, angles, speeds, diameters, sourceType, penetration, powers) {
  if (powers === undefined) {
    powers = new Array(angles.length).fill(shot_Power);
  } else if (!Array.isArray(powers)) {
    powers = new Array(angles.length).fill(powers);
  } else if (powers.length !== angles.length) {
    let normalized = new Array(angles.length);
    for (let k = 0; k < angles.length; k++) {
      normalized[k] = powers[k] !== undefined ? powers[k] : shot_Power;
    }
    powers = normalized;
  }

  for (let i = 0; i < angles.length; i++) {
    shot_X.push(x);
    shot_Y.push(y);
    shot_xDistance.push(Math.cos(angles[i]) * speeds[i]);
    shot_yDistance.push(Math.sin(angles[i]) * speeds[i]);
    shot_Timer.push(0);
    shot_Diameter_Array.push(diameters[i]);
    shot_SourceType.push(sourceType);
    shot_Penetration_Array.push(penetration);
    shot_Penetration_Remaining.push(penetration);
    shot_CollisionCooldown.push(0);
    shot_HitEnemies.push([]);
    shot_WavePattern.push(0);
    shot_WaveAmplitude.push(0);
    shot_WaveFrequency.push(0);
    shot_DistanceTraveled.push(0);

    // push normalized power per-shot
    shot_PowerArray.push(powers[i]);
  }
  shot_CurrentAmount = shot_X.length;
}

// Single shot
function FireSingleShot() {
  playSound('shotsingle');
  let worldMouseX = GetWorldMouseX();
  let worldMouseY = GetWorldMouseY();
  let baseAngle = atan2(worldMouseY - player_Y, worldMouseX - player_X);
  let angles = [];
  let diameters = [];

  if (shot_Type === 0 && shot_Count >= 2) {
    for (let s = 0; s < shot_Count; s++) {
      angles.push(baseAngle + map(s, 0, shot_Count, 0, TWO_PI));
      diameters.push(shot_Diameter);
    }
  } else {
    angles.push(baseAngle);
    diameters.push(shot_Diameter);
  }

  if (shot_FirePattern === 3) {
    FireSingleShotWave(angles, diameters);
  } else if (shot_FirePattern === 4) {
    FireSingleShotAlternating(angles, diameters);
  } else if (shot_FirePattern === 5) {
    FireSingleShotWaveAlternating(angles, diameters);
  } else {
    AddShots(player_X, player_Y, angles, Array(angles.length).fill(shot_Speed), diameters, 4, shot_Penetration);
  }
}

// shot variations
function FireSingleShotWave(angles, diameters) {
  let waveAmplitude = random(8, 22);
  let waveFrequency = random(0.22, 0.4);
  //  console.log("Amp: " + waveAmplitude);
  //  console.log("Freq: " + waveFrequency);
  AddShots(player_X, player_Y, angles, Array(angles.length).fill(shot_Speed), diameters, 4, shot_Penetration);

  for (let i = 0; i < angles.length; i++) {
    let shotIndex = shot_X.length - angles.length + i;
    shot_WavePattern[shotIndex] = 1;
    shot_WaveAmplitude[shotIndex] = waveAmplitude;
    shot_WaveFrequency[shotIndex] = waveFrequency;
    shot_DistanceTraveled[shotIndex] = 0;
  }
}
function FireSingleShotAlternating(angles, diameters) {
  let lateralOffset = 15;
  let newAngles = [];
  let newDiameters = [];

  // offset positions for each alternating sidesj
  for (let a = 0; a < angles.length; a++) {
    let side = (alternatingFireSide + a) % 2;
    let sideMultiplier = side === 0 ? -1 : 1;

    let offsetAngle = angles[a] + HALF_PI;
    let offsetX = Math.cos(offsetAngle) * lateralOffset * sideMultiplier;
    let offsetY = Math.sin(offsetAngle) * lateralOffset * sideMultiplier;

    AddShots(player_X + offsetX, player_Y + offsetY, [angles[a]], [shot_Speed], [diameters[a]], 4, shot_Penetration
    );
  }
  alternatingFireSide = (alternatingFireSide + 1) % 2;
}
function FireSingleShotWaveAlternating(angles, diameters) {
  let lateralOffset = 15;
  let waveAmplitude = random(8, 22);
  let waveFrequency = random(0.22, 0.4);

  // Fire radial shots with alternating offset AND wave
  for (let a = 0; a < angles.length; a++) {
    let side = (alternatingFireSide + a) % 2;
    let sideMultiplier = side === 0 ? -1 : 1;

    let offsetAngle = angles[a] + HALF_PI;
    let offsetX = Math.cos(offsetAngle) * lateralOffset * sideMultiplier;
    let offsetY = Math.sin(offsetAngle) * lateralOffset * sideMultiplier;

    AddShots(player_X + offsetX, player_Y + offsetY, [angles[a]], [shot_Speed], [diameters[a]], 4, shot_Penetration
    );

    // Mark as wave
    let shotIndex = shot_X.length - 1;
    shot_WavePattern[shotIndex] = 1;
    shot_WaveAmplitude[shotIndex] = waveAmplitude;
    shot_WaveFrequency[shotIndex] = waveFrequency;
    shot_DistanceTraveled[shotIndex] = 0;
  }
  alternatingFireSide = (alternatingFireSide + 1) % 2;
}

// Burst style shot  
function FireBurst() {
  playSound('shotshotgun');
  let worldMouseX = GetWorldMouseX();
  let worldMouseY = GetWorldMouseY();
  let baseAngle = atan2(worldMouseY - player_Y, worldMouseX - player_X);
  let burstCount = shot_Count * 2;

  let angles = [];
  let diameters = Array(burstCount).fill(shot_Diameter / 2 + 1);

  for (let s = 0; s < burstCount; s++) {
    let spread = (Math.floor(Math.random() * 4 + shot_Count) + 2);
    let angleOffset = burstCount > 1 ? map(s, 0, burstCount - 1, -spread, spread) * PI / 180 : 0;
    angles.push(baseAngle + angleOffset);
  }
  AddShots(player_X, player_Y, angles, Array(burstCount).fill(shot_Speed), diameters, 0, shot_Penetration);
}

// Standard auto fire
function FullAuto() {
  if (!fullAutoActive && mouseIsPressed && mouseButton === LEFT && shotTimer <= 0) {
    fullAutoActive = true;
    fullAutoTimer = 0;
    fullAutoShotsFired = 0;
  }

  if (fullAutoActive) {
    fullAutoTimer++;
    if (fullAutoTimer >= 6) {  // Fire every 6 frames
      FireAutoShot();
      fullAutoShotsFired++;
      fullAutoTimer = 0;

      if (fullAutoShotsFired >= shot_Count) {
        shotTimer = shot_Delay;
        fullAutoShotsFired = 0;
        fullAutoActive = false;
      }
    }
  }
}

// Fires automatic shots
function FireAutoShot() {
  playSound('shotfullauto');
  let worldMouseX = GetWorldMouseX();
  let worldMouseY = GetWorldMouseY();
  let baseAngle = atan2(worldMouseY - player_Y, worldMouseX - player_X);
  let spread = (shot_FirePattern === 3 || shot_FirePattern === 5) ? 0 : random(-2, 2) * PI / 180;

  let angles = [baseAngle + spread];
  let diameters = [shot_Diameter];

  if (shot_FirePattern === 3) {
    FireAutoWave(angles, diameters);
  } else if (shot_FirePattern === 4) {
    FireAutoAlt(angles, diameters);
  } else if (shot_FirePattern === 5) {
    FireAutoWaveAlt(angles, diameters);
  } else {
    AddShots(player_X, player_Y, angles, Array(angles.length).fill(shot_Speed), diameters, 0, shot_Penetration);
  }
}

// For wave pattern
function FireAutoWave(angles, diameters) {
  let waveAmplitude = random(8, 22);
  let waveFrequency = random(0.22, 0.4);

  AddShots(player_X, player_Y, angles, Array(angles.length).fill(shot_Speed), diameters, 0, shot_Penetration);

  for (let i = 0; i < angles.length; i++) {
    let shotIndex = shot_X.length - angles.length + i;
    shot_WavePattern[shotIndex] = 1;
    shot_WaveAmplitude[shotIndex] = waveAmplitude;
    shot_WaveFrequency[shotIndex] = waveFrequency;
    shot_DistanceTraveled[shotIndex] = 0;
  }
}

// Alternating 
function FireAutoAlt(angles, diameters) {
  let lateralOffset = 15;

  for (let a = 0; a < angles.length; a++) {
    let side = (alternatingFireSide + a) % 2;
    let sideMultiplier = side === 0 ? -1 : 1;

    let offsetAngle = angles[a] + HALF_PI;
    let offsetX = Math.cos(offsetAngle) * lateralOffset * sideMultiplier;
    let offsetY = Math.sin(offsetAngle) * lateralOffset * sideMultiplier;

    AddShots(player_X + offsetX,player_Y + offsetY, [angles[a]], [shot_Speed], [diameters[a]], 0, shot_Penetration
    );
  }

  alternatingFireSide = (alternatingFireSide + 1) % 2;
}

// Both wave and alternating
function FireAutoWaveAlt(angles, diameters) {
  let lateralOffset = 15;
  let waveAmplitude = random(10, 16);
  let waveFrequency = random(0.18, 0.36);

  for (let a = 0; a < angles.length; a++) {
    let side = (alternatingFireSide + a) % 2;
    let sideMultiplier = side === 0 ? -1 : 1;

    let offsetAngle = angles[a] + HALF_PI;
    let offsetX = Math.cos(offsetAngle) * lateralOffset * sideMultiplier;
    let offsetY = Math.sin(offsetAngle) * lateralOffset * sideMultiplier;

    AddShots(player_X + offsetX, player_Y + offsetY, [angles[a]], [shot_Speed], [diameters[a]], 0, shot_Penetration
    );

    let shotIndex = shot_X.length - 1;
    shot_WavePattern[shotIndex] = 1;
    shot_WaveAmplitude[shotIndex] = waveAmplitude;
    shot_WaveFrequency[shotIndex] = waveFrequency;
    shot_DistanceTraveled[shotIndex] = 0;
  }

  alternatingFireSide = (alternatingFireSide + 1) % 2;
}

// Pyramid style shots
function FirePyramidShot() {
  playSound('shotsingle');
  let pyramidPower = shot_Power / 2 + 1;
  let worldMouseX = GetWorldMouseX();
  let worldMouseY = GetWorldMouseY();
  let baseAngle = atan2(worldMouseY - player_Y, worldMouseX - player_X);
  let positions = GeneratePyramidPattern(shot_Count);

  let startPositions = [];
  let angles = [];
  let diameters = [];

  for (let pos of positions) {
    let rotatedOffsetX = pos.offsetX * Math.cos(baseAngle) - pos.offsetY * Math.sin(baseAngle);
    let rotatedOffsetY = pos.offsetX * Math.sin(baseAngle) + pos.offsetY * Math.cos(baseAngle);

    startPositions.push({
      x: player_X + rotatedOffsetX,
      y: player_Y + rotatedOffsetY
    });
    angles.push(baseAngle);
    diameters.push(shot_Diameter);
  }

  for (let i = 0; i < startPositions.length; i++) {
    let pos = startPositions[i];
    AddShots(pos.x, pos.y, [angles[i]], [shot_Speed], [diameters[i]], 1, shot_Penetration, [pyramidPower]);
  }
}

function GeneratePyramidPattern(count) {
  let positions = [];

  if (count === 1) {
    // Single shot - no offset
    positions.push({ offsetX: 0, offsetY: 0 });

  } else if (count === 2) {
    // Horizontal line of 2
    let spacing = 30;
    positions.push({ offsetX: -spacing, offsetY: 15 });
    positions.push({ offsetX: spacing, offsetY: 0 });

  } else if (count === 3) {
    // Triangle pointing forward
    positions.push({ offsetX: 0, offsetY: 0 });        // Center/front
    positions.push({ offsetX: -25, offsetY: -25 });   // Back left
    positions.push({ offsetX: 25, offsetY: 25 });      // Back right

  } else if (count === 4) {
    // Diamond shape
    positions.push({ offsetX: 0, offsetY: -30 });    // Top
    positions.push({ offsetX: -30, offsetY: 0 });    // Left
    positions.push({ offsetX: 30, offsetY: 0 });     // Right
    positions.push({ offsetX: 0, offsetY: 30 });     // Bottom

  } else if (count === 5) {
    // Pentagon (5 shots)
    // Center shot plus 4 around it
    positions.push({ offsetX: 0, offsetY: 0 });      // Center
    for (let i = 0; i < 4; i++) {
      let angle = (i / 4) * TWO_PI - HALF_PI;
      let distance = 32;
      positions.push({
        offsetX: Math.cos(angle) * distance,
        offsetY: Math.sin(angle) * distance
      });
    }

  } else if (count === 6) {
    // Hexagon (6 shots)
    for (let i = 0; i < 6; i++) {
      let angle = (i / 6) * TWO_PI - HALF_PI;
      let distance = 36;
      positions.push({
        offsetX: Math.cos(angle) * distance,
        offsetY: Math.sin(angle) * distance
      });
    }

  } else if (count === 7) {
    // Hexagon with center
    positions.push({ offsetX: 0, offsetY: 0 });      // Center
    for (let i = 0; i < 6; i++) {
      let angle = (i / 6) * TWO_PI - HALF_PI;
      let distance = 40;
      positions.push({
        offsetX: Math.cos(angle) * distance,
        offsetY: Math.sin(angle) * distance
      });
    }

  } else {    // Might jsut set a shot_Count limit for this shot pattern only going up to 6 or 7
    // For larger counts, create a larger pyramid/grid pattern
    // Arrange in roughly circular formation
    let radius = 26 + (count / 2);
    for (let i = 0; i < count; i++) {
      let angle = (i / count) * TWO_PI;
      positions.push({
        offsetX: Math.cos(angle) * radius,
        offsetY: Math.sin(angle) * radius
      });
    }
  }
  return positions;
}

// Used to handle the fring of Bits
function FireBitShot(bitX, bitY, bitIndex) {
  if (!game_State) return;
  playSound('shotbit');

  let baseAngle = random(TWO_PI);
  let angles = [baseAngle];
  let diameters = [bit_Diameter];

  if (bit_ShotCount >= 2) {
    let extraShots = bit_ShotCount + shot_Count;
    for (let s = 0; s < extraShots; s++) {
      angles.push(baseAngle + map(s, 0, extraShots, 0, TWO_PI));
      diameters.push(bit_Diameter);
    }
  }

  AddShots(bitX, bitY, angles, Array(angles.length).fill(bit_Speed), diameters, 1, shot_Penetration);
}

// cannon aiming/spread/etc
function FireCannonBurst(cannonX, cannonY, cannonIndex) {
  let actualX = cannonX;
  let actualY = cannonY;
  let target = GetNearestEnemy(actualX, actualY, enemies);
  if (!target) return;
  let enemy = enemies[target.index];
  let targetX = enemy.x;
  let targetY = enemy.y;
  let baseAngle = Math.atan2(targetY - actualY, targetX - actualX);
  let burstCount = cannon_ShotCount + shot_Count * 2;
  let angles = [];
  let speeds = [];
  let diameters = [];
  for (let s = 0; s < burstCount; s++) {
    let spread = Math.floor(Math.random() * 20) + 4;
    let angleOffset = burstCount > 1
      ? map(s, 0, burstCount - 1, -spread, spread) * PI / 180
      : 0;
    angles.push(baseAngle + angleOffset);
    speeds.push(cannon_Speed + (random() < 0.5 ? -3 : 3));
    diameters.push(shot_Diameter / 3);
  }
  console.log("Cannon ${cannonIndex} firing from: (${actualX}, ${actualY})");
  AddShots(actualX, actualY, angles, speeds, diameters, 2, shot_Penetration);
  playSound("shotcannon");
}

// Blaster Shots
function FireBlasterShot(blasterX, blasterY, blasterIndex) {
  if (!game_State) return;
  playSound('shotblaster');

  const blasterCornerDistance = 25;
  const blasterPositions = [
    { x: blasterCornerDistance, y: blasterCornerDistance },
    { x: -blasterCornerDistance, y: -blasterCornerDistance }
  ];

  let rotated = RotatePoint(blasterPositions[blasterIndex].x, blasterPositions[blasterIndex].y, player_Rotation);
  let actualX = player_X + rotated.x;
  let actualY = player_Y + rotated.y;

  let worldMouseX = GetWorldMouseX();
  let worldMouseY = GetWorldMouseY();
  let baseAngle = atan2(worldMouseY - actualY, worldMouseX - actualX);
  let spread = random(-6, 6) * PI / 180;

  AddShots(actualX, actualY, [baseAngle + spread], [blaster_Speed], [blaster_Diameter], 3, shot_Penetration);
}

// Handles the firing of support units
function FireBitsIfReady() {
  if (bits === 0) return;
  const orbitRadius = 50;
  const orbitSpeed = 0.03;

  for (let i = 0; i < bits; i++) {
    bit_Angle[i] += orbitSpeed;

    if (bit_CooldownTimer[i] <= 0) {
      let localX = cos(bit_Angle[i]) * orbitRadius;
      let localY = sin(bit_Angle[i]) * orbitRadius;

      let rotated = RotatePoint(localX, localY, player_Rotation);
      let bitX = player_X + rotated.x;
      let bitY = player_Y + rotated.y;

      FireBitShot(bitX, bitY, i);
      bit_CooldownTimer[i] = bit_Cooldown;
    }
  }
}

// Handles Blaster firing function 
function FireBlastersIfReady() {
  if (blasters === 0) return;

  const blasterCornerDistance = 25;
  const blasterPositions = [
    { x: blasterCornerDistance, y: blasterCornerDistance },
    { x: -blasterCornerDistance, y: -blasterCornerDistance }
  ];

  for (let i = 0; i < blasters; i++) {
    if (blaster_CooldownTimer[i] <= 0 && !blaster_BurstActive[i]) {
      blaster_BurstActive[i] = true;
      blaster_BurstTimer[i] = 0;
      blaster_ShotsFired[i] = 0;
    }

    if (blaster_BurstActive[i]) {
      blaster_BurstTimer[i]++;

      if (blaster_BurstTimer[i] >= 6) {
        let rotated = RotatePoint(blasterPositions[i].x, blasterPositions[i].y, player_Rotation);
        let blasterX = player_X + rotated.x;
        let blasterY = player_Y + rotated.y;

        FireBlasterShot(blasterX, blasterY, i);
        blaster_ShotsFired[i]++;
        blaster_BurstTimer[i] = 0;

        if (blaster_ShotsFired[i] >= blaster_ShotCount + shot_Count) {
          blaster_BurstActive[i] = false;
          blaster_CooldownTimer[i] = blaster_Cooldown;
        }
      }
    }
  }
}

// Checks for fire rate of blaster cooldown
function UpdateBitCooldowns() {
  for (let i = 0; i < bits; i++) {
    if (bit_CooldownTimer[i] > 0) {
      bit_CooldownTimer[i]--;
    }
  }
}

// Cannon shot handler
function UpdateCannonCooldowns() {
  for (let i = 0; i < cannons; i++) {
    if (cannon_CooldownTimer[i] > 0) {
      cannon_CooldownTimer[i]--;
    }
  }
}

// Auto Cannon fires
function UpdateCannons() {
  if (!game_State) return;
  for (let i = 0; i < cannons; i++) {
    if (cannon_CooldownTimer[i] <= 0) {
      // Local coordinates where cannons are drawn
      let localX = 20;
      let localY = i === 0 ? 20 : -20;

      // Rotate those local coordinates by player rotation
      let rotated = RotatePoint(localX, localY, player_Rotation);

      // Convert to world space
      let cannonX = player_X + rotated.x;
      let cannonY = player_Y + rotated.y;

      FireCannonBurst(cannonX, cannonY, i);
      cannon_CooldownTimer[i] = cannon_Cooldown;
    }
  }
}

// Blaster cooldown updater
function UpdateBlasterCooldowns() {
  for (let i = 0; i < blasters; i++) {
    if (blaster_CooldownTimer[i] > 0) {
      blaster_CooldownTimer[i]--;
    }
  }
}

// Handles updating the support units and stuff
function UpdateSupports() {
  UpdateBitCooldowns();
  UpdateCannonCooldowns();
  UpdateBlasterCooldowns();
  UpdateCannons();
  if (!game_State) return;
  FireBitsIfReady();
  FireBlastersIfReady();
}

// Moves the "bullet" objects
function MoveShot() {
  if (!game_State) return;

  for (let i = shot_X.length - 1; i >= 0; i--) {
    // Calculate proper proj speed 
    let speed = Math.sqrt(
      shot_xDistance[i] * shot_xDistance[i] +
      shot_yDistance[i] * shot_yDistance[i]
    );

    // Standard movement
    let moveX = shot_xDistance[i];
    let moveY = shot_yDistance[i];

    // Wave pattern 
    if (shot_WavePattern[i] === 1) {
      let baseAngle = atan2(shot_yDistance[i], shot_xDistance[i]);
      let waveOffset = Math.sin(shot_DistanceTraveled[i] * shot_WaveFrequency[i]) *
                       shot_WaveAmplitude[i];
      let perpAngle = baseAngle + HALF_PI;

      moveX = Math.cos(baseAngle) * speed + Math.cos(perpAngle) * waveOffset;
      moveY = Math.sin(baseAngle) * speed + Math.sin(perpAngle) * waveOffset;

      shot_DistanceTraveled[i] += speed;
    }
    shot_X[i] += moveX;
    shot_Y[i] += moveY;
    shot_Timer[i]++;

    if (reflect) {
      if (shot_Timer[i] > shot_Duration) {
        SpliceShot(i);
        continue;
      }

      if (shot_X[i] <= 10 || shot_X[i] >= width - 10) {
        shot_xDistance[i] *= -1;
      }
      if (shot_Y[i] <= 60 || shot_Y[i] >= height - 10) {
        shot_yDistance[i] *= -1;
      }

    } else {
      // remove shots if they're too far from the player
      if (shot_Timer[i] > shot_Duration) {
        SpliceShot(i);
        continue;
      }
      
      let distToPlayer = dist(shot_X[i], shot_Y[i], player_X, player_Y);
      if (distToPlayer > 3000) {
        SpliceShot(i);
        continue;
      }
    }

    let d = shot_Diameter_Array[i] || shot_Diameter;
    let source = shot_SourceType[i] || 0;

    noStroke();
    fill(255);

    if (source === 1) {
      // Bit line shot
      stroke(0, 255, 255);
      strokeWeight(2);
      line(shot_X[i], shot_Y[i], shot_X[i] + moveX * 2, shot_Y[i] + moveY * 2);
      noStroke();
      continue;

    } else if (source === 2) {
      square(shot_X[i], shot_Y[i], d);
      continue;

    } else if (source === 3) {
      // Blaster line
      stroke(0, 255, 0);
      strokeWeight(3);
      line(shot_X[i], shot_Y[i], shot_X[i] + moveX * 3, shot_Y[i] + moveY * 3);
      noStroke();
      continue;

    } else if (source === 4) {
      // Shotgun scatter shot
      let r = 200;
      let g = 100 + speed * 6;
      let b = 50;

      stroke(g, b, r);
      fill(r, g, b);

      let angle = atan2(shot_yDistance[i], shot_xDistance[i]);
      push();
      translate(shot_X[i], shot_Y[i]);
      rotate(angle);
      ellipse(0, 0, d * 1.6, d * 0.7);
      pop();
      continue;
    }

    if (shot_Type === 0) {  
      // Standard shots
      let r = 0;
      let g = 40 + speed * 4;
      let b = 100 + speed * 8;

      stroke(b, r, g + 20);
      strokeWeight(4);
      fill(r, g, b);
      circle(shot_X[i], shot_Y[i], d);

    } else if (shot_Type === 1) { 
      // Shotgun shots
      let r = 80 + speed * 8;
      let g = 100 + speed * 4;
      let b = 40;

      stroke(b, r, g);
      strokeWeight(1);
      fill(r, g, b);
      square(shot_X[i], shot_Y[i], d);

    } else if (shot_Type === 2) { 
      // Auto shots
      let r = 40;
      let g = 150 - speed * 8;
      let b = 100 + speed * 6;

      stroke(g, b, r);
      strokeWeight(2);
      fill(r, g, b);

      line(
        shot_X[i],
        shot_Y[i],
        shot_X[i] + moveX * 1.05,
        shot_Y[i] + moveY * 1.05
      );
      noStroke();

    } else if (shot_Type === 3) { 
      // Pyramid/array shots
      let r = 110 + speed * 4;
      let g = 80 + speed * 8;
      let b = 200 - speed * 2;

      stroke(b, r, g);
      strokeWeight(3);
      fill(r, g, b);
      circle(shot_X[i], shot_Y[i], d);
    }
  }

  shot_CurrentAmount = shot_X.length;
}

// Collision for shots
function CheckShotCollisions() {
  for (let i = shot_X.length - 1; i >= 0; i--) {
    if (shot_PendingRemoval.includes(i)) continue;
    
    // Calculate previous position
    const prevX = shot_X[i] - shot_xDistance[i];
    const prevY = shot_Y[i] - shot_yDistance[i];
    
    for (let j = enemies.length - 1; j >= 0; j--) {
      let enemy = enemies[j];
      if (enemy.health <= 0) continue;
      
      // Check if shot line intersects with enemy circle - prevents shots tunneling over enemies
      const distToLine = DistanceToLineSegment(enemy.x, enemy.y, prevX, prevY, shot_X[i], shot_Y[i]);
      const collisionDist = (shot_Diameter_Array[i] / 2) + (enemy.diameter / 2);
      
      if (distToLine < collisionDist) {
        if (shot_HitEnemies[i].includes(j)) continue;
        shot_HitEnemies[i].push(j);
        if (!enemy.immune) {
          enemy.health -= shot_PowerArray[i];
          playSound(enemy.hitSound);

          if (enemy.type === "disc") {
            // Reverse and slightly randomize the direction
            let reverseAngle = atan2(enemy.ySpeed, enemy.xSpeed) + PI;
            let angleVariation = random(-PI / 4, PI / 4); // ±45 degrees
            
            let newAngle = reverseAngle + angleVariation;
            let speedVariation = random(0.8, 1.3); // Speed between 80-130% of current
            let currentSpeed = dist(0, 0, enemy.xSpeed, enemy.ySpeed);
            
            enemy.xSpeed = cos(newAngle) * currentSpeed * speedVariation;
            enemy.ySpeed = sin(newAngle) * currentSpeed * speedVariation;
            
            // Reset the direction change timer so it doesn't immediately change again
            let discIndex = enemies.indexOf(enemy);
            if (disc_DirectionChangeTimer[discIndex]) {
              disc_DirectionChangeTimer[discIndex] = 0;
            }
          }

          if (enemy.health <= 0) {
            playSound(enemy.deathSound);
            KillEnemy(j);
          }
          SpliceShot(i);

        } else {
          playSound(enemy.hitSound);
          let distX = shot_X[i] - enemy.x;
          let distY = shot_Y[i] - enemy.y;
          if (Math.abs(distX) > Math.abs(distY)) shot_xDistance[i] *= -1;
          else shot_yDistance[i] *= -1;
          break;
        }
      }
    }
    if (shot_CollisionCooldown[i] > 0) {
      shot_CollisionCooldown[i]--;
      if (shot_CollisionCooldown[i] === 0) shot_HitEnemies[i] = [];
    }
  }
  
  // Remove pending shots in reverse order - essentially replaces the SpliceShots function
  for (let i = shot_X.length - 1; i >= 0; i--) {
    if (shot_RemovalDelay[i] !== undefined) {
      shot_RemovalDelay[i]--;
      if (shot_RemovalDelay[i] <= 0) {
        shot_X.splice(i, 1);
        shot_Y.splice(i, 1);
        shot_xDistance.splice(i, 1);
        shot_yDistance.splice(i, 1);
        shot_Timer.splice(i, 1);
        shot_Diameter_Array.splice(i, 1);
        shot_SourceType.splice(i, 1);
        shot_Penetration_Array.splice(i, 1);
        shot_CollisionCooldown.splice(i, 1);
        shot_HitEnemies.splice(i, 1);
        shot_WavePattern.splice(i, 1);
        shot_WaveAmplitude.splice(i, 1);
        shot_WaveFrequency.splice(i, 1);
        shot_DistanceTraveled.splice(i, 1);
        shot_PowerArray.splice(i, 1);
        shot_RemovalDelay.splice(i, 1);
      }
    }
  }
}
