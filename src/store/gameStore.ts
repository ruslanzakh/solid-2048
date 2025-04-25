import { createStore } from "solid-js/store";
import { moveLeft, moveRight, moveUp, moveDown, addRandomTile, checkGameOver } from "../logic/gameLogic";
import { batch } from "solid-js";
// @ts-ignore
import { koggy, pikachu, cool, wink, winner, jump, unicorn, joker, doggy } from '../logic/easterEggs';

// Тип для сохранения полного состояния игры
type GameHistoryState = {
  board: number[][];
  score: number;
  newTile: {row: number, col: number};
};

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
  // История предыдущих состояний
  history: GameHistoryState[];
  // Можно ли отменить ход
  canUndo: boolean;
  // Счетчик для чередования пасхалок при отмене хода
  undoCounter: number;
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
    has2048Appeared: false,
    history: [],
    canUndo: false,
    undoCounter: 0
  });

  const checkEasterEggs = () => {
    if(!checkFor64Tile()) return;
    if(!checkFor128Tile()) return;
    if(!checkFor256Tile()) return;
    if(!checkFor512Tile()) return;
    if(!checkFor1024Tile()) return;
    if(!checkFor2048Tile()) return;
  };

  // Function for saving the current state to history before changing
  const saveStateToHistory = () => {
    // Create a copy of the current state board
    const currentBoard = state.board.map(row => [...row]);
    
    // Create a new history object
    const historyItem: GameHistoryState = {
      board: currentBoard,
      score: state.score,
      newTile: {...state.newTile}
    };
    
    // Add to history, limiting it to 5 last states
    const newHistory = [historyItem, ...state.history];
    if (newHistory.length > 5) {
      newHistory.pop(); // Remove the oldest state if there are more than 5
    }
    
    setState('history', newHistory);
    setState('canUndo', true);
  };
  
  // Function for returning to the previous state
  const undoMove = () => {
    if (!state.canUndo || state.history.length === 0) return false;
    
    // Get the last saved state
    const lastState = state.history[0];
    const newHistory = state.history.slice(1);
    
    if (state.undoCounter % 2 === 0) {
      joker();
    } else {
      doggy();
    }
    
    // Increase the counter of clicks
    
    // Update the game state
    batch(() => {
      setState('undoCounter', state.undoCounter + 1);
      setState('board', lastState.board.map(row => [...row]));
      setState('score', lastState.score);
      setState('newTile', {...lastState.newTile});
      setState('history', newHistory);
      setState('canUndo', newHistory.length > 0);
    });
    
    return true;
  };

  const setBoard = (board: number[][] | ((prev: number[][]) => number[][])) => {
    // Теперь мы не сохраняем состояние здесь, а делаем это явно в функции makeMove
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

  // Make a move
  const makeMove = (moveFn: (board: number[][], setBoard: any, setScore: any) => boolean) => {
    // Save the current state before making the move
    saveStateToHistory();
    
    // Perform the move
    const moved = moveFn(state.board, setBoard, setScore);
    
    if (moved) {
      addRandomTileInternal();
      checkGameOverInternal();
    }
    
    return moved;
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
        has2048Appeared: false,
        history: [],
        canUndo: false,
        undoCounter: 0
      });
    
      // Add initial tiles without saving history
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

    batch(() => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          makeMove(moveUp);
          break;
        case 'ArrowDown':
          e.preventDefault();
          makeMove(moveDown);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          makeMove(moveLeft);
          break;
        case 'ArrowRight':
          e.preventDefault();
          makeMove(moveRight);
          break;
        case 'Backspace':  // Add support for undoing a move through the Backspace key
          e.preventDefault();
          undoMove();
          return;
        default:
          return; // Ignore other keys
      }
    });
  };

  // Return state and methods to work with it
  return {
    state,
    initGame,
    resetGame,
    handleKeyDown,
    undoMove
  };
}; 