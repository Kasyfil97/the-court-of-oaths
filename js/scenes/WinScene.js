class WinScene extends Phaser.Scene {
  constructor() { super('WinScene'); }

  create() {
    // Play victory music
    const audioManager = this.registry.get('audioManager');
    audioManager.playMusic('music_victory');

    this.add.rectangle(400, 300, 800, 600, 0x050510);

    const win = GameState.winCondition || 'economy';
    const labels = {
      economy:    { title: 'ECONOMIC VICTORY',   color: '#ffdd44', sub: 'Your coffers overflow.' },
      diplomacy:  { title: 'DIPLOMATIC VICTORY',  color: '#4488ff', sub: 'Three factions kneel.' },
      domination: { title: 'DOMINATION VICTORY',  color: '#ff4444', sub: 'Your rivals are broken.' },
      honor:      { title: 'HONOR VICTORY',        color: '#eeeeee', sub: 'Your name is legend.' },
    };
    const { title, color, sub } = labels[win] || labels.economy;

    // Rays
    const g = this.add.graphics();
    g.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 0.06);
    for (let a = 0; a < 360; a += 20) {
      const r = a * Math.PI / 180;
      g.fillTriangle(400, 300, 400 + Math.cos(r) * 600, 300 + Math.sin(r) * 600,
        400 + Math.cos(r + 0.17) * 600, 300 + Math.sin(r + 0.17) * 600);
    }

    this.add.text(400, 120, title, {
      fontFamily: 'Press Start 2P',
      fontSize: '22px',
      color,
    }).setOrigin(0.5);

    this.add.text(400, 168, sub, {
      fontFamily: 'Press Start 2P',
      fontSize: '11px',
      color: '#888888',
    }).setOrigin(0.5);

    // Final stats
    const p = GameState.player;
    this.add.text(400, 220, `GOLD: ${p.gold}   TRUST: ${p.trust}   HONOR: ${p.honor}`, {
      fontFamily: 'Press Start 2P',
      fontSize: '10px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    this.add.text(400, 248, `TURNS PLAYED: ${GameState.turnNumber}`, {
      fontFamily: 'Press Start 2P',
      fontSize: '10px',
      color: '#666666',
    }).setOrigin(0.5);

    // Opponent summary
    this.add.text(400, 280, 'RIVAL STATUS', {
      fontFamily: 'Press Start 2P',
      fontSize: '9px',
      color: '#888888',
    }).setOrigin(0.5);

    GameState.opponents.forEach((o, i) => {
      const status = o.eliminated ? 'ELIMINATED' : `G:${o.gold} T:${o.trust} H:${o.honor}`;
      const c = o.eliminated ? '#ff4444' : '#aaaacc';
      this.add.text(400, 302 + i * 22, `${o.name}: ${status}`, {
        fontFamily: 'Press Start 2P', fontSize: '8px', color: c,
      }).setOrigin(0.5);
    });

    // Move history grids
    const histY = 320 + GameState.opponents.length * 22 + 20;
    this.add.text(400, histY, 'MOVE HISTORY', {
      fontFamily: 'Press Start 2P', fontSize: '9px', color: '#888888',
    }).setOrigin(0.5);

    GameState.opponents.forEach((o, oi) => {
      const hist = GameState.playerMoveHistory[o.id] || [];
      const rowY = histY + 24 + oi * 22;
      this.add.text(80, rowY, o.name.slice(0, 8) + ':', {
        fontFamily: 'Press Start 2P', fontSize: '7px', color: '#aaaacc',
      }).setOrigin(0, 0.5);
      hist.forEach((m, mi) => {
        const col = m === 'C' ? 0x44aa44 : 0xaa4444;
        this.add.rectangle(240 + mi * 18, rowY, 14, 14, col).setStrokeStyle(1, 0x000000);
        this.add.text(240 + mi * 18, rowY, m, {
          fontFamily: 'Press Start 2P', fontSize: '7px', color: '#ffffff',
        }).setOrigin(0.5);
      });
    });

    // Buttons
    const btnY = Math.min(530, histY + 24 + GameState.opponents.length * 22 + 40);
    this._makeBtn(300, btnY, 'NEW GAME', () => {
      localStorage.removeItem('court_save');
      this.scene.start('SetupScene');
    }, '#44ff44');
    this._makeBtn(520, btnY, 'MAIN MENU', () => {
      localStorage.removeItem('court_save');
      this.scene.start('TitleScene');
    }, '#aaaaaa');
  }

  _makeBtn(x, y, label, cb, color) {
    const bg = this.add.rectangle(x, y, 190, 40, 0x1a1a3a)
      .setStrokeStyle(2, 0x444466)
      .setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, {
      fontFamily: 'Press Start 2P', fontSize: '11px', color,
    }).setOrigin(0.5);
    bg.on('pointerover', () => bg.setFillStyle(0x2a2a5a));
    bg.on('pointerout',  () => bg.setFillStyle(0x1a1a3a));
    bg.on('pointerdown', cb);
  }
}
