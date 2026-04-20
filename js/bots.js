class BotAlwaysCooperate {
  constructor() { this.name = 'The Saint'; this.archetypeId = 'alwaysCooperate'; }
  decide(_myHistory, _theirHistory) { return 'C'; }
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
    return theirHistory[theirHistory.length - 1];
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
  }
  decide(_myHistory, theirHistory) {
    if (!this._betrayed && theirHistory.includes('D')) this._betrayed = true;
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
  }
  decide(_myHistory, _theirHistory) {
    this._turnCount++;
    return this._turnCount <= 3 ? 'C' : 'D';
  }
  negotiationReact(_message) {
    if (this._turnCount < 3) {
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
