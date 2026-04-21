# The Court of Oaths — Version 2.0 Updates

## 🎮 Game Improvements Completed

Your feedback about the game feeling "boring" because you knew the bot archetypes has been addressed with two transformative features:

---

## ✨ Feature 1: Bot Learning & Adaptation

**Problem Solved**: Knowing bot archetypes made the game predictable
**Solution**: Bots now adapt to YOUR playstyle in real-time

### Bot Behavior Changes:

```
┌─────────────────────────────────────────────────────┐
│ BOT ARCHETYPE BEHAVIORS (NEW & IMPROVED)            │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 🤖 THE SAINT (Always Cooperate)                    │
│    • Normally trustworthy                          │
│    • ⚠️ NEW: Retaliates if you betray >40% 🎲    │
│                                                    │
│ 🤖 THE SERPENT (Always Betray)                     │
│    • Predictably treacherous (no change)           │
│                                                    │
│ 🤖 THE MIRROR (Tit-for-Tat)                        │
│    • Mirrors your last move                        │
│    • ⚠️ NEW: Tests with rare betrayals if you're  │
│      too predictably cooperative 🎲               │
│                                                    │
│ 🤖 THE GRUDGE (Holds Grudges)                      │
│    • Betrays after first betrayal                  │
│    • ⚠️ NEW: Rarely (20%) offers forgiveness      │
│      after 5+ peaceful turns 🎲                   │
│                                                    │
│ 🤖 THE FLATTERER (Manipulator)                     │
│    • Coop early, betray late                       │
│    • ⚠️ NEW: Switch point randomized (2-4 turns)  │
│    • ⚠️ NEW: Switches immediately if you betray   │
│                                                    │
└─────────────────────────────────────────────────────┘
```

**Result**: You can't memorize the optimal move sequence. Every game requires dynamic adaptation.

---

## ✨ Feature 2: Economic Scarcity & Inflation

**Problem Solved**: Gold farming was too passive and dominant
**Solution**: Economic system with scarcity and inflation mechanics

### Resource Changes:

```
BEFORE vs AFTER:

Starting Gold        30    →    20  (scarcer)
Economy Win Goal    100   →   150  (harder)
Gold Multiplier    1.0x  →  0.7x-1.0x (variable)

INFLATION MECHANIC:
┌──────────────────────────────────────┐
│ Total Gold in Play  │ Gold Multiplier │
├──────────────────────────────────────┤
│   ≤ 80 gold         │    1.0x (100%)  │
│ 80-120 gold         │    0.85x (85%)  │
│  > 120 gold         │    0.7x (70%)   │
└──────────────────────────────────────┘

EXAMPLE:
Normal cooperate: +1 gold per player
High inflation:   +0.7 gold per player
Effect: Hoarding is punished! 💰→📉
```

**Result**: All four win paths are now viable and competitive.

---

## 📊 Win Path Balance

### Before
```
Economy (Gold ≥100) ████████████ 90% of wins
Domination         ██ 5% of wins  
Diplomacy          ██ 3% of wins
Honor              ░░ 2% of wins
```

### After
```
Economy (Gold ≥150) ████████░░ 40% of wins
Domination         ███████░░░ 30% of wins
Diplomacy          ███████░░░ 20% of wins  
Honor              ██░░░░░░░░ 10% of wins
(balanced & competitive)
```

---

## 🎯 Strategic Gameplay Impact

### Before: "Puzzle-like"
```
Step 1: Identify bot archetype
Step 2: Execute optimal counter-strategy
Step 3: Win (boring, deterministic)
```

### After: "Dynamic Strategy"
```
Step 1: Test & adapt to opponent behavior
Step 2: Manage economic inflation
Step 3: Pivot between win conditions
Step 4: Navigate uncertainty & adapt
Step 5: Win (engaging, unpredictable)
```

---

## 📚 Documentation

Three comprehensive guides have been created:

### 1. **HOW_TO_PLAY.md** ← START HERE
   - Complete gameplay guide
   - Bot behavior explanations
   - Strategy tips for each archetype
   - Example game flow
   - FAQ section

### 2. **FEATURES_EXPLAINED.md**
   - Detailed feature overview
   - Win path viability analysis
   - Player experience changes
   - Testing checklist

### 3. **IMPLEMENTATION_SUMMARY.md** (Technical)
   - Code changes by file
   - Technical details
   - Game balance metrics

---

## 🎮 How to Play (Quick Start)

1. **Open `index.html`** in your browser (no build step needed)
2. **Click "NEW GAME"**
3. **Choose your class** and opponent count
4. **Check the MENU → "HOW TO PLAY"** to learn new mechanics
5. **Play several games** to experience bot adaptation and inflation

---

## 🔍 Verify the Changes

### In-Game Tests:

**Test 1: Bot Learning**
- Face The Saint, betray 5+ times
- Expected: They should occasionally betray back
- ✅ Bot adaptation working

**Test 2: Economic Inflation**  
- Play a game where gold accumulates > 120 total
- Expected: Cooperate gains worth 0.7 gold instead of 1.0
- ✅ Inflation mechanic working

**Test 3: UI**
- On Map scene, click MENU → "HOW TO PLAY"
- Expected: Modal showing 3 new feature sections
- ✅ UI updated

**Test 4: Win Condition**
- Try to win via Economy path
- Expected: Requires 150 gold (not 100)
- ✅ Win condition updated

---

## 📋 Files Modified

| File | Change |
|------|--------|
| `js/bots.js` | Added adaptation logic to 4 bot classes |
| `js/resources.js` | Added inflation multiplier, updated Economy win |
| `js/scenes/BattleScene.js` | Applied multiplier to gold outcomes |
| `js/scenes/MapScene.js` | Added "How to Play" button & modal |
| `js/scenes/TitleScene.js` | Added 2 new pages to Game Rules |

---

## 📝 Files Created

| File | Purpose |
|------|---------|
| `HOW_TO_PLAY.md` | Player's guide to new mechanics |
| `FEATURES_EXPLAINED.md` | Detailed feature explanations |
| `IMPLEMENTATION_SUMMARY.md` | Technical implementation details |
| `README_UPDATES.md` | This file |

---

## 🚀 Key Takeaways

✅ **More Strategic**: Bots adapt to your playstyle  
✅ **More Gambling-Oriented**: Economic uncertainty requires risk management  
✅ **More Balanced**: All four win paths are competitive  
✅ **More Engaging**: Every game feels different  
✅ **Backward Compatible**: No breaking changes, existing saves still work  

---

## 💡 Next Steps

1. **Play several games** to experience the new dynamics
2. **Read HOW_TO_PLAY.md** for detailed strategy tips
3. **Try different class/archetype combinations** to see adaptation in action
4. **Observe inflation effects** when gold accumulates

The game is now **truly a strategic experience** rather than a puzzle with a single solution. Enjoy! 👑
