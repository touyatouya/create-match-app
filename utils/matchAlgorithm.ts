import { Player, Court, Match } from '../types';

// プレイヤー同士の対戦履歴を追跡するマップを生成
export const createPairingHistoryMap = (players: Player[]): Record<string, Record<string, number>> => {
  const pairingHistory: Record<string, Record<string, number>> = {};
  
  players.forEach(player => {
    pairingHistory[player.id] = {};
    players.forEach(partner => {
      if (player.id !== partner.id) {
        pairingHistory[player.id][partner.id] = 0;
      }
    });
  });
  
  return pairingHistory;
};

// 過去の試合から対戦履歴を更新
export const updatePairingHistory = (
  pairingHistory: Record<string, Record<string, number>>,
  matches: Match[]
): Record<string, Record<string, number>> => {
  matches.forEach(match => {
    const players = match.players;
    
    // ダブルスなので1コートに4人
    if (players.length === 4) {
      // チーム1: players[0], players[1]
      // チーム2: players[2], players[3]
      incrementPairingCount(pairingHistory, players[0].id, players[1].id);
      incrementPairingCount(pairingHistory, players[2].id, players[3].id);
    }
  });
  
  return pairingHistory;
};

// 特定のペアの対戦回数を増やす
const incrementPairingCount = (
  pairingHistory: Record<string, Record<string, number>>,
  player1Id: string,
  player2Id: string
): void => {
  if (pairingHistory[player1Id] && pairingHistory[player1Id][player2Id] !== undefined) {
    pairingHistory[player1Id][player2Id]++;
  }
  
  if (pairingHistory[player2Id] && pairingHistory[player2Id][player1Id] !== undefined) {
    pairingHistory[player2Id][player1Id]++;
  }
};

// 最適な試合の組み合わせを生成
export const generateOptimalMatches = (
  activePlayers: Player[],
  courts: Court[]
): { matches: Match[]; restingPlayers: Player[] } => {
  // アクティブなプレイヤーのコピーを作成
  const players = [...activePlayers];
  const matches: Match[] = [];
  const pairingHistory = createPairingHistoryMap(players);
  
  // コートの数に基づいて試合を作成
  // 各コートには4人（ダブルスなので）必要
  const maxPossibleCourts = Math.min(courts.length, Math.floor(players.length / 4));
  const restingPlayers: Player[] = [];
  
  // 試合に参加できないプレイヤーを休憩リストに追加
  if (players.length > maxPossibleCourts * 4) {
    // 余ったプレイヤーをrestingPlayersに移動
    while (players.length > maxPossibleCourts * 4) {
      const randomIndex = Math.floor(Math.random() * players.length);
      const player = players.splice(randomIndex, 1)[0];
      player.isResting = true;
      restingPlayers.push(player);
    }
  }
  
  // 使用可能なコート数だけ試合を作成
  for (let i = 0; i < maxPossibleCourts; i++) {
    if (players.length < 4) break; // プレイヤーが足りない場合は終了
    
    const court = courts[i];
    const matchPlayers: Player[] = [];
    
    // 最初のプレイヤーをランダムに選択
    const firstPlayerIndex = Math.floor(Math.random() * players.length);
    const firstPlayer = players.splice(firstPlayerIndex, 1)[0];
    firstPlayer.isResting = false;
    matchPlayers.push(firstPlayer);
    
    // 最初のプレイヤーとのペアをこれまでの対戦回数が最小のプレイヤーから選ぶ
    let bestPartnerIndex = 0;
    let minPairings = Number.MAX_SAFE_INTEGER;
    
    for (let j = 0; j < players.length; j++) {
      const potentialPartner = players[j];
      const pairingCount = pairingHistory[firstPlayer.id][potentialPartner.id] || 0;
      
      if (pairingCount < minPairings) {
        minPairings = pairingCount;
        bestPartnerIndex = j;
      }
    }
    
    const partner = players.splice(bestPartnerIndex, 1)[0];
    partner.isResting = false;
    matchPlayers.push(partner);
    
    // 残り2人をランダムに選択（より洗練されたアルゴリズムを使うことも可能）
    for (let j = 0; j < 2; j++) {
      if (players.length === 0) break;
      const randomIndex = Math.floor(Math.random() * players.length);
      const player = players.splice(randomIndex, 1)[0];
      player.isResting = false;
      matchPlayers.push(player);
    }
    
    // 試合を作成
    if (matchPlayers.length === 4) {
      matches.push({
        id: `match-${Date.now()}-${i}`,
        courtId: court.id,
        players: matchPlayers
      });
      
      // 対戦履歴を更新
      incrementPairingCount(pairingHistory, matchPlayers[0].id, matchPlayers[1].id);
      incrementPairingCount(pairingHistory, matchPlayers[2].id, matchPlayers[3].id);
    }
  }
  
  // 残ったプレイヤーを休憩リストに追加
  players.forEach(player => {
    player.isResting = true;
    restingPlayers.push(player);
  });
  
  return { matches, restingPlayers };
};