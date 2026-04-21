# New Features: Bot Learning & Economic Pressure

## What Changed?

I've added two major gameplay features to make **The Court of Oaths** more strategic and engaging:

### 1. 🤖 **Bot Learning & Adaptation**

Opponents now **dynamically respond to your playstyle** instead of following fixed patterns.

#### How it Works:

**The Saint (Always Cooperate)**
- Normally trustworthy and cooperative
- **BUT**: If you betray > 40% of the time, they occasionally retaliate
- **Implication**: You can't exploit them endlessly without consequences

**The Mirror (Tit-for-Tat)**
- Still copies your last move (that's their core strategy)
- **BUT**: If you cooperate 5 times in a row, they test you with a 15% chance betrayal
- **Implication**: Pure cooperation strategies get tested; you need to stay unpredictable

**The Grudge (Holds grudges)**
- Still betrays forever after you betray them once
- **BUT**: Rarely (20% chance) offers forgiveness after 5+ peaceful turns
- **Implication**: Grudges can be overcome through patience—or stay permanent

**The Flatterer (Manipulator)**
- Still cooperates early, then switches to betrayal
- **BUT**: The switch point is randomized (2-4 turns) EACH GAME
- **BUT**: If you betray early, they switch immediately
- **Implication**: You can't memorize the exact turn to exploit them

**The Serpent (Always Betray)**
- No change—always betrays (designed to be predictable)

---

### 2. 💰 **Economic Scarcity & Inflation**

Gold is now **scarce** and **loses value** when hoarded.

#### Key Changes:

| Resource | Before | After |
|----------|--------|-------|
| **Starting Gold** | 30 | **20** |
| **Economy Win Condition** | Gold ≥ 100 | **Gold ≥ 150** |
| **Gold Multiplier** | Fixed 1.0x | **Variable (0.7x–1.0x)** |

#### The Inflation Mechanic:

When total gold in the game exceeds safe levels:
- **≤80 gold total**: Normal value (1.0x multiplier)
- **80-120 gold**: Moderate inflation (0.85x multiplier)  
- **>120 gold**: Severe inflation (0.7x multiplier) — 30% less value!

**Example**: 
- Normal: Both cooperate = +1 gold each
- High inflation: Both cooperate = +0.7 gold each (rounded)

#### Why This Matters:

- **No more passive farming**: You can't just spam cooperate and accumulate gold
- **Hoarding is punished**: The more gold in circulation, the less it's worth
- **Diversification is rewarded**: All four win paths are now viable
- **Strategic depth**: You must actively engage with the economy

---

## New UI Features

### "How to Play" Modal
- Accessible from the Map scene MENU button
- Explains Bot Learning, Economic Scarcity, and New Strategy tips
- Can be read mid-game for quick reference

### Updated Game Rules
- Title Scene's "GAME RULES" button now includes:
  - **New Page 3: "BOT ADAPTATION"** — Explains how bots adapt to your moves
  - **New Page 4: "ECONOMIC SCARCITY"** — Explains inflation mechanic
  - Win conditions updated to reflect new gold requirement (150 vs 100)

---

## Strategic Implications

### Before Implementation
```
Player Strategy: Identify bot archetype → Execute optimal counter-strategy → Win
Result: Predictable, boring, one-dimensional
```

### After Implementation
```
Player Strategy: Adapt dynamically → Counter bot adaptation → Manage economy → Win
Result: Unpredictable, engaging, multi-layered
```

### Example Gameplay Shift

**Before**: 
- "The Merchant always cooperates for 3 turns, then betrays. I'll cooperate for 3 turns, then betray back to net +5 gold."
- ✅ Works every time (boring)

**After**:
- "The Flatterer switches at 2-4 turns. I don't know when, so I need to:
  - Watch for the switch
  - Adapt mid-game
  - Maybe cooperate longer than expected
  - Consider using my Spy ability to peek
  - Manage inflation if gold accumulates
  - Pivot to an alternate win path if gold farming fails"
- 🎮 Dynamic, exciting, unpredictable

---

## Win Path Viability

All four win conditions are now balanced:

### 🏆 Economy (Gold ≥ 150)
- **Harder**: Requires 50% more gold, inflation reduces gains
- **Best For**: Merchant class (1.5x multiplier) who can overcome inflation
- **Challenge**: Active play needed, can't just AFK farm

### ⚔️ Domination (Eliminate 2+ opponents)
- **Slightly Harder**: Less passive gold gain, more tactical choices
- **Best For**: Rogue (betrayal bonus) with strategic targeting
- **Challenge**: Bots adapt to pure betrayal strategies

### 🤝 Diplomacy (Trust ≥ 70 with 3+ opponents)
- **Balanced**: Trust gains unchanged, but requires active engagement
- **Best For**: Knight class (+1 honor on cooperate)
- **Challenge**: Must maintain trust across multiple evolving relationships

### 👑 Honor (Never betray + 15 turns + Honor ≥ 60)
- **Balanced**: Path rewards pacifism and discipline
- **Best For**: Pure cooperation strategy with Knight class
- **Challenge**: Opponents test your resolve; can you resist retaliation?

---

## What Players Will Notice

### Positive Changes ✅
- Every game feels different
- Opponent behavior is unpredictable
- Gold accumulation is harder (creates tension)
- All win paths are viable
- Strategy matters more than luck
- More engaging, dynamic gameplay

### Challenge Changes 🎯
- Can't use same strategy every game
- Must adapt mid-game to bot behavior
- Gold farming requires more finesse
- Economic planning matters
- Multi-tasking between win conditions

---

## Implementation Details

### Files Modified:
1. **`js/bots.js`** — Added adaptation logic to 4 of 5 bot classes
2. **`js/resources.js`** — Added inflation multiplier, updated win condition
3. **`js/scenes/BattleScene.js`** — Applied economic multiplier to outcomes
4. **`js/scenes/MapScene.js`** — Added "How to Play" button and modal
5. **`js/scenes/TitleScene.js`** — Added new pages to Game Rules about features

### Documentation Added:
- **`HOW_TO_PLAY.md`** — Comprehensive gameplay guide
- **`IMPLEMENTATION_SUMMARY.md`** — Technical details of all changes
- **`FEATURES_EXPLAINED.md`** — This file

---

## Testing Checklist

You can verify the changes by:

1. **Bot Learning**:
   - Face The Saint and betray repeatedly (>40%) — they should occasionally betray back
   - Face The Mirror and cooperate 5 times — they may test with a betrayal
   - Face The Flatterer multiple times — switch point varies (2-4 turns)

2. **Economic Inflation**:
   - Play a full game and watch gold values change
   - When total gold >120, cooperate gains are worth ~0.7 gold instead of 1.0
   - Economy win now requires 150 (not 100)

3. **UI**:
   - Check Map scene MENU → "HOW TO PLAY" modal
   - Check Title scene "GAME RULES" → Pages 3-4 cover new features

4. **Balance**:
   - Try each win path (Economy, Domination, Diplomacy, Honor)
   - All should be achievable and competitive

---

## Future Enhancement Ideas

1. **Persistent Opponent Profiles**: Bots remember your playstyle across games
2. **Market Events**: Random events like "Gold Rush" or "Market Crash" modify inflation
3. **Difficulty Levels**: Easy/Normal/Hard bots with different adaptation speeds
4. **Alliances**: Bots team up based on shared enemies (player)
5. **Savings/Interest**: Players earn interest on hoarded gold, creating long-term planning

---

## Conclusion

The game is now **more strategic, less predictable, and more engaging**. Every game feels unique because bots adapt to you AND the economy influences your choices. 

You can no longer rely on a single dominant strategy—instead, you must **think like a true courtier: adapt, read your opponents, and seize opportunities as they arise**.

Enjoy the new Court of Oaths! 👑
