import { createStore } from "solid-js/store";
import { moveLeft, moveRight, moveUp, moveDown, addRandomTile, checkGameOver } from "../logic/gameLogic";
export type GameState = {
  board: number[][];
  score: number;
  gameOver: boolean;
};

export const useGameStore = () => {
  // Initial game state
  const [state, setState] = createStore<GameState>({
    board: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    score: 0,
    gameOver: false
  });

  
  const setBoard = (board: number[][] | ((prev: number[][]) => number[][])) => {
    setState("board", board);
  };

  const setScore = (score: number | ((prev: number) => number)) => {
    setState("score", score);
  };

  // Adds a random tile (2 or 4) to an empty cell
  const addRandomTileInternal = () => {
    addRandomTile(state.board, setBoard);
  };

  // Check if the game is over
  const checkGameOverInternal = () => {
    const isGameOver = checkGameOver(state.board);
    if (isGameOver) {
      setState("gameOver", true);
    }
    return isGameOver;
  };

  // Initialize the game
  const initGame = () => {
    addRandomTileInternal();
    addRandomTileInternal();
  };

  // Reset the game
  const resetGame = () => {
    setState({
      board: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      score: 0,
      gameOver: false
    });
    
    addRandomTileInternal();
    addRandomTileInternal();
  };

  // Handle key press
  const handleKeyDown = (e: KeyboardEvent) => {
    if (state.gameOver) return;

    let moved = false;

    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        moved = moveUp(state.board, setBoard, setScore);
        break;
      case 'ArrowDown':
        e.preventDefault();
        moved = moveDown(state.board, setBoard, setScore);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moved = moveLeft(state.board, setBoard, setScore);
        break;
      case 'ArrowRight':
        e.preventDefault();
        moved = moveRight(state.board, setBoard, setScore);
        break;
      default:
        return; // Ignore other keys
    }

    if (moved) {
      addRandomTileInternal();
      checkGameOverInternal();
    }
  };

  // Return state and methods to work with it
  return {
    state,
    initGame,
    resetGame,
    handleKeyDown
  };
}; 