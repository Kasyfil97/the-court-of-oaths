class TitleScene extends Phaser.Scene {
  constructor() { super('TitleScene'); }

  create() {
    // Background — deep starfield
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
    g.lineBetween(60, 268, 740, 268);
    g.lineBetween(60, 510, 740, 510);

    // Logo image (generated in BootScene)
    const logo = this.add.image(400, 148, 'logo').setScale(1.15);

    // Glow pulse on logo
    this.tweens.add({
      targets: logo,
      alpha: { from: 0.85, to: 1 },
      duration: 1800,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1,
    });

    // Title lettering
    // Shadow layer
    this.add.text(402, 292, 'THE COURT OF OATHS', {
      fontFamily: 'Press Start 2P',
      fontSize: '22px',
      color: '#442200',
    }).setOrigin(0.5);
    // Main layer
    const titleTxt = this.add.text(400, 290, 'THE COURT OF OATHS', {
      fontFamily: 'Press Start 2P',
      fontSize: '22px',
      color: '#ffdd44',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(400, 326, '— A  P R I S O N E R \'S  D I L E M M A —', {
      fontFamily: 'Press Start 2P',
      fontSize: '8px',
      color: '#886622',
    }).setOrigin(0.5);

    // Buttons
    this._makeBtn(400, 390, 'NEW GAME', () => this.scene.start('SetupScene'), '#44ff88');

    const hasSave = GameState.hasSave();
    this._makeBtn(400, 446, 'LOAD GAME', () => {
      if (GameState.load()) {
        for (const opp of GameState.opponents) {
          const Cls = BOT_ARCHETYPES.find(B => new B().archetypeId === opp.archetype);
          if (Cls) opp.bot = new Cls();
        }
        this.scene.start('MapScene');
      }
    }, hasSave ? '#aaddff' : '#444455', hasSave);

    this._makeBtn(400, 502, 'GAME RULES', () => this._showAbout(), '#ffdd44');

    // Version tag
    this.add.text(790, 590, 'v0.1', {
      fontFamily: 'Press Start 2P',
      fontSize: '8px',
      color: '#333344',
    }).setOrigin(1, 1);

    this._aboutOverlay = null;
  }

  _drawStars() {
    const g = this.add.graphics();
    // Deterministic star field using a simple LCG
    let seed = 42;
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

  _makeBtn(x, y, label, cb, color = '#ffffff', active = true) {
    const bg = this.add.rectangle(x, y, 260, 44, 0x1a1a3a)
      .setStrokeStyle(2, 0x886600)
      .setInteractive({ useHandCursor: active });

    const txt = this.add.text(x, y, label, {
      fontFamily: 'Press Start 2P',
      fontSize: '14px',
      color: active ? color : '#555555',
    }).setOrigin(0.5);

    if (active) {
      bg.on('pointerover', () => bg.setFillStyle(0x2a2a5a));
      bg.on('pointerout',  () => bg.setFillStyle(0x1a1a3a));
      bg.on('pointerdown', cb);
    }
    return { bg, txt };
  }

  _showAbout() {
    if (this._aboutOverlay) return;

    const PAGES = [
      {
        title: 'THE DILEMMA',
        color: '#ffdd44',
        lines: [
          { text: 'Each turn you face one rival.', color: '#cccccc' },
          { text: 'Both secretly choose:', color: '#cccccc' },
          { text: '', color: '#cccccc' },
          { text: 'COOPERATE  or  BETRAY', color: '#ffffff' },
          { text: '', color: '#cccccc' },
          { text: 'Choices are revealed simultaneously.', color: '#cccccc' },
          { text: 'Resources update based on the', color: '#cccccc' },
          { text: 'combination of both choices.', color: '#cccccc' },
          { text: '', color: '#cccccc' },
          { text: 'Navigate the map to choose', color: '#cccccc' },
          { text: 'which rival to face each turn.', color: '#cccccc' },
        ],
      },
      {
        title: 'OUTCOME MATRIX',
        color: '#44ff88',
        lines: [
          { text: 'BOTH COOPERATE:', color: '#44ff88' },
          { text: '  Each: +2 Trust, +1 Gold', color: '#aaffcc' },
          { text: '', color: '#cccccc' },
          { text: 'BOTH BETRAY:', color: '#ff8844' },
          { text: '  Each: -2 Trust, -1 Gold', color: '#ffccaa' },
          { text: '', color: '#cccccc' },
          { text: 'YOU BETRAY, THEY COOPERATE:', color: '#ff4444' },
          { text: '  You:  +5 Gold, -3 Honor', color: '#ffaaaa' },
          { text: '  Them: -3 Gold', color: '#ffaaaa' },
          { text: '', color: '#cccccc' },
          { text: 'YOU COOPERATE, THEY BETRAY:', color: '#aaaaff' },
          { text: '  You:  -3 Gold', color: '#ccccff' },
          { text: '  Them: +5 Gold, -3 Honor', color: '#ccccff' },
        ],
      },
      {
        title: 'WIN CONDITIONS',
        color: '#4488ff',
        lines: [
          { text: 'ECONOMY (Gold \u2265 100)', color: '#ffdd44' },
          { text: '  Accumulate wealth through', color: '#aaaaaa' },
          { text: '  trade and betrayal.', color: '#aaaaaa' },
          { text: '', color: '#cccccc' },
          { text: 'DIPLOMACY (Trust \u2265 70 \u00d7 3)', color: '#4488ff' },
          { text: '  Build max Trust with 3+', color: '#aaaaaa' },
          { text: '  factions through cooperation.', color: '#aaaaaa' },
          { text: '', color: '#cccccc' },
          { text: 'DOMINATION (2 rivals at 0 Gold)', color: '#ff4444' },
          { text: '  Drain two rivals\' coffers', color: '#aaaaaa' },
          { text: '  to eliminate them.', color: '#aaaaaa' },
          { text: '', color: '#cccccc' },
          { text: 'HONOR (15 turns, never betray)', color: '#eeeeee' },
          { text: '  Keep Honor \u2265 60. Stay loyal.', color: '#aaaaaa' },
        ],
      },
      {
        title: 'CLASSES',
        color: '#cc44cc',
        lines: [
          { text: 'KNIGHT', color: '#aaccff' },
          { text: '  +1 Honor each time you', color: '#aaaaaa' },
          { text: '  Cooperate. Honor path.', color: '#aaaaaa' },
          { text: '', color: '#cccccc' },
          { text: 'ROGUE', color: '#88bb44' },
          { text: '  +2 extra Gold each Betray.', color: '#aaaaaa' },
          { text: '  Total +7G when betraying.', color: '#aaaaaa' },
          { text: '', color: '#cccccc' },
          { text: 'MERCHANT', color: '#ffdd66' },
          { text: '  All Gold gains/losses x1.5.', color: '#aaaaaa' },
          { text: '  Fastest path to Economy win.', color: '#aaaaaa' },
          { text: '', color: '#cccccc' },
          { text: 'SPY', color: '#cc44cc' },
          { text: '  See rival\'s move for 1.5s', color: '#aaaaaa' },
          { text: '  before you commit.', color: '#aaaaaa' },
        ],
      },
      {
        title: 'RIVALS & NEGOTIATION',
        color: '#ff8844',
        lines: [
          { text: 'BOT ARCHETYPES:', color: '#ffdd44' },
          { text: '  The Saint    - always cooperates', color: '#aaaaaa' },
          { text: '  The Serpent  - always betrays', color: '#aaaaaa' },
          { text: '  The Mirror   - copies your last move', color: '#aaaaaa' },
          { text: '  The Grudge   - betrays once crossed', color: '#aaaaaa' },
          { text: '  The Flatterer- friendly, then betrays', color: '#aaaaaa' },
          { text: '', color: '#cccccc' },
          { text: 'NEGOTIATION PHASE:', color: '#ffdd44' },
          { text: '  Before each turn you may:', color: '#aaaaaa' },
          { text: '  PROMISE C  - signal intent', color: '#aaaaaa' },
          { text: '  BRIBE (-5G)- spend Gold to', color: '#aaaaaa' },
          { text: '               influence a bot', color: '#aaaaaa' },
          { text: '  Promises are NOT binding.', color: '#888866' },
          { text: '  Bots may or may not comply.', color: '#888866' },
        ],
      },
    ];

    let page = 0;
    const overlay = this.add.container(0, 0);
    this._aboutOverlay = overlay;

    // Dim background
    const dim = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6);
    overlay.add(dim);

    // Panel
    const panel = this.add.rectangle(400, 305, 660, 480, 0x0a0a1e)
      .setStrokeStyle(2, 0xffdd44);
    overlay.add(panel);

    // Page indicator
    const pageTxt = this.add.text(400, 74, '', {
      fontFamily: 'Press Start 2P', fontSize: '8px', color: '#555566',
    }).setOrigin(0.5);
    overlay.add(pageTxt);

    // Title
    const titleTxt = this.add.text(400, 96, '', {
      fontFamily: 'Press Start 2P', fontSize: '14px', color: '#ffdd44',
    }).setOrigin(0.5);
    overlay.add(titleTxt);

    // Divider
    const divG = this.add.graphics();
    divG.lineStyle(1, 0x443300);
    divG.lineBetween(100, 114, 700, 114);
    overlay.add(divG);

    // Content text objects (max 15 lines)
    const lineObjs = [];
    for (let i = 0; i < 15; i++) {
      const t = this.add.text(120, 126 + i * 24, '', {
        fontFamily: 'Press Start 2P', fontSize: '9px', color: '#cccccc',
      });
      lineObjs.push(t);
      overlay.add(t);
    }

    // Nav buttons
    const prevBtn = this.add.text(140, 524, '< PREV', {
      fontFamily: 'Press Start 2P', fontSize: '11px', color: '#888888',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    overlay.add(prevBtn);

    const nextBtn = this.add.text(550, 524, 'NEXT >', {
      fontFamily: 'Press Start 2P', fontSize: '11px', color: '#888888',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    overlay.add(nextBtn);

    const closeBtn = this.add.text(400, 524, '[ CLOSE ]', {
      fontFamily: 'Press Start 2P', fontSize: '11px', color: '#ffdd44',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    overlay.add(closeBtn);

    const render = () => {
      const p = PAGES[page];
      pageTxt.setText(`${page + 1} / ${PAGES.length}`);
      titleTxt.setText(p.title).setColor(p.color);
      lineObjs.forEach((t, i) => {
        const entry = p.lines[i];
        if (entry) {
          t.setText(entry.text).setColor(entry.color);
        } else {
          t.setText('');
        }
      });
      prevBtn.setColor(page > 0 ? '#888888' : '#333333');
      nextBtn.setColor(page < PAGES.length - 1 ? '#888888' : '#333333');
    };

    prevBtn.on('pointerdown', () => { if (page > 0) { page--; render(); } });
    nextBtn.on('pointerdown', () => { if (page < PAGES.length - 1) { page++; render(); } });
    closeBtn.on('pointerdown', () => { overlay.destroy(); this._aboutOverlay = null; });

    render();
  }
}
