# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Court of Oaths** is a browser-based prisoner's dilemma strategy game built with Phaser 3. The player chooses a character class and competes against AI opponents across multiple rounds of Cooperate/Betray decisions. Resources (Gold, Trust, Honor) shift based on outcomes, and the first player to meet a win condition claims victory.

## Commands

Open `index.html` directly in a browser — no build step or server required. All dependencies are loaded via CDN (Phaser 3.90.0, Google Fonts).

## Architecture

### Entry Point
- `index.html` — loads scripts in dependency order, initializes `Phaser.Game` after fonts are ready

### Script Load Order
```
gameState.js → resources.js → classes.js → bots.js → events.js → scenes/...
```

### Key Files

| File | Purpose |
|---|---|
| `js/gameState.js` | Singleton `GameState` — holds all runtime state, `reset()`, `save()`/`load()` via `localStorage` |
| `js/resources.js` | `STARTING_RESOURCES`, `OUTCOME()` payoff matrix, `applyDelta()`, `clampResources()`, `checkWinConditions()` |
| `js/classes.js` | `CLASSES` array — Knight, Rogue, Merchant, Spy — each with passive ability modifiers |
| `js/bots.js` | Bot strategy classes + `buildOpponents(count)` factory |
| `js/events.js` | Court Events array, `drawEvent()`, `applyEventToOutcome()`, `applyImmediateEvent()` |
| `js/scenes/*.js` | Phaser scenes (see Scene Flow below) |

### Scene Flow
```
BootScene → TitleScene → SetupScene → MapScene ⟷ NegotiationScene ⟷ BattleScene → WinScene
```

- **BootScene** — preloads assets
- **TitleScene** — main menu (new game / continue)
- **SetupScene** — choose player class and opponent count
- **MapScene** — overview of all opponents with status; shows MENU overlay
- **NegotiationScene** — optional pre-battle diplomacy exchange
- **BattleScene** — main Cooperate/Betray round; applies `OUTCOME()` deltas
- **WinScene** — displays win condition achieved

### Game Mechanics

**Resources:** Gold, Trust, Honor (start at 30, clamped 0–120)

**Payoff Matrix (`OUTCOME()`):**
| Player | Opponent | Result |
|---|---|---|
| C | C | Both +2 Trust, +1 Gold |
| D | D | Both −2 Trust, −1 Gold |
| D | C | Player +5 Gold, −3 Honor; Opp −3 Gold |
| C | D | Player −3 Gold; Opp +5 Gold, −3 Honor |

**Class Passives:**
- Knight: +1 Honor on Cooperate
- Rogue: +2 Gold on Betray
- Merchant: Gold gains/losses ×1.5
- Spy: Briefly sees opponent's committed action before deciding

**Win Conditions (first reached wins):**
- **Economy** — Player Gold ≥ 100
- **Domination** — ≥ min(2, opponentCount) opponents eliminated (Gold ≤ 0)
- **Diplomacy** — Trust ≥ 70 with ≥ min(3, opponentCount) opponents
- **Honor Run** — Never betrayed + 15+ turns + Honor ≥ 60

### Bot Archetypes

| Class | Name | Strategy |
|---|---|---|
| `BotAlwaysCooperate` | The Saint | Always C |
| `BotAlwaysBetray` | The Serpent | Always D |
| `BotTitForTat` | The Mirror | Copies player's last move |
| `BotGrudger` | The Grudge | C until betrayed, then D forever |
| `BotManipulator` | The Flatterer | C for first 3 turns, then D |

Opponents cycle through archetypes in order. House names: Aurum, Vex, Crest, Dorne, Mora.

### Court Events (Random Event Cards)

Each turn on the Map screen, a random event card is drawn that modifies gameplay for that round. Events are stored in `js/events.js`. Some apply immediately (resource changes), others modify OUTCOME deltas during battle.

Example events: Harvest Festival, Night of Knives, Plague Year, Royal Favor, Market Crash, Trust Fall, Famine, Spy Network, Blood Oath, Merchant's Guild.

### Intel Dossiers (Hidden Archetypes)

Opponent archetypes start hidden. After 3 rounds with an opponent, a hint is revealed. After 6 rounds, the full archetype name is shown. The Spy class sees everything from turn 1. Hints are stored as `bot.hint` on each bot class.

### Class Active Abilities (Cooldown-Based)

Each class has one active ability usable every 3 turns via a button in BattleScene:

| Class | Ability | Effect |
|---|---|---|
| Knight | Shield Oath | If betrayed this turn, lose 0 Gold |
| Rogue | Pickpocket | Steal 3 Gold from opponent regardless of outcome |
| Merchant | Double Down | Gold multiplier becomes 3x this turn |
| Spy | Frame Job | Opponent's bot treats this turn as if player cooperated |
