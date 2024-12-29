import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Player, GameState } from './types';
import dotenv from 'dotenv';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

const tableCards = ['Q', 'J', 'K'] as const;

const gameState: GameState = {
  isGameStarted: false,
  players: [],
  tableCard: 'Q',
  roundNumber: 1,
  isHellMode: false
};

function resetGame() {
  gameState.isGameStarted = false;
  gameState.roundNumber = 1;
  gameState.tableCard = 'Q';
  gameState.lastAction = undefined;
  
  gameState.players = gameState.players.map(player => ({
    ...player,
    bulletPosition: Math.floor(Math.random() * 6) + 1,
    chamberPosition: 0,
    isAlive: true,
    isReady: false
  }));
  
  io.emit('gameStateUpdate', gameState);
}

function startNewRound() {
  gameState.roundNumber++;
  gameState.tableCard = tableCards[Math.floor(Math.random() * tableCards.length)];
  io.emit('gameStateUpdate', gameState);
}

function resetGun(playerId: string) {
  const player = gameState.players.find(p => p.id === playerId);
  if (player) {
    player.bulletPosition = Math.floor(Math.random() * 6) + 1;
    player.chamberPosition = 0;
  }
}

io.on('connection', (socket) => {
  socket.emit('gameStateUpdate', gameState);

  socket.on('joinGame', (username: string) => {
    const player: Player = {
      id: socket.id,
      username,
      bulletPosition: Math.floor(Math.random() * 6) + 1,
      chamberPosition: 0,
      isAlive: true,
      isReady: false
    };
    
    gameState.players.push(player);
    io.emit('gameStateUpdate', gameState);
  });

  socket.on('toggleReady', () => {
    const player = gameState.players.find(p => p.id === socket.id);
    if (player) {
      player.isReady = !player.isReady;
      
      if (gameState.players.length >= 2 && gameState.players.every(p => p.isReady)) {
        gameState.isGameStarted = true;
        gameState.tableCard = tableCards[Math.floor(Math.random() * tableCards.length)];
      }
      
      io.emit('gameStateUpdate', gameState);
    }
  });

  socket.on('pullTrigger', () => {
    const player = gameState.players.find(p => p.id === socket.id);
    if (player && player.isAlive) {
      player.chamberPosition++;
      
      if (player.chamberPosition === player.bulletPosition) {
        player.isAlive = false;
        gameState.lastAction = {
          player: socket.id,
          result: 'DIED',
          chamber: player.chamberPosition
        };
      } else {
        gameState.lastAction = {
          player: socket.id,
          result: 'SURVIVED',
          chamber: player.chamberPosition
        };
      }
      
      io.emit('gameStateUpdate', gameState);
    }
  });

socket.on('shootPlayer', (targetId: string) => {
  const target = gameState.players.find(p => p.id === targetId);
  const shooter = gameState.players.find(p => p.id === socket.id);
  
  if (target && target.isAlive && shooter && shooter.isAlive) {
    shooter.chamberPosition++;
    
    if (shooter.chamberPosition === shooter.bulletPosition) {
      target.isAlive = false;
      gameState.lastAction = {
        player: socket.id,
        target: targetId,
        result: 'DIED',
        chamber: shooter.chamberPosition
      };
      resetGun(socket.id);
    } else {
      gameState.lastAction = {
        player: socket.id,
        target: targetId,
        result: 'SURVIVED',
        chamber: shooter.chamberPosition
      };
    }
    
    io.emit('gameStateUpdate', gameState);
  }
});

  socket.on('nextRound', () => {
    startNewRound();
  });

  socket.on('toggleHellMode', () => {
    if (!gameState.isGameStarted) {
      gameState.isHellMode = !gameState.isHellMode;
      io.emit('gameStateUpdate', gameState);
    }
  });

  socket.on('resetGame', () => {
    resetGame();
  });

  socket.on('disconnect', () => {
    gameState.players = gameState.players.filter(p => p.id !== socket.id);
    io.emit('gameStateUpdate', gameState);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});