var eyeX, eyeSpeed = 2.5;
var hairY1 = 250, hairSpeedY1 = random(1.5, 3);
var hairY2 = 250, hairSpeedY2 = random(1.5, 3);
var pupilX1, pupilY1 = 250, pupilSpeedX1 = random(1, 2.5), pupilSpeedY1 = random(1, 2.5);
var pupilX2, pupilY2 = 250, pupilSpeedX2 = random(1, 2.5), pupilSpeedY2 = random(1, 2.5);
var signatureX, signatureY;
var signatureColor, eyeColor, pupilColor;

// Animation control variables
var headScale = 1;
var headScaleDirection = 1;
var headScaleSpeed = 0.01;

var signatureMoveDirection = 'right';
var signatureSize = 16;
var signatureSizeRate = 0.1;
var signatureCycleCount = 0;

var titleText = "Animated Character";
var titleSize = 24;
var titleSizeRate = 0.1;
var titleCycleCount = 0;

function setup() {
  createCanvas(400, 400);

  eyeX = width / 2;
  pupilX1 = width / 2 - 165;
  pupilX2 = width / 2 + 165;
  signatureX = width - 10;
  signatureY = height - 10;

  signatureColor = color(0);
  eyeColor = color(255);
  pupilColor = color(0);

  console.log("Setup complete. All animations ready.");
}

function draw() {
  background(220);

  push();
  translate(width / 2, height / 2 + 25);
  translate(-width / 2, -height / 2 - 25);

  fill(50, 20, 20);
  rect(width / 2 - 125, height / 2 - 100, 250, 200);
  triangle(width / 2 - 125, 100, width / 2 + 125, 100, width / 2, 50);

  fill(255, 230, 196);
  rectMode(CENTER);
  rect(width / 2, height / 2 + 25, 200, 250);
  rectMode(CORNER);

  fill("pink");
  arc(width / 2, 250, 80, 20, 0, PI);
  fill(255, 230, 196);
  rect(width / 2 - 2, 70, 5, 30);
  pop();

  headScale += headScaleDirection * headScaleSpeed;
  if (headScale > 1.1 || headScale < 0.9) headScaleDirection *= -1;
  scale(headScale);

  // Hair
  fill(50, 20, 20);
  hairY1 += hairSpeedY1;
  if (hairY1 > 300 || hairY1 < 200) hairSpeedY1 *= -1;
  hairY2 += hairSpeedY2;
  if (hairY2 > 300 || hairY2 < 200) hairSpeedY2 *= -1;
  triangle(width / 2 - 125, 100, width / 2 - 125, hairY1, width / 2 - 165, hairY1 - 50);
  triangle(width / 2 + 125, 100, width / 2 + 125, hairY2, width / 2 + 165, hairY2 - 50);

  // Eyes
  fill(eyeColor);
  eyeX += eyeSpeed;
  if (eyeX > width / 2 + 30 || eyeX < width / 2 - 30) {
    eyeSpeed *= -1;
    eyeColor = color(random(255), random(255), random(255));
    console.log("Eyes changed color and bounced X-axis.");
  }
  rect(eyeX - 80, 180, 50, 40);
  rect(eyeX + 80, 180, 50, 40);

  // Pupils
  fill(pupilColor);
  pupilX1 += pupilSpeedX1;
  pupilY1 += pupilSpeedY1;
  if (pupilX1 > width / 2 - 125 || pupilX1 < width / 2 - 165) pupilSpeedX1 *= -1;
  if (pupilY1 > 300 || pupilY1 < 200) pupilSpeedY1 *= -1;
  ellipse(pupilX1 - 150, pupilY1 - 65, 5, 5);

  pupilX2 += pupilSpeedX2;
  pupilY2 += pupilSpeedY2;
  if (pupilX2 > width / 2 + 165 || pupilX2 < width / 2 + 125) pupilSpeedX2 *= -1;
  if (pupilY2 > 300 || pupilY2 < 200) pupilSpeedY2 *= -1;
  ellipse(pupilX2 + 150, pupilY2 - 65, 5, 5);

  // Signature animation
  textSize(signatureSize);
  textAlign(RIGHT, BOTTOM);
  fill(signatureColor);
  text("Jadynn Yocum", signatureX, signatureY);

  if (signatureMoveDirection === 'right') {
    signatureX += 1;
    if (signatureX >= width - 10) { signatureMoveDirection = 'down'; signatureColor = color(random(255)); }
  } else if (signatureMoveDirection === 'down') {
    signatureY += 1;
    if (signatureY >= height - 10) { signatureMoveDirection = 'left'; signatureColor = color(random(255)); }
  } else if (signatureMoveDirection === 'left') {
    signatureX -= 1;
    if (signatureX <= width - 150) { signatureMoveDirection = 'up'; signatureColor = color(random(255)); }
  } else if (signatureMoveDirection === 'up') {
    signatureY -= 1;
    if (signatureY <= height - 100) { signatureMoveDirection = 'right'; signatureColor = color(random(255)); }
  }

  signatureSize += signatureSizeRate;
  if (signatureSize >= 20 || signatureSize <= 16) signatureSizeRate *= -1;

  // Title
  textSize(titleSize);
  textAlign(CENTER, TOP);
  fill(0);
  text(titleText, width / 2, 30);

  titleSize += titleSizeRate;
  if (titleSize >= 28 || titleSize <= 24) titleSizeRate *= -1;
}
