// Variable intialization an' such
var player_X = 35;
var player_Y = 565;
var diameter = 25;
var grow_Speed = 0.65;

var mouse_X;
var mouse_Y;

var frame_Time =0;
var game_State = true;

// Sets of arrays for obstacles
var obsCount = 15;  // Using an external variables rather than a variable in the for loop. Just seems easier I guess.
var obs_X = []; 
var obs_Y = []; 
var obs_Diameter = []; 
var obs_XSpeed = [];
var obs_YSpeed = [];
var obs_Cooldown = 0; // Used to prevent mouse click from generating infinity obstacles at once

const s = 83;
const w = 87;
const a = 65;
const d = 68;

// Setup Canvas
function setup() {
  createCanvas(800, 600);
  DrawObstacles(); 
}

// Creates the parameters which the CreateObs uses to draw the obstacles
function DrawObstacles(){   
  for (var i = 0; i < obsCount; i++) {      // get all the random numbers to create a circles
    obs_X[i] = getRandomNumber(800);
    obs_Y[i] = getRandomNumber(600);
    obs_Diameter[i] = Math.floor(Math.random() * 30) + 40;
    obs_XSpeed[i] = Math.floor(Math.random() * 12) - 6;
    obs_YSpeed[i] = Math.floor(Math.random() * 12) - 6;
  }
}

// define ConcentricCircle function
function ConcentricCircle(x, y, outer_diameter, inner_diameter, outer_red, outer_green, outer_blue, inner_red, inner_green, inner_blue)
 {
  fill(outer_red, outer_green, outer_blue);
  circle(x, y, outer_diameter);
  fill(inner_red, inner_green, inner_blue);
  circle(x, y, inner_diameter);
}

// RNG (YOINK)
function getRandomNumber(number) {
  return Math.floor(Math.random() * 55) + 35; 
}

// `` -- __ Scene Setup/ Initialization __ -- `` \\
function CreateBorders()
{
    // Border Fill Color
    fill(100, 90, 80);
    // Top
    rect(0, 0, width-60, 10)
    // Left 
    rect(0, 0, 10, height)
    // Right 
    rect(0, height-10, width, 10)
    // Bottom
    rect(width-10, 0, 10, height)
}

function CreatePlayer(){  //Creates the Player
  ConcentricCircle(player_X, player_Y, diameter, diameter-15, 65, 225, 140, 175, 185, 50);
}

function CreateObs(){     // Creates the Obstacles using concentric circles
for (var i = 0; i < obs_X.length; i++) {
  ConcentricCircle(
    obs_X[i],
    obs_Y[i],
    obs_Diameter[i],
    obs_Diameter[i] / 2,
    50, 120, 250, 250, 50, 120
    
    );
  }
   // console.log("Created Circle number: " + obs_X.length)
}

// Makin dem dere circledrawer ya 'earin' me now?
function ClickCircle() {
  if (mouseIsPressed && mouseButton === LEFT  && obs_Cooldown === 0) {
    mouse_X = mouseX;
    mouse_Y = mouseY;
    console.log("Mouse coordinates: X " + mouse_X + " :: Y " + mouse_Y);
    frame_Time_Freeze = frame_Time;
    console.log("Frametime Freeze = " + frame_Time_Freeze);

    obs_X[obsCount] = mouse_X;
    obs_Y[obsCount] = mouse_Y;
    obs_Diameter[obsCount] = 20;
    obs_XSpeed[obsCount] = Math.floor(Math.random() * 12) - 6;
    obs_YSpeed[obsCount] = Math.floor(Math.random() * 12) - 6;
    
    obsCount++;
    obs_Cooldown = 20    
  }
}

// `` -- __ Motion && Position __ -- `` \\
function MoveObs() { 
  if (game_State === true) {
    // Using frame time to randomize speeds
    if (frame_Time >= 60) {
      for (var i = 0; i < obs_X.length; i++) {
        obs_XSpeed[i] = Math.floor(Math.random() * 12) - 6; 
        obs_YSpeed[i] = Math.floor(Math.random() * 12) - 6;
      }
      frame_Time = 0; 
    }
    for (var i = 0; i < obs_X.length; i++) {
      obs_X[i] += obs_XSpeed[i];
      obs_Y[i] += obs_YSpeed[i];

      if (obs_X[i] > width)  obs_X[i] = 0;
      if (obs_X[i] < 0)      obs_X[i] = width;
      if (obs_Y[i] > height) obs_Y[i] = 0;
      if (obs_Y[i] < 0)      obs_Y[i] = height;
    }
  }
}

function MovePlayer() {   // Handles movement of objects and frame timer! We be movin' mon ((Renamed for better clarity))
  if (game_State === true) {  
  if (player_X >= 800)  {player_X = 20;};
  if (player_X <= 0)    {player_X = 780;};
  if (player_Y >= 600)  {player_Y = 20;};
  if (player_Y <= 0)    {player_Y = 580;};

  if (keyIsDown(s)) {player_Y += 5;} else if (keyIsDown(w)) {player_Y -= 5;};
  if (keyIsDown(d)) {player_X += 5;} else if (keyIsDown(a)) {player_X -= 5;};

  frame_Time++; 
  diameter += grow_Speed;   // Makin dem gettin big' n small
    if (diameter >= 40 || diameter <= 20) {
    grow_Speed *= -1; 
      }
  }
  if (obs_Cooldown > 0) {
      obs_Cooldown--;  // Keeps the cooldown from being perma triggered
  }  
}

function DrawExit(){    // Draws the "Exit" label
  textSize(16);
  text("EXIT", width-50, height-550)
}

function VictoryMessage(){
   if (player_X >= 740 && player_Y <= 15){
    game_State = false;
    fill(200, 200, 200);
    stroke(5);
    textSize(26);
    text("Victory!!", width/2-50, height/2-50);
 }
}
// `` -- __ DRAW __ -- `` \\
function draw() {
  background(10, 10, 10);

  CreatePlayer();   // function that creates a player.
  MovePlayer();       // function to move the player using the keyboard.
  ClickCircle();    // function that draws an object to the screen when pressing the mouse.

  CreateObs();      // function that creates multiple obstacles of different sizes and colors on the screen 
  MoveObs();        // different functions to move each of the obstacles around randomly around the screen. If they leave the screen, have them come back on the other side.

  CreateBorders();  // function to generate a border around the screen.
  DrawExit();       // function to generate the exit
  VictoryMessage(); // function to display the “You win” message.
}