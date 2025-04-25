import { createStore } from "solid-js/store";
import { moveLeft, moveRight, moveUp, moveDown, addRandomTile, checkGameOver } from "../logic/gameLogic";
import { batch } from "solid-js";
// @ts-ignore
import { koggy, pikachu, cool, wink, winner, jump, unicorn } from '../logic/easterEggs';

export type GameState = {
  board: number[][];
  score: number;
  gameOver: boolean;
  newTile: {row: number, col: number};
  has64Appeared: boolean;
  has128Appeared: boolean;
  has256Appeared: boolean;
  has512Appeared: boolean;
  has1024Appeared: boolean;
  has2048Appeared: boolean;
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
    gameOver: false,
    newTile: {row: -1, col: -1},
    has64Appeared: false,
    has128Appeared: false,
    has256Appeared: false,
    has512Appeared: false,
    has1024Appeared: false,
    has2048Appeared: false
  });

  const checkEasterEggs = () => {
    if(!checkFor64Tile()) return;
    if(!checkFor128Tile()) return;
    if(!checkFor256Tile()) return;
    if(!checkFor512Tile()) return;
    if(!checkFor1024Tile()) return;
    if(!checkFor2048Tile()) return;
  };

  const setBoard = (board: number[][] | ((prev: number[][]) => number[][])) => {
    setState("board", board);
    
    checkEasterEggs();
  };

  const setScore = (score: number | ((prev: number) => number)) => {
    setState("score", score);
  };
  
  // Общая функция для проверки наличия плитки определенного значения
  const hasTileWithValue = (value: number): boolean => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (state.board[row][col] === value) {
          return true;
        }
      }
    }
    return false;
  };
  
  // Функция для проверки наличия плитки 64
  const checkFor64Tile = () => {
    if (state.has64Appeared) return true;
    
    if (hasTileWithValue(64)) {
      setState('has64Appeared', true);
      koggy();
      return true
    }
    return false
  };
  
  const checkFor128Tile = () => {
    if (state.has128Appeared) return true;
    
    if (hasTileWithValue(128)) {
      setState('has128Appeared', true);
      cool();
      return true
    }
    return false
  };
  
  const checkFor256Tile = () => {
    if (state.has256Appeared) return true;
    
    if (hasTileWithValue(256)) {
      setState('has256Appeared', true);
      wink();
      return true
    }
    return false
  };

  const checkFor512Tile = () => {
    if (state.has512Appeared) return true;
    
    if (hasTileWithValue(512)) {
      setState('has512Appeared', true);
      winner();
      return true
    }
    return false
  };

  const checkFor1024Tile = () => {
    if (state.has1024Appeared) return true;
    
    if (hasTileWithValue(1024)) {
      setState('has1024Appeared', true);
      jump();
      return true
    }
    return false
  };

  const checkFor2048Tile = () => {
    if (state.has2048Appeared) return true;
    
    if (hasTileWithValue(2048)) {
      setState('has2048Appeared', true);
      unicorn();
      return true
    }
    return false
  };

  // Adds a random tile (2 or 4) to an empty cell
  const addRandomTileInternal = () => {
    setState("newTile", {row: -1, col: -1});
    
    const newTilePosition = addRandomTile(state.board, setBoard);
    
    if (newTilePosition) {
      setState("newTile", newTilePosition);
    }
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
    batch(() => {
      setState({
        board: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        score: 0,
        gameOver: false,
        newTile: {row: -1, col: -1},
        has64Appeared: false,
        has128Appeared: false,
        has256Appeared: false,
        has512Appeared: false,
        has1024Appeared: false,
        has2048Appeared: false
      });
    
      addRandomTileInternal();
      addRandomTileInternal();
    });
  };

  // Reset the game
  const resetGame = () => {
    initGame();
    pikachu();
  };

  // Handle key press
  const handleKeyDown = (e: KeyboardEvent) => {
    if (state.gameOver) return;

    let moved = false;

    batch(() => {
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
    });
  };

  // Return state and methods to work with it
  return {
    state,
    initGame,
    resetGame,
    handleKeyDown
  };
}; 