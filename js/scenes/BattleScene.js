class BattleScene extends Phaser.Scene {
  constructor() { super('BattleScene'); }

  create() {
    this._opp = GameState.getCurrentOpponent();
    if (!this._opp) { this.scene.start('MapScene'); return; }

    this._playerMove = null;
    this._oppMove = null;
    this._decided = false;
    this._timer = null;
    this._timeLeft = 6;

    // Background
    this.add.rectangle(400, 300, 800, 600, 0x0a0a1e);

    // Arena divider
    const g = this.add.graphics();
    g.lineStyle(2, 0x333355);
    g.lineBetween(400, 60, 400, 500);

    this._buildHUD();
    this._buildSprites();
    this._buildButtons();

    // Opponent move (computed now but kept hidden)
    this._computeOppMove();

    if (GameState.playerClass === 'spy') {
      this._doSpyPeek();
    } else {
      this._enableButtons();
    }
  }

  _buildHUD() {
    // Top bar
    this.add.rectangle(400, 30, 800, 60, 0x0a0a1e, 0.9);

    const cls = CLASSES.find(c => c.id === GameState.playerClass);
    this.add.text(30, 30, (cls ? cls.name : 'YOU').toUpperCase(), {
      fontFamily: 'Press Start 2P', fontSize: '10px', color: '#ffdd44',
    }).setOrigin(0, 0.5);

    this.add.text(770, 30, this._opp.name.toUpperCase().slice(0, 12), {
      fontFamily: 'Press Start 2P', fontSize: '10px', color: '#aa88ff',
    }).setOrigin(1, 0.5);

    this._timerTxt = this.add.text(400, 30, '6', {
      fontFamily: 'Press Start 2P', fontSize: '18px', color: '#ff8800',
    }).setOrigin(0.5);

    // Resource bars — player
    this._pBarG = this._miniBar(100, 540, GameState.player.gold,  0xffdd44);
    this._pBarT = this._miniBar(100, 556, GameState.player.trust, 0x4488ff);
    this._pBarH = this._miniBar(100, 572, GameState.player.honor, 0xeeeeee);

    this.add.text(40, 540, 'G', { fontFamily: 'Press Start 2P', fontSize: '8px', color: '#ffdd44' });
    this.add.text(40, 556, 'T', { fontFamily: 'Press Start 2P', fontSize: '8px', color: '#4488ff' });
    this.add.text(40, 572, 'H', { fontFamily: 'Press Start 2P', fontSize: '8px', color: '#eeeeee' });

    this._oBarG = this._miniBar(700, 540, this._opp.gold,  0xffdd44);
    this._oBarT = this._miniBar(700, 556, this._opp.trust, 0x4488ff);
    this._oBarH = this._miniBar(700, 572, this._opp.honor, 0xeeeeee);
  }

  _miniBar(x, y, val, color) {
    const W = 120;
    this.add.rectangle(x, y, W, 8, 0x222222).setOrigin(0, 0.5);
    const fill = this.add.rectangle(x, y, (val / 120) * W, 8, color).setOrigin(0, 0.5);
    return { fill, W, color };
  }

  _tweenBar(bar, val) {
    const w = Math.max(0, (val / 120) * bar.W);
    this.tweens.add({ targets: bar.fill, width: w, duration: 500 });
  }

  _buildSprites() {
    const cls = GameState.playerClass;
    this._playerSprite = this.add.sprite(200, 280, cls).setScale(4);
    this._playerSprite.play(cls + '_idle');

    const botKey = GameState.opponents.indexOf(this._opp) % 2 === 0 ? 'bot_a' : 'bot_b';
    this._oppSprite = this.add.sprite(600, 280, botKey).setScale(4).setFlipX(true);
    this._oppSprite.play('bot_a_idle');

    // Speech bubbles (hidden initially)
    this._pBubble = this.add.image(200, 170, 'speech_bubble').setVisible(false);
    this._pBubbleTxt = this.add.text(200, 170, '', {
      fontFamily: 'Press Start 2P', fontSize: '7px', color: '#000000',
    }).setOrigin(0.5).setVisible(false);

    this._oBubble = this.add.image(600, 170, 'speech_bubble').setVisible(false);
    this._oBubbleTxt = this.add.text(600, 170, '', {
      fontFamily: 'Press Start 2P', fontSize: '7px', color: '#000000',
    }).setOrigin(0.5).setVisible(false);
  }

  _buildButtons() {
    this._btnC = this._makeBtn(200, 480, 'COOPERATE', 0x1a3a1a, 0x44aa44, '#44ff88');
    this._btnD = this._makeBtn(600, 480, 'BETRAY', 0x3a1a1a, 0xaa4444, '#ff4444');

    this._btnC.on('pointerdown', () => this._selectMove('C'));
    this._btnD.on('pointerdown', () => this._selectMove('D'));

    this._spyLabel = this.add.text(400, 200, '', {
      fontFamily: 'Press Start 2P', fontSize: '11px', color: '#cc44cc',
      align: 'center', wordWrap: { width: 300 },
    }).setOrigin(0.5).setVisible(false);
  }

  _makeBtn(x, y, label, fill, stroke, color) {
    const bg = this.add.rectangle(x, y, 200, 48, fill).setStrokeStyle(2, stroke);
    this.add.text(x, y, label, {
      fontFamily: 'Press Start 2P', fontSize: '13px', color,
    }).setOrigin(0.5);
    return bg;
  }

  _computeOppMove() {
    const myHist  = (GameState.playerMoveHistory[this._opp.id] || []);
    const neg = GameState.pendingNegotiation;
    const oppHist = [...this._opp.history];

    let move = this._opp.bot.decide(oppHist, myHist);

    // Negotiation bonus: bot agreed to cooperate this turn
    if (neg && neg.botBonusCoop) move = 'C';

    this._oppMove = move;
  }

  _doSpyPeek() {
    const moveLabel = this._oppMove === 'C' ? 'COOPERATE' : 'BETRAY';
    this._spyLabel
      .setText('SPY INTEL:\n' + this._opp.name + ' will ' + moveLabel + '!')
      .setVisible(true);

    this.time.delayedCall(1500, () => {
      this._spyLabel.setVisible(false);
      this._enableButtons();
    });
  }

  _enableButtons() {
    this._btnC.setInteractive({ useHandCursor: true });
    this._btnD.setInteractive({ useHandCursor: true });
    this._startTimer();
  }

  _startTimer() {
    this._timeLeft = 6;
    this._timerTxt.setText(String(this._timeLeft));

    this._timer = this.time.addEvent({
      delay: 1000,
      repeat: 5,
      callback: () => {
        this._timeLeft--;
        this._timerTxt.setText(String(this._timeLeft));
        if (this._timeLeft <= 0 && !this._decided) this._selectMove('C');
      },
    });
  }

  _selectMove(move) {
    if (this._decided) return;
    this._decided = true;
    if (this._timer) this._timer.remove();
    this._timerTxt.setVisible(false);
    this._btnC.disableInteractive();
    this._btnD.disableInteractive();
    this._playerMove = move;

    this.time.delayedCall(400, () => this._reveal());
  }

  _reveal() {
    const pMove = this._playerMove;
    const oMove = this._oppMove;
    const cls   = GameState.playerClass;

    // Animate sprites
    this._playerSprite.play(cls + (pMove === 'C' ? '_cooperate' : '_betray'));
    this._oppSprite.play('bot_a' + (oMove === 'C' ? '_cooperate' : '_betray'));

    // Speech bubbles
    this._showBubble(this._pBubble, this._pBubbleTxt, pMove === 'C' ? 'COOPERATE' : 'BETRAY');
    this._showBubble(this._oBubble, this._oBubbleTxt, oMove === 'C' ? 'COOPERATE' : 'BETRAY');

    // Compute deltas
    const { playerDelta, oppDelta } = OUTCOME(pMove, oMove, cls);

    // Float resource deltas
    this._floatDelta(200, 240, playerDelta);
    this._floatDelta(600, 240, oppDelta);

    // Apply to state
    const newP = applyDelta(GameState.player, playerDelta);
    GameState.player.gold  = newP.gold;
    GameState.player.trust = newP.trust;
    GameState.player.honor = newP.honor;

    const newO = applyDelta(
      { gold: this._opp.gold, trust: this._opp.trust, honor: this._opp.honor },
      oppDelta
    );
    this._opp.gold  = newO.gold;
    this._opp.trust = newO.trust;
    this._opp.honor = newO.honor;
    if (this._opp.gold <= 0) this._opp.eliminated = true;

    // Update bars
    this._tweenBar(this._pBarG, GameState.player.gold);
    this._tweenBar(this._pBarT, GameState.player.trust);
    this._tweenBar(this._pBarH, GameState.player.honor);
    this._tweenBar(this._oBarG, this._opp.gold);
    this._tweenBar(this._oBarT, this._opp.trust);
    this._tweenBar(this._oBarH, this._opp.honor);

    // Record history
    if (!GameState.playerMoveHistory[this._opp.id]) GameState.playerMoveHistory[this._opp.id] = [];
    GameState.playerMoveHistory[this._opp.id].push(pMove);
    this._opp.history.push(oMove);

    // Track never-betrayed flag
    if (pMove === 'D') GameState.neverBetrayed = false;

    GameState.turnNumber++;
    GameState.pendingNegotiation = null;

    // Auto-save
    GameState.save();

    // Check win conditions
    const win = checkWinConditions(GameState);
    if (win) {
      GameState.winCondition = win;
      this.time.delayedCall(1800, () => this.scene.start('WinScene'));
    } else {
      this.time.delayedCall(1800, () => this.scene.start('MapScene'));
    }
  }

  _showBubble(bubble, txt, label) {
    bubble.setVisible(true).setScale(0);
    txt.setText(label).setVisible(true);
    this.tweens.add({ targets: bubble, scaleX: 1, scaleY: 1, duration: 200, ease: 'Back.Out' });
  }

  _floatDelta(x, y, delta) {
    const parts = [];
    if (delta.gold  !== 0) parts.push((delta.gold  > 0 ? '+' : '') + delta.gold  + 'G');
    if (delta.trust !== 0) parts.push((delta.trust > 0 ? '+' : '') + delta.trust + 'T');
    if (delta.honor !== 0) parts.push((delta.honor > 0 ? '+' : '') + delta.honor + 'H');
    if (!parts.length) return;

    const txt = this.add.text(x, y, parts.join(' '), {
      fontFamily: 'Press Start 2P',
      fontSize: '11px',
      color: delta.gold >= 0 ? '#44ff88' : '#ff4444',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: txt,
      y: y - 60,
      alpha: 0,
      duration: 1400,
      onComplete: () => txt.destroy(),
    });
  }
}
