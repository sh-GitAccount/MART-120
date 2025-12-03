// ==++ -- used to define variables and what not -- ++== \\

// Ability Stats
var abilityStats = {};

const abilityBaseStats = {
  bomb: {
    cooldown: 1000,
    damage: 16,
    radius: 240,
    duration: 40
  },
  shield: {
    cooldown: 800,
    immunityDuration: 135
  },
  flash: {
    cooldown: 400,
    dashDistance: 300
  },
  autofirebarrage: {
    cooldown: 900,
    shotCount: 16,
    targetingRange: 800
  },
  decimator: {
    cooldown: 1200,
    shotCount: 6,
    penetrationBoost: 2
  },
  spiralshot: {
    cooldown: 900,
    shotCount: 30
  },
  lightningbolt: {
    cooldown: 1600,
    boltCount: 6,
    damage: 14,
    duration: 40
  },
  singularity: {
    cooldown: 1320,
    duration: 100,
    radius: 150,
    damage: 10
  }
};

// misc things
var hoveredAttachmentId = null;
var death_Timer = 40;
var justRestarted; // used for restartgame function to reset some stuff
const gridParallax   = 0.25;  // lower = slower
const nebulaParallax = 0.55;  // 
const starParallax   = 1.0;   // 

// Game State settings and such
var global_Speed_Modifier = 1.8; // used for enemy only atm
// Buttons 
const s = 83;
const w = 87;
const a = 65;
const d = 68;

var time = 0;
var frame_Time = 0;
var game_State; // true or false, is it or isn't it?
var game_Screen = "menu"; // Menu, Paused, Playing, GameOver
var in_Shop = false;
var shopHoveredAttachment;
var shopSelectedAttachment;
var shopConfirmOpen = false;
var shopMouseReleased = true; // prevents repeated clicks to infinity and beyond
var pauseHoveredAttachmentId;
var attachmentLevels_Current = {};
var attachmentList = {};
var pickupRadius = 15; // Radius for looting items
var itemAbsorptionRadius = 45;  // Distance at which items start being pulled toward player
var itemAbsorptionSpeed = 8;     // How fast items move toward player

// Item drop - ssssssucker
var suckerBoostActive = false;
var suckerBoostTimer = 0;
var suckerBoostDuration = 360; // 6 seconds at 60fps
var previousAbsorptionRadius = 60;

var pauseKeyPressed = false;
var shipSelected; // what ship you have selected

var shipImages = {};
var selectedShip = 1; // draws the ship selected for use elsewhere

// Ship rotation variables
var player_Rotation = 0; // what direction the player is facing
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
var player_Hitbox = 50; // slightly smaller hitbox for player instead of using diameter, gives a bit of leeway so it's not pixel perfect

var shield_Cooldown = 600; // 10s base cd
var shield_Cooldown_Timer = 0;
var shield_Hit = false;
var shield_Value = 1;
var shield_Active = false;
var shield_Damage_Display = 0;
var shield_Display_Timer = 0;

var is_Boosting = false;
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

// handles waves and timing/synchronization for when game is paused or in menus
var spawnTimer;
var spawnTimerActive = false;
var activeWaves = [];
var pausedWaveTime = 0;
var HandleWavePause = true;
var gameStartTime = 0;

// Stage Setting Variables
var stage;

// Enemy
var enemies = [];
var chips = [];
var disc_DirectionChangeTimer = [];
var disc_DirectionChangeInterval = [];

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

var shot_Power;   // damage done by shot
var shot_Power_Bonus;     // eventually will need to switch from flat modifiers, to using bonus values applied to base stat
const shot_Power_MAX = 30;

var shot_Count;   // number of shots to fire
var shot_Count_Bonus;
const shot_Count_MAX = 20;

var cooldown_Reduction = 1;
const cdr_MAX = 80;

var shot_Speed;     // speed at which shot move on screen
var shot_Speed_Bonus;
const shot_Speed_MAX = 100;

var shot_Diameter;    // girth of non-beam shots
var shot_Diameter_Bonus;
const shot_Diameter_MAX = 60;

var shot_Duration;    // lifespawn of shot, in frames
var shot_Duration_Bonus;
const shot_Duration_MAX = 120;

var shot_Delay;     // firing rate, delay between auto fires
var shot_Delay_Bonus; 
const shot_Delay_MIN = 1;

var burstCooldownTimer = 0;   // delay for shotygun style shots
var burstCooldown;
var burstCooldown_Bonus;
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

// Supports have same parameter types as you basically

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

// shop menu stuff
var shopConfirmOpen = false;
var shopSelectedAttachment = null;
var shopMouseReleased = true;

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
    { item: "exptoken", chance: 0.45, amount: 3 },
    { item: "goldtoken", chance: 0.15, amount: 4 },
    { item: "sucker", chance: 0.005}  
  ],

  dia: [
    { item: "exptoken", chance: 1.0, amount: 3 },
    { item: "goldtoken", chance: 0.25, amount: 5 },
    { item: "sucker", chance: 0.008}  

  ],

  grower: [
    { item: "exptoken", chance: .5, amount: 3 },
    { item: "goldtoken", chance: 0.4, amount: 8 },
    { item: "sucker", chance: 0.001}  
  ],

  chungusjr: [
    { item: "midexptoken", chance: 1.0, amount: 12 },
    { item: "goldtoken", chance: 0.3, amount: 16 },
    { item: "sucker", chance: 0.005} 
  ],

  chungus:  [
   { item: "midexptoken", chance: 1.0, amount: 12 },    
   { item: "powerup", chance: 0.2},
   { item: "goldtoken", chance: 0.35, amount: 28 },
   { item: "sucker", chance: 0.005}           
  ],

  chungussr: [
    { item: "bigexptoken", chance: 0.5, amount: 40 },
    { item: "powerup", chance: 0.2 },
    { item: "goldtoken", chance: 0.5, amount: 40 },
    { item: "sucker", chance: 0.01}  
  ],

  disc: [
   { item: "powerup", chance: 1.0},
   { item: "sucker", chance: 0.01},
   { item: "bigexptoken", chance: 0.2, amount: 40 },
  ],

  gigadia: [
   { item: "midexptoken", chance: 0.3, amount: 15},
   { item: "goldtoken", chance: 0.4, amount: 12 },
   { item: "sucker", chance: 0.025}    
  ]
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
  midexptoken: {
    frames: 4,
    frameSpeed: 12,
    size: 32,
    spriteSheet: null
  },
  bigexptoken: {
    frames: 4,
    frameSpeed: 12,
    size: 32,
    spriteSheet: null
  },    
  goldtoken: {
    frames: 4,
    frameSpeed: 10,
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
    frameSpeed: 18,
    size: 32,
    spriteSheet: null
  },
  sucker: {
    frames: 8,
    frameSpeed: 14,
    size: 32,
    spriteSheet: null
  },
/*  exploder: {
    frames: 8,
    frameSpeed: 12,
    size: 20,
    spriteSheet: null
  }*/
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


/*
 { 
    name: "Bomb Boost", 
    apply: () => { 
      ModifyAbilityStat("bomb", "damage", 3);
      ModifyAbilityStat("bomb", "radius", 50);
    }, 
    display: () => "Bomb++" 
  },
  { 
    name: "Cool Master", 
    apply: () => { 
      // Reduce cooldown by 10% (multiply by 0.9)
      ModifyAbilityStat("singularity", "cooldown", 0.9, true);
      ModifyAbilityStat("bomb", "cooldown", 0.9, true);
    }, 
    display: () => "Cooldown--" 
  },
];
*/

// N Y I
const bombBoosterAttachment = {
  name: "Bomb Amplifier",
  levels: {
    0: {
      cost: 800,
      itemInfo: "Increases Bomb damage by 5 and radius by 30.",
      stats: [],
      abilityMods: {  // New property for ability modifications
        bomb: {
          damage: 5,
          radius: 30
        }
      }
    }
  }
};
// ModifyAbilityStat("bomb", "damage", 5);
// ModifyAbilityStat("bomb", "radius", 30);


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
  GIGADIA: 3,
  LILFELLA: 1
};

// Wave spawning stuff
const stage1Waves = [
  {
    startTime: 2, 
    spawns: [
      { type: "lilfella", amount: 6, side: "grid", delay: 0.5, repeat: 2, cycleDelay: 15 }
    ]
  },
  {
    startTime: 8,
    spawns: [
      { type: "dia", amount: 4, side: "left", delay: 1, repeat: 2, cycleDelay: 15 }, 
      { type: "lilfella", amount: 8, side: "circle", delay: 0.25, repeat: 5, radius: 900, cycleDelay: 35  }
    ]
  },
  {
    startTime: 12,
    spawns: [
      { type: "disc", amount: 1, side: "center", delay: 1, repeat: 3, radius: 480, cycleDelay: 40 }
    ]
  },
  {
    startTime: 22,
    spawns: [
      { type: "gigadia", amount: 1, side: "top", delay: 1, repeat: 3, radius: 780, cycleDelay: 30 }
    ]
  },
  {
    startTime: 28,
    spawns: [
      { type: "gigadia", amount: 1, side: "bottom", delay: 1, repeat: 3, radius: 780, cycleDelay: 30 },
      { type: "disc", amount: 1, side: "center", delay: 1, repeat: 3, radius: 480, cycleDelay: 45 }

    ]
  },  
  {
    startTime: 34,
    spawns: [
      { type: "lilfella", amount: 36, side: "circle", delay: 1, repeat: 3, radius: 780, cycleDelay: 30 },
      { type: "chungusjr", amount: 1, side: "left", delay: 3, repeat: 3, radius: 500, cycleDelay: 30  }
    ]
  },
  {
    startTime: 45,
    spawns: [
      { type: "chungussr", amount: 1, side: "center", delay: 1, repeat: 3, radius: 780, cycleDelay: 60  }
    ]
  },
  {
    startTime: 56,
    spawns: [
      { type: "lilfella", amount: 12, side: "square", delay: 0.2, repeat: 15, radius: 780, cycleDelay: 18 }
    ]
  },
  {
    startTime: 62,
    spawns: [
      { type: "lilfella", amount: 18, side: "circle", delay: 0.15, repeat: 15, radius: 850, cycleDelay: 8 }
    ]
  } 
];

const defaultSave = {
  Gold: 0,
  totalGold: 0,
  attachmentsUnlocked: {},   // example: { "boost": true, "laser": true }
  stagesCleared: {},         // example: { "stage1": true }
  stagesUnlocked: { "stage1": true }
};

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
    itemAbsorptionRadius: 60,

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
    itemAbsorptionRadius: 85,

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
    itemAbsorptionRadius: 50,

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
    shot_Speed: 21,
    shot_Duration: 24,
    shot_Count: 1,
    shot_Diameter: 14,
    shot_Penetration: 1,
    shot_Delay: 30,
    burstCooldown: 50,
    itemAbsorptionRadius: 55,
    
    ship_Info: "The OP ship. Shorter range shots, but damn they crank.",
    ship_Info2: "Garbo early game, but scale god.",
    ship_Info3: "Fires projectiles in an array in front of the ship.",
    ship_Info4: "Ability: Bomb - Detonates an area around caster dealing heavy damage."
  }
};

// Track current ship ability if not declared do this
let currentShipAbility = null;
