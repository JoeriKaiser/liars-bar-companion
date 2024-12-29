import { useState, useEffect } from 'react';
import { socket } from './socket';
import { GameState } from './types';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [gameState, setGameState] = useState<GameState>({
    isGameStarted: false,
    players: [],
    isHellMode: false,
    roundNumber: 1,
    tableCard: 'Q'
  });

  useEffect(() => {
    socket.on('gameStateUpdate', setGameState);
    return () => { socket.off('gameStateUpdate'); };
  }, []);

  const LanguageSwitcher = () => (
    <>
    {!gameState.isGameStarted ?
    (
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => i18n.changeLanguage('en')}
          className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-red-500' : 'bg-gray-700'}`}
          >
          🇬🇧 EN
        </button>
        <button
          onClick={() => i18n.changeLanguage('fr')}
          className={`px-2 py-1 rounded ${i18n.language === 'fr' ? 'bg-red-500' : 'bg-gray-700'}`}
          >
          🇫🇷 FR
        </button>
      </div>
    ) : null}
    </>
  );

  const handleJoinGame = () => {
    if (username.trim()) {
      socket.emit('joinGame', username);
      setIsJoined(true);
    }
  };

  const otherPlayers = gameState.players.filter(
    p => p.id !== socket.id && p.isAlive
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <LanguageSwitcher />
      {!isJoined ? (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
          <h1 className="text-4xl font-bold text-red-500">{t('game.title')}</h1>
          <div className="w-full max-w-sm space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('game.enterName')}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-red-500"
            />
            <button
              onClick={handleJoinGame}
              className="w-full py-3 rounded-lg bg-red-500 hover:bg-red-600 transition-colors font-bold"
            >
              {t('game.joinGame')}
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto space-y-6">
          {gameState.isGameStarted && (
            <div className="bg-gray-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">{t('game.round', { number: gameState.roundNumber })}</span>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => socket.emit('resetGame')}
                    className="px-2 py-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-sm"
                    title={t('game.reset')}
                  >
                    🔄
                  </button>
                  <span className={`px-3 py-1 rounded-full ${gameState.isHellMode ? 'bg-red-500' : 'bg-green-500'}`}>
                    {t(gameState.isHellMode ? 'game.hellMode' : 'game.normalMode')}
                  </span>
                </div>
              </div>
              <div className="text-center py-2 bg-gray-700 rounded-lg">
                <span className="text-sm uppercase tracking-wide">{t('game.tableCard')}</span>
                <div className="text-3xl font-bold text-red-500">{gameState.tableCard}</div>
              </div>
              <button 
                onClick={() => socket.emit('nextRound')}
                className="w-full py-2 rounded bg-blue-500 hover:bg-blue-600"
              >
                {t('game.nextRound')}
              </button>
            </div>
          )}

          <div className="space-y-4">
            {!gameState.isGameStarted && gameState.players.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg">{t('game.gameMode')}:</span>
                  <button 
                    onClick={() => socket.emit('toggleHellMode')}
                    className={`px-4 py-2 rounded-lg ${
                      gameState.isHellMode 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {t(gameState.isHellMode ? 'game.hellMode' : 'game.normalMode')}
                  </button>
                </div>
              </div>
            )}
            {gameState.players.map((player) => (
              <div 
                key={player.id}
                className={`bg-gray-800 rounded-xl p-4 ${!player.isAlive ? 'opacity-50' : ''}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold">
                    {player.username} 
                    {player.id === socket.id && t('game.you')}
                  </h3>
                  {!player.isAlive && (
                    <span className="text-red-500 text-2xl">☠️</span>
                  )}
                </div>

                <div className="flex gap-1 mb-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded ${
                        i < player.chamberPosition 
                          ? 'bg-red-500' 
                          : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>

                {player.id === socket.id && player.isAlive && gameState.isGameStarted && (
                  <div className="space-y-3">
                    <button 
                      onClick={() => socket.emit('pullTrigger')}
                      className="w-full py-3 rounded-lg bg-red-500 hover:bg-red-600 font-bold"
                    >
                      {t('game.actions.pullTrigger')}
                    </button>

                    {otherPlayers.length > 0 && (
                      <div className="flex gap-2">
                        <select
                          value={selectedTarget}
                          onChange={(e) => setSelectedTarget(e.target.value)}
                          className="flex-1 px-3 rounded-lg bg-gray-700 border border-gray-600"
                        >
                          <option value="">{t('game.actions.selectTarget')}</option>
                          {otherPlayers.map(p => (
                            <option key={p.id} value={p.id}>{p.username}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            if (selectedTarget) {
                              socket.emit('shootPlayer', selectedTarget);
                              setSelectedTarget('');
                            }
                          }}
                          disabled={!selectedTarget}
                          className="px-4 rounded-lg bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50"
                        >
                          {t('game.actions.shoot')}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {!gameState.isGameStarted && player.id === socket.id && (
                  <button
                    onClick={() => socket.emit('toggleReady')}
                    className={`w-full py-2 rounded-lg ${
                      player.isReady 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-yellow-500 hover:bg-yellow-600'
                    }`}
                  >
                    {t(player.isReady ? 'game.actions.ready' : 'game.actions.readyUp')}
                  </button>
                )}
              </div>
            ))}
          </div>

          {gameState.lastAction && (
            <div className="bg-gray-800 rounded-xl p-4 text-center animate-fade-in">
              <p className="text-sm">
                {gameState.lastAction.target
                  ? t(
                      `game.results.shot${gameState.lastAction.result}`, {
                        shooter: gameState.players.find(p => p.id === gameState.lastAction?.player)?.username,
                        target: gameState.players.find(p => p.id === gameState.lastAction?.target)?.username,
                        chamber: gameState.lastAction.chamber
                      }
                    )
                  : t(
                      `game.results.${gameState.lastAction.result.toLowerCase()}`, {
                        player: gameState.players.find(p => p.id === gameState.lastAction?.player)?.username,
                        chamber: gameState.lastAction.chamber
                      }
                    )
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;