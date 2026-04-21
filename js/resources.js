const STARTING_RESOURCES = { gold: 20, trust: 30, honor: 30 };
const MAX_RESOURCE = 120;
const MIN_RESOURCE = 0;

// Economic scarcity: Calculate gold multiplier based on total circulation
// Higher total gold in play = less value per gold (inflation)
function getGoldMultiplier(totalGoldInPlay) {
  // Base total gold at game start: 20 gold × (player + 3 opponents) = 80 gold
  const baseTotal = 80;
  if (totalGoldInPlay <= baseTotal) return 1.0; // Normal value
  if (totalGoldInPlay > baseTotal * 1.5) return 0.7; // Severe inflation: 30% less value
  // Linear scaling between 0.7 and 1.0
  return 1.0 - (0.3 * ((totalGoldInPlay - baseTotal) / (baseTotal * 0.5)));
}

// Calculate total gold in circulation
function calculateTotalGoldInPlay(gameState) {
  let total = gameState.player.gold;
  for (const opp of gameState.opponents) {
    total += opp.gold;
  }
  return total;
}

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

  // Economy — Increased from 100 to 150 (scarcity makes it harder)
  if (player.gold >= 150) return 'economy';

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
