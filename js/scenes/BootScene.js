class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  create() {
    this._genMapBg();
    this._genUISprites();
    this._genLogo();
    this._genCharacters();
    this._genAnimations();
    this.scene.start('TitleScene');
  }

  _genMapBg() {
    const g = this.add.graphics();

    // Sky gradient (dark blue)
    g.fillGradientStyle(0x0a0a2a, 0x0a0a2a, 0x1a1a3a, 0x1a1a3a, 1);
    g.fillRect(0, 0, 800, 600);

    // Grass
    g.fillStyle(0x1a4a1a);
    g.fillRect(0, 200, 800, 400);

    // Castle silhouette at top
    g.fillStyle(0x2a2a4a);
    g.fillRect(320, 80, 160, 140);   // main keep
    g.fillRect(280, 100, 60, 120);   // left tower
    g.fillRect(460, 100, 60, 120);   // right tower
    g.fillRect(350, 50, 30, 50);     // left merlon
    g.fillRect(390, 50, 30, 50);
    g.fillRect(430, 50, 30, 50);

    // Castle gate
    g.fillStyle(0x111122);
    g.fillRect(375, 140, 50, 80);

    // Gate arch
    g.fillStyle(0x111122);
    g.fillEllipse(400, 140, 50, 30);

    // Dirt road leading to castle
    g.fillStyle(0x6b5040);
    g.fillTriangle(340, 600, 460, 600, 390, 220);
    g.fillTriangle(340, 600, 460, 600, 410, 220);

    // Road center line
    g.lineStyle(2, 0x8b7060, 0.4);
    g.beginPath();
    g.moveTo(400, 600);
    g.lineTo(400, 220);
    g.strokePath();

    // Throne marker at road top
    g.fillStyle(0xffdd44);
    g.fillRect(392, 212, 16, 16);
    g.fillStyle(0xff8800);
    g.fillTriangle(392, 212, 408, 212, 400, 200);

    g.generateTexture('map_bg', 800, 600);
    g.destroy();
  }

  _genUISprites() {
    const g = this.add.graphics();

    // 1×1 white pixel for tween-scalable bars
    g.fillStyle(0xffffff);
    g.fillRect(0, 0, 1, 1);
    g.generateTexture('pixel_white', 1, 1);
    g.clear();

    // Resource icons (12×12)
    // Gold coin
    g.fillStyle(0xffdd44);
    g.fillCircle(6, 6, 5);
    g.fillStyle(0xcc9900);
    g.fillCircle(6, 6, 3);
    g.generateTexture('icon_gold', 12, 12);
    g.clear();

    // Trust heart
    g.fillStyle(0x4488ff);
    g.fillRect(2, 5, 4, 6);
    g.fillRect(6, 5, 4, 6);
    g.fillRect(0, 3, 5, 4);
    g.fillRect(7, 3, 5, 4);
    g.fillRect(1, 1, 4, 3);
    g.fillRect(7, 1, 4, 3);
    g.fillTriangle(0, 7, 12, 7, 6, 12);
    g.generateTexture('icon_trust', 12, 12);
    g.clear();

    // Honor shield
    g.fillStyle(0xeeeeee);
    g.fillRect(2, 0, 8, 8);
    g.fillTriangle(2, 8, 10, 8, 6, 12);
    g.fillStyle(0xaaaaaa);
    g.fillRect(4, 2, 4, 4);
    g.generateTexture('icon_honor', 12, 12);
    g.clear();

    // Speech bubble (80×32)
    g.fillStyle(0xffffff, 0.9);
    g.fillRoundedRect(0, 0, 80, 32, 8);
    g.fillStyle(0x000000, 0.8);
    g.lineStyle(2, 0x000000);
    g.strokeRoundedRect(0, 0, 80, 32, 8);
    g.generateTexture('speech_bubble', 80, 32);
    g.clear();

    // Padlock (20×24)
    g.fillStyle(0x888888);
    g.fillRect(4, 10, 12, 14);
    g.lineStyle(3, 0x888888);
    g.strokeCircle(10, 8, 6);
    g.fillStyle(0xffffff);
    g.fillRect(8, 14, 4, 6);
    g.generateTexture('padlock', 20, 24);
    g.clear();

    g.destroy();
  }

  _genLogo() {
    // Logo: 160×180 — crown above a shield with crossed swords
    const W = 160, H = 180;
    const g = this.add.graphics();

    const GOLD   = 0xffdd44;
    const LGOLD  = 0xffee88;
    const DGOLD  = 0xaa8800;
    const NAVY   = 0x0a0a2e;
    const DNAVY  = 0x050518;
    const SILVER = 0xccddee;
    const LSILV  = 0xeef4ff;
    const DSILV  = 0x8899aa;
    const RED    = 0xcc2222;

    // --- CROWN (top, centered at x=80) ---
    // Crown base band
    g.fillStyle(DGOLD);
    g.fillRect(38, 68, 84, 14);
    g.fillStyle(GOLD);
    g.fillRect(40, 70, 80, 10);
    // Crown highlight
    g.fillStyle(LGOLD);
    g.fillRect(42, 70, 76, 3);

    // Left spike
    g.fillStyle(DGOLD);
    g.fillRect(38, 38, 8, 32);
    g.fillStyle(GOLD);
    g.fillRect(40, 36, 6, 34);
    // Left spike gem
    g.fillStyle(RED);
    g.fillRect(42, 38, 4, 4);

    // Center spike (tallest)
    g.fillStyle(DGOLD);
    g.fillRect(76, 18, 10, 52);
    g.fillStyle(GOLD);
    g.fillRect(78, 16, 8, 54);
    g.fillStyle(LGOLD);
    g.fillRect(79, 17, 4, 4);
    // Center spike gem (larger)
    g.fillStyle(0x4488ff);
    g.fillRect(80, 20, 5, 5);

    // Right spike
    g.fillStyle(DGOLD);
    g.fillRect(114, 38, 8, 32);
    g.fillStyle(GOLD);
    g.fillRect(114, 36, 6, 34);
    // Right spike gem
    g.fillStyle(RED);
    g.fillRect(115, 38, 4, 4);

    // Crown jewel row on band
    g.fillStyle(0x44aaff);
    g.fillRect(52, 72, 6, 6);
    g.fillStyle(RED);
    g.fillRect(66, 72, 6, 6);
    g.fillStyle(0x44aaff);
    g.fillRect(80, 72, 6, 6);
    g.fillStyle(RED);
    g.fillRect(94, 72, 6, 6);
    g.fillStyle(0x44aaff);
    g.fillRect(108, 72, 6, 6);

    // --- SHIELD body ---
    // Shadow
    g.fillStyle(0x000000, 0.5);
    g.fillRect(34, 83, 94, 78);
    // Shield border (dark gold)
    g.fillStyle(DGOLD);
    g.fillTriangle(34, 160, 128, 160, 81, 178);
    g.fillRect(34, 82, 94, 80);
    // Shield fill (navy)
    g.fillStyle(DNAVY);
    g.fillRect(38, 86, 86, 72);
    g.fillTriangle(38, 158, 124, 158, 81, 174);
    // Shield inner border
    g.lineStyle(2, GOLD, 0.6);
    g.strokeRect(42, 90, 78, 64);

    // Shield center emblem — diamond
    g.fillStyle(GOLD, 0.3);
    g.fillTriangle(81, 96, 106, 120, 81, 144);
    g.fillTriangle(81, 96, 56, 120, 81, 144);

    // --- CROSSED SWORDS ---
    // Sword 1: top-left to bottom-right
    // Blade
    g.fillStyle(LSILV);
    for (let i = 0; i < 52; i++) {
      g.fillRect(42 + i, 92 + i, 3, 3);
    }
    // Sword 2: top-right to bottom-left
    g.fillStyle(LSILV);
    for (let i = 0; i < 52; i++) {
      g.fillRect(116 - i, 92 + i, 3, 3);
    }
    // Sword shadows
    g.fillStyle(DSILV, 0.5);
    for (let i = 0; i < 52; i++) {
      g.fillRect(43 + i, 93 + i, 2, 2);
      g.fillRect(117 - i, 93 + i, 2, 2);
    }
    // Crossguards
    g.fillStyle(GOLD);
    g.fillRect(54, 102, 20, 5);   // left sword guard
    g.fillRect(88, 102, 20, 5);   // right sword guard
    g.fillStyle(LGOLD);
    g.fillRect(55, 102, 18, 2);
    g.fillRect(89, 102, 18, 2);
    // Hilts
    g.fillStyle(DGOLD);
    g.fillRect(42, 138, 6, 12);
    g.fillRect(114, 138, 6, 12);
    // Pommels
    g.fillStyle(GOLD);
    g.fillCircle(45, 153, 5);
    g.fillCircle(117, 153, 5);

    g.generateTexture('logo', W, H);
    g.destroy();
  }

  _genCharacters() {
    const charDefs = [
      { id: 'knight',  palette: { body: 0x4466aa, accent: 0xaaccff, helm: 0x888888 } },
      { id: 'rogue',   palette: { body: 0x334433, accent: 0x88bb44, helm: 0x222222 } },
      { id: 'merchant',palette: { body: 0xbb8833, accent: 0xffdd66, helm: 0x886622 } },
      { id: 'spy',     palette: { body: 0x442244, accent: 0xcc44cc, helm: 0x221122 } },
      { id: 'bot_a',   palette: { body: 0x664422, accent: 0xcc8844, helm: 0x443322 } },
      { id: 'bot_b',   palette: { body: 0x334455, accent: 0x6688aa, helm: 0x223344 } },
    ];

    const FW = 32, FH = 48, FRAMES = 4; // idle-A, idle-B, cooperate, betray
    for (const def of charDefs) {
      if (this.textures.exists(def.id)) continue;
      // Use CanvasTexture directly — ct.context is the 2D context, ct.add() registers frames
      const ct = this.textures.createCanvas(def.id, FW * FRAMES, FH);
      const ctx = ct.context;

      for (let f = 0; f < FRAMES; f++) {
        this._drawChar(ctx, def.palette, f, f * FW, 0, FW, FH);
        ct.add(f, 0, f * FW, 0, FW, FH);
      }
      ct.refresh();
    }
  }

  _drawChar(ctx, pal, frame, ox, oy, _fw, fh) {
    const hex = n => '#' + n.toString(16).padStart(6, '0');

    // Legs
    ctx.fillStyle = hex(pal.body);
    ctx.fillRect(ox + 10, oy + 34, 5, 14);
    ctx.fillRect(ox + 17, oy + 34, 5, 14);

    // Body
    ctx.fillStyle = hex(pal.body);
    ctx.fillRect(ox + 8, oy + 18, 16, 18);

    // Accent stripe
    ctx.fillStyle = hex(pal.accent);
    ctx.fillRect(ox + 10, oy + 20, 12, 4);

    // Head
    ctx.fillStyle = '#ffcc99';
    ctx.fillRect(ox + 11, oy + 8, 10, 10);

    // Helm/hat
    ctx.fillStyle = hex(pal.helm);
    ctx.fillRect(ox + 10, oy + 5, 12, 6);

    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(ox + 13, oy + 11, 2, 2);
    ctx.fillRect(ox + 17, oy + 11, 2, 2);

    // Arms — vary by frame
    ctx.fillStyle = hex(pal.body);
    if (frame === 0) {
      // idle-A: arms at sides
      ctx.fillRect(ox + 4, oy + 20, 5, 10);
      ctx.fillRect(ox + 23, oy + 20, 5, 10);
    } else if (frame === 1) {
      // idle-B: arms slightly raised
      ctx.fillRect(ox + 4, oy + 18, 5, 10);
      ctx.fillRect(ox + 23, oy + 18, 5, 10);
    } else if (frame === 2) {
      // cooperate: right arm extended forward (handshake)
      ctx.fillRect(ox + 4, oy + 20, 5, 10);
      ctx.fillRect(ox + 23, oy + 18, 9, 5);
      // open hand
      ctx.fillStyle = '#ffcc99';
      ctx.fillRect(ox + 29, oy + 17, 3, 6);
    } else if (frame === 3) {
      // betray: right arm raised (slash)
      ctx.fillRect(ox + 4, oy + 20, 5, 10);
      ctx.fillRect(ox + 23, oy + 12, 5, 12);
      // dagger
      ctx.fillStyle = '#cccccc';
      ctx.fillRect(ox + 26, oy + 6, 3, 8);
    }
  }

  _genAnimations() {
    const charIds = ['knight', 'rogue', 'merchant', 'spy', 'bot_a', 'bot_b'];
    for (const id of charIds) {
      this.anims.create({
        key: id + '_idle',
        frames: this.anims.generateFrameNumbers(id, { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1,
      });
      this.anims.create({
        key: id + '_cooperate',
        frames: this.anims.generateFrameNumbers(id, { frames: [2] }),
        frameRate: 4,
        repeat: 0,
      });
      this.anims.create({
        key: id + '_betray',
        frames: this.anims.generateFrameNumbers(id, { frames: [3] }),
        frameRate: 4,
        repeat: 0,
      });
    }
  }
}
