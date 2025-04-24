type GameOverProps = {
  isGameOver: boolean;
};

export function GameOver(props: GameOverProps) {
  return (
    <>
      {props.isGameOver && (
        <div class="mt-4 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded text-center font-bold transition-colors">
          Game Over!
        </div>
      )}
    </>
  );
} 