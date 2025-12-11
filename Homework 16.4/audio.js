// ==++ -- sound player -- ++== \\

// Audio stuff

let sounds = {};
let soundDelays = {};
const SOUND_DELAY = 16;
const SOUND_COUNT = 25;

// Looping music tracks
let musicTracks = {};
let currentTrack = null;
let currentTrackName = null;

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

// Play a looping music track
function playMusicTrack(trackName) {
  // Stop current track if playing
  if (currentTrack && currentTrack.isPlaying()) {
    currentTrack.stop();
  }

  // Play new track
  if (musicTracks[trackName]) {
    currentTrack = musicTracks[trackName];
    currentTrackName = trackName;
    currentTrack.loop(); // Loop seamlessly
    console.log("Now playing: " + trackName);
  } else {
    console.log("Music track not found: " + trackName);
  }
}

// Stop current music track
function stopMusicTrack() {
  if (currentTrack && currentTrack.isPlaying()) {
    currentTrack.stop();
    currentTrack = null;
    currentTrackName = null;
    console.log("Music stopped");
  }
}

// Fade out current track and play new one
function crossfadeMusicTrack(newTrackName, fadeOutDuration = 500) {
  if (currentTrack && currentTrack.isPlaying()) {
    // Fade out current track
    currentTrack.fade(currentTrack.getVolume(), 0, fadeOutDuration);
    
    // Stop after fade completes
    setTimeout(() => {
      currentTrack.stop();
      playMusicTrack(newTrackName);
      // Fade in new track
      if (currentTrack) {
        currentTrack.setVolume(0);
        currentTrack.fade(0, 0.8, fadeOutDuration);
      }
    }, fadeOutDuration);
  } else {
    playMusicTrack(newTrackName);
    if (currentTrack) {
      currentTrack.setVolume(0);
      currentTrack.fade(0, 0.8, 500);
    }
  }
}

// Set volume for music (0.0 to 1.0)
function setMusicVolume(volume) {
  if (currentTrack) {
    currentTrack.setVolume(Math.max(0, Math.min(1, volume)));
  }
}

// Get current track volume
function getMusicVolume() {
  if (currentTrack) {
    return currentTrack.getVolume();
  }
  return 0;
}