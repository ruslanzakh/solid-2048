import { onMount } from 'solid-js'
import { Board } from './components/Board'
import { GameOver } from './components/GameOver'
import { ScoreBoard } from './components/ScoreBoard'
import { ThemeToggle } from './components/ThemeToggle'
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
    <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-4xl font-bold text-center text-gray-900 dark:text-white">2048</h1>
          <ThemeToggle />
        </div>
        <ScoreBoard score={state.score} resetGame={resetGame} />
        <Board board={state.board} />
        <GameOver isGameOver={state.gameOver} />
        <div class="mt-4 text-gray-600 dark:text-gray-300 text-sm transition-colors">
          Use arrow keys to move the tiles.
        </div>
      </div>
    </div>
  )
}

export default App
