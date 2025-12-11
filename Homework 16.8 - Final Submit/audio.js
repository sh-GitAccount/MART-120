// ==++ -- sound player -- ++== \\

// Audio stuff
let sounds = {};
let soundDelays = {};
const SOUND_DELAY = 16;
const SOUND_COUNT = 40;

// Looping music tracks
let musicTracks = {};
let currentTrack = null;
let currentTrackName = null;

// Fade state locks (prevents double-fading bugs)
let musicFadeTimer = null;    // holds timeout/interval ID for any active fade
let musicFadeActive = false;  // prevents other setters from clobbering fade
let musicMasterVolume = 0.8;  // keep a master volume value for slider (0..1)

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

// === main music player ===
function playMusicTrack(trackName) {
  // Cancel any pending fades
  if (musicFadeTimer) {
    clearTimeout(musicFadeTimer);
    musicFadeTimer = null;
  }

  // Stops previous track
  if (currentTrack && currentTrack.isPlaying()) {
    currentTrack.stop();
  }

  // Starts new track
  if (musicTracks[trackName]) {
    currentTrack = musicTracks[trackName];
    currentTrackName = trackName;
    
    // Apply volume settings
    if (typeof currentTrack.setVolume === "function") {
      currentTrack.setVolume(musicMasterVolume);
    }
    
    currentTrack.loop();
    console.log("Now playing: " + trackName);
  } else {
    console.log("Music track not found: " + trackName);
  }
}

// ==== stops the jam ==== 
function stopMusicTrack(fadeOutDuration = 1200) {
  // If nothing playing, nothing to do, have a smoke break
  if (!currentTrack || !currentTrack.isPlaying()) return;

  // If a previous fade is running, cancel it
  if (musicFadeTimer) {
    clearInterval(musicFadeTimer);
    musicFadeTimer = null;
    musicFadeActive = false;
  }

  // If duration is 0 or negative: immediate stop
  if (fadeOutDuration <= 0) {
    currentTrack.stop();
    currentTrack = null;
    currentTrackName = null;
    return;
  }

  musicFadeActive = true;

  // sample interval (ms) for smoothness; 30-60ms is fine
  const stepMs = 40;
  const steps = Math.max(1, Math.floor(fadeOutDuration / stepMs));
  let step = 0;

  // Read starting volume (clamp)
  let startVol = typeof currentTrack.getVolume === "function" ? currentTrack.getVolume() : 1;
  startVol = Math.max(0, Math.min(1, startVol));

  musicFadeTimer = setInterval(() => {
    step++;
    // slow diminishes
    const t = step / steps;
    const newVol = Math.max(0, startVol * (1 - t));
    if (currentTrack && typeof currentTrack.setVolume === "function") {
      currentTrack.setVolume(newVol);
    }

    // finished
    if (step >= steps) {
      clearInterval(musicFadeTimer);
      musicFadeTimer = null;
      // ensure silent then stop
      if (currentTrack && typeof currentTrack.setVolume === "function") {
        currentTrack.setVolume(0);
        currentTrack.stop();
      } else if (currentTrack) {
        currentTrack.stop();
      }
      currentTrack = null;
      currentTrackName = null;
      musicFadeActive = false;
    }
  }, stepMs);
}

function resetMusicFadeState() {
  if (musicFadeTimer) {
    clearInterval(musicFadeTimer);
    musicFadeTimer = null;
  }
  musicFadeActive = false;
  console.log("Music fade state reset");
}

// Used to adjust volume settings in config/options
function setMusicVolume(volume) {
  // update master value always so slider keeps remembered value
  musicMasterVolume = Math.max(0, Math.min(1, volume));
  

  // but do not clobber an active fade (which is controlling setVolume)
  if (musicFadeActive) {
    return;
  }

  if (currentTrack && typeof currentTrack.setVolume === "function") {
    currentTrack.setVolume(musicMasterVolume);
    console.log("Volume set to:", musicMasterVolume);
  } else {
  }
}

function getMusicVolume() {
  return musicMasterVolume;
}