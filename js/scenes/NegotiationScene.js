class NegotiationScene extends Phaser.Scene {
  constructor() { super('NegotiationScene'); }

  create() {
    // Play negotiation music
    const audioManager = this.registry.get('audioManager');
    audioManager.playMusic('music_negotiation');

    const opp = GameState.getCurrentOpponent();
    if (!opp) { this.scene.start('MapScene'); return; }

    // Semi-transparent overlay
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

    // Panel
    this.add.rectangle(400, 275, 500, 430, 0x0e0e24).setStrokeStyle(2, 0x886600);

    this.add.text(400, 110, 'NEGOTIATION', {
      fontFamily: 'Press Start 2P',
      fontSize: '16px',
      color: '#ffdd44',
    }).setOrigin(0.5);

    // Opponent info
    const botKey = GameState.opponents.indexOf(opp) % 2 === 0 ? 'bot_a' : 'bot_b';
    this.add.sprite(400, 210, botKey).setScale(3).play('bot_a_idle');
    this.add.text(400, 300, opp.name.toUpperCase(), {
      fontFamily: 'Press Start 2P',
      fontSize: '10px',
      color: '#aaaacc',
    }).setOrigin(0.5);
    const revealArchetype = GameState.difficulty !== 'blind';
    this.add.text(400, 320, revealArchetype ? '(' + opp.botName + ')' : '( ??? )', {
      fontFamily: 'Press Start 2P',
      fontSize: '8px',
      color: '#666688',
    }).setOrigin(0.5);

    // Bot response text area
    this._responseTxt = this.add.text(400, 375, '...', {
      fontFamily: 'Press Start 2P',
      fontSize: '9px',
      color: '#cccccc',
      wordWrap: { width: 420 },
      align: 'center',
    }).setOrigin(0.5);

    // Button bar container
    this.add.rectangle(400, 455, 480, 54, 0x12122e).setStrokeStyle(2, 0x444466);

    // Buttons — three equal sections filling the bar
    this._makeBtn(241, 455, 'PROMISE C', () => this._sendMessage('promise', opp), '#44ff88');
    const canBribe = GameState.player.gold >= 5;
    this._makeBtn(400, 455, 'BRIBE -5G', () => this._sendMessage('bribe', opp), canBribe ? '#ffdd44' : '#555555', canBribe);
    this._makeBtn(559, 455, 'SKIP', () => this._proceed(), '#aaaaaa');

    // Continue button (appears after action or skip)
    this._continueBtn = this.add.rectangle(400, 517, 200, 36, 0x1a3a1a, 0)
      .setStrokeStyle(0)
      .setInteractive({ useHandCursor: true });
    this._continueTxt = this.add.text(400, 517, '', {
      fontFamily: 'Press Start 2P',
      fontSize: '12px',
      color: '#44ff44',
    }).setOrigin(0.5);
    this._continueBtn.on('pointerdown', () => this._proceed());
    this._actionTaken = false;
  }

  _makeBtn(x, y, label, cb, color = '#ffffff', active = true) {
    const bg = this.add.rectangle(x, y, 158, 50, 0x1a1a3a)
      .setStrokeStyle(1, 0x444466);
    const txt = this.add.text(x, y, label, {
      fontFamily: 'Press Start 2P',
      fontSize: '9px',
      color: active ? color : '#555555',
    }).setOrigin(0.5);

    if (active) {
      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerover', () => bg.setFillStyle(0x2a2a5a));
      bg.on('pointerout',  () => bg.setFillStyle(0x1a1a3a));
      bg.on('pointerdown', cb);
    }
    return { bg, txt };
  }

  _sendMessage(type, opp) {
    if (this._actionTaken) return;
    this._actionTaken = true;

    const reaction = opp.bot.negotiationReact(type);
    GameState.pendingNegotiation = {
      bribed:  type === 'bribe',
      promised: type === 'promise',
      botBonusCoop: reaction.bonusCoopNextTurn,
    };

    if (type === 'bribe') {
      GameState.player.gold = Math.max(0, GameState.player.gold - 5);
    }

    this._responseTxt.setText(reaction.displayText);
    this._continueTxt.setText('[ CONTINUE ]');
    this._continueBtn.setFillStyle(0x1a3a1a).setStrokeStyle(2, 0x44aa44);
  }

  _proceed() {
    if (!GameState.pendingNegotiation) {
      GameState.pendingNegotiation = { bribed: false, promised: false, botBonusCoop: false };
    }
    this.scene.start('BattleScene');
  }
}
