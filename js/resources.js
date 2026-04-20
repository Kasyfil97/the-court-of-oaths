const STARTING_RESOURCES = { gold: 30, trust: 30, honor: 30 };
const MAX_RESOURCE = 120;
const MIN_RESOURCE = 0;

// Returns { playerDelta, oppDelta } — plain objects with gold/trust/honor keys.
// Deltas are applied then clamped by the caller.
function OUTCOME(playerMove, oppMove, playerClass) {
  const playerDelta = { gold: 0, trust: 0, honor: 0 };
  const oppDelta    = { gold: 0, trust: 0, honor: 0 };

  if (playerMove === 'C' && oppMove === 'C') {
    playerDelta.trust = 2; playerDelta.gold = 1;
    oppDelta.trust    = 2; oppDelta.gold    = 1;
  } else if (playerMove === 'D' && oppMove === 'D') {
    playerDelta.trust = -2; playerDelta.gold = -1;
    oppDelta.trust    = -2; oppDelta.gold    = -1;
  } else if (playerMove === 'D' && oppMove === 'C') {
    // Player betrays cooperating opponent
    playerDelta.gold  =  5; playerDelta.honor = -3;
    oppDelta.gold     = -3;
  } else {
    // Player cooperates, opponent betrays
    playerDelta.gold  = -3;
    oppDelta.gold     =  5; oppDelta.honor = -3;
  }

  // Class passive modifiers
  if (playerClass === 'knight' && playerMove === 'C') {
    playerDelta.honor += 1;
  }
  if (playerClass === 'rogue' && playerMove === 'D') {
    playerDelta.gold += 2;
  }
  if (playerClass === 'merchant') {
    playerDelta.gold = Math.round(playerDelta.gold * 1.5);
  }
  // Spy ability is visual only (peek) — no delta modifier

  return { playerDelta, oppDelta };
}

function clampResources(res) {
  res.gold  = Math.max(MIN_RESOURCE, Math.min(MAX_RESOURCE, res.gold));
  res.trust = Math.max(MIN_RESOURCE, Math.min(MAX_RESOURCE, res.trust));
  res.honor = Math.max(MIN_RESOURCE, Math.min(MAX_RESOURCE, res.honor));
  return res;
}

function applyDelta(res, delta) {
  return clampResources({
    gold:  res.gold  + delta.gold,
    trust: res.trust + delta.trust,
    honor: res.honor + delta.honor,
  });
}

// Returns a win-condition string or null.
function checkWinConditions(state) {
  const { player, opponents, neverBetrayed, turnNumber, opponentCount } = state;

  // Economy
  if (player.gold >= 100) return 'economy';

  // Domination — need min(2, opponentCount) eliminated
  const eliminated = opponents.filter(o => o.gold <= 0).length;
  if (eliminated >= Math.min(2, opponentCount)) return 'domination';

  // Diplomacy — Trust >= 70 with min(3, opponentCount) opponents
  const trusted = opponents.filter(o => o.trust >= 70).length;
  if (trusted >= Math.min(3, opponentCount)) return 'diplomacy';

  // Honor run — never betrayed, 15+ turns, Honor >= 60
  if (neverBetrayed && turnNumber >= 15 && player.honor >= 60) return 'honor';

  return null;
}
