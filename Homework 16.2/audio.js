// ==++ -- sound player -- ++== \\

// Audio stuff

let sounds = {};
let soundDelays = {};
const SOUND_DELAY = 16;
const SOUND_COUNT = 25;

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