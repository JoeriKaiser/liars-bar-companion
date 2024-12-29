export interface Player {
  id: string;
  username: string;
  bulletPosition: number;
  chamberPosition: number;
  isAlive: boolean;
  isReady: boolean;
}

export interface GameState {
  isGameStarted: boolean;
  players: Player[];
  tableCard: 'PIQUE' | 'COEUR' | 'TREFLE';
  roundNumber: number;
  lastAction?: {
    player: string;
    result: 'SURVIVED' | 'DIED';
    chamber: number;
    target?: string;
  };
  isHellMode: boolean;
}