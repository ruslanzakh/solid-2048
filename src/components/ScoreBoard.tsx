type ScoreBoardProps = {
  score: number;
  resetGame: () => void;
};

export function ScoreBoard(props: ScoreBoardProps) {
  return (
    <div class="flex justify-between mb-4">
      <div class="bg-gray-300 dark:bg-gray-700 rounded p-2 transition-colors">
        <div class="text-sm font-semibold dark:text-gray-200">Score</div>
        <div class="text-xl font-bold dark:text-white">{props.score}</div>
      </div>
      <button 
        onClick={props.resetGame}
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        New Game
      </button>
    </div>
  );
} 