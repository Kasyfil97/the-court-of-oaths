# Game Music Setup

The Court of Oaths now has music support! The audio system is ready, but you need to add music files.

## How to Add Music

Edit `js/audio.js` and replace the empty URLs in the `musicUrls` object with actual music files:

```javascript
const musicUrls = {
  'music_title': 'https://your-domain.com/title-music.mp3',
  'music_map': 'https://your-domain.com/map-music.mp3',
  'music_battle': 'https://your-domain.com/battle-music.mp3',
  'music_negotiation': 'https://your-domain.com/negotiation-music.mp3',
  'music_victory': 'https://your-domain.com/victory-music.mp3',
};
```

## Free Pixel-Style Music Sources

### Incompetech (Kevin MacLeod)
- **Website:** https://incompetech.com/
- **License:** CC0 (royalty-free)
- **Best for:** Retro, chiptune, arcade music
- **How to use:** Download MP3 files and host them, or check for direct links

### OpenGameArt.org
- **Website:** https://opengameart.org/
- **License:** CC0, CC-BY, CC-BY-SA
- **Best for:** Game music, pixel art music
- **How to use:** Search "8-bit", "chiptune", or "retro"

### FreePD
- **Website:** https://freepd.com/
- **License:** Free, no attribution required
- **Best for:** Various styles including pixel/retro
- **How to use:** Download and host, or check for direct MP3 links

### Chosic
- **Website:** https://www.chosic.com/spotify-playlist/free-background-music/
- **License:** Various (check per track)
- **Best for:** Lists of free music with links

## Quick Start Example

If you want to get started immediately with placeholder music URLs:

1. Visit https://incompetech.com/
2. Search for "Pixel" or "Retro" 
3. Download 5 tracks for different moods:
   - Title: Something peaceful/melodic
   - Map: Something adventurous
   - Battle: Something intense/fast
   - Negotiation: Something calm/diplomatic
   - Victory: Something triumphant

4. Upload to a hosting service (GitHub Pages, Netlify, your own server)
5. Update the URLs in `js/audio.js`

## Music Control

Players can toggle music on/off in the game's menu. The AudioManager handles:
- Music switching between scenes
- Volume control (default 0.5)
- Smooth transitions between tracks
- Graceful fallback if a track fails to load

## Technical Details

- **Audio Format:** MP3 or OGG (most compatible)
- **Sample Rate:** 44.1kHz or 48kHz recommended
- **Duration:** 2-5 minutes per track (they loop)
- **Bitrate:** 128-320 kbps
- **Phaser Version:** 3.90.0 (uses Web Audio API)

## Troubleshooting

If music doesn't play:
1. Check browser console for errors (F12)
2. Verify URLs are correct and accessible
3. Check that files are in a supported format (MP3/OGG)
4. Some browsers may require user interaction before playing audio

## Future Improvements

Possible enhancements:
- Volume slider in settings
- Fade in/out transitions
- Scene-specific sound effects
- Background music synthesis
