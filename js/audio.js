// Audio manager for game music
// Free pixel-style music sources:
// - Incompetech: https://incompetech.com/ (Kevin MacLeod, CC0)
// - OpenGameArt: https://opengameart.org/ (various licenses)
// - FreePD: https://freepd.com/ (free downloads)
// - Chosic: https://www.chosic.com/spotify-playlist/free-background-music/
//
// To add your own music:
// 1. Download a pixel/retro style track (MP3 or OGG)
// 2. Host it online or place in a public directory
// 3. Update the URLs in preloadAudio() below

class AudioManager {
  constructor(scene) {
    this.scene = scene;
    this.currentMusic = null;
    this.musicEnabled = true;
    this.loadedTracks = new Set();
  }

  // Preload music files - update URLs to your own music sources
  static preloadAudio(scene) {
    const tracks = {
      'music_title': 'Title Screen - Peaceful Retro Theme',
      'music_map': 'Map Exploration - Adventurous Retro Theme',
      'music_battle': 'Battle - Intense Pixel Combat Theme',
      'music_negotiation': 'Negotiation - Calm Diplomatic Theme',
      'music_victory': 'Victory - Triumphant Retro Theme',
    };

    // Note: Replace these URLs with actual music files
    // Recommended free sources: Incompetech.com, OpenGameArt.org, FreePD.com
    const musicUrls = {
      // Placeholder URLs - replace with actual working music URLs
      // Example: 'https://example.com/music/title-theme.mp3'
      'music_title': '',
      'music_map': '',
      'music_battle': '',
      'music_negotiation': '',
      'music_victory': '',
    };

    // Only load tracks that have URLs configured
    for (const [key, url] of Object.entries(musicUrls)) {
      if (url) {
        scene.load.audio(key, [url]);
      }
    }
  }

  playMusic(key, loop = true) {
    if (!this.musicEnabled) return;

    // Skip if music wasn't loaded
    if (!this.scene.sound.get(key)) {
      console.warn(`Music track not loaded: ${key}`);
      return;
    }

    // Stop current music if playing
    if (this.currentMusic) {
      this.currentMusic.stop();
    }

    // Play new music
    this.currentMusic = this.scene.sound.add(key, { loop, volume: 0.5 });
    this.currentMusic.play();
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) {
      this.stopMusic();
    }
  }

  setVolume(volume) {
    if (this.currentMusic) {
      this.currentMusic.volume = Math.max(0, Math.min(1, volume));
    }
  }
}
