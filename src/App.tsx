import { onMount } from 'solid-js'
import { Board } from './components/Board'
import { GameOver } from './components/GameOver'
import { ScoreBoard } from './components/ScoreBoard'
import { useGameStore } from './store/gameStore'

function App() {
  const gameStore = useGameStore();
  const { state, initGame, resetGame, handleKeyDown } = gameStore;

  // Game initialization
  onMount(() => {
    // Add initial tiles
    initGame();

    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="p-6 bg-white rounded-lg shadow-lg">
        <h1 class="text-4xl font-bold text-center mb-4">2048</h1>
        <ScoreBoard score={state.score} resetGame={resetGame} />
        <Board board={state.board} />
        <GameOver isGameOver={state.gameOver} />
        <div class="mt-4 text-gray-600 text-sm">
          Use arrow keys to move the tiles.
        </div>
      </div>
    </div>
  )
}

export default App
