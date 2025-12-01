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
    // Add custom behavior properties
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
      enemy.health = 3;
      enemy.speed = 2; 
      enemy.xSpeed = random() < 0.5 ? random(-6, -2) : random(2, 6);
      enemy.ySpeed = random() < 0.5 ? random(-6, -2) : random(2, 6);
      enemy.sound = "deathminidiamond";
      enemy.hitSound = "hitminidiamond";
      enemy.exp = 2;
      enemy.gold = 1;
      break;
      
    case "lilfella":
      enemy.diameter = 30;
      enemy.health = 3;
      enemy.speed = 1.7;  
      enemy.xSpeed = random() * 8 - 4;
      enemy.ySpeed = random() * 8 - 4;
      enemy.sound = "deathgrower";
      enemy.hitSound = "hitgrower";
      enemy.exp = 3;
      enemy.gold = 2;
      break;
      
    case "disc":
      enemy.diameter = random(40, 70);
      enemy.health = 20;
      enemy.speed = 2.5;
      enemy.xSpeed = random() * 8 - 4;
      enemy.ySpeed = random() * 8 - 4;
      enemy.sound = "deathdisc";
      enemy.hitSound = "hitdisc";
      enemy.exp = 5;
      enemy.gold = 6;
      break;
      
    case "chungusjr":
      enemy.diameter = 175;
      enemy.health = 28;
      enemy.speed = 1.2;  
      enemy.xSpeed = random() * 8 - 4;
      enemy.ySpeed = random() * 8 - 4;
      enemy.sound = "deathchungusjr";
      enemy.hitSound = "hitchungusjr";
      enemy.exp = 8;
      enemy.gold = 10;
      break;
      
    case "chungus":
      enemy.diameter = 200;
      enemy.health = 65;
      enemy.speed = 1.0;  
      enemy.xSpeed = random() * 8 - 4;
      enemy.ySpeed = random() * 8 - 4;
      enemy.sound = "deathchungus";
      enemy.hitSound = "hitchungus";
      enemy.exp = 20;
      enemy.gold = 22;
      break;
      
    case "chungussr":
      enemy.diameter = 225;
      enemy.health = 200;
      enemy.speed = 0.8;  
      enemy.xSpeed = random() * 8 - 4;
      enemy.ySpeed = random() * 8 - 4;
      enemy.sound = "deathchungussr";
      enemy.hitSound = "hitchungussr";
      enemy.exp = 40;
      enemy.gold = 35;
      break;
      
    case "dia":
      enemy.diameter = 65;
      enemy.health = 9;
      enemy.sound = "deathdiamond";
      enemy.hitSound = "hitdiamond";
      enemy.exp = 4;
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
      enemy.diameter = 126;
      enemy.health = 38;
      enemy.sound = "deathdiamond";
      enemy.hitSound = "hitdiamond";
      enemy.exp = 12;
      enemy.gold = 22;

      enemy.orbitMinDistance = 300;
      enemy.orbitMaxDistance = 700;
      enemy.orbitSpeed = 4;
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
      enemy.health = 10;
      enemy.xSpeed = 4;
      enemy.ySpeed = 4;
      enemy.sound = "deathgrower";
      enemy.hitSound = "hitgrower";
      enemy.exp = 5;
      enemy.gold = 8;
      break;
      
    default:
      console.warn("Unknown enemy type: " + type);
      return;
  }
  
  enemies.push(enemy);
}

// applies a neat little pulsing effect similer to Ye Old Grower' n shrinker
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
  radius = radius || 300; // default radius if not set

  switch (side) {
    case "left":
      for (let i = 0; i < amount; i++) {
        positions.push({ x: px - 600, y: py + (i * spacing) - (amount * spacing) / 2 });
      }
      break;

    case "right":
      for (let i = 0; i < amount; i++) {
        positions.push({ x: px + 600, y: py + (i * spacing) - (amount * spacing) / 2 });
      }
      break;

    case "top":
      for (let i = 0; i < amount; i++) {
        positions.push({ x: px + (i * spacing) - (amount * spacing) / 2, y: py - 600 });
      }
      break;

    case "bottom":
      for (let i = 0; i < amount; i++) {
        positions.push({ x: px + (i * spacing) - (amount * spacing) / 2, y: py + 600 });
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
          positions.push({ x: startX + col * gridSpacing, y: startY + row * gridSpacing });
          count++;
        }
      }
      break;

    case "square":
      // Spawn enemies evenly along a square perimeter around the player
      const sideCount = Math.ceil(amount / 4); // divide amount over 4 sides
      const half = radius; // half the size of the square
      let idx = 0;

      // top edge
      for (let i = 0; i < sideCount && idx < amount; i++, idx++) {
        const x = px - half + (i / sideCount) * (2 * half);
        const y = py - half;
        positions.push({ x, y });
      }

      // right edge
      for (let i = 0; i < sideCount && idx < amount; i++, idx++) {
        const x = px + half;
        const y = py - half + (i / sideCount) * (2 * half);
        positions.push({ x, y });
      }

      // bottom edge
      for (let i = 0; i < sideCount && idx < amount; i++, idx++) {
        const x = px + half - (i / sideCount) * (2 * half);
        const y = py + half;
        positions.push({ x, y });
      }

      // left edge
      for (let i = 0; i < sideCount && idx < amount; i++, idx++) {
        const x = px - half;
        const y = py + half - (i / sideCount) * (2 * half);
        positions.push({ x, y });
      }
      break;

    case "circle":
      // Spawn enemies evenly in a circle around the player
      for (let i = 0; i < amount; i++) {
        const angle = (i / amount) * TWO_PI;
        const r = radius;
        const x = px + cos(angle) * r;
        const y = py + sin(angle) * r;
        positions.push({ x, y });
      }
      break;

    case "center":
    default:
      for (let i = 0; i < amount; i++) {
        const angle = random() * TWO_PI;
        const r = radius + random(-50, 50);
        positions.push({ x: px + cos(angle) * r, y: py + sin(angle) * r });
      }
      break;
  }

  return positions;
}


// "Kill Enemy" effects such as diamond
function KillEnemy(index) {
  let enemy = enemies[index];
  // Cull prevents slain monsters from spawning more
  if (!cull){
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
  }

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

// Draws out the bad guys
// Draws chungusjr objects
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
        fill(60, 200, 160);
        let gd = e.diameter /2;
        quad(e.x, e.y - gd, e.x + gd, e.y, e.x, e.y + gd, e.x - gd, e.y);
        break;        
      case "minidia":
        fill(235, 140, 220);
        let hh = e.diameter / 2;
        quad(e.x, e.y - hh, e.x + hh, e.y, e.x, e.y + hh, e.x - hh, e.y);
        break;
      case "grower":
        fill(220, 100, 220);
        circle(e.x, e.y, e.diameter);
        break;
      case "lilfella":
        ConcentricCircle(e.x, e.y, e.diameter, e.diameter / 2,
          200, 250, 100, 50, 150, 220);
        break;
      case "chungusjr":
        drawChungusJr(e.x, e.y);
        break;
      case "chungus":
        drawChungus(e.x, e.y);
        break;
      case "chungussr":
        drawChungusSr(e.x, e.y);
        break;
    }
  }
}

// Moves obstacles and other floaty things
function MoveEnemies() {
  if (!game_State) return;
  
  let maxEnemies = 300;
  
  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    
    let distToPlayer = dist(enemy.x, enemy.y, player_X, player_Y);
    
    // Remove if too far away
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
      case "chungusjr":
      case "chungus":
      case "chungussr":
      case "minidia":
      case "lilfella":
        SeekPlayer(enemy);
        break;
        
      case "dia":
        // Diamonds orbit around player at distance
        OrbitPlayer(enemy);
        break;

      case "gigadia":
        // Diamonds orbit around player at distance
        OrbitPlayer(enemy);
        break;        
        
      case "grower":
        BounceOffBoundaries(enemy);
        break;
        
      case "chip":
      if (!enemy.nextDirectionChange) enemy.nextDirectionChange = millis() + 2000;
        if (millis() >= enemy.nextDirectionChange) {
        enemy.xSpeed = random(4, 6) * (random() < 0.5 ? -1 : 1);
        enemy.ySpeed = random(4, 6) * (random() < 0.5 ? -1 : 1);

          enemy.nextDirectionChange = millis() + 2000;
        }
      BounceOffBoundaries(enemy);
      break;
    }
    
    // Skip separation for diamonds to prevent odd bouncing
    if (enemy.type !== "grower" && enemy.type !== "minidia") {
      SeparateEnemies(enemy, enemies, i);
    }
    
    enemy.x += enemy.xSpeed;
    enemy.y += enemy.ySpeed;
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

// for grower/diamond behavior 
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
  const maxSeparationDistance = separationRadius * 3; // Increased from 2x to 3x for better separation
  
  for (let i = 0; i < allEnemies.length; i++) {
    if (i === currentIndex) continue;
    
    let other = allEnemies[i];
    let dx = enemy.x - other.x;
    let dy = enemy.y - other.y;
    let distance = sqrt(dx * dx + dy * dy); // Use sqrt instead of dist() for speed
    
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
  const nowSeconds = millis() / 1000;

  for (let wave of activeWaves) {

    // Start wave at its startTime
    if (!wave.started && nowSeconds >= wave.startTime) {
      wave.started = true;
      wave.startMillis = millis();

      for (let spawn of wave.spawns) {
        spawn.spawnIndex = 0;
        spawn.repeatIndex = 0;
        spawn.nextSpawnTime = spawn.delay || 0.5; // start after delay
      }
    }

    if (!wave.started) continue;

    const elapsed = (millis() - wave.startMillis) / 1000;

    for (let spawn of wave.spawns) {
      const perCycle = spawn.amount || 1;
      const repeats = spawn.repeat || 1;
      const delay = spawn.delay || 0.5;
      const cycleDelay = spawn.cycleDelay || delay * 2;
      const radius = spawn.radius || 300;

      // Spawn enemies while it’s time
      while (spawn.repeatIndex < repeats && elapsed >= spawn.nextSpawnTime) {

        // Get spawn positions based on side
        const posList = getSpawnPositions(spawn.side, perCycle, radius);
        const pos = posList[spawn.spawnIndex];

        // Spawn the enemy
        SpawnEnemy(spawn.type, pos.x, pos.y, spawn.side, spawn.parentDiameter);

        spawn.spawnIndex++;

        // Finished this cycle?
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

// Initialize waves so they each track their own state
function initWaves(waves) {
  activeWaves = waves;
  for (let wave of activeWaves) {
    wave.started = false;
    wave.startMillis = 0;

    for (let spawn of wave.spawns) {
      spawn.spawnIndex = 0;       // how many spawned this cycle
      spawn.repeatIndex = 0;      // which cycle (0..repeat-1)
      spawn.nextSpawnTime = 0;    // time after wave starts
    }
  }
}

