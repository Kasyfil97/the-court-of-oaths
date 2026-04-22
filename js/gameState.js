const GameState = {
  playerClass: 'knight',
  player: { gold: 30, trust: 30, honor: 30 },
  opponents: [],
  turnNumber: 0,
  playerMoveHistory: {},   // { opponentId: ['C','D',...] }
  neverBetrayed: true,
  winCondition: null,
  opponentCount: 3,
  currentOpponentId: null,
  pendingNegotiation: null,
  difficulty: 'normal',    // 'normal' | 'blind'

  reset(playerClass, opponentCount, opponents, difficulty = 'normal') {
    this.playerClass = playerClass;
    this.opponentCount = opponentCount;
    this.player = { gold: 30, trust: 30, honor: 30 };
    this.opponents = opponents;
    this.turnNumber = 0;
    this.playerMoveHistory = {};
    this.neverBetrayed = true;
    this.winCondition = null;
    this.currentOpponentId = null;
    this.pendingNegotiation = null;
    this.difficulty = difficulty;
    for (const opp of opponents) {
      this.playerMoveHistory[opp.id] = [];
    }
  },

  save() {
    const data = {
      playerClass: this.playerClass,
      player: { ...this.player },
      opponents: this.opponents.map(o => ({ ...o, history: [...o.history] })),
      turnNumber: this.turnNumber,
      playerMoveHistory: JSON.parse(JSON.stringify(this.playerMoveHistory)),
      neverBetrayed: this.neverBetrayed,
      winCondition: this.winCondition,
      opponentCount: this.opponentCount,
      difficulty: this.difficulty,
    };
    localStorage.setItem('court_save', JSON.stringify(data));
  },

  load() {
    const raw = localStorage.getItem('court_save');
    if (!raw) return false;
    const data = JSON.parse(raw);
    Object.assign(this, data);
    this.currentOpponentId = null;
    this.pendingNegotiation = null;
    if (!this.difficulty) this.difficulty = 'normal';
    return true;
  },

  hasSave() {
    return !!localStorage.getItem('court_save');
  },

  getOpponent(id) {
    return this.opponents.find(o => o.id === id);
  },

  getCurrentOpponent() {
    return this.getOpponent(this.currentOpponentId);
  }
};
