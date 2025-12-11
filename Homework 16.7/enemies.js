// ==++ -- Handles enemies and all their bs -- ++== \\

// Enemy spawner stuff
function SpawnEnemy(type, x, y, spawnSide = null, parentDiameter = 40) {
  let enemy = {
    type: type,
    x: x,
    y: y,
    diameter: 0,
    health: 0,
    xSpeed: 0,
    ySpeed: 0,
    speed: 2,
    exp: 0,
    gold: 0,
    sound: "",

    //  custom behavior properties per orbiter
    orbitMinDistance: 80,
    orbitMaxDistance: 200,
    orbitSpeed: 7
  };
  
  switch (type) {
    case "chip":
      enemy.diameter = 60;
      enemy.health = 1;
      enemy.xSpeed = random() * 6 - 3;
      enemy.ySpeed = random() * 6 - 3;
      enemy.isObstacle = true;
      enemy.immune = true;
      enemy.hitSound = "bounce";
      break;
      
    case "minidia":
      enemy.diameter = parentDiameter / 2 + 4;
      enemy.health = 30;
      enemy.speed = 2; 
      enemy.xSpeed = random() < 0.5 ? random(-6, -2) : random(2, 6);
      enemy.ySpeed = random() < 0.5 ? random(-6, -2) : random(2, 6);
      enemy.sound = "deathminidiamond";
      enemy.hitSound = "hitminidiamond";
      enemy.exp = 3;
      enemy.gold = 1;
      break;
      
    case "lilfella":
      enemy.diameter = 30;
      enemy.health = 30;
      enemy.speed = 1.6;  
      enemy.xSpeed = random() * 8 - 4;
      enemy.ySpeed = random() * 8 - 4;
      enemy.sound = "deathlilfella";
      enemy.hitSound = "hitgrower";
      enemy.exp = 4;
      enemy.gold = 2;
      break;

    case "bigfella":
      enemy.diameter = 70;
      enemy.health = 385;
      enemy.speed = 1.7;  
      enemy.xSpeed = random() * 8 - 4;
      enemy.ySpeed = random() * 8 - 4;
      enemy.sound = "deathlilfella";
      enemy.hitSound = "hitgrower";
      enemy.exp = 22;
      enemy.gold = 14;
      break;
      
    case "girthyfella":
      enemy.diameter = 50;
      enemy.health = 1450;
      enemy.speed = 1.75;  
      enemy.xSpeed = random() * 8 - 4;
      enemy.ySpeed = random() * 8 - 4;
      enemy.sound = "deathlilfella";
      enemy.hitSound = "hitgrower";
      enemy.exp = 82;
      enemy.gold = 66;
      break;      
      
    case "disc":
      enemy.diameter = random(40, 70);
      enemy.health = 200;
      enemy.speed = 2.5;
      enemy.xSpeed = random() * 8 - 4;
      enemy.ySpeed = random() * 8 - 4;
      enemy.sound = "deathdisc";
      enemy.hitSound = "hitdisc";
      enemy.exp = 15;
      enemy.gold = 26;
      break;
      
    case "chungusjr":
      enemy.diameter = 175;
      enemy.health = 280;
      enemy.speed = 1.2;  
      enemy.xSpeed = random() * 8 - 4;
      enemy.ySpeed = random() * 8 - 4;
      enemy.sound = "deathchungusjr";
      enemy.hitSound = "hitchungusjr";
      enemy.exp = 22;
      enemy.gold = 20;
      break;
      
    case "chungus":
      enemy.diameter = 200;
      enemy.health = 650;
      enemy.speed = 1.0;  
      enemy.xSpeed = random() * 8 - 4;
      enemy.ySpeed = random() * 8 - 4;
      enemy.sound = "deathchungus";
      enemy.hitSound = "hitchungus";
      enemy.exp = 55;
      enemy.gold = 22;
      break;
      
    case "chungussr":
      enemy.diameter = 225;
      enemy.health = 2000;
      enemy.speed = 0.8;  
      enemy.xSpeed = random() * 8 - 4;
      enemy.ySpeed = random() * 8 - 4;
      enemy.sound = "deathchungussr";
      enemy.hitSound = "hitchungussr";
      enemy.exp = 120;
      enemy.gold = 80;
      break;

    case "bozo":
      enemy.diameter = 60;
      enemy.health = 600;
      enemy.speed = 0.9;  
      enemy.xSpeed = random() * 8 - 4;
      enemy.ySpeed = random() * 8 - 4;
      enemy.sound = "deathdiamond";
      enemy.hitSound = "hitdiamond";
      enemy.exp = 48;
      enemy.gold = 43;
      break;      

    case "bozog":
      enemy.diameter = 68;
      enemy.health = 1300;
      enemy.speed = 0.9;  
      enemy.xSpeed = random() * 8 - 4;
      enemy.ySpeed = random() * 8 - 4;
      enemy.sound = "deathdiamond";
      enemy.hitSound = "hitdiamond";
      enemy.exp = 99;
      enemy.gold = 72;
      break; 

    case "turbozo":
      enemy.diameter = 55;
      enemy.health = 2650;
      enemy.speed = 0.9;  
      enemy.xSpeed = random() * 8 - 4;
      enemy.ySpeed = random() * 8 - 4;
      enemy.sound = "deathchungus";
      enemy.hitSound = "hitchungus";
      enemy.exp = 162;
      enemy.gold = 88;
      break;       

    case "turbozog":
      enemy.diameter = 85;
      enemy.health = 5200;
      enemy.speed = 0.9;  
      enemy.xSpeed = random() * 8 - 4;
      enemy.ySpeed = random() * 8 - 4;
      enemy.sound = "deathdisc";
      enemy.hitSound = "hitdisc";
      enemy.exp = 193;
      enemy.gold = 115;
      break;            
      
    case "dia":
      enemy.diameter = 65;
      enemy.health = 90;
      enemy.sound = "deathdiamond";
      enemy.hitSound = "hitdiamond";
      enemy.exp = 10;
      enemy.gold = 3;

      enemy.orbitMinDistance = 100;
      enemy.orbitMaxDistance = 400;
      enemy.orbitSpeed = 5;
      switch (spawnSide) {
        case "left": enemy.xSpeed = 4; enemy.ySpeed = 0; break;
        case "right": enemy.xSpeed = -4; enemy.ySpeed = 0; break;
        case "top": enemy.xSpeed = 0; enemy.ySpeed = 4; break;
        case "bottom": enemy.xSpeed = 0; enemy.ySpeed = -4; break;
        default: enemy.xSpeed = random() < 0.5 ? random(-4, -2) : random(2, 4);
          enemy.ySpeed = random() < 0.5 ? random(-4, -2) : random(2, 4);
      }
      break;
      
    case "gigadia":
      enemy.diameter = 106;
      enemy.health = 380;
      enemy.sound = "deathdiamond";
      enemy.hitSound = "hitdiamond";
      enemy.exp = 28;
      enemy.gold = 22;

      enemy.orbitMinDistance = 300;
      enemy.orbitMaxDistance = 700;
      enemy.orbitSpeed = -4;
      switch (spawnSide) {
        case "left": enemy.xSpeed = 4; enemy.ySpeed = 0; break;
        case "right": enemy.xSpeed = -4; enemy.ySpeed = 0; break;
        case "top": enemy.xSpeed = 0; enemy.ySpeed = 4; break;
        case "bottom": enemy.xSpeed = 0; enemy.ySpeed = -4; break;
        default: enemy.xSpeed = random() < 0.5 ? random(-4, -2) : random(2, 4);
          enemy.ySpeed = random() < 0.5 ? random(-4, -2) : random(2, 4);
      }
      break;      

    case "superdia":
      enemy.diameter = 90;
      enemy.health = 980;
      enemy.sound = "deathdiamond";
      enemy.hitSound = "hitdiamond";
      enemy.exp = 58;
      enemy.gold = 22;

      enemy.orbitMinDistance = 300;
      enemy.orbitMaxDistance = 700;
      enemy.orbitSpeed = -4;
      switch (spawnSide) {
        case "left": enemy.xSpeed = 4; enemy.ySpeed = 0; break;
        case "right": enemy.xSpeed = -4; enemy.ySpeed = 0; break;
        case "top": enemy.xSpeed = 0; enemy.ySpeed = 4; break;
        case "bottom": enemy.xSpeed = 0; enemy.ySpeed = -4; break;
        default: enemy.xSpeed = random() < 0.5 ? random(-4, -2) : random(2, 4);
          enemy.ySpeed = random() < 0.5 ? random(-4, -2) : random(2, 4);
      }
      break;        
      
    case "grower":
      enemy.diameter = 32;
      enemy.health = 100;
      enemy.xSpeed = 4;
      enemy.ySpeed = 4;
      enemy.sound = "deathgrower";
      enemy.hitSound = "hitgrower";
      enemy.exp = 30;
      enemy.gold = 15;
      break;

    case "biggrower":
      enemy.diameter = 36;
      enemy.health = 550;
      enemy.xSpeed = -4;
      enemy.ySpeed = -4;
      enemy.sound = "deathgrower";
      enemy.hitSound = "hitgrower";
      enemy.exp = 88;
      enemy.gold = 65;
      break;   
      
    case "gigagrower":
      enemy.diameter = 38;
      enemy.health = 880;
      enemy.xSpeed = -4;
      enemy.ySpeed = 4;
      enemy.sound = "deathgrower";
      enemy.hitSound = "hitgrower";
      enemy.exp = 88;
      enemy.gold = 65;
      break;       
      
    default:
      console.warn("Unknown enemy type: " + type);
      return;
  }  
  enemies.push(enemy);
}

// Boss spawner
function SpawnBoss(type, x, y) {
  let boss;

  if (stage ===1 ){
    boss = {
      type: type,
      worldX: x,  // Set world pos
      worldY: y,
      screenX: width / 2,
      screenY: 150,
      
      // Center body
      center: {
        health: 6800,
        diameter: 80,
        maxHealth: 6800,
        hitSound: "boss1centerhit",
        deathSound: "boss1centerdeath"
      },
      
      // Left body
      left: {
        health: 2555,
        diameter: 60,
        maxHealth: 2555,
        offsetX: -100,
        hitSound: "boss1lefthit",
        deathSound: "boss1leftdeath"
      },
      
      // Right body
      right: {
        health: 3600,
        diameter: 60,
        maxHealth: 3600,
        offsetX: 100,
        hitSound: "boss1righthit",
        deathSound: "boss1rightdeath"
      },
      
      // Firing mechanics
      centerFireTimer: 0,
      centerFireCooldown: 100,
      leftFireTimer: 0,
      leftFireCooldown: 90,
      rightFireTimer: 0,
      rightFireCooldown: 90,
      
      // Behavior
      phase: 1,
      isAlive: true,
      leftDestroyed: false,   // Tracks death of secondary objects
      rightDestroyed: false,  
      bothDestroyed: false,
      
      leftSweepShotIndex: 0,
      rightSweepShotIndex: 0,
      leftSweepShotDelay: 0,
      rightSweepShotDelay: 0,
      leftSweepCooldownTimer: 0,
      rightSweepCooldownTimer: 0    
    }
  };

  // else if (stage === 2) {}
  // else if (stage === 3) {}, etc  
  if (boss){
    bosses.push(boss);
    console.log("Boss spawned at world position:", x, y);
  }
}

// applies a neat little pulsing effect 
function ApplyPulse() {
  flashIntensity = 0;
  if (frameCount % 40 < 15) {  // Flashes every 40 frames for 15 duration
    flashIntensity = map(frameCount % 10, 0, 10, 0, 1);
    strokeWeight(2 + flashIntensity * 4);  // Grows from 2 to 6
    stroke(255, 200, 50, 200);
  } else {
    strokeWeight(2);
    stroke(50, 120, 250);
  }
}

// determines the locations of spawning and how/where they are set
function getSpawnPositions(side, amount, radius) {
  const positions = [];
  const spacing = 60;
  const px = player_X;
  const py = player_Y;
  radius = radius || 300;
  const MIN_SPAWN_DISTANCE = 300; // MINIMUM 300 units from player

  // Helper function to check if position is far enough from player
  function isValidSpawnPosition(x, y) {
    return dist(x, y, px, py) >= MIN_SPAWN_DISTANCE;
  }

  switch (side) {
    case "left":
      for (let i = 0; i < amount; i++) {
        let x = px - 600;
        let y = py + (i * spacing) - (amount * spacing) / 2;
        
        // 
        let attempts = 0;
        while (!isValidSpawnPosition(x, y) && attempts < 20) {
          y += spacing * 0.5;
          attempts++;
        }
        positions.push({ x, y });
      }
      break;

    case "right":
      for (let i = 0; i < amount; i++) {
        let x = px + 600;
        let y = py + (i * spacing) - (amount * spacing) / 2;
        
        let attempts = 0;
        while (!isValidSpawnPosition(x, y) && attempts < 20) {
          y -= spacing * 0.5;
          attempts++;
        }
        positions.push({ x, y });
      }
      break;

    case "top":
      for (let i = 0; i < amount; i++) {
        let x = px + (i * spacing) - (amount * spacing) / 2;
        let y = py - 600;
        
        let attempts = 0;
        while (!isValidSpawnPosition(x, y) && attempts < 20) {
          x += spacing * 0.5;
          attempts++;
        }
        positions.push({ x, y });
      }
      break;

    case "bottom":
      for (let i = 0; i < amount; i++) {
        let x = px + (i * spacing) - (amount * spacing) / 2;
        let y = py + 600;
        
        let attempts = 0;
        while (!isValidSpawnPosition(x, y) && attempts < 20) {
          x -= spacing * 0.5;
          attempts++;
        }
        positions.push({ x, y });
      }
      break;

    case "grid":
      const cols = Math.ceil(Math.sqrt(amount));
      const rows = Math.ceil(amount / cols);
      const gridSpacing = 120;
      const startX = px - (cols * gridSpacing) / 2;
      const startY = py - (rows * gridSpacing) / 2;
      let count = 0;
      for (let row = 0; row < rows && count < amount; row++) {
        for (let col = 0; col < cols && count < amount; col++) {
          let x = startX + col * gridSpacing;
          let y = startY + row * gridSpacing;
          
          // looks for safe spawn spot
          let foundValid = false;
          let attempts = 0;
          while (!foundValid && attempts < 10) {
            if (isValidSpawnPosition(x, y)) {
              positions.push({ x, y });
              count++;
              foundValid = true;
            } else {
              // Move outward from center
              x += 60;
              y += 60;
              attempts++;
            }
          }
        }
      }
      break;

    case "square":
      // Distribute enemies evenly around square perimeter
      let adjustedRadius = Math.max(radius, MIN_SPAWN_DISTANCE + 50);
      const perimeter = 8 * adjustedRadius;
      const spacePerEnemy = perimeter / amount;
      
      for (let i = 0; i < amount; i++) {
        let distanceAlongPerimeter = i * spacePerEnemy;
        let x, y;
        
        // Calculate position on square perimeter
        if (distanceAlongPerimeter < 2 * adjustedRadius) {
          // Top edge (left to right)
          x = px - adjustedRadius + distanceAlongPerimeter;
          y = py - adjustedRadius;
        } else if (distanceAlongPerimeter < 4 * adjustedRadius) {
          // Right edge (top to bottom)
          x = px + adjustedRadius;
          y = py - adjustedRadius + (distanceAlongPerimeter - 2 * adjustedRadius);
        } else if (distanceAlongPerimeter < 6 * adjustedRadius) {
          // Bottom edge (right to left)
          x = px + adjustedRadius - (distanceAlongPerimeter - 4 * adjustedRadius);
          y = py + adjustedRadius;
        } else {
          // Left edge (bottom to top)
          x = px - adjustedRadius;
          y = py + adjustedRadius - (distanceAlongPerimeter - 6 * adjustedRadius);
        }
        
        // Verify it's actually far enough
        if (isValidSpawnPosition(x, y)) {
          positions.push({ x, y });
        }
      }
      break;

    case "circle":
      // Spawn enemies evenly in a circle around the player
      let circleRadius = Math.max(radius, MIN_SPAWN_DISTANCE + 50);
      for (let i = 0; i < amount; i++) {
        const angle = (i / amount) * TWO_PI;
        const x = px + cos(angle) * circleRadius;
        const y = py + sin(angle) * circleRadius;
        positions.push({ x, y });
      }
      break;

    case "center":
    default:
      for (let i = 0; i < amount; i++) {
        let x, y;
        let attempts = 0;
        
        // Keep trying until find valid spawn position
        do {
          const angle = random() * TWO_PI;
          const r = Math.max(radius, MIN_SPAWN_DISTANCE + 50) + random(-50, 50);
          x = px + cos(angle) * r;
          y = py + sin(angle) * r;
          attempts++;
        } while (!isValidSpawnPosition(x, y) && attempts < 20);
        
        positions.push({ x, y });
      }
      break;
  }

  return positions;
}

// Kill Bosses
function KillBoss(bossIndex) {    
  let boss = bosses[bossIndex];
  
  if (stage === 1){
    playSound("boss1centerexplode");
    player_Health = max_Health; 
    shield_Hit = false;
    shield_Active = true;

  }
  
  HandleBossDrops(boss.screenX + cameraX, boss.screenY + cameraY, boss.type);
  
  // Unlock next stage when boss dies
  if (stage < 4) {
    stagesUnlocked[stage + 1] = true;
    stagesCompleted[stage] = true;
  }
  stagesCompleted[stage] = true;
    
  saveGame();
  console.log("Game saved after boss defeat!"); 
  playMusicTrack('victoryTheme');
  
  // Trigger victory screen when slain
  victoryScreen.active = true;
  victoryScreen.startTime = millis();
  victoryScreen.countdownValue = 10;
  victoryScreen.transitionStarted = false;
  
  boss.isAlive = false;
  bosses.splice(bossIndex, 1);
}

// "Kill Enemy" effects such as diamond spawning mini's
function KillEnemy(index) {
  let enemy = enemies[index];

  // Spawn child minidia if Diamond
  if (enemy.type === "dia") {
    // Spawn 2 minidia with slight offset so they don't stack
    for (let i = 0; i < 2; i++) {
      let offsetX = (i === 0 ? -15 : 15);
      let offsetY = (i === 0 ? -15 : 15);
      SpawnEnemy("minidia", enemy.x + offsetX, enemy.y + offsetY, null, enemy.diameter);
    }
  }

  if (enemy.type === "gigadia") {
    // Spawn 2 minidia in a circle pattern around spawn point
    for (let i = 0; i < 2; i++) {
      let angle = (i / 2) * TWO_PI;
      let offsetX = cos(angle) * 25;
      let offsetY = sin(angle) * 25;
      SpawnEnemy("dia", enemy.x + offsetX, enemy.y + offsetY, null, enemy.diameter);
    }
  }
  
  Kills++;
  HandleEnemyDrops(enemy.x, enemy.y, enemy);
  Gold += enemy.gold;
  Exp += enemy.exp;
  if (enemy.sound) playSound(enemy.sound);
  enemies.splice(index, 1);
}

// Kill an enemy by object reference
function KillEnemyByObject(enemyObj) {
  const index = enemies.indexOf(enemyObj);
  if (index !== -1) KillEnemy(index);
  Gold += enemy.gold;
  Exp += enemy.exp;
}

// ===== NEW ENEMY VISUAL PATTERNS =====

// Star shape - classic 5-pointed star
function DrawStar(x, y, outerRadius, innerRadius, outerRed, outerGreen, outerBlue, innerRed, innerGreen, innerBlue) {
  const points = 5;
  const outerPoints = [];
  const innerPoints = [];
  
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * PI) / points - HALF_PI;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    outerPoints.push({
      x: x + cos(angle) * radius,
      y: y + sin(angle) * radius
    });
  }
  
  // Draw outer star
  strokeWeight(2);
  stroke(outerRed, outerGreen, outerBlue);
  fill(outerRed, outerGreen, outerBlue);
  beginShape();
  for (let point of outerPoints) {
    vertex(point.x, point.y);
  }
  endShape(CLOSE);
  
  // Draw inner star
  stroke(innerRed, innerGreen, innerBlue);
  fill(innerRed, innerGreen, innerBlue);
  beginShape();
  for (let i = 0; i < outerPoints.length; i += 2) {
    const nextPoint = outerPoints[(i + 1) % outerPoints.length];
    vertex(nextPoint.x, nextPoint.y);
  }
  endShape(CLOSE);
}

// Diamond + Circle combo
function DiamondCircle(x, y, diamondSize, circleRadius, diamondRed, diamondGreen, diamondBlue, circleRed, circleGreen, circleBlue) {
  // Draw diamond background
  strokeWeight(2);
  fill(diamondRed, diamondGreen, diamondBlue);
  stroke(diamondRed * 0.7, diamondGreen * 0.7, diamondBlue * 0.7);
  const halfDiamond = diamondSize / 2;
  quad(x, y - halfDiamond, x + halfDiamond, y, x, y + halfDiamond, x - halfDiamond, y);
  
  // Draw circle in center
  fill(circleRed, circleGreen, circleBlue);
  stroke(circleRed * 0.7, circleGreen * 0.7, circleBlue * 0.7);
  circle(x, y, circleRadius);
}

// Triangle + Circle combo
function TriangleCircle(x, y, triangleSize, circleRadius, triRed, triGreen, triBlue, circleRed, circleGreen, circleBlue) {
  const h = triangleSize * 0.866; // height of equilateral triangle
  
  // Draw triangle
  strokeWeight(2);
  fill(triRed, triGreen, triBlue);
  stroke(triRed * 0.7, triGreen * 0.7, triBlue * 0.7);
  triangle(x, y - h / 2, x - triangleSize / 2, y + h / 2, x + triangleSize / 2, y + h / 2);
  
  // Draw circle in center
  fill(circleRed, circleGreen, circleBlue);
  stroke(circleRed * 0.7, circleGreen * 0.7, circleBlue * 0.7);
  circle(x, y, circleRadius);
}

// Hexagon + Circle combo
function HexagonCircle(x, y, hexRadius, circleRadius, hexRed, hexGreen, hexBlue, circleRed, circleGreen, circleBlue) {
  // Draw hexagon
  strokeWeight(2);
  fill(hexRed, hexGreen, hexBlue);
  stroke(hexRed * 0.7, hexGreen * 0.7, hexBlue * 0.7);
  drawPolygon(6, x, y, hexRadius, 0);
  
  // Draw circle in center
  fill(circleRed, circleGreen, circleBlue);
  stroke(circleRed * 0.7, circleGreen * 0.7, circleBlue * 0.7);
  circle(x, y, circleRadius);
}

// Ring pattern (concentric circles with larger gap)
function RingPattern(x, y, outerRadius, middleRadius, innerRadius, outerRed, outerGreen, outerBlue, middleRed, middleGreen, middleBlue, innerRed, innerGreen, innerBlue) {
  // Outer ring
  strokeWeight(2);
  fill(outerRed, outerGreen, outerBlue);
  circle(x, y, outerRadius * 2);
  
  // Middle ring (creates the gap)
  fill(middleRed, middleGreen, middleBlue);
  circle(x, y, middleRadius * 2);
  
  // Inner circle
  fill(innerRed, innerGreen, innerBlue);
  circle(x, y, innerRadius * 2);
}

// Striped diamond (diamond with inner divisions)
function StripedDiamond(x, y, outerDiameter, innerDiameter, outerRed, outerGreen, outerBlue, innerRed, innerGreen, innerBlue) {
  const halfOuter = outerDiameter / 2;
  const halfInner = innerDiameter / 2;
  
  // Outer diamond
  strokeWeight(2);
  fill(outerRed, outerGreen, outerBlue);
  quad(x, y - halfOuter, x + halfOuter, y, x, y + halfOuter, x - halfOuter, y);
  
  // Inner diamond (rotated 45 degrees)
  fill(innerRed, innerGreen, innerBlue);
  quad(x, y - halfInner, x + halfInner, y, x, y + halfInner, x - halfInner, y);
  
  // Add cross division lines
  stroke(innerRed * 0.5, innerGreen * 0.5, innerBlue * 0.5);
  strokeWeight(1);
  line(x, y - halfOuter * 0.6, x, y + halfOuter * 0.6);
  line(x - halfOuter * 0.6, y, x + halfOuter * 0.6, y);
}

// Spiral/Target pattern
function TargetPattern(x, y, size, outerRed, outerGreen, outerBlue, midRed, midGreen, midBlue, innerRed, innerGreen, innerBlue) {
  // Outer ring
  strokeWeight(2);
  noFill();
  stroke(outerRed, outerGreen, outerBlue);
  circle(x, y, size);
  
  // Middle ring
  stroke(midRed, midGreen, midBlue);
  circle(x, y, size * 0.6);
  
  // Inner circle (filled)
  fill(innerRed, innerGreen, innerBlue);
  stroke(innerRed, innerGreen, innerBlue);
  circle(x, y, size * 0.2);
}

// Plus/Cross pattern
function PlusPattern(x, y, size, thickness, outerRed, outerGreen, outerBlue, innerRed, innerGreen, innerBlue) {
  const halfSize = size / 2;
  const halfThickness = thickness / 2;
  
  // Vertical bar
  fill(outerRed, outerGreen, outerBlue);
  noStroke();
  rectMode(CENTER);
  rect(x, y, thickness, size);
  
  // Horizontal bar
  rect(x, y, size, thickness);
  
  // Inner cross (different color)
  fill(innerRed, innerGreen, innerBlue);
  rect(x, y, thickness / 2, size / 2);
  rect(x, y, size / 2, thickness / 2);
}

// Spiral shape (approximated with triangles)
function Pyramid(x, y, size, outerRed, outerGreen, outerBlue, innerRed, innerGreen, innerBlue) {
  const numArms = 3;
  
  for (let i = 0; i < numArms; i++) {
    const angle = (i / numArms) * TWO_PI;
    const nextAngle = ((i + 1) / numArms) * TWO_PI;
    
    const x1 = x + cos(angle) * size * 0.8;
    const y1 = y + sin(angle) * size * 0.8;
    const x2 = x + cos(nextAngle) * size * 0.8;
    const y2 = y + sin(nextAngle) * size * 0.8;
    
    fill(outerRed, outerGreen, outerBlue);
    stroke(outerRed * 0.7, outerGreen * 0.7, outerBlue * 0.7);
    strokeWeight(2);
    triangle(x, y, x1, y1, x2, y2);
  }
  
  // Center circle
  fill(innerRed, innerGreen, innerBlue);
  stroke(innerRed, innerGreen, innerBlue);
  circle(x, y, size * 0.3);
}

// Double diamond (two diamonds rotated)
function DoubleDiamondRotated(x, y, size1, size2, color1Red, color1Green, color1Blue, color2Red, color2Green, color2Blue) {
  const half1 = size1 / 2;
  const half2 = size2 / 2;
  
  // First diamond (normal orientation)
  fill(color1Red, color1Green, color1Blue);
  stroke(color1Red * 0.7, color1Green * 0.7, color1Blue * 0.7);
  strokeWeight(2);
  quad(x, y - half1, x + half1, y, x, y + half1, x - half1, y);
  
  // Second diamond (rotated 45 degrees)
  fill(color2Red, color2Green, color2Blue);
  stroke(color2Red * 0.7, color2Green * 0.7, color2Blue * 0.7);
  quad(x + half2 * 0.7, y, x, y + half2 * 0.7, x - half2 * 0.7, y, x, y - half2 * 0.7);
}

// Flower pattern (circle with petals)
function FlowerPattern(x, y, petalRadius, petalCount, centerRadius, petalRed, petalGreen, petalBlue, centerRed, centerGreen, centerBlue) {
  const petals = petalCount || 5;
  
  // Draw petals
  fill(petalRed, petalGreen, petalBlue);
  stroke(petalRed * 0.7, petalGreen * 0.7, petalBlue * 0.7);
  strokeWeight(2);
  
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * TWO_PI;
    const petalX = x + cos(angle) * petalRadius * 0.6;
    const petalY = y + sin(angle) * petalRadius * 0.6;
    circle(petalX, petalY, petalRadius);
  }
  
  // Draw center
  fill(centerRed, centerGreen, centerBlue);
  stroke(centerRed, centerGreen, centerBlue);
  circle(x, y, centerRadius);
}

// Draws out the bad guys
function drawChungusJr(x, y) {
  const outerRadius = 87.5;
  const innerRadius = 50;
  push();
  strokeWeight(2);
  stroke(0);

  // Outer pentagon (dark color)
  fill(150, 50, 150);
  drawPolygon(5, x, y, outerRadius, PI / 2);

  // Inner pentagon (lighter color)
  fill(220, 100, 220);
  drawPolygon(5, x, y, innerRadius, PI / 2);

  pop(); 
}

// Draws chungus objects
function drawChungus(x, y) {
  const outerRadius = 100;
  const midRadius = 70;
  const innerRadius = 40;

  push();
  strokeWeight(2);
  stroke(0);

  // Outer hexagon
  fill(100, 150, 200);
  drawPolygon(6, x, y, outerRadius, 0);

  // Middle hexagon
  fill(150, 200, 255);
  drawPolygon(6, x, y, midRadius, 0);

  // Inner hexagon
  fill(200, 240, 255);
  drawPolygon(6, x, y, innerRadius, 0);

  pop();
}

// Draws chungusSr objects
function drawChungusSr(x, y) {
  const outerRadius = 112.5;
  const midRadius = 85;
  const innerRadius = 50;

  push();
  strokeWeight(2);
  stroke(0);
  // Outer octagon (dark)
  fill(200, 50, 50);
  drawPolygon(8, x, y, outerRadius, PI / 8);

  // Middle octagon
  fill(255, 100, 100);
  drawPolygon(8, x, y, midRadius, PI / 8);

  // Inner octagon (light)
  fill(255, 180, 180);
  drawPolygon(8, x, y, innerRadius, PI / 8);

  pop();
}

// define ConcentricCircle function 
function ConcentricCircle(x, y, outer_diameter, inner_diameter, outer_red, outer_green, outer_blue, inner_red, inner_green, inner_blue) {
  strokeWeight(2);
  fill(outer_red, outer_green, outer_blue);
  circle(x, y, outer_diameter);
  fill(inner_red, inner_green, inner_blue);
  circle(x, y, inner_diameter);
}

// Das Dooble Squarzen
function DoubleSquare(x, y, outer_diameter, inner_diameter, outer_red, outer_green, outer_blue, inner_red, inner_green, inner_blue) {
  rectMode(CENTER);
  strokeWeight(1);
  fill(outer_red, outer_green, outer_blue);
  square(x, y, outer_diameter);
  fill(inner_red, inner_green, inner_blue);
  square(x, y, inner_diameter);
}

// Double Diamond shape
function DoubleDiamond(x, y, outer_diameter, inner_diameter, outer_red, outer_green, outer_blue, inner_red, inner_green, inner_blue) {
  strokeWeight(2);
  fill(outer_red, outer_green, outer_blue);
  halfOuter = outer_diameter / 2;
  quad(x, y - halfOuter, x + halfOuter, y, x, y + halfOuter, x - halfOuter, y);
  strokeWeight(1);
  fill(inner_red, inner_green, inner_blue);
  halfInner = inner_diameter / 2;
  quad(x, y - halfInner, x + halfInner, y, x, y + halfInner, x - halfInner, y);
}

// Draws the enemys
function DrawEnemies() {
  for (let e of enemies) {
    ApplyPulse();

    switch (e.type) {
      case "disc":
        ConcentricCircle(e.x, e.y, e.diameter, e.diameter / 2,
          50, 120, 250, 250, 50, 120);
        break;
      case "chip":
        noStroke();
        fill(155, 200, 220);
        rectMode(CENTER);
        DoubleDiamond(e.x, e.y, e.diameter, e.diameter / 2,
          255, 55, 85, 235, 240, 55);
        break;

      case "dia":
        fill(155, 200, 220);
        let h = e.diameter / 2;
        quad(e.x, e.y - h, e.x + h, e.y, e.x, e.y + h, e.x - h, e.y);
        break;
      case "gigadia":
        DiamondCircle(e.x, e.y, e.diameter, e.diameter/3,
          235, 140, 220,    
          155, 200, 220);   
        break;        
      case "superdia":
        HexagonCircle(e.x, e.y, e.diameter/2, e.diameter/3,
          235, 140, 220,    
          155, 200, 220);   
        break;          
      case "minidia":
        fill(235, 140, 220);
        let hh = e.diameter / 2;
        quad(e.x, e.y - hh, e.x + hh, e.y, e.x, e.y + hh, e.x - hh, e.y);
        break;

      case "grower":
        Pyramid(e.x, e.y, e.diameter,
          185, 165, 60,       // Outer spiral arms
          255, 255, 100);    // Center circle
        break;
      case "biggrower":
        Pyramid(e.x, e.y, e.diameter,
          185, 165, 60,       // Outer spiral arms
          255, 255, 100);    // Center circle
        break;        
      case "gigagrower":
        FlowerPattern(e.x, e.y, e.diameter / 3, 6, e.diameter / 4,
          150, 220, 50, 100, 220, 250);
        break;        

      case "lilfella":
        ConcentricCircle(e.x, e.y, e.diameter, e.diameter / 2,
          200, 250, 100, 50, 150, 220);
        break;
      case "bigfella":
        DrawStar(e.x, e.y, e.diameter/2, e.diameter/4,
          200, 250, 100, 50, 150, 220);
        break;
      case "girthyfella":
        FlowerPattern(e.x, e.y, e.diameter /3, 6, e.diameter / 4,
          150, 220, 50, 100, 220, 250);
        break;  

      case "chungusjr":
      drawChungusJr(e.x, e.y);    
        break;

      case "chungus":
        drawChungus(e.x, e.y);
      // TriangleCircle(e.x, e.y, e.diameter, e.diameter/3,
      //  150, 220, 50,     // Triangle color: green
      //  255, 100, 100);   // Circle color: red
        break;

      case "chungussr":
        drawChungusSr(e.x, e.y);
      // StripedDiamond(e.x, e.y, e.diameter, e.diameter/2,
      //  220, 100, 220,    // Outer diamond: magenta
      //  100, 220, 255);   // Inner diamond: cyan
        break;

      case "bozo":
        DoubleSquare(e.x, e.y, e.diameter, e.diameter/3,
          235, 140, 220,    
          155, 55, 80);   
        break;   
      case "bozog":
        StripedDiamond(e.x, e.y, e.diameter, e.diameter/3,
          65, 80, 90,    
          200, 100, 50);   
        break;   
      case "turbozo":
        PlusPattern(e.x, e.y, e.diameter, e.diameter/3,
          235, 140, 220,    
          155, 55, 80);   
        break;           
      case "turbozog":
        PlusPattern(e.x, e.y, e.diameter, e.diameter/3,
          200, 80, 50,    
          50, 80, 200);   
        break;           

    }
  }
}

// Draw bosses 
function DrawBosses() {
  for (let boss of bosses) {
    if (!boss.isAlive) continue;
    
    // Draw center body (only if alive)
    if (boss.center.health > 0) {
      DrawBossPart(boss.screenX, boss.screenY, boss.center, 0, 150, 255);
    }
    
    // Draw left body (only if alive)
    if (boss.left.health > 0) {
      DrawBossPart(boss.screenX + boss.left.offsetX, boss.screenY, boss.left, 255, 100, 100);
    }
    
    // Draw right body (only if alive)
    if (boss.right.health > 0) {
      DrawBossPart(boss.screenX + boss.right.offsetX, boss.screenY, boss.right, 100, 255, 100);
    }
  }
}


function DrawBossPart(x, y, part, r, g, b) {
  push();
  fill(r, g, b);
  stroke(255);
  strokeWeight(2);
  
  // Draw as a circle
  circle(x, y, part.diameter);
  
  // Draw health bar
  let healthPercent = part.health / part.maxHealth;
  fill(255, 0, 0);
  rect(x - part.diameter/2, y - part.diameter/2 - 20, part.diameter * healthPercent, 10);
  stroke(255);
  noFill();
  rect(x - part.diameter/2, y - part.diameter/2 - 20, part.diameter, 10);
  
  pop();
}

// Moves obstacles and other floaty things
function MoveEnemies() {
  if (!game_State) return;
  
  let maxEnemies = 300;
  
  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    
    let distToPlayer = dist(enemy.x, enemy.y, player_X, player_Y);
    
    // will cull if stray to far from player
    if (distToPlayer > 3000) {
      enemies.splice(i, 1);
      continue;
    }
    
    if (enemies.length > maxEnemies && distToPlayer > 1500) {
      enemies.splice(i, 1);
      continue;
    }    
    switch (enemy.type) {
      case "disc":
        RandomWanderDisc(enemy, i);  
        break;

      case "turbozo":
      case "bozo":
      case "chungusjr":
      case "chungus":
        RandomWanderDisc(enemy, i);
        break;

      case "bozog":      
      case "turbozog":
      case "chungussr":
      case "chungussr":
      case "minidia":
      case "lilfella":
      case "bigfella":
      case "girthyfella":        
        SeekPlayer(enemy);
        break;
        
      case "dia":
        OrbitPlayer(enemy);
        break;

      case "gigadia":
        OrbitPlayer(enemy);
        break;   
        
      case "superdia":
        OrbitPlayer(enemy);
        break;           
        
      case "grower":
        WrapAroundScreen(enemy);
        break;

      case "biggrower":
        WrapAroundScreen(enemy);
        break;   
        
      case "gigagrower":
        WrapAroundScreen(enemy);
        break;           
        
      case "chip":
      if (!enemy.nextDirectionChange) enemy.nextDirectionChange = millis() + 2000;
        if (millis() >= enemy.nextDirectionChange) {
        enemy.xSpeed = random(4, 6) * (random() < 0.5 ? -1 : 1);
        enemy.ySpeed = random(4, 6) * (random() < 0.5 ? -1 : 1);

          enemy.nextDirectionChange = millis() + 3000;
        }
      BounceOffBoundaries(enemy);
      break;
    }
    
    // Skip separation to prevent odd bouncing
    if (enemy.type !== "grower" && enemy.type !== "biggrower" && enemy.type !== "gigagrower" && enemy.type !== "minidia") {
      SeparateEnemies(enemy, enemies, i);
    }
    
    enemy.x += enemy.xSpeed;
    enemy.y += enemy.ySpeed;
  }
}

// More specific enemy movement functions and behavior
function RandomWanderDisc(enemy, index) {
  const wanderSpeed = 3;
  const changeInterval = 120; // Frames between direction changes 
  const wanderDistance = 325;
  
  // Initialize timers if they don't exist
  if (!disc_DirectionChangeTimer[index]) {
    disc_DirectionChangeTimer[index] = 0;
    disc_DirectionChangeInterval[index] = changeInterval;
  }
  
  // Increment timer
  disc_DirectionChangeTimer[index]++;
  
  // Change direction when timer expires
  if (disc_DirectionChangeTimer[index] >= disc_DirectionChangeInterval[index]) {
    let randomAngle = random(TWO_PI);
    enemy.xSpeed = cos(randomAngle) * wanderSpeed;
    enemy.ySpeed = sin(randomAngle) * wanderSpeed;
    
    // Reset timer with some variation so discs don't all change at once
    disc_DirectionChangeTimer[index] = 0;
    disc_DirectionChangeInterval[index] = changeInterval + random(-30, 30);
  }
  
  // Keep disc within a reasonable area of the map
  const mapCenterX = 0; 
  const mapCenterY = 0; 
  const maxWanderDist = wanderDistance;
  
  let distToCenter = dist(enemy.x, enemy.y, mapCenterX, mapCenterY);
  if (distToCenter > maxWanderDist) {
    
    let angleToCenter = atan2(mapCenterY - enemy.y, mapCenterX - enemy.x);
    enemy.xSpeed = cos(angleToCenter) * wanderSpeed * 1.5;
    enemy.ySpeed = sin(angleToCenter) * wanderSpeed * 1.5;
  }
}

// move towardsplayer
function SeekPlayer(enemy) {
  let dx = player_X - enemy.x;
  let dy = player_Y - enemy.y;
  let distance = dist(enemy.x, enemy.y, player_X, player_Y);
  
  if (distance > 0) {
    // Use enemy's custom speed if available, otherwise use default
    let baseSpeed = enemy.speed || 2;
    let speed = Math.min(baseSpeed * global_Speed_Modifier, distance / 10);
    enemy.xSpeed = (dx / distance) * speed;
    enemy.ySpeed = (dy / distance) * speed;
  } else {
    enemy.xSpeed = 0;
    enemy.ySpeed = 0;
  }
}

function WrapAroundScreen(enemy) {
  const wrapDistance = 200; // Distance off-screen before wrapping
  
  // Calculate screen bounds relative to camera
  const screenLeft = cameraX - wrapDistance;
  const screenRight = cameraX + width + wrapDistance;
  const screenTop = cameraY - wrapDistance;
  const screenBottom = cameraY + height + wrapDistance;
  
  // Wrap horizontally
  if (enemy.x < screenLeft) {
    enemy.x = screenRight;
  } else if (enemy.x > screenRight) {
    enemy.x = screenLeft;
  }
  
  // Wrap vertically
  if (enemy.y < screenTop) {
    enemy.y = screenBottom;
  } else if (enemy.y > screenBottom) {
    enemy.y = screenTop;
  }
}


function BounceOffBoundaries(enemy) {
  // Define play area boundaries
  const bufferLeft = 40;
  const bufferRight = 40;
  const bufferTop = 60;
  const bufferBottom = 40;
  
  const minX = player_X - width / 2 + bufferLeft;
  const maxX = player_X + width / 2 - bufferRight;
  const minY = player_Y - height / 2 + bufferTop;
  const maxY = player_Y + height / 2 - bufferBottom;
  
  if (enemy.x <= minX || enemy.x >= maxX) {
    enemy.xSpeed *= -1;
    enemy.x = constrain(enemy.x, minX, maxX);
  }
  if (enemy.y <= minY || enemy.y >= maxY) {
    enemy.ySpeed *= -1;
    enemy.y = constrain(enemy.y, minY, maxY);
  }
}

// Adds an "orbiting" type mechanic for enemy movements
function OrbitPlayer(enemy) {
  // Use the enemy's custom orbit properties if they exist
  const minDistance = enemy.orbitMinDistance || 80;
  const maxDistance = enemy.orbitMaxDistance || 200;
  const orbitSpeed = enemy.orbitSpeed || 7;
  
  let dx = player_X - enemy.x;
  let dy = player_Y - enemy.y;
  let distance = dist(enemy.x, enemy.y, player_X, player_Y);
  
  if (distance < minDistance) {
    // Too close - move away
    if (distance > 0) {
      enemy.xSpeed = -(dx / distance) * orbitSpeed;
      enemy.ySpeed = -(dy / distance) * orbitSpeed;
    }
  } else if (distance > maxDistance) {
    // Too far - move closer
    enemy.xSpeed = (dx / distance) * orbitSpeed;
    enemy.ySpeed = (dy / distance) * orbitSpeed;
  } else {
    // Within range - orbit with randomness
    let angle = atan2(dy, dx);
    
    // Add random wobble to the angle
    let wobble = sin(frameCount * 0.02 + enemy.x * 0.001) * 0.3;
    let perpAngle = angle + HALF_PI + wobble;
    
    // Move tangentially (perpendicular to player direction) for orbital motion
    enemy.xSpeed = cos(perpAngle) * orbitSpeed * 0.7;
    enemy.ySpeed = sin(perpAngle) * orbitSpeed * 0.7;
    
    // Add small random drift
    enemy.xSpeed += random(-0.3, 0.3);
    enemy.ySpeed += random(-0.3, 0.3);
  }
  
  // Cap speed
  let speed = dist(0, 0, enemy.xSpeed, enemy.ySpeed);
  if (speed > orbitSpeed) {
    enemy.xSpeed = (enemy.xSpeed / speed) * orbitSpeed;
    enemy.ySpeed = (enemy.ySpeed / speed) * orbitSpeed;
  }
}

//  - prevents enemy clumping 
function SeparateEnemies(enemy, allEnemies, currentIndex) {
  const separationRadius = enemy.diameter + 4;
  const maxSeparationDistance = separationRadius * 3; // increase or decrease for tighter/looser clumps
  
  for (let i = 0; i < allEnemies.length; i++) {
    if (i === currentIndex) continue;
    
    let other = allEnemies[i];
    let dx = enemy.x - other.x;
    let dy = enemy.y - other.y;
    let distance = sqrt(dx * dx + dy * dy); // Use sqrt instead of dist
    
    // Only process if close enough
    if (distance < maxSeparationDistance && distance > 0) {
      let force = (maxSeparationDistance - distance) / maxSeparationDistance * 0.3;
      let angle = atan2(dy, dx);
      
      enemy.xSpeed += cos(angle) * force;
      enemy.ySpeed += sin(angle) * force;
    }
  }
}

// Wave setter and spawner so that its not set to the absolute value of the screen/area
function getSpawnPositionsAroundPlayer(amount, radius) {
  if (radius === undefined) radius = 200;
  const positions = [];
  const playerX = player_X;
  const playerY = player_Y;

  for (let i = 0; i < amount; i++) {
    let x, y;
    let attempts = 0;    
    // Tries to spawn in bounds
    do {
      const angle = random() * TWO_PI;
      const r = radius + random(-50, 50);
      x = playerX + cos(angle) * r;
      y = playerY + sin(angle) * r;
      attempts++;
    } while ((x < bufferLeft || x > width - bufferRight || 
              y < bufferTop || y > height - bufferBottom) && attempts < 10);
    
    // If fail, uses constrained value isntead to force on screen
    x = constrain(x, bufferLeft, width - bufferRight);
    y = constrain(y, bufferTop, height - bufferBottom);    
    positions.push([x, y]);
  }

  return positions;
}

function UpdateWaves() {
    if (game_Paused) return;

    const nowSeconds = gameTime;

    for (let wave of activeWaves) {

        // Start wave
        if (!wave.started && nowSeconds >= wave.startTime) {
            wave.started = true;
            wave.startGameTime = gameTime;

            for (let spawn of wave.spawns) {
                spawn.spawnIndex = 0;
                spawn.repeatIndex = 0;
                spawn.nextSpawnTime = spawn.delay || 0.5;
            }
        }

        if (!wave.started) continue;

        const elapsed = gameTime - wave.startGameTime;

        for (let spawn of wave.spawns) {
            const perCycle = spawn.amount || 1;
            const repeats = spawn.repeat || 1;
            const delay = spawn.delay || 0.5;
            const cycleDelay = spawn.cycleDelay || delay * 2;
            const radius = spawn.radius || 300;

            while (spawn.repeatIndex < repeats && elapsed >= spawn.nextSpawnTime) {

                if (spawn.type === "boss") {
                    SpawnBoss(spawn.type, player_X, player_Y);
                } else {
                    const posList = getSpawnPositions(spawn.side, perCycle, radius);
                    const pos = posList[spawn.spawnIndex];
                    SpawnEnemy(spawn.type, pos.x, pos.y, spawn.side, spawn.parentDiameter);
                }

                spawn.spawnIndex++;

                if (spawn.spawnIndex >= perCycle) {
                    spawn.spawnIndex = 0;
                    spawn.repeatIndex++;
                    spawn.nextSpawnTime += cycleDelay;
                } else {
                    spawn.nextSpawnTime += delay;
                }
            }
        }
    }
}

function initWaves(waves) {
    activeWaves = waves;

    for (let wave of activeWaves) {
        wave.started = false;
        wave.startGameTime = 0;

        for (let spawn of wave.spawns) {
            spawn.spawnIndex = 0;
            spawn.repeatIndex = 0;
            spawn.nextSpawnTime = 0;
        }
    }
}
