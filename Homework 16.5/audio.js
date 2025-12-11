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

function playMusicTrack(trackName) {
  // Cancel any pending fades
  if (musicFadeTimer) {
    clearTimeout(musicFadeTimer);
    musicFadeTimer = null;
  }

  // Stop previous track
  if (currentTrack && currentTrack.isPlaying()) {
    currentTrack.stop();
  }

  // Start new track
  if (musicTracks[trackName]) {
    currentTrack = musicTracks[trackName];
    currentTrackName = trackName;

    // avoids sudden full volume if the cached volume was lower before
    if (typeof currentTrack.getVolume === "function") {
      const v = currentTrack.getVolume();
      currentTrack.setVolume(v != null ? v : 1.0);
    }

    currentTrack.loop();
    console.log("Now playing: " + trackName);
  } else {
    console.log("Music track not found: " + trackName);
  }
}


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

// used when fading tracks together
function crossfadeMusicTrack(newTrackName, fadeOutDuration = 500) {
  // Cancel any existing fade
  if (musicFadeTimer) {
    clearInterval(musicFadeTimer);
    musicFadeTimer = null;
    musicFadeActive = false;
  }

  const oldTrack = currentTrack;

  // If nothing playing, behave like normal: start new and fade-in
  if (!oldTrack || !oldTrack.isPlaying()) {
    playMusicTrack(newTrackName);
    if (currentTrack) {
      // start silent then fade up to master volume
      currentTrack.setVolume(0);
      // simple fade-in using same mechanism
      const stepMs = 40;
      const steps = Math.max(1, Math.floor(fadeOutDuration / stepMs));
      let step = 0;
      musicFadeActive = true;
      musicFadeTimer = setInterval(() => {
        step++;
        const t = step / steps;
        const vol = Math.max(0, Math.min(1, musicMasterVolume * t));
        if (currentTrack && typeof currentTrack.setVolume === "function") currentTrack.setVolume(vol);

        if (step >= steps) {
          clearInterval(musicFadeTimer);
          musicFadeTimer = null;
          musicFadeActive = false;
        }
      }, stepMs);
    }
    return;
  }

  // Old track exists -> fade it out manually, then start new and fade in
  musicFadeActive = true;
  const stepMs = 40;
  const steps = Math.max(1, Math.floor(fadeOutDuration / stepMs));
  let step = 0;
  let startVol = typeof oldTrack.getVolume === "function" ? oldTrack.getVolume() : 1;
  startVol = Math.max(0, Math.min(1, startVol));

  musicFadeTimer = setInterval(() => {
    step++;
    const t = step / steps;
    const vol = Math.max(0, startVol * (1 - t));
    if (oldTrack && typeof oldTrack.setVolume === "function") oldTrack.setVolume(vol);

    if (step >= steps) {
      // finished fading old
      clearInterval(musicFadeTimer);
      musicFadeTimer = null;

      if (oldTrack) oldTrack.stop();

      // start new track and fade it in
      playMusicTrack(newTrackName);
      if (currentTrack) {
        currentTrack.setVolume(0);
        // fade-in new
        let inStep = 0;
        const inSteps = Math.max(1, Math.floor(fadeOutDuration / stepMs));
        musicFadeActive = true;
        musicFadeTimer = setInterval(() => {
          inStep++;
          const tin = inStep / inSteps;
          const volIn = Math.max(0, Math.min(1, musicMasterVolume * tin));
          if (currentTrack && typeof currentTrack.setVolume === "function") currentTrack.setVolume(volIn);

          if (inStep >= inSteps) {
            clearInterval(musicFadeTimer);
            musicFadeTimer = null;
            musicFadeActive = false;
          }
        }, stepMs);
      } else {
        musicFadeActive = false;
      }
    }
  }, stepMs);
}

// Used to adjust volume settings in config/options
function setMusicVolume(volume) {
  // update master value always so slider keeps remembered value
  musicMasterVolume = Math.max(0, Math.min(1, volume));

  // but do not clobber an active fade (which is controlling setVolume)
  if (musicFadeActive) return;

  if (currentTrack && typeof currentTrack.setVolume === "function") {
    currentTrack.setVolume(musicMasterVolume);
  }
}

function getMusicVolume() {
  return musicMasterVolume;
}

function getMusicVolume() {
  if (currentTrack) {
    return currentTrack.getVolume();
  }
  return 0;
}
