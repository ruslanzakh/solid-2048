type GameOverProps = {
  isGameOver: boolean;
};

export function GameOver(props: GameOverProps) {
  return (
    <>
      {props.isGameOver && (
        <div class="mt-4 p-2 bg-red-100 text-red-700 rounded text-center font-bold">
          Game Over!
        </div>
      )}
    </>
  );
} 