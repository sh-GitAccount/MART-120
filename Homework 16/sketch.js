// Saved data
let SaveData = {
  Gold: 0,
  TotalGold: 0,
  UnlockedAbilities: [],
  UnlockedAttachments: [],
  
  // each ship has their own level
  Ships: {
    1: { level: 1, exp: 0 },
    2: { level: 1, exp: 0 },
    3: { level: 1, exp: 0 },
    4: { level: 1, exp: 0 }
  }
};

// Sound effects
let sounds = {};
let soundDelays = {};
const SOUND_DELAY = 16;
const SOUND_COUNT = 25;
var hoveredAttachmentId = null;
var death_Timer = 40;

// Game State settings and such
const s = 83;
const w = 87;
const a = 65;
const d = 68;
var time = 0;
var frame_Time =0;
var game_State = true;
var game_Screen = "menu"; // Menu, Paused, Playing, GameOver
var pauseKeyPressed = false;
var shipSelected;

var shipImages = {};           
var selectedShip = 1;      
var  currentShip = 1;    

// Ship rotation variables
var player_Rotation = 0;      
var player_TargetRotation = 0;
var player_RotationSpeed = 0.08; // animation speed for the rotation

// Screen state
var shipSelectionActive = false;
var shipSelectionDelayCounter = 0;  // Prevents accidental multiple selections

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
var totalGold; // total accumulated gold

var hit_Timer = 180; // Sets Hit Timer (immune time) so you take damage on spawn (shouldn't happen)
var immune = true;   // Causes you to spawn immune, so you don't get spawn camped by the NPCs
var statConversions = {}; 

var enemies = [];

// Sets of arrays for moving object things
var disc_Count = []; 
var disc_X = []; 
var disc_Y = []; 
var disc_Diameter = []; 
var disc_XSpeed = [];
var disc_YSpeed = [];
var disc_Health = [];

// Various Chungusues.. chungus'? Chungus-i?
var chungusjr_Count = []; 
var chungusjr_X = []; 
var chungusjr_Y = []; 
var chungusjr_Diameter = []; 
var chungusjr_XSpeed = [];
var chungusjr_YSpeed = [];
var chungusjr_Health = [];

var chungus_Count = []; 
var chungus_X = []; 
var chungus_Y = []; 
var chungus_Diameter = []; 
var chungus_XSpeed = [];
var chungus_YSpeed = [];
var chungus_Health = [];

var chungussr_Count = []; 
var chungussr_X = []; 
var chungussr_Y = []; 
var chungussr_Diameter = []; 
var chungussr_XSpeed = [];
var chungussr_YSpeed = [];
var chungussr_Health = [];

// Creates "Chips" 
var chip_Count = [];  
var chip_X = []; 
var chip_Y = []; 
var chip_Diameter = []; 
var chip_XSpeed = [];
var chip_YSpeed = [];

// Creates "Diamonds" 
var dia_Count = []; 
var dia_X = []; 
var dia_Y = []; 
var dia_Diameter = []; 
var dia_XSpeed = [];
var dia_YSpeed = [];
var dia_Health = [];

// Creates mini diamonds
var minidia_Count = []; 
var minidia_X = []; 
var minidia_Y = []; 
var minidia_Diameter = []; 
var minidia_XSpeed = [];
var minidia_YSpeed = [];
var minidia_Health = [];

// Grower Bouncies
var grower_Count = []; 
var grower_X = []; 
var grower_Y = []; 
var grower_Diameter = []; 
var grower_XSpeed = [];
var grower_YSpeed = [];
var grower_Health = [];
var max_Speed = 10;

// makes the lil fella
var lilfella_Count = [];
var lilfella_X = [];
var lilfella_Y = [];
var lilfella_Diameter = [];
var lilfella_XSpeed = [];
var lilfella_YSpeed = [];
var lilfella_Health = [];

// Stage Setting Variables
var stage;

// Shooty McBullet Stuff
var shot_X =[];
var shot_Y =[];
var shot_xDistance = [];
var shot_yDistance = [];

// Player shooting stuff
var shot_HitEnemies = [];  // used to track penetration if the enemy has been hit by that shot
var burstDiameter;
const MAX_EQUIPPED_LIMIT = 4;
const COLLISION_COOLDOWN = 30;  // Time delay between a single shot hitting an enemy it just hit. Prevents gigadamage vs larger enemies when you have penetration
var shot_Active = false;
var shot =[];
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
var reflect = false;
var regen = false;
var siphon = false;
var convert_CooldownReduction = false;
var hypercharger = false;
var convert_EnergyShield = false;

var shot_MaxAmount;
var shot_Penetration = 0;
const shot_Penetration_MAX = 12;

var shot_Power;
const shot_Power_MAX = 30;

var shot_Count; 
const shot_Count_MAX = 20;

var cooldown_Reduction = 1;
const cdr_MAX = 26;

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
var cannon_Speed = 34;
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
var waves;
var currentWave = 0;
var waveStarted = false;
var waveStartFrame = 0;
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
  lilfella: [
    { item: "exptoken", chance: .5, amount: 2 }
  ],    
  diamond: [
    { item: "exptoken", chance: .2, amount: 4 }
  ],  
  chungusjr: [
    { item: "exptoken", chance: 0.25, amount: 6 }
  ],
  chungus: [
    { item: "exptoken", chance: 0.30, amount: 8 }
  ],
  chungussr: [
    { item: "exptoken", chance: 0.35, amount: 12 }
  ],
  grower: [
    { item: "exptoken", chance: 0.20, amount: 4 }
  ],
  disc: [
    { item: "powerup", chance: 1.0 } 
  ]
};

// What they done be lookin like
const itemTable = {
  powerup: {
    frames: 4,  // Number of animation frames in sprite sheet
    frameSpeed: 12,  // Frames per animation frame
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

// Bomb
var bombExplosions = [];

// Barrage
var barrageShotsRemaining = 0;
var barrageTimer = 0;

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
    cooldown: 1000,  // 
      effect: () => {
        damageCount = 0;
        console.log("BOMB ACTIVATED!");
        playSound('bomb');
        bombExplosions.push({
        x: player_X,
        y: player_Y,
        maxRadius: 240,  // hitbox radius
        currentRadius: 0,
        duration: 40, // animation duration
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
      // Instantly Teleport near the cursor. I have no idea how the math works for this one but google is frend
      player_X += cos(atan2(mouseY - player_Y, mouseX - player_X)) * 300; // 300 dunits 
      player_Y += sin(atan2(mouseY - player_Y, mouseX - player_X)) * 300; 
    }
  },
  autofirebarrage: {  // Fires auto targeting barrage of projectiles at nearest enemy
    name: "AutoFire Barrage",
    cooldown: 900,
      effect: () => {
      console.log("AUTOFIRE BARRAGE ACTIVATED!");
      playSound('shotfullauto');

      barrageShotsRemaining = 16 + (shot_Count * 4);
      barrageTimer = 0;
    }   
  },
  decimator: {    // Fires a series of waves of projectiles which pierce
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
      
      // Generate 6-8 lightning bolts across the screen
      let boltCount = floor(random(6, 9));  // 6-8 bolts
      activeBolts = [];
      
      for (let b = 0; b < boltCount; b++) {
        let boltArray = [];
        let currentX = map(b, 0, boltCount - 1, 0, width);  // Distribute across width
        let currentY = 0;
        let segmentLength = 30;        
        // Random bolt length between height - 200 and height - 30 so that they don't go "off screen"
        let boltLength = random(height - 200, height - 30);
          while (currentY < boltLength) {
          boltArray.push({x: currentX, y: currentY});
          
          // Random walk for the bolt so they have some variance
          currentX += random(-40, 40);
          currentY += segmentLength + random(-10, 10);
          
          // Keep it roughly on screen
          currentX = constrain(currentX, -100, width + 100);
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
      singularityX = mouseX;
      singularityY = mouseY;
      singularityCaughtEnemies = [];
    }
  }  
};

// Attachment List/Info
const attachmentList = {
  1: {name: "Multi-shot", 
      icon: "../Images/attachment_multishot.png", 
      itemInfo: "Increases Shot Count but slightly reduces Shot Speed.",      
      stats: [
    { stat: "shot_Count", value: 2 },
    { stat: "shot_Speed", value: -3 }
  ]},
  2: {name: "Hypershot", 
    icon: "../Images/attachment_hypershot.png",
    itemInfo: "Slightly decreases Shot Diameter while gaining Shot Speed.", 
    stats: [
    { stat: "shot_Diameter", value: -2 },
    { stat: "shot_Speed", value: 5 }
  ]},
  3: { name: "Rapid-loader", 
    icon: "../Images/attachment_rapidloader.png",
    itemInfo: "Greatly increases Fire Rate while at the cost of Shot Speed.",
    stats: [
    { stat: "shot_Speed", value: -3 },
    { stat: "shot_Delay", value: -4 }
  ]},
  4: { name: "Lancer Rounds", 
    icon: "../Images/attachment_lancerrounds.png", 
    itemInfo: "Increases Shot Penetration but reduces fire rate.",
    stats: [
    { stat: "shot_Penetration", value: 1 },
    { stat: "shot_Delay", value: +4 },    
  ]},
  5: { name: "Magnifier", 
    icon: "../Images/attachment_magnifier.png", 
    itemInfo: "Greatly increases Shot Diameter. Does not effect Beam attacks.",
    stats: [
    { stat: "shot_Diameter", value: 10 }
  ]},

  6: { name: "Zero-Point Battery", 
    icon: "../Images/attachment_zeropointbattery.png", 
    itemInfo: "Greatly increases ability cooldown speed.",
    stats: [
    { stat: "cooldown_Reduction", value: 22 }
  ]},
  7: { name: "Giga Rounds", 
    icon: "../Images/attachment_gigarounds.png", 
    itemInfo: "Small increase to Shot Power, large increase to Shot Diameter.",
    stats: [
    { stat: "shot_Diameter", value: 8 },
    { stat: "shot_Power", value: 1 }    
  ]},
  8: { name: "Defense Matrix", 
    icon: "../Images/attachment_defensematrix.png", 
    itemInfo: "Increases Shield Recharge Speed and shield value.",
    stats: [
    { stat: "shield_Cooldown", value: -50 },
    { stat: "shield_Value", value: 2 }
  ]},
  9: { name: "Targeting Dynamo", 
    icon: "../Images/attachment_turbocharger.png", 
    itemInfo: "Increases Shot Speed and Fire Rate, but slightly reduces power.",
    stats: [
    { stat: "shot_Delay", value: -2 },
    { stat: "shot_Speed", value: 4 },
    { stat: "shot_Power", value: -1 }
  ]},
  10: { name: "Photon Rounds", 
    icon: "../Images/attachment_photonrounds.png", 
    itemInfo: "Greatly increases Shot Speed and Duration.",
    stats: [
    { stat: "shot_Speed", value: 20 },
    { stat: "shot_Duration", value: 10 }
  ]},

  11: { name: "Destructinator", 
    icon: "../Images/attachment_destructinator.png", 
    itemInfo: "Provides greatly increased penetration at a loss of Shot Power and Duration.",
    stats: [
    { stat: "shot_Duration", value: -8 },
    { stat: "shot_Penetration", value: 2 },
    { stat: "shot_Power", value: -1 }
  ]},
  12: { name: "Mirror Shots", 
    icon: "../Images/attachment_mirrorshots.png", 
    itemInfo: "Causes your shots to ricochet and increases Shot Count. ",
    stats: [
    { stat: "reflect", value: true },
    { stat: "shot_Count", value: 1 }
  ]},
  13: { name: "Blast Shield", 
    icon: "../Images/attachment_blastshield.png", 
    itemInfo: "Increases Shield Value.",
    stats: [
    { stat: "shield_Value", value: 4 }
  ]},
  14: { name: "Charge Converter", 
    icon: "../Images/attachment_chargeconverter.png", 
    itemInfo: "Increases and reductions to Firing Rate instead apply to Cooldown Reduction at 100% increased value.",
    stats: [], 
    conversion: {}
  },
  15: { name: "Hypercharger", 
    icon: "../Images/attachment_conversioncore.png", 
    itemInfo: "Doubles Shot Speed.",
    stats: [ {stat: "shot_Speed_multiply", value: 1 }
  ]},
  16: { name: "Cyclotron", 
    icon: "../Images/attachment_cyclotron.png", 
    itemInfo: "Increases Shot Speed, Shot Count and Cooldown Reduction.",
    stats: [
    { stat: "shot_Speed", value: 4 },
    { stat: "shot_Count", value: 2 },
    { stat: "cooldown_Reduction", value: 10 }
  ]},
  17: { name: "Delta Cannon", 
    icon: "../Images/attachment_deltacannon.png", 
    itemInfo: "Drastically increases Shot Power a loss of Fire Rate.",
    stats: [
    { stat: "shot_Power", value: 5 },
    { stat: "shot_Delay", value: 6 }
  ]},
  18: { name: "Laser Battery", 
    icon: "../Images/attachment_laserbattery.png", 
    itemInfo: "Increases Shield Recharge rate and Cooldown Reduction.",
    stats: [
    { stat: "shield_Cooldown", value: -40 },
    { stat: "cooldown_Reduction", value: 15 },
//    { stat: "alternatingEnabled", value: true }
  ]},
  19: { name: "Energy Shield", 
    icon: "../Images/attachment_energyshield.png", 
    itemInfo: "Converts 30% of your Maximum Health to Shield Value.",
    stats: [{}
  ], conversion: { fromStat: "max_Health", toStat: "shield_Value", percentage: 0.30 }  
},
  20: { name: "Power Core", 
    icon: "../Images/attachment_powercore.png", 
    itemInfo: "Boost to weapon parameters.",
    stats: [
    { stat: "shot_Power", value: 1 },
    { stat: "shot_Speed", value: 2 },
    { stat: "shot_Count", value: 2 },
    { stat: "shot_Delay", value: -2 },
    { stat: "shot_Duration", value: 4 },
    { stat: "burstCooldown", value: -4 },
//   { stat: "waveEnabled", value: true }    
  ]}          
};

// Ship level save stuff
SaveData.Ships = {
  1: { level: X, exp: Y },
  2: { level: A, exp: B },
  3: { level: C, exp: D },
  4: { level: E, exp: F }
}

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
  CHUNGUSJR: 2,
  CHUNGUS: 4,
  CHUNGUSSR: 6,
  DIA: 1,
  LILFELLA: 1  
};

// Wave spawning - stage by stage basis I need to make this array less heinously ugly
const stageWaves = {
  1: [{startTime: 4, spawns: [
        { type: "lilfella", amount: 4, side: "left", delay: 15 }
      ]},
    {startTime: 8,spawns: [
        { type: "dia", amount: 4, side: "right", delay: 15 }
      ]},
    {startTime: 14,
      spawns: [
        { type: "dia", amount: 4, side: "top", delay: 15 }
      ]},
    {startTime: 18,
      spawns: [
        { type: "disc", amount: 1, side: "center", delay: 30 }
      ]},      
    {startTime: 20,spawns: [
        { type: "dia", amount: 4, side: "bottom", delay: 15 }
      ]},
    {startTime: 22,spawns: [
        { type: "chip", amount: 1, side: "center", delay: 20 }
      ]},
    {startTime: 26,spawns: [
        { type: "disc", amount: 1, side: "right", delay: 20 }
      ]},
    {startTime: 30,spawns: [
        { type: "dia", amount: 1, side: "bottom", delay: 20 }
      ]},   
    {startTime: 32,spawns: [
        { type: "grower", amount: 6, side: "left", delay: 60 }
      ]},   
    {startTime: 36,
      spawns: [
        { type: "disc", amount: 1, side: "center", delay: 30 }
      ]},         
    {startTime: 40,spawns: [
        { type: "chungusjr", amount: 3, side: "grid", delay: 100 }
      ]}                 
  ],

  2: [{startTime: 0,spawns: [
        { type: "disc", amount: 3, side: "left", delay: 15 }
      ]},
    {startTime: 5,spawns: [
        { type: "grower", amount: 8, side: "top", delay: 25 }
      ]},
    {startTime: 12,spawns: [
        { type: "dia", amount: 5, side: "bottom", delay: 20 }
      ]}
  ],  

  3: [{startTime: 0,spawns: [
        { type: "grower", amount: 10, side: "top", delay: 20 }
      ]},
    {startTime: 8,
      spawns: [
        { type: "dia", amount: 8, side: "right", delay: 15 }
      ]},
    {startTime: 18,spawns: [
        { type: "disc", amount: 2, side: "left", delay: 30 }
      ]}
  ],  
  
  // TEST STAGE - No Spawns
  50: [{startTime: 0,spawns: [
        { }
      ]}
  ]
  
};

function preload() {
  console.log("Preload starting...");
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
  sounds.hitchungusjr = [];
  sounds.hitchungus = [];
  sounds.hitchungussr = [];
  sounds.hitdiamond = [];      
  sounds.hitdisc = [];
  sounds.hitgrower = [];
  sounds.hitminidiamond = [];
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

  for ( i = 0; i < SOUND_COUNT; i++) {
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
    sounds.hitchungusjr.push(loadSound('../Audio/HitChungusJr.ogg'));
    sounds.hitchungus.push(loadSound('../Audio/HitChungus.ogg'));
    sounds.hitchungussr.push(loadSound('../Audio/HitChungusSr.ogg'));
    sounds.hitdiamond.push(loadSound('../Audio/HitDiamond.ogg'));            
    sounds.hitdisc.push(loadSound('../Audio/HitDisc.ogg'));
    sounds.hitgrower.push(loadSound('../Audio/HitGrower.ogg'));
    sounds.hitminidiamond.push(loadSound('../Audio/HitMiniDiamond.ogg'));
    sounds.levelup.push(loadSound('../Audio/LevelUp.ogg'));
    sounds.playerhit.push(loadSound('../Audio/PlayerHit.ogg'));
    sounds.shotfullauto.push(loadSound('../Audio/ShotFullAuto.ogg'));
    sounds.shotshotgun.push(loadSound('../Audio/ShotShotgun.ogg'));
    sounds.shotsingle.push(loadSound('../Audio/ShotSingle.ogg'));
    sounds.shotbit.push(loadSound('../Audio/ShotBit.ogg'));
    sounds.shotblaster.push(loadSound('../Audio/ShotBlaster.ogg'));
    sounds.shotcannon.push(loadSound('../Audio/ShotCannon.ogg'));            
  }

  for (let id in attachmentList) {
    let attachment = attachmentList[id];
    if (attachment.icon) {
      console.log("Loading image: " + attachment.icon);
      attachmentImages[id] = loadImage(attachment.icon, 
        () => console.log("Successfully loaded: " + attachment.icon),
        () => console.log("FAILED to load: " + attachment.icon)
      );
      
        // If item not unlocked yet
      grayscaleAttachmentImages[id] = loadImage(attachment.icon, 
        function(img) {
          img.filter(GRAY);
          console.log("Grayscale created: " + attachment.icon);
        },
        () => console.log("FAILED to create grayscale: " + attachment.icon)
      );
    }    
  }
}

// Setup Canvas
function setup() {
  createCanvas(1500, 1200);
  LoadStage();
  UnlockAbility("flash"); // Unlocked by default for all ships

//  UnlockAbility("bomb");
//  UnlockAbility("shield");

//  UnlockAbility("autofirebarrage");
//  UnlockAbility("spiralshot"); 
//  UnlockAbility("lightningbolt"); 
//  UnlockAbility("singularity");   
//  UnlockAbility("decimator");   
 
}

function StartGame() {
  playSound('gamestart');
  ResetAllArrays();
  BuildEnemiesArray();
  while (equippedAttachments.length > 0) {
    UnequipAttachment(0);
  }
  attachments = [];
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
//  attachments.push(14); 
//  attachments.push(15); 
//  attachments.push(16); 
//  attachments.push(17); 
//  attachments.push(18);
//  attachments.push(19); 
//  attachments.push(20); 

  game_Screen = "shipSelection";
  selectedShip = 1;  
  shipSelectionActive = true;
  game_State = true;
  stage = 1;
  LoadStage();
}

// Game Resetter
function RestartGame() {
  ApplyShipStats();
  ResetAllArrays();
  BuildEnemiesArray();
  playSound('gamestart'); 
  // Removes equipped items
  while (equippedAttachments.length > 0) {
  UnequipAttachment(0);}
  attachments = [];
  game_Screen = "playing";
  game_State = true;
  stage = 1;

  bits =0;
  blasters=0;
  cannons=0;
  LoadStage();
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
      if (player_Health >= max_Health) {player_Health = max_Health;}
    }
  }
}

// The item spawner handler
function SpawnItem(x, y, itemType) {
  items_X.push(x);
  items_Y.push(y);
  items_Type.push(itemType);
  items_Frame.push(0);
}

// Enemy drops handler
function HandleEnemyDrops(x, y, enemyType) {
  if (!dropTable[enemyType]) return;
  
  for (let drop of dropTable[enemyType]) {
    if (random() < drop.chance) {
      if (drop.item === "exptoken") {
        SpawnExpToken(x, y, drop.amount);

      } else if (drop.item === "powerup") {
        SpawnPowerup(x, y);

      } else if (drop.item === "ability") {
        SpawnAbility(x, y, abilityName); 

      } else if (drop.item === "goldtoken") {
        SpawnGoldToken(x, y);

      } else {
        SpawnItem(x, y, drop.amount);  // Fallback for any other types not explicitly stated
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
  items_Amount.push(abilityType);  // Store the ability type or ID
}
// spawns the exp token
function SpawnExpToken(x, y, amount) {
  items_X.push(x);
  items_Y.push(y);
  items_Type.push("exptoken");
  items_Frame.push(0);
  items_Amount.push(amount);  
}

// Gets nearest enemy so we can shoot it in the face and or ass
function GetNearestEnemy(x, y, enemyArray) {
  let nearest = null;
  let bestDist = Infinity;

  for (let t = 0; t < enemyArray.length; t++) {
    let arrX = enemyArray[t].x;
    let arrY = enemyArray[t].y;
    let arrHealth = enemyArray[t].health;

    for (let e = 0; e < arrX.length; e++) {
      if (arrHealth[e] <= 0) continue;

      let dx = arrX[e] - x;
      let dy = arrY[e] - y;
      let distSq = dx * dx + dy * dy;

      if (distSq < bestDist) {
        bestDist = distSq;
        nearest = { typeIndex: t, enemyIndex: e, distSq };
      }
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

// polygon shape maker script 
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

// -- Abilities n' syuch -- Most abilities start by setting a value related to them and then counting up/down and executing something if that value isn't 0
// Used to draw out the boom boom
function DrawBombExplosions() {
  for (let i = bombExplosions.length - 1; i >= 0; i--) {
    let explosion = bombExplosions[i];
    explosion.age++;    
    explosion.currentRadius = (explosion.age / explosion.duration) * explosion.maxRadius;
    let alpha = map(explosion.age, 0, explosion.duration, 255, 0);
    
    for (let ring = 0; ring < 12; ring++) {
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
  if (barrageShotsRemaining > 0) {
    barrageTimer++;
    
    if (barrageTimer >= 6) {  // 6 frames between each shot
      let baseAngle;
      
      let target = GetNearestEnemy(player_X, player_Y, enemies);      
      if (target) {
        let targetX = enemies[target.typeIndex].x[target.enemyIndex];
        let targetY = enemies[target.typeIndex].y[target.enemyIndex];
        baseAngle = atan2(targetY - player_Y, targetX - player_X);
      } else {
        // If nothing found, still fires
        baseAngle = atan2(mouseY - player_Y, mouseX - player_X);
      }
      
      let spread = random(-4, 4) * PI / 180;
      
      AddShots(player_X, player_Y, [baseAngle + spread], [shot_Speed], [shot_Diameter], 0, shot_Penetration);
      playSound('shotfullauto');
      
      barrageShotsRemaining--;
      barrageTimer = 0;
    }
  }
}

// Decimator abilitiy 
function UpdateDecimator() {
  if (decimatorShotsRemaining > 0) {
    if (!decimatorActive) {
      shot_Penetration += 2;
      decimatorActive = true;
    }
    decimatorTimer++;
      if (decimatorTimer >= 16) {  // 16 frames between each shot
        playSound('abilitydecimator');
        let baseAngle = atan2(mouseY - player_Y, mouseX - player_X);
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
  if (spiralShotsRemaining > 0) {
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
  if (boltActive) {
    boltTimer++;
    
    if (boltTimer >= boltDuration) {
      boltActive = false;
      activeBolts = [];
    } else {
      // Draw all lightning bolts
      for (let bolt of activeBolts) {
        // Draw the actual bolt
        stroke(0, 200, 255);
        strokeWeight(3);
        for (let i = 0; i < bolt.length - 1; i++) {
          line(bolt[i].x, bolt[i].y, bolt[i + 1].x, bolt[i + 1].y);
        }
        
        // Add glow effect
        stroke(75, 255, 240, 100);
        strokeWeight(8);
        for (let i = 0; i < bolt.length - 1; i++) {
          line(bolt[i].x, bolt[i].y, bolt[i + 1].x, bolt[i + 1].y);
        }
      }
      
      // Check collision with all enemy types
      CheckBoltCollision(disc_X, disc_Y, disc_Diameter, disc_Health, disc_XSpeed, disc_YSpeed, 5, 10 + Level, 'hitdisc', 'deathdisc', "disc");
      CheckBoltCollision(chungusjr_X, chungusjr_Y, chungusjr_Diameter, chungusjr_Health, chungusjr_XSpeed, chungusjr_YSpeed, 12, 8, 'hitchungusjr', 'deathchungusjr');
      CheckBoltCollision(chungus_X, chungus_Y, chungus_Diameter, chungus_Health, chungus_XSpeed, chungus_YSpeed, 20, 16, 'hitchungus', 'deathchungus');
      CheckBoltCollision(chungussr_X, chungussr_Y, chungussr_Diameter, chungussr_Health, chungussr_XSpeed, chungussr_YSpeed, 40, 28, 'hitchungussr', 'deathchungussr');
      CheckBoltCollision(dia_X, dia_Y, dia_Diameter, dia_Health, dia_XSpeed, dia_YSpeed, 4, 3, 'hitdiamond', 'deathdiamond', "diamond");
      CheckBoltCollision(minidia_X, minidia_Y, minidia_Diameter, minidia_Health, minidia_XSpeed, minidia_YSpeed, 2, 1, 'hitminidiamond', 'deathminidiamond');
      CheckBoltCollision(grower_X, grower_Y, grower_Diameter, grower_Health, grower_XSpeed, grower_YSpeed, 5, 8, 'hitgrower', 'deathgrower');
      CheckBoltCollision(lilfella_X, lilfella_Y, lilfella_Diameter, lilfella_Health, lilfella_XSpeed, lilfella_YSpeed, 5, 8, 'hitgrower', 'deathgrower');  // lil fella be usin the grower sfx
    }
  }
}

// Checks hitbox for lightning bolts - hits ALL units in its path
function CheckBoltCollision(targetX, targetY, targetDiameter, targetHealth, targetXSpeed, targetYSpeed, expReward, goldReward, hitSound, deathSound, enemyType) {
  for (let t = targetX.length - 1; t >= 0; t--) {
    if (boltHitEnemies.includes(t)) continue;
    
    for (let bolt of activeBolts) {
      for (let i = 0; i < bolt.length - 1; i++) {
        let segment = bolt[i];
        let nextSegment = bolt[i + 1];
        
        let distance = DistanceToLineSegment(targetX[t], targetY[t], segment.x, segment.y, nextSegment.x, nextSegment.y);
        
        if (distance < 26) {  // Sets the hitbox leeway
          targetHealth[t] -= 20;    // damage value
          playSound(hitSound);
          boltHitEnemies.push(t);
          
          // Handles enemey death and if they have special functions tied to them (Such as Diamonds splitting into 2)
          if (targetHealth[t] <= 0) {
            playSound(deathSound);
            Exp += expReward;
            Gold += goldReward;
            HandleEnemyDrops(targetX[t], targetY[t], enemyType);

            if (enemyType === "diamond") {
              SpawnMinidia(targetX[t], targetY[t], targetDiameter[t] + 3);
              SpawnMinidia(targetX[t], targetY[t], targetDiameter[t] + 3);
            } 
            targetX.splice(t, 1);
            targetY.splice(t, 1);
            targetDiameter.splice(t, 1);
            targetHealth.splice(t, 1);
            if (targetXSpeed) targetXSpeed.splice(t, 1);
            if (targetYSpeed) targetYSpeed.splice(t, 1);
          }
          break;
        }
      }
    }
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
  if (singularityActive) {
    singularityTimer++;
    
    if (singularityTimer >= singularityDuration) {
      // Singularity ends - damage all caught enemies
      DealSingularityDamage();
      singularityActive = false;
      singularityCaughtEnemies = [];
    } else {
      // Draw the singularity
      let pulseAmount = sin(singularityTimer / 20) * 10;
      
      // Black hole center
      fill(20, 20, 30);
      stroke(100, 200, 255);
      strokeWeight(2);
      circle(singularityX, singularityY, singularityRadius * 2 - pulseAmount);
      
      // Outer glow
      noFill();
      stroke(0, 150, 255, 150);
      strokeWeight(3);
      circle(singularityX, singularityY, singularityRadius * 2 + pulseAmount);
      
      stroke(50, 200, 255, 100);
      strokeWeight(1);
      circle(singularityX, singularityY, singularityRadius * 2.2);
      
      // Draw lightning arcs
      DrawSingularityLightning(8);  // 8 random arcs
      
      noStroke();
      
      // Pull all nearby enemies toward the singularity
      PullEnemiesToSingularity(disc_X, disc_Y);
      PullEnemiesToSingularity(chungusjr_X, chungusjr_Y);
      PullEnemiesToSingularity(chungus_X, chungus_Y);
      PullEnemiesToSingularity(chungussr_X, chungussr_Y);
      PullEnemiesToSingularity(dia_X, dia_Y);
      PullEnemiesToSingularity(minidia_X, minidia_Y);
      PullEnemiesToSingularity(grower_X, grower_Y);
      PullEnemiesToSingularity(lilfella_X, lilfella_Y);
    }
  }
}
// Generates a "staticy" effect on the B HOLE
function DrawSingularityLightning(arcCount) {
  for (let a = 0; a < arcCount; a++) {
    let startAngle = random(TWO_PI);
    
    // Start from the outer edge of the singularity
    let startX = singularityX + cos(startAngle) * singularityRadius * 0.8;
    let startY = singularityY + sin(startAngle) * singularityRadius * 0.8;
    
    // End at the center
    let endX = singularityX;
    let endY = singularityY;
    
    // Draw the main lightning bolt with segments
    stroke(150, 200, 255);
    strokeWeight(2);
    
    let segmentCount = 8;
    for (let s = 0; s < segmentCount; s++) {
      let t = s / segmentCount;
      let nextT = (s + 1) / segmentCount;
      
      let currentX = lerp(startX, endX, t);
      let currentY = lerp(startY, endY, t);
      let nextX = lerp(startX, endX, nextT);
      let nextY = lerp(startY, endY, nextT);
      
      // Add random jitter to make it look jagged
      currentX += random(-8, 8);
      currentY += random(-8, 8);
      nextX += random(-8, 8);
      nextY += random(-8, 8);
      
      line(currentX, currentY, nextX, nextY);
    }
    
    // Draw glowy effect
    stroke(100, 180, 255, 150);
    strokeWeight(4);
    line(startX, startY, endX, endY);
  }
}

// Creates the "Gravity Well" type effect
function PullEnemiesToSingularity(enemyX, enemyY) {
  for (let e = 0; e < enemyX.length; e++) {
    let distToSingularity = dist(enemyX[e], enemyY[e], singularityX, singularityY);
    
    if (distToSingularity < singularityRadius * 1.4) {
      // Add to caught enemies if not already
      if (!singularityCaughtEnemies.includes(e)) {
        singularityCaughtEnemies.push(e);
      }
      
      // Smooth pull toward singularity
      let angle = atan2(singularityY - enemyY[e], singularityX - enemyX[e]);
      let pullStrength = map(distToSingularity, singularityRadius * 4, 0, 0.5, 3);  // Stronger pull closer to center
      
      enemyX[e] += cos(angle) * pullStrength;
      enemyY[e] += sin(angle) * pullStrength;
    }
  }
}

// Singularity ability 
function DealSingularityDamage() {
  let damageAmount = 10 + (singularityCaughtEnemies.length * 5);
  
  console.log("Singularity dealt " + damageAmount + " damage to " + singularityCaughtEnemies.length + " enemies");
  
  ApplySingularityDamage(disc_X, disc_Y, disc_Diameter, disc_Health, disc_XSpeed, disc_YSpeed, 5, 10 + Level, 'hitdisc', 'deathdisc', "disc", damageAmount);
  ApplySingularityDamage(chungusjr_X, chungusjr_Y, chungusjr_Diameter, chungusjr_Health, chungusjr_XSpeed, chungusjr_YSpeed, 12, 8, 'hitchungusjr', 'deathchungusjr', null, damageAmount);
  ApplySingularityDamage(chungus_X, chungus_Y, chungus_Diameter, chungus_Health, chungus_XSpeed, chungus_YSpeed, 20, 16, 'hitchungus', 'deathchungus', null, damageAmount);
  ApplySingularityDamage(chungussr_X, chungussr_Y, chungussr_Diameter, chungussr_Health, chungussr_XSpeed, chungussr_YSpeed, 40, 28, 'hitchungussr', 'deathchungussr', null, damageAmount);
  ApplySingularityDamage(dia_X, dia_Y, dia_Diameter, dia_Health, dia_XSpeed, dia_YSpeed, 4, 3, 'hitdiamond', 'deathdiamond', "diamond", damageAmount);
  ApplySingularityDamage(minidia_X, minidia_Y, minidia_Diameter, minidia_Health, minidia_XSpeed, minidia_YSpeed, 2, 1, 'hitminidiamond', 'deathminidiamond', null, damageAmount);
  ApplySingularityDamage(grower_X, grower_Y, grower_Diameter, grower_Health, grower_XSpeed, grower_YSpeed, 5, 8, 'hitgrower', 'deathgrower', null, damageAmount);
  ApplySingularityDamage(lilfella_X, lilfella_Y, lilfella_Diameter, lilfella_Health, lilfella_XSpeed, lilfella_YSpeed, 5, 8, 'hitgrower', 'deathgrower', null, damageAmount);
}

// Applies the damage finally
function ApplySingularityDamage(targetX, targetY, targetDiameter, targetHealth, targetXSpeed, targetYSpeed, expReward, goldReward, hitSound, deathSound, enemyType, damage) {
  for (let t = targetX.length - 1; t >= 0; t--) {
    if (!singularityCaughtEnemies.includes(t)) continue;
    
    targetHealth[t] -= damage;
    playSound(hitSound);
    
    if (targetHealth[t] <= 0) {
      playSound(deathSound);
      Exp += expReward;
      Gold += goldReward;
      HandleEnemyDrops(targetX[t], targetY[t], enemyType);
      if (enemyType === "diamond") {
        SpawnMinidia(targetX[t], targetY[t], targetDiameter[t]);
        SpawnMinidia(targetX[t], targetY[t], targetDiameter[t]);
      } 
      targetX.splice(t, 1);
      targetY.splice(t, 1);
      targetDiameter.splice(t, 1);
      targetHealth.splice(t, 1);
      if (targetXSpeed) targetXSpeed.splice(t, 1);
      if (targetYSpeed) targetYSpeed.splice(t, 1);
    }
  }
}

// Level up handler
function LevelUp(){
  playSound('levelup');
  Level += 1;  
  if (Level === 10 || Level === 20 || Level === 30) {
      ShowSupportChoices();
  }

  max_Health += 1; // Base max health increase
  // player_Health = max_Health; // leveling up heals player
  exp_Next = Math.trunc(25 + (1 + Level ** 3) * 1.5);
  exp = 0;
  RecalculateConversions();
  ClampStats();
}

// Makes the nice cursor reticle and arrow depending on which window is active
function CursorUpdate(){
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

function LoadStage(){
  if (stage === 1) {
    player_X = width / 2;
    player_Y = height / 2 + 100;

  } else if (stage === 2) {
    player_X = width - 50;
    player_Y = height - 50;

  } else if (stage === 3) {
    player_X = width / 2;
    player_Y = height - 50;
  }
  //  Wave loader 
  if (stageWaves[stage]) {
    waves = stageWaves[stage];
  } else {
    waves = [];
  }  

  // Reset wave system
  currentWave = 0;
  waveStarted = false;
  waveStartFrame = 0;

  player_Health = max_Health; // Restores heathl to max on next stage (( Might remove this for make more harder))
  time = 0;

  items_X = [];
  items_Y = [];
  items_Type = [];
  items_Frame = [];
  items_Amount = [];
}

function SaveGame() {
  localStorage.setItem("ShootyMcBulletGame", JSON.stringify(SaveData));
}

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
  return {x: rotatedX, y: rotatedY};
}

// "Kill Enemy" effects such as diamond
function KillEnemy(enemyType, targetX, targetY, targetDiameter, expReward, goldReward, deathSound, index, targetXSpeed, targetYSpeed, targetHealth) {
  playSound(deathSound);
  Exp += expReward;
  Gold += goldReward;
  HandleEnemyDrops(targetX, targetY, enemyType);
  
  // Handle special death effects
  if (enemyType === "diamond") {
    SpawnMinidia(targetX, targetY, targetDiameter);
    SpawnMinidia(targetX, targetY, targetDiameter);
  }
  
  return true; // Signal that enemy was killed
}

function DamageEnemiesInRadius(radius, damageAmount) {
  const enemies = [
    { type: 'disc', x: disc_X, y: disc_Y, health: disc_Health, diameter: disc_Diameter, xSpeed: disc_XSpeed, ySpeed: disc_YSpeed, sound: 'deathdisc', exp: 5, gold: (l) => 10 + l },
    { type: 'dia', x: dia_X, y: dia_Y, health: dia_Health, diameter: dia_Diameter, xSpeed: dia_XSpeed, ySpeed: dia_YSpeed, sound: 'deathdiamond', exp: 4, gold: (l) => 3 },
    { type: 'minidia', x: minidia_X, y: minidia_Y, health: minidia_Health, diameter: minidia_Diameter, xSpeed: minidia_XSpeed, ySpeed: minidia_YSpeed, sound: 'deathminidiamond', exp: 2, gold: (l) => 1 },
    { type: 'grower', x: grower_X, y: grower_Y, health: grower_Health, diameter: grower_Diameter, xSpeed: grower_XSpeed, ySpeed: grower_YSpeed, sound: 'deathgrower', exp: 5, gold: (l) => 8 },
    { type: 'chungusjr', x: chungusjr_X, y: chungusjr_Y, health: chungusjr_Health, diameter: chungusjr_Diameter, xSpeed: chungusjr_XSpeed, ySpeed: chungusjr_YSpeed, sound: 'deathchungusjr', exp: 12, gold: (l) => 8 },
    { type: 'chungus', x: chungus_X, y: chungus_Y, health: chungus_Health, diameter: chungus_Diameter, xSpeed: chungus_XSpeed, ySpeed: chungus_YSpeed, sound: 'deathchungus', exp: 20, gold: (l) => 16 },
    { type: 'chungussr', x: chungussr_X, y: chungussr_Y, health: chungussr_Health, diameter: chungussr_Diameter, xSpeed: chungussr_XSpeed, ySpeed: chungussr_YSpeed, sound: 'deathchungussr', exp: 40, gold: (l) => 28 },
    { type: 'lilfella', x: lilfella_X, y: lilfella_Y, health: lilfella_Health, diameter: lilfella_Diameter, xSpeed: lilfella_XSpeed, ySpeed: lilfella_YSpeed, sound: 'deathgrower', exp: 40, gold: (l) => 28 }
  ];
  
  enemies.forEach(enemy => {
    for (let i = enemy.x.length - 1; i >= 0; i--) {
      if (distance(player_X, player_Y, enemy.x[i], enemy.y[i]) < radius) {
        enemy.health[i] -= damageAmount;
        
        if (enemy.health[i] <= 0) {
          // Call the shared kill function
          KillEnemy(
            enemy.type,
            enemy.x[i],
            enemy.y[i],
            enemy.diameter[i],
            enemy.exp,
            enemy.gold(Level),
            enemy.sound,
            i,
            enemy.xSpeed,
            enemy.ySpeed,
            enemy.health
          );
          
          damageCount++;
          
          // Remove enemy from all arrays
          enemy.x.splice(i, 1);
          enemy.y.splice(i, 1);
          enemy.diameter.splice(i, 1);
          enemy.xSpeed.splice(i, 1);
          enemy.ySpeed.splice(i, 1);
          enemy.health.splice(i, 1);
        }
      }
    }
  });
}

// `` -- __  Visual and Shape settings for the objects __ -- ``
// define ConcentricCircle function --
function ConcentricCircle(x, y, outer_diameter, inner_diameter, outer_red, outer_green, outer_blue, inner_red, inner_green, inner_blue)
 {
  strokeWeight(2);
  fill(outer_red, outer_green, outer_blue);
  circle(x, y, outer_diameter);
  fill(inner_red, inner_green, inner_blue);
  circle(x, y, inner_diameter);
}

// Das Dooble Squarzen
function DoubleSquare(x, y, outer_diameter, inner_diameter, outer_red, outer_green, outer_blue, inner_red, inner_green, inner_blue)
 {
  rectMode(CENTER);
  strokeWeight(1);
  fill(outer_red, outer_green, outer_blue);
  square(x, y, outer_diameter);
  fill(inner_red, inner_green, inner_blue);
  square(x, y, inner_diameter);
}
// Double Diamond shape
function DoubleDiamond(x, y, outer_diameter, inner_diameter, outer_red, outer_green, outer_blue, inner_red, inner_green, inner_blue) 
{
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
function CreateBorders()
{
  strokeWeight(1);
  stroke(45, 20, 20)
  rectMode(CORNER);
  // Stage 1 Settings
  fill(100, 90, 80);  
  rect(0, 50, 10, height-50)
  rect(0, 50, width, 10)
  rect(width-10, 50, 10, height)
  rect(0, height-10, width, 10)
  fill(100, 55, 150);
  rect(0, 0, width, 50)
}

function DrawObstacleZone(){
  if (stage === 1) {
    fill(50, 20, 250);
    stroke(220, 20, 20);
    strokeWeight(2); 

    rect(width / 4 ,  height / 4,   100,        height / 2);  // Left
    rect(width / 4 ,  height / 4,   width / 2, 100);   // Top
    rect(width * .75, height / 4,   100,        height / 2);// right
    rect(width / 4,   height / 4 + height /2 - 100, width / 2, 100);  // bottom

  } else if (stage === 2) {
    fill(150, 100, 150);
    rect(100, 100, 300, 200);
  } else if (stage === 3) {
    fill(150, 150, 100);
    circle(600, 450, 120);
  }else if (stage === 50) {
    fill(50, 20, 250);
    stroke(220, 20, 20);
    strokeWeight(2); 

    rect(width / 4 ,  height / 4,   100,        height / 2);  // Left
    rect(width / 4 ,  height / 4,   width / 2, 100);   // Top
    rect(width * .75, height / 4,   100,        height / 2);// right
    rect(width / 4,   height / 4 + height /2 - 100, width / 2, 100);  // bottom
  }
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
//    console.log("Added Bit #" + bits);
  } else {
//    console.log("Max bits reached!");
  }
}

// Adds the Cannon 
function AddCannon() {
  if (cannons < max_Cannons) {
    cannons++;
    cannon_Side.push(cannons === 1 ? "left" : "right");
    cannon_CooldownTimer.push(0);
//    console.log("Added Cannon #" + cannons + " on " + cannon_Side[cannons - 1]);
  } else {
//    console.log("Max cannons reached!");
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
//    console.log("Added Blaster #" + blasters);
  } else {
//    console.log("Max blasters reached!");
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
  const orbitSpeed = 0.02;
  
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
      let cannonX = cannon_Side[i] === "left" ? player_X - 60 : player_X + 60;
      let cannonY = player_Y;

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
    {x: blasterCornerDistance, y: blasterCornerDistance},
    {x: -blasterCornerDistance, y: -blasterCornerDistance}
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
function UpdateItems() {
  for (let i = items_X.length - 1; i >= 0; i--) {
    let itemType = items_Type[i];
    let itemData = itemTable[itemType];
    
    // Draw animated item
    if (itemData && itemData.spriteSheet) {
      let frameIndex = floor((frameCount + items_Frame[i]) / itemData.frameSpeed) % itemData.frames;
      
      let frameWidth = itemData.spriteSheet.width / itemData.frames;
      let frameHeight = itemData.spriteSheet.height;
      let sx = frameIndex * frameWidth;
      let sy = 0;
      
      copy(itemData.spriteSheet, sx, sy, frameWidth, frameHeight, 
           items_X[i] - 16, items_Y[i] - 16, 32, 32);  
    }
    // Check collision with player
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
      }
      
      items_X.splice(i, 1);
      items_Y.splice(i, 1);
      items_Type.splice(i, 1);
      items_Frame.splice(i, 1);
      items_Amount.splice(i, 1);
      continue;
    }
    
    // Remove if off-screen
    if (items_X[i] < -50 || items_X[i] > width + 50 ||
        items_Y[i] < -50 || items_Y[i] > height + 50) {
      items_X.splice(i, 1);
      items_Y.splice(i, 1);
      items_Type.splice(i, 1);
      items_Frame.splice(i, 1);
      if (items_Amount) items_Amount.splice(i, 1);
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

// Draws the "Disc" objects
function DrawDiscs(){   
  for (var i = 0; i < disc_Count; i++) {      
    stroke(0.5);
    disc_X[i] = getRandomNumber(width);
    disc_Y[i] = getRandomNumber(height);
    disc_Diameter[i] = 40;
    disc_XSpeed[i] = Math.floor(Math.random() * 8) +  - 4;
    disc_YSpeed[i] = Math.floor(Math.random() * 8) +  - 4;
    disc_Health[i] = 20;
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

function DrawChips(){   
  for (var i = 0; i < chip_Count; i++) {     
    chip_X[i] = getRandomNumber(width);
    chip_Y[i] = getRandomNumber(height);
    chip_Diameter[i] = Math.floor(Math.random() * 20) + 25;
    chip_XSpeed[i] = Math.floor(Math.random() * 8) +  - 4;
    chip_YSpeed[i] = Math.floor(Math.random() * 8) +  - 4;
  }
}

function DrawDia(){   
  for (var i = 0; i < dia_Count; i++) {   
    stroke(1);
    dia_X[i] = Math.floor(Math.random() * 8) +  24;
    dia_Y[i] = Math.floor(Math.random() * 8) + 24;
    dia_Diameter[i] = 65;
    dia_Health[i] = 4;
  }
}

function DrawMiniDia(){   
  for (var i = 0; i < minidia_Count; i++) {    
    minidia_X[i] = Math.floor(Math.random() * 8) +  24;
    minidia_Y[i] = Math.floor(Math.random() * 8) + 24;
    minidia_Diameter[i] =(dia_Diameter[i] /2 +4);
    minidia_XSpeed[i] = Math.floor(Math.random() * 8) +  - 4;
    minidia_YSpeed[i] = Math.floor(Math.random() * 8) +  - 4;
    minidia_Health[i] = 3;
  }
}

function DrawLilFella(){   
  for (var i = 0; i < lilfella_Count; i++) {         
    lilfella_X[i] = Math.floor(Math.random() * 8) +  24;
    lilfella_Y[i] = Math.floor(Math.random() * 8) + 24;
    lilfella_Diameter[i] = 30;
    lilfella_XSpeed[i] = Math.floor(Math.random() * 8) +  - 4;
    lilfella_YSpeed[i] = Math.floor(Math.random() * 8) +  - 4;
    lilfella_Health[i] = 3;
  }
}

function DrawGrower(){   
  for (var i = 0; i < grower_Count; i++) {     
    strokeWeight(2);
    grower_X[i] = Math.floor(Math.random() * 8) +  24;
    grower_Y[i] = Math.floor(Math.random() * 8) +  24;
    grower_Diameter[i] = 24;
    grower_XSpeed[i] = 3;
    grower_YSpeed[i] = 3;
    grower_Health[i] = 6;
  }
}

function SpawnMinidia(x, y, parent_Diameter) { 
  minidia_X.push(x);
  minidia_Y.push(y);
  let diameter = parent_Diameter / 2;
  minidia_Diameter.push(diameter +4);

  let speedX = random() < 0.5 ? random(-6, -2) : random(2, 6);
  let speedY = random() < 0.5 ? random(-6, -2) : random(2, 6);
  minidia_XSpeed.push(speedX);
  minidia_YSpeed.push(speedY);
  minidia_Health.push(3);
}

function SpawnLilFella(x, y) { 
  lilfella_X.push(x);
  lilfella_Y.push(y);
  lilfella_Diameter.push(30);
  lilfella_XSpeed.push(Math.floor(Math.random() * 8) +  - 4);
  lilfella_YSpeed.push(Math.floor(Math.random() * 8) +  - 4);
  lilfella_Health.push(3);
}

function SpawnDisc(x, y) {  // Spawn the double circle disc
  disc_X.push(x);
  disc_Y.push(y);
  disc_Diameter.push(random(40, 70));
  disc_XSpeed.push(Math.floor(Math.random() * 8) +  - 4);
  disc_YSpeed.push(Math.floor(Math.random() * 8) +  - 4);
  disc_Health.push(20);
}

function SpawnChungusJr(x, y) { 
  chungusjr_Y.push(y);
  chungusjr_Diameter.push(120);
  chungusjr_XSpeed.push(Math.floor(Math.random() * 8) +  - 4);
  chungusjr_YSpeed.push(Math.floor(Math.random() * 8) +  - 4);
  chungusjr_Health.push(28);
}

function SpawnChungus(x, y) { 
  chungus_X.push(x);
  chungus_Y.push(y);
  chungus_Diameter.push(160);
  chungus_XSpeed.push(Math.floor(Math.random() * 8) +  - 4);
  chungus_YSpeed.push(Math.floor(Math.random() * 8) +  - 4);
  chungus_Health.push(65);
}

function SpawnChungusSr(x, y) {  
  chungussr_X.push(x);
  chungussr_Y.push(y);
  chungussr_Diameter.push(200);
  chungussr_XSpeed.push(Math.floor(Math.random() * 8) +  - 4);
  chungussr_YSpeed.push(Math.floor(Math.random() * 8) +  - 4);
  chungussr_Health.push(200);
}

function SpawnChip(x, y) {
  chip_X.push(x);
  chip_Y.push(y);
  chip_Diameter.push(80);
  chip_XSpeed.push(Math.floor(Math.random() * 8) +  - 4);
  chip_YSpeed.push(Math.floor(Math.random() * 8) +  - 4);
}

function SpawnDia(x, y, spawnSide) {  
  stroke(1);
  dia_X.push(x);
  dia_Y.push(y);
  dia_Diameter.push(65);
    // Set movement based on spawn side
  let xSpeed = 0, ySpeed = 0;
    if (spawnSide === "left") {
    xSpeed = 4; 
    ySpeed = 0;
  } else if (spawnSide === "right") {
    xSpeed = -4;  
    ySpeed = 0;
  } else if (spawnSide === "top") {
    xSpeed = 0;
    ySpeed =4;  
  } else if (spawnSide === "bottom") {
    xSpeed = 0;
    ySpeed = -4;  
  } else if (spawnSide === "center") {
    // Random direction for center spawns
    xSpeed = random() < 0.5 ? random(-4, -2) : random(2, 4);
    ySpeed = random() < 0.5 ? random(-4, -2) : random(2, 4);
  }
  dia_XSpeed.push(xSpeed);
  dia_YSpeed.push(ySpeed);
  dia_Health.push(9);
}

function SpawnGrower(x, y, spawnSide) {
  noStroke();
  grower_X.push(x);
  grower_Y.push(y);
  grower_Diameter.push(32);
  grower_XSpeed.push(3); 
  grower_YSpeed.push(3);
  grower_Health.push(10);
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

function CreateObs(){   
  ApplyPulse();
  for (var i = 0; i < disc_X.length; i++) {
    ConcentricCircle(
      disc_X[i],
      disc_Y[i],
      disc_Diameter[i],
      disc_Diameter[i] / 2,
      50, 120, 250, 250, 50, 120    
    );
  }
  
  // Square chips
  ApplyPulse();
  noStroke(); // gets rid of previous stroke stuff so it doesn't apply weirdness
  for (var c = 0; c < chip_X.length; c++) {
    fill(155, 200, 220)
    rectMode(CENTER);
    DoubleDiamond(chip_X[c], chip_Y[c], chip_Diameter[c], chip_Diameter[c]/ 2, 255, 55, 85, 235, 240, 55 );
  }
  
  // Diamond chips
  ApplyPulse();
  for (var d = 0; d < dia_X.length; d++) {
    fill(155, 200, 220)
    halfSize = dia_Diameter[d] / 2;
    quad(
      dia_X[d], dia_Y[d] - halfSize,
      dia_X[d] + halfSize, dia_Y[d],
      dia_X[d], dia_Y[d] + halfSize,
      dia_X[d] - halfSize, dia_Y[d]);
  }
  
  // Mini Diamonds
  ApplyPulse();
  for (var md = 0; md < minidia_X.length; md++) {
    fill(235, 140, 220)
    halfSize = minidia_Diameter[md] / 2;
    quad(
      minidia_X[md],  minidia_Y[md] - halfSize,
      minidia_X[md] + halfSize, minidia_Y[md],
      minidia_X[md],  minidia_Y[md] + halfSize,
      minidia_X[md] - halfSize, minidia_Y[md]);
  }  
  
  // Growers
  ApplyPulse();
  for (var g = 0; g < grower_X.length; g++) {
    fill(220, 100, 220);  
    circle(grower_X[g], grower_Y[g], grower_Diameter[g]);
  }
  
  // lilfella
  for (var lf = 0; lf < lilfella_X.length; lf++){
    ApplyPulse();
    ConcentricCircle(
      lilfella_X[lf],
      lilfella_Y[lf],
      lilfella_Diameter[lf],
      lilfella_Diameter[lf] / 2,
      200, 250, 100, 50, 150, 220    
    );
  }

  // ChungusJr
  ApplyPulse();
  for (var cj = 0; cj < chungusjr_X.length; cj++) {
    drawChungusJr(chungusjr_X[cj], chungusjr_Y[cj]);
  }
  
  // Chungus
  ApplyPulse();
  for (var c = 0; c < chungus_X.length; c++) {
    drawChungus(chungus_X[c], chungus_Y[c]);
  }
  
  // ChungusSr
  ApplyPulse();
  for (var cs = 0; cs < chungussr_X.length; cs++) {
    drawChungusSr(chungussr_X[cs], chungussr_Y[cs]);
  }
}

// determines the locations of spawning and how/where they are set
function getSpawnPositions(side, amount) {
  const positions = [];
  const bufferTop = 60;
  const bufferBottom = 40;
  const bufferLeft = 40;
  const bufferRight = 40;
  const minSpacing = 60;

  const playAreaWidth = width - bufferLeft - bufferRight;
  const playAreaHeight = height - bufferTop - bufferBottom;
  switch (side) {
    case "left":
      positions.push(...spawnVerticalLine(amount, bufferLeft + 20, bufferTop, playAreaHeight, minSpacing));
      break;
    case "right":
      positions.push(...spawnVerticalLine(amount, width - bufferRight - 20, bufferTop, playAreaHeight, minSpacing));
      break;
    case "top":
      positions.push(...spawnHorizontalLine(amount, bufferLeft, bufferTop + 20, playAreaWidth, minSpacing));
      break;
    case "bottom":
      positions.push(...spawnHorizontalLine(amount, bufferLeft, height - bufferBottom - 20, playAreaWidth, minSpacing));
      break;
    case "grid":
      positions.push(...spawnGrid(amount, bufferLeft, bufferTop, playAreaWidth, playAreaHeight, minSpacing));
      break;
    case "center":
    default:
      positions.push(...spawnCenter(amount, minSpacing));
      break;
  }
  return positions;
}

// Single vert line spawn pattern
function spawnVerticalLine(amount, x, topY, availableHeight, minSpacing) {
  const positions = [];
  const spacing = availableHeight / (amount + 1);
  
  for (let i = 1; i <= amount; i++) {
    const y = topY + spacing * i;
    positions.push([x, y]);
  }
  
  return positions;
}
// Single horizontal line spawn pattern
function spawnHorizontalLine(amount, leftX, y, availableWidth, minSpacing) {
  const positions = [];
  const spacing = availableWidth / (amount + 1);
  
  for (let i = 1; i <= amount; i++) {
    const x = leftX + spacing * i;
    positions.push([x, y]);
  }
  
  return positions;
}

// handles how the grid layout works
function spawnGrid(amount, leftX, topY, availableWidth, availableHeight, minSpacing) {
  const positions = [];
  
  const cols = Math.ceil(Math.sqrt(amount));
  const rows = Math.ceil(amount / cols);
  
  const spacingX = availableWidth / (cols + 1);
  const spacingY = availableHeight / (rows + 1);
  
  let index = 0;
  for (let row = 0; row < rows && index < amount; row++) {
    for (let col = 0; col < cols && index < amount; col++) {
      const x = leftX + spacingX * (col + 1);
      const y = topY + spacingY * (row + 1);
      positions.push([x, y]);
      index++;
    }
  }  
  return positions;
}

// Centered spawn pattern
function spawnCenter(amount, minSpacing) {
  const positions = [];
  const centerX = width / 2;
  const centerY = height / 2;  
  const baseRadius = 100;
  
  for (let i = 0; i < amount; i++) {
    const angle = (i / amount) * TWO_PI;
    const radius = baseRadius + (i % 3) * 40;
    
    const x = centerX + cos(angle) * radius;
    const y = centerY + sin(angle) * radius;    
    positions.push([x, y]);
  }  
  return positions;
}

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
  let baseAngle = atan2(mouseY - player_Y, mouseX - player_X);  
  let positions = GeneratePyramidPattern(shot_Count);
  
  let startPositions = [];
  let angles = [];
  let diameters = [];
  
  for (let pos of positions) {
    // Does some sort of math
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
    positions.push({offsetX: 0, offsetY: 0});
    
  } else if (count === 2) {
    // Horizontal line of 2
    let spacing = 30;
    positions.push({offsetX: -spacing, offsetY: 15});
    positions.push({offsetX: spacing, offsetY: 0});
    
  } else if (count === 3) {
    // Triangle pointing forward
    positions.push({offsetX: 0, offsetY: 0});      // Center/front
    positions.push({offsetX: -25, offsetY: -25});   // Back left
    positions.push({offsetX: 25, offsetY: 25});    // Back right
    
  } else if (count === 4) {
    // Diamond shape
    positions.push({offsetX: 0, offsetY: -30});    // Top
    positions.push({offsetX: -30, offsetY: 0});    // Left
    positions.push({offsetX: 30, offsetY: 0});     // Right
    positions.push({offsetX: 0, offsetY: 30});     // Bottom
    
  } else if (count === 5) {
    // Pentagon (5 shots)
    // Center shot plus 4 around it
    positions.push({offsetX: 0, offsetY: 0});      // Center
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
    positions.push({offsetX: 0, offsetY: 0});      // Center
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
  console.log("FireSingleShot called - shot_FirePattern: " + shot_FirePattern + ", shot_Count: " + shot_Count);
  playSound('shotsingle');
  
  let baseAngle = atan2(mouseY - player_Y, mouseX - player_X);
  let angles = [];
  let diameters = [];
  
  if (shot_Type === 0 && shot_Count >= 2) {
    for (let s = 0; s < shot_Count; s++) {
      angles.push(baseAngle + map(s, 0, shot_Count, 0, TWO_PI));
      diameters.push(shot_Diameter);
    }
  } else {
    // Single shot firing, hence the name, FireSingleShot
    angles.push(baseAngle);
    diameters.push(shot_Diameter);
  }
  
  // Apply fire patterns to the radial shots
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
    
    AddShots(
      player_X + offsetX,
      player_Y + offsetY,
      [angles[a]],
      [shot_Speed],
      [diameters[a]],
      4,
      shot_Penetration
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
    
    AddShots(
      player_X + offsetX,
      player_Y + offsetY,
      [angles[a]],
      [shot_Speed],
      [diameters[a]],
      4,
      shot_Penetration
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
  let baseAngle = atan2(mouseY - player_Y, mouseX - player_X);
  let burstCount = shot_Count * 2;    // doubles shot count for shotgun style shots

  let angles = [];
  let diameters = Array(burstCount).fill(shot_Diameter / 2 + 1);  // adjusts the shot size 

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

function FireAutoShot() {   // Automatic fire with small delay between each shot, and delay between each burst of shots.
  playSound('shotfullauto');
  let baseAngle = atan2(mouseY - player_Y, mouseX - player_X);
   let spread = (shot_FirePattern === 3 || shot_FirePattern === 5) ? 0 : random(-3, 3) * PI / 180;
  
  let angles = [baseAngle + spread];
  let diameters = [shot_Diameter];
  
  // Apply fire patterns
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

function FireAutoAlt(angles, diameters) {
  let lateralOffset = 15;
  
  for (let a = 0; a < angles.length; a++) {
    let side = (alternatingFireSide + a) % 2;
    let sideMultiplier = side === 0 ? -1 : 1;
    
    let offsetAngle = angles[a] + HALF_PI;
    let offsetX = Math.cos(offsetAngle) * lateralOffset * sideMultiplier;
    let offsetY = Math.sin(offsetAngle) * lateralOffset * sideMultiplier;
    
    AddShots(
      player_X + offsetX,
      player_Y + offsetY,
      [angles[a]],
      [shot_Speed],
      [diameters[a]],
      0,
      shot_Penetration
    );
  }
  
  alternatingFireSide = (alternatingFireSide + 1) % 2;
}

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
    
    AddShots(
      player_X + offsetX,
      player_Y + offsetY,
      [angles[a]],
      [shot_Speed],
      [diameters[a]],
      0,
      shot_Penetration
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
  let rotated = RotatePoint(cannon_Side[cannonIndex] === "left" ? -60 : 60, 0, player_Rotation);
  let actualX = player_X + rotated.x;
  let actualY = player_Y + rotated.y;
  
  let target = GetNearestEnemy(actualX, actualY, enemies);
  if (!target) return; // no target
  
  // Access the enemy position using the returned indices
  let targetX = enemies[target.typeIndex].x[target.enemyIndex];
  let targetY = enemies[target.typeIndex].y[target.enemyIndex];
  
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
  
  AddShots(actualX, actualY, angles, speeds, diameters, 2, shot_Penetration);
  playSound('shotcannon');
}


// Main cnnnon firing
function FireCannonShots() {
  if (!game_State) return;

  for (let i = 0; i < cannons; i++) {
    if (cannon_CooldownTimer[i] <= 0) {
      let cannonX = cannon_Side[i] === "left" ? player_X - 60 : player_X + 60;
      let cannonY = player_Y;
      FireCannonBurst(cannonX, cannonY, i);
      cannon_CooldownTimer[i] = cannon_Cooldown;
    }
  }
}

// Blaster Shots
function FireBlasterShot(blasterX, blasterY, blasterIndex) {
  if (!game_State) return;
  playSound('shotblaster');

  const blasterCornerDistance = 25;
  const blasterPositions = [
    {x: blasterCornerDistance, y: blasterCornerDistance},
    {x: -blasterCornerDistance, y: -blasterCornerDistance}
  ];

  let rotated = RotatePoint(blasterPositions[blasterIndex].x, blasterPositions[blasterIndex].y, player_Rotation);
  let actualX = player_X + rotated.x;
  let actualY = player_Y + rotated.y;

  let baseAngle = atan2(mouseY - actualY, mouseX - actualX);
  let spread = random(-6, 6) * PI / 180;

  AddShots(actualX, actualY, [baseAngle + spread], [blaster_Speed], [blaster_Diameter], 3, shot_Penetration);
}

// `` -- __ Motion && Position __ -- `` \\

// Moves the "bullet" objects
function MoveShot() {
  for (let i = shot_X.length - 1; i >= 0; i--) {
    shot_X[i] += shot_xDistance[i];
    shot_Y[i] += shot_yDistance[i];
    // Apply wave pattern if active
    if (shot_WavePattern[i] === 1) {
      let baseAngle = atan2(shot_yDistance[i], shot_xDistance[i]);
      let speed = sqrt(shot_xDistance[i]**2 + shot_yDistance[i]**2);
      
      // Calculate the wave offsets
      let waveOffset = Math.sin(shot_DistanceTraveled[i] * shot_WaveFrequency[i]) * shot_WaveAmplitude[i];
      let perpAngle = baseAngle + HALF_PI;
      
      // Apply wave to position
      shot_X[i] += Math.cos(baseAngle) * speed + Math.cos(perpAngle) * waveOffset;
      shot_Y[i] += Math.sin(baseAngle) * speed + Math.sin(perpAngle) * waveOffset;
      
      shot_DistanceTraveled[i] += speed;
    } else {
      // Normal line/straight movement
      shot_X[i] += shot_xDistance[i];
      shot_Y[i] += shot_yDistance[i];
    }    
    shot_Timer[i]++;
    
    // Used to reflect projectiles and reveres direction 
    if (reflect) {
      if (shot_Timer[i] > shot_Duration) {
        SpliceShot(i);
      } else {
        if (shot_X[i] <= 10) {
          shot_X[i] = 10;                 
          shot_xDistance[i] *= -1;       
        } else if (shot_X[i] >= width - 10) {
          shot_X[i] = width - 10;
          shot_xDistance[i] *= -1;
        }
        if (shot_Y[i] <= 60) {
          shot_Y[i] = 60;
          shot_yDistance[i] *= -1;
        } else if (shot_Y[i] >= height - 10) {
          shot_Y[i] = height - 10;
          shot_yDistance[i] *= -1;
        }
      }

    } else {
      if (shot_X[i] < -50 || shot_X[i] > width + 50 ||
          shot_Y[i] < -50 || shot_Y[i] > height + 50) {
        SpliceShot(i);
      }
    }

    fill(255, 200, 50);
    let currentDiameter = shot_Diameter_Array[i] || shot_Diameter;
    let source = shot_SourceType[i] || 0;  
    if (source === 1) {      
      let endX = shot_X[i] + shot_xDistance[i] * 2;
      let endY = shot_Y[i] + shot_yDistance[i] * 2;
      stroke(0, 255, 255);  
      strokeWeight(2);
      line(shot_X[i], shot_Y[i], endX, endY);
      noStroke();

    } else if (source === 2) {  
      square(shot_X[i], shot_Y[i], currentDiameter);

    } else if (source === 3) {  
      let endX = shot_X[i] + shot_xDistance[i] * 3;
      let endY = shot_Y[i] + shot_yDistance[i] * 3;
      stroke(0, 255, 0);  
      strokeWeight(3);
      line(shot_X[i], shot_Y[i], endX, endY);
      noStroke();

    } else if (source === 4) {  
      strokeWeight(2);
      let r = 200;
      let g = 100 + shot_Speed * 6;
      let b = 50;
      stroke(g, b, r);
      fill(r, g, b);
      
      // Make the shapes oblong ellipse with a sort of "glow" look to them instead of using defaul ship shot 
      let angle = atan2(shot_yDistance[i], shot_xDistance[i]);
      push();
      translate(shot_X[i], shot_Y[i]);
      rotate(angle);
      ellipse(0, 0, currentDiameter * 1.6, currentDiameter * 0.7);  
      pop();
    }
     else { 

      if (shot_Type === 0) {
        let r = 80;
        let g = 40 + shot_Speed * 3;
        let b = 100 + shot_Speed * 6;
        stroke(r + 160, g, b + 20);
        strokeWeight(3);
        fill(r, g, b); 
        circle(shot_X[i], shot_Y[i], currentDiameter);
      } else if (shot_Type === 1) {
        strokeWeight(1);
        let r = 80 + shot_Speed * 8;
        let g = 100 + shot_Speed * 4;
        let b = 40;
        stroke(b, r, g);
        fill(r, g, b);         
        square(shot_X[i], shot_Y[i], currentDiameter);

      } else if (shot_Type === 2) {
        strokeWeight(2)   
        let r = 40;
        let g = 200 - shot_Speed * 6;
        let b = 100  + shot_Speed * 4;
        stroke(g, b, r);
        fill(r, g, b);                 
         let endX = shot_X[i] + shot_xDistance[i] * 1.25;  // Not sure if I like the lines getting longer based on speed
         let endY = shot_Y[i] + shot_yDistance[i] * 1.25;

        // let lineLength = 44;
        // let angle = atan2(shot_yDistance[i], shot_xDistance[i]);
        // let endX = shot_X[i] + cos(angle) * lineLength;
        // let endY = shot_Y[i] + sin(angle) * lineLength;
        line(shot_X[i], shot_Y[i], endX, endY);
        noStroke();
      } 
        else if (shot_Type === 3) {
        strokeWeight(2);
        let r = 150 + shot_Speed * 4;
        let g = 80 + shot_Speed * 3;
        let b = 200 - shot_Speed * 2;
        stroke(r, g, b);
        fill(r, g, b);
        circle(shot_X[i], shot_Y[i], currentDiameter);
      }
    }

    if (shot_Timer[i] > shot_Duration ||
      shot_X[i] < -50 || shot_X[i] > width + 50 ||
      shot_Y[i] < -50 || shot_Y[i] > height + 50) {
      SpliceShot(i);
    }
  }
  shot_CurrentAmount = shot_X.length;
}

// Moves obstacles and other floaty things
function MoveObs() { 
  if (game_State === true) {
    // Using frame time to randomize speeds
    if (frame_Time >= 140) {
      for (var i = 0; i < disc_X.length; i++) {
        disc_XSpeed[i] = (Math.floor(Math.random() * 8) +  - 4);
        disc_YSpeed[i] = (Math.floor(Math.random() * 8) +  - 4);
        chip_XSpeed[i] = (Math.floor(Math.random() * 8) +  - 4);
        chip_YSpeed[i] = (Math.floor(Math.random() * 8) +  - 4);
      }
      frame_Time = 0; 
    }

    for (var i = 0; i < disc_X.length; i++) {
      disc_X[i] += disc_XSpeed[i];
      disc_Y[i] += disc_YSpeed[i];

      if (disc_X[i] > width)  disc_X[i] = 0;     
      if (disc_X[i] < 0)      disc_X[i] = width;  
      if (disc_Y[i] > height) disc_Y[i] = 51;     
      if (disc_Y[i] < 50)     disc_Y[i] = height ;
    }

    for (var i = 0; i < chungusjr_X.length; i++) {
      chungusjr_X[i] += chungusjr_XSpeed[i];
      chungusjr_Y[i] += chungusjr_YSpeed[i];

      if (chungusjr_X[i] > width)  chungusjr_X[i] = 0;     
      if (chungusjr_X[i] < 0)      chungusjr_X[i] = width;  
      if (chungusjr_Y[i] > height) chungusjr_Y[i] = 51;     
      if (chungusjr_Y[i] < 50)     chungusjr_Y[i] = height ;
    }    

    for (var i = 0; i < chungus_X.length; i++) {
      chungus_X[i] += chungus_XSpeed[i];
      chungus_Y[i] += chungus_YSpeed[i];

      if (chungus_X[i] > width)  chungus_X[i] = 0;     
      if (chungus_X[i] < 0)      chungus_X[i] = width;  
      if (chungus_Y[i] > height) chungus_Y[i] = 51;     
      if (chungus_Y[i] < 50)     chungus_Y[i] = height ;
    }    
    // OH LAWD HE COMIN!
    for (var i = 0; i < chungussr_X.length; i++) {
      chungussr_X[i] += chungussr_XSpeed[i];
      chungussr_Y[i] += chungussr_YSpeed[i];

      if (chungussr_X[i] > width)  chungussr_X[i] = 0;     
      if (chungussr_X[i] < 0)      chungussr_X[i] = width;  
      if (chungussr_Y[i] > height) chungussr_Y[i] = 51;     
      if (chungussr_Y[i] < 50)     chungussr_Y[i] = height ;
    }        

    for (var i = 0; i < chip_X.length; i++) {
      chip_X[i] += chip_XSpeed[i];
      chip_Y[i] += chip_YSpeed[i];

      if (chip_X[i] > width)  chip_X[i] = 0;    
      if (chip_X[i] < 0)      chip_X[i] = width; 
      if (chip_Y[i] > height) chip_Y[i] = 51;    
      if (chip_Y[i] < 50)     chip_Y[i] = height; 
    }

    for (var i = 0; i < dia_X.length; i++) {
      dia_X[i] += dia_XSpeed[i];
      dia_Y[i] += dia_YSpeed[i];

      if (dia_X[i] > width - 10)  {dia_X[i] = width - 10;dia_XSpeed[i] *= -1;}  
      if (dia_X[i] < 10)          {dia_X[i] = 10;dia_XSpeed[i] *= -1}         
      if (dia_Y[i] > height - 10) {dia_Y[i] = height - 10; dia_YSpeed[i] *= -1} 
      if (dia_Y[i] < 60)          {dia_Y[i] = 60; dia_YSpeed[i] *= -1;}        
    } 

    for (var i = 0; i < minidia_X.length; i++) {
      minidia_X[i] += minidia_XSpeed[i];
      minidia_Y[i] += minidia_YSpeed[i];

      if (minidia_X[i] > width - 10)  {minidia_X[i] = width - 10; minidia_XSpeed[i] *= -1;} 
      if (minidia_X[i] < 10)          {minidia_X[i] = 10; minidia_XSpeed[i] *= -1;}        
      if (minidia_Y[i] > height - 10) {minidia_Y[i] = height - 10; minidia_YSpeed[i] *= -1;}
      if (minidia_Y[i] < 60)          {minidia_Y[i] = 60; minidia_YSpeed[i] *= -1;}         
    }   

    for (var i = 0; i < lilfella_X.length; i++) {
      lilfella_X[i] += lilfella_XSpeed[i];
      lilfella_Y[i] += lilfella_YSpeed[i];

      if (lilfella_X[i] > width - 10)  {lilfella_X[i] = width - 10; lilfella_XSpeed[i] *= -1;} 
      if (lilfella_X[i] < 10)          {lilfella_X[i] = 10; lilfella_XSpeed[i] *= -1;}        
      if (lilfella_Y[i] > height - 10) {lilfella_Y[i] = height - 10; lilfella_YSpeed[i] *= -1;}
      if (lilfella_Y[i] < 60)          {lilfella_Y[i] = 60; lilfella_YSpeed[i] *= -1;}         
    }   

      for (var i = 0; i < grower_X.length; i++) {
        grower_X[i] += grower_XSpeed[i];
        grower_Y[i] += grower_YSpeed[i];

        if (grower_X[i] > width - 10) {grower_X[i] = width - 10;grower_XSpeed[i] *= -1;
            grower_XSpeed[i] += (grower_XSpeed[i] > 0 ? 1 : -1);
            grower_YSpeed[i] += (grower_YSpeed[i] > 0 ? 1 : -1);
            grower_Diameter[i] += 2;
        }
        if (grower_X[i] < 10) {grower_X[i] = 10;grower_XSpeed[i] *= -1;
            grower_XSpeed[i] += (grower_XSpeed[i] > 0 ? 1 : -1);
            grower_YSpeed[i] += (grower_YSpeed[i] > 0 ? 1 : -1);
            grower_Diameter[i] += 2;

        }
        if (grower_Y[i] > height - 10) {grower_Y[i] = height - 10;grower_YSpeed[i] *= -1;
            grower_XSpeed[i] += (grower_XSpeed[i] > 0 ? 1 : -1);
            grower_YSpeed[i] += (grower_YSpeed[i] > 0 ? 1 : -1);
            grower_Diameter[i] += 2;

        }
        if (grower_Y[i] < 60) {grower_Y[i] = 60;grower_YSpeed[i] *= -1;
            grower_XSpeed[i] += (grower_XSpeed[i] > 0 ? 1 : -1);
            grower_YSpeed[i] += (grower_YSpeed[i] > 0 ? 1 : -1);
            grower_Diameter[i] += 2;

        }
        grower_XSpeed[i] = Math.max(Math.min(grower_XSpeed[i], max_Speed), -max_Speed);
        grower_YSpeed[i] = Math.max(Math.min(grower_YSpeed[i], max_Speed), -max_Speed);
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

function MovePlayer() {   // Handles movement of objects and frame timer! We be movin' mon ((Renamed for better clarity))
  if (game_State === true) {  
    if (stage === 1){
      if (player_X >= width-15)         {player_X = width-15;};
      if (player_X <= width - width +5) {player_X = 8;};
      if (player_Y >= height -15)       {player_Y = height -20;};
      if (player_Y <= 60)               {player_Y = 61;};
    } 
      if (keyIsDown(SHIFT)) {currentSpeed = 5 / 2; is_Crawling = true;} 
        else {currentSpeed = 5; is_Crawling = false;
    }
      if (keyIsDown(s)) {player_Y += currentSpeed;} else if (keyIsDown(w)) {player_Y -= currentSpeed;};
      if (keyIsDown(d)) {player_X += currentSpeed;} else if (keyIsDown(a)) {player_X -= currentSpeed;};
  frame_Time++; 
  time++;
  diameter += grow_Speed;   // Makin dem gettin big' n small  - gives a sublt "Floating" vibe to the ship
    if (diameter >= 58 || diameter <= 55) {
    grow_Speed *= -1; 
      }
  }
}

// Gets key inputs for abilitis 
function keyPressed() {
  // Menu navigation
  if (game_Screen === "menu" && key === ' ') {
    playSound('gamestart');
    StartGame();
    pauseKeyPressed = false;
  }  
  // Pause toggle
  if (game_Screen === "playing" && (key === 'z' || key === 'Z') && !pauseKeyPressed) {
    console.log("Menu Opened");
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
    time = 0;
    frame_Time = 0;
    currentWave = 0;
    waveStarted = false;
    
    // Initialize player
    player_X = width / 2;
    player_Y = height / 2;
    player_Rotation = 0;
    player_TargetRotation = 0;
    
    // Reset game variables
    ResetAllArrays();
    BuildEnemiesArray();
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
  }
  
  // MENU button
  if (mouseX > width - 350 && mouseX < width - 350 + 155 && mouseY > buttonY && mouseY < buttonY + 50){
    game_Screen = "menu";
    stage = 1;
    ResetAllArrays();
    BuildEnemiesArray();
  }
}
    // Game Over RESTART button
  if (game_Screen === "gameOver") {
    if (DrawButton(width / 2 - 80, height / 2 + 120, 160, 50, "RESTART")) {
      RestartGame();
    }
  }
}

// Rudimentary collision checker used in the check collisionS
function CheckCollision(x1, y1, diameter1, x2, y2, diameter2) {
  let distance = dist(x1, y1, x2, y2);
  radius1 = diameter1 / 2;
  radius2 = diameter2 / 2;
  
  if (distance < radius1 + radius2) {
    return true; 
  }
  return false; 
}

// Function for checking if immune and doing damage/collision rather than having the same block of code over and over and over
function DamageCheckByType(enemyType) {
  if (!immune) {
    let actualDamage = HitShield(enemyType);
    playSound('playerhit');
    immune = true;
    hit_Timer = 60;
    player_Health -= actualDamage;
  }
}

function CheckCollisions() {
  // Check player vs DISC obstacles
  for (i = 0; i < disc_X.length; i++) {
    if (CheckCollision(player_X, player_Y, player_Hitbox, disc_X[i], disc_Y[i], disc_Diameter[i])) {
      console.log("Hit by disc!!");
      DamageCheckByType(ENEMY_TYPES.DISC);
  }
}
  // Check player vs various chungus obstacles
  for (i = 0; i < chungusjr_X.length; i++) {
    if (CheckCollision(player_X, player_Y, player_Hitbox, chungusjr_X[i], chungusjr_Y[i], chungusjr_Diameter[i])) {
      console.log("Hit by Lil Chungus!!");
      DamageCheckByType(ENEMY_TYPES.CHUNGUSJR);      
  }
}
  for (i = 0; i < chungus_X.length; i++) {
    if (CheckCollision(player_X, player_Y, player_Hitbox, chungus_X[i], chungus_Y[i], chungus_Diameter[i])) {        
    console.log("Hit by Chungus!!!");
    DamageCheckByType(ENEMY_TYPES.CHUNGUS);  
  }
}  // oh lawwwwdd
  for (i = 0; i < chungussr_X.length; i++) {
      if (CheckCollision(player_X, player_Y, player_Hitbox, chungussr_X[i], chungussr_Y[i], chungussr_Diameter[i])) {         
      console.log("Hit by Big Chungus!!!");
     DamageCheckByType(ENEMY_TYPES.CHUNGUSSR); 
  }
}
  // Wheres my chippy?
  for (i = 0; i < chip_X.length; i++) {
    if (CheckCollision(player_X, player_Y, player_Hitbox, chip_X[i], chip_Y[i], chip_Diameter[i])) {        
    console.log("Hit by Chippy!!");
    DamageCheckByType(ENEMY_TYPES.CHIP); 
  }
}
  // Player vs Diamond
  for (i = 0; i < dia_X.length; i++) {
    if (CheckCollision(player_X, player_Y, player_Hitbox, dia_X[i], dia_Y[i], dia_Diameter[i])) {      
    console.log("Hit by Diamond!!");
    DamageCheckByType(ENEMY_TYPES.DIA); 
  }
}  
  // Player vs Mini Diamaond
  for (i = 0; i < minidia_X.length; i++) {
    if (CheckCollision(player_X, player_Y, player_Hitbox, minidia_X[i], minidia_Y[i], minidia_Diameter[i])) {      
    console.log("Hit by Mini Diamond!!");
    DamageCheckByType(ENEMY_TYPES.MINIDIA); 
  }
}    
  // Player vs Growers
    for (i = 0; i < grower_X.length; i++) {
    if (CheckCollision(player_X, player_Y, player_Hitbox, grower_X[i], grower_Y[i], grower_Diameter[i])) {   
    DamageCheckByType(ENEMY_TYPES.GROWER); 
    }
  }   
  // Player vs lilfella
    for (i = 0; i < lilfella_X.length; i++) {
    if (CheckCollision(player_X, player_Y, player_Hitbox, lilfella_X[i], lilfella_Y[i], lilfella_Diameter[i])) {   
    DamageCheckByType(ENEMY_TYPES.lilfella); 
    }
  }    
}  

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
        // Call the shared kill function
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


function CheckShotCollisions() {
  for (let i = shot_X.length - 1; i >= 0; i--) {
    // Handle all enemy types
                 //    X --   Y --    Diameter --    Health --     xSpeed --    ySpeed --  Gold --  Exp --  HitSound --  death sound -- 
    handleCollision(disc_X, disc_Y, disc_Diameter, disc_Health, disc_XSpeed, disc_YSpeed, 5, 10 + Level, 'hitdisc', 'deathdisc', i, "disc");
    handleCollision(chungusjr_X, chungusjr_Y, chungusjr_Diameter, chungusjr_Health, chungusjr_XSpeed, chungusjr_YSpeed, 12, 8, 'hitchungusjr', 'deathchungusjr', i);
    handleCollision(chungus_X, chungus_Y, chungus_Diameter, chungus_Health, chungus_XSpeed, chungus_YSpeed, 20, 16, 'hitchungus', 'deathchungus', i);
    handleCollision(chungussr_X, chungussr_Y, chungussr_Diameter, chungussr_Health, chungussr_XSpeed, chungussr_YSpeed, 40, 28, 'hitchungussr', 'deathchungussr', i);
    handleCollision(dia_X, dia_Y, dia_Diameter, dia_Health, dia_XSpeed, dia_YSpeed, 4, 3, 'hitdiamond', 'deathdiamond', i, "diamond");
    handleCollision(minidia_X, minidia_Y, minidia_Diameter, minidia_Health, minidia_XSpeed, minidia_YSpeed, 2, 1, 'hitminidiamond', 'deathminidiamond', i);
    handleCollision(grower_X, grower_Y, grower_Diameter, grower_Health, grower_XSpeed, grower_YSpeed, 5, 8, 'hitgrower', 'deathgrower', i);
    handleCollision(lilfella_X, lilfella_Y, lilfella_Diameter, lilfella_Health, lilfella_XSpeed, lilfella_YSpeed, 5, 8, 'hitgrower', 'deathgrower', i);


    // Chip reflection
    for (let ch = 0; ch < chip_X.length; ch++) {
      let halfSize = chip_Diameter[ch] / 2;
      let distX = shot_X[i] - chip_X[ch];
      let distY = shot_Y[i] - chip_Y[ch];

      if (CheckCollision(shot_X[i], shot_Y[i], shot_Diameter_Array[i], chip_X[ch], chip_Y[ch], chip_Diameter[ch])) {
        playSound('bounce');

        if (Math.abs(distX) > Math.abs(distY)) {
          shot_X[i] = chip_X[ch] + Math.sign(distX) * (halfSize + shot_Diameter_Array[i] / 2);
          shot_xDistance[i] *= -1;
        } else {
          shot_Y[i] = chip_Y[ch] + Math.sign(distY) * (halfSize + shot_Diameter_Array[i] / 2);
          shot_yDistance[i] *= -1;
        }
      }
    }

    //  Reset per-shot hit cooldown
    if (shot_CollisionCooldown[i] > 0) {
      shot_CollisionCooldown[i]--;
      if (shot_CollisionCooldown[i] === 0) {
        shot_HitEnemies[i] = [];
      }
    }
  }
}

// Splice function for shots 
function SpliceShot(index) {
  if (shot_CollisionCooldown[index] > 0) {
    shot_CollisionCooldown[index]--;
    return;}
  
  shot_Penetration_Array[index]--;
  shot_CollisionCooldown[index] = COLLISION_COOLDOWN; 
  if (shot_Penetration_Array[index] <= 0) {
    shot_X.splice(index, 1);
    shot_Y.splice(index, 1);
    shot_xDistance.splice(index, 1);
    shot_yDistance.splice(index, 1);
    shot_Timer.splice(index, 1);
    shot_Diameter_Array.splice(index, 1);
    shot_SourceType.splice(index, 1);
    shot_Penetration_Array.splice(index, 1);
    shot_CollisionCooldown.splice(index, 1);
    shot_HitEnemies.splice(index, 1);
    shot_WavePattern.splice(index, 1);    
    shot_WaveAmplitude.splice(index, 1);  
    shot_WaveFrequency.splice(index, 1);    
    shot_DistanceTraveled.splice(index, 1); 
    shot_PowerArray.splice(i, 1);
  }
}

// Wave setter and spawner
function handleWaveSpawning() {
  if (currentWave >= waves.length) return;

  const wave = waves[currentWave];
  const framesSinceStart = time - waveStartTime; 
  for (let spawn of wave.spawns) {
    if (!spawn.positions) {
      spawn.positions = getSpawnPositions(spawn.side, spawn.amount);
    }

    for (let i = 0; i < spawn.amount; i++) {
      const spawnFrame = i * spawn.delay;      
      if (framesSinceStart === spawnFrame) {
        const [x, y] = spawn.positions[i];
        if (spawn.type === "minidia") SpawnMinidia(x, y, 40);
        else if (spawn.type === "disc") SpawnDisc(x, y);
        else if (spawn.type === "grower") SpawnGrower(x, y, spawn.side);
        else if (spawn.type === "chip") SpawnChip(x, y); 
        else if (spawn.type === "chungusjr") SpawnChungusJr(x, y); 
        else if (spawn.type === "chungus") SpawnChungus(x, y); 
        else if (spawn.type === "chungussr") SpawnChungusSr(x, y);                         
        else if (spawn.type === "dia") SpawnDia(x, y, spawn.side);  
        else if (spawn.type === "lilfella") SpawnLilFella(x, y, spawn.side);          

//        console.log("Spawned " + spawn.type + " #" + (i+1) + " of " + spawn.amount);
      }
    }
  }

  const maxDuration = Math.max(...wave.spawns.map(s => s.amount * s.delay));
  if (framesSinceStart > maxDuration + 60) {
    waveStarted = false;
    currentWave++;
//    console.log("Wave " + currentWave + " spawning finished");
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
function getCurrentValue(name) {
  switch(name) {
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
  
  switch(powerup.name) {
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
function UnlockAbility(abilityName) {
  // Prevent duplicates in current run
  if (abilities.length < 13 && !abilities.includes(abilityName)) {
    abilities.push(abilityName);
    console.log("Unlocked ability: " + abilityName);

    if (!SaveData.UnlockedAbilities.includes(abilityName)) {
      SaveData.UnlockedAbilities.push(abilityName);
      SaveGame();
    }

    return;
  }

  // Already have ability or hit limit
  if (abilities.length >= 16) {
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

// Spawn Wave functions
function SpawnWaves() {
  if (currentWave >= waves.length) return;

// Start wave based on 'time' instead of frameCount
  if (!waveStarted && time >= waves[currentWave].startTime * 60) {
//    console.log("Wave " + (currentWave + 1) + " starting at t=" + time + "s");
    waveStartTime = time; // Using time instead of frame counts
    waveStarted = true;
    for (let spawn of waves[currentWave].spawns) {
      spawn.positions = null;
    }
  }

  if (waveStarted) {
    handleWaveSpawning();
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
  push();

  let pulseAmount = sin(frameCount * 0.05) * 3; // I have no idea how this math works.
  
  fill(60, 60, 200, 40);
  stroke(0, 255, 100, 75);  
  strokeWeight(2);
  circle(player_X, player_Y, player_Hitbox + pulseAmount);
  
  // creates a brighter outline
  stroke(100, 255, 150, 75);
  strokeWeight(1);
  circle(player_X, player_Y, player_Hitbox + pulseAmount);
  pop();
}
// Creates the visual display for the shield being active or not.
function DrawShieldHUD() {
  fill(100, 200, 100);
  textAlign(LEFT);
  textSize(14);
  
  // Shield status
  if (shield_Active && !shield_Hit) {
    fill(100, 255, 100); 
    text("SHIELD: ACTIVE", 10, 90);
  } else if (shield_Hit) {
    fill(255, 100, 100);  
    let percentLeft = (shield_Cooldown_Timer / shield_Cooldown) * 100;
    text("SHIELD: RECHARGING " + Math.floor(percentLeft) + "%", 10, 90);
  } else {
    fill(150, 150, 0); 
    let percentLeft = (shield_Cooldown_Timer / shield_Cooldown) * 100;
    text("SHIELD: COOLDOWN " + Math.floor(percentLeft) + "%", 10, 90);
  }
  
  // Show damage absorbed by the
  if (shield_Display_Timer > 0) {
    fill(100, 255, 100);
    textSize(16);
    textStyle(BOLD);
    text("Shield Absorbed: " + shield_Damage_Display, 10, 120);
  }
}

// draws updates to the stat/hud in real time
function UpdateHud(){
  supports = bits + cannons + blasters;
  fill(200, 75, 75);
  stroke(155, 290, 155,);
  strokeWeight(3);
  textSize(20);

  //Updates Health info
  fill(200, 75, 75);
  stroke(225, 225, 120,);
  strokeWeight(4);
  textSize(35);
  textStyle(BOLD);
  text("Health: " + player_Health, 400, 34);
  if (player_Health <= 0){
    playSound('death');
    game_Screen = "gameOver";
    game_State = false;
  }

  // Updates Level info
  fill(200, 75, 75);
  stroke(225, 225, 120,);
  strokeWeight(4);
  textSize(34);
  textStyle(BOLD);
  text("Level: " + Level, 220, 34 );
  textSize(22);
  text("Exp: " + Exp, 5, 15);
  text("Next: " + (exp_Next - Exp), 5, 39);
      if (Exp >= exp_Next){
    LevelUp();
  }

  strokeWeight(3);
  textSize(22);
  if (supports === max_Supports){
  text("MAX SUPPORTS", 600, 34); 
  } else if (supports < max_Supports) text("Active Supports: " + supports, 600, 34); 
  textSize(22);
  text("Weapon: " + weapon_Type, 1100, 14);   
  text("Gold: " + Gold, 1350, 14);   

  if (abilities.length > 0) {
    let currentAbility = abilityList[abilities[currentAbilityIndex]];
    let cdPercent = abilityOnCooldown ? Math.floor((abilityCooldownTimer / currentAbility.cooldown) * 100) : 0;
    text("Ability: " + currentAbility.name, 1100, 40);
    text("CD: " + cdPercent + "%", 1100, 65);
  } else {
    text("Ability: None", 1100, 40);
  }
}

// Hit cooldown timer so you don't die instantly the moment something touches you.
function Immune(){
  if (immune && game_State){
  fill(200, 75, 75);
  stroke(225, 225, 120,);
  strokeWeight(2);
  textSize(16);
  textStyle(BOLD);
  text("IMMUNE: " + hit_Timer, player_X -36, player_Y - 18);
  hit_Timer--;
    if (hit_Timer === 0){
      immune = false;
    }
  } 
}

function VictoryMessage(){
  if (exp >= 5000){
    game_State = false;
    fill(200, 200, 200);
    stroke(5);
    textSize(26);
    text("Victory!!", width/2-50, height/2-50);
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
function PaintBackground(){
  if (stage ===1){
  background(15, 10, 5);
  }
  else if (stage ===2){
  background(25, 20, 15);
  }
    else if (stage ===3){
  background(30, 40, 30);
  }
}

// Saves/updates gold values
function AddGold(amount) {
  Gold += amount;
  SaveData.Gold = Gold;

  SaveData.TotalGold += amount;
  totalGold = SaveData.TotalGold;

  SaveGame();
}

// Loads the saved game information
function LoadGame() {
  let data = localStorage.getItem("ShootyMcBulletGame");
  if (!data) return;  // No save exists yet
  
  SaveData = JSON.parse(data);

  Gold = SaveData.Gold;
  totalGold = SaveData.TotalGold;
}


// Creates the main menu screen when the game is first loaded
function DrawMenuScreen() {
  background(20, 20, 40);
  LoadGame();
  
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(80);
  textStyle(BOLD);
  text("SHOOT THE THINGS!", width / 2, height / 3);
  
  textSize(24);
  textStyle(NORMAL);
  text("Click START to begin, or press SPACE", width / 2, height / 2 - 50);
  
  // Draw START button
  DrawButton(width / 2 - 75, height / 2 + 50, 150, 60, "START");
  
  textSize(24);
  fill(150);
  stroke(20, 200, 175);
  strokeWeight(2)
  text("Shoot the bad guys, don't get hit!", width / 2, height - 100);
  text("Use WASD to move, Click to Shoot, Shift to Crawl. Q and E to cycle between abilities, F to use ability, Z to open Menu.", width / 2, height - 60);
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
    rect(x - boxSize/2, shipY - boxSize/2, boxSize, boxSize, 10);
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
  infoY += lineHeight +4 ;
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
    player_Speed: 5,
    basePlayerSpeed: 5, 

    shot_Power: 4,     
    shot_Speed: 26,      
    shot_Duration: 36,    
    shot_Count: 1,       
    shot_Diameter: 16,   
    shot_Penetration: 1,
    shot_Delay: 22,      

    ship_Info: "A balanced ship with a standard single-shot blaster.",
    ship_Info2: "Shot Count fires projectiles in a radial pattern.",
    ship_Info3: "Scales well, simple and effective, highly accurate."
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
    ship_Info3: "Scales strong with Shot Count, Cooldown and Speed."    
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
    player_Speed: 4,  
    basePlayerSpeed: 4, 

    shot_Power: 1,    
    shot_Speed: 18,  
    shot_Duration: 36, 
    shot_Count: 2,  
    shot_Diameter: 23, 
    shot_Penetration: 1,
    shot_Delay: 27,

    burstCooldown: 80,

    ship_Info: "Slower ship, heavy fire power.",
    ship_Info2: "Fires double shot count, slower speed and fire rate.",
    ship_Info3: "Smaller diameter shots, less accurate."    
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
    player_Speed: 5,  
    basePlayerSpeed: 5, 

    shot_Power: 2,    
    shot_Speed: 20,  
    shot_Duration: 22, 
    shot_Count: 1,  
    shot_Diameter: 14, 
    shot_Penetration: 0,
    shot_Delay: 30,

    burstCooldown: 50,

    ship_Info: "The OP ship.",
    ship_Info2: "Shit early game, but scale god.",
    ship_Info3: "Fires projectiles in an array in front of the ship."    
  }  
};

function ApplyShipStats() {
  const stats = shipStats[selectedShip];
  currentShip = selectedShip;                // NEW: track current ship
  
  // ----- SHIP BASE STATS -----
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
  shipSelected = stats.name;

  baseMaxHealth = stats.baseMaxHealth;
  baseShieldValue = stats.baseShieldValue;

  // ----- LOAD PERSISTENT SHIP LEVEL -----
  if (SaveData.Ships && SaveData.Ships[currentShip]) {
    Level = SaveData.Ships[currentShip].level;
    Exp   = SaveData.Ships[currentShip].exp;
  } else {
    // If missing in save file, initialize it
    SaveData.Ships[currentShip] = { level: 1, exp: 0 };
    SaveGame();
  }

  // ----- AUTO-UNLOCK BASE ABILITY FOR SHIP -----
  if (shipSelected === "Fox")              UnlockAbility("autofirebarrage");  
  else if (shipSelected === "Model xr-52") UnlockAbility("spiralshot");
  else if (shipSelected === "Imperial")    UnlockAbility("decimator");
  else if (shipSelected === "Jackhammer")  UnlockAbility("bomb");

  // ----- Weapon Type Label -----
  if (shot_Type === 0)      weapon_Type = "Radial";
  else if (shot_Type === 1) weapon_Type = "Scatter";
  else if (shot_Type === 2) weapon_Type = "Auto";
  else if (shot_Type === 3) weapon_Type = "Array";

  // ----- SAVE WHICH SHIP WAS LAST CHOSEN -----
  SaveData.lastShip = currentShip;
  SaveGame();
}


// Update to the ship selection screen
function HandleShipSelection() {
  if (keyIsDown(LEFT) && shipSelectionDelayCounter <= 0) {
    selectedShip--;
    playSound('select');
    if (selectedShip < 1) selectedShip = 4;
    SaveData.lastShip = selectedShip;   
    SaveGame();                         
    shipSelectionDelayCounter = 10;
  }

  if (keyIsDown(RIGHT) && shipSelectionDelayCounter <= 0) {
    selectedShip++;
    playSound('select');
    if (selectedShip > 4) selectedShip = 1;
    SaveData.lastShip = selectedShip;   
    SaveGame();                         
    shipSelectionDelayCounter = 10;
  }

  // number keys
  if (keyIsPressed) {
    if (key === '1') selectedShip = 1;
    if (key === '2') selectedShip = 2;
    if (key === '3') selectedShip = 3;
    if (key === '4') selectedShip = 4;
    SaveData.lastShip = selectedShip;   
    SaveGame();                         
  }

  // mouse click ship selection
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
        SaveData.lastShip = selectedShip;   
        SaveGame();                         

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
  text("Power: " + shot_Power, startX + 10, statsY); statsY += statsSpacing -8;
  textSize(14);
  text("    The amount of damage inflicted by your shots.", startX + 10, statsY); statsY += statsSpacing;
  textSize(32);
  text("Count: " + shot_Count, startX + 10, statsY); statsY += statsSpacing -8;
  textSize(14);
  text("    The number of shots to be fired.", startX + 10, statsY); statsY += statsSpacing;
  textSize(32);
  text("Speed: " + shot_Speed, startX + 10, statsY); statsY += statsSpacing -8;
  textSize(14);
  text("    The speed at which your shots travel over their duration.", startX + 10, statsY); statsY += statsSpacing;
  textSize(32);
  text("Shot Delay: " + shot_Delay, startX + 10, statsY); statsY += statsSpacing -8;
  textSize(14);
  text("    The time between each shot cycle.", startX + 10, statsY); statsY += statsSpacing;
  textSize(32);
  text("Duration: " + shot_Duration, startX + 10, statsY); statsY += statsSpacing -8;
  textSize(14);
  text("    The amount of time your shots persist.", startX + 10, statsY); statsY += statsSpacing;
  textSize(32);
  text("Penetration: " + shot_Penetration, startX + 10, statsY); statsY += statsSpacing -8;
  textSize(14);
  text("    Amount of targest your shots can pierce.", startX + 10, statsY); statsY += statsSpacing;
  textSize(32);
  text("Diameter: " + shot_Diameter, startX + 10, statsY); statsY += statsSpacing -8;
  textSize(14);
  text("    The size of your projectiles.", startX + 10, statsY); statsY += statsSpacing;
  textSize(32);
  text("Cooldown: " + cooldown_Reduction, startX + 10, statsY); statsY += statsSpacing -8;
  textSize(14);
  text("    The modifier to ability recharge speed.", startX + 10, statsY); statsY += statsSpacing;

  fill(200, 200, 255);
  textSize(32);
  text("Supports:", startX + 350, statsY2);
  statsY2 += statsSpacing;  
  fill(255);
  if (bits === max_Bits){text("MAX BITS!", startX + 360, statsY2); statsY2 += statsSpacing;} else{
  text("Bits: " + bits + " / " + max_Bits, startX + 360, statsY2); statsY2 += statsSpacing;}
  if (cannons === max_Cannons){text("MAX CANNONS!", startX + 360, statsY2); statsY2 += statsSpacing;} else{
  text("cannons: " + cannons + " / " + max_Cannons, startX + 360, statsY2); statsY2 += statsSpacing;}
  if (blasters === max_Blasters){text("MAX BLASTERS!", startX + 360, statsY2); statsY2 += statsSpacing;} else{
  text("Blasters: " + blasters + " / " + max_Blasters, startX + 360, statsY2);}
}

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
  
  // Draw smaller grid
  const gridStartX = startX;
  const gridStartY = startY + 50;
  const cellSize = 120;
  const cellSpacing = 5;
  const rows = attachmentGrid.length;
  const cols = attachmentGrid[0].length;
  
  const rowLabels = ['A', 'B', 'C', 'D'];
  
  if (hoveredAttachmentId !== null) {
    const attachment = attachmentList[hoveredAttachmentId];
    DrawAttachmentTooltipInBox(attachment);
  }

  for (let row = 0; row < rows; row++) {
    fill(200, 200, 255);
    textAlign(RIGHT, CENTER);
    textSize(10);
    text(rowLabels[row], gridStartX - 15, gridStartY + row * (cellSize + cellSpacing) + cellSize / 2);
    
    for (let col = 0; col < cols; col++) {
      const attachmentId = attachmentGrid[row][col];
      const x = gridStartX + col * (cellSize + cellSpacing);
      const y = gridStartY + row * (cellSize + cellSpacing);
      
      DrawAttachmentCellSmall(x, y, cellSize, attachmentId);
    }
  }
  
  // Column labels
  textAlign(CENTER, TOP);
  for (let col = 0; col < cols; col++) {
    fill(200, 200, 255);
    textSize(10);
    text(col + 1, gridStartX + col * (cellSize + cellSpacing) + cellSize / 2, gridStartY - 15);
  }
  noStroke();
  fill(200, 200, 255)

  // Equipped list
  const listY = gridStartY + rows * (cellSize + cellSpacing) + 20;
  fill(200, 200, 255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("EQUIPPED:", startX, listY);  
  
  textSize(18);
  fill(255);
  for (let i = 0; i < maxEquipped; i++) {
    if (equippedAttachments[i]) {
      textSize(18);
      const id = equippedAttachments[i];
      text((i + 1) + ". " + attachmentList[id].name, startX + 10, listY + 40 + i * 15);
    } else {
      fill(100);
      text((i + 1) + ". [Empty]", startX + 10, listY + 40 + i * 15);
      fill(255);
    }
  }
}

// Item tooltip for attachments
function DrawAttachmentTooltipInBox(attachment) {
  const boxX = width / 2 + 300;  
  const boxY = height /2 + 50;  
  const boxWidth = 370;
  const boxHeight = 80;
  const padding = 15;
  
  // Draws the border
  fill(0);  
  fill(40, 40, 80);
  stroke(150, 150, 200);
  strokeWeight(3);
  rect(boxX, boxY, boxWidth, boxHeight);
  
  // Draws the attachment name
  fill(150, 225, 220);
  stroke(20, 40, 20,);
  strokeWeight(2);
  textAlign(LEFT, TOP);
  textSize(18);
  textStyle(BOLD);
  text(attachment.name, boxX + padding, boxY + padding);
  
  // Draw the item info
  noStroke();
  fill(255);
  textSize(14);
  textStyle(NORMAL);
  text(attachment.itemInfo, boxX + padding, boxY + padding + 25, boxWidth - padding * 2);
}

function DrawAttachmentCellSmall(x, y, size, attachmentId) {
  const attachment = attachmentList[attachmentId];
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
      
      if (mouseX > x && mouseX < x + cellSize && mouseY > y && mouseY < y + cellSize) {
        const attachmentId = attachmentGrid[row][col];
        ToggleAttachment(attachmentId);
      }
    }
  }
}

// Lets you equip/unequip the attachments
function ToggleAttachment(attachmentId) {
  const attachment = attachmentList[attachmentId];  
  if (!attachments.includes(attachmentId)) {
    console.log("Must unlock first!");
    playSound('error');
    return;
  }  
  const equippedIndex = equippedAttachments.indexOf(attachmentId);
  
  if (equippedIndex > -1) {
    UnequipAttachment(equippedIndex);
    playSound('removeattachment');

  } else {
    if (equippedAttachments.length < maxEquipped) {
      EquipAttachment(attachmentId);
      playSound('equipattachment');

    } else {
      console.log("Equipment slots full!");
      playSound('error');
      DetermineFirePattern();
    }
  }
}

function EquipAttachment(attachmentId) {
  equippedAttachments.push(attachmentId);
  const attachment = attachmentList[attachmentId];
  
  // Apply all stat bonuses
  for (let statObj of attachment.stats) {
    ApplyStat(statObj.stat, statObj.value);
  }  
    // Apply conversions
  if (attachment.conversion) {
    ApplyConversion(
      attachment.conversion.fromStat, 
      attachment.conversion.toStat, 
      attachment.conversion.percentage
    );
  }

  console.log("Equipped: " + attachment.name);
  RecalculateConversions();
  DetermineFirePattern();
}

// Attachment handling 
function UnequipAttachment(slotIndex) {
  const attachmentId = equippedAttachments[slotIndex];
  const attachment = attachmentList[attachmentId];
  
  // Remove all stat bonuses
  for (let statObj of attachment.stats) {
    RemoveStat(statObj.stat, statObj.value);
  }
    // Remove conversions
  if (attachment.conversion) {
    RemoveConversion(
      attachment.conversion.fromStat, 
      attachment.conversion.toStat
    );
  }
  
  equippedAttachments.splice(slotIndex, 1);
  console.log("Unequipped: " + attachment.name);
  RecalculateConversions();
  DetermineFirePattern();
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
  PaintBackground();
  DrawObstacleZone();
  UpdateAbilityCooldown();
  UpdateBarrage();
  UpdateSpiral();
  UpdateDecimator()
  UpdateLightningBolt();
  UpdateSingularity();  
  UpdateItems();

  CreatePlayer();  
  MovePlayer();   
  CursorUpdate();
  UpdateSupports();
  UpdateShield();
  DrawShield();
  DrawShieldHUD();
  
  if (mouseIsPressed && game_State && mouseButton === LEFT) {
    FireCannonShots();
  }

  Shot();   
  MoveShot();

  CreateObs();      
  MoveObs();       
  CheckCollisions();
  
  CreateBorders();  
  UpdateHud();
  DrawBombExplosions();

  SpawnWaves();
  Immune();
  VictoryMessage();
  
  // Draw pause hint
  fill(100);
  textSize(14);
  textAlign(LEFT);
  text("Press Z to pause", 10, height - 20);
}

function DrawPauseScreen() {
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);
  
  DrawStatsScreen(60, 80);  
  DrawAttachmentsScreen(width / 2 + 50, 80);

  const buttonY = height - 80;
  DrawButton(width / 2 - 200, buttonY, 90, 50, "RESUME");
  DrawButton(width - 300 - 50, buttonY, 155, 50, "TITLE SCREEN");
  
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
  text("GAME OVER", width / 2, height / 3);
  
  fill(255);
  textSize(32);
  text("Level: " + Level, width / 2, height / 2 - 80);
  text("Experience: " + Exp, width / 2, height / 2 - 30);
  
  textSize(20);
  text("Click RESTART or press SPACE", width / 2, height / 2 + 60);
  
  // Draw pesky RESTART button
  DrawButton(width / 2 - 80, height / 2 + 120, 160, 50, "RESTART");
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

// Builds the enemies array structure that GetNearestEnemy expects
function BuildEnemiesArray() {
  enemies = [
    { type: 'disc', x: disc_X, y: disc_Y, health: disc_Health, diameter: disc_Diameter, xSpeed: disc_XSpeed, ySpeed: disc_YSpeed, sound: 'deathdisc', exp: 5, gold: (l) => 10 + l },
    { type: 'dia', x: dia_X, y: dia_Y, health: dia_Health, diameter: dia_Diameter, xSpeed: dia_XSpeed, ySpeed: dia_YSpeed, sound: 'deathdiamond', exp: 4, gold: (l) => 3 },
    { type: 'minidia', x: minidia_X, y: minidia_Y, health: minidia_Health, diameter: minidia_Diameter, xSpeed: minidia_XSpeed, ySpeed: minidia_YSpeed, sound: 'deathminidiamond', exp: 2, gold: (l) => 1 },
    { type: 'grower', x: grower_X, y: grower_Y, health: grower_Health, diameter: grower_Diameter, xSpeed: grower_XSpeed, ySpeed: grower_YSpeed, sound: 'deathgrower', exp: 5, gold: (l) => 8 },
    { type: 'chungusjr', x: chungusjr_X, y: chungusjr_Y, health: chungusjr_Health, diameter: chungusjr_Diameter, xSpeed: chungusjr_XSpeed, ySpeed: chungusjr_YSpeed, sound: 'deathchungusjr', exp: 12, gold: (l) => 8 },
    { type: 'chungus', x: chungus_X, y: chungus_Y, health: chungus_Health, diameter: chungus_Diameter, xSpeed: chungus_XSpeed, ySpeed: chungus_YSpeed, sound: 'deathchungus', exp: 20, gold: (l) => 16 },
    { type: 'chungussr', x: chungussr_X, y: chungussr_Y, health: chungussr_Health, diameter: chungussr_Diameter, xSpeed: chungussr_XSpeed, ySpeed: chungussr_YSpeed, sound: 'deathchungussr', exp: 40, gold: (l) => 28 },
    { type: 'lilfella', x: lilfella_X, y: lilfella_Y, health: lilfella_Health, diameter: lilfella_Diameter, xSpeed: lilfella_XSpeed, ySpeed: lilfella_YSpeed, sound: 'deathgrower', exp: 40, gold: (l) => 28 }
  ];
}

function ResetAllArrays() { // and other stuff too hopefully I will remember to update this when I add/change stuff but probly won't it is waht it is
  abilityCooldownTimer = 1;

  disc_X = [];
  disc_Y = [];
  disc_Diameter = [];
  disc_XSpeed = [];
  disc_YSpeed = [];
  disc_Health = [];
  
  chungusjr_X = [];
  chungusjr_Y = [];
  chungusjr_Diameter = [];
  chungusjr_XSpeed = [];
  chungusjr_YSpeed = [];
  chungusjr_Health = [];
  
  chungus_X = [];
  chungus_Y = [];
  chungus_Diameter = [];
  chungus_XSpeed = [];
  chungus_YSpeed = [];
  chungus_Health = [];
  
  chungussr_X = [];
  chungussr_Y = [];
  chungussr_Diameter = [];
  chungussr_XSpeed = [];
  chungussr_YSpeed = [];
  chungussr_Health = [];
  
  chip_X = [];
  chip_Y = [];
  chip_Diameter = [];
  chip_XSpeed = [];
  chip_YSpeed = [];
  
  dia_X = [];
  dia_Y = [];
  dia_Diameter = [];
  dia_XSpeed = [];
  dia_YSpeed = [];
  dia_Health = [];
  
  minidia_X = [];
  minidia_Y = [];
  minidia_Diameter = [];
  minidia_XSpeed = [];
  minidia_YSpeed = [];
  minidia_Health = [];
  
  grower_X = [];
  grower_Y = [];
  grower_Diameter = [];
  grower_XSpeed = [];
  grower_YSpeed = [];
  grower_Health = [];
  
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
  bits =0;
  blasters = 0;
  cannons=0;
}