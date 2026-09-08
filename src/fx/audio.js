/* ============================================================
   AUDIO — Background music controls
   Drop your song into assets/hbd_song.mp3
   ============================================================ */

const SONG_SRC = '../assets/hbd_song.mp3';

const birthdaySong = new Audio(SONG_SRC);
birthdaySong.loop = true;
birthdaySong.volume = 0.9;
birthdaySong.preload = 'auto';

export let songOn = false;

export function playSong() {
  songOn = true;
  // guarded: if the file is missing/blocked, the page keeps working
  birthdaySong.play().catch(() => {});
}

export function stopSong() {
  songOn = false;
  birthdaySong.pause();
}
