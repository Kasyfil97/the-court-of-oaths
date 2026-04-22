class SetupScene extends Phaser.Scene {
  constructor() { super('SetupScene'); }

  create() {
    this._selectedClass = 'knight';
    this._opponentCount = 3;

    this.add.rectangle(400, 300, 800, 600, 0x0a0a1e);

    // Header
    this.add.text(400, 40, 'CHOOSE YOUR PATH', {
      fontFamily: 'Press Start 2P',
      fontSize: '18px',
      color: '#ffdd44',
    }).setOrigin(0.5);

    const blind = GameState.difficulty === 'blind';
    this.add.text(400, 64, blind ? 'MODE: BLIND COURT' : 'MODE: STANDARD', {
      fontFamily: 'Press Start 2P',
      fontSize: '8px',
      color: blind ? '#ff8844' : '#44ff88',
    }).setOrigin(0.5);

    this._buildDescBox();
    this._buildClassPicker();
    this._buildOpponentPicker();
    this._buildBeginBtn();
    this._buildBackBtn();
  }

  _buildClassPicker() {
    this.add.text(112, 90, 'YOUR CLASS:', {
      fontFamily: 'Press Start 2P',
      fontSize: '10px',
      color: '#aaaaaa',
    });

    this._classBorders = {};
    this._classSprites = {};
    const spriteKeys = ['knight', 'rogue', 'merchant', 'spy'];

    CLASSES.forEach((cls, i) => {
      const x = 167 + i * 155;
      const y = 200;

      const border = this.add.rectangle(x, y, 110, 140, 0x1a1a3a)
        .setStrokeStyle(2, 0x444466)
        .setInteractive({ useHandCursor: true });
      this._classBorders[cls.id] = border;

      const sprite = this.add.sprite(x, y - 20, spriteKeys[i]).setScale(2);
      sprite.play(spriteKeys[i] + '_idle');
      this._classSprites[cls.id] = sprite;

      this.add.text(x, y + 42, cls.name.toUpperCase(), {
        fontFamily: 'Press Start 2P',
        fontSize: '9px',
        color: '#ffffff',
      }).setOrigin(0.5);

      border.on('pointerover', () => {
        if (this._selectedClass !== cls.id) border.setStrokeStyle(2, 0x8888aa);
      });
      border.on('pointerout', () => {
        if (this._selectedClass !== cls.id) border.setStrokeStyle(2, 0x444466);
      });
      border.on('pointerdown', () => this._selectClass(cls.id));
    });

    this._selectClass('knight');
  }

  _selectClass(id) {
    if (this._classBorders[this._selectedClass]) {
      this._classBorders[this._selectedClass].setStrokeStyle(2, 0x444466);
    }
    this._selectedClass = id;
    this._classBorders[id].setStrokeStyle(3, 0xffdd44);
    this._updateDesc(id);
  }

  _buildDescBox() {
    this.add.rectangle(400, 380, 680, 70, 0x111130).setStrokeStyle(1, 0x444466);
    this._descName = this.add.text(70, 358, '', {
      fontFamily: 'Press Start 2P',
      fontSize: '11px',
      color: '#ffdd44',
    });
    this._descAbility = this.add.text(70, 382, '', {
      fontFamily: 'Press Start 2P',
      fontSize: '9px',
      color: '#aaaacc',
      wordWrap: { width: 650 },
    });
  }

  _updateDesc(id) {
    if (!this._descName || !this._descAbility) return;
    const cls = CLASSES.find(c => c.id === id);
    if (!cls) return;
    this._descName.setText(cls.name.toUpperCase());
    this._descAbility.setText('ABILITY: ' + cls.abilityDesc);
  }

  _buildOpponentPicker() {
    this.add.text(160, 440, 'RIVALS:', {
      fontFamily: 'Press Start 2P',
      fontSize: '10px',
      color: '#aaaaaa',
    });

    this._countBtns = {};
    [2, 3, 4, 5].forEach((n, i) => {
      const x = 295 + i * 70;
      const bg = this.add.rectangle(x, 460, 56, 36, 0x1a1a3a)
        .setStrokeStyle(2, 0x444466)
        .setInteractive({ useHandCursor: true });
      const txt = this.add.text(x, 460, String(n), {
        fontFamily: 'Press Start 2P',
        fontSize: '14px',
        color: '#ffffff',
      }).setOrigin(0.5);
      this._countBtns[n] = { bg, txt };
      bg.on('pointerdown', () => this._selectCount(n));
    });
    this._selectCount(3);
  }

  _selectCount(n) {
    for (const [k, { bg }] of Object.entries(this._countBtns)) {
      bg.setStrokeStyle(2, Number(k) === n ? 0xffdd44 : 0x444466);
    }
    this._opponentCount = n;
  }

  _buildBeginBtn() {
    const bg = this.add.rectangle(400, 540, 260, 44, 0x1a3a1a)
      .setStrokeStyle(2, 0x44aa44)
      .setInteractive({ useHandCursor: true });
    this.add.text(400, 540, 'BEGIN', {
      fontFamily: 'Press Start 2P',
      fontSize: '16px',
      color: '#44ff44',
    }).setOrigin(0.5);

    bg.on('pointerover', () => bg.setFillStyle(0x2a5a2a));
    bg.on('pointerout',  () => bg.setFillStyle(0x1a3a1a));
    bg.on('pointerdown', () => {
      const opponents = buildOpponents(this._opponentCount);
      GameState.reset(this._selectedClass, this._opponentCount, opponents, GameState.difficulty || 'normal');
      this.scene.start('MapScene');
    });
  }

  _buildBackBtn() {
    const txt = this.add.text(30, 40, '< BACK', {
      fontFamily: 'Press Start 2P',
      fontSize: '10px',
      color: '#888888',
    }).setInteractive({ useHandCursor: true });
    txt.on('pointerdown', () => this.scene.start('TitleScene'));
  }
}
