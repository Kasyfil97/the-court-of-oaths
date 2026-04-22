class ModeSelectScene extends Phaser.Scene {
  constructor() { super('ModeSelectScene'); }

  create() {
    // Background — deep starfield (matches TitleScene)
    this.add.rectangle(400, 300, 800, 600, 0x05050f);
    this._drawStars();

    // Decorative borders
    const g = this.add.graphics();
    g.lineStyle(3, 0x886600);
    g.strokeRect(10, 10, 780, 580);
    g.lineStyle(1, 0xffdd44, 0.3);
    g.strokeRect(16, 16, 768, 568);

    // Corner ornaments
    this._drawCornerOrnaments(g);

    // Horizontal dividers
    g.lineStyle(1, 0x443300, 0.8);
    g.lineBetween(60, 110, 740, 110);
    g.lineBetween(60, 530, 740, 530);

    // Heading
    this.add.text(402, 62, 'CHOOSE A MODE', {
      fontFamily: 'Press Start 2P',
      fontSize: '22px',
      color: '#442200',
    }).setOrigin(0.5);
    this.add.text(400, 60, 'CHOOSE A MODE', {
      fontFamily: 'Press Start 2P',
      fontSize: '22px',
      color: '#ffdd44',
    }).setOrigin(0.5);

    this.add.text(400, 92, '— HOW MUCH DO YOU WANT TO KNOW? —', {
      fontFamily: 'Press Start 2P',
      fontSize: '8px',
      color: '#886622',
    }).setOrigin(0.5);

    // NORMAL card (left)
    this._buildModeCard({
      x: 210,
      title: 'NORMAL',
      titleColor: '#44ff88',
      borderColor: 0x44aa66,
      lines: [
        'The rival\'s archetype',
        'is shown during',
        'Negotiation.',
        '',
        'You know who',
        'you\'re facing.',
      ],
      onPick: () => {
        GameState.difficulty = 'normal';
        this.scene.start('SetupScene');
      },
    });

    // BLIND COURT card (right)
    this._buildModeCard({
      x: 590,
      title: 'BLIND COURT',
      titleColor: '#ff8844',
      borderColor: 0xaa6644,
      lines: [
        'Archetypes are',
        'NEVER revealed.',
        '',
        'Deduce each rival\'s',
        'strategy from their',
        'moves. Harder.',
      ],
      onPick: () => {
        GameState.difficulty = 'blind';
        this.scene.start('SetupScene');
      },
    });

    // Back button
    const back = this.add.text(30, 40, '< BACK', {
      fontFamily: 'Press Start 2P',
      fontSize: '10px',
      color: '#888888',
    }).setInteractive({ useHandCursor: true });
    back.on('pointerover', () => back.setColor('#ffdd44'));
    back.on('pointerout',  () => back.setColor('#888888'));
    back.on('pointerdown', () => this.scene.start('TitleScene'));

    // Footer hint
    this.add.text(400, 560, 'Click a card to continue', {
      fontFamily: 'Press Start 2P',
      fontSize: '8px',
      color: '#555566',
    }).setOrigin(0.5);
  }

  _buildModeCard({ x, title, titleColor, borderColor, lines, onPick }) {
    const cardY = 300;
    const cardW = 300;
    const cardH = 340;

    // Card frame
    const card = this.add.rectangle(x, cardY, cardW, cardH, 0x0a0a1e)
      .setStrokeStyle(2, borderColor)
      .setInteractive({ useHandCursor: true });

    // Inner soft border
    const inner = this.add.graphics();
    inner.lineStyle(1, borderColor, 0.3);
    inner.strokeRect(x - cardW / 2 + 8, cardY - cardH / 2 + 8, cardW - 16, cardH - 16);

    // Title
    const titleTxt = this.add.text(x, cardY - 130, title, {
      fontFamily: 'Press Start 2P',
      fontSize: '16px',
      color: titleColor,
    }).setOrigin(0.5);

    // Divider under title
    const tdiv = this.add.graphics();
    tdiv.lineStyle(1, borderColor, 0.6);
    tdiv.lineBetween(x - 100, cardY - 108, x + 100, cardY - 108);

    // Description lines — outside any button, inside the card
    lines.forEach((line, i) => {
      this.add.text(x, cardY - 80 + i * 22, line, {
        fontFamily: 'Press Start 2P',
        fontSize: '9px',
        color: '#cccccc',
      }).setOrigin(0.5);
    });

    // CHOOSE button at card bottom
    const btnY = cardY + 120;
    const btnBg = this.add.rectangle(x, btnY, 180, 36, 0x1a1a3a)
      .setStrokeStyle(2, borderColor);
    const btnTxt = this.add.text(x, btnY, 'CHOOSE', {
      fontFamily: 'Press Start 2P',
      fontSize: '11px',
      color: titleColor,
    }).setOrigin(0.5);

    const hoverOn  = () => {
      card.setFillStyle(0x14143a);
      card.setStrokeStyle(3, borderColor);
      btnBg.setFillStyle(0x2a2a5a);
    };
    const hoverOff = () => {
      card.setFillStyle(0x0a0a1e);
      card.setStrokeStyle(2, borderColor);
      btnBg.setFillStyle(0x1a1a3a);
    };
    card.on('pointerover', hoverOn);
    card.on('pointerout',  hoverOff);
    card.on('pointerdown', onPick);
  }

  _drawStars() {
    const g = this.add.graphics();
    let seed = 73;
    const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
    for (let i = 0; i < 120; i++) {
      const x = rand() * 800;
      const y = rand() * 600;
      const r = rand();
      const size  = r < 0.7 ? 1 : 2;
      const alpha = 0.2 + rand() * 0.6;
      g.fillStyle(0xffffff, alpha);
      g.fillRect(x, y, size, size);
    }
  }

  _drawCornerOrnaments(g) {
    const corners = [[26, 26], [774, 26], [26, 574], [774, 574]];
    const dirs    = [[1,1],   [-1,1],    [1,-1],    [-1,-1]];
    corners.forEach(([cx, cy], i) => {
      const [dx, dy] = dirs[i];
      g.fillStyle(0xffdd44, 0.9);
      g.fillRect(cx, cy, dx * 12, 3);
      g.fillRect(cx, cy, 3, dy * 12);
      g.fillRect(cx + dx * 4, cy + dy * 4, dx * 6, 2);
      g.fillRect(cx + dx * 4, cy + dy * 4, 2, dy * 6);
    });
  }
}
