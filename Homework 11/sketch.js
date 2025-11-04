// Variable intialization an' such
var player_X = 35;
var player_Y = 565;
var diameter = 25;
var grow_Speed = 0.65;

var s = 83;
var w = 87;
var a = 65;
var d = 68;

var mouse_X;
var mouse_Y;

var obs1_X = 40;
var obs1_Y = 40;
var obs1_SpeedX = 2;
var obs1_SpeedY = 2;

var obs2_X = 222;
var obs2_Y = 333;
var obs2_SpeedX = 2;
var obs2_SpeedY = 2;

var frame_Time =0;
var game_State = true;

// Setup Canvas
function setup() {
  createCanvas(800, 600); 
}
// define ConcentricCircle function
function ConcentricCircle(x, y, outer_diameter, inner_diameter, outer_red, outer_green, outer_blue, inner_red, inner_green, inner_blue)
 {
  fill(outer_red, outer_green, outer_blue);
  circle(x, y, outer_diameter);
  fill(inner_red, inner_green, inner_blue);
  circle(x, y, inner_diameter);
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
  fill(60, 200, 120);
  ConcentricCircle(player_X, player_Y, diameter, diameter-15, 55, 55, 185, 55, 185, 200);
}

function CreateObs(){     // Creates Obstacle 1
  fill(200, 80, 60);
  circle(obs1_X, obs1_Y, 25)
  fill(220, 25, 60);      // Creates Obstacle 2
  circle(obs2_X, obs2_Y, 35);
}

// Makin dem dere circledrawer ya 'earin' me now?
function ClickCircle() {
  if (mouseIsPressed && mouseButton === LEFT) {
    mouse_X = mouseX;
    mouse_Y = mouseY;
    console.log("Mouse coordinates: X " + mouse_X + " :: Y " + mouse_Y);
    console.log("Speed Changer: " + speed_Changer)
  }
    circle(mouse_X, mouse_Y, 20);
}


// `` -- __ Motion && Position __ -- `` \\
function SpeedChange(){   // Updates the speeds and direction every 60 frames
 if (frame_Time >= 60){
    speed_Changer = Math.floor(Math.random() * 2) + 1;
    if (speed_Changer === 1){
      // Function to get random speeds, using POSITIVE values for the Obstacles          
      obs1_SpeedX = Math.floor(Math.random() *+ (5)) + 4 ;
      obs1_SpeedY = Math.floor(Math.random() *+ (6)) + 8 ;
      obs2_SpeedX = Math.floor(Math.random() *+ (6)) + 8 ;
      obs2_Speedy = Math.floor(Math.random() *+ (5)) + 4 ;
      frame_Time = 0;
      }else 
      // Function to get random speeds, using NEGATIVE values for the Obstacles          
        obs1_SpeedX = Math.floor(Math.random() *- (6)) + 8 ;
        obs1_SpeedY = Math.floor(Math.random() *- (5)) + 4 ;
        obs2_SpeedX = Math.floor(Math.random() *- (5)) + 4 ;
        obs2_Speedy = Math.floor(Math.random() *- (6)) + 8 ;
        frame_Time = 0;
      }
}
function MoveObs(){ 
  if (game_State === true) {
    {
    if (obs1_X > width)  obs1_X = 0;
    if (obs1_X < 0)      obs1_X = width;
    if (obs1_Y > height) obs1_Y = 0;
    if (obs1_Y < 0)      obs1_Y = height;
    obs1_X += obs1_SpeedX;
    obs1_Y += obs1_SpeedY;
    }  
    {
    if (obs2_X > width)  obs2_X = 0;
    if (obs2_X < 0)      obs2_X = width;
    if (obs2_Y > height) obs2_Y = 0;
    if (obs2_Y < 0)      obs2_Y = height;
    obs2_Y += obs2_SpeedY;
    obs2_X += obs2_SpeedX;
    }
  }
}

function Movement() {   // Handles movement of objects and frame timer! We be movin' mon
  if (game_State === true) {
  {
    if (obs1_X > width)  obs1_X = 0;
    if (obs1_X < 0)      obs1_X = width;
    if (obs1_Y > height) obs1_Y = 0;
    if (obs1_Y < 0)      obs1_Y = height;
      obs1_X += obs1_SpeedX;
      obs1_Y += obs1_SpeedY;
  }  
  
  {
    if (obs2_X > width)  obs2_X = 0;
    if (obs2_X < 0)      obs2_X = width;
    if (obs2_Y > height) obs2_Y = 0;
    if (obs2_Y < 0)      obs2_Y = height;
      obs2_Y += obs2_SpeedY;
      obs2_X += obs2_SpeedX;
  }
    
  if (player_X >= 800)  {player_X = 20;};
  if (player_X <= 0)    {player_X = 780;};
  if (player_Y >= 600)  {player_Y = 20;};
  if (player_Y <= 0)    {player_Y = 580;};

  if (keyIsDown(s)) {player_Y += 5;} else if (keyIsDown(w)) {player_Y -= 5;};
  if (keyIsDown(d)) {player_X += 5;} else if (keyIsDown(a)) {player_X -= 5;};

   frame_Time++;
  }
}

function ChangeDiameter() {   // Changes diameter of player blip
  diameter += grow_Speed;   
  if (diameter >= 40 || diameter <= 20) {
    grow_Speed *= -1; 
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
    text("Victory 💅", width/2-50, height/2-50);
 }
}

// `` -- __ DRAW __ -- `` \\
function draw() {
  background(10, 10, 10);

  CreatePlayer();   // function that creates a player.
  Movement();       // function to move the player using the keyboard.
  ClickCircle();    // function that draws an object to the screen when pressing the mouse.

  CreateObs();      // function that creates multiple obstacles of different sizes and colors on the screen 
  MoveObs();        // different functions to move each of the obstacles around randomly around the screen. If they leave the screen, have them come back on the other side.

  CreateBorders();  // function to generate a border around the screen.
  DrawExit();       // function to generate the exit
  VictoryMessage(); // function to display the “You win” message.

  SpeedChange();    // Changes Obstacles Speeds 
  ChangeDiameter(); // Growin and Shrinkin  
}