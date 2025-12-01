// Sound effects
let sounds = {};
let soundDelays = {};
const SOUND_DELAY = 16;
const SOUND_COUNT = 25;
var hoveredAttachmentId = null;
var death_Timer = 40;

// Game State settings and such
var global_Speed_Modifier = 2.0; // used for enemy only atm
const s = 83;
const w = 87;
const a = 65;
const d = 68;
var time = 0;
var frame_Time = 0;
var game_State = true;
var game_Screen = "menu"; // Menu, Paused, Playing, GameOver
var in_Shop = false;
var shopHoveredAttachment;
var shopSelectedAttachment;
var shopConfirmOpen = false;
var shopMouseReleased = true; // prevents repeated clicks to infinity and beyond
var pauseHoveredAttachmentId;
var attachmentLevels_Current = {};
var attachmentList = {};

var pauseKeyPressed = false;
var shipSelected;

var shipImages = {};
var selectedShip = 1;

// Ship rotation variables
var player_Rotation = 0;
var player_TargetRotation = 0;
var player_RotationSpeed = 0.08; // animation speed for the rotation

// Screen state
var shipSelectionActive = false;
var shipSelectionDelayCounter = 0;  // Prevents accidental multiple selections
let cameraX = 0;
let cameraY = 0;

// Buffer to prevent enemies from spawning "outside" the map
const bufferTop = 60;
const bufferBottom = 30;
const bufferLeft = 30;
const bufferRight = 30;
const minSpacing = 30;

// Player base values
var player_X;
var player_Y;
var player_Speed = 6;
var diameter = 58;
var grow_Speed = -0.05;
var player_Hitbox = 48; // slightly smaller hitbox for player instead of using diameter, gives a bit of leeway

var shield_Cooldown = 600;
var shield_Cooldown_Timer = 0;
var shield_Hit = false;
var shield_Value = 1;
var shield_Active = false;
var shield_Damage_Display = 0;
var shield_Display_Timer = 0;

var is_Crawling = false;
var has_Clicked = false;

var mouse_X;
var mouse_Y;

var Level = 1;
var Exp = 0;
var exp_Next = 25;
var player_Health = 5;
var BaseMaxHealth = 5;
var baseShielfValue = 1;
var max_Health = 5;

var Gold = 0;
var totalGold;
var hit_Timer = 80; // Sets Hit Timer (immune time) so you take damage on spawn (shouldn't happen)
var immune = true;   // Causes you to spawn immune, so you don't get spawn camped by the NPCs
var statConversions = {};

// Sets of arrays for moving object things
var spawnTimer;
var spawnTimerActive = false;
var activeWaves = [];

// Stage Setting Variables
var stage;

// Enemy
var enemies = [];
var chips = [];

// Chip stuff
let chip_X = [];
let chip_Y = [];
let chip_Diameter = [];
let chip_XSpeed = [];
let chip_YSpeed = [];

// Grower
var max_Speed = 10;

// Shooty McBullet Stuff
var shot_X = [];
var shot_Y = [];
var shot_xDistance = [];
var shot_yDistance = [];
var shot_PendingRemoval = [];
var shot_RemovalDelay = [];

// Player shooting stuff
var shot_HitEnemies = [];  // used to track penetration if the enemy has been hit by that shot
var burstDiameter;
const MAX_EQUIPPED_LIMIT = 4;
const COLLISION_COOLDOWN = 30;  // Time delay between a single shot hitting an enemy it just hit. Prevents gigadamage vs larger enemies when you have penetration
var shot_Active = false;
var shot = [];
var shot_Penetration_Array = [];
var shot_Penetration_Remaining = []; // WHY DID I ADD SHOT PENETRATION IT RUINED THE GAME
var shot_CollisionCooldown = [];
var shot_Diameter_Array = [];
var shot_Timer = [];

// Attachment stuff
var attachments = [];
var equippedAttachments = [];
var maxEquipped = 2;
var hoveredAttachmentId = null;
var mouseOverAttachmentX = 0;
var mouseOverAttachmentY = 0;

var shot_CurrentAmount = 0;
var shotTimer = 0;
var cd;
var fullAutoTimer = 0;
var fullAutoShotsFired = 0;
var fullAutoActive = false;

var angle;
var spread;
var baseAngle;

// stats that can be modified through powerups and such
var shot_Type = 0;    // 0 = Radial Shot, // 1 = shotgun, // 2 = auto // 3= wave // 4 = alternating  // 5 = Alternating Wave 
var waveEnabled = false;
var alternatingEnabled = false;

var alternatingFireSide = 0;
var shot_FirePattern = 0;  // 0 = single, 1 = burst, 2 = auto, 3 = sinwave, 4 = alternating
var shot_WavePattern = [];      // Which pattern (0=none, 1=sine)
var shot_WaveAmplitude = [];    // How wide the wave is
var shot_WaveFrequency = [];    // How fast it oscillates
var shot_DistanceTraveled = []; // How far the shot has moved
var shot_PowerArray = [];
var shot_SourceType = [];
var reflect = false;
var regen = false;
var siphon = false;
var convert_CooldownReduction = false;
var hypercharger = false;
var convert_EnergyShield = false;

var shot_MaxAmount;
var shot_Penetration;
const shot_Penetration_MAX = 12;

var shot_Power;
const shot_Power_MAX = 30;

var shot_Count;
const shot_Count_MAX = 20;

var cooldown_Reduction = 1;
const cdr_MAX = 80;

var shot_Speed;
const shot_Speed_MAX = 100;

var shot_Diameter;
const shot_Diameter_MAX = 60;

var shot_Duration;
const shot_Duration_MAX = 120;

var shot_Delay;
const shot_Delay_MIN = 1;

var burstCooldownTimer = 0;
var burstCooldown;
const burst_Cooldown_MIN = 4;

// Support unit stuff
var bitImage;
var cannonImage;
var blasterImage;

var shot_SourceType = []; // Used to differentiate projectile source. 0= player, 1= bit, 2= cannon, 3= blaster
var max_Supports = 3;
var supports = 0;
const max_Bits = 2;
const max_Cannons = 2;
const max_Blasters = 2;

var bits = 0;
var cannons = 0;
var blasters = 0;

var bit_ShotType = 0;
var bit_Power = 2;
var bit_Speed = 34;
var bit_ShotCount = 2;
var bit_Diameter = 12;
var bit_Cooldown = 60;
var bit_Duration = 50;
var bit_Angle = [];
var bit_CooldownTimer = [];

var cannon_ShotType = 1;
var cannon_Power = 4;
var cannon_Speed = 16;
var cannon_ShotCount = 3;
var cannon_Diameter = 24;
var cannon_Cooldown = 185;
var cannon_Duration = 30;
var cannon_Side = [];
var cannon_CooldownTimer = [];

var blaster_ShotType = 2;
var blaster_Power = 1;
var blaster_Speed = 26;
var blaster_ShotCount = 3;
var blaster_Diameter = 14;
var blaster_Cooldown = 150;
var blaster_Duration = 42;

var blaster_Angle = [];
var blaster_CooldownTimer = [];

var blaster_BurstActive = [];
var blaster_BurstTimer = [];
var blaster_ShotsFired = [];

// Wave stuff
var side;

// Items and drops
var items_X = [];
var items_Y = [];
var items_Type = [];
var items_Frame = [];
var items_Amount = [];

var activePowerupChoices = [];
const powerupOptions = [

  // Level 1-10 Power Ups
  { name: "Power +1", apply: () => { shot_Power += 1; }, display: () => shot_Power + 1 },
  { name: "Count +1", apply: () => { shot_Count += 1; }, display: () => shot_Count + 1 },
  { name: "Speed +2", apply: () => { shot_Speed += 1; }, display: () => shot_Speed + 1 },
  { name: "Delay -2", apply: () => { shot_Delay = Math.max(1, shot_Delay - 2); }, display: () => Math.max(1, shot_Delay - 2) },
  { name: "Diameter +2", apply: () => { shot_Diameter += 2; }, display: () => shot_Diameter + 2 },
  { name: "Duration +3", apply: () => { shot_Duration += 5; }, display: () => shot_Duration + 5 },
  { name: "Penetration +1", apply: () => { shot_Penetration += 1; }, display: () => shot_Penetration + 1 },
];

// Every 10 levels get one of this
const supportOptions = [
  { name: "Bit", apply: () => { UnlockBit(); }, display: () => bits + 1 },
  { name: "Cannon", apply: () => { UnlockCannon(); }, display: () => cannons + 1 },
  { name: "Blaster", apply: () => { UnlockBlaster(); }, display: () => blasters + 1 },
];

// The items which drop
const dropTable = {
  lilfella: [{ item: "exptoken", chance: 0.2 }],
  diamond: [{ item: "exptoken", chance: 0.4 }],
  grower: [{ item: "exptoken", chance: 1.0 }],
  chungusjr: [{ item: "exptoken", chance: 1.0 }],
  chungus: [{ item: "support", chance: 1.0 }],
  chungussr: [{ item: "support", chance: 1.0 }],
  disc: [{ item: "support", chance: 1.0 }]
};

var enemies = [];

// What they done be lookin like
const itemTable = {
  powerup: {
    frames: 4,
    frameSpeed: 12,
    size: 54,
    spriteSheet: null
  },
  exptoken: {
    frames: 4,
    frameSpeed: 12,
    size: 32,
    spriteSheet: null
  },
  ability: {
    frames: 8,
    frameSpeed: 12,
    size: 20,
    spriteSheet: null
  },
  support: {
    frames: 8,
    frameSpeed: 12,
    size: 20,
    spriteSheet: null
  }
};

// Math function to get distance 
function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Ability stuff 
var ability_Cooldown = 600;
var abilities = [];
var currentAbilityIndex = 0;
var abilityOnCooldown = false;
var abilityCooldownTimer = 0;

// flash
//
// Bomb
var bombExplosions = [];

// Barrage ability properties
var barrageShotsRemaining = 0;
var barrageTimer = 0;
var barrageActive = false;
const barrageRange = 800;

// Decimator Shot
var decimatorShotsRemaining = 0;
var decimatorTimer = 0;
var decimatorActive = false;

// Spiral Shot
let spiralShotsRemaining = 0;
let spiralTimer = 0;
let spiralAngle = 0;

// LIGHTNING BOLT LIGHTNING BOLT LIGHTNING BOLT 
let activeBolts = [];
let boltActive = false;
let boltTimer = 0;
const boltDuration = 40;
let boltHitEnemies = [];

var boltDamage = 14;
var boltCountModifier = 0;
var boltEchoChance = 0;

// Singularity
let singularityActive = false;
let singularityTimer = 0;
const singularityDuration = 100;
let singularityX = 0;
let singularityY = 0;
const singularityRadius = 150;  // 150 radius
let singularityCaughtEnemies = [];

const abilityList = {
bomb: {
  name: "Bomb",
  cooldown: 1000,
  effect: () => {
    damageCount = 0;
    console.log("BOMB ACTIVATED!");
    playSound('bomb');    
    bombExplosions.push({
      x: player_X,
      y: player_Y,
      maxRadius: 240,
      currentRadius: 0,
      duration: 40,
      age: 0
    });    
    DamageEnemiesInRadius(240, 16);
    console.log("Bomb hit " + damageCount + " enemies total");
  }
},
  shield: {
    name: "Barrier",
    cooldown: 1200,
    effect: () => {
      console.log("BARRIER ACTIVATED!");
      playSound('barrier');
      immune = true;
      hit_Timer = 135;  // 2.5ish seconds of immunity tried to tie it to the sound effect duration  
  }
  },
  flash: {
    name: "Flash",
    cooldown: 600,
    effect: () => {
      console.log("AYAYA GO FAST");
      playSound('flash');
      
      let newX = GetWorldMouseX();  
      let newY = GetWorldMouseY(); 
      let angle = atan2(newY - player_Y, newX - player_X);
      
      player_X += cos(angle) * 300;
      player_Y += sin(angle) * 300;
      
      // Update camera immediately (this is key)
      cameraX = player_X - width / 2;
      cameraY = player_Y - height / 2;
    }
  },
  autofirebarrage: {  // Fires auto targeting barrage of projectiles at nearest enemy
    name: "AutoFire Barrage",
    cooldown: 900,
    effect: () => {
      console.log("AUTOFIRE BARRAGE ACTIVATED!");
      playSound('shotfullauto');
      barrageShotsRemaining = 16 + (shot_Count * 4);
      barrageActive = true;  // Marks the barrage as active
      barrageTimer = 0;  // Reset timer
    }
  },
  decimator: {    // Fires a series of waves of projectiles which pierce and grants shotpen while active
    name: "Decimator",
    cooldown: 900,
    effect: () => {
      console.log("DECIMATOR ACTIVATED!");
      playSound('charging');
      decimatorShotsRemaining = 6 + (shot_Count);
      decimatorTimer = 0;
    }
  },
  spiralshot: {   // Fires spiraling shouts out from caster
    name: "Spiral Shot",
    cooldown: 900,
    effect: () => {
      console.log("SPIRAL SHOT ACTIVATED!");
      playSound('shotfullauto');

      spiralShotsRemaining = 30 + shot_Count;
      spiralTimer = 0;
      spiralAngle = -PI / 2;  // Start at "12" (up)
    }
  },
  lightningbolt: {  // Calls down bolts of lightning hitting targets across the screen
    name: "Lightning Bolt",
    cooldown: 1600,
    effect: () => {
      console.log("LIGHTNING BOLT LIGHTNING BOLT LIGHTNING BOLT!");
      playSound('abilitylightningbolt');
      boltActive = true;
      boltTimer = 0;
      boltHitEnemies = [];
      
      // Generate 6-8 lightning bolts across the visible world
      boltCountModifier;
      let boltCount = floor(random(6, 9) + boltCountModifier);  // 6-8 bolts + modifier to bolt count
      activeBolts = [];
      
      for (let b = 0; b < boltCount; b++) {
        let boltArray = [];
        
        // Convert screen space to world space
        // Distribute bolts across the visible screen width
        let screenX = map(b, 0, boltCount - 1, 0, width);
        let worldX = screenX + cameraX;  // Convert to world coordinates
        let worldY = cameraY - 100;  // Start above visible area
        
        let currentX = worldX;
        let currentY = worldY;
        let segmentLength = 30;
        
        // Random bolt length
        let boltLength = random(height - 200, height - 30);
        
        while (currentY < worldY + boltLength) {
          boltArray.push({ x: currentX, y: currentY });
          // Random walk for the bolt
          currentX += random(-40, 40);
          currentY += segmentLength + random(-10, 10);
          // Keep it roughly in the world (wide bounds)
          currentX = constrain(currentX, worldX - 200, worldX + 200);
        }
        activeBolts.push(boltArray);
      }
    }
  },
  singularity: {    // Create a black hole like effect and deal damage after a delay
    name: "Singularity",
    cooldown: 1320,
    effect: () => {
      console.log("SINGULARITY ACTIVATED!");
      playSound('singularity');
      singularityActive = true;
      singularityTimer = 0;
      singularityX = GetWorldMouseX();  
      singularityY = GetWorldMouseY(); 
      singularityCaughtEnemies = [];
    }
  }
};

// Attachment List/Info
const attachmentLevels = {
  1: {
    name: "Multi-shot",
    baseIcon: "../Images/attachment_multishot.png",
    levels: {
      0: {
        cost: 600,
        itemInfo: "Increases Shot Count by 2, reduces Shot Speed by 3.",
        stats: [
          { stat: "shot_Count", value: 2 },
          { stat: "shot_Speed", value: -3 }
        ]
      },
      1: {
        cost: 800,
        itemInfo: "Increases Shot Count by 3, reduces Shot Speed by 2.",
        stats: [
          { stat: "shot_Count", value: 3 },
          { stat: "shot_Speed", value: -2 }
        ]
      },
      2: {
        cost: 1000,
        itemInfo: "Increases Shot Count by 4, reduces Shot Speed by 1.",
        stats: [
          { stat: "shot_Count", value: 4 },
          { stat: "shot_Speed", value: -1 }
        ]
      },
      3: {
        cost: 1200,
        itemInfo: "Increases Shot Count by 5, Shot Speed unchanged.",
        stats: [
          { stat: "shot_Count", value: 5 }
        ]
      }
    }
  },

  2: {
    name: "Hypershot",
    baseIcon: "../Images/attachment_hypershot.png",
    levels: {
      0: {
        cost: 600,
        itemInfo: "Increases Shot Speed by 5, reduces Diameter by 2 and reduces Burst Cooldown by 4.",
        stats: [
          { stat: "shot_Diameter", value: -2 },
          { stat: "shot_Speed", value: 5 },
          { stat: "burst_Cooldown", value: 4 }
        ]
      },
      1: {
        cost: 800,
        itemInfo: "Increases Shot Speed by 6, reduces Diameter by 1 and reduces Burst Cooldown by 5.",
        stats: [
          { stat: "shot_Diameter", value: -1 },
          { stat: "shot_Speed", value: 6 },
          { stat: "burst_Cooldown", value: 5 }
        ]
      },
      2: {
        cost: 1000,
        itemInfo: "Increases Shot Speed by 7, no Diameter penalty and reduces Burst Cooldown by 6.",
        stats: [
          { stat: "shot_Speed", value: 7 },
          { stat: "burst_Cooldown", value: 6 }
        ]
      },
      3: {
        cost: 1200,
        itemInfo: "Increases Shot Speed by 8, Diameter by 1 and reduces Burst Cooldown by 7.",
        stats: [
          { stat: "shot_Diameter", value: 1 },
          { stat: "shot_Speed", value: 8 },
          { stat: "burst_Cooldown", value: 7 }
        ]
      }
    }
  },

  3: {
    name: "Rapid-loader",
    baseIcon: "../Images/attachment_rapidloader.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "Increases Fire Rate by 4, reduces Burst Cooldown by 5 and reduces Shot Speed by 3.", 
        stats: [
        { stat: "shot_Speed", value: -3 }, 
        { stat: "shot_Delay", value: -4 }, 
        { stat: "burst_Cooldown", value: 5 }] },
      1: { 
        cost: 800, 
        itemInfo: "Increases Fire Rate by 5, reduces Burst Cooldown by 6 and reduces Shot Speed by 2.", 
        stats: [
          { stat: "shot_Speed", value: -2 }, 
          { stat: "shot_Delay", value: -5 }, 
          { stat: "burst_Cooldown", value: 6 }] },
      2: { 
        cost: 1000, 
        itemInfo: "Increases Fire Rate by 6, reduces Burst Cooldown by 7 and reduces Shot Speed by 1.", 
        stats: [
          { stat: "shot_Speed", value: -1 }, 
          { stat: "shot_Delay", value: -6 }, 
          { stat: "burst_Cooldown", value: 7 }] },
      3: { cost: 1200, 
        itemInfo: "Increases Fire Rate by 7, reduces Burst Cooldown by 8.", 
        stats: [
          { stat: "shot_Delay", value: -7 }, 
          { stat: "burst_Cooldown", value: 8 }] }
    }
  },

  4: {
    name: "Lancer Rounds",
    baseIcon: "../Images/attachment_lancerrounds.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "Increases Shot Penetration by 1, reduces Fire Rate by 4", 
        stats: [
          { stat: "shot_Penetration", value: 1 }, 
          { stat: "shot_Delay", value: 4 }] },
      1: { 
        cost: 800, 
        itemInfo: "Increases Shot Penetration by 2, reduces Fire Rate by 3", 
        stats: [
          { stat: "shot_Penetration", value: 2 }, 
          { stat: "shot_Delay", value: 3 }] },
      2: { 
        cost: 1000, 
        itemInfo: "Increases Shot Penetration by 3, reduces Fire Rate by 2", 
        stats: [
          { stat: "shot_Penetration", value: 3 }, 
          { stat: "shot_Delay", value: 2 }] },
      3: { 
        cost: 1200, 
        itemInfo: "Increases Shot Penetration by 4, reduces Fire Rate by 1", 
        stats: [
          { stat: "shot_Penetration", value: 4 }, 
          { stat: "shot_Delay", value: 1 }] }
    }
  },

  5: {
    name: "Magnifier",
    baseIcon: "../Images/attachment_magnifier.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "Increases Shot Diameter by 12. (Does not effect Beam attacks).", 
        stats: [
          { stat: "shot_Diameter", value: 12 }] },
      1: { 
        cost: 800, 
        itemInfo: "Increases Shot Diameter by 15. (Does not effect Beam attacks).", 
        stats: [
          { stat: "shot_Diameter", value: 15 }] },
      2: { 
        cost: 1000, 
        itemInfo: "Increases Shot Diameter by 18. (Does not effect Beam attacks).", 
        stats: [{ stat: "shot_Diameter", value: 18 }] },
      3: { 
        cost: 1200, 
        itemInfo: "Increases Shot Diameter by 21. (Does not effect Beam attacks).", 
        stats: [
        { stat: "shot_Diameter", value: 21 }] }
    }
  },

  6: {
    name: "Zero-Point Battery",
    baseIcon: "../Images/attachment_zeropointbattery.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "Increases Cooldown Reduction by 24.", 
        stats: [
          { stat: "cooldown_Reduction", value: 24 }] },
      1: { 
        cost: 800, 
        itemInfo: "Increases Cooldown Reduction by 30.", 
        stats: [
          { stat: "cooldown_Reduction", value: 30 }] },
      2: { 
        cost: 1000, 
        itemInfo: "Increases Cooldown Reduction by 36.", 
        stats: [
          { stat: "cooldown_Reduction", value: 36 }] },
      3: { 
        cost: 1200, 
        itemInfo: "Increases Cooldown Reduction by 42.", 
        stats: [
          { stat: "cooldown_Reduction", value: 42 }] }
    }
  },

  7: {
    name: "Giga Rounds",
    baseIcon: "../Images/attachment_gigarounds.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "Increases Shot Power by 1, and Shot Diameter by 8.", 
        stats: [
          { stat: "shot_Diameter", value: 8 }, 
          { stat: "shot_Power", value: 1 }] },
      1: { 
        cost: 800, 
        itemInfo: "Increases Shot Power by 2, and Shot Diameter by 10.", 
        stats: [
          { stat: "shot_Diameter", value: 10 }, 
          { stat: "shot_Power", value: 2 }] },
      2: { 
        cost: 1000, 
        itemInfo: "Increases Shot Power by 3, and Shot Diameter by 12.", 
        stats: [
          { stat: "shot_Diameter", value: 12 },
          { stat: "shot_Power", value: 3 }] },
      3: { 
        cost: 1200,
        itemInfo: "Increases Shot Power by 4, and Shot Diameter by 14.", 
        stats: [
          { stat: "shot_Diameter", value: 14 }, 
          { stat: "shot_Power", value: 4 }] }
    }
  },

  8: {
    name: "Defense Matrix",
    baseIcon: "../Images/attachment_defensematrix.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "Increases Shield Value by 2, reduces Shield Charge time by 50.", 
        stats: [
          { stat: "shield_Cooldown", value: -50 }, 
          { stat: "shield_Value", value: 2 }] },
      1: { 
        cost: 800, 
        itemInfo: "Increases Shield Value by 3, reduces Shield Charge time by 60.", 
        stats: [
          { stat: "shield_Cooldown", value: -60 },
          { stat: "shield_Value", value: 3 }] },
      2: { 
        cost: 1000, 
        itemInfo: "Increases Shield Value by 4, reduces Shield Charge time by 70.", 
        stats: [
          { stat: "shield_Cooldown", value: -70 }, 
          { stat: "shield_Value", value: 4 }] },
      3: { 
        cost: 1200, 
        itemInfo: "Increases Shield Value by 5, reduces Shield Charge time by 80.", 
        stats: [
          { stat: "shield_Cooldown", value: -80 }, 
          { stat: "shield_Value", value: 5 }] }
    }
  },

  9: {
    name: "Targeting Dynamo",
    baseIcon: "../Images/attachment_turbocharger.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "Increases Shot Speed by 4, Fire Rate by 2, but reduces Shot Power by 1.", 
        stats: [
          { stat: "shot_Delay", value: -2 }, 
          { stat: "shot_Speed", value: 4 }, 
          { stat: "shot_Power", value: -1 }] },
      1: { 
        cost: 800, 
        itemInfo: "Increases Shot Speed by 5, Fire Rate by 3, but reduces Shot Power by 1.", 
        stats: [
          { stat: "shot_Delay", value: -3 }, 
          { stat: "shot_Speed", value: 5 }, 
          { stat: "shot_Power", value: -1 }] },
      2: { 
        cost: 1000, 
        itemInfo: "Increases Shot Speed by 6, Fire Rate by 4, but reduces Shot Power by 1.", 
        stats: [
          { stat: "shot_Delay", value: -4 }, 
          { stat: "shot_Speed", value: 6 }, 
          { stat: "shot_Power", value: -1 }] },
      3: { 
        cost: 1200, 
        itemInfo: "Increases Shot Speed by 7, Fire Rate by 5.", 
        stats: [
          { stat: "shot_Delay", value: -5 }, 
          { stat: "shot_Speed", value: 7 }] }
    }
  },

  10: {
    name: "Photon Rounds",
    baseIcon: "../Images/attachment_photonrounds.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "Increases Shot Speed and Duration by 10.", 
        stats: [
          { stat: "shot_Speed", value: 10 }, 
          { stat: "shot_Duration", value: 10 }] },
      1: { 
        cost: 800, 
        itemInfo: "Increases Shot Speed and Duration by 12.", 
        stats: [
          { stat: "shot_Speed", value: 12 }, 
          { stat: "shot_Duration", value: 12 }] },
      2: { 
        cost: 1000, 
        itemInfo: "Increases Shot Speed and Duration by 14.", 
        stats: [
          { stat: "shot_Speed", value: 14 }, 
          { stat: "shot_Duration", value: 14 }] },
      3: { 
        cost: 1200, 
        itemInfo: "Increases Shot Speed and Duration by 16.", 
        stats: [
          { stat: "shot_Speed", value: 16 }, 
          { stat: "shot_Duration", value: 16 }] }
    }
  },

  11: {
    name: "Destructinator",
    baseIcon: "../Images/attachment_destructinator.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "Increases Shot Penetration by 2, but reduces Shot Duration by 4 and Shot Power by 2.", 
        stats: [
          { stat: "shot_Duration", value: -4 }, 
          { stat: "shot_Penetration", value: 2 }, 
          { stat: "shot_Power", value: -2 }] },
      1: { 
        cost: 800, 
        itemInfo: "Increases Shot Penetration by 3, but reduces Shot Duration by 3 and Shot Power by 2.", 
        stats: [
          { stat: "shot_Duration", value: -3 }, 
          { stat: "shot_Penetration", value: 3 }, 
          { stat: "shot_Power", value: -2 }] },
      2: { 
        cost: 1000, 
        itemInfo: "Increases Shot Penetration by 4, but reduces Shot Duration by 2 and Shot Power by 1.", 
        stats: [
          { stat: "shot_Duration", value: -2 }, 
          { stat: "shot_Penetration", value: 4 }, 
          { stat: "shot_Power", value: -1 }] },
      3: { 
        cost: 1200, 
        itemInfo: "Increases Shot Penetration by 5, reduces Shot Duration by 1.", 
        stats: [
          { stat: "shot_Duration", value: -1 }, 
          { stat: "shot_Penetration", value: 5 }] }
    }
  },

  12: {
    name: "Mirror Shots",
    baseIcon: "../Images/attachment_mirrorshots.png",
    levels: {
      0: { 
        cost: 1500, 
        itemInfo: "Causes your shots to ricochet.", stats: [{ stat: "reflect", value: true }] },
      1: { 
        cost: 800, 
        itemInfo: "Causes your shots to ricochet and increases Shot Speed by 2.", 
        stats: [
          { stat: "reflect", value: true },
          { stat: "shot_Speed", value: 2 }] },          
      2: { 
        cost: 1200, 
        itemInfo: "Causes your shots to ricochet, increases Shot Speed by 2 and reduces Burst Cooldown by 2.", 
        stats: [
          { stat: "reflect", value: true },
          { stat: "burst_Cooldown", value: 2 },          
          { stat: "shot_Speed", value: 2 }] },    
      3: { 
        cost: 1800, 
        itemInfo: "Causes your shots to ricochet, increases Shot Speed by 4, reduces Burst Cooldown by 4.", 
        stats: [
          { stat: "reflect", value: true } ,
          { stat: "burst_Cooldown", value: 4 },           
          { stat: "shot_Speed", value: 4 }] },    
    }
  },

  13: {
    name: "Blast Shield",
    baseIcon: "../Images/attachment_blastshield.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "Increases Shield Value by 4 and Health by 1.", 
        stats: [
          { stat: "shield_Value", value: 4 }, 
          { stat: "max_Health", value: 1 }] },
      1: { 
        cost: 800, 
        itemInfo: "Increases Shield Value by 5 and Health by 2.", 
        stats: [
          { stat: "shield_Value", value: 5 }, 
          { stat: "max_Health", value: 2 }] },
      2: { 
        cost: 1000, 
        itemInfo: "Increases Shield Value by 6 and Health by 3.",
         stats: [
          { stat: "shield_Value", value: 6 }, 
          { stat: "max_Health", value: 3 }] },
      3: { 
        cost: 1200, 
        itemInfo: "Increases Shield Value by 7 and Health by 4.", 
        stats: [
          { stat: "shield_Value", value: 7 }, 
          { stat: "max_Health", value: 4 }] }
    }
  },

  14: {
    name: "Charge Converter",
    baseIcon: "../Images/attachment_chargeconverter.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "-Not Implemented Yet- Increases and reductions to Firing Rate instead apply to Cooldown Reduction at 100% increased value.", 
        stats: [], conversion: {} },
      1: { 
        cost: 800, 
        itemInfo: "-Not Implemented Yet- Increases and reductions to Firing Rate instead apply to Cooldown Reduction at 100% increased value.", 
        stats: [], conversion: {} },
      2: { 
        cost: 1000, 
        itemInfo: "-Not Implemented Yet- Increases and reductions to Firing Rate instead apply to Cooldown Reduction at 100% increased value.", 
        stats: [], conversion: {} },
      3: { 
        cost: 1200, 
        itemInfo: "-Not Implemented Yet- Increases and reductions to Firing Rate instead apply to Cooldown Reduction at 100% increased value.", 
        stats: [], conversion: {} }
    }
  },

  15: {
    name: "Hypercharger",
    baseIcon: "../Images/attachment_conversioncore.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "Doubles Shot Speed and reduces Burst Cooldown by 8.", 
        stats: [
        { stat: "shot_Speed_multiply", value: 1 }, 
        { stat: "burst_Cooldown", value: 8 }] },
      1: { 
        cost: 800, 
        itemInfo: "Doubles Shot Speed and reduces Burst Cooldown by 10.", 
        stats: [
        { stat: "shot_Speed_multiply", value: 1 }, 
        { stat: "burst_Cooldown", value: 10 }] },
      2: { 
        cost: 1000, 
        itemInfo: "Doubles Shot Speed and reduces Burst Cooldown by 12.", 
        stats: [
        { stat: "shot_Speed_multiply", value: 1 }, 
        { stat: "burst_Cooldown", value: 12 }] },
      3: { 
        cost: 1200, 
        itemInfo: "Doubles Shot Speed and reduces Burst Cooldown by 14.", 
        stats: [
        { stat: "shot_Speed_multiply", value: 1 }, 
        { stat: "burst_Cooldown", value: 14 }] }
    }
  },

  16: {
    name: "Cyclotron",
    baseIcon: "../Images/attachment_cyclotron.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "Increases Shot Speed by 3, Shot Count by 2, and increases Cooldown Reduction by 10.", 
        stats: [
        { stat: "shot_Speed", value: 4 }, 
        { stat: "shot_Count", value: 2 }, 
        { stat: "cooldown_Reduction", value: 10 }] },
      1: { 
        cost: 800, 
        itemInfo: "Increases Shot Speed by 4, Shot Count by 3, and increases Cooldown Reduction by 12.", 
        stats: [
        { stat: "shot_Speed", value: 5 },
        { stat: "shot_Count", value: 3 }, 
        { stat: "cooldown_Reduction", value: 12 }] },
      2: { 
        cost: 1000, 
        itemInfo: "Increases Shot Speed by 5, Shot Count by 4, and increases Cooldown Reduction by 14.",
        stats: [
        { stat: "shot_Speed", value: 6 }, 
        { stat: "shot_Count", value: 4 }, 
        { stat: "cooldown_Reduction", value: 14 }] },
      3: { 
        cost: 1200, 
        itemInfo: "Increases Shot Speed by 6, Shot Count by 5, and increases Cooldown Reduction by 16.", 
        stats: [
        { stat: "shot_Speed", value: 7 }, 
        { stat: "shot_Count", value: 5 }, 
        { stat: "cooldown_Reduction", value: 16 }] }
    }
  },

  17: {
    name: "Delta Cannon",
    baseIcon: "../Images/attachment_deltacannon.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "Increases Shot Power by 3, Fire Rate by 3, and reduces Burst Cooldown by 3.",
        stats: [
        { stat: "shot_Power", value: 3 }, 
        { stat: "shot_Delay", value: 3 }, 
        { stat: "burst_Cooldown", value: 3 }] },
      1: { 
        cost: 800, 
        itemInfo: "Increases Shot Power by 4, Fire Rate by 4, and reduces Burst Cooldown by 4.", 
        stats: [
        { stat: "shot_Power", value: 4 }, 
        { stat: "shot_Delay", value: 4 }, 
        { stat: "burst_Cooldown", value: 4 }] },
      2: { 
        cost: 1000, 
        itemInfo: "Increases Shot Power by 5, Fire Rate by 5, and reduces Burst Cooldown by 5.", 
        stats: [
        { stat: "shot_Power", value: 5 }, 
        { stat: "shot_Delay", value: 5 }, 
        { stat: "burst_Cooldown", value: 5 }] },
      3: { 
        cost: 1200, 
        itemInfo: "Increases Shot Power by 6, Fire Rate by 6, and reduces Burst Cooldown by 6.", 
        stats: [
        { stat: "shot_Power", value: 6 }, 
        { stat: "shot_Delay", value: 6 }, 
        { stat: "burst_Cooldown", value: 6 }] }
    }
  },

  18: {
    name: "Laser Battery",
    baseIcon: "../Images/attachment_laserbattery.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "Reduces Shield Charge time by 40, and increases Cooldown Reduction by 20.", 
        stats: [
        { stat: "shield_Cooldown", value: -40 }, 
        { stat: "cooldown_Reduction", value: 20 }] },
      1: { 
        cost: 800, 
        itemInfo: "Reduces Shield Charge time by 50, and increases Cooldown Reduction by 25.", 
        stats: [
        { stat: "shield_Cooldown", value: -50 }, 
        { stat: "cooldown_Reduction", value: 25 }] },
      2: { 
        cost: 1000, 
        itemInfo: "Reduces Shield Charge time by 60, and increases Cooldown Reduction by 30.", 
        stats: [
        { stat: "shield_Cooldown", value: -60 }, 
        { stat: "cooldown_Reduction", value: 30 }] },
      3: { 
        cost: 1200, 
        itemInfo: "Reduces Shield Charge time by 70, and increases Cooldown Reduction by 35.", 
        stats: [
        { stat: "shield_Cooldown", value: -70 }, 
        { stat: "cooldown_Reduction", value: 35 }] }
    }
  },

  19: {
    name: "Energy Shield",
    baseIcon: "../Images/attachment_energyshield.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "Converts 30% of your Maximum Health to Shield Value.", stats: [{}], 
      conversion: 
      { fromStat: "max_Health", toStat: "shield_Value", percentage: 0.30 } },
      1: { 
        cost: 800, 
        itemInfo: "Converts 35% of your Maximum Health to Shield Value.", stats: [{}], 
      conversion: 
      { fromStat: "max_Health", toStat: "shield_Value", percentage: 0.35 } },
      2: { 
        cost: 1000, 
        itemInfo: "Converts 40% of your Maximum Health to Shield Value.", stats: [{}], 
      conversion: 
      { fromStat: "max_Health", toStat: "shield_Value", percentage: 0.40 } },
      3: { 
        cost: 1200, 
        itemInfo: "Converts 45% of your Maximum Health to Shield Value.", stats: [{}], 
      conversion: 
      { fromStat: "max_Health", toStat: "shield_Value", percentage: 0.45 } }
    }
  },

  20: {
    name: "Power Core",
    baseIcon: "../Images/attachment_powercore.png",
    levels: {
      0: { 
        cost: 600, 
        itemInfo: "Increases Shot Power by 1, Shot Speed by 2, and reduces Burst Cooldown by 4.", 
        stats: [
        { stat: "shot_Power", value: 1 }, 
        { stat: "shot_Speed", value: 2 }, 
        { stat: "burstCooldown", value: -4 },
        { stat: "shot_WavePattern", value: 1 }] },
      1: { 
        cost: 800, 
        itemInfo: "Increases Shot Power by 2, Shot Speed by 3, and reduces Burst Cooldown by 5.", 
        stats: [
        { stat: "shot_Power", value: 2 }, 
        { stat: "shot_Speed", value: 3 }, 
        { stat: "burstCooldown", value: -5 }] },
      2: { 
        cost: 1000, 
        itemInfo: "Increases Shot Power by 3, Shot Speed by 4, and reduces Burst Cooldown by 6.", 
        stats: [
        { stat: "shot_Power", value: 3 }, 
        { stat: "shot_Speed", value: 4 }, 
        { stat: "burstCooldown", value: -6 }] },
      3: { 
        cost: 1200, 
        itemInfo: "Increases Shot Power by 4, Shot Speed by 5, and reduces Burst Cooldown by 7.", 
        stats: [
        { stat: "shot_Power", value: 4 }, 
        { stat: "shot_Speed", value: 5 }, 
        { stat: "burstCooldown", value: -7 }] }
    }
  }
};

// Grid display
const attachmentGrid = [
  [1, 2, 3, 4, 5],      // Row A
  [6, 7, 8, 9, 10],      // Row B
  [11, 12, 13, 14, 15],    // Row C
  [16, 17, 18, 19, 20]    // Row D
];

attachmentImages = {};
grayscaleAttachmentImages = {};

// Damage values for enemies
const ENEMY_TYPES = {
  DISC: 2,
  CHIP: 3,
  MINIDIA: 1,
  GROWER: 1,
  CHUNGUSJR: 3,
  CHUNGUS: 5,
  CHUNGUSSR: 8,
  DIA: 1,
  LILFELLA: 1
};

// Wave spawning stuff
const stage1Waves = [
  {
    startTime: 2, 
    spawns: [
      { type: "dia", amount: 3, side: "left", delay: 1, repeat: 4 },
      { type: "lilfella", amount: 18, side: "square", delay: 0.2, repeat: 2, cycleDelay: 10},
      { type: "chip", amount: 1, side: "center", delay: 0.5, repeat: 1, radius: 400 }
    ]
  }/*,
  {
    startTime: 10,
    spawns: [
      { type: "grower", amount: 3, side: "left", delay: 2, repeat: 1, radius: 900 }
    ]
  },
  {
    startTime: 15,
    spawns: [
      { type: "lilfella", amount: 22, side: "center", delay: 1, repeat: 3, radius: 780 }
    ]
  },
  {
    startTime: 20,
    spawns: [
      { type: "chungusjr", amount: 2, side: "center", delay: 1, repeat: 1, radius: 780 }
    ]
  },
  {
    startTime: 25,
    spawns: [
      { type: "chungus", amount: 1, side: "center", delay: 1, repeat: 1, radius: 780 }
    ]
  },
  {
    startTime: 30,
    spawns: [
      { type: "chungussr", amount: 1, side: "center", delay: 1, repeat: 1, radius: 780 }
    ]
  },
  {
    startTime: 35,
    spawns: [
      { type: "lilfella", amount: 6, side: "grid", delay: 0.5, repeat: 5, radius: 780 }
    ]
  } */
];


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


function preload() {
  console.log("Preloading assets, sounds, images, etc");
  //UI/Menu sfx
  sounds.error = [];
  sounds.equipattachment = [];
  sounds.removeattachment = [];
  sounds.confirm = [];
  sounds.select = [];
  sounds.gamestart = [];
  sounds.getpowerup = [];
  sounds.getexptoken = [];
  sounds.getability = [];
  sounds.getsupport = [];

  // Ability Sounds
  sounds.charging = [];
  sounds.barrier = [];
  sounds.bomb = [];
  sounds.flash = [];
  sounds.singularity = [];
  sounds.abilitydecimator = [];
  sounds.abilitylightningbolt = [];

  // All other sounds
  sounds.blast = [];
  sounds.bounce = [];
  sounds.death = [];
  sounds.deathchungusjr = [];
  sounds.deathchungus = [];
  sounds.deathchungussr = [];
  sounds.deathdiamond = [];
  sounds.deathdisc = [];
  sounds.deathgrower = [];
  sounds.deathminidiamond = [];
  sounds.deathlilfella = [];
  sounds.hitchungusjr = [];
  sounds.hitchungus = [];
  sounds.hitchungussr = [];
  sounds.hitdiamond = [];
  sounds.hitdisc = [];
  sounds.hitgrower = [];
  sounds.hitminidiamond = [];
  sounds.hitlilfella = [];
  sounds.levelup = [];
  sounds.playerhit = [];
  sounds.shotfullauto = [];
  sounds.shotshotgun = [];
  sounds.shotsingle = [];
  sounds.shotbit = [];
  sounds.shotblaster = [];
  sounds.shotcannon = [];

  // Preload for ship sprites
  shipImages[1] = loadImage('Images/ship_1.png');
  shipImages[2] = loadImage('Images/ship_2.png');
  shipImages[3] = loadImage('Images/ship_3.png');
  shipImages[4] = loadImage('Images/ship_4.png');

  // Support Object images
  bitImage = loadImage('Images/bit.png');
  cannonImage = loadImage('Images/cannon.png');
  blasterImage = loadImage('Images/blaster.png');
  itemTable.powerup.spriteSheet = loadImage('Images/powerup_spritesheet.png');
  itemTable.exptoken.spriteSheet = loadImage('Images/exptoken_spritesheet.png');
  itemTable.ability.spriteSheet = loadImage('Images/ability_spritesheet.png');
  itemTable.support.spriteSheet = loadImage('Images/ability_spritesheet.png');

  for (i = 0; i < SOUND_COUNT; i++) {
    // UI/Menu Sfx
    sounds.charging.push(loadSound('../Audio/Charging.ogg'));
    sounds.error.push(loadSound('../Audio/Error.ogg'));
    sounds.equipattachment.push(loadSound('../Audio/EquipAttachment.ogg'));
    sounds.removeattachment.push(loadSound('../Audio/RemoveAttachment.ogg'));
    sounds.confirm.push(loadSound('../Audio/Confirm.ogg'));
    sounds.select.push(loadSound('../Audio/Select.ogg'));
    sounds.gamestart.push(loadSound('../Audio/GameStart.ogg'));
    sounds.getpowerup.push(loadSound('../Audio/GetPowerUp.ogg'));
    sounds.getexptoken.push(loadSound('../Audio/GetExpToken.ogg'));
    sounds.getability.push(loadSound('../Audio/GetAbility.ogg'));
    sounds.getsupport.push(loadSound('../Audio/GetSupport.ogg'));
    sounds.charging.push(loadSound('../Audio/Charging.ogg'));

    // Ability sounds
    sounds.barrier.push(loadSound('../Audio/Barrier.ogg'));
    sounds.bomb.push(loadSound('../Audio/Bomb.ogg'));
    sounds.flash.push(loadSound('../Audio/Flash.ogg'));
    sounds.singularity.push(loadSound('../Audio/Singularity.ogg'));
    sounds.abilitydecimator.push(loadSound('../Audio/AbilityDecimator.ogg'));
    sounds.abilitylightningbolt.push(loadSound('../Audio/AbilityLightningBolt.ogg'));

    // Other sounds
    sounds.blast.push(loadSound('../Audio/Blast.ogg'));
    sounds.bounce.push(loadSound('../Audio/Bounce.ogg'));
    sounds.death.push(loadSound('../Audio/Death.ogg'));
    sounds.deathchungusjr.push(loadSound('../Audio/DeathChungusJr.ogg'));
    sounds.deathchungus.push(loadSound('../Audio/DeathChungus.ogg'));
    sounds.deathchungussr.push(loadSound('../Audio/DeathChungusSr.ogg'));
    sounds.deathdiamond.push(loadSound('../Audio/DeathDiamond.ogg'));
    sounds.deathdisc.push(loadSound('../Audio/DeathDisc.ogg'));
    sounds.deathgrower.push(loadSound('../Audio/DeathGrower.ogg'));
    sounds.deathminidiamond.push(loadSound('../Audio/DeathMiniDiamond.ogg'));
    sounds.deathlilfella.push(loadSound('../Audio/DeathLilfella.ogg'));
    sounds.hitchungusjr.push(loadSound('../Audio/HitChungusJr.ogg'));
    sounds.hitchungus.push(loadSound('../Audio/HitChungus.ogg'));
    sounds.hitchungussr.push(loadSound('../Audio/HitChungusSr.ogg'));
    sounds.hitdiamond.push(loadSound('../Audio/HitDiamond.ogg'));
    sounds.hitdisc.push(loadSound('../Audio/HitDisc.ogg'));
    sounds.hitgrower.push(loadSound('../Audio/HitGrower.ogg'));
    sounds.hitminidiamond.push(loadSound('../Audio/HitMiniDiamond.ogg'));
    sounds.hitlilfella.push(loadSound('../Audio/HitLilfella.ogg'));
    sounds.levelup.push(loadSound('../Audio/LevelUp.ogg'));
    sounds.playerhit.push(loadSound('../Audio/PlayerHit.ogg'));
    sounds.shotfullauto.push(loadSound('../Audio/ShotFullAuto.ogg'));
    sounds.shotshotgun.push(loadSound('../Audio/ShotShotgun.ogg'));
    sounds.shotsingle.push(loadSound('../Audio/ShotSingle.ogg'));
    sounds.shotbit.push(loadSound('../Audio/ShotBit.ogg'));
    sounds.shotblaster.push(loadSound('../Audio/ShotBlaster.ogg'));
    sounds.shotcannon.push(loadSound('../Audio/ShotCannon.ogg'));
  }

  for (let id in attachmentLevels) {
    let attBase = attachmentLevels[id];
    if (attBase.baseIcon) {
      console.log("Loading image: " + attBase.baseIcon);
      attachmentImages[id] = loadImage(attBase.baseIcon,
        () => console.log("Successfully loaded: " + attBase.baseIcon),
        () => console.log("FAILED to load: " + attBase.baseIcon)
      );
      grayscaleAttachmentImages[id] = loadImage(attBase.baseIcon,
        function (img) {
          img.filter(GRAY);
          console.log("Grayscale created: " + attBase.baseIcon);
        },
        () => console.log("FAILED to create grayscale: " + attBase.baseIcon)
      );
    }
  }
}

// Setup Canvas
function setup() {
  loadGame();
  InitializeAttachmentLevels();
  setInterval(saveGame, 3000);
  createCanvas(1500, 1200); // 1500 1200
  // UnlockAbility("flash"); // breaks things so disabling for now
  UnlockAbility("shield");
  UnlockAbility("bomb");
  UnlockAbility("autofirebarrage");
  UnlockAbility("spiralshot");
  UnlockAbility("lightningbolt");
  UnlockAbility("singularity");
  UnlockAbility("decimator");
}

function StartGame() {
  playSound('gamestart');

  // unlocks some things to start with for testing
  //  attachments.push(1); 
  //  attachments.push(2); 
  //  attachments.push(3); 
  //  attachments.push(4); 
  //  attachments.push(5);
  //  attachments.push(6); 
  //  attachments.push(7); 
  //  attachments.push(8);
  //  attachments.push(9); 
  //  attachments.push(10); 
  //  attachments.push(11);
  //  attachments.push(12); 
  //  attachments.push(13);
    attachments.push(14); 
    attachments.push(15); 
    attachments.push(16); 
    attachments.push(17); 
    attachments.push(18);
    attachments.push(19); 
    attachments.push(20); 

  game_Screen = "shipSelection";
  selectedShip = 1;
  shipSelectionActive = true;
  game_State = true;
  stage = 1;
  LoadStage();
}

const defaultSave = {
  Gold: 0,
  totalGold: 0,
  attachmentsUnlocked: {},   // example: { "boost": true, "laser": true }
  stagesCleared: {},         // example: { "stage1": true }
  stagesUnlocked: { "stage1": true }
};

// Save Game
function saveGame() {
  localStorage.setItem('equippedAttachments', JSON.stringify(equippedAttachments));
  localStorage.setItem('attachmentLevels_Current', JSON.stringify(attachmentLevels_Current));  
  console.log("Game saved!");
  const saveData = {
    totalGold,
    attachments,
    stagesCleared,
    stagesUnlocked
    
  };
  localStorage.setItem("myGameSave", JSON.stringify(saveData));
}

// Ye Old Save Loader
function loadGame() {
  equippedAttachments = JSON.parse(localStorage.getItem('equippedAttachments')) || [];
  attachmentLevels_Current = JSON.parse(localStorage.getItem('attachmentLevels_Current')) || {};  
  const saved = localStorage.getItem("myGameSave");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      // restore values
      totalGold = data.totalGold ?? 0;
      attachments = data.attachments ?? [];
      stagesCleared = data.stagesCleared ?? 0;
      stagesUnlocked = data.stagesUnlocked ?? 1;
    } catch (e) {
      console.error("Save data corrupted, restoring defaults:", e);
      resetSave();
      ResetAllArrays();
    }
  } else {
    resetSave();
    ResetAllArrays();
  }
}

// Used to reset save data
function resetSave() {
  console.log("Save file cleared! ")
  ResetAllArrays();
  totalGold = 0;
  attachments = [];
  stagesCleared = 0;
  stagesUnlocked = 1;
  saveGame();
}

// Removes all spawned enemies
function ClearAllEnemies() {
  enemies = [];
}

// Game Resetter
/*
function RestartGame() {
  ApplyShipStats();

  playSound('gamestart');
  // Removes equipped items
  while (equippedAttachments.length > 0) {
    UnequipAttachment(0);
  }
  ClearAllEnemies();
  attachments = [];
  game_Screen = "playing";
  game_State = true;
  Level = 1;
  Exp = 0;
  Gold = 0;
  exp_Next = 25;
  max_Health = 5;
  player_Health = 5;
  stage = 1;
  bits = 0;
  blasters = 0;
  cannons = 0;
  LoadStage();
}*/

// DIsplay FPS
function DisplayFPS() {
  fill(0);
  textSize(14);
  textAlign(LEFT);
  text("FPS: " + frameRate().toFixed(1), 10, height - 40);
}

// ABSURD SHIT FOR ATTACHMENT LEVELS HELPERS
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
    attachmentLevels_Current[id] = (attachmentLevels_Current[id] || 0) + 1;
    playSound("levelup");  // REPLACE UPGRADE SOUND WHEN GET HOME
    saveGame();
  } else {
    playSound("error");
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
// END ABSURD SHIT

// Draws the background layer for the stages
function DrawBackgroundLayers() {
  DrawGridLayer();
  DrawPerlinLayer();
  DrawAccentLayer();
}

function DrawGridLayer() {
  stroke(180);
  strokeWeight(1);
  noFill();

  let gridSize = 50;
  let startX = floor(cameraX / gridSize) * gridSize;
  let startY = floor(cameraY / gridSize) * gridSize;

  for (let x = startX; x < cameraX + width + gridSize; x += gridSize) {
    for (let y = startY; y < cameraY + height + gridSize; y += gridSize) {
      let screenX = x - cameraX;
      let screenY = y - cameraY;
      rect(screenX, screenY, gridSize, gridSize);
    }
  }
}

// Adds randomized jitter and visuals to background 
function DrawPerlinLayer() {
  let cellSize = 40;
  let startX = floor(cameraX / cellSize) * cellSize;
  let startY = floor(cameraY / cellSize) * cellSize;

  noStroke();
  
  // Only draw visible area plus small buffer
  let endX = cameraX + width + cellSize;
  let endY = cameraY + height + cellSize;

  for (let x = startX; x < endX; x += cellSize) {
    for (let y = startY; y < endY; y += cellSize) {
      let noiseVal = noise(x * 0.009, y * 0.009);
      let hueVal = map(noiseVal, 0, 1, 220, 230);
      let saturation = map(noiseVal, 0, 1, 30, 60);
      let brightness = map(noiseVal, 0, 1, 85, 95);

      colorMode(HSB);
      fill(hueVal, saturation, brightness);
      colorMode(RGB);

      let screenX = x - cameraX;
      let screenY = y - cameraY;
      rect(screenX, screenY, cellSize, cellSize);
    }
  }
}

// Adds little random shape/colors os it's not a static
function DrawAccentLayer() {
  let accentSize = 55; // 25
  let startX = floor(cameraX / accentSize) * accentSize;
  let startY = floor(cameraY / accentSize) * accentSize;

  noStroke();

  for (let x = startX; x < cameraX + width + accentSize; x += accentSize) {
    for (let y = startY; y < cameraY + height + accentSize; y += accentSize) {
      let noiseVal = noise(x * 0.008, y * 0.008, time * 0.001);

      if (noiseVal > 0.8) {
        let opacity = map(noiseVal, 0.6, 1, 20, 80);
        fill(150, 200, 255, opacity);

        let screenX = x - cameraX + accentSize / 2;
        let screenY = y - cameraY + accentSize / 2;
        ellipse(screenX, screenY, accentSize * 0.4);
      }
    }
  }
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

  // Now apply conversions
  for (let key in statConversions) {
    if (key === "max_Health_to_shield_Value") {
      let convertedAmount = max_Health * statConversions[key];
      shield_Value += convertedAmount;
      max_Health -= convertedAmount;
      if (player_Health >= max_Health) { player_Health = max_Health; }
    }
  }
}

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

// Gets nearest enemy so we can shoot it in the face and or ass
function GetNearestEnemy(x, y, enemyArray) {
  let nearest = null;
  let bestDist = Infinity;

  for (let i = 0; i < enemyArray.length; i++) {
    const enemy = enemyArray[i];
    if (enemy.health <= 0) continue;

    const dx = enemy.x - x;
    const dy = enemy.y - y;
    const distSq = dx * dx + dy * dy;

    if (distSq < bestDist) {
      bestDist = distSq;
      nearest = { index: i, distSq };
    }
  }

  return nearest;
}

// Sets Min/Max values for stats so you can't get -1 Shot Delay for example
function ClampStats() {
  shot_Penetration = Math.max(0, Math.min(shot_Penetration, shot_Penetration_MAX));
  shot_Power = Math.max(1, Math.min(shot_Power, shot_Power_MAX));
  shot_Count = Math.max(1, Math.min(shot_Count, shot_Count_MAX));
  cooldown_Reduction = Math.max(0, Math.min(cooldown_Reduction, cdr_MAX));
  shot_Speed = Math.max(1, Math.min(shot_Speed, shot_Speed_MAX));
  shot_Diameter = Math.max(1, Math.min(shot_Diameter, shot_Diameter_MAX));
  shot_Duration = Math.max(1, Math.min(shot_Duration, shot_Duration_MAX));
  shot_Delay = Math.max(shot_Delay_MIN, shot_Delay);
}

// Handles cooldown reduction math
function GetCooldownReduction() {
  // Capped at 80% max
  let reductionPercent = cooldown_Reduction / (cooldown_Reduction + 100);
  reductionPercent = min(reductionPercent, 0.8);  // Cap at 80%
  return reductionPercent;
}

// polygon shape maker  
function drawPolygon(sides, x, y, radius, rotation = 0) {
  beginShape();
  for (let i = 0; i < sides; i++) {
    const angle = TWO_PI / sides * i + rotation;
    const px = x + cos(angle) * radius;
    const py = y + sin(angle) * radius;
    vertex(px, py);
  }
  endShape(CLOSE);
}

// -- Abilities 
// Used to draw out the boom boom
function DrawBombExplosions() {
  for (let i = bombExplosions.length - 1; i >= 0; i--) {
    let explosion = bombExplosions[i]; 
   
    explosion.age++;
    explosion.currentRadius = (explosion.age / explosion.duration) * explosion.maxRadius;
    let alpha = map(explosion.age, 0, explosion.duration, 255, 0);
    
    let ringCount = 8;
    for (let ring = 0; ring < ringCount; ring++) {
      let ringRadius = explosion.currentRadius - (ring * 80);
      if (ringRadius > 0) {
        strokeWeight(6);
        stroke(255, 100 + ring * 30, 0, alpha);
        noFill();
        circle(explosion.x, explosion.y, ringRadius * 2);
      }
    }
    
    if (explosion.age >= explosion.duration) {
      bombExplosions.splice(i, 1);
    }
  }
}

// Rapidfire barrage abilitiy 

function UpdateBarrage() {
  if (barrageShotsRemaining > 0 && game_State && barrageActive) {
    barrageTimer++;
    
    if (barrageTimer >= 6) {
      let target = GetNearestEnemy(player_X, player_Y, enemies);
      let baseAngle;
      
      if (target) {
        let enemy = enemies[target.index];
        baseAngle = Math.atan2(enemy.y - player_Y, enemy.x - player_X);
      } else {
        // No enemies → fire toward mouse (convert to world coords)
        let worldMouseX = GetWorldMouseX();
        let worldMouseY = GetWorldMouseY();
        baseAngle = Math.atan2(worldMouseY - player_Y, worldMouseX - player_X);
      }
      
      // small random spread
      let spread = (Math.random() * 8 - 4) * Math.PI / 180;
      
      AddShots(player_X, player_Y, [baseAngle + spread], [shot_Speed], [shot_Diameter], 0, shot_Penetration);
      playSound('shotfullauto');
      
      barrageShotsRemaining--;
      barrageTimer = 0;
    }
  } else if (barrageShotsRemaining <= 0 && barrageActive) {
    // Barrage finished
    barrageActive = false;
  }
}

// Decimator abilitiy 
function UpdateDecimator() {
  if (decimatorShotsRemaining > 0 && game_State) {
    if (!decimatorActive) {
      shot_Penetration += 2;
      decimatorActive = true;
    }
    decimatorTimer++;
    if (decimatorTimer >= 16) {  // 16 frames between each shot
      playSound('abilitydecimator');
      let worldMouseX = GetWorldMouseX();
      let worldMouseY = GetWorldMouseY();
      let baseAngle = atan2(worldMouseY - player_Y, worldMouseX - player_X);
      let burstCount = 4 + shot_Count * 2;
      let angles = [];
      let diameters = Array(burstCount).fill(shot_Diameter * .75);

      for (let s = 0; s < burstCount; s++) {
        let spread = (Math.floor(Math.random() * 2 + shot_Count) + 10);
        let angleOffset = burstCount > 1 ? map(s, 0, burstCount, -spread, spread) * PI / 180 : 0;
        angles.push(baseAngle + angleOffset);
      }
      AddShots(player_X, player_Y, angles, Array(burstCount).fill(shot_Speed), diameters, 0, shot_Penetration);
      decimatorShotsRemaining--;
      decimatorTimer = 0;
    }
  }
  else if (decimatorActive) {
    shot_Penetration -= 2;
    decimatorActive = false;
  }
}

// Spiral shot ability
function UpdateSpiral() {
  if (spiralShotsRemaining > 0 && game_State) {
    spiralTimer++;
    if (spiralTimer >= 4) {  // Fire every 4 frames
      let angleIncrement = TWO_PI / (30 + shot_Count);

      // Clockwise shot
      let cwAngle = spiralAngle;
      AddShots(player_X, player_Y, [cwAngle], [shot_Speed], [shot_Diameter], 0, shot_Penetration);

      // Counter-clockwise shot
      let ccwAngle = -spiralAngle + PI;
      AddShots(player_X, player_Y, [ccwAngle], [shot_Speed], [shot_Diameter], 0, shot_Penetration);

      playSound('shotfullauto');

      spiralAngle += angleIncrement;
      spiralShotsRemaining--;
      spiralTimer = 0;
    }
  }
}

// LIGHTNING BOLT HANDLER 
function UpdateLightningBolt() {
  if (!boltActive) return;
  boltTimer++;

  if (boltTimer >= boltDuration) {
    boltActive = false;
    activeBolts = [];
    boltHitEnemies = [];
    return;
  }

  for (let bolt of activeBolts) {
    // Draw the bolt with camera offset
    push();
    translate(-cameraX, -cameraY);
    
    stroke(0, 200, 255);
    strokeWeight(3);
    for (let i = 0; i < bolt.length - 1; i++) {
      line(bolt[i].x, bolt[i].y, bolt[i + 1].x, bolt[i + 1].y);
    }

    // Glow
    stroke(75, 255, 240, 100);
    strokeWeight(8);
    for (let i = 0; i < bolt.length - 1; i++) {
      line(bolt[i].x, bolt[i].y, bolt[i + 1].x, bolt[i + 1].y);
    }
    
    pop();
  }

  // Bolt collision with enemies
  CheckBoltCollision();
}

// Bolt collision logic
function CheckBoltCollision() {
  let enemiesToKill = [];

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (enemy.health <= 0) continue;

    for (let bolt of activeBolts) {
      for (let j = 0; j < bolt.length - 1; j++) {
        const seg1 = bolt[j];
        const seg2 = bolt[j + 1];
        const distToLine = DistanceToLineSegment(enemy.x, enemy.y, seg1.x, seg1.y, seg2.x, seg2.y);
        if (distToLine < 26 && !boltHitEnemies.includes(i)) {
          enemy.health -= boltDamage;
          playSound('hit');
          boltHitEnemies.push(i);
          if (enemy.health <= 0) {
            enemiesToKill.push(i);
          }
          break;
        }
      }
    }
  }
  // iterates backwards through array
  for (let i = enemiesToKill.length - 1; i >= 0; i--) {
    KillEnemy(enemiesToKill[i]);
  }
}

// Helper function used to create THE LIGHTNING 
function DistanceToLineSegment(px, py, x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let t = max(0, min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));

  let closestX = x1 + t * dx;
  let closestY = y1 + t * dy;

  return dist(px, py, closestX, closestY);
}

// Creates the visual of the black hole
function UpdateSingularity() {
  if (!singularityActive) return;
  singularityTimer++;

  if (singularityTimer >= singularityDuration && game_State) {
    // Singularity ends - damage all caught enemies
    DealSingularityDamage();
    singularityActive = false;
    singularityCaughtEnemies = [];
    return;
  }

  // Draw singularity visual with camera offset
  push();
  translate(-cameraX, -cameraY);
  
  let pulseAmount = sin(singularityTimer / 20) * 10;

  fill(20, 20, 30);
  stroke(100, 200, 255);
  strokeWeight(2);
  circle(singularityX, singularityY, singularityRadius * 2 - pulseAmount);

  noFill();
  stroke(0, 150, 255, 150);
  strokeWeight(3);
  circle(singularityX, singularityY, singularityRadius * 2 + pulseAmount);

  stroke(50, 200, 255, 100);
  strokeWeight(1);
  circle(singularityX, singularityY, singularityRadius * 2.2);

  DrawSingularityLightning(8);

  pop();
  
  noStroke();

  // Pulls in enemies
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (enemy.type === "chip") continue; // obstacles not affected such as our friend Chip

    let distToSingularity = dist(enemy.x, enemy.y, singularityX, singularityY);

    if (distToSingularity < singularityRadius * 1.4) {
      if (!singularityCaughtEnemies.includes(i)) singularityCaughtEnemies.push(i);

      let angle = atan2(singularityY - enemy.y, singularityX - enemy.x);
      let pullStrength = map(distToSingularity, singularityRadius * 4, 0, 0.5, 3);

      enemy.x += cos(angle) * pullStrength;
      enemy.y += sin(angle) * pullStrength;
    }
  }
}

// Generates a "staticy" lightning effect around the singularity
function DrawSingularityLightning(arcCount) {
  for (let a = 0; a < arcCount; a++) {
    let startAngle = random(TWO_PI);
    let startX = singularityX + cos(startAngle) * singularityRadius * 0.8;
    let startY = singularityY + sin(startAngle) * singularityRadius * 0.8;
    let endX = singularityX;
    let endY = singularityY;

    stroke(150, 200, 255);
    strokeWeight(2);

    let segmentCount = 8;
    for (let s = 0; s < segmentCount; s++) {
      let t = s / segmentCount;
      let nextT = (s + 1) / segmentCount;

      let currentX = lerp(startX, endX, t) + random(-8, 8);
      let currentY = lerp(startY, endY, t) + random(-8, 8);
      let nextX = lerp(startX, endX, nextT) + random(-8, 8);
      let nextY = lerp(startY, endY, nextT) + random(-8, 8);

      line(currentX, currentY, nextX, nextY);
    }

    stroke(100, 180, 255, 150);
    strokeWeight(4);
    line(startX, startY, endX, endY);
  }
}

// Deal damage to all caught enemies
function DealSingularityDamage() {
  const damageAmount = 10 + singularityCaughtEnemies.length * 5;

  for (let i = singularityCaughtEnemies.length - 1; i >= 0; i--) {
    const enemyIndex = singularityCaughtEnemies[i];
    const enemy = enemies[enemyIndex];
    if (!enemy) continue;

    enemy.health -= damageAmount;
    playSound("hit");

    if (enemy.health <= 0) {
      KillEnemy(enemyIndex);
    }
  }
}

// Level up handler
function LevelUp() {
  playSound('levelup');
  Level += 1;
  if (Level === 10 || Level === 20 || Level === 30) {
    ShowSupportChoices();
  }

  max_Health += 1; // Base max health increase
  player_Health += 1;
  exp_Next = Math.trunc(25 + (1 + Level ** 3) * 1.5);
  exp = 0;
  RecalculateConversions();
  ClampStats();
}

// Makes the nice cursor reticle and arrow depending on which window is active
function CursorUpdate() {
  if (game_Screen === "menu") {
    if (mouseIsPressed === true) {
      cursor('../Images/Cursor_Pressed.png');
    } else {
      cursor('../Images/Cursor.png');
    }

  } else if (game_Screen === "playing") {
    if (mouseIsPressed === true) {
      cursor('../Images/ReticleClicked.png');
    } else {
      cursor('../Images/Reticle.png');
    }

  } else if (game_Screen === "shipSelection") {
    if (mouseIsPressed === true) {
      cursor('../Images/Cursor_Pressed.png');
    } else {
      cursor('../Images/Cursor.png');
    }

  } else if (game_Screen === "paused") {
    if (mouseIsPressed === true) {
      cursor('../Images/Cursor_Pressed.png');
    } else {
      cursor('../Images/Cursor.png');
    }
  } else if (game_Screen === "gameOver") {
    if (mouseIsPressed === true) {
      cursor('../Images/Cursor_Pressed.png');
    } else {
      cursor('../Images/Cursor.png');
    }
  }
}

function LoadStage() {
  console.log("LoadStage called: width= " + width + ", height= " + height);
  // let worldObstacles = [];

  if (stage === 1) {
    activeWaves = stage1Waves;
    player_X = width / 2;
    player_Y = height / 2;
   // GenerateWorldObstacles(20);
    console.log("Set player to (" + player_X + ", " + player_Y + ")");

  } else if (stage === 2) {
    activeWaves = stage2Waves;
    player_X = width / 2;
    player_Y = height / 2;
   // GenerateWorldObstacles(20);

  } else if (stage === 3) {
    activeWaves = stage3Waves;
    player_X = width / 2;
    player_Y = height / 2;
   // GenerateWorldObstacles(20);  }
  }

  player_Health = max_Health;
  time = 0;

  items_X = [];
  items_Y = [];
  items_Type = [];
  items_Frame = [];
  items_Amount = [];
}

// creates some random shit 
// WAY TOO LAGGY - Not going to use this for now

/*
function GenerateWorldObstacles(count = 20) {
  worldObstacles = [];
  
  for (let i = 0; i < count; i++) {
    let x = random(-2000, 2000);
    let y = random(-2000, 2000);
    let size = random(40, 100);
    
    worldObstacles.push({
      x: x,
      y: y,
      size: size,
      type: random(["rock", "tree", "debris"])
    });
  }
}

//  DRAW OBSTACLES - 
function DrawWorldObstacles() {
  push();
  noStroke();
  
  for (let obstacle of worldObstacles) {
    // Only draw if visible on screen (add buffer for safety)
    let screenX = obstacle.x - cameraX;
    let screenY = obstacle.y - cameraY;
    let buffer = obstacle.size + 50;
    
    if (screenX < -buffer || screenX > width + buffer ||
        screenY < -buffer || screenY > height + buffer) {
      continue; // Skip drawing this obstacle
    }
    
    switch (obstacle.type) {
      case "rock":
        fill(120, 100, 80);
        ellipse(obstacle.x, obstacle.y, obstacle.size);
        break;
      case "tree":
        fill(80, 140, 60);
        rect(obstacle.x - obstacle.size/3, obstacle.y - obstacle.size/2, 
             obstacle.size/1.5, obstacle.size);
        break;
      case "debris":
        fill(100, 100, 100);
        rect(obstacle.x - obstacle.size/2, obstacle.y - obstacle.size/2, 
             obstacle.size, obstacle.size);
        break;
    }
  }
  pop();
}

// prevents player movement 
function CheckObstacleCollision() {
  const playerRadius = player_Hitbox / 2;
  const checkRadius = 300; // Only check obstacles within 300px of player
  
  for (let obstacle of worldObstacles) {
    // Quick distance check first
    let distToObstacle = dist(player_X, player_Y, obstacle.x, obstacle.y);
    if (distToObstacle > checkRadius) continue; // Skip far obstacles
    
    let dx = player_X - obstacle.x;
    let dy = player_Y - obstacle.y;
    let minDistance = playerRadius + obstacle.size / 2;
    
    if (distToObstacle < minDistance) {
      let angle = atan2(dy, dx);
      let pushDistance = minDistance - distToObstacle + 2;
      
      player_X += cos(angle) * pushDistance;
      player_Y += sin(angle) * pushDistance;
    }
  }
}
      */ // ---======================================================== obstacles

// Audio stuff
function playSound(soundName) {
  let soundArray = sounds[soundName];
  if (!soundArray) {
    console.log("Sound not found: " + soundName);
    return;
  }

  for (let i = 0; i < soundArray.length; i++) {
    if (!soundArray[i].isPlaying()) {
      soundArray[i].play();
      return;
    }
  }
}

// Rotation handler for ship and support units to "attempt" to keep them in sync.
function RotatePoint(x, y, angle) {
  let rotatedX = x * cos(angle) - y * sin(angle);
  let rotatedY = x * sin(angle) + y * cos(angle);
  return { x: rotatedX, y: rotatedY };
}

// "Kill Enemy" effects such as diamond
function KillEnemy(index) {
  let enemy = enemies[index];

  // Spawn child minidia if Diamond
  if (enemy.type === "dia") {
    // Example: spawn 2 minidia at same location
    SpawnEnemy("minidia", enemy.x, enemy.y, null, enemy.diameter);
    SpawnEnemy("minidia", enemy.x, enemy.y, null, enemy.diameter);
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

function DamageEnemiesInRadius(radius, damageAmount) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    
    // Use your custom distance function
    if (distance(player_X, player_Y, enemy.x, enemy.y) < radius) {
      enemy.health -= damageAmount;
      damageCount++;
      
      playSound('hit');
      
      if (enemy.health <= 0) {
        // KillEnemy only takes index parameter
        KillEnemy(i);
      }
    }
  }
}

// `` -- __  Visual and Shape settings for the objects __ -- ``
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

// RNG 
function getRandomNumber(number) {
  return Math.floor(Math.random() * 55) + 35;
}

// `` -- __ Scene Setup/ Initialization __ -- `` \\

function CreateBorders() {
  // HUD bar at top - stays fixed on screen
  strokeWeight(1);
  stroke(45, 20, 20);
  fill(100, 55, 150);
  rect(0, 0, width, 50);
  
  // Optional: Draw edge indicators so player knows world continues
  stroke(100, 100, 100);
  strokeWeight(2);
  noFill();
  push();
  translate(-cameraX, -cameraY);
  
  // Draw a large rectangle showing "world boundaries" - adjust as needed
  let worldBoundary = 5000;
  rect(-worldBoundary, -worldBoundary, worldBoundary * 2, worldBoundary * 2);
  
  pop();
}

function DrawObstacleZone() {
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
  } else if (stage === 2) {
    fill(150, 100, 150);
    rect(100, 100, 300, 200);
  } else if (stage === 3) {
    fill(150, 150, 100);
    circle(600, 450, 120);
  } else if (stage === 50) {
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

// Object Creation and what not
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
    // Alternate: first cannon is left, second is right, third is left, etc.
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

// Checks for fire rate of blaster cooldown
function UpdateBitCooldowns() {
  for (let i = 0; i < bits; i++) {
    if (bit_CooldownTimer[i] > 0) {
      bit_CooldownTimer[i]--;
    }
  }
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

// Updates the items which are dorpped and draws them out
// ===== FIXED UpdateItems() =====
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

// Enemy spawne stuff
function SpawnEnemy(type, x, y, spawnSide = null, parentDiameter = 40) {
  let enemy = {
    type: type,
    x: x,
    y: y,
    diameter: 0,
    health: 0,
    xSpeed: 0,
    ySpeed: 0,
    speed: 2,  // Default speed - will be overridden per type
    exp: 0,
    gold: 0,
    sound: ""
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
      enemy.speed = 2.5;  // Faster
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
      // If enemy not defined ya done gooft
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


// Converts mouseX to cameraX 
function GetWorldMouseX() {
  return mouseX + cameraX;
}
function GetWorldMouseY() {
  return mouseY + cameraY;
}

// Makin dem dere shootin' n'stuff ya 'earin' me now?
function Shot() {
  if (burstCooldownTimer > 0) burstCooldownTimer--;
  if (shotTimer > 0) shotTimer--;

  if (game_State && mouseIsPressed && mouseButton === LEFT) {
    if (shot_Type === 0 && shotTimer <= 0) {
      FireSingleShot();
      shotTimer = shot_Delay;
      if (shotTimer < 1) shotTimer = 1;
    }
    else if (shot_Type === 1 && burstCooldownTimer <= 0) {
      FireBurst();
      burstCooldownTimer = burstCooldown;
      if (burstCooldownTimer < 1) burstCooldownTimer = 1;
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
    positions.push({ offsetX: 0, offsetY: 0 });      // Center/front
    positions.push({ offsetX: -25, offsetY: -25 });   // Back left
    positions.push({ offsetX: 25, offsetY: 25 });    // Back right

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
    let radius = 20 + (count / 2);
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

// `` -- __ Motion && Position __ -- `` \\
// Moves the "bullet" objects
// Determines how to shoot the things outta that there gun
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

function MoveShot() {
  if (!game_State) return;

  for (let i = shot_X.length - 1; i >= 0; i--) {
    // Calculate real projectile speed 
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
      // Only remove shots if they're too far from the player (infinite world)
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
    // Combine enemy's individual speed with global modifier
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
  const minDistance = 80;  // Stay at least 80 away
  const maxDistance = 200;  // Don't go more than 400 away
  const orbitSpeed = 7;
  
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

function MovePlayer() {
  if (game_State === true) { 
    if (keyIsDown(SHIFT)) { 
      currentSpeed = 5 / 2; 
      is_Crawling = true; 
    } else {
      currentSpeed = 5; 
      is_Crawling = false;
    }
    
    if (keyIsDown(s)) { player_Y += currentSpeed; } 
    else if (keyIsDown(w)) { player_Y -= currentSpeed; }
    
    if (keyIsDown(d)) { player_X += currentSpeed; } 
    else if (keyIsDown(a)) { player_X -= currentSpeed; }
    
    frame_Time++;
    diameter += grow_Speed;
    if (diameter >= 58 || diameter <= 55) {
      grow_Speed *= -1;
    }
    
    // Update camera to follow player (keep player centered)
    cameraX = player_X - width / 2;
    cameraY = player_Y - height / 2;
  }
}

// Key / Mouse inputs 
// Gets key inputs for abilities 
function keyPressed() {
  // Menu navigation
  if (game_Screen === "menu" && key === ' ') {
    playSound('gamestart');
    StartGame();
    pauseKeyPressed = false;
  }
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
    playSound('confirm');
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

  // Ability key binds, Q, E, F
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
      playSound('gamestart');
    }
    if (DrawButton(width / 2 - 75, height / 2 + 120, 150, 60, "SHOP")) {
      playSound("confirm");
      game_Screen = "shop";
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
    }
  }
  // Game Over RESTART button
  if (game_Screen === "gameOver") {
    if (DrawButton(width / 2 - 80, height / 2 + 120, 160, 50, "RESTART")) {
      RestartGame();
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

// Rudimentary collision checker used in the check collisionS
function CheckCollision(x1, y1, d1, x2, y2, d2) {
  const r1 = d1 / 2;
  const r2 = d2 / 2;
  return dist(x1, y1, x2, y2) < r1 + r2;
}

// Function for checking if immune and doing damage/collision rather than having the same block of code over and over and over
function DamageCheckByType(damage) {
  if (!immune) {
    let actualDamage = HitShield(damage);
    playSound('playerhit');
    immune = true;
    hit_Timer = 60;
    player_Health -= actualDamage;
  }
}

function CheckCollisions() {
  // Check enemies
  for (let enemy of enemies) {
    if (CheckCollision(player_X, player_Y, player_Hitbox, enemy.x, enemy.y, enemy.diameter)) {
      DamageCheckByType(ENEMY_TYPES[enemy.type.toUpperCase()]);
    }
  }

  // Check obstacles 
  for (let chip of chips) {
    if (CheckCollision(player_X, player_Y, player_Hitbox, chip.x, chip.y, chip.diameter)) {
      DamageCheckByType(ENEMY_TYPES.CHIP);
    }
  }
}

// Handles player collision
function handleCollision(targetX, targetY, targetDiameter, targetHealth, targetXSpeed, targetYSpeed, expReward, goldReward, hitSound, deathSound, i, enemyType) {
  for (let t = targetX.length - 1; t >= 0; t--) {
    if (CheckCollision(shot_X[i], shot_Y[i], shot_Diameter_Array[i], targetX[t], targetY[t], targetDiameter[t])) {
      if (shot_HitEnemies[i].includes(t)) continue;
      shot_HitEnemies[i].push(t);
      targetHealth[t] -= shot_PowerArray[i];
      playSound(hitSound);
      if (enemyType === "disc") {
        targetXSpeed[t] = Math.floor(Math.random() * 8) - 4;
        targetYSpeed[t] = Math.floor(Math.random() * 8) - 4;
      }
      if (targetHealth[t] <= 0) {
        KillEnemy(
          enemyType,
          targetX[t],
          targetY[t],
          targetDiameter[t],
          expReward,
          goldReward,
          deathSound,
          t,
          targetXSpeed,
          targetYSpeed,
          targetHealth
        );

        targetX.splice(t, 1);
        targetY.splice(t, 1);
        targetDiameter.splice(t, 1);
        if (targetXSpeed) targetXSpeed.splice(t, 1);
        if (targetYSpeed) targetYSpeed.splice(t, 1);
        targetHealth.splice(t, 1);
      }
      SpliceShot(i);
      break;
    }
  }
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

// Gets the current value of the stat
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

// Ability Functions
function UnlockAbility(abilityName) {     // Call when unlocking ability
  if (abilities.length < 13 && !abilities.includes(abilityName)) { // DONT FORGET TO CHANGE <13 BACK TO <4 !!!!
    abilities.push(abilityName);
    console.log("Unlocked ability: " + abilityName);
  } else if (abilities.length >= 16) { // DONT FORGET TO PUT 16 BACK TO 4!! ( Spoiler: i will forget)
    console.log("Already have 4 abilities!");
  }
}

// Use the chosen ability
function UseAbility() {
  if (!abilityOnCooldown && abilities.length > 0) {
    let currentAbility = abilityList[abilities[currentAbilityIndex]];
    currentAbility.effect();

    abilityOnCooldown = true;
    let reducedCooldown = currentAbility.cooldown * (1 - GetCooldownReduction());
    abilityCooldownTimer = reducedCooldown;
    console.log("Used " + currentAbility.name + " - Cooldown: " + reducedCooldown);
  }
}

// go to next/last ability in queue
function CycleAbility(direction) {
  if (abilities.length === 0) return;

  currentAbilityIndex += direction;

  if (currentAbilityIndex >= abilities.length) {
    currentAbilityIndex = 0;
  } else if (currentAbilityIndex < 0) {
    currentAbilityIndex = abilities.length - 1;
  }

  console.log("Switched to: " + abilityList[abilities[currentAbilityIndex]].name);
}

function UpdateAbilityCooldown() {
  if (abilityOnCooldown) {
    abilityCooldownTimer--;
    if (abilityCooldownTimer <= 0) {
      abilityOnCooldown = false;
    }
  }
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

// draws updates to the stat/hud in real time
function UpdateHud() {
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
  text("Weapon: " + weapon_Type, 1100, 14);
  text("Gold: " + Gold, 1350, 14);
  
  // Ability
  if (abilities.length > 0) {
    let currentAbility = abilityList[abilities[currentAbilityIndex]];
    let cdPercent = abilityOnCooldown ? Math.floor((abilityCooldownTimer / currentAbility.cooldown) * 100) : 0;
    text("Ability: " + currentAbility.name, 1100, 40);
    text("CD: " + cdPercent + "%", 1100, 65);
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

function VictoryMessage() {
  if (exp >= 5000) {
    game_State = false;
    fill(200, 200, 200);
    stroke(5);
    textSize(26);
    text("Victory!!", width / 2 - 50, height / 2 - 50);
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

// Paints bg based on level
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

// Creates the main menu screen when the game is first loaded
function DrawMenuScreen() {
  ClearAllEnemies();
  background(20, 20, 40);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(80);
  textStyle(BOLD);
  text("SHOOT THE THINGS!", width / 2, height / 3);

  textSize(24);
  textStyle(NORMAL);
  text("Click START to begin, or press SPACE", width / 2, height / 2 - 50);

  // Draw START and SHOP buttons visually only
  DrawButton(width / 2 - 75, height / 2 + 50, 150, 60, "START");
  DrawButton(width / 2 - 75, height / 2 + 120, 150, 60, "SHOP");

  textSize(24);
  fill(150);
  stroke(20, 200, 175);
  strokeWeight(2)
  text("Shoot the bad guys, don't get hit!", width / 2, height - 100);
  text("Use WASD to move, Click to Shoot, Shift to Crawl. Q and E to cycle between abilities, F to use ability, Z to open Menu.", width / 2, height - 60);
}

// creates the shop screen from menu
function DrawShopScreen() {
  background(20);

  // --- HEADER ---
  textAlign(CENTER);
  textSize(48);
  fill(255);
  text("SHOP", width / 2, 60);

  textSize(22);
  text("Total Gold: " + totalGold, width / 2, 110);

  // --- GRID SETUP ---
  const rows = attachmentGrid.length;
  const cols = attachmentGrid[0].length;
  const cellSize = 120;
  const gap = 10;
  const gridWidth = cols * cellSize + (cols - 1) * gap;
  const startX = width / 2 - gridWidth / 2;
  const startY = 150;

  let hoveredAttachment = null;

  // --- DRAW GRID ---
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = attachmentGrid[r][c];
      const attBase = GetAttachmentData(id);
      const attCurrent = GetCurrentAttachmentData(id);
      const x = startX + c * (cellSize + gap);
      const y = startY + r * (cellSize + gap);

      const isHovered = mouseX > x && mouseX < x + cellSize &&
        mouseY > y && mouseY < y + cellSize;
      if (isHovered) hoveredAttachment = id;

      // Background
      fill(50);
      stroke(100);
      strokeWeight(2);
      rect(x, y, cellSize, cellSize, 10);

      // Icon
      if (!attachments.includes(id)) {
        tint(150);
        if (grayscaleAttachmentImages[id]) image(grayscaleAttachmentImages[id], x + 10, y + 10, cellSize - 20, cellSize - 20);
      } else {
        noTint();
        if (attachmentImages[id]) image(attachmentImages[id], x + 10, y + 10, cellSize - 20, cellSize - 20);
      }
      noTint();

      // Cost/Level display
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

  // --- HANDLE GRID CLICK ---
  if (!shopConfirmOpen && hoveredAttachment !== null && mouseIsPressed && shopMouseReleased) {
    const attCurrent = GetCurrentAttachmentData(hoveredAttachment);
    const isMaxLevel = IsAttachmentMaxLevel(hoveredAttachment);
    
    // Check if trying to buy unowned item without enough gold
    if (!attachments.includes(hoveredAttachment) && totalGold < attCurrent.cost) {
      playSound("error");
    }
    // Check if trying to upgrade but can't afford it
    else if (attachments.includes(hoveredAttachment) && !isMaxLevel) {
      const nextCost = GetNextUpgradeCost(hoveredAttachment);
      if (totalGold < nextCost) {
        playSound("error");
      } else {
        shopSelectedAttachment = hoveredAttachment;
        shopConfirmOpen = true;
        playSound("confirm");
      }
    }
    // Already owned and can open (either maxed or can afford upgrade)
    else {
      shopSelectedAttachment = hoveredAttachment;
      shopConfirmOpen = true;
      playSound("confirm");
    }
    
    shopMouseReleased = false;
  }
  if (!mouseIsPressed) shopMouseReleased = true;

  // --- STATIC TOOLTIP BELOW GRID ---
  if (hoveredAttachment !== null) {
    const tooltipX = startX;
    const tooltipY = startY + rows * (cellSize + gap) + 20;
    const tooltipWidth = gridWidth;
    drawStaticShopTooltip(hoveredAttachment, tooltipX + tooltipWidth / 2, tooltipY);
  }

  // --- CONFIRMATION POPUP ---
  if (shopConfirmOpen && shopSelectedAttachment !== null) {
    drawShopConfirmationBox(shopSelectedAttachment);
  }

  // --- BACK BUTTON ---
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

// SHop confimration pop up
function drawShopConfirmationBox(id) {
  const attBase = GetAttachmentData(id);
  const attCurrent = GetCurrentAttachmentData(id);
  const isOwned = attachments.includes(id);
  const isMaxLevel = IsAttachmentMaxLevel(id);

  const boxW = 480;
  const boxH = 260;
  const boxX = width / 2 - boxW / 2;
  const boxY = height / 2 - boxH / 2;

  fill(40);
  stroke(140);
  strokeWeight(2);
  rect(boxX, boxY, boxW, boxH, 15);

  // Text
  fill(255);
  textAlign(CENTER);
  textSize(26);

  if (!isOwned) {
    text("Buy " + attBase.name + "?", width / 2, boxY + 40);
    textSize(16);
    text("Cost: " + attCurrent.cost + "g", width / 2, boxY + 75);
  } else if (isMaxLevel) {
    text(attBase.name + " - MAX LEVEL", width / 2, boxY + 40);
    textSize(16);
    fill(150);
    text("This attachment is fully upgraded.", width / 2, boxY + 75);
  } else {
    const currentLevel = attachmentLevels_Current[id] || 0;
    const nextCost = GetNextUpgradeCost(id);
    text("Upgrade " + attBase.name + "?", width / 2, boxY + 40);
    textSize(16);
    text("Level " + currentLevel + " → " + (currentLevel + 1), width / 2, boxY + 75);
    text("Cost: " + nextCost + "g", width / 2, boxY + 100);
  }

  // YES BUTTON
  if (!isMaxLevel) {
    if (DrawButton(boxX + 40, boxY + 180, 180, 50, "YES")) {
      if (!isOwned) {
        if (totalGold >= attCurrent.cost) {
          totalGold -= attCurrent.cost;
          attachments.push(id);
          attachmentLevels_Current[id] = 0;
          playSound("confirm");
          saveGame();
        } else {
          playSound("error");
        }
      } else {
        UpgradeAttachment(id);
      }
      shopConfirmOpen = false;
    }
  }

  // NO BUTTON
  if (DrawButton(boxX + boxW - 220, boxY + 180, 180, 50, "NO")) {
    shopConfirmOpen = false;
    playSound("cancel"); // Replace this sound later too
  }
}

// unlock and upgrade items
function TryUnlock(itemKey, cost) {
  if (totalGold >= cost && !attachmentsUnlocked[itemKey]) {
    totalGold -= cost;
    attachmentsUnlocked[itemKey] = true;
    saveGame();
    playSound("confirm");
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

// Helps to adjust spacing 
function drawTextColumns(x, y, lineHeight, size, ...columns) {
  const columnWidth = 200;
  textSize(size);

  for (let col = 0; col < columns.length; col++) {
    textAlign(LEFT);
    text(columns[col], x + (col * columnWidth), y);
  }
}

// Handles the ship selection screen 
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
  const shipSpacing = width / 5;  // Changed from width / 4
  const startX = width / 10;      // Changed from width / 4 to center them better
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

// Ship stats and what not
const shipStats = {
  1: {
    name: "Fox",
    shot_Type: 0,
    shield_Cooldown: 600,
    shield_Value: 1,
    baseShieldValue: 1,
    cooldown_Reduction: 0,
    player_Health: 6,
    baseMaxHealth: 6,
    player_Speed: 6,
    basePlayerSpeed: 6,
    shot_Power: 4,
    shot_Speed: 26,
    shot_Duration: 36,
    shot_Count: 1,
    shot_Diameter: 16,
    shot_Penetration: 0,
    shot_Delay: 22,
    ship_Info: "A balanced ship with a standard single-shot blaster.",
    ship_Info2: "Shot Count fires projectiles in a radial pattern.",
    ship_Info3: "Scales well, simple and effective, highly accurate.",
    ship_Info4: "Ability: Autofire Barrage - Fires a barrage of auto targeting projectiles."
  },
  2: {
    name: "Model xr-52",
    shot_Type: 2,
    shield_Cooldown: 480,
    baseShieldValue: 3,
    shield_Value: 3,
    cooldown_Reduction: 0,
    player_Health: 4,
    baseMaxHealth: 4,
    player_Speed: 7,
    basePlayerSpeed: 7,
    shot_Power: 2,
    shot_Speed: 30,
    shot_Duration: 34,
    shot_Count: 4,
    shot_Diameter: 12,
    shot_Penetration: 0,
    shot_Delay: 32,
    ship_Info: "Faster ship, fires rapid bursts of shots.",
    ship_Info2: "Faster Shield Recharge timer, less accurate shots.",
    ship_Info3: "Scales strong with Shot Count, Cooldown and Power.",
    ship_Info4: "Ability: Spiral Shot - Fires many shots spiraling out from caster."
  },
  3: {
    name: "Imperial",
    shot_Type: 1,
    shield_Cooldown: 700,
    shield_Value: 1,
    baseShieldValue: 1,
    cooldown_Reduction: 0,
    player_Health: 6,
    baseMaxHealth: 6,
    player_Speed: 5,
    basePlayerSpeed: 5,
    shot_Power: 2,
    shot_Speed: 18,
    shot_Duration: 36,
    shot_Count: 2,
    shot_Diameter: 21,
    shot_Penetration: 0,
    shot_Delay: 27,
    burstCooldown: 60,
    ship_Info: "Slower ship, heavy fire power.",
    ship_Info2: "Fires double shot count, slower speed and fire rate.",
    ship_Info3: "Smaller diameter shots, less accurate.",
    ship_Info4: "Ability: Decimator - Fires several waves of piercing projectiles."
  },
  4: {
    name: "Jackhammer",
    shot_Type: 3,
    shot_FirePattern: 0,
    shield_Cooldown: 550,
    shield_Value: 1,
    baseShieldValue: 1,
    cooldown_Reduction: 0,
    player_Health: 6,
    baseMaxHealth: 6,
    player_Speed: 6,
    basePlayerSpeed: 6,
    shot_Power: 2,
    shot_Speed: 20,
    shot_Duration: 22,
    shot_Count: 1,
    shot_Diameter: 14,
    shot_Penetration: 0,
    shot_Delay: 30,
    burstCooldown: 50,
    ship_Info: "The OP ship.",
    ship_Info2: "Garbo early game, but scale god.",
    ship_Info3: "Fires projectiles in an array in front of the ship.",
    ship_Info4: "Ability: Bomb - Detonates an area around caster dealing heavy damage."
  }
};

// Ability lookup table - easy to maintain and scale
const shipAbilities = {
  "Fox": "autofirebarrage",
  "Model xr-52": "spiralshot",
  "Imperial": "decimator",
  "Jackhammer": "bomb"
};

// Track current ship ability
let currentShipAbility = null;

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

  // Lock old ability and unlock new one

  const newAbility = shipAbilities[shipSelected];
  if (newAbility) {
    UnlockAbility(newAbility);
    currentShipAbility = newAbility;
  }

  baseMaxHealth = stats.baseMaxHealth;
  baseShieldValue = stats.baseShieldValue;

  if (shot_Type === 0) {
    weapon_Type = "Radial";
  } else if (shot_Type === 1) {
    weapon_Type = "Scatter";
  } else if (shot_Type === 2) {
    weapon_Type = "Auto";
  } else if (shot_Type === 3) {
    weapon_Type = "Array";
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
      
      // Hover detection ONLY (no click handling here)
      if (mouseX > x && mouseX < x + cellSize &&
        mouseY > y && mouseY < y + cellSize) {
        hoveredAttachment = attachmentId;
      }
      
      DrawAttachmentCell(x, y, cellSize, attachmentId);
    }
  }
  
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

  // Tooltip position: below grid + equipped list
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

//
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

// hitbox for item clicks
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

        // If locked — try to buy it
        if (!attachments.includes(attachmentId)) {
          TryUnlockAttachment(attachmentId);
          return;
        }

        // Otherwise equip/unequip
        ToggleAttachment(attachmentId);
        return;
      }
    }
  }
}

// try unlock functino for attachment shop/upgrades
function TryUnlockAttachment(attachmentId) {
  const att = attachmentList[attachmentId];

  if (totalGold >= att.cost) {
    totalGold -= att.cost;
    attachments.push(attachmentId);
    playSound("confirm");
    console.log("Unlocked: " + att.name);
  } else {
    playSound("error");
    console.log("Not enough gold!");
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
  const attachmentData = GetCurrentAttachmentData(attachmentId); // Get current level stats!

  // Apply all stat bonuses
  for (let statObj of attachmentData.stats) {
    ApplyStat(statObj.stat, statObj.value);
  }
  // Apply conversions
  if (attachmentData.conversion) {
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
  const attachmentData = GetCurrentAttachmentData(attachmentId); // Get current level stats!

  // Remove all stat bonuses
  for (let statObj of attachmentData.stats) {
    RemoveStat(statObj.stat, statObj.value);
  }
  // Remove conversions
  if (attachmentData.conversion) {
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
  }
  RecalculateConversions();
  ClampStats();
}

// Replacement for the old "Draw" will now do stuff here
function Drawgame_Screen() {
  DrawBackgroundLayers();
  //DrawObstacleZone();
  UpdateAbilityCooldown();
  time++;
  UpdateBarrage();
  UpdateSpiral();
  UpdateDecimator();
  UpdateLightningBolt();
  UpdateSingularity();
  UpdateItems();
  
  // Update player 
  MovePlayer();
  // CheckObstacleCollision() ; Might enable later when fix lag
  
  // ===== ALL WORLD-SPACE DRAWING PUT GO HERE!! ===== \\
  push();
  translate(-cameraX, -cameraY);
  
  CreatePlayer();
  DrawShield();        
 // DrawWorldObstacles(); Might enable later when fix lag
  UpdateSupports();
  UpdateShield();
  //DrawShieldHUD();    
  UpdateCannons();
  Shot();
  MoveShot();
  updateWaves(activeWaves);
  MoveEnemies();
  DrawEnemies();
  CheckCollisions();
  CheckShotCollisions();
  DrawBombExplosions();
  Immune();            
  
  pop();
  
  // ===== UI THAT STAYS FIXED ON SCREEN ===== \\
  DisplayFPS();
  CursorUpdate();
  CreateBorders();
  UpdateHud();        
  VictoryMessage();
  fill(100);
  textSize(14);
  textAlign(LEFT);
  text("Press Z to pause", 10, height - 20);
}

// The "pause" screen with stats and attachments etc
function DrawPauseScreen() {
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);
  DrawStatsScreen(60, 80);
  // Pause Menu attachments
  DrawAttachmentsScreen(width / 2 + 50, 80, {
    showTooltip: true,
    tooltipX: width / 2 - 150,
    tooltipY: height - 180,
    tooltipWidth: 300,
    tooltipHeight: 150
  });

  const buttonY = height - 80;
  if (DrawButton(width / 2 - 200, buttonY, 90, 50, "RESUME")) {
    game_Screen = "playing";
    game_State = true;
    playSound("confirm");
  }
  if (DrawButton(width - 300 - 50, buttonY, 155, 50, "TITLE SCREEN")) {
    game_Screen = "menu";
    totalGold += Gold;
    Gold = 0;
    console.log("Current Gold added to Total Gold value and reset to 0!");
    playSound("confirm");
    ClearAllEnemies();
  }

  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);
  text("Press Z to resume", width / 2, height - 20);
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
  DrawButton(width / 2 - 80, height / 2 + 120, 160, 50, "RESTART");
  saveGame();
}

// Button Helpers
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

// `` -- __ DRAW __ -- `` \\  What is my purpose? You call the real functions. Oh. My. God.
function draw() {
    if (game_Screen === "menu") {
    DrawMenuScreen();
    CursorUpdate();
  }
  else if (game_Screen === "shop") {
    DrawShopScreen();
  }
  else if (game_Screen === "shipSelection") {
    DrawShipSelectionScreen();
    HandleShipSelection();
    CursorUpdate();
  }
  else if (game_Screen === "playing") {
    Drawgame_Screen();
    CursorUpdate();
    CheckShotCollisions();
  }
  else if (game_Screen === "paused") {
    DrawPauseScreen();
    CursorUpdate();
  }
  else if (game_Screen === "gameOver") {
    DrawGameOverScreen();
    CursorUpdate();
  }
}

function ResetAllArrays() { // and other stuff too hopefully I will remember to update this when I add/change stuff but probly won't it is waht it is
  abilityCooldownTimer = 10;

  shot_X = [];
  shot_Y = [];
  shot_xDistance = [];
  shot_yDistance = [];
  shot_Diameter_Array = [];
  shot_Timer = [];
  shot_SourceType = [];
  shot_HitEnemies = [];

  // errant item sweeper
  items_X = [];
  items_Y = [];
  items_Type = [];
  items_Frame = [];
  items_Amount = [];

  currentWave = 0;
  waveStarted = false;
  time = 0;
  frame_Time = 0;
  bits = 0;
  blasters = 0;
  cannons = 0;
  saveGame();
  ClearAllEnemies();
}