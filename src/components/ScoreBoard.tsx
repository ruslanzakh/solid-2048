import { UndoButton } from './UndoButton';

type ScoreBoardProps = {
  score: number;
  resetGame: () => void;
  undoMove: () => void;
  canUndo: boolean;
};

export function ScoreBoard(props: ScoreBoardProps) {
  return (
    <div class="flex justify-between items-center mb-4">
      <div class="bg-gray-300 dark:bg-gray-700 rounded p-2 transition-colors">
        <div class="text-xs sm:text-sm font-semibold dark:text-gray-200">Score</div>
        <div class="text-lg sm:text-xl font-bold dark:text-white">{props.score}</div>
      </div>
      <div class="flex gap-2">
        <UndoButton canUndo={props.canUndo} onUndo={props.undoMove} />
        <button 
          onClick={props.resetGame}
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm sm:text-base py-1 sm:py-2 px-2 sm:px-4 rounded transition-colors"
        >
          New Game
        </button>
      </div>
    </div>
  );
} 