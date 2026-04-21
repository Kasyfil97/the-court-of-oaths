class BotAlwaysCooperate {
  constructor() {
    this.name = 'The Saint';
    this.archetypeId = 'alwaysCooperate';
    this._adaptationMeter = 0; // Tracks player betrayal frequency
  }
  decide(_myHistory, theirHistory) {
    // Base archetype: always cooperate
    let move = 'C';

    // Adaptation: If player betrays frequently (> 40% of moves), occasionally retaliate
    const playerBetrayals = theirHistory.filter(m => m === 'D').length;
    const betrayalRate = theirHistory.length > 0 ? playerBetrayals / theirHistory.length : 0;

    if (betrayalRate > 0.4 && Math.random() < betrayalRate * 0.3) {
      move = 'D'; // Occasional defensive betrayal
    }

    return move;
  }
  negotiationReact(_message) {
    return { displayText: '"Of course. My word is my bond."', bonusCoopNextTurn: true };
  }
}

class BotAlwaysBetray {
  constructor() { this.name = 'The Serpent'; this.archetypeId = 'alwaysBetray'; }
  decide(_myHistory, _theirHistory) { return 'D'; }
  negotiationReact(_message) {
    return { displayText: '"...silence..."', bonusCoopNextTurn: false };
  }
}

class BotTitForTat {
  constructor() { this.name = 'The Mirror'; this.archetypeId = 'titForTat'; }
  decide(_myHistory, theirHistory) {
    if (theirHistory.length === 0) return 'C';

    // Base: mirror the player's last move
    let move = theirHistory[theirHistory.length - 1];

    // Adaptation: If player has been mostly cooperative, risk occasional provocation
    const recentMoves = theirHistory.slice(-5);
    const cooperations = recentMoves.filter(m => m === 'C').length;

    // If player is very cooperative (5/5 in last 5), occasionally test with betrayal
    if (cooperations === 5 && recentMoves.length === 5 && Math.random() < 0.15) {
      move = 'D'; // Test the waters
    }

    return move;
  }
  negotiationReact(_message) {
    return { displayText: '"Very well. I shall match your gesture."', bonusCoopNextTurn: true };
  }
}

class BotGrudger {
  constructor() {
    this.name = 'The Grudge';
    this.archetypeId = 'grudger';
    this._betrayed = false;
    this._betrayalCount = 0;
  }
  decide(_myHistory, theirHistory) {
    // Track total betrayals
    this._betrayalCount = theirHistory.filter(m => m === 'D').length;

    // Trigger grudge on first betrayal
    if (!this._betrayed && theirHistory.includes('D')) {
      this._betrayed = true;
    }

    // Adaptation: Occasional forgiveness test
    if (this._betrayed && this._betrayalCount === 1) {
      // Only betrayed once; might forgive after many rounds (5+ turns since betrayal)
      const lastBetrayalIdx = theirHistory.lastIndexOf('D');
      const turnsSinceBetray = theirHistory.length - lastBetrayalIdx - 1;
      if (turnsSinceBetray >= 5 && Math.random() < 0.2) {
        return 'C'; // Rare forgiveness
      }
    }

    return this._betrayed ? 'D' : 'C';
  }
  negotiationReact(_message) {
    if (this._betrayed) {
      return { displayText: '"I remember what you did."', bonusCoopNextTurn: false };
    }
    return { displayText: '"Trust is earned. For now, I agree."', bonusCoopNextTurn: true };
  }
}

class BotManipulator {
  constructor() {
    this.name = 'The Flatterer';
    this.archetypeId = 'manipulator';
    this._turnCount = 0;
    this._switchPoint = Math.random() < 0.5 ? 2 : 4; // Randomize when betrayal starts (2-4 turns)
  }
  decide(_myHistory, _theirHistory) {
    this._turnCount++;

    // Adaptation: If player is catching on (betraying during coop phase), switch earlier
    const playerBetrayals = _theirHistory.filter(m => m === 'D').length;
    if (playerBetrayals > 0 && this._turnCount < this._switchPoint) {
      // Player is already betraying; switch to betrayal immediately
      return 'D';
    }

    return this._turnCount <= this._switchPoint ? 'C' : 'D';
  }
  negotiationReact(_message) {
    if (this._turnCount < this._switchPoint) {
      return { displayText: '"Splendid! We shall prosper together."', bonusCoopNextTurn: true };
    }
    return { displayText: '"How... interesting."', bonusCoopNextTurn: false };
  }
}

const BOT_ARCHETYPES = [
  BotAlwaysCooperate,
  BotAlwaysBetray,
  BotTitForTat,
  BotGrudger,
  BotManipulator,
];

// Build N bot instances, cycling through archetypes.
function buildOpponents(count) {
  const names = ['House Aurum', 'House Vex', 'House Crest', 'House Dorne', 'House Mora'];
  return Array.from({ length: count }, (_, i) => {
    const Cls = BOT_ARCHETYPES[i % BOT_ARCHETYPES.length];
    const bot = new Cls();
    return {
      id: `opp_${i}`,
      name: names[i] || `Rival ${i + 1}`,
      botName: bot.name,
      archetype: bot.archetypeId,
      bot,
      gold: STARTING_RESOURCES.gold,
      trust: STARTING_RESOURCES.trust,
      honor: STARTING_RESOURCES.honor,
      history: [],
      eliminated: false,
    };
  });
}
