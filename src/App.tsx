import { onMount, createSignal, createEffect } from 'solid-js'
import { Board } from './components/Board'
import { GameOver } from './components/GameOver'
import { ScoreBoard } from './components/ScoreBoard'
import { ThemeToggle } from './components/ThemeToggle'
import { Controls } from './components/Controls'
import { useGameStore } from './store/gameStore'
import { useSwipe, Direction } from './hooks/useSwipe'

function App() {
  const gameStore = useGameStore();
  const { state, initGame, resetGame, handleKeyDown } = gameStore;
  const [boardRef, setBoardRef] = createSignal<HTMLDivElement | null>(null);

  // Function for handling movements (from buttons or swipes)
  const handleMove = (direction: Direction) => {
    if (!direction) return;
    
    let key = '';
    switch (direction) {
      case 'up':
        key = 'ArrowUp';
        break;
      case 'down':
        key = 'ArrowDown';
        break;
      case 'left':
        key = 'ArrowLeft';
        break;
      case 'right':
        key = 'ArrowRight';
        break;
    }
    
    // Create a fake keyboard event
    const event = new KeyboardEvent('keydown', { key });
    handleKeyDown(event);
  };
  
  // Initialize swipes using createEffect,
  // to react to changes in boardRef
  createEffect(() => {
    useSwipe({
      onSwipe: handleMove,
      element: boardRef()
    });
  });

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
    <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors p-4">
      <div class="w-full max-w-md p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white">2048</h1>
          <ThemeToggle />
        </div>
        <ScoreBoard score={state.score} resetGame={resetGame} />
        <div ref={setBoardRef} class="touch-none">
          <Board board={state.board} newTile={state.newTile} />
        </div>
        <GameOver isGameOver={state.gameOver} />
        
        {/* Add controls for mobile devices */}
        <Controls onMove={handleMove} />
        
        <div class="mt-4 text-gray-600 dark:text-gray-300 text-sm transition-colors">
          <p class="hidden md:block">Use arrow keys to move the tiles.</p>
          <p class="md:hidden">Swipe or use buttons to move the tiles.</p>
        </div>
      </div>
    </div>
  )
}

export default App
