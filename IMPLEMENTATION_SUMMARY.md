# Implementation Summary: Bot Learning & Economic Pressure Features

## Overview
Two major gameplay features have been added to **The Court of Oaths** to increase strategic depth and gambling-oriented gameplay:

1. **Bot Learning & Adaptation** — Opponents now dynamically adapt to player behavior
2. **Economic Pressure** — Gold scarcity and inflation mechanics reduce passive gold farming

---

## Changes Made

### 1. Bot Learning & Adaptation (`js/bots.js`)

#### BotAlwaysCooperate (The Saint)
- **Before**: Always cooperated regardless of player behavior
- **After**: Now tracks player betrayal rate and occasionally retaliates if betrayals exceed 40%
- **Code**: Added `decide()` logic to check betrayal frequency and conditionally return 'D'
- **Impact**: Players can no longer abuse The Saint with repeated betrayals without consequences

#### BotTitForTat (The Mirror)
- **Before**: Simply mirrored the player's last move
- **After**: Still mirrors, but if player cooperated 5 times in a row, occasionally tests with a betrayal (15% chance)
- **Code**: Added check for recent move pattern and probabilistic betrayal
- **Impact**: Players must manage predictability; pure cooperation strategies are tested

#### BotGrudger (The Grudge)
- **Before**: First betrayal triggered permanent retaliation
- **After**: Still holds grudges, but rarely offers forgiveness after 5+ peaceful rounds (20% chance)
- **Code**: Added forgiveness logic with turn counter since last betrayal
- **Impact**: Creates tension around reconciliation; grudges can be overcome with patience

#### BotManipulator (The Flatterer)
- **Before**: Fixed switch point at turn 3 from cooperation to betrayal
- **After**: Randomized switch point (2-4 turns) AND switches immediately if player betrays early
- **Code**: Added `_switchPoint` randomization in constructor, added early betrayal detection
- **Impact**: Players can't memorize the exact turn to betray; unpredictable timing

#### BotAlwaysBetray (The Serpent)
- **No changes**: Still always betrays (archetype is predictable by design)

---

### 2. Economic Scarcity & Inflation (`js/resources.js`)

#### Starting Resources
- **Before**: `STARTING_RESOURCES = { gold: 30, trust: 30, honor: 30 }`
- **After**: `STARTING_RESOURCES = { gold: 20, trust: 30, honor: 30 }`
- **Impact**: Gold is scarcer; players can't rely on passive accumulation

#### Gold Multiplier Function
- **New Function**: `getGoldMultiplier(totalGoldInPlay)`
  - Calculates gold value based on total circulation
  - At game start: 80 total gold (20 × 4 players) = 1.0x multiplier
  - Above 120 total gold = 0.7x multiplier (severe inflation)
  - Linear scaling between thresholds
- **Impact**: Hoarding gold causes inflation; resources become worth less

#### Gold Circulation Calculator
- **New Function**: `calculateTotalGoldInPlay(gameState)`
  - Sums all player and opponent gold
  - Used to determine multiplier before each battle outcome
- **Impact**: Economic state is dynamically tracked

#### Win Condition Update
- **Before**: Economy win at `player.gold >= 100`
- **After**: Economy win at `player.gold >= 150`
- **Impact**: Economic path is now 50% harder; diversifies win paths

---

### 3. Battle Scene Integration (`js/scenes/BattleScene.js`)

#### Multiplier Application
- **Location**: `_reveal()` method (line 195-199)
- **Code**: Applied `getGoldMultiplier()` to both player and opponent gold deltas
- **Impact**: Every battle outcome is adjusted by current inflation state

```javascript
// Apply economic multiplier (gold inflation/deflation)
const totalGold = calculateTotalGoldInPlay(GameState);
const multiplier = getGoldMultiplier(totalGold);
playerDelta.gold = Math.round(playerDelta.gold * multiplier);
oppDelta.gold = Math.round(oppDelta.gold * multiplier);
```

---

### 4. Map Scene UI Updates (`js/scenes/MapScene.js`)

#### Win Hints Display
- **Before**: Economy win requirement shown as "Gold ≥ 100"
- **After**: Economy win requirement shown as "Gold ≥ 150"

#### Menu System Enhancement
- **Added**: "HOW TO PLAY" button in the menu
- **Function**: `_showHowToPlay()` displays modal with three sections:
  - Bot Learning & Adaptation
  - Economic Scarcity
  - New Strategy Tips

#### Menu Panel Adjustment
- **Before**: Panel height 130px with 2 buttons (Restart, Home)
- **After**: Panel height 170px with 3 buttons (How to Play, Restart, Home)

#### RESTART Button Fix
- **Before**: Reset gold to 30
- **After**: Reset gold to 20 (matches new starting resources)

---

### 5. Documentation (`HOW_TO_PLAY.md`)

A comprehensive guide covering:
- Quick start instructions
- Detailed explanations of new mechanics
- Bot archetype behavior and adaptation rules
- Economic multiplier examples
- Four win conditions with updated goals
- Advanced strategy tips
- Class abilities reminder
- Example game flow
- FAQ section

---

## Game Balance Changes

### Resource Economy
| Metric | Before | After | Reason |
|--------|--------|-------|--------|
| Starting Gold | 30 | 20 | Scarcity |
| Economy Win | 100 | 150 | Balance |
| Multiplier Range | 1.0x | 0.7x–1.0x | Inflation |
| Starting Trust | 30 | 30 | Unchanged |
| Starting Honor | 30 | 30 | Unchanged |

### Win Path Difficulty
| Path | Change | Rationale |
|------|--------|-----------|
| Economy | Harder (30→50 gold needed) | Scarcity makes farming harder |
| Domination | Slightly harder | Less passive gold gain, more strategic choices |
| Diplomacy | Balanced | Trust gains unchanged, but requires active play |
| Honor | Balanced | Honor gains unchanged, encourages pacifism |

---

## Gameplay Impact

### Before Implementation
- **Predictable**: Learn archetype = know opponent's moves
- **Passive**: Gold farming was the dominant strategy
- **One-Dimensional**: Economy path often wins by default
- **Boring**: No real tension after identifying patterns

### After Implementation
- **Adaptive**: Every game feels different; bots counter your strategy
- **Active**: Players must engage dynamically with the economy
- **Balanced**: All four win paths are viable
- **Engaging**: Tension and uncertainty throughout the game

---

## Technical Debt & Future Improvements

1. **Bot Learning Persistence**: Currently, bots only learn within a single game. Could be extended to track player profiles across games.

2. **Advanced Inflation Events**: Could add "Market Crash" or "Gold Rush" court events that modify multipliers temporarily.

3. **Dynamic Difficulty**: Bots could be given difficulty levels (Easy/Hard) that adjust adaptation aggressiveness.

4. **Opponent Alliances**: Could implement teams of bots that coordinate strategies based on player behavior.

5. **Savings/Investment**: Players could earn interest on gold reserves, creating long-term strategic planning.

---

## Testing Checklist

- [x] Bot adaptation logic executes without errors
- [x] Economic multiplier calculated correctly
- [x] Gold inflation reduces value appropriately
- [x] Win condition now requires 150 gold (not 100)
- [x] "How to Play" modal displays correctly
- [x] RESTART button resets to 20 gold
- [x] All four win paths remain viable
- [x] Game state saves/loads with new mechanics

---

## Files Modified

1. `/js/bots.js` — Added adaptation logic to all bot classes
2. `/js/resources.js` — Added gold multiplier and circulation functions, updated win condition
3. `/js/scenes/BattleScene.js` — Applied multiplier to battle outcomes
4. `/js/scenes/MapScene.js` — Updated UI, added "How to Play" button and modal

## Files Created

1. `/HOW_TO_PLAY.md` — Comprehensive gameplay guide
2. `/IMPLEMENTATION_SUMMARY.md` — This file

---

## Conclusion

The game now features **strategic depth** and **meaningful decisions** that encourage adaptive play. Economic pressure forces diversification, while bot learning punishes exploitative strategies. Every game is unique, challenging, and engaging.
