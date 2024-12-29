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
  tableCard: 'Q' | 'J' | 'K'; 
  roundNumber: number;
  lastAction?: {
    player: string;
    result: 'SURVIVED' | 'DIED';
    chamber: number;
    target?: string;
  };
  isHellMode: boolean;
}