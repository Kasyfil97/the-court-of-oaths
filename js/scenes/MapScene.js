class MapScene extends Phaser.Scene {
  constructor() { super('MapScene'); }

  create() {
    this._sprites = {};
    this._nameLabels = {};
    this._portraits = {};

    // Background
    this.add.image(400, 300, 'map_bg');

    // Title bar
    this.add.rectangle(400, 22, 800, 44, 0x0a0a1e, 0.85);
    this.add.text(400, 22, 'THE COURT OF OATHS', {
      fontFamily: 'Press Start 2P',
      fontSize: '11px',
      color: '#ffdd44',
    }).setOrigin(0.5);

    this._buildPlayerHUD();
    this._buildOpponentPortraits();
    this._placeCharacters();
    this._updatePositions(false);

    // Turn counter
    this._turnTxt = this.add.text(660, 22, 'TURN ' + GameState.turnNumber, {
      fontFamily: 'Press Start 2P',
      fontSize: '9px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    // Win condition hint
    this._buildWinHints();

    // Menu button (top-right)
    this._buildMenuOverlay();
  }

  _buildPlayerHUD() {
    const p = GameState.player;
    const cls = CLASSES.find(c => c.id === GameState.playerClass);

    this.add.rectangle(80, 130, 150, 120, 0x0a0a1e, 0.8).setStrokeStyle(1, 0xffdd44);
    this.add.text(80, 80, cls ? cls.name.toUpperCase() : 'PLAYER', {
      fontFamily: 'Press Start 2P',
      fontSize: '9px',
      color: '#ffdd44',
    }).setOrigin(0.5);

    this._barGold  = this._makeBar(80, 105, p.gold,  0xffdd44, 'icon_gold');
    this._barTrust = this._makeBar(80, 128, p.trust, 0x4488ff, 'icon_trust');
    this._barHonor = this._makeBar(80, 151, p.honor, 0xeeeeee, 'icon_honor');
  }

  _makeBar(x, y, val, color, iconKey) {
    const BAR_W = 80;
    this.add.image(x - 52, y, iconKey).setScale(1);
    const bg  = this.add.rectangle(x + 4, y, BAR_W, 10, 0x222222);
    const fill = this.add.rectangle(x + 4 - BAR_W / 2, y, (val / 120) * BAR_W, 10, color).setOrigin(0, 0.5);
    const num  = this.add.text(x + 50, y, String(val), {
      fontFamily: 'Press Start 2P', fontSize: '8px', color: '#ffffff',
    }).setOrigin(0, 0.5);
    return { fill, num, bg, color, BAR_W };
  }

  _updateBar(bar, val) {
    const w = (Math.max(0, val) / 120) * bar.BAR_W;
    this.tweens.add({ targets: bar.fill, width: w, duration: 400 });
    bar.num.setText(String(Math.round(val)));
  }

  _buildOpponentPortraits() {
    const opp = GameState.opponents;
    const startX = 400 - ((opp.length - 1) * 130) / 2;

    opp.forEach((o, i) => {
      const x = startX + i * 130;
      const y = 540;

      const botKey = i % 2 === 0 ? 'bot_a' : 'bot_b';
      const bg = this.add.rectangle(x, y, 110, 80, 0x111122, 0.9)
        .setStrokeStyle(2, o.eliminated ? 0x333333 : 0x6644aa);

      const sprite = this.add.sprite(x, y - 16, botKey).setScale(1.5);
      if (!o.eliminated) sprite.play('bot_a_idle');
      else sprite.setTint(0x444444);

      const nameTxt = this.add.text(x, y + 26, o.name.toUpperCase().slice(0, 10), {
        fontFamily: 'Press Start 2P',
        fontSize: '7px',
        color: o.eliminated ? '#555555' : '#aaaacc',
      }).setOrigin(0.5);

      this._portraits[o.id] = { bg, sprite, nameTxt };

      if (!o.eliminated) {
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerover', () => bg.setStrokeStyle(3, 0xffdd44));
        bg.on('pointerout',  () => bg.setStrokeStyle(2, 0x6644aa));
        bg.on('pointerdown', () => {
          GameState.currentOpponentId = o.id;
          this.scene.start('NegotiationScene');
        });
      }
    });
  }

  _placeCharacters() {
    // Player sprite on road
    const cls = GameState.playerClass;
    const s = this.add.sprite(400, 500, cls).setScale(2);
    s.play(cls + '_idle');
    this._sprites['player'] = s;

    const lbl = this.add.text(400, 450, 'YOU', {
      fontFamily: 'Press Start 2P', fontSize: '8px', color: '#ffdd44',
    }).setOrigin(0.5);
    this._nameLabels['player'] = lbl;

    // Opponent road sprites (offset left/right of center road)
    const offsets = [-40, 40, -70, 70, 0];
    GameState.opponents.forEach((opp, i) => {
      const xOff = offsets[i % offsets.length];
      const botKey = i % 2 === 0 ? 'bot_a' : 'bot_b';
      const os = this.add.sprite(400 + xOff, 500, botKey).setScale(1.5);
      if (!opp.eliminated) os.play('bot_a_idle');
      else os.setTint(0x444444);
      this._sprites[opp.id] = os;

      const ol = this.add.text(400 + xOff, 470, opp.name.slice(0, 6), {
        fontFamily: 'Press Start 2P', fontSize: '7px', color: '#aa88ff',
      }).setOrigin(0.5);
      this._nameLabels[opp.id] = ol;
    });
  }

  _resourceTotal(res) {
    return (res.gold || 0) + (res.trust || 0) + (res.honor || 0);
  }

  _roadY(total) {
    // Road runs from y=500 (bottom) to y=230 (near castle gate)
    const ratio = Math.min(1, Math.max(0, total / (120 * 3)));
    return 500 - ratio * 270;
  }

  _updatePositions(tween = true) {
    const update = (key, res, lblOffset = 28) => {
      const sprite = this._sprites[key];
      const lbl    = this._nameLabels[key];
      if (!sprite) return;
      const total = this._resourceTotal(res);
      const y = this._roadY(total);
      if (tween) {
        this.tweens.add({ targets: sprite, y, duration: 600, ease: 'Quad.Out' });
        if (lbl) this.tweens.add({ targets: lbl, y: y - lblOffset, duration: 600, ease: 'Quad.Out' });
      } else {
        sprite.y = y;
        if (lbl) lbl.y = y - lblOffset;
      }
    };

    update('player', GameState.player, 50);
    for (const opp of GameState.opponents) {
      update(opp.id, { gold: opp.gold, trust: opp.trust, honor: opp.honor });
    }
  }

  _buildWinHints() {
    const hints = [
      { label: 'ECONOMY',   desc: 'Gold \u2265 100',      color: '#ffdd44' },
      { label: 'DIPLOMACY', desc: 'Trust \u2265 70 \xd7 3', color: '#4488ff' },
      { label: 'DOMINATION',desc: '2 rivals \u2264 0 Gold', color: '#ff4444' },
      { label: 'HONOR',     desc: '15 turns, no Betray', color: '#eeeeee' },
    ];

    this.add.rectangle(680, 300, 200, 200, 0x0a0a1e, 0.8).setStrokeStyle(1, 0x444466);
    this.add.text(680, 215, 'WIN BY:', {
      fontFamily: 'Press Start 2P', fontSize: '9px', color: '#888888',
    }).setOrigin(0.5);

    hints.forEach((h, i) => {
      this.add.text(600, 240 + i * 42, h.label, {
        fontFamily: 'Press Start 2P', fontSize: '8px', color: h.color,
      });
      this.add.text(600, 256 + i * 42, h.desc, {
        fontFamily: 'Press Start 2P', fontSize: '7px', color: '#666688',
      });
    });
  }

  _buildMenuOverlay() {
    // Dimmer overlay (hidden by default)
    const dimmer = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6)
      .setDepth(10).setVisible(false).setInteractive();
    dimmer.on('pointerdown', () => this._toggleMenu(false));

    // Panel
    const panel = this.add.rectangle(400, 300, 220, 130, 0x0a0a1e, 0.97)
      .setStrokeStyle(1, 0x6644aa).setDepth(11).setVisible(false);

    const makeBtn = (y, label, cb) => {
      const bg = this.add.rectangle(400, y, 180, 36, 0x1a1a3e)
        .setStrokeStyle(1, 0x6644aa).setDepth(12).setVisible(false).setInteractive({ useHandCursor: true });
      const txt = this.add.text(400, y, label, {
        fontFamily: 'Press Start 2P', fontSize: '8px', color: '#cccccc',
      }).setOrigin(0.5).setDepth(13).setVisible(false);
      bg.on('pointerover', () => { bg.setFillStyle(0x332255); txt.setColor('#ffffff'); });
      bg.on('pointerout',  () => { bg.setFillStyle(0x1a1a3e); txt.setColor('#cccccc'); });
      bg.on('pointerdown', cb);
      return [bg, txt];
    };

    const [rb, rt] = makeBtn(278, 'RESTART', () => {
      Object.assign(GameState, { turnNumber: 0, player: { gold: 30, trust: 30, honor: 30 } });
      this.scene.start('SetupScene');
    });
    const [hb, ht] = makeBtn(322, 'HOME', () => this.scene.start('TitleScene'));

    this._menuItems = [dimmer, panel, rb, rt, hb, ht];
    this._menuOpen  = false;

    // Hamburger button in top-right header
    const btn = this.add.text(778, 22, '\u2630', {
      fontFamily: 'Press Start 2P', fontSize: '11px', color: '#aaaaaa',
    }).setOrigin(0.5).setDepth(14).setInteractive({ useHandCursor: true });
    btn.on('pointerover', () => btn.setColor('#ffffff'));
    btn.on('pointerout',  () => btn.setColor(this._menuOpen ? '#ffffff' : '#aaaaaa'));
    btn.on('pointerdown', () => this._toggleMenu());
    this._menuBtn = btn;
  }

  _toggleMenu(forceClose) {
    this._menuOpen = forceClose === false ? false : !this._menuOpen;
    this._menuItems.forEach(o => o.setVisible(this._menuOpen));
    this._menuBtn.setColor(this._menuOpen ? '#ffffff' : '#aaaaaa');
  }

  // Called when returning from BattleScene
  refreshAfterBattle() {
    this._turnTxt.setText('TURN ' + GameState.turnNumber);

    // Update player bars
    const p = GameState.player;
    this._updateBar(this._barGold,  p.gold);
    this._updateBar(this._barTrust, p.trust);
    this._updateBar(this._barHonor, p.honor);

    // Update character positions
    this._updatePositions(true);

    // Update opponent portrait styles
    for (const o of GameState.opponents) {
      const portrait = this._portraits[o.id];
      if (!portrait) continue;
      if (o.eliminated) {
        portrait.bg.setStrokeStyle(1, 0x333333).disableInteractive();
        portrait.sprite.setTint(0x444444);
        portrait.nameTxt.setColor('#555555');
      }
    }

    // Check win conditions
    const win = checkWinConditions(GameState);
    if (win) {
      GameState.winCondition = win;
      this.time.delayedCall(800, () => this.scene.start('WinScene'));
    }
  }
}
